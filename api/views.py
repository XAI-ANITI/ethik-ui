import json

from django.http import HttpResponseBadRequest, JsonResponse
import ethik
import pandas as pd
from sklearn import metrics

from .utils import fig_to_json, interp_color, read_ds


METRIC = metrics.accuracy_score # TODO: let the user choose


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


def explain_bias(f, features_cols, pred_y_cols):
    # TODO: check args (see check_dataset())
    data = read_ds(f)
    X = data.loc[:, features_cols]
    y_pred = data[pred_y_cols]
    explainer = ethik.Explainer()

    return (
        explainer.explain_bias(X, y_pred),
        explainer.rank_by_bias(X, y_pred)
    )


def plot_bias(request):
    try:
        f = request.FILES["file"]
        features_cols = request.FILES["features_cols"]
        pred_y_cols = request.FILES["pred_y_cols"]
    except KeyError as e:
        return HttpResponseBadRequest(f"Cannot find key '{e}'")

    try:
        features_cols = json.loads(features_cols.read().decode())
        pred_y_cols = json.loads(pred_y_cols.read().decode())
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(e)

    try:
        bias, ranking = explain_bias(f, features_cols, pred_y_cols)
    except ValueError as e:
        raise e
        return HttpResponseBadRequest(e)

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
        
        feat_figures = ethik.Explainer.make_bias_fig(
            bias.query(f"label == '{label}'"),
            with_taus=False,
            colors=feat_to_color,
        )
        tau_figure = ethik.Explainer.make_bias_fig(
            bias.query(f"label == '{label}'"),
            with_taus=True,
            colors=feat_to_color,
        )
        ranking_figure = ethik.Explainer.make_bias_ranking_fig(
            ranking.query(f"label == '{label}'"),
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


def explain_performance(f, features_cols, pred_y_cols, true_y_col):
    # TODO: check args (see check_dataset())
    data = read_ds(f)
    X = data.loc[:, features_cols]
    y_pred = data[pred_y_cols]
    y_true = data[true_y_col]
    explainer = ethik.Explainer()
    if len(pred_y_cols) > 1:
        y_pred = y_pred.idxmax(axis="columns")

    return (
        explainer.explain_performance(X, y_true, y_pred, METRIC),
        explainer.rank_by_performance(X, y_true, y_pred, METRIC)
    )


def plot_performance(request):
    try:
        f = request.FILES["file"]
        features_cols = request.FILES["features_cols"]
        pred_y_cols = request.FILES["pred_y_cols"]
        true_y_col = request.POST["true_y_col"]
    except KeyError as e:
        return HttpResponseBadRequest(f"Cannot find key '{e}'")

    try:
        features_cols = json.loads(features_cols.read().decode())
        pred_y_cols = json.loads(pred_y_cols.read().decode())
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(e)

    try:
        performance, ranking = explain_performance(
            f,
            features_cols,
            pred_y_cols,
            true_y_col
        )
    except ValueError as e:
        return HttpResponseBadRequest(e)
    
    ranking_criterion = "min"
    sorted_features = ranking.sort_values(
        by=[ranking_criterion]
    )["feature"].unique()
    colors = interp_color(len(sorted_features))
    feat_to_color = {
        feat: color
        for feat, color in zip(sorted_features, colors)
    }
    
    feat_figures = ethik.Explainer.make_performance_fig(
        performance,
        with_taus=False,
        colors=feat_to_color,
        metric=METRIC,
    )
    tau_figure = ethik.Explainer.make_performance_fig(
        performance,
        with_taus=True,
        colors=feat_to_color,
        metric=METRIC,
    )
    ranking_figure = ethik.Explainer.make_performance_ranking_fig(
        ranking,
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
