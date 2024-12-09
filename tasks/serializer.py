from rest_framework import serializers
from .models import Producto, PrimerasEntradas, Categoria, Proveedor

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class PrimerasEntradasSerializer(serializers.ModelSerializer):
    producto = serializers.CharField(source='producto.nombre_producto')
    proveedor = serializers.CharField(source='proveedor.nombre_proveedor')
    categoria = serializers.CharField(source='categoria.nombre_categoria', allow_null=True)

    class Meta:
        model = PrimerasEntradas
        fields = [
            'id',
            'producto',
            'proveedor',
            'categoria',
            'descripcion',
            'precio',
            'cantidad',
            'fecha_ingreso',
            'numero_serie',
            'moneda',
            'comentarios',
            'cantidad_minima',
            'cantidad_maxima',
        ]

    def update(self, instance, validated_data):
        producto_data = validated_data.pop('producto', None)

        if producto_data:
            try:
                # Verifica si el producto existe
                producto = Producto.objects.get(nombre_producto=producto_data)
                instance.producto = producto
            except Producto.DoesNotExist:
                raise serializers.ValidationError(f"Producto '{producto_data}' no encontrado.")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def validate(self, data):
        if not data.get('producto'):
            raise serializers.ValidationError("El campo 'producto' es obligatorio.")
        if not data.get('proveedor'):
            raise serializers.ValidationError("El campo 'proveedor' es obligatorio.")
        return data

# Serializador para Categoria
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre_categoria']

# Serializador para Proveedor
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre_proveedor', 'contacto_correo', 'telefono', 'direccion', 'moneda', 'credito_termino', 'giro_sector']