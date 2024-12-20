# Generated by Django 5.0.9 on 2024-11-21 20:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0014_categoria_entrada_proveedor_delete_nuevoproduct_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PrimerasEntradas',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre_producto', models.CharField(max_length=255)),
                ('descripcion', models.TextField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('moneda', models.CharField(max_length=10)),
                ('cantidad', models.PositiveIntegerField()),
                ('unidad', models.CharField(max_length=50)),
                ('nombre_proveedor', models.CharField(max_length=255)),
                ('fecha_ingreso', models.DateField()),
                ('nombre_categoria', models.CharField(max_length=255)),
                ('numero_serie', models.CharField(blank=True, max_length=255, null=True)),
                ('maneja_cantidad_min_max', models.BooleanField(default=False)),
                ('cantidad_minima', models.PositiveIntegerField(blank=True, null=True)),
                ('cantidad_maxima', models.PositiveIntegerField(blank=True, null=True)),
                ('comentarios', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.DeleteModel(
            name='Entrada',
        ),
    ]
