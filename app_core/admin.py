from django.contrib import admin


from django.contrib import admin
from .models import Brand, Campaign, Asset, UnitType, SparkUnit, Tag

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
	search_fields = ["name"]
	list_display = ["id", "name", "created_at"]

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
	search_fields = ["name", "brand__name"]
	list_filter = ["brand"]
	list_display = ["id", "brand", "name", "created_at"]

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
	list_display = ["id", "campaign", "media_type", "external_ref", "created_at"]
	list_filter = ["media_type", "campaign__brand"]
	search_fields = ["external_ref", "campaign__name", "campaign__brand__name"]

@admin.register(UnitType)
class UnitTypeAdmin(admin.ModelAdmin):
	list_display = ["id", "code", "name"]
	search_fields = ["code", "name"]

@admin.register(SparkUnit)
class SparkUnitAdmin(admin.ModelAdmin):
	list_display = ["id", "code", "name", "unit_type", "default_weight"]
	list_filter = ["unit_type"]
	search_fields = ["code", "name"]

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
	list_display = ["id", "name", "category"]
	list_filter = ["category"]
	search_fields = ["name", "category"]
