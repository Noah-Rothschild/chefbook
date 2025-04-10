from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)

class Pantry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredient = models.ManyToManyField(Ingredient, through='PantryIngredient')
    

class PantryIngredient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pantry = models.ForeignKey(Pantry, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    class Meta:
        unique_together = ("user", "ingredient")

