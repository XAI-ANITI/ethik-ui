from django.http import HttpResponseBadRequest, JsonResponse
import ethik
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

    X = data.loc[:, data.columns != y_pred_name]
    y_pred = data[y_pred_name]

    explainer = ethik.Explainer().fit(X)
    proportions = explainer.explain_predictions(X, y_pred)

    accuracies = {}
    if y_name:
        y = data[y_name]
        accuracies = explainer.explain_metric(
            X,
            y,
            y_pred,
            metrics.accuracy_score
        ).to_dict("list")

    return JsonResponse(dict(
        taus=proportions.index.values.tolist(),
        means=explainer.nominal_values(X).to_dict("list"),
        proportions=proportions.to_dict("list"),
        accuracies=accuracies,
        names=dict(
            y=None,
            y_pred=y_pred.name,
            X=list(X.columns),
        )
    ))
