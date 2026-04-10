"""Onboarding: cada novo utilizador recebe Tenant + projeto padrão."""

from __future__ import annotations

from django.contrib.auth.models import User
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from saas.models import Project, Tenant, UserProfile


@receiver(post_save, sender=User)
def create_tenant_for_new_user(sender, instance: User, created: bool, **kwargs) -> None:
    if not created:
        return
    if UserProfile.objects.filter(user=instance).exists():
        return

    with transaction.atomic():
        tenant = Tenant.objects.create(name=instance.get_username()[:100])
        Project.objects.create(tenant=tenant, name="Default Project")
        UserProfile.objects.create(user=instance, tenant=tenant)
