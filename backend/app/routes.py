from flask import Blueprint, request, jsonify, current_app
import logging
from utils import (
    ValidationUtils, ResponseUtils, require_json, log_api_call
)
from ml.diagnosis_model.predictor import DiagnosisPredictor
from datetime import datetime

# Add these imports at the top
from ml.drug_model.drug_analyzer import DrugAnalyzer, calculate_overall_risk

# Use diagnosis_bp instead of main_bp for clarity
diagnosis_bp = Blueprint('diagnosis', __name__)

# Initialize predictors (lazy load)
diagnosis_predictor = None

def get_diagnosis_predictor():
    global diagnosis_predictor
    if diagnosis_predictor is None:
        try:
            diagnosis_predictor = DiagnosisPredictor()
            if not diagnosis_predictor.is_model_loaded():
                logging.error("Diagnosis model failed to load")
                return None
        except Exception as e:
            logging.error(f"Error initializing diagnosis predictor: {str(e)}")
            return None
    return diagnosis_predictor

@diagnosis_bp.route('/')
def index():
    """API root endpoint"""
    return ResponseUtils.success_response({
        'api_name': current_app.config['API_TITLE'],
        'version': current_app.config['API_VERSION'],
        'description': current_app.config['API_DESCRIPTION'],
        'endpoints': {
            'diagnosis': '/api/v1/diagnosis',
            'health': '/health',
            'feedback': '/api/v1/feedback'
        }
    })

@diagnosis_bp.route('/health')
def health_check():
    """Health check endpoint"""
    try:
        predictor = get_diagnosis_predictor()
        model_loaded = predictor.is_model_loaded() if predictor else False
        
        if model_loaded:
            model_info = predictor.get_model_info()
        else:
            model_info = {"status": "not_loaded"}
        
        return ResponseUtils.success_response({
            'api_name': current_app.config['API_TITLE'],
            'version': current_app.config['API_VERSION'],
            'model_loaded': model_loaded,
            'model_info': model_info,
            'timestamp': datetime.now().isoformat()
        }, "DiagHer API is running")
        
    except Exception as e:
        logging.error(f"Health check failed: {str(e)}")
        return ResponseUtils.error_response("Health check failed", 500)

@diagnosis_bp.route('/api/v1/diagnosis', methods=['POST'])
@require_json
@log_api_call
def diagnose():
    """Main diagnosis endpoint with detailed response"""
    try:
        data = request.get_json()
        logging.info(f"Received diagnosis request for patient age: {data.get('age')}")

        # Validate input data
        is_valid, error_message = ValidationUtils.validate_symptoms_input(data)
        if not is_valid:
            logging.warning(f"Validation failed: {error_message}")
            return ResponseUtils.error_response(error_message, 400)

        # Get predictor
        predictor = get_diagnosis_predictor()
        if not predictor:
            return ResponseUtils.error_response("Model not available", 503)

        # Make detailed prediction using the new method
        prediction_result = predictor.predict_detailed(data)
        
        # Check if prediction was successful
        if prediction_result["status"] == "error":
            logging.error(f"Prediction failed: {prediction_result['message']}")
            return ResponseUtils.error_response(prediction_result["message"], 500)

        # Log successful prediction
        logging.info(f"Successful diagnosis prediction for {data['gender']}, age {data['age']}")
        
        # Return the detailed response directly from predictor
        return jsonify(prediction_result), 200

    except Exception as e:
        logging.error(f"Error in diagnosis endpoint: {str(e)}", exc_info=True)
        return ResponseUtils.error_response("Internal server error during diagnosis", 500)

@diagnosis_bp.route('/api/v1/diagnosis/simple', methods=['POST'])
@require_json
@log_api_call
def diagnose_simple():
    """Simple diagnosis endpoint for backward compatibility"""
    try:
        data = request.get_json()
        logging.info(f"Received simple diagnosis request")

        # Validate input data
        is_valid, error_message = ValidationUtils.validate_symptoms_input(data)
        if not is_valid:
            logging.warning(f"Validation failed: {error_message}")
            return ResponseUtils.error_response(error_message, 400)

        # Get predictor
        predictor = get_diagnosis_predictor()
        if not predictor:
            return ResponseUtils.error_response("Model not available", 503)

        # Use the original predict method for simple response
        predictions = predictor.predict(data)
        
        if not predictions:
            return ResponseUtils.error_response("Unable to make diagnosis prediction", 500)

        # Format using the old format for backward compatibility
        formatted_results = ResponseUtils.format_diagnosis_results(predictions)
        response_data = {
            'patient_info': {
                'age': data['age'],
                'gender': data['gender']
            },
            'predictions': formatted_results,
            'total_symptoms': sum(data['symptoms'].values()),
            'Disclaimer': 'DiagHer is intended to support, not replace, professional medical judgment.'
        }

        logging.info(f"Simple diagnosis prediction completed")
        return ResponseUtils.success_response(response_data, "Diagnosis prediction completed")

    except Exception as e:
        logging.error(f"Error in simple diagnosis endpoint: {str(e)}", exc_info=True)
        return ResponseUtils.error_response("Internal server error", 500)

