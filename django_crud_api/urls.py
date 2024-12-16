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
from django.urls import path, include
from tasks import views  # Importa correctamente 'views' desde la app 'tasks'
from tasks.views import (
    UserView, login_view, api_lista_productos, agregar_producto,
    eliminar_producto, api_modificar_producto, manejar_min_max,
    agregar_entrada, agregar_categoria, agregar_proveedor,
    listar_proveedores, modificar_proveedor, eliminar_proveedor,
    lista_primeras_entradas, modificar_listaentradas, 
    eliminar_listadeentradas,listaproductos    # <- Agregada aquí
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login_view, name='login'),
    path('api/users/', UserView.as_view({'get': 'list', 'post': 'create'}), name='user-list'),
    path('api/productos/categoria/', agregar_categoria, name='agregar_categoria'),
    path('api/primerasentradas/agregar/', agregar_entrada, name='agregar_entrada'),
    path('api/primerasentradas/', lista_primeras_entradas, name='primerasentradas-list'),
    path('api/listadeentradas/<int:id>/modificar/', views.modificar_listaentradas, name='modificar_listaentradas'),
    
    path('api/primerasentradas/<int:id>/eliminar/', eliminar_listadeentradas, name='eliminar_litadenetradas'),
    path('api/primerasentradas/<int:id>/modificar/', modificar_listaentradas, name='primerasentradas-modificar'),
    path('api/productos/lista/', listaproductos, name='listaproductos'),
    path('api/productos/', api_lista_productos, name='lista_productos'),
    path('api/categoria/', views.listar_categorias, name='listar_categorias'),
    path('api/productos/agregar/', agregar_producto, name='agregar_producto'),
      path('api/productos/<int:id>/eliminar/', eliminar_producto, name='eliminar_producto'),
    path('api/productos/<int:id>/editar/', api_modificar_producto, name='modificar_producto'),
    path('api/productos/<int:id>/minmax/', manejar_min_max, name='manejar_min_max'),
    path('api/proveedor/agregar/', agregar_proveedor, name='agregar_proveedor'),
    path('api/proveedor/', listar_proveedores, name='listar_proveedores'),  # Aquí está la ruta para listar proveedores
    path('api/proveedor/<int:pk>/modificar/', modificar_proveedor, name='modificar_proveedor'),
    path('api/proveedor/<int:pk>/eliminar/', eliminar_proveedor, name='eliminar_proveedor'),
]