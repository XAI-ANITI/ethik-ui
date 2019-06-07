from django.urls import path

from . import views

urlpatterns = [
    path('loadDataset', views.load_dataset, name='load_dataset'),
]
