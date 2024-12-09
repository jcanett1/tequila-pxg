from django.contrib import admin
from .models import Producto, PrimerasEntradas, Categoria, Proveedor

admin.site.register(Producto)
admin.site.register(PrimerasEntradas)
admin.site.register(Categoria)
admin.site.register(Proveedor)