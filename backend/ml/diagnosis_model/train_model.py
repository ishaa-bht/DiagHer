import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import logging
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

from utils import DataLoader, ModelUtils

class DiagnosisModelTrainer:
    """Train diagnosis prediction model"""
    
    def __init__(self, data_path='data'):
        self.data_path = data_path
        self.data_loader = DataLoader(data_path)
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.feature_columns = None
        self.target_column = 'condition'
        
    def load_and_prepare_data(self):
        """Load and prepare training data"""
        try:
            # Load symptoms data
            symptoms_df = self.data_loader.get_dataset('symptoms')
            if symptoms_df is None:
                raise ValueError("Symptoms dataset not found")
            
            logging.info(f"Loaded symptoms dataset with {len(symptoms_df)} records")
            
            # Preprocess data
            df = self.data_loader.preprocess_symptoms_data(symptoms_df)
            
            # Identify feature columns (all except target and metadata)
            exclude_cols = ['condition', 'num_symptoms']  # These are not features
            self.feature_columns = [col for col in df.columns if col not in exclude_cols]
            
            # Prepare features (X) and target (y)
            X = df[self.feature_columns]
            y = df[self.target_column]
            
            # Handle missing values in features
            X = X.fillna(0)
            
            # Encode target labels
            self.label_encoder = LabelEncoder()
            y_encoded = self.label_encoder.fit_transform(y)
            
            logging.info(f"Feature columns: {len(self.feature_columns)}")
            logging.info(f"Target classes: {len(self.label_encoder.classes_)}")
            
            return X, y_encoded
            
        except Exception as e:
            logging.error(f"Error preparing data: {str(e)}")
            raise
    
    def train_model(self, X, y, model_type='random_forest'):
        """Train the diagnosis prediction model"""
        try:
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features
            self.scaler = StandardScaler()
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Initialize model based on type
            if model_type == 'random_forest':
                self.model = RandomForestClassifier(
                    n_estimators=100,
                    max_depth=10,
                    min_samples_split=5,
                    min_samples_leaf=2,
                    random_state=42,
                    class_weight='balanced'
                )
            elif model_type == 'logistic_regression':
                self.model = LogisticRegression(
                    random_state=42,
                    class_weight='balanced',
                    max_iter=1000
                )
            else:
                raise ValueError(f"Unknown model type: {model_type}")
            
            # Train model
            logging.info(f"Training {model_type} model...")
            self.model.fit(X_train_scaled, y_train)
            
            # Make predictions
            y_pred = self.model.predict(X_test_scaled)
            
            # Calculate accuracy
            accuracy = accuracy_score(y_test, y_pred)
            logging.info(f"Model accuracy: {accuracy:.4f}")
            
            # Cross-validation
            cv_scores = cross_val_score(self.model, X_train_scaled, y_train, cv=5)
            logging.info(f"Cross-validation scores: {cv_scores}")
            logging.info(f"Mean CV score: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
            
            # Print classification report
            class_names = self.label_encoder.classes_
            report = classification_report(y_test, y_pred, target_names=class_names)
            logging.info(f"Classification Report:\n{report}")
            
            return {
                'accuracy': accuracy,
                'cv_scores': cv_scores,
                'classification_report': report,
                'model_type': model_type
            }
            
        except Exception as e:
            logging.error(f"Error training model: {str(e)}")
            raise
    
    def save_model(self, model_path='ml/models'):
        """Save trained model and associated components"""
        try:
            os.makedirs(model_path, exist_ok=True)
            
            # Save model
            model_file = os.path.join(model_path, 'diagnosis_model.pkl')
            joblib.dump(self.model, model_file)
            
            # Save scaler
            scaler_file = os.path.join(model_path, 'diagnosis_scaler.pkl')
            joblib.dump(self.scaler, scaler_file)
            
            # Save label encoder
            encoder_file = os.path.join(model_path, 'diagnosis_encoder.pkl')
            joblib.dump(self.label_encoder, encoder_file)
            
            # Save feature columns
            features_file = os.path.join(model_path, 'diagnosis_features.pkl')
            joblib.dump(self.feature_columns, features_file)
            
            # Save metadata
            metadata = {
                'trained_date': datetime.now().isoformat(),
                'feature_count': len(self.feature_columns),
                'class_count': len(self.label_encoder.classes_),
                'classes': self.label_encoder.classes_.tolist()
            }
            
            import json
            metadata_file = os.path.join(model_path, 'diagnosis_metadata.json')
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            logging.info(f"Model saved to {model_path}")
            
        except Exception as e:
            logging.error(f"Error saving model: {str(e)}")
            raise
    
    def train_and_save(self, model_type='random_forest'):
        """Complete training pipeline"""
        try:
            # Load and prepare data
            X, y = self.load_and_prepare_data()
            
            # Train model
            results = self.train_model(X, y, model_type)
            
            # Save model
            self.save_model()
            
            logging.info("Training completed successfully!")
            return results
            
        except Exception as e:
            logging.error(f"Training pipeline failed: {str(e)}")
            raise

def main():
    """Main training script"""
    import sys
    sys.path.append('.')
    
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    try:
        trainer = DiagnosisModelTrainer()
        
        # Train Random Forest model
        print("Training Random Forest model...")
        rf_results = trainer.train_and_save('random_forest')
        
        print(f"Random Forest Accuracy: {rf_results['accuracy']:.4f}")
        print(f"Cross-validation mean: {rf_results['cv_scores'].mean():.4f}")
        
        # Optionally train Logistic Regression for comparison
        print("\nTraining Logistic Regression model...")
        trainer_lr = DiagnosisModelTrainer()
        lr_results = trainer_lr.train_and_save('logistic_regression')
        
        print(f"Logistic Regression Accuracy: {lr_results['accuracy']:.4f}")
        print(f"Cross-validation mean: {lr_results['cv_scores'].mean():.4f}")
        
        print("\nTraining completed successfully!")
        
    except Exception as e:
        print(f"Training failed: {str(e)}")
        logging.error(f"Training failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()