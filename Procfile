web: cd backend && python manage.py migrate --noinput && gunicorn setup.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120
