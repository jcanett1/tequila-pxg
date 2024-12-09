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
from .serializer import PrimerasEntradasSerializer
from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Categoria
from .models import Proveedor
from .models import Producto
from .serializer import ProveedorSerializer
from rest_framework.views import APIView
from .serializer import ProductoSerializer
from .serializer import CategoriaSerializer, ProveedorSerializer
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import PrimerasEntradas
from django.db import connection


# Constante para tamaño máximo de comentarios
MAX_TAMANO_COMENTARIOS = 500



def listaproductos(request):
    """
    Vista para listar productos con solo los campos id, nombre_producto, descripcion y nombre_categoria.
    """
    productos = Producto.objects.all().values(
        'id',
        'nombre_producto',
        'descripcion',
        'nombre_categoria'
    )
    
    return JsonResponse(list(productos), safe=False)

# Función para reiniciar el contador de IDs en SQL Server
def reiniciar_contador_primeras_entradas():
    with connection.cursor() as cursor:
        # Verificar si el ID 1 ya está en uso
        cursor.execute("SELECT MAX(id) FROM tasks_primerasentradas")
        max_id = cursor.fetchone()[0]  # Obtiene el ID máximo actual en la tabla
        
        # Establecer el siguiente ID como el máximo + 1
        if max_id is None:
            next_id = 1
        else:
            next_id = max_id + 1
        
        # Ajustar el contador para el próximo valor
        cursor.execute(f"DBCC CHECKIDENT ('tasks_primerasentradas', RESEED, {next_id - 1})")

# Vista para eliminar la entrada
@csrf_exempt
def eliminar_listadeentradas(request, id):
    print(f"Eliminando entrada con id: {id}")  # Verifica si esta línea aparece en la consola
    
    # Buscar la entrada a eliminar
    lista = get_object_or_404(PrimerasEntradas, id=id)
    
    # Eliminar la entrada
    lista.delete()
    print(f"Entrada con id {id} eliminada")
    
    # Reiniciar el contador de IDs
    reiniciar_contador_primeras_entradas()
    
    # Respuesta después de la eliminación
    return JsonResponse({'message': 'Entrada eliminada y contador reiniciado correctamente'})

def api_lista_entradas(request):
    if request.method == 'GET':
        entradas = PrimerasEntradas.objects.select_related('producto').all()
        data = [
            {
                'id': entrada.id,
                'producto': entrada.producto.nombre_producto,  # Accede directamente
                'descripcion': entrada.descripcion,
                'cantidad': entrada.cantidad,
                'fecha_ingreso': entrada.fecha_ingreso,
                'comentarios': entrada.comentarios,
            }
            for entrada in entradas
        ]
        return JsonResponse(data, safe=False)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@api_view(['GET'])
def listar_categorias(request):
    categorias = Categoria.objects.all()
    data = [{"id": categoria.id, "nombre_categoria": categoria.nombre_categoria} for categoria in categorias]
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_http_methods(["GET"])
@api_view(['GET'])
def listar_proveedores(request):
    proveedores = Proveedor.objects.all()
    serializer = ProveedorSerializer(proveedores, many=True)
    return Response(serializer.data)


