from django.utils.html import strip_tags
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

class IngredientViewSet(viewsets.ReadOnlyModelViewSet):
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
        serializer.save(pantry=pantry)

class RecipeSuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        ingredients = request.data.get("ingredients", [])
        if not ingredients:
            return Response({"error": "No Ingredients provided"}, status=400)
        
        if isinstance(ingredients, list):
            ingredients = ",".join(ingredients)
        
        api_key = settings.SPOONACULAR_API_KEY

        params = {
            "ingredients": ingredients,
            "number": 5,
            "ranking": 2,
            "ignorePantry": True,
            "apiKey": api_key
        }

        try:
            response = requests.get("https://api.spoonacular.com/recipes/findByIngredients", params=params, timeout=10)
        except requests.RequestException:
            return Response({"error": "Could not reach the recipe service"}, status=502)
        if response.status_code == 200:
            recipes = []
            for r in response.json():
                recipes.append({
                    "id": r["id"],
                    "title": r["title"],
                    "image": r["image"],
                    "usedCount": r["usedIngredientCount"],
                    "missingCount": r["missedIngredientCount"],
                    "usedIngredients": [i["name"] for i in r["usedIngredients"]],
                    "missingIngredients": [i["name"] for i in r["missedIngredients"]],
                })
            return Response(recipes)
        else:
            return Response({"error": "Failed to retrieve recipes"}, status=500)


class RecipeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, recipe_id):
        params = {"includeNutrition": False, "apiKey": settings.SPOONACULAR_API_KEY}
        try:
            response = requests.get(f"https://api.spoonacular.com/recipes/{recipe_id}/information", params=params, timeout=10)
        except requests.RequestException:
            return Response({"error": "Could not reach the recipe service"}, status=502)
        if response.status_code == 404:
            return Response({"error": "Recipe not found"}, status=404)
        if response.status_code != 200:
            return Response({"error": "Failed to retrieve recipe"}, status=500)

        r = response.json()
        pantry_names = [
            name.lower() for name in
            PantryIngredient.objects.filter(pantry__user=request.user).values_list("ingredient__name", flat=True)
        ]

        def in_pantry(name):
            name = name.lower()
            return any(p in name or name in p for p in pantry_names)

        ingredients = []
        for i in r.get("extendedIngredients", []):
            ingredients.append({
                "id": i.get("id"),
                "name": i.get("name", ""),
                "original": i.get("original", ""),
                "inPantry": in_pantry(i.get("name", "")),
            })

        steps = []
        for group in r.get("analyzedInstructions", []):
            for step in group.get("steps", []):
                steps.append(step["step"])

        return Response({
            "id": r["id"],
            "title": r["title"],
            "image": r.get("image"),
            "servings": r.get("servings"),
            "readyInMinutes": r.get("readyInMinutes"),
            "sourceName": r.get("sourceName"),
            "sourceUrl": r.get("sourceUrl"),
            "summary": strip_tags(r.get("summary", "")),
            "diets": r.get("diets", []),
            "ingredients": ingredients,
            "steps": steps,
        })
