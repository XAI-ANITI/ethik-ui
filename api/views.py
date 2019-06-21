from django.http import HttpResponseBadRequest, JsonResponse
import ethik
import pandas as pd
from sklearn import metrics

from .utils import plotly_to_json, read_ds


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
        request.session["metric_exp"] = explainer.explain_metric(
            X,
            data[y_name],
            y_pred,
            metrics.accuracy_score
        ).to_json()

    return JsonResponse(dict(
        dataset_name=f.name,
        features=explainer.features,
        y_name=y_name,
        y_pred_name=y_pred_name,
    ))


def plot_predictions(request):
    try:
        predictions_exp = pd.read_json(request.session["predictions_exp"]).sort_index()
        importances_exp = pd.read_json(request.session["importances_exp"]).sort_index()
    except KeyError:
        return HttpResponseBadRequest("The dataset must be explained first")

    # TODO: colors
    feat_figures = ethik.Explainer.make_predictions_fig(predictions_exp, with_taus=False)
    tau_figure = ethik.Explainer.make_predictions_fig(predictions_exp, with_taus=True)
    ranking_figure = ethik.Explainer.make_importances_fig(importances_exp)

    return JsonResponse(dict(
        ranking=plotly_to_json(ranking_figure.data),
        tau=plotly_to_json(tau_figure.data),
        features={
            feature: plotly_to_json(fig.data)
            for feature, fig in feat_figures.items()
        }
    ))


def plot_metric(request):
    raise NotImplementedError()
