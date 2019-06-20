import json

from django.http import HttpResponseBadRequest, JsonResponse
import ethik
import pandas as pd
from plotly.utils import PlotlyJSONEncoder
from sklearn import metrics

from .readers import read_ds


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
    predictions_exp = explainer.explain_predictions(X, y_pred)

    metric_exp = None
    if y_name:
        y = data[y_name]
        metric_exp = explainer.explain_metric(
            X,
            y,
            y_pred,
            metrics.accuracy_score
        )

    request.session["dataset_name"] = f.name
    request.session["predictions_exp"] = predictions_exp.to_json()
    if metric_exp is not None:
        request.session["metric_exp"] = metric_exp.to_json()

    return JsonResponse(dict(
        dataset_name=f.name,
        features=explainer.features,
        y_name=y_name,
        y_pred_name=y_pred_name,
    ))


def plot_predictions(request):
    try:
        features = json.loads(request.body)["features"]
    except KeyError as e:
        return HttpResponseBadRequest(str(e))

    if not features:
        return HttpResponseBadRequest("The features list cannot be empty")

    try:
        explanation = pd.read_json(request.session["predictions_exp"])
    except KeyError:
        return HttpResponseBadRequest("The dataset must be explained first")

    explanation = explanation.query(f"feature in {features}")
    feat_figures = ethik.Explainer.make_predictions_fig(explanation, with_taus=False)
    tau_figure = ethik.Explainer.make_predictions_fig(explanation, with_taus=True)

    return JsonResponse(dict(
        tau_plot=dict(
            data=json.loads(json.dumps(tau_figure.data, cls=PlotlyJSONEncoder)),
            layout=json.loads(json.dumps(tau_figure.layout, cls=PlotlyJSONEncoder)),
        ),
        feature_plots={
            feature: dict(
                data=json.loads(json.dumps(fig.data, cls=PlotlyJSONEncoder)),
                layout=json.loads(json.dumps(fig.layout, cls=PlotlyJSONEncoder)),
            )
            for feature, fig in feat_figures.items()
        }
    ))


def plot_metric(request):
    pass