@diagnosis_bp.route('/api/v1/diagnosis/explain', methods=['POST'])
@require_json
@log_api_call
def explain_diagnosis():
    """Explanation endpoint for diagnosis predictions"""
    try:
        data = request.get_json()
        logging.info(f"Received explanation request")

        # Validate input data
        is_valid, error_message = ValidationUtils.validate_symptoms_input(data)
        if not is_valid:
            return ResponseUtils.error_response(error_message, 400)

        # Get predictor
        predictor = get_diagnosis_predictor()
        if not predictor:
            return ResponseUtils.error_response("Model not available", 503)

        # Get explanation
        explanation = predictor.explain_prediction(data)
        
        if 'error' in explanation:
            return ResponseUtils.error_response(explanation['error'], 500)

        return ResponseUtils.success_response(explanation, "Prediction explanation generated")

    except Exception as e:
        logging.error(f"Error in explanation endpoint: {str(e)}")
        return ResponseUtils.error_response("Internal server error", 500)

@diagnosis_bp.route('/api/v1/feedback', methods=['POST'])
@require_json
@log_api_call
def submit_feedback():
    """Feedback submission endpoint"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['type', 'feedback_score']
        for field in required_fields:
            if field not in data:
                return ResponseUtils.error_response(f"Missing required field: {field}", 400)

        # Validate feedback score
        score = data.get('feedback_score')
        if not isinstance(score, (int, float)) or score < 1 or score > 5:
            return ResponseUtils.error_response("Feedback score must be between 1 and 5", 400)

        logging.info(f"Feedback received: type={data['type']}, score={score}")

        # Generate feedback response
        response_data = {
            'feedback_id': f"fb_{data['type']}_{hash(str(data)) % 100000}",
            'status': 'received',
            'message': 'Thank you for your feedback. It will help improve our models.',
            'timestamp': datetime.now().isoformat()
        }

        return ResponseUtils.success_response(response_data, "Feedback submitted successfully")

    except Exception as e:
        logging.error(f"Error in feedback endpoint: {str(e)}")
        return ResponseUtils.error_response("Internal server error", 500)

@diagnosis_bp.route('/api/v1/model/info', methods=['GET'])
def get_model_info():
    """Get model information endpoint"""
    try:
        predictor = get_diagnosis_predictor()
        if not predictor:
            return ResponseUtils.error_response("Model not available", 503)
        
        model_info = predictor.get_model_info()
        return ResponseUtils.success_response(model_info, "Model information retrieved")
        
    except Exception as e:
        logging.error(f"Error getting model info: {str(e)}")
        return ResponseUtils.error_response("Internal server error", 500)

# Error handlers
@diagnosis_bp.errorhandler(400)
def bad_request(error):
    return ResponseUtils.error_response("Bad request", 400)

@diagnosis_bp.errorhandler(405)
def method_not_allowed(error):
    return ResponseUtils.error_response("Method not allowed", 405)

@diagnosis_bp.errorhandler(429)
def rate_limit_exceeded(error):
    return ResponseUtils.error_response("Rate limit exceeded", 429)




# Initialize drug analyzer (lazy load)
drug_analyzer = None

def get_drug_analyzer():
    global drug_analyzer
    if drug_analyzer is None:
        try:
            drug_analyzer = DrugAnalyzer()
            if drug_analyzer.drug_data is None:
                logging.error("Drug analyzer failed to load data")
                return None
        except Exception as e:
            logging.error(f"Error initializing drug analyzer: {str(e)}")
            return None
    return drug_analyzer

# Add these routes after your existing routes
@diagnosis_bp.route('/api/v1/drug/analyze', methods=['POST'])
@require_json
@log_api_call
def analyze_single_drug():
    """Analyze a single drug"""
    try:
        data = request.get_json()
        
        if not data or 'drug_name' not in data:
            return ResponseUtils.error_response('Drug name is required', 400)
        
        analyzer = get_drug_analyzer()
        if not analyzer:
            return ResponseUtils.error_response("Drug analyzer not available", 503)
        
        result = analyzer.analyze_drug(data)
        return ResponseUtils.success_response(result, "Drug analysis completed")
    
    except Exception as e:
        logging.error(f"Error in drug analysis endpoint: {str(e)}")
        return ResponseUtils.error_response("Internal server error during drug analysis", 500)

@diagnosis_bp.route('/api/v1/drug/analyze-medications', methods=['POST'])
@require_json
@log_api_call
def analyze_medications():
    """Analyze multiple medications"""
    try:
        data = request.get_json()
        
        if not data or 'medications' not in data:
            return ResponseUtils.error_response('Medications list is required', 400)
        
        analyzer = get_drug_analyzer()
        if not analyzer:
            return ResponseUtils.error_response("Drug analyzer not available", 503)
        
        medications = data['medications']
        patient_info = data.get('patient_info', {})
        
        results = []
        for med in medications:
            med_info = {
                **med,
                'age': patient_info.get('age', 25),
                'is_pregnant': patient_info.get('is_pregnant', False),
                'is_breastfeeding': patient_info.get('is_breastfeeding', False)
            }
            
            result = analyzer.analyze_drug(med_info)
            results.append(result)
        
        overall_risk = calculate_overall_risk(results)
        
        response_data = {
            'individual_results': results,
            'overall_risk': overall_risk,
            'analysis_timestamp': datetime.now().isoformat()
        }
        
        return ResponseUtils.success_response(response_data, "Medications analysis completed")
    
    except Exception as e:
        logging.error(f"Error in medications analysis endpoint: {str(e)}")
        return ResponseUtils.error_response("Internal server error", 500)

@diagnosis_bp.route('/api/v1/drug/alternatives', methods=['GET'])
def get_drug_alternatives():
    """Get alternatives for a specific drug"""
    try:
        drug_name = request.args.get('drug_name')
        age = int(request.args.get('age', 25))
        
        if not drug_name:
            return ResponseUtils.error_response('Drug name is required', 400)
        
        analyzer = get_drug_analyzer()
        if not analyzer:
            return ResponseUtils.error_response("Drug analyzer not available", 503)
        
        age_group = analyzer.get_age_group(age)
        alternatives = analyzer.get_safer_alternatives(drug_name, age_group)
        
        response_data = {
            'drug_name': drug_name,
            'age_group': age_group,
            'alternatives': alternatives
        }
        
        return ResponseUtils.success_response(response_data, "Alternatives retrieved")
    
    except Exception as e:
        logging.error(f"Error in alternatives endpoint: {str(e)}")
        return ResponseUtils.error_response("Internal server error", 500)

@diagnosis_bp.route('/api/v1/drug/info', methods=['GET'])
def get_drug_info():
    """Get detailed information about a drug"""
    try:
        drug_name = request.args.get('drug_name')
        age = int(request.args.get('age', 25))
        
        if not drug_name:
            return ResponseUtils.error_response('Drug name is required', 400)
        
        analyzer = get_drug_analyzer()
        if not analyzer:
            return ResponseUtils.error_response("Drug analyzer not available", 503)
        
        age_group = analyzer.get_age_group(age)
        
        info = {
            'drug_name': drug_name,
            'age_group': age_group,
            'side_effects': analyzer.get_side_effects(drug_name, age_group),
            'alternatives': analyzer.get_safer_alternatives(drug_name, age_group),
            'requires_monitoring': analyzer.check_monitoring_required(drug_name, age_group),
            'pregnancy_breastfeeding_risks': analyzer.get_pregnancy_breastfeeding_risks(drug_name, age_group)
        }
        
        return ResponseUtils.success_response(info, "Drug information retrieved")
    
    except Exception as e:
        logging.error(f"Error in drug info endpoint: {str(e)}")
        return ResponseUtils.error_response("Internal server error", 500)

@diagnosis_bp.route('/api/v1/drug/available-drugs', methods=['GET'])
def get_available_drugs():
    """Get list of available drugs in the database"""
    try:
        analyzer = get_drug_analyzer()
        if not analyzer:
            return ResponseUtils.error_response("Drug analyzer not available", 503)
        
        if analyzer.drug_data is None:
            return ResponseUtils.error_response('No drug data available', 500)
        
        drugs = analyzer.drug_data['drug_name'].unique().tolist()
        
        response_data = {
            'drugs': drugs,
            'total_count': len(drugs)
        }
        
        return ResponseUtils.success_response(response_data, "Available drugs retrieved")
    
    except Exception as e:
        logging.error(f"Error in available drugs endpoint: {str(e)}")
        return ResponseUtils.error_response("Internal server error", 500)