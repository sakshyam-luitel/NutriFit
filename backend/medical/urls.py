from django.urls import path
from . import views

urlpatterns = [
    path('reports/', views.MedicalReportListView.as_view(), name='medical-reports'),
    path('reports/upload/', views.MedicalReportUploadView.as_view(), name='upload-report'),
    path('reports/<uuid:pk>/', views.MedicalReportDetailView.as_view(), name='report-detail'),
    path('reports/<uuid:pk>/analyze/', views.AnalyzeMedicalReportView.as_view(), name='analyze-report'),
    path('diseases/', views.DiseaseListView.as_view(), name='diseases'),
]