# Migration file: 0002_auto_create_producto.py
# Generated by Django 5.0.9 on 2024-10-18 04:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),  # Asegúrate de que este sea el nombre correcto de la primera migración
    ]

    operations = [
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.CharField(max_length=255)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('cantidad', models.IntegerField()),
                ('proveedor', models.CharField(blank=True, max_length=255, null=True)),
                ('fecha_ingreso', models.DateField()),
                ('numero_serie', models.CharField(blank=True, max_length=100, null=True)),
                # Aquí se incluye el campo de moneda con las opciones
                ('moneda', models.CharField(max_length=3, choices=[
                    ('MXN', 'Pesos Mexicanos'),
                    ('USD', 'Dólares Americanos')
                ], default='MXN')),
                # Agregar el campo de comentarios
                ('comentarios', models.TextField(blank=True, null=True)),  # Campo para comentarios,
       
            ],
        ),
    ]
