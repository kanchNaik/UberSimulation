# Generated by Django 5.1.4 on 2024-12-08 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('driver', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='driver',
            name='locationCity',
            field=models.CharField(default='San Francisco', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='driver',
            name='locationName',
            field=models.CharField(default='Painted Ladies', max_length=100),
            preserve_default=False,
        ),
    ]
