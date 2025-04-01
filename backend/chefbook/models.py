from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)

class Pantry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    class Meta:
        unique_together = ("user", "ingredient")

class Recipe(models.Model):
    title = models.CharField(max_length=100)
    instructions = models.TextField()
    ingredient = models.ManyToManyField(Ingredient, through='RecipeIngredient')

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=100)
