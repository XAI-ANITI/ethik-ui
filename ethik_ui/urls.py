from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    # Must be at the end as it catches all urls (for react-router)
    path("", include("frontend.urls")),
]
