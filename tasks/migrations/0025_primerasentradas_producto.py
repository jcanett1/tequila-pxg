# Generated by Django 5.0.9 on 2024-12-02 16:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0024_remove_primerasentradas_nombre_proveedor_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='primerasentradas',
            name='producto',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='tasks.producto'),
        ),
    ]
