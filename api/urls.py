from django.urls import path

from . import views

urlpatterns = [
    path("check_dataset", views.check_dataset, name="check_dataset"),
    path("plot_influence", views.plot_influence, name="plot_influence"),
    path("plot_performance", views.plot_performance, name="plot_performance"),
]
