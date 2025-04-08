from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, PantrySerializer, IngredientSerializer, RecipeSerializer, RecipeIngredientSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Ingredient, Pantry, Recipe, RecipeIngredient

# Create your views here.
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

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

class RecipeSuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_ingredients = Pantry.objects.filter(user=request.user).values_list('ingredient', flat=True)
        recipes = Recipe.objects.filter(ingredients__in=user_ingredients).distinct()
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)

