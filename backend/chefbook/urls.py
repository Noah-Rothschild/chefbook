from django.urls import path, include
from rest_framework.routers import DefaultRouter    
from .views import IngredientViewSet, PantryViewSet, PantryIngredientViewSet

router = DefaultRouter()
router.register('ingredients', IngredientViewSet)
router.register('pantry', PantryViewSet)
router.register('pantry-ingredients', PantryIngredientViewSet)

urlpatterns = [
    path('', include(router.urls)),
]