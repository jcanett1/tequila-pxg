from django.urls import path
from .views import UserView, login_view, api_lista_productos, agregar_producto, eliminar_producto, api_modificar_producto

urlpatterns = [
    path('api/login/', login_view, name='login'),
    path('api/users/', UserView.as_view({'get': 'list', 'post': 'create'}), name='user-list'),
    path('api/productos/', api_lista_productos, name='api_lista_productos'),
    path('api/productos/agregar/', agregar_producto, name='agregar_producto'),
    path('api/productos/<int:id>/eliminar/', eliminar_producto, name='eliminar_producto'),
    path('api/productos/<int:id>/modificar/', api_modificar_producto, name='modificar_producto'),
]
