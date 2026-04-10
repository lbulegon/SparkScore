from django.contrib import admin

from saas.models import Analysis, Project, Tenant, UserProfile


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ("name", "api_key", "created_at")
    readonly_fields = ("api_key", "created_at")
    search_fields = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "tenant", "created_at")
    list_filter = ("tenant",)
    search_fields = ("name", "tenant__name")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "tenant")
    search_fields = ("user__username", "tenant__name")


@admin.register(Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "score", "created_at")
    list_filter = ("project__tenant",)
    readonly_fields = ("result", "created_at")
    search_fields = ("project__name",)
