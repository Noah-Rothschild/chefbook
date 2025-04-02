from django.urls import path, include
from rest_framework.routers import DefaultRouter    
from .views import IngredientViewSet, PantryViewSet, RecipeViewSet, RecipeSuggestionView


router = DefaultRouter()
router.register('ingredients', IngredientViewSet)
router.register('pantry', PantryViewSet)
router.register('recipes', RecipeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('recipies/suggested/', RecipeSuggestionView.as_view(), name='recipe-suggestions')
]