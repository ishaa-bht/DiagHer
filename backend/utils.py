import os
import json
import logging
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any
from functools import wraps
from flask import request, jsonify
import joblib

class DataLoader:
    """Utility class for loading and preprocessing data"""
    
    def __init__(self, data_path: str = 'data'):
        self.data_path = data_path
        self.datasets = {}
        self.load_all_datasets()
    
    def load_all_datasets(self):
        """Load all datasets into memory"""
        try:
            # Load symptoms data
            symptoms_path = os.path.join(self.data_path, 'symptoms_data.csv')
            if os.path.exists(symptoms_path):
                self.datasets['symptoms'] = pd.read_csv(symptoms_path)
                logging.info(f"Loaded symptoms data: {len(self.datasets['symptoms'])} records")
            
            # Load drug side effects data
            drug_effects_path = os.path.join(self.data_path, 'drugs_side_effects_drugs_com.csv')
            if os.path.exists(drug_effects_path):
                self.datasets['drug_effects'] = pd.read_csv(drug_effects_path)
                logging.info(f"Loaded drug effects data: {len(self.datasets['drug_effects'])} records")
            
            # Load female-specific drug side effects
            female_effects_path = os.path.join(self.data_path, 'female_drug_side_effects.csv')
            if os.path.exists(female_effects_path):
                self.datasets['female_drug_effects'] = pd.read_csv(female_effects_path)
                logging.info(f"Loaded female drug effects data: {len(self.datasets['female_drug_effects'])} records")
            
            # Load alternative treatments
            alt_treatments_path = os.path.join(self.data_path, 'alternative_treatments_dataset.csv')
            if os.path.exists(alt_treatments_path):
                self.datasets['alternative_treatments'] = pd.read_csv(alt_treatments_path)
                logging.info(f"Loaded alternative treatments data: {len(self.datasets['alternative_treatments'])} records")
                
        except Exception as e:
            logging.error(f"Error loading datasets: {str(e)}")
            raise
    
    def get_dataset(self, name: str) -> Optional[pd.DataFrame]:
        """Get a specific dataset by name"""
        return self.datasets.get(name)
    
    def preprocess_symptoms_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Preprocess symptoms data for ML model"""
        # Handle missing values
        df = df.fillna(0)
        
        # Convert categorical variables to numerical
        if 'gender' in df.columns:
            df['gender'] = df['gender'].map({'Male': 0, 'Female': 1})
        
        if 'severity' in df.columns:
            severity_map = {'Mild': 1, 'Moderate': 2, 'Severe': 3}
            df['severity'] = df['severity'].map(severity_map)
        
        if 'misdiagnosis_risk' in df.columns:
            risk_map = {'Low': 1, 'Medium': 2, 'High': 3}
            df['misdiagnosis_risk'] = df['misdiagnosis_risk'].map(risk_map)
        
        return df

class ModelUtils:
    """Utility class for ML model operations"""
    
    @staticmethod
    def save_model(model, filepath: str):
        """Save a trained model to disk"""
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            joblib.dump(model, filepath)
            logging.info(f"Model saved to {filepath}")
        except Exception as e:
            logging.error(f"Error saving model: {str(e)}")
            raise
    
    @staticmethod
    def load_model(filepath: str):
        """Load a trained model from disk"""
        try:
            if os.path.exists(filepath):
                model = joblib.load(filepath)
                logging.info(f"Model loaded from {filepath}")
                return model
            else:
                logging.warning(f"Model file not found: {filepath}")
                return None
        except Exception as e:
            logging.error(f"Error loading model: {str(e)}")
            return None
    
    @staticmethod
    def calculate_confidence(probabilities: np.ndarray) -> float:
        """Calculate confidence score from prediction probabilities"""
        if len(probabilities) == 0:
            return 0.0
        
        # Use the maximum probability as confidence
        max_prob = np.max(probabilities)
        
        # If we have multiple classes, also consider the gap between top two
        if len(probabilities) > 1:
            sorted_probs = np.sort(probabilities)[::-1]
            gap = sorted_probs[0] - sorted_probs[1]
            confidence = max_prob * (1 + gap)
        else:
            confidence = max_prob
        
        return min(confidence, 1.0)

class ValidationUtils:
    """Utility class for input validation"""
    
    @staticmethod
    def validate_symptoms_input(data: Dict) -> Tuple[bool, str]:
        """Validate symptoms input data"""
        required_fields = ['age', 'gender', 'symptoms']
        
        for field in required_fields:
            if field not in data:
                return False, f"Missing required field: {field}"
        
        # Validate age
        age = data.get('age')
        if not isinstance(age, (int, float)) or age < 0 or age > 150:
            return False, "Age must be a number between 0 and 150"
        
        # Validate gender
        gender = data.get('gender')
        if gender not in ['Male', 'Female', 'Other']:
            return False, "Gender must be 'Male', 'Female', or 'Other'"
        
        # Validate symptoms
        symptoms = data.get('symptoms')
        if not isinstance(symptoms, dict):
            return False, "Symptoms must be a dictionary"
        
        return True, "Valid input"
    
    @staticmethod
    def validate_drug_input(data: Dict) -> Tuple[bool, str]:
        """Validate drug checker input data"""
        required_fields = ['drug_name', 'patient_age', 'patient_gender']
        
        for field in required_fields:
            if field not in data:
                return False, f"Missing required field: {field}"
        
        # Validate drug name
        drug_name = data.get('drug_name')
        if not isinstance(drug_name, str) or len(drug_name.strip()) == 0:
            return False, "Drug name must be a non-empty string"
        
        # Validate patient age
        age = data.get('patient_age')
        if not isinstance(age, (int, float)) or age < 0 or age > 150:
            return False, "Patient age must be a number between 0 and 150"
        
        # Validate patient gender
        gender = data.get('patient_gender')
        if gender not in ['Male', 'Female', 'Other']:
            return False, "Patient gender must be 'Male', 'Female', or 'Other'"
        
        return True, "Valid input"

class ResponseUtils:
    """Utility class for API response formatting"""
    
    @staticmethod
    def success_response(data: Any, message: str = "Success") -> Dict:
        """Create a success response"""
        return {
            'status': 'success',
            'message': message,
            'data': data,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def error_response(error: str, code: int = 400) -> Tuple[Dict, int]:
        """Create an error response"""
        return {
            'status': 'error',
            'message': error,
            'data': None,
            'timestamp': datetime.utcnow().isoformat()
        }, code
    
    @staticmethod
    def format_diagnosis_results(predictions: List[Tuple[str, float]]) -> List[Dict]:
        """Format diagnosis prediction results"""
        results = []
        for condition, confidence in predictions:
            results.append({
                'condition': condition,
                'confidence': round(confidence * 100, 2),
                'confidence_level': ResponseUtils._get_confidence_level(confidence)
            })
        return results
    
    @staticmethod
    def format_drug_risk_results(risks: List[Dict], alternatives: List[Dict]) -> Dict:
        """Format drug risk checker results"""
        return {
            'risks': risks,
            'alternatives': alternatives,
            'risk_level': ResponseUtils._calculate_overall_risk_level(risks),
            'recommendation': ResponseUtils._generate_recommendation(risks, alternatives)
        }
    
    @staticmethod
    def _get_confidence_level(confidence: float) -> str:
        """Get confidence level description"""
        if confidence >= 0.8:
            return "High"
        elif confidence >= 0.6:
            return "Medium"
        else:
            return "Low"
    
    @staticmethod
    def _calculate_overall_risk_level(risks: List[Dict]) -> str:
        """Calculate overall risk level from individual risks"""
        if not risks:
            return "Low"
        
        high_risks = sum(1 for risk in risks if risk.get('risk_level') == 'High')
        medium_risks = sum(1 for risk in risks if risk.get('risk_level') == 'Medium')
        
        if high_risks > 0:
            return "High"
        elif medium_risks > 0:
            return "Medium"
        else:
            return "Low"
    
    @staticmethod
    def _generate_recommendation(risks: List[Dict], alternatives: List[Dict]) -> str:
        """Generate recommendation based on risks and alternatives"""
        if not risks:
            return "No significant risks detected. Continue with prescribed medication."
        
        high_risks = [r for r in risks if r.get('risk_level') == 'High']
        
        if high_risks:
            if alternatives:
                return "High risk detected. Consider alternative treatments provided."
            else:
                return "High risk detected. Consult with healthcare provider for alternatives."
        else:
            return "Some risks detected. Monitor patient closely during treatment."

def require_json(f):
    """Decorator to require JSON content type"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        return f(*args, **kwargs)
    return decorated_function

def log_api_call(f):
    """Decorator to log API calls"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logging.info(f"API call: {request.method} {request.path} from {request.remote_addr}")
        return f(*args, **kwargs)
    return decorated_function

def setup_logging(log_level: str = 'INFO', log_file: str = None):
    import os
    if log_file:
        os.makedirs(os.path.dirname(log_file), exist_ok=True)  # create folder if missing

    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(log_file) if log_file else logging.NullHandler()
        ]
    )
    
    logging.getLogger('werkzeug').setLevel(logging.WARNING)
    logging.getLogger('urllib3').setLevel(logging.WARNING)

    
   