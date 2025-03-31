
from django.contrib import admin
from django.urls import path, include
from chefbook.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('chefbook/user/register/', CreateUserView.as_view(), name='register'),
    path('chefbook/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('chefbook/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('chefbook-auth/', include('rest_framework.urls')),
]
