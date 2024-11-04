from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Producto
from django.db.models import Max
import json
from django.core.exceptions import ObjectDoesNotExist







# Constante para tamaño máximo de comentarios
MAX_TAMANO_COMENTARIOS = 500

# Vista para listar productos
def api_lista_productos(request):
    productos = Producto.objects.all().values(
        'id', 'descripcion', 'precio', 'cantidad', 'unidad', 'proveedor', 'fecha_ingreso', 'numero_serie', 'moneda', 'comentarios' , 'tipo_producto'
    )
    
    for producto in productos:
        # Conversión de moneda
        if producto['moneda'] == 'MXN':
            producto['moneda'] = 'Pesos Mexicanos'
        elif producto['moneda'] == 'USD':
            producto['moneda'] = 'Dólares Americanos'
        
        # Conversión de unidades
        if producto['unidad'] == 'PZA':
            producto['unidad'] = 'Piezas'
        elif producto['unidad'] == 'LITROS':
            producto['unidad'] = 'Litros'
        elif producto['unidad'] == 'METROS':
            producto['unidad'] = 'Metros'
        elif producto['unidad'] == 'CAJAS':
            producto['unidad'] = 'Cajas'
    
    return JsonResponse(list(productos), safe=False)

# Vista para modificar productos
@csrf_exempt
def api_modificar_producto(request, id):
    if request.method == 'PUT':
        producto = get_object_or_404(Producto, id=id)
        data = json.loads(request.body)

        # Verifica el tamaño de los comentarios
        comentarios = data.get('comentarios', '')
        if len(comentarios) > MAX_TAMANO_COMENTARIOS:
            return JsonResponse({'error': 'Los comentarios son demasiado largos.'}, status=400)

        # Actualizamos los campos del producto
        for attr, value in data.items():
            setattr(producto, attr, value)
        
        try:
            producto.save()
            return JsonResponse({
                'id': producto.id,
                'descripcion': producto.descripcion,
                'precio': producto.precio,
                'cantidad': producto.cantidad,
                'unidad': producto.unidad,
                'proveedor': producto.proveedor,
                'fecha_ingreso': producto.fecha_ingreso,
                'numero_serie': producto.numero_serie,
                'moneda': producto.moneda,
                'comentarios': producto.comentarios,
                'tipo_producto': producto.tipo_producto  # Agregamos tipo_producto aquí
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

# Serializador para el modelo User
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# Vista basada en ViewSet para el modelo User
class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Vista para autenticación de usuarios
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return JsonResponse({'message': 'Faltan campos requeridos (username o password)'}, status=400)

            user = authenticate(request, username=username, password=password)

            if user is not None:
                return JsonResponse({'message': 'Login exitoso', 'user': user.username})
            else:
                return JsonResponse({'message': 'Credenciales incorrectas'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Formato de JSON no válido'}, status=400)
        except Exception as e:
            return JsonResponse({'message': f'Error interno del servidor: {str(e)}'}, status=500)
    else:
        return JsonResponse({'message': 'Método no permitido'}, status=405)

# Vista para agregar un producto con ID consecutivo
@csrf_exempt
def agregar_producto(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tipo_producto = data.get('tipo_producto', 'nuevo')  # Obtiene el tipo de producto (nuevo o existente)

            if tipo_producto == 'existente':
                descripcion = data.get('descripcion')
                if not descripcion:
                    return JsonResponse({'error': 'Debe proporcionar una descripción para buscar el producto existente.'}, status=400)

                # Buscar el producto existente por su descripción
                try:
                    producto_existente = Producto.objects.get(descripcion=descripcion)
                    return JsonResponse({
                        'id': producto_existente.id,
                        'descripcion': producto_existente.descripcion,
                        'precio': producto_existente.precio,
                        'cantidad': producto_existente.cantidad,
                        'unidad': producto_existente.unidad,
                        'proveedor': producto_existente.proveedor,
                        'fecha_ingreso': producto_existente.fecha_ingreso,
                        'numero_serie': producto_existente.numero_serie,
                        'moneda': producto_existente.moneda,
                        'comentarios': producto_existente.comentarios,
                        'tipo_producto': producto_existente.tipo_producto  # Retorna el tipo de producto
                    }, status=200)
                except ObjectDoesNotExist:
                    return JsonResponse({'error': 'Producto no encontrado.'}, status=404)

            elif tipo_producto == 'nuevo':
                # Crear un nuevo producto si es de tipo nuevo
                ultimo_producto = Producto.objects.aggregate(Max('id'))
                proximo_id = (ultimo_producto['id__max'] or 0) + 1

                producto = Producto(
                    id=proximo_id,
                    descripcion=data['descripcion'],
                    precio=data['precio'],
                    cantidad=data['cantidad'],
                    unidad=data['unidad'],
                    proveedor=data['proveedor'],
                    fecha_ingreso=data['fecha_ingreso'],
                    numero_serie=data.get('numero_serie', ''),
                    moneda=data['moneda'],
                    comentarios=data.get('comentarios', ''),
                    tipo_producto='nuevo'  # Guarda el producto como nuevo
                )
                producto.save()

                return JsonResponse({'message': 'Producto agregado exitosamente', 'producto_id': producto.id}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

# Vista para eliminar un producto
@csrf_exempt
def eliminar_producto(request, id):
    if request.method == 'DELETE':
        print(f"Intentando eliminar producto con ID: {id}")  # Debugging
        try:
            producto = Producto.objects.get(id=id)
            print(f"Producto encontrado: {producto.descripcion}")  # Debugging
            producto.delete()
            return JsonResponse({"message": "Producto eliminado correctamente"}, status=200)
        except Producto.DoesNotExist:
            print("Producto no encontrado")  # Debugging
            return HttpResponseNotFound("Producto no encontrado")
    return JsonResponse({'error': 'Método no permitido'}, status=405)
