from rest_framework import serializers
from .models import MedicalReport, Disease

class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disease
        fields = '__all__'

class MedicalReportSerializer(serializers.ModelSerializer):
    detected_diseases = DiseaseSerializer(many=True, read_only=True)
    
    class Meta:
        model = MedicalReport
        fields = [
            'id', 'user', 'report_type', 'file', 'file_path',
            'status', 'extracted_text', 'detected_conditions',
            'detected_diseases', 'key_findings', 'health_metrics',
            'ai_insights', 'dietary_recommendations',
            'scan_date', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'file_path', 'status', 'extracted_text',
            'detected_conditions', 'key_findings', 'health_metrics',
            'ai_insights', 'dietary_recommendations', 'scan_date', 'updated_at'
        ]

class MedicalReportUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalReport
        fields = ['report_type', 'file']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['file_path'] = validated_data['file'].name
        return MedicalReport.objects.create(**validated_data)