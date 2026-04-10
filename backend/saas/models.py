import uuid

from django.conf import settings
from django.db import models


class Tenant(models.Model):
    """Cliente do SaaS — isolamento por chave de API."""

    name = models.CharField(max_length=100)
    api_key = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Project(models.Model):
    """Projeto analisável dentro de um tenant."""

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="projects")
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = [("tenant", "name")]

    def __str__(self) -> str:
        return f"{self.tenant.name} / {self.name}"


class Analysis(models.Model):
    """Histórico de execuções SinapLint por projeto."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="analyses")
    score = models.IntegerField()
    result = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Analyses"

    def __str__(self) -> str:
        return f"Analysis #{self.pk} score={self.score}"


class UserProfile(models.Model):
    """Liga `User` ao `Tenant` criado no onboarding (um tenant por conta)."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="userprofile",
    )
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="user_profiles")

    class Meta:
        verbose_name = "Perfil SaaS"
        verbose_name_plural = "Perfis SaaS"

    def __str__(self) -> str:
        return f"{self.user.get_username()} → {self.tenant.name}"
