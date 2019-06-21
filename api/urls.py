from django.urls import path

from . import views

urlpatterns = [
    path("explain_with_mean", views.explain_with_mean, name="explain_with_mean"),
    path("plot_predictions", views.plot_predictions, name="plot_predictions"),
    path("plot_importances", views.plot_importances, name="plot_importances"),
]
