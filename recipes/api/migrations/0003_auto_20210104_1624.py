# Generated by Django 3.1.5 on 2021-01-04 16:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210104_1550'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='body',
        ),
        migrations.AddField(
            model_name='recipe',
            name='body_en',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='recipe',
            name='body_it',
            field=models.TextField(default=''),
        ),
    ]
