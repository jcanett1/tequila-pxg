# Generated by Django 5.0.9 on 2024-11-05 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0009_nuevoproduct_tipo_producto'),
    ]

    operations = [
        migrations.AddField(
            model_name='nuevoproduct',
            name='cantidad_maxima',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='nuevoproduct',
            name='cantidad_minima',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='producto',
            name='cantidad_maxima',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='producto',
            name='cantidad_minima',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
