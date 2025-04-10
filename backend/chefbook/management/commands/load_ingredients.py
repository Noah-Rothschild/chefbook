from django.core.management.base import BaseCommand
from chefbook.models import Ingredient

class Command(BaseCommand):
    help = 'Loads a predifined database of ingredients.'

    def handle(self, *args, **kwargs):

        COMMON_INGREDIENTS = [
            # Spices & Seasonings
            ("Salt", "Spices and Seasonings"),
            ("Black Pepper", "Spices and Seasonings"),
            ("Cinnamon", "Spices and Seasonings"),
            ("Cumin", "Spices and Seasonings"),
            ("Paprika", "Spices and Seasonings"),
            ("Chili Powder", "Spices and Seasonings"),
            ("Oregano", "Spices and Seasonings"),
            ("Basil", "Spices and Seasonings"),
            ("Thyme", "Spices and Seasonings"),
            ("Rosemary", "Spices and Seasonings"),
            ("Turmeric", "Spices and Seasonings"),
            ("Nutmeg", "Spices and Seasonings"),
            ("Cayenne Pepper", "Spices and Seasonings"),
            ("Garlic Powder", "Spices and Seasonings"),
            ("Onion Powder", "Spices and Seasonings"),

            # Baking
            ("Sugar", "Baking"),
            ("Brown Sugar", "Baking"),
            ("Flour", "Baking"),
            ("Baking Powder", "Baking"),
            ("Baking Soda", "Baking"),
            ("Vanilla Extract", "Baking"),
            ("Yeast", "Baking"),
            ("Cornstarch", "Baking"),
            ("Cocoa Powder", "Baking"),

            # Produce
            ("Garlic", "Produce"),
            ("Onion", "Produce"),
            ("Tomato", "Produce"),
            ("Carrot", "Produce"),
            ("Potato", "Produce"),
            ("Spinach", "Produce"),
            ("Broccoli", "Produce"),
            ("Lettuce", "Produce"),
            ("Cucumber", "Produce"),
            ("Bell Pepper", "Produce"),
            ("Zucchini", "Produce"),
            ("Celery", "Produce"),
            ("Mushrooms", "Produce"),
            ("Avocado", "Produce"),
            ("Green Beans", "Produce"),
            ("Cabbage", "Produce"),
            ("Corn", "Produce"),
            ("Sweet Potato", "Produce"),
            ("Chili Peppers", "Produce"),

            # Dairy
            ("Milk", "Dairy"),
            ("Butter", "Dairy"),
            ("Cheddar Cheese", "Dairy"),
            ("Parmesan Cheese", "Dairy"),
            ("Yogurt", "Dairy"),
            ("Cream", "Dairy"),
            ("Sour Cream", "Dairy"),
            ("Eggs", "Dairy"),

            # Pantry & Oils
            ("Olive Oil", "Pantry"),
            ("Vegetable Oil", "Pantry"),
            ("Canola Oil", "Pantry"),
            ("Soy Sauce", "Pantry"),
            ("Vinegar", "Pantry"),
            ("Honey", "Pantry"),
            ("Maple Syrup", "Pantry"),
            ("Peanut Butter", "Pantry"),
            ("Ketchup", "Pantry"),
            ("Mustard", "Pantry"),

            # Grains & Pasta
            ("White Rice", "Grains"),
            ("Brown Rice", "Grains"),
            ("Pasta", "Grains"),
            ("Quinoa", "Grains"),
            ("Oats", "Grains"),
            ("Bread", "Grains"),
            ("Tortilla", "Grains"),

            # Meat & Seafood
            ("Chicken Breast", "Meat"),
            ("Ground Beef", "Meat"),
            ("Pork Chops", "Meat"),
            ("Bacon", "Meat"),
            ("Salmon", "Seafood"),
            ("Tuna", "Seafood"),
            ("Shrimp", "Seafood"),

            # Legumes
            ("Black Beans", "Legumes"),
            ("Chickpeas", "Legumes"),
            ("Lentils", "Legumes"),
            ("Kidney Beans", "Legumes"),
            ("Green Peas", "Legumes"),

            # Fruits
            ("Apple", "Fruits"),
            ("Banana", "Fruits"),
            ("Orange", "Fruits"),
            ("Lemon", "Fruits"),
            ("Lime", "Fruits"),
            ("Strawberries", "Fruits"),
            ("Blueberries", "Fruits"),
            ("Pineapple", "Fruits"),
            ("Grapes", "Fruits"),

            # Nuts & Seeds
            ("Almonds", "Nuts and Seeds"),
            ("Walnuts", "Nuts and Seeds"),
            ("Sunflower Seeds", "Nuts and Seeds"),
            ("Chia Seeds", "Nuts and Seeds"),
            ("Flax Seeds", "Nuts and Seeds"),
        ]


        for name, category in COMMON_INGREDIENTS:
            Ingredient.objects.get_or_create(name=name, defaults={"category": category})