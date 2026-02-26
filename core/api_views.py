from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Bro, Sgo
from .serializers import BroSerializer, SgoSerializer

class BroViewSet(viewsets.ModelViewSet):
    queryset = Bro.objects.all()
    serializer_class = BroSerializer
    permission_classes = [IsAuthenticated]

class SgoViewSet(viewsets.ModelViewSet):
    queryset = Sgo.objects.all()
    serializer_class = SgoSerializer
    permission_classes = [IsAuthenticated]