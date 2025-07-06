import os
import pandas as pd
import numpy as np
import joblib
import logging
from typing import List, Tuple, Dict, Optional
import json
from datetime import datetime

from utils import ModelUtils

class DiagnosisPredictor:
    """Diagnosis prediction class"""
    
    def __init__(self, model_path='ml/models'):
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.feature_columns = None
        self.metadata = None
        self.load_model()
    
    def load_model(self):
        """Load trained model and associated components"""
        try:
            # Load model
            model_file = os.path.join(self.model_path, 'diagnosis_model.pkl')
            self.model = ModelUtils.load_model(model_file)
            
            # Load scaler
            scaler_file = os.path.join(self.model_path, 'diagnosis_scaler.pkl')
            self.scaler = ModelUtils.load_model(scaler_file)
            
            # Load label encoder
            encoder_file = os.path.join(self.model_path, 'diagnosis_encoder.pkl')
            self.label_encoder = ModelUtils.load_model(encoder_file)
            
            # Load feature columns
            features_file = os.path.join(self.model_path, 'diagnosis_features.pkl')
            self.feature_columns = ModelUtils.load_model(features_file)
            
            # Load metadata
            metadata_file = os.path.join(self.model_path, 'diagnosis_metadata.json')
            if os.path.exists(metadata_file):
                with open(metadata_file, 'r') as f:
                    self.metadata = json.load(f)
            
            # Check if all components are loaded
            if all([self.model, self.scaler, self.label_encoder, self.feature_columns]):
                logging.info("Diagnosis model loaded successfully")
            else:
                logging.warning("Some model components failed to load")
                
        except Exception as e:
            logging.error(f"Error loading diagnosis model: {str(e)}")
            self.model = None
    
    def preprocess_input(self, input_data: Dict) -> np.ndarray:
        """Preprocess input data for prediction"""
        try:
            # Extract patient info
            age = input_data.get('age', 0)
            gender = input_data.get('gender', 'Female')
            symptoms = input_data.get('symptoms', {})
            
            # Create feature vector
            feature_vector = {}
            
            # Add age
            if 'age' in self.feature_columns:
                feature_vector['age'] = age
            
            # Add gender (encode as numeric)
            if 'gender' in self.feature_columns:
                feature_vector['gender'] = 1 if gender == 'Female' else 0
            
            # Add all symptom features
            for feature in self.feature_columns:
                if feature in ['age', 'gender']:
                    continue
                
                # Check if symptom is present in input
                if feature in symptoms:
                    feature_vector[feature] = symptoms[feature]
                else:
                    # Default to 0 if symptom not mentioned
                    feature_vector[feature] = 0
            
            # Convert to DataFrame with correct column order
            df = pd.DataFrame([feature_vector])
            df = df.reindex(columns=self.feature_columns, fill_value=0)
            
            # Convert to numpy array
            X = df.values
            
            # Scale features
            X_scaled = self.scaler.transform(X)
            
            return X_scaled
            
        except Exception as e:
            logging.error(f"Error preprocessing input: {str(e)}")
            raise
    
    def predict(self, input_data: Dict) -> List[Tuple[str, float]]:
        """Make diagnosis prediction"""
        try:
            if self.model is None:
                logging.error("Model not loaded")
                return []
            
            # Preprocess input
            X = self.preprocess_input(input_data)
            
            # Get prediction probabilities
            probabilities = self.model.predict_proba(X)[0]
            
            # Get class names
            class_names = self.label_encoder.classes_
            
            # Create list of (condition, probability) tuples
            predictions = list(zip(class_names, probabilities))
            
            # Sort by probability (highest first)
            predictions.sort(key=lambda x: x[1], reverse=True)
            
            # Filter predictions with minimum confidence
            min_confidence = 0.1  # 10% minimum confidence
            filtered_predictions = [(cond, prob) for cond, prob in predictions if prob >= min_confidence]
            
            # Return top 5 predictions
            top_predictions = filtered_predictions[:5]
            
            logging.info(f"Generated {len(top_predictions)} diagnosis predictions")
            return top_predictions
            
        except Exception as e:
            logging.error(f"Error making prediction: {str(e)}")
            return []
    
    def predict_single_condition(self, input_data: Dict, condition: str) -> Optional[float]:
        """Get probability for a specific condition"""
        try:
            predictions = self.predict(input_data)
            
            for cond, prob in predictions:
                if cond.lower() == condition.lower():
                    return prob
            
            return None
            
        except Exception as e:
            logging.error(f"Error predicting single condition: {str(e)}")
            return None
    
    def get_feature_importance(self, top_n: int = 10) -> List[Tuple[str, float]]:
        """Get feature importance from the model"""
        try:
            if self.model is None or not hasattr(self.model, 'feature_importances_'):
                return []
            
            importances = self.model.feature_importances_
            feature_importance = list(zip(self.feature_columns, importances))
            
            # Sort by importance (highest first)
            feature_importance.sort(key=lambda x: x[1], reverse=True)
            
            return feature_importance[:top_n]
            
        except Exception as e:
            logging.error(f"Error getting feature importance: {str(e)}")
            return []
    
    def explain_prediction(self, input_data: Dict) -> Dict:
        """Provide explanation for the prediction"""
        try:
            predictions = self.predict(input_data)
            
            if not predictions:
                return {'error': 'No predictions available'}
            
            # Get top prediction
            top_condition, top_probability = predictions[0]
            
            # Get feature importance
            feature_importance = self.get_feature_importance()
            
            # Get active symptoms
            symptoms = input_data.get('symptoms', {})
            active_symptoms = [symptom for symptom, value in symptoms.items() if value > 0]
            
            explanation = {
                'top_prediction': {
                    'condition': top_condition,
                    'confidence': round(top_probability * 100, 2)
                },
                'all_predictions': [
                    {'condition': cond, 'confidence': round(prob * 100, 2)} 
                    for cond, prob in predictions
                ],
                'active_symptoms': active_symptoms,
                'important_features': [
                    {'feature': feat, 'importance': round(imp, 4)} 
                    for feat, imp in feature_importance
                ],
                'patient_info': {
                    'age': input_data.get('age'),
                    'gender': input_data.get('gender')
                }
            }
            
            return explanation
            
        except Exception as e:
            logging.error(f"Error explaining prediction: {str(e)}")
            return {'error': str(e)}
    
    def is_model_loaded(self) -> bool:
        """Check if model is properly loaded"""
        return self.model is not None
    
    def get_model_info(self) -> Dict:
        """Get information about the loaded model"""
        if self.metadata:
            return {
                'status': 'loaded' if self.is_model_loaded() else 'not_loaded',
                'trained_date': self.metadata.get('trained_date'),
                'feature_count': self.metadata.get('feature_count'),
                'class_count': self.metadata.get('class_count'),
                'classes': self.metadata.get('classes', [])
            }
        else:
            return {
                'status': 'loaded' if self.is_model_loaded() else 'not_loaded',
                'trained_date': 'unknown',
                'feature_count': len(self.feature_columns) if self.feature_columns else 0,
                'class_count': len(self.label_encoder.classes_) if self.label_encoder else 0,
                'classes': self.label_encoder.classes_.tolist() if self.label_encoder else []
            }

# Example usage and testing
if __name__ == "__main__":
    # Setup logging
    logging.basicConfig(level=logging.INFO)
    
    # Create predictor
    predictor = DiagnosisPredictor()
    
    # Test prediction
    test_data = {
        'age': 45,
        'gender': 'Female',
        'symptoms': {
            'chest_pain': 1,
            'shortness_of_breath': 1,
            'fatigue': 1,
            'nausea': 1,
            'jaw_pain': 0,
            'dizziness': 1
        }
    }
    
    if predictor.is_model_loaded():
        print("Model loaded successfully!")
        
        # Make prediction
        predictions = predictor.predict(test_data)
        print(f"\nTop predictions:")
        for i, (condition, prob) in enumerate(predictions[:3], 1):
            print(f"{i}. {condition}: {prob:.4f} ({prob*100:.2f}%)")
        
        # Get explanation
        explanation = predictor.explain_prediction(test_data)
        print(f"\nExplanation: {explanation}")
        
        # Get model info
        model_info = predictor.get_model_info()
        print(f"\nModel info: {model_info}")
    else:
        print("Model not loaded. Please train the model first.")