from django.urls import path, include
from rest_framework.routers import DefaultRouter    
from .views import IngredientViewSet, PantryViewSet, PantryIngredientViewSet, RecipeSuggestionView

router = DefaultRouter()
router.register('ingredients', IngredientViewSet)
router.register('pantry', PantryViewSet)
router.register('pantry-ingredients', PantryIngredientViewSet)
router.register('recipe-suggestion', RecipeSuggestionView)

urlpatterns = [
    path('', include(router.urls)),
]