from django.urls import path

from api import views, views_auth, views_dashboard, views_user

urlpatterns = [
    path("", views.index, name="index"),
    path("health/", views.health, name="health"),
    path("api/sinaplint/saas/public/analyze/", views.public_analyze, name="public-analyze"),
    path("api/sinaplint/saas/v1/analyze/", views.analyze, name="saas-v1-analyze"),
    # Alias SparkScore (mesmas vistas; branding do produto)
    path("api/sparkscore/saas/public/analyze/", views.public_analyze, name="public-analyze-sparkscore"),
    path("api/sparkscore/saas/v1/analyze/", views.analyze, name="saas-v1-analyze-sparkscore"),
    path("analyze/", views.analyze, name="analyze"),
    path("auth/register/", views_auth.register, name="auth-register"),
    path("auth/login/", views_auth.login, name="auth-login"),
    path("me/", views_user.me, name="me"),
    path("me/analyses/", views_dashboard.me_analyses, name="me-analyses"),
    # Alias se a base URL incluir /api e o proxy chamar /api/auth/register/ (mesma vista).
    path("api/auth/register/", views_auth.register, name="auth-register-api-prefix"),
    path("api/auth/login/", views_auth.login, name="auth-login-api-prefix"),
    path("api/me/", views_user.me, name="me-api-prefix"),
    path("api/me/analyses/", views_dashboard.me_analyses, name="me-analyses-api-prefix"),
    path("api/analyze/", views.analyze, name="analyze-api-prefix"),
    path("api/health/", views.health, name="health-api-prefix"),
]
