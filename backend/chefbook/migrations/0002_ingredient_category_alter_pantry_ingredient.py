# Generated by Django 5.1.7 on 2025-04-03 16:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chefbook', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ingredient',
            name='category',
            field=models.CharField(default='uncategorized', max_length=50),
        ),
        migrations.AlterField(
            model_name='pantry',
            name='ingredient',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='chefbook.ingredient'),
        ),
    ]
