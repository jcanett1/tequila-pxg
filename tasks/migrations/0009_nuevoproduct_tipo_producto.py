# Generated by Django 5.0.9 on 2024-11-01 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0008_producto_tipo_producto'),
    ]

    operations = [
        migrations.AddField(
            model_name='nuevoproduct',
            name='tipo_producto',
            field=models.CharField(choices=[('nuevo', 'Nuevo'), ('existente', 'Existente')], max_length=10, null=True),
        ),
    ]
