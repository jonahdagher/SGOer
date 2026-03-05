from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response


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
    @action(detail=True, methods=["post"], url_path="join")
    def join(self, request, pk=None):
        sgo = self.get_object()

        if sgo.pnms.count() >= sgo.size:
            return Response({"error: SGO is full"}, status=400)
        
        sgo.pnms.add(request.user)
        return Response({"Ok": True})

    @action(detail=False, methods=["post"], url_path="create")
    def create_sgo(self, request):
        description = request.data.get("description")
        location = request.data.get("location")
        size = int(request.data.get("size"))
        start = request.data.get("start")
        end = request.data.get("end")
        bro_ids = request.data.get("bro_ids")
        pnm_ids = request.data.get("pnm_ids")
        newSgo = Sgo.objects.create(
            description = description,
            location = location,
            size = size,
            start = start,
            end = end
        )

        pnm_id = request.user.id

        if bro_ids: newSgo.bros.set(bro_ids)
        if pnm_id: newSgo.pnms.add(pnm_id)

        return Response({"ok": True}, status=201)

        