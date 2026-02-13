# chefbook
ChefBook is a full-stack web application that allows users to manage a pantry of ingredients and receive recipe suggestions based on what they already have available.

The goal of the project was to build a cleanly structured web application with a clear separation between frontend, backend, and business logic.

# Tech Stack

Backend:
- Python
- Django
- Django REST Framework
- JWT Authentication
- SQLite (development)

Frontend:
- React
- JavaScript
- HTML & CSS

# Features
- User registration and login (JWT authentication)
- Secure, user-specific pantry storage
- Add and manage pantry ingredients
- REST API for frontend-backend communication
- Recipe suggestions based on available ingredients

# Getting Started (Locally)
Backend: 
```
env\Scripts\activate

cd backend
pip install -r requirements.txt
py -m manage load_ingredients
py -m manage makemigrations
py -m manage migrate
py -m manage runserver
```

Frontend:
```
env\Scripts\activate

cd frontend
npm install
npm run dev
```

# Future Improvements

- Production deployment setup
- AI Recipe Creator
- Better UI Polish
- Recipe Favoriting and storage
