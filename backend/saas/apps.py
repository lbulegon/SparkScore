from django.apps import AppConfig


class SaasConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "saas"
    verbose_name = "SaaS (extensível)"

    def ready(self) -> None:
        import saas.signals  # noqa: F401
