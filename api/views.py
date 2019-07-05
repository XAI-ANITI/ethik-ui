import json

from django.http import HttpResponseBadRequest, JsonResponse
import ethik
import pandas as pd
from sklearn import metrics

from .utils import fig_to_json, interp_color, read_ds


PREDICTIONS_SESSION_KEY = "predictions"
IMPORTANCES_SESSION_KEY = "importances"
METRIC_SESSION_KEY = "metric"


def check_dataset(request):
    try:
        body = json.loads(request.body)
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(e)

    try:
        true_label_col = body["true_label_col"]
        pred_labels_cols = body["pred_labels_cols"]
        cols = body["columns"]
    except KeyError as e:
        return HttpResponseBadRequest(
            f"Cannot find key '{e}'"
        )

    errors = []

    # TODO: check types (with jsonschema?)

    if not pred_labels_cols:
        errors.append("pred_labels_cols must not be empty")

    if true_label_col in pred_labels_cols:
        errors.append(
            f"True label col '{true_label_col}' cannot be one of the "
            f"pred labels cols: {pred_labels_cols}"
        )

    features_cols = set(cols) - set(pred_labels_cols) - set([true_label_col])
    if not features_cols:
        errors.append("features columns must not be empty")

    if true_label_col in features_cols:
        errors.append(
            f"True label col '{true_label_col}' cannot be one of the "
            f"features cols: {features_cols}"
        )

    if set(features_cols) & set(pred_labels_cols):
        errors.append(
            f"Pred labels cols {pred_labels_cols} cannot share elements with "
            f"features cols {features_cols}"
        )

    return JsonResponse(dict(errors=errors))


def explain_bias(f, features_cols, pred_labels_cols):
    # TODO: check args (see check_dataset())
    data = read_ds(f)
    X = data.loc[:, features_cols]
    y_pred = data[pred_labels_cols]
    explainer = ethik.Explainer().fit(X)

    return (
        explainer.explain_predictions(X, y_pred),
        explainer.explain_importances(X, y_pred)
    )


def plot_bias(request):
    try:
        f = request.FILES["file"]
        features_cols = request.FILES["features_cols"]
        pred_labels_cols = request.FILES["pred_labels_cols"]
    except KeyError as e:
        return HttpResponseBadRequest(f"Cannot find key '{e}'")

    try:
        features_cols = json.loads(features_cols.read().decode())
        pred_labels_cols = json.loads(pred_labels_cols.read().decode())
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(e)

    try:
        bias, ranking = explain_bias(f, features_cols, pred_labels_cols)
    except ValueError as e:
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
        
        feat_figures = ethik.Explainer.make_predictions_fig(
            bias.query(f"label == '{label}'"),
            with_taus=False,
            colors=feat_to_color,
        )
        tau_figure = ethik.Explainer.make_predictions_fig(
            bias.query(f"label == '{label}'"),
            with_taus=True,
            colors=feat_to_color,
        )
        ranking_figure = ethik.Explainer.make_importances_fig(
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


def explain_performance(f, features_cols, pred_labels_cols, true_label_col):
    # TODO: check args (see check_dataset())
    data = read_ds(f)
    X = data.loc[:, features_cols]
    y_pred = data[pred_labels_cols]
    y_true = data[true_label_col]
    explainer = ethik.Explainer().fit(X)

    return (
        explainer.explain_metric(
            X,
            y_true,
            y_pred if len(pred_labels_cols) == 1 else y_pred.idxmax(axis="columns"),
            metrics.accuracy_score # TODO
        ),
        explainer.explain_importances(X, y_pred) # TODO: performance_ranking()
    )


def plot_performance(request):
    try:
        f = request.FILES["file"]
        features_cols = request.FILES["features_cols"]
        pred_labels_cols = request.FILES["pred_labels_cols"]
        true_label_col = request.POST["true_label_col"]
    except KeyError as e:
        return HttpResponseBadRequest(f"Cannot find key '{e}'")

    try:
        features_cols = json.loads(features_cols.read().decode())
        pred_labels_cols = json.loads(pred_labels_cols.read().decode())
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(e)

    try:
        performance, ranking = explain_performance(
            f,
            features_cols,
            pred_labels_cols,
            true_label_col
        )
    except ValueError as e:
        return HttpResponseBadRequest(e)
    
    sorted_features = ranking.sort_values(by=["importance"])["feature"].unique() # TODO
    colors = interp_color(len(sorted_features))
    feat_to_color = {
        feat: color
        for feat, color in zip(sorted_features, colors)
    }
    
    feat_figures = ethik.Explainer.make_metric_fig(
        performance,
        with_taus=False,
        colors=feat_to_color,
    )
    tau_figure = ethik.Explainer.make_metric_fig(
        performance,
        with_taus=True,
        colors=feat_to_color,
    )
    ranking_figure = ethik.Explainer.make_importances_fig( # TODO
        ranking,
        colors=colors
    )

    return JsonResponse(dict(
        ranking=fig_to_json(ranking_figure),
        all_features=fig_to_json(tau_figure),
        features={
            feature: fig_to_json(fig)
            for feature, fig in feat_figures.items()
        }
    ))
