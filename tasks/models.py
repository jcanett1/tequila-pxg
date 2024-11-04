from django.db import models

# Modelo de usuario
class User(models.Model):
    UserID = models.AutoField(primary_key=True)
    Username = models.CharField(max_length=50)
    Password = models.CharField(max_length=8)
    CreatedAt = models.DateField()

    class Meta:
        db_table = 'Users'

    def __str__(self):
        return self.Username

# Modelo de producto eliminado
class ProductoEliminado(models.Model):
    descripcion = models.CharField(max_length=255)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField()
    proveedor = models.CharField(max_length=255)
    fecha_ingreso = models.DateField()
    numero_serie = models.CharField(max_length=255)
    moneda = models.CharField(max_length=10)
    unidad = models.CharField(max_length=10)
    comentarios = models.TextField(blank=True, null=True)
    fecha_eliminacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Producto eliminado: {self.descripcion} - {self.fecha_eliminacion}"

# Modelo de producto
class Producto(models.Model):
    TIPO_PRODUCTO_CHOICES = [
        ('nuevo', 'Nuevo'),
        ('existente', 'Existente')
    ]

    MONEDA_CHOICES = [
        ('MXN', 'Pesos Mexicanos'),
        ('USD', 'Dólares Americanos'),
    ]

    UNIDAD_CHOICES = [
        ('PZA', 'Piezas'),
        ('METROS', 'Metros'),
        ('LITROS', 'Litros'),
        ('CAJAS', 'Cajas'),
    ]

  

    tipo_producto = models.CharField(max_length=10, choices=TIPO_PRODUCTO_CHOICES, default='nuevo')  # Nuevo campo
    descripcion = models.CharField(max_length=255)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField()
    proveedor = models.CharField(max_length=255, null=True, blank=True)
    fecha_ingreso = models.DateField()
    numero_serie = models.CharField(max_length=100, null=True, blank=True)
    moneda = models.CharField(max_length=3, choices=MONEDA_CHOICES, default='MXN')
    unidad = models.CharField(max_length=6, choices=UNIDAD_CHOICES, default='PZA')
    comentarios = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.descripcion

from django.db import models

class NuevoProduct(models.Model):
    tipo_producto = models.CharField(max_length=10, choices=[('nuevo', 'Nuevo'), ('existente', 'Existente')], null=True)
    descripcion = models.CharField(max_length=255)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField()
    proveedor = models.CharField(max_length=255)
    fecha_ingreso = models.DateField()
    numero_serie = models.CharField(max_length=100, unique=True)
    moneda = models.CharField(max_length=3, choices=[('MXN', 'Pesos'), ('USD', 'Dólares')])
    comentarios = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.descripcion
    
