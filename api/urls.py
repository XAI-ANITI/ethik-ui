from django.urls import path

from . import views

urlpatterns = [
    path('explain_with_mean', views.explain_with_mean, name='explain_with_mean'),
]
