from django.http import HttpResponseBadRequest, JsonResponse
import ethik
import pandas as pd
from sklearn import metrics

from .utils import fig_to_json, interp_color, read_ds


def explain_with_mean(request):
    try:
        f = request.FILES["file"]
        y_pred_name = request.POST["yPredName"]
        y_name = request.POST["yName"]
    except KeyError as e:
        return HttpResponseBadRequest(str(e))

    try:
        data = read_ds(f)
    except ValueError as e:
        return HttpResponseBadRequest(e)

    if not y_pred_name:
        return HttpResponseBadRequest("y_pred name must be specified")

    if y_pred_name not in data:
        return HttpResponseBadRequest(
            f"Unknow column '{y_pred_name}' for y_pred name"
        )

    if y_name == y_pred_name:
        return HttpResponseBadRequest("Y name and y_pred name must be different")

    if y_name and y_name not in data:
        return HttpResponseBadRequest(
            f"Unknow column '{y_name}' for y name"
        )

    X = data.loc[:, data.columns.difference([y_pred_name, y_name])]
    y_pred = data[y_pred_name]
    explainer = ethik.Explainer().fit(X)

    request.session["dataset_name"] = f.name
    request.session["predictions_exp"] = explainer.explain_predictions(X, y_pred).to_json()
    request.session["importances_exp"] = explainer.explain_importances(X, y_pred).to_json()
    if y_name:
        metric_exp = explainer.explain_metric(
            X,
            data[y_name],
            y_pred,
            metrics.accuracy_score
        )
        request.session["metric_exp"] = metric_exp.to_json()

    return JsonResponse(dict(
        dataset_name=f.name,
        features=explainer.features,
        y_name=y_name,
        y_pred_name=y_pred_name,
    ))


def _plot(request, explanation_key, ranking_key, make_explanation_fig, make_ranking_fig):
    try:
        explanation = pd.read_json(request.session[explanation_key]).sort_index()
        ranking = pd.read_json(request.session[ranking_key]).sort_index()
    except KeyError:
        return HttpResponseBadRequest("The dataset must be explained first")

    sorted_features = ranking.sort_values(by=["importance"])["feature"].unique()
    colors = interp_color(len(sorted_features))
    feat_to_color = {
        feat: color
        for feat, color in zip(sorted_features, colors)
    }
    
    feat_figures = make_explanation_fig(
        explanation,
        with_taus=False,
        colors=feat_to_color,
    )
    tau_figure = make_explanation_fig(
        explanation,
        with_taus=True,
        colors=feat_to_color,
    )
    ranking_figure = make_ranking_fig(ranking, colors=colors)

    return JsonResponse(dict(
        ranking=fig_to_json(ranking_figure),
        all_features=fig_to_json(tau_figure),
        features={
            feature: fig_to_json(fig)
            for feature, fig in feat_figures.items()
        }
    ))


def plot_predictions(request):
    return _plot(
        request,
        "predictions_exp",
        "importances_exp",
        ethik.Explainer.make_predictions_fig,
        ethik.Explainer.make_importances_fig
    )


def plot_metric(request):
    return _plot(
        request,
        "metric_exp",
        "importances_exp", # TODO
        ethik.Explainer.make_metric_fig,
        ethik.Explainer.make_importances_fig # TODO
    )
