# Generated by Django 5.1.1 on 2024-12-09 07:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('driver', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='driver',
            name='locationCity',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='driver',
            name='locationName',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
