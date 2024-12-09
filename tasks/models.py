from django.db import models

# Modelo para Proveedor (si no existe ya)
class Proveedor(models.Model):
    nombre_proveedor = models.CharField(max_length=100, unique=True)  # Nombre único del proveedor
    contacto_correo = models.EmailField(max_length=255, default="correo@example.com")
    moneda = models.CharField(max_length=3, default="USD")  # Ejemplo: USD como predeterminado
    direccion = models.CharField(max_length=255, default="Sin dirección")
    telefono = models.CharField(max_length=15, default="Sin especificar")
    credito_termino = models.CharField(max_length=100, default="Sin término de crédito")
    giro_sector = models.CharField(max_length=100, default="No especificado")
    def __str__(self):
        return self.nombre_proveedor

class Categoria(models.Model):
    nombre_categoria = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_categoria  # Este es el valor que se mostrará en el administrador
    
# Modelo para la tabla de productos
class Producto(models.Model):
    nombre_producto = models.CharField(max_length=100)
    nombre_categoria = models.CharField(max_length=100, default='Desconocida')
    descripcion = models.TextField(blank=True, null=True)  # Agregar el campo de descripción
    # Otros campos...

    def __str__(self):
        # Actualizar el método __str__() para que incluya la descripción, si la tienes
        return f"{self.nombre_producto} ({self.nombre_categoria}) - {self.descripcion[:50]}..."  # Muestra los primeros 50 caracteres de la descripción


# Modelo para la tabla de primeras entradas
class PrimerasEntradas(models.Model):
    id = models.AutoField(primary_key=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, null=True, blank=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    descripcion = models.TextField(null=True, blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cantidad = models.IntegerField()
    fecha_ingreso = models.DateField()
    numero_serie = models.CharField(max_length=100, null=True, blank=True)
    moneda = models.CharField(max_length=10, null=True, blank=True)
    comentarios = models.TextField(null=True, blank=True)
    cantidad_minima = models.IntegerField(null=True, blank=True)
    cantidad_maxima = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.descripcion} - {self.producto} Proveedor: {self.proveedor} - Fecha: {self.fecha_ingreso}"
    
    
class ListaEntradas(models.Model):  # Asegúrate de que este es el nombre correcto
    campo1 = models.CharField(max_length=100)
    campo2 = models.IntegerField()
    # Otros campos...

    def __str__(self):
        return self.campo1