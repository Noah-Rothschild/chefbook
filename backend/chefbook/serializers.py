from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Ingredient, Pantry, Recipe, RecipeIngredient

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'category']

class PantrySerializer(serializers.ModelSerializer):
    #ingredient = IngredientSerializer(many=True, read_only=True)

    class Meta:
        model = Pantry
        fields = ['ingredient_id', 'user', 'ingredient_name']
        extra_kwargs = {'user':{'read_only': True}}

class RecipeSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'instructions', 'ingredients']

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = RecipeIngredient
        fields = ['id', 'recipe', 'ingredient']