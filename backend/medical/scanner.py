import cv2
import numpy as np
import pytesseract
from PIL import Image
import re
import json

class MedicalDocumentScanner:
    """
    OpenCV-based medical document scanner and analyzer.
    Extracts text and detects health conditions from medical reports.
    """
    
    def __init__(self):
        # Common medical keywords and patterns
        self.condition_keywords = {
            'diabetes': ['diabetes', 'glucose', 'hba1c', 'blood sugar', 'hyperglycemia'],
            'anemia': ['anemia', 'hemoglobin', 'iron deficiency', 'low hb'],
            'hypertension': ['hypertension', 'high blood pressure', 'bp elevated'],
            'cholesterol': ['cholesterol', 'ldl', 'hdl', 'triglycerides', 'lipid'],
            'thyroid': ['thyroid', 'tsh', 't3', 't4', 'hypothyroid', 'hyperthyroid'],
            'kidney': ['kidney', 'creatinine', 'urea', 'renal'],
            'liver': ['liver', 'sgpt', 'sgot', 'bilirubin', 'hepatic'],
        }
        
        # Normal ranges for common blood tests
        self.normal_ranges = {
            'glucose': (70, 100),
            'hba1c': (4.0, 5.6),
            'hemoglobin': (12.0, 16.0),
            'cholesterol': (125, 200),
            'ldl': (0, 100),
            'hdl': (40, 60),
            'triglycerides': (0, 150),
            'tsh': (0.4, 4.0),
        }
    
    def preprocess_image(self, image_path):
        """Preprocess image for better OCR results"""
        try:
            # Read image
            img = cv2.imread(image_path)
            
            if img is None:
                raise ValueError("Could not read image")
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply thresholding
            thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            
            # Denoise
            denoised = cv2.fastNlMeansDenoising(thresh, None, 10, 7, 21)
            
            return denoised
        
        except Exception as e:
            raise Exception(f"Image preprocessing failed: {str(e)}")
    
    def extract_text(self, image_path):
        """Extract text from image using OCR"""
        try:
            # Preprocess image
            processed_img = self.preprocess_image(image_path)
            
            # Perform OCR
            text = pytesseract.image_to_string(processed_img)
            
            return text.strip()
        
        except Exception as e:
            # Fallback: try with original image
            try:
                img = Image.open(image_path)
                text = pytesseract.image_to_string(img)
                return text.strip()
            except:
                raise Exception(f"Text extraction failed: {str(e)}")
    
    def detect_conditions(self, text):
        """Detect medical conditions from extracted text"""
        text_lower = text.lower()
        detected = []
        
        for condition, keywords in self.condition_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    detected.append(condition)
                    break
        
        return list(set(detected))
    
    def extract_health_metrics(self, text):
        """Extract numerical health metrics from text"""
        metrics = {}
        
        # Common patterns for blood test results
        patterns = [
            r'glucose[:\s]*(\d+\.?\d*)',
            r'hba1c[:\s]*(\d+\.?\d*)',
            r'hemoglobin[:\s]*(\d+\.?\d*)',
            r'cholesterol[:\s]*(\d+\.?\d*)',
            r'ldl[:\s]*(\d+\.?\d*)',
            r'hdl[:\s]*(\d+\.?\d*)',
            r'triglycerides[:\s]*(\d+\.?\d*)',
            r'tsh[:\s]*(\d+\.?\d*)',
            r'creatinine[:\s]*(\d+\.?\d*)',
        ]
        
        text_lower = text.lower()
        
        for pattern in patterns:
            match = re.search(pattern, text_lower)
            if match:
                metric_name = pattern.split('[')[0]
                value = float(match.group(1))
                metrics[metric_name] = value
                
                # Check if value is in normal range
                if metric_name in self.normal_ranges:
                    min_val, max_val = self.normal_ranges[metric_name]
                    if value < min_val:
                        metrics[f"{metric_name}_status"] = "low"
                    elif value > max_val:
                        metrics[f"{metric_name}_status"] = "high"
                    else:
                        metrics[f"{metric_name}_status"] = "normal"
        
        return metrics
    
    def generate_insights(self, detected_conditions, health_metrics):
        """Generate AI insights based on detected conditions and metrics"""
        insights = []
        
        if 'diabetes' in detected_conditions:
            insights.append("Diabetes indicators found. Focus on low glycemic index foods.")
        
        if 'anemia' in detected_conditions:
            insights.append("Anemia detected. Increase iron-rich foods and vitamin C.")
        
        if 'hypertension' in detected_conditions:
            insights.append("High blood pressure indicators. Reduce sodium intake.")
        
        if 'cholesterol' in detected_conditions:
            insights.append("Cholesterol management needed. Increase fiber and omega-3.")
        
        # Check specific metrics
        for metric, value in health_metrics.items():
            if metric.endswith('_status'):
                metric_name = metric.replace('_status', '')
                if value == 'high':
                    insights.append(f"Elevated {metric_name} levels detected.")
                elif value == 'low':
                    insights.append(f"Low {metric_name} levels detected.")
        
        if not insights:
            insights.append("No significant health concerns detected in the report.")
        
        return " ".join(insights)
    
    def analyze_report(self, image_path):
        """Complete analysis of medical report"""
        result = {
            'extracted_text': '',
            'detected_conditions': [],
            'health_metrics': {},
            'ai_insights': '',
            'status': 'completed'
        }
        
        try:
            # Extract text
            text = self.extract_text(image_path)
            result['extracted_text'] = text
            
            if not text:
                result['status'] = 'failed'
                result['ai_insights'] = "Unable to extract text from document."
                return result
            
            # Detect conditions
            conditions = self.detect_conditions(text)
            result['detected_conditions'] = conditions
            
            # Extract metrics
            metrics = self.extract_health_metrics(text)
            result['health_metrics'] = metrics
            
            # Generate insights
            insights = self.generate_insights(conditions, metrics)
            result['ai_insights'] = insights
            
        except Exception as e:
            result['status'] = 'failed'
            result['ai_insights'] = f"Analysis failed: {str(e)}"
        
        return result