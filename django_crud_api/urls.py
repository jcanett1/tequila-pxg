"""
URL configuration for django_crud_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include  # Asegúrate de importar 'include'
from tasks.views import UserView, login_view, api_lista_productos, agregar_producto, eliminar_producto, api_modificar_producto

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login_view, name='login'),
    path('api/users/', UserView.as_view({'get': 'list', 'post': 'create'}), name='user-list'),
    path('api/productos/', api_lista_productos, name='lista_productos'),
    path('api/productos/agregar/', agregar_producto, name='agregar_producto'),
    path('api/productos/<int:id>/eliminar/', eliminar_producto, name='eliminar_producto'),
    path('api/productos/<int:id>/modificar/', api_modificar_producto, name='modificar_producto'),
    path('tasks/', include('tasks.urls')),  # Asegúrate de incluir las URLs de la aplicación 'tasks'
]