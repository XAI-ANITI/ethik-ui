from django.urls import path

from . import views

urlpatterns = [
    path("check_dataset", views.check_dataset, name="check_dataset"),
    path("plot_predictions", views.plot_predictions, name="plot_predictions"),
    path("plot_metric", views.plot_metric, name="plot_metric"),
]
