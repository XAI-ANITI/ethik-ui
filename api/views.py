import json

from django.http import HttpResponseBadRequest, JsonResponse
import ethik
import pandas as pd
from sklearn import metrics

from .utils import fig_to_json, interp_color, read_ds

# TODO: let the user choose
METRIC = metrics.accuracy_score
N_SAMPLES = 30


def check_dataset(request):
    try:
        body = json.loads(request.body)
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(e)

    try:
        true_y_col = body["true_y_col"]
        pred_y_cols = set(body["pred_y_cols"])
        quantitative_x_cols = set(body["quantitative_x_cols"])
        qualitative_x_cols = set(body["qualitative_x_cols"])
    except KeyError as e:
        return HttpResponseBadRequest(
            f"Cannot find key '{e}'"
        )

    errors = []

    # TODO: check types (with jsonschema?)

    if not pred_y_cols:
        errors.append("pred_y_cols must not be empty")

    if true_y_col in pred_y_cols:
        errors.append(
            f"True y col '{true_y_col}' cannot be one of the "
            f"pred y cols: {pred_y_cols}"
        )

    features_cols = quantitative_x_cols | qualitative_x_cols
    if not features_cols:
        errors.append(
            "One of quantitative_x_cols and quantitative_x_cols must not be empty"
        )

    if quantitative_x_cols & qualitative_x_cols:
        errors.append(
            "These features cannot be both quantitative and qualitative: "
            (quantitative_x_cols & qualitative_x_cols)
        )

    if true_y_col in features_cols:
        errors.append(
            f"True y col '{true_y_col}' cannot be one of the "
            f"features cols: {features_cols}"
        )

    if features_cols & pred_y_cols:
        errors.append(
            f"Pred y cols {pred_y_cols} cannot share elements with "
            f"features cols {features_cols}"
        )

    return JsonResponse(dict(errors=errors))


def get_features_from_request(request):
    return (
        json.loads(request.FILES["quantitative_cols"].read().decode()),
        json.loads(request.FILES["qualitative_cols"].read().decode())
    )


def parse_plot_request(request):
    f = request.FILES["file"]
    pred_y_cols = request.FILES["pred_y_cols"]
    true_y_col = request.POST.get("true_y_col")
    is_regression = "is_regression" in request.POST

    quantitative_cols, qualitative_cols = get_features_from_request(request)
    pred_y_cols = json.loads(pred_y_cols.read().decode())

    # TODO: check args (see check_dataset())
    data = read_ds(f, qualitative_cols)
    X_test = data.loc[:, [*quantitative_cols, *qualitative_cols]]
    y_pred = pd.DataFrame(data[pred_y_cols])
    y_test = None if true_y_col is None else data[true_y_col]
    return is_regression, X_test, y_pred, y_test, qualitative_cols


def init_explainer(is_regression):
    cls = ethik.RegressionExplainer if is_regression else ethik.ClassificationExplainer
    return cls(n_samples=N_SAMPLES, memoize=True)


def plot_influence(request):
    try:
        is_regression, X_test, y_pred, _, qualitative_cols = parse_plot_request(request)
    except KeyError as e:
        return HttpResponseBadRequest(f"Cannot find key '{e}'")
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(e)

    explainer = init_explainer(is_regression)
    ranking = explainer.rank_by_influence(X_test, y_pred)

    labels = ranking["label"].unique()
    resp = {}
    for label in labels:
        sorted_features = ranking.query(f"label == '{label}'").sort_values(
            by=["importance"]
        )["feature"].unique()
        colors = interp_color(len(sorted_features))
        feat_to_color = {
            feat: color
            for feat, color in zip(sorted_features, colors)
        }
        
        feat_figures = {}
        for feat in X_test.columns:
            if feat not in qualitative_cols:
                feat_figures[feat] = explainer.plot_influence(
                    X_test=X_test[feat],
                    y_pred=y_pred[label],
                    colors=feat_to_color,
                )
                continue

            dummies = pd.get_dummies(X_test[feat])
            for cat in dummies:
                name = f"{feat} = {cat}"
                feat_figures[name] = explainer.plot_influence(
                    X_test=dummies[cat].rename(name),
                    y_pred=y_pred[label],
                    colors=feat_to_color,
                )

        tau_figure = explainer.plot_influence(
            X_test=X_test,
            y_pred=y_pred[label],
            colors=feat_to_color,
        )
        ranking_figure = explainer.plot_influence_ranking(
            X_test=X_test,
            y_pred=y_pred[label],
            colors=colors
        )

        resp[label] = dict(
            ranking=fig_to_json(ranking_figure),
            all_features=fig_to_json(tau_figure),
            features={
                feature: fig_to_json(fig)
                for feature, fig in feat_figures.items()
            }
        )

    return JsonResponse(resp)


def plot_performance(request):
    try:
        is_regression, X_test, y_pred, y_test, qualitative_cols = parse_plot_request(request)
    except KeyError as e:
        return HttpResponseBadRequest(f"Cannot find key '{e}'")
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(e)

    # For accuracy_score()
    if len(y_pred.columns) > 1: 
        y_pred = y_pred.idxmax(axis="columns")
    else:
        y_pred = (y_pred > 0.5).astype(int)

    explainer = init_explainer(is_regression)
    ranking = explainer.rank_by_performance(X_test, y_test, y_pred, METRIC)
    
    ranking_criterion = "min"
    sorted_features = ranking.sort_values(
        by=[ranking_criterion]
    )["feature"].unique()
    colors = interp_color(len(sorted_features))
    feat_to_color = {
        feat: color
        for feat, color in zip(sorted_features, colors)
    }
    
    feat_figures = {}
    for feat in X_test.columns:
        if feat not in qualitative_cols:
            feat_figures[feat] = explainer.plot_performance(
                X_test=X_test[feat],
                y_test=y_test,
                y_pred=y_pred,
                metric=METRIC,
                colors=feat_to_color,
            )
            continue

        dummies = pd.get_dummies(X_test[feat])
        for cat in dummies:
            name = f"{feat} = {cat}"
            feat_figures[name] = explainer.plot_performance(
                X_test=dummies[cat].rename(name),
                y_test=y_test,
                y_pred=y_pred,
                metric=METRIC,
                colors=feat_to_color,
            )

    tau_figure = explainer.plot_performance(
        X_test,
        y_test,
        y_pred,
        colors=feat_to_color,
        metric=METRIC,
    )
    ranking_figure = explainer.plot_performance_ranking(
        X_test,
        y_test,
        y_pred,
        metric=METRIC,
        criterion=ranking_criterion,
        colors=colors,
    )

    return JsonResponse(dict(
        ranking=fig_to_json(ranking_figure),
        all_features=fig_to_json(tau_figure),
        features={
            feature: fig_to_json(fig)
            for feature, fig in feat_figures.items()
        }
    ))
