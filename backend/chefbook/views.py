from django.shortcuts import render
from django.conf import settings
import requests
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, PantrySerializer, IngredientSerializer, PantryIngredientSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Ingredient, Pantry, PantryIngredient

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all().order_by('name')
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

class PantryViewSet(viewsets.ModelViewSet):
    queryset = Pantry.objects.all()
    serializer_class = PantrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pantry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PantryIngredientViewSet(viewsets.ModelViewSet):
    queryset = PantryIngredient.objects.all()
    serializer_class = PantryIngredientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PantryIngredient.objects.filter(pantry__user= self.request.user)

    def perform_create(self, serializer):
        pantry = self.request.user.pantry
        ingredient = serializer.validated_data['ingredient']

        if PantryIngredient.objects.filter(pantry=pantry, ingredient=ingredient).exists():
            raise ValidationError('This ingredient is already in your pantry')
        serializer.save()

class RecipeSuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        ingredients = request.data.get("ingredients", "")
        if not ingredients:
            return Response({"error": "No Ingredients provided"}, status=400)
        
        api_key = settings.SPOONACULAR_API_KEY

        params = {
            "ingredients": ingredients,
            "number": 5,
            "ranking": 2,
            "ignorePantry": True,
            "apiKey": api_key
        }

        response = requests.get("https://api.spoonacular.com/recipes/findByIngredients", params=params)
        if response.status_code == 200:
            return Response(response.json())
        else:
            return Response({"error": "Failed to retrieve recipes"}, status=500)