@csrf_exempt
def agregar_proveedor(request):
    if request.method == 'POST':
        try:
            # Intentar parsear los datos JSON del cuerpo de la solicitud
            data = json.loads(request.body)

            # Extraer los campos del proveedor
            nombre_proveedor = data.get('nombre_proveedor')
            contacto_correo = data.get('contacto_correo')
            moneda = data.get('moneda')
            direccion = data.get('direccion')
            telefono = data.get('telefono')
            credito_termino = data.get('credito_termino')
            giro_sector = data.get('giro_sector')

            # Validar que el nombre del proveedor esté presente
            if not nombre_proveedor:
                return JsonResponse({'error': 'Falta el campo nombre_proveedor'}, status=400)

            # Comprobar si el proveedor ya existe
            if Proveedor.objects.filter(nombre_proveedor=nombre_proveedor).exists():
                return JsonResponse({'error': 'El proveedor con este nombre ya existe'}, status=400)

            # Crear un nuevo proveedor con todos los campos
            proveedor = Proveedor(
                nombre_proveedor=nombre_proveedor,
                contacto_correo=contacto_correo,
                moneda=moneda,
                direccion=direccion,
                telefono=telefono,
                credito_termino=credito_termino,
                giro_sector=giro_sector,
            )
            proveedor.save()

            # Devolver la respuesta con el proveedor creado
            return JsonResponse({
                'id': proveedor.id,
                'nombre_proveedor': proveedor.nombre_proveedor,
                'contacto_correo': proveedor.contacto_correo,
                'moneda': proveedor.moneda,
                'direccion': proveedor.direccion,
                'telefono': proveedor.telefono,
                'credito_termino': proveedor.credito_termino,
                'giro_sector': proveedor.giro_sector,
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Error al procesar los datos JSON'}, status=400)
        except Exception as e:
            # Aquí agregamos más detalles sobre el error
            return JsonResponse({'error': f'Error interno del servidor: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
@api_view(['PUT'])
def editar_producto(request, id):
    try:
        producto = Producto.objects.get(id=id)
    except Producto.DoesNotExist:
        return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductoSerializer(producto, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def agregar_categoria(request):
    if request.method == 'POST':
        nombre_categoria = request.data.get('nombre_categoria')
        if nombre_categoria:
            categoria = Categoria.objects.create(nombre_categoria=nombre_categoria)
            return Response({'id': categoria.id, 'nombre_categoria': categoria.nombre_categoria}, status=status.HTTP_201_CREATED)
        return Response({'error': 'Nombre de la categoría es requerido'}, status=status.HTTP_400_BAD_REQUEST)




# Vista para listar productos


# Vista para listar productos
def api_lista_productos(request):
    if request.method == 'GET':
        productos = Producto.objects.all().values(
            'id',
            'nombre_producto',  # Campo existente en Producto
            'primerasentradas__descripcion',  # Campo relacionado desde PrimerasEntradas
            'primerasentradas__cantidad',  # Campo relacionado desde PrimerasEntradas
        )
        return JsonResponse(list(productos), safe=False)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

# Vista para modificar productos
@csrf_exempt
def api_modificar_producto(request, id):
    if request.method == 'PUT':
        # Depuración para verificar que se recibe el ID
        print(f"ID recibido: {id}")

        # Obtener el producto o devolver un error 404
        producto = get_object_or_404(Producto, id=id)

        # Parsear los datos del cuerpo de la solicitud
        data = json.loads(request.body)
        print(f"Datos recibidos: {data}")

        # Actualizar los campos del producto
        producto.nombre_producto = data.get('nombre_producto', producto.nombre_producto)
        producto.descripcion = data.get('descripcion', producto.descripcion)
        producto.nombre_categoria = data.get('nombre_categoria', producto.nombre_categoria)

        try:
            # Guardar el producto en la base de datos
            producto.save()
            return JsonResponse({
                'id': producto.id,
                'nombre_producto': producto.nombre_producto,
                'descripcion': producto.descripcion,
                'nombre_categoria': producto.nombre_categoria,
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
            print("Datos recibidos:", data)  # Verifica los datos que llegan

            nombre_producto = data.get('nombre_producto')
            descripcion = data.get('descripcion', '')
            nombre_categoria = data.get('nombre_categoria')

            # Validación de campos obligatorios
            if not nombre_producto or not nombre_categoria:
                return JsonResponse({'error': 'El nombre del producto y la categoría son obligatorios.'}, status=400)

            # Crear el producto
            producto = Producto.objects.create(
                nombre_producto=nombre_producto,
                descripcion=descripcion,
                nombre_categoria=nombre_categoria
            )

            # Responder con éxito
            return JsonResponse({
                'message': 'Producto agregado correctamente',
                'id': producto.id,
                'nombre_producto': producto.nombre_producto,
                'descripcion': producto.descripcion,
                'nombre_categoria': producto.nombre_categoria
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato JSON inválido.'}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

@api_view(['POST'])
def agregar_entrada(request):
    if request.method == 'POST':
        formData = request.data
        print('Datos recibidos:', formData)  # Verifica qué datos estás recibiendo

        # Obtener los datos del formulario
        nombre_producto = formData.get('producto')
        nombre_proveedor = formData.get('proveedor')
        nombre_categoria = formData.get('categoria', None)
        descripcion = formData.get('descripcion')
        precio = formData.get('precio')
        cantidad = formData.get('cantidad')
        fecha_ingreso = formData.get('fecha_ingreso')
        numero_serie = formData.get('numero_serie')
        moneda = formData.get('moneda')
        comentarios = formData.get('comentarios')
        cantidad_minima = formData.get('cantidad_minima')
        cantidad_maxima = formData.get('cantidad_maxima')

        # Validación de datos recibidos
        if not nombre_producto or not nombre_proveedor or not descripcion or not cantidad:
            return JsonResponse({'error': 'Producto, proveedor, descripción y cantidad son obligatorios.'}, status=400)

        # Buscar producto, proveedor y categoría
        try:
            producto = Producto.objects.get(id=nombre_producto)  # Usamos 'id' en lugar de 'nombre_producto'
        except Producto.DoesNotExist:
            return JsonResponse({'error': 'Producto no encontrado.'}, status=400)
        except Producto.MultipleObjectsReturned:
            return JsonResponse({'error': 'Múltiples productos encontrados con ese ID.'}, status=400)

        try:
            proveedor = Proveedor.objects.get(id=nombre_proveedor)  # Asegúrate de que sea por 'id'
        except Proveedor.DoesNotExist:
            return JsonResponse({'error': 'Proveedor no encontrado.'}, status=400)

        categoria = None
        if nombre_categoria:
            try:
                categoria = Categoria.objects.get(id=nombre_categoria)  # Asegúrate de que sea por 'id'
            except Categoria.DoesNotExist:
                return JsonResponse({'error': 'Categoría no encontrada.'}, status=400)

        # Validar los valores de cantidad_minima y cantidad_maxima
        try:
            cantidad_minima = float(cantidad_minima) if cantidad_minima else None
            cantidad_maxima = float(cantidad_maxima) if cantidad_maxima else None
        except ValueError:
            return JsonResponse({'error': 'Cantidad mínima y máxima deben ser números válidos.'}, status=400)

        # Crear la nueva entrada
        nueva_entrada = PrimerasEntradas.objects.create(
            producto=producto,
            proveedor=proveedor,
            categoria=categoria,
            descripcion=descripcion,
            precio=precio,
            cantidad=cantidad,
            fecha_ingreso=fecha_ingreso,
            numero_serie=numero_serie,
            moneda=moneda,
            comentarios=comentarios,
            cantidad_minima=cantidad_minima,
            cantidad_maxima=cantidad_maxima
        )

        # Serializar la entrada recién creada
        serializer = PrimerasEntradasSerializer(nueva_entrada)

        return JsonResponse({'message': 'Entrada registrada exitosamente', 'data': serializer.data}, status=201)

    return JsonResponse({'error': 'Método no permitido'}, status=405)



@api_view(['GET'])
def lista_primeras_entradas(request):
    """
    Devuelve una lista de todas las primeras entradas.
    """
    try:
        entradas = PrimerasEntradas.objects.all()
        serializer = PrimerasEntradasSerializer(entradas, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['DELETE'])
def eliminar_producto(request, nombre):
    try:
        # Buscar todos los productos con el mismo nombre
        productos = Producto.objects.filter(descripcion=nombre)

        if not productos:
            return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Eliminar el primer producto encontrado
        productos.first().delete()
        return Response({"detail": "Producto eliminado exitosamente."}, status=status.HTTP_204_NO_CONTENT)

    except Producto.DoesNotExist:
        return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
def manejar_min_max(request, id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            cantidad_minima = data.get('cantidad_minima')
            cantidad_maxima = data.get('cantidad_maxima')

            # Busca el producto y actualiza min y max
            producto = get_object_or_404(Producto, id=id)
            producto.cantidad_minima = cantidad_minima
            producto.cantidad_maxima = cantidad_maxima
            producto.save()

            return JsonResponse({
                'message': 'Valores de mínimo y máximo actualizados exitosamente',
                'cantidad_minima': producto.cantidad_minima,
                'cantidad_maxima': producto.cantidad_maxima
            }, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'GET':
        producto = get_object_or_404(Producto, id=id)
        return JsonResponse({
            'cantidad_minima': producto.cantidad_minima,
            'cantidad_maxima': producto.cantidad_maxima
        }, status=200)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt  # Si no estás usando CSRF o si lo necesitas para pruebas
def modificar_proveedor(request, pk):
    if request.method == 'PUT':
        try:
            # Decodificar el cuerpo de la solicitud como JSON
            data = json.loads(request.body.decode('utf-8'))

            # Buscar el proveedor por su id (pk)
            proveedor = Proveedor.objects.get(pk=pk)

            # Actualizar los campos del proveedor con los datos del JSON
            proveedor.nombre_proveedor = data.get('nombre_proveedor', proveedor.nombre_proveedor)
            proveedor.contacto_correo = data.get('contacto_correo', proveedor.contacto_correo)
            proveedor.telefono = data.get('telefono', proveedor.telefono)
            proveedor.direccion = data.get('direccion', proveedor.direccion)
            proveedor.moneda = data.get('moneda', proveedor.moneda)
            proveedor.credito_termino = data.get('credito_termino', proveedor.credito_termino)
            proveedor.giro_sector = data.get('giro_sector', proveedor.giro_sector)
            
            # Guardar los cambios
            proveedor.save()

            # Responder con éxito
            return JsonResponse({'message': 'Proveedor actualizado exitosamente'}, status=200)

        except Proveedor.DoesNotExist:
            return JsonResponse({'error': 'Proveedor no encontrado'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Error en el formato JSON'}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

@api_view(['DELETE'])
def eliminar_proveedor(request, pk):
    try:
        proveedor = Proveedor.objects.get(pk=pk)
        proveedor.delete()
        return Response({'mensaje': 'Proveedor eliminado exitosamente'})
    except Proveedor.DoesNotExist:
        return Response({'error': 'Proveedor no encontrado'}, status=404)
    

    

@api_view(['PUT'])
def modificar_listaentradas(request, id):
    if request.method == 'PUT':
        formData = request.data
        print('Datos recibidos:', formData)  # Verifica qué datos estás recibiendo

        # Obtener los datos del formulario
        nombre_producto = formData.get('producto')
        nombre_proveedor = formData.get('proveedor')
        nombre_categoria = formData.get('categoria', None)
        descripcion = formData.get('descripcion')
        precio = formData.get('precio')
        cantidad = formData.get('cantidad')
        fecha_ingreso = formData.get('fecha_ingreso')
        numero_serie = formData.get('numero_serie')
        moneda = formData.get('moneda')
        comentarios = formData.get('comentarios')
        cantidad_minima = formData.get('cantidad_minima')
        cantidad_maxima = formData.get('cantidad_maxima')

        # Validación de datos recibidos
        if not nombre_producto or not nombre_proveedor or not descripcion or not cantidad:
            return JsonResponse({'error': 'Producto, proveedor, descripción y cantidad son obligatorios.'}, status=400)

        # Buscar la entrada a modificar por su ID
        try:
            entrada = PrimerasEntradas.objects.get(id=id)
        except PrimerasEntradas.DoesNotExist:
            return JsonResponse({'error': 'Entrada no encontrada.'}, status=400)

        # Buscar producto, proveedor y categoría
        try:
            producto = Producto.objects.get(id=nombre_producto)  # Usamos 'id' en lugar de 'nombre_producto'
        except Producto.DoesNotExist:
            return JsonResponse({'error': 'Producto no encontrado.'}, status=400)
        except Producto.MultipleObjectsReturned:
            return JsonResponse({'error': 'Múltiples productos encontrados con ese ID.'}, status=400)

        try:
            proveedor = Proveedor.objects.get(id=nombre_proveedor)  # Asegúrate de que sea por 'id'
        except Proveedor.DoesNotExist:
            return JsonResponse({'error': 'Proveedor no encontrado.'}, status=400)

        categoria = None
        if nombre_categoria:
            try:
                categoria = Categoria.objects.get(id=nombre_categoria)  # Asegúrate de que sea por 'id'
            except Categoria.DoesNotExist:
                return JsonResponse({'error': 'Categoría no encontrada.'}, status=400)

        # Validar los valores de cantidad_minima y cantidad_maxima
        try:
            cantidad_minima = float(cantidad_minima) if cantidad_minima else None
            cantidad_maxima = float(cantidad_maxima) if cantidad_maxima else None
        except ValueError:
            return JsonResponse({'error': 'Cantidad mínima y máxima deben ser números válidos.'}, status=400)

        # Modificar los campos de la entrada con los nuevos valores
        entrada.producto = producto
        entrada.proveedor = proveedor
        entrada.categoria = categoria
        entrada.descripcion = descripcion
        entrada.precio = precio
        entrada.cantidad = cantidad
        entrada.fecha_ingreso = fecha_ingreso
        entrada.numero_serie = numero_serie
        entrada.moneda = moneda
        entrada.comentarios = comentarios
        entrada.cantidad_minima = cantidad_minima
        entrada.cantidad_maxima = cantidad_maxima

        # Guardar los cambios en la entrada
        entrada.save()

        # Serializar la entrada modificada
        serializer = PrimerasEntradasSerializer(entrada)

        return JsonResponse({'message': 'Entrada modificada exitosamente', 'data': serializer.data}, status=200)

    return JsonResponse({'error': 'Método no permitido'}, status=405)