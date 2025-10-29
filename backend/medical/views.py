from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import os
from .models import MedicalReport, Disease
from .serializers import MedicalReportSerializer, MedicalReportUploadSerializer, DiseaseSerializer
from .scanner import MedicalDocumentScanner

class MedicalReportListView(generics.ListAPIView):
    serializer_class = MedicalReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MedicalReport.objects.filter(user=self.request.user)

class MedicalReportDetailView(generics.RetrieveAPIView):
    serializer_class = MedicalReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MedicalReport.objects.filter(user=self.request.user)

class MedicalReportUploadView(generics.CreateAPIView):
    serializer_class = MedicalReportUploadSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        report = serializer.save()
        
        # Return report with message
        return Response(
            {
                'report': MedicalReportSerializer(report).data,
                'message': 'Report uploaded successfully. Use the analyze endpoint to process it.'
            },
            status=status.HTTP_201_CREATED
        )

class AnalyzeMedicalReportView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            # Get report
            report = MedicalReport.objects.get(id=pk, user=request.user)
            
            if report.status == 'completed':
                return Response(
                    {'message': 'Report already analyzed'},
                    status=status.HTTP_200_OK
                )
            
            # Update status
            report.status = 'processing'
            report.save()
            
            # Get file path
            file_path = report.file.path
            
            # Initialize scanner
            scanner = MedicalDocumentScanner()
            
            # Analyze report
            analysis_result = scanner.analyze_report(file_path)
            
            # Update report with results
            report.extracted_text = analysis_result['extracted_text']
            report.detected_conditions = ', '.join(analysis_result['detected_conditions'])
            report.health_metrics = analysis_result['health_metrics']
            report.ai_insights = analysis_result['ai_insights']
            report.status = analysis_result['status']
            
            # Match detected conditions with disease database
            if analysis_result['detected_conditions']:
                diseases = Disease.objects.filter(
                    name__in=analysis_result['detected_conditions']
                )
                report.detected_diseases.set(diseases)
            
            # Generate dietary recommendations
            dietary_recs = []
            for disease in report.detected_diseases.all():
                dietary_recs.append(f"For {disease.name}: {disease.dietary_guidelines}")
            
            report.dietary_recommendations = "\n\n".join(dietary_recs) if dietary_recs else "Maintain a balanced, wholesome diet."
            report.save()
            
            serializer = MedicalReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except MedicalReport.DoesNotExist:
            return Response(
                {'error': 'Report not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            report.status = 'failed'
            report.ai_insights = f"Analysis failed: {str(e)}"
            report.save()
            
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class DiseaseListView(generics.ListAPIView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    permission_classes = [IsAuthenticated]