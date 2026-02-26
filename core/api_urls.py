from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import BroViewSet, SgoViewSet

router = DefaultRouter()
router.register("bros", BroViewSet, basename="bro")
router.register("sgos", SgoViewSet, basename="sgo")

urlpatterns = [
    path("", include(router.urls)),
]