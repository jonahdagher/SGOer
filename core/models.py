from django.db import models
from django.contrib.auth import get_user_model

from django.utils import timezone

class Bro(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Sgo(models.Model):
    description = models.CharField(max_length=200)

    size = models.IntegerField(default=2)

    start = models.DateTimeField(default=timezone.now)
    end = models.DateTimeField(default=timezone.now)

    location = models.CharField(max_length=200)

    bros = models.ManyToManyField(
        Bro,
        related_name="sgos"
    )

    pnms = models.ManyToManyField(
        get_user_model(),
        related_name="sgos"
    )

    def __str__(self):
        return f"{self.description}, size: {self.size}, start: {self.start}, end: {self.end}, location: {self.location}, bros: {self.bros}, pnms: {self.pnms}"

