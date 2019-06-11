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

    X = data.iloc[:,:-1]
    y = data.iloc[:,-1]

    explainer = ethik.Explainer().fit(X)
    explanation = explainer.explain_predictions(X, y)

    return JsonResponse(dict(
        taus=explanation.index.values.tolist(),
        means=explainer.nominal_values(X).to_dict("list"),
        accuracies=explanation.to_dict("list"),
    ))
