
from django.db import models


class TimeStampedModel(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		abstract = True

class Brand(TimeStampedModel):
	name = models.CharField(max_length=120, unique=True)

	class Meta:
		db_table = "brands"
		ordering = ["name"]

	def __str__(self):
		return self.name

class Campaign(TimeStampedModel):
	brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name="campaigns")
	name = models.CharField(max_length=160)
	description = models.TextField(blank=True, null=True)

	class Meta:
		db_table = "campaigns"
		unique_together = (("brand", "name"),)
		indexes = [models.Index(fields=["brand"])]
		ordering = ["brand__name", "name"]

	def __str__(self):
		return f"{self.brand} — {self.name}"

class Asset(TimeStampedModel):
	class MediaType(models.TextChoices):
		IMAGE = "image", "Image"
		VIDEO = "video", "Video"

	campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="assets")
	external_ref = models.CharField(max_length=160, blank=True, null=True)
	media_type = models.CharField(max_length=10, choices=MediaType.choices, default=MediaType.IMAGE)
	storage_url = models.CharField(max_length=512, blank=True, null=True)
	width = models.IntegerField(blank=True, null=True)
	height = models.IntegerField(blank=True, null=True)
	captured_at = models.DateTimeField(blank=True, null=True)

	class Meta:
		db_table = "assets"
		indexes = [
			models.Index(fields=["campaign"]),
			models.Index(fields=["external_ref"]),
		]
		ordering = ["-created_at", "id"]

	def __str__(self):
		return self.external_ref or f"Asset #{self.pk} ({self.media_type})"

class UnitType(models.Model):
	code = models.CharField(max_length=40, unique=True)  # visual, gestual, textual, contextual
	name = models.CharField(max_length=80)

	class Meta:
		db_table = "unit_types"
		ordering = ["name"]

	def __str__(self):
		return self.name

class SparkUnit(models.Model):
	code = models.CharField(max_length=64, unique=True)  # ex: olhar_direto, sombra_luz
	name = models.CharField(max_length=120)
	description = models.TextField(blank=True, null=True)
	unit_type = models.ForeignKey(UnitType, on_delete=models.PROTECT, related_name="spark_units")
	default_weight = models.DecimalField(max_digits=5, decimal_places=4, default=1.0)

	class Meta:
		db_table = "spark_units"
		indexes = [models.Index(fields=["unit_type"])]

	def __str__(self):
		return self.name

class Tag(models.Model):
	name = models.CharField(max_length=120, unique=True)   # ex: mito, status, frescor
	category = models.CharField(max_length=80, blank=True, null=True)  # emocional, cultural, etc.

	class Meta:
		db_table = "tags"
		ordering = ["name"]

	def __str__(self):
		return self.name
