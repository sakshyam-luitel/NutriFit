from django.contrib import admin
from .models import MedicalReport, Disease

@admin.register(MedicalReport)
class MedicalReportAdmin(admin.ModelAdmin):
    list_display = ('user', 'report_type', 'scan_date', 'status')
    list_filter = ('report_type', 'status', 'scan_date')
    search_fields = ('user__email', 'detected_conditions')

@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = ('name', 'severity', 'category')
    list_filter = ('severity', 'category')
    search_fields = ('name', 'description')