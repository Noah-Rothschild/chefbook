import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from chefbook.models import Ingredient

class Command(BaseCommand):
    help = 'Sync ingredients from Spoonacular API with local database'

    def handle(self, *args, **kwargs):
        print("Test")
        api_key = settings.SPOONACULAR_API_KEY
        if not api_key:
            self.stderr.write("API key not in settings.")
            return
        
        url = "https://api.spoonacular.com/food/ingredients/search"
        offset = 0
        number = 100
        params = {
            'query': '',
            'apiKey': api_key,
            'number': number,
            'offset': offset
        }

        while True:
            response =requests.get(url, params= params)
            print(response.__dict__)
            data = response.json()
            results = data.get('results', [])
            print(results)
            if not results:
                break

            for item in results:
                Ingredient.objects.update_or_create(
                    name=item['name'],
                    defaults = {
                        'category': item.get('aisle', "Uncategorized")
                    }
                )

            offset += number
            print("Successfully done 100")

        print("Sync Complete")
            

