from django.http import HttpResponseBadRequest, JsonResponse
import ethik

from .readers import read_ds


def explain_with_mean(request):
    try:
        f = request.FILES["file"]
        y_pred_name = request.POST["yPredName"]
    except KeyError as e:
        return HttpResponseBadRequest(str(e))

    try:
        data = read_ds(f)
    except ValueError as e:
        return HttpResponseBadRequest(e)

    if not y_pred_name:
        return HttpResponseBadRequest("yPred name must be specified")

    if y_pred_name not in data:
        return HttpResponseBadRequest(
            f"Unknow column '{y_pred_name}' for yPred name"
        )

    X = data.loc[:, data.columns != y_pred_name]
    y_pred = data[y_pred_name]

    explainer = ethik.Explainer().fit(X)
    explanation = explainer.explain_predictions(X, y_pred)

    return JsonResponse(dict(
        taus=explanation.index.values.tolist(),
        means=explainer.nominal_values(X).to_dict("list"),
        accuracies=explanation.to_dict("list"),
        names=dict(
            y=None,
            y_pred=y_pred.name,
            X=list(X.columns),
        )
    ))
