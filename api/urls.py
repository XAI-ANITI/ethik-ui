from django.urls import path

from . import views

urlpatterns = [
    path("check_dataset", views.check_dataset, name="check_dataset"),
    path("plot_bias", views.plot_bias, name="plot_bias"),
    path("plot_metric", views.plot_metric, name="plot_metric"),
]
