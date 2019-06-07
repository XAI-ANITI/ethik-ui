from django.http import HttpResponse

def load_dataset(request):
    print(request.FILES)
    return HttpResponse("")
