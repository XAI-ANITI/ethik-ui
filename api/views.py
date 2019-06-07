from django.http import HttpResponseBadRequest, JsonResponse
import ethik

from .readers import read_ds


def load_dataset(request):
    try:
        f = request.FILES["file"]
    except KeyError:
        return HttpResponseBadRequest("Missing file with name 'file'")

    try:
        data = read_ds(f)
    except ValueError as e:
        return HttpResponseBadRequest(e)

    X = data.iloc[:,:-1].values
    y = data.iloc[:,-1].values

    explainer = ethik.Explainer()
    explainer.fit(X)
    explanation = explainer.explain_predictions(X, y)
    explanation.columns = data.columns[:-1]

    return JsonResponse(dict(
        taus=explanation.index.values.tolist(),
        means=explanation.to_dict("list"),
    ))
