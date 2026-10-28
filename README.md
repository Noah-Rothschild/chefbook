# chefbook
ChefBook is a full-stack web application that allows users to manage a pantry of ingredients and receive recipe suggestions based on what they already have available.

The goal of the project was to build a cleanly structured web application with a clear separation between frontend, backend, and business logic.

# Tech Stack

Backend:
- Python
- Django
- Django REST Framework
- JWT Authentication
- SQLite (development), PostgreSQL (production)

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
Backend (from the repo root, with your virtual environment activated):
```
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py load_ingredients
python manage.py runserver
```

Create `backend/backend/.env` with your Spoonacular key:
```
SPOONACULAR_API_KEY=your-key-here
```
Nothing else is needed locally: without other settings Django runs in debug mode on SQLite.

Frontend:
```
cd frontend
npm install
npm run dev
```

Create `frontend/.env` pointing at the local API:
```
VITE_API_URL=http://127.0.0.1:8000
```

# Deploying
The frontend runs on **Vercel**, the Django API on **Render** and the database on **Neon** (PostgreSQL). All three have free plans. Set them up in this order:

## 1. Database: Neon
1. Create a project at [neon.tech](https://neon.tech).
2. Copy the connection string (the direct one, not the pooled one). It looks like `postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`.

## 2. API: Render
1. In [Render](https://render.com), choose **New > Blueprint** and connect this GitHub repo. Render reads [`render.yaml`](render.yaml).
2. Fill in the values it asks for:
   - `DATABASE_URL`: the Neon connection string.
   - `SPOONACULAR_API_KEY`: your Spoonacular key.
   - `CORS_ALLOWED_ORIGINS`: leave as a placeholder (for example `https://example.com`) until step 4.
3. Deploy. Each deploy runs [`backend/build.sh`](backend/build.sh), which installs packages, collects static files, runs migrations and loads the ingredient list. `DJANGO_SECRET_KEY` is generated for you.
4. Note the service address, for example `https://chefbook-api.onrender.com`. Opening `/healthz/` there should show `ok`.

## 3. Frontend: Vercel
1. In [Vercel](https://vercel.com), choose **Add New > Project** and import this repo.
2. Set **Root Directory** to `frontend`. Vercel detects Vite automatically.
3. Add the environment variable `VITE_API_URL` = the Render address from step 2.
4. Deploy and note the site address, for example `https://chefbook.vercel.app`.

## 4. Connect them
Back in Render, set `CORS_ALLOWED_ORIGINS` to the Vercel address: exact, starting with `https://`, no trailing slash. Separate several addresses with commas. Saving redeploys the API. Then open the Vercel site and create an account.

## Good to know
- **Cold starts:** Render's free plan sleeps after about 15 minutes without traffic. The first request after that (for example logging in) can take 30–60 seconds.
- **Preview deployments:** only addresses listed in `CORS_ALLOWED_ORIGINS` can call the API, so Vercel preview URLs won't work unless you add them.
- **Admin account:** to create one, run this locally with `DATABASE_URL` set to the Neon connection string:
  ```
  python manage.py createsuperuser
  ```
- **Spoonacular limits:** the free Spoonacular plan has a small daily quota that applies to everyone using the site.

# Future Improvements

- AI Recipe Creator
- Better UI Polish
- Recipe Favoriting and storage
