from django.urls import path
from . import views
# tasks/urls.py
from .views import (
    UserView, login_view, api_lista_productos, agregar_producto,
    eliminar_producto, api_modificar_producto, manejar_min_max,
    agregar_entrada, listaproductos , agregar_categoria , agregar_proveedor ,
    editar_producto, listar_proveedores ,  modificar_proveedor, eliminar_proveedor,
    lista_primeras_entradas, modificar_listaentradas,eliminar_listadeentradas
)


urlpatterns = [
    # Rutas para autenticación y usuarios
    path('api/login/', login_view, name='login'),
    path('api/users/', UserView.as_view({'get': 'list', 'post': 'create'}), name='user-list'),

    # Rutas relacionadas con entradas
    path('api/primerasentradas/agregar/', agregar_entrada, name='agregar_entrada'),
    path('api/primerasentradas/',lista_primeras_entradas, name='primerasentradas-list'),
   
    # Rutas relacionadas con productos
    path('api/productos/', api_lista_productos, name='api_lista_productos'),  # Lista de productos (GET)
    path('api/productos/agregar/', agregar_producto, name='agregar_producto'),  # Agregar producto (POST)
    path('api/productos/<str:nombre>/eliminar/', eliminar_producto, name='eliminar_producto'),
    path('api/productos/<int:id>/editar/', api_modificar_producto, name='modificar_producto'),
    path('api/listadeentradas/<int:id>/modificar/', views.modificar_listaentradas, name='modificar_listaentradas'),
   
    path('api/primerasentradas/<int:id>/modificar/', modificar_listaentradas, name='primerasentradas-modificar'),
    path('api/primerasentradas/<int:id>/eliminar/', eliminar_listadeentradas, name='eliminar_litadenetradas'),
    path('api/productos/<int:id>/minmax/', manejar_min_max, name='manejar_min_max'),  # Manejar MinMax (PUT)

    # Ruta para obtener una lista de productos adicionales si es necesario
    path('api/productos/lista/', listaproductos, name='listaproductos'),  # Lista de productos adicional (si es necesario)

     path('api/productos/categoria/', agregar_categoria, name='agregar_categoria'),
     path('api/proveedor/agregar/', agregar_proveedor, name='agregar_proveedor'),
     path('api/categoria/', views.listar_categorias, name='listar_categorias'),
     path('api/proveedor/', listar_proveedores, name='listar_proveedores'),
     path('api/proveedor/', views.listar_proveedores, name='listar_proveedores'),
     path('proveedores/<int:pk>/modificar/', modificar_proveedor, name='modificar_proveedor'),
     path('proveedores/<int:pk>/eliminar/', eliminar_proveedor, name='eliminar_proveedor'),
]