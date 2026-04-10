"""Dados agregados para o painel do cliente (histórico de análises)."""

from __future__ import annotations

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from saas.models import Analysis, Project, UserProfile


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_analyses(request):
    """
    Lista as últimas análises SinapLint do tenant do utilizador (via token de sessão).
    """
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        return Response(
            {"error": "Perfil SaaS inexistente."},
            status=status.HTTP_404_NOT_FOUND,
        )

    tenant = profile.tenant
    project_qs = Project.objects.filter(tenant=tenant)
    analyses = (
        Analysis.objects.filter(project__in=project_qs)
        .select_related("project")
        .order_by("-created_at")[:100]
    )

    return Response(
        {
            "results": [
                {
                    "id": a.id,
                    "project_id": a.project_id,
                    "project_name": a.project.name,
                    "score": a.score,
                    "created_at": a.created_at.isoformat(),
                }
                for a in analyses
            ]
        }
    )
