from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Pantry

@receiver(post_save, sender=User)
def create_user_pantry(sender, instance, created, **kwargs):
    if created:
        Pantry.objects.create(user=instance)