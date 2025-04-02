from django.apps import AppConfig


class ChefbookConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chefbook'

    def ready(self):
        import chefbook.signals
