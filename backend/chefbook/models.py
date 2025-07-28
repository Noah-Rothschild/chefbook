from django.db import models
from django.contrib.auth.models import User

class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)

class Pantry(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='pantry')
    ingredients = models.ManyToManyField(Ingredient, through='PantryIngredient')
    
class PantryIngredient(models.Model):
    pantry = models.ForeignKey(Pantry, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    class Meta:
        unique_together = ("pantry", "ingredient")

