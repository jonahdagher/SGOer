from rest_framework import serializers
from .models import Bro, Sgo
from django.contrib.auth import get_user_model

User = get_user_model()

class BroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bro
        fields = ("id", "name")

class SgoSerializer(serializers.ModelSerializer):
    bro_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Bro.objects.all(), write_only=True, required=False
    )
    pnm_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(), write_only=True, required=False
    )

    bros = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    pnms = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Sgo
        fields = (
            "id",
            "description",
            "size",
            "start",
            "end",
            "location",
            "bro_ids",
            "pnm_ids",
            "bros",
            "pnms"
        )

    def create(self, validated_data):
        bro_ids = validated_data.pop("bro_ids", [])
        pnm_ids = validated_data.pop("pnm_ids", [])

        sgo = Sgo.objects.create(**validated_data)

        if bro_ids:
            sgo.bros.set(bro_ids)
        if pnm_ids:
            sgo.pnms.set(pnm_ids)

        return sgo