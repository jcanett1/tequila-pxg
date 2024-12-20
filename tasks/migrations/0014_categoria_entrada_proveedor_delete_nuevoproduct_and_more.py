# Generated by Django 5.0.9 on 2024-11-21 18:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0013_alter_producto_stock'),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Entrada',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('cantidad_entrada', models.IntegerField()),
                ('fecha_entrada', models.DateTimeField(auto_now_add=True)),
                ('nombre_categoria', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Proveedor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_proveedor', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.DeleteModel(
            name='NuevoProduct',
        ),
        migrations.DeleteModel(
            name='ProductoEliminado',
        ),
        migrations.DeleteModel(
            name='User',
        ),
        migrations.RemoveField(
            model_name='producto',
            name='cantidad',
        ),
        migrations.RemoveField(
            model_name='producto',
            name='proveedor',
        ),
        migrations.RemoveField(
            model_name='producto',
            name='stock',
        ),
        migrations.RemoveField(
            model_name='producto',
            name='tipo_producto',
        ),
        migrations.AddField(
            model_name='producto',
            name='cantidad_producto',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='producto',
            name='nombre_categoria',
            field=models.CharField(default='Default Category', max_length=100),
        ),
        migrations.AddField(
            model_name='producto',
            name='nombre_producto',
            field=models.CharField(default='Default Product Name', max_length=100),
        ),
        migrations.AddField(
            model_name='producto',
            name='nombre_proveedor',
            field=models.CharField(default='Default Provider Name', max_length=100),
        ),
        migrations.AlterField(
            model_name='producto',
            name='descripcion',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='producto',
            name='fecha_ingreso',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='producto',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='producto',
            name='moneda',
            field=models.CharField(default='MXN', max_length=3),
        ),
        migrations.AlterField(
            model_name='producto',
            name='unidad',
            field=models.CharField(max_length=50),
        ),
        migrations.AddField(
            model_name='producto',
            name='categoria',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='tasks.categoria'),
        ),
        migrations.AddField(
            model_name='entrada',
            name='producto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='entradas', to='tasks.producto'),
        ),
    ]
