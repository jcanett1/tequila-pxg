# Generated by Django 5.0.9 on 2024-12-02 15:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0023_primerasentradas_nombre_proveedor_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='primerasentradas',
            name='nombre_proveedor',
        ),
        migrations.AddField(
            model_name='primerasentradas',
            name='categoria',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='primeras_entradas', to='tasks.categoria'),
        ),
        migrations.AlterField(
            model_name='primerasentradas',
            name='proveedor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='primeras_entradas', to='tasks.proveedor'),
        ),
    ]
