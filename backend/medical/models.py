import uuid
from django.db import models
from users.models import User

class Disease(models.Model):
    SEVERITY_CHOICES = [
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    ]
    
    CATEGORY_CHOICES = [
        ('metabolic', 'Metabolic'),
        ('cardiovascular', 'Cardiovascular'),
        ('digestive', 'Digestive'),
        ('nutritional', 'Nutritional Deficiency'),
        ('chronic', 'Chronic Disease'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='moderate')
    
    # Dietary recommendations
    dietary_guidelines = models.TextField(help_text='General dietary guidelines for this condition')
    foods_to_include = models.TextField(help_text='Recommended foods')
    foods_to_avoid = models.TextField(help_text='Foods to avoid')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'diseases'
        verbose_name = 'Disease'
        verbose_name_plural = 'Diseases'
    
    def __str__(self):
        return self.name

class MedicalReport(models.Model):
    REPORT_TYPE_CHOICES = [
        ('blood_test', 'Blood Test'),
        ('prescription', 'Prescription'),
        ('diagnosis', 'Diagnosis Report'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Analysis'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_reports')
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    
    # File information
    file = models.FileField(upload_to='medical_reports/%Y/%m/')
    file_path = models.CharField(max_length=500)
    
    # Scan results
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    extracted_text = models.TextField(blank=True)
    detected_conditions = models.TextField(blank=True, help_text='Detected medical conditions')
    detected_diseases = models.ManyToManyField(Disease, blank=True, related_name='reports')
    
    # Analysis results
    key_findings = models.JSONField(default=dict, blank=True)
    health_metrics = models.JSONField(default=dict, blank=True)
    ai_insights = models.TextField(blank=True)
    dietary_recommendations = models.TextField(blank=True)
    
    scan_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medical_reports'
        verbose_name = 'Medical Report'
        verbose_name_plural = 'Medical Reports'
        ordering = ['-scan_date']
    
    def __str__(self):
        return f"{self.user.email} - {self.report_type} ({self.scan_date.date()})"