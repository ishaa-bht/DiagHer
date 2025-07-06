# # from flask import Blueprint, request, jsonify, current_app
# # from flask_limiter import Limiter
# # from flask_limiter.util import get_remote_address
# # import logging
# # from utils import (
# #     ValidationUtils, ResponseUtils, require_json, log_api_call
# # )
# # from ml.diagnosis_model.predictor import DiagnosisPredictor
# # # from ml.drug_model.checker import DrugChecker  #drug_checker model banexi uncomment

# # main_bp = Blueprint('main', __name__)

# # # Initialize predictors (will be loaded when first accessed)
# # diagnosis_predictor = None
# # drug_checker = None

# # def get_diagnosis_predictor():
# #     """Get or initialize the diagnosis predictor"""
# #     global diagnosis_predictor
# #     if diagnosis_predictor is None:
# #         diagnosis_predictor = DiagnosisPredictor()
# #     return diagnosis_predictor

# # # def get_drug_checker():
# # #     """Get or initialize the drug checker"""
# # #     global drug_checker
# # #     if drug_checker is None:
# # #         drug_checker = DrugChecker()
# # #     return drug_checker

# # @main_bp.route('/')
# # def index():
# #     """API information endpoint"""
# #     return ResponseUtils.success_response({
# #         'api_name': current_app.config['API_TITLE'],
# #         'version': current_app.config['API_VERSION'],
# #         'description': current_app.config['API_DESCRIPTION'],
# #         'endpoints': {
# #             'diagnosis': '/api/v1/diagnosis',
# #             'drug_check': '/api/v1/drug-check',
# #             'alternatives': '/api/v1/alternatives',
# #             'feedback': '/api/v1/feedback',
# #             'health': '/health'
# #         }
# #     })

# # @main_bp.route('/api/v1/diagnosis', methods=['POST'])
# # @require_json
# # @log_api_call
# # def diagnose():
# #     """
# #     Diagnose medical conditions based on symptoms
    
# #     Expected input:
# #     {
# #         "age": 35,
# #         "gender": "Female",
# #         "symptoms": {
# #             "chest_pain": 1,
# #             "shortness_of_breath": 1,
# #             "fatigue": 1,
# #             "nausea": 1,
# #             "jaw_pain": 0,
# #             ...
# #         }
# #     }
# #     """
# #     try:
# #         data = request.get_json()
        
# #         # Validate input
# #         is_valid, error_message = ValidationUtils.validate_symptoms_input(data)
# #         if not is_valid:
# #             return ResponseUtils.error_response(error_message, 400)
        
# #         # Get diagnosis predictor
# #         predictor = get_diagnosis_predictor()
        
# #         # Make prediction
# #         predictions = predictor.predict(data)
        
# #         if not predictions:
# #             return ResponseUtils.error_response("Unable to make diagnosis prediction", 500)
        
# #         # Format results
# #         formatted_results = ResponseUtils.format_diagnosis_results(predictions)
        
# #         response_data = {
# #             'patient_info': {
# #                 'age': data['age'],
# #                 'gender': data['gender']
# #             },
# #             'predictions': formatted_results,
# #             'total_symptoms': sum(data['symptoms'].values()),
# #             'recommendation': 'Please consult with a healthcare provider for proper diagnosis and treatment.'
# #         }
        
# #         logging.info(f"Diagnosis prediction made for {data['gender']}, age {data['age']}")
# #         return ResponseUtils.success_response(response_data, "Diagnosis prediction completed")
        
# #     except Exception as e:
# #         logging.error(f"Error in diagnosis endpoint: {str(e)}")
# #         return ResponseUtils.error_response("Internal server error", 500)

# # # @main_bp.route('/api/v1/drug-check', methods=['POST'])
# # # @require_json
# # # @log_api_call
# # # def check_drug_safety():
# # #     """
# # #     Check drug safety and side effects for a patient
    
# # #     Expected input:
# # #     {
# # #         "drug_name": "doxycycline",
# # #         "patient_age": 35,
# # #         "patient_gender": "Female",
# # #         "condition": "Acne",
# # #         "dosage": "100mg",
# # #         "duration": "30 days"
# # #     }
# # #     """
# # #     try:
# # #         data = request.get_json()
        
# # #         # Validate input
# # #         is_valid, error_message = ValidationUtils.validate_drug_input(data)
# # #         if not is_valid:
# # #             return ResponseUtils.error_response(error_message, 400)
        
# # #         # Get drug checker
# # #         checker = get_drug_checker()
        
# # #         # Check drug safety
# # #         risks = checker.check_drug_risks(data)
# # #         alternatives = checker.get_alternatives(data)
        
# # #         # Format results
# # #         formatted_results = ResponseUtils.format_drug_risk_results(risks, alternatives)
        
# # #         response_data = {
# # #             'drug_info': {
# # #                 'drug_name': data['drug_name'],
# # #                 'condition': data.get('condition', 'Not specified')
# # #             },
# # #             'patient_info': {
# # #                 'age': data['patient_age'],
# # #                 'gender': data['patient_gender']
# # #             },
# # #             'safety_assessment': formatted_results
# # #         }
        
# # #         logging.info(f"Drug safety check for {data['drug_name']} - {data['patient_gender']}, age {data['patient_age']}")
# # #         return ResponseUtils.success_response(response_data, "Drug safety check completed")
        
# # #     except Exception as e:
# # #         logging.error(f"Error in drug check endpoint: {str(e)}")
# # #         return ResponseUtils.error_response("Internal server error", 500)

# # # @main_bp.route('/api/v1/alternatives', methods=['POST'])
# # # @require_json
# # # @log_api_call
# # # def get_alternatives():
# # #     """
# # #     Get alternative treatments for a condition
    
# # #     Expected input:
# # #     {
# # #         "condition": "Menstrual_Cramps",
# # #         "current_drug": "Ibuprofen",
# # #         "patient_age": 25,
# # #         "patient_gender": "Female"
# # #     }
# # #     """
# # #     try:
# # #         data = request.get_json()
        
# # #         # Validate required fields
# # #         required_fields = ['condition', 'current_drug']
# # #         for field in required_fields:
# # #             if field not in data:
# # #                 return ResponseUtils.error_response(f"Missing required field: {field}", 400)
        
# # #         # Get drug checker
# # #         checker = get_drug_checker()
        
# # #         # Get alternative treatments
# # #         alternatives = checker.get_alternative_treatments(data)
        
# # #         response_data = {
# # #             'condition': data['condition'],
# # #             'current_drug': data['current_drug'],
# # #             'alternatives': alternatives
# # #         }
        
# # #         logging.info(f"Alternative treatments requested for {data['condition']}")
# # #         return ResponseUtils.success_response(response_data, "Alternative treatments retrieved")
        
# # #     except Exception as e:
# # #         logging.error(f"Error in alternatives endpoint: {str(e)}")
# # #         return ResponseUtils.error_response("Internal server error", 500)

# # @main_bp.route('/api/v1/feedback', methods=['POST'])
# # @require_json
# # @log_api_call
# # def submit_feedback():
# #     """
# #     Submit feedback for model improvement
    
# #     Expected input:
# #     {
# #         "type": "diagnosis" or "drug_check",
# #         "prediction_id": "unique_id",
# #         "correct_diagnosis": "Actual condition",
# #         "feedback_score": 1-5,
# #         "comments": "Additional feedback"
# #     }
# #     """
# #     try:
# #         data = request.get_json()
        
# #         # Validate required fields
# #         required_fields = ['type', 'feedback_score']
# #         for field in required_fields:
# #             if field not in data:
# #                 return ResponseUtils.error_response(f"Missing required field: {field}", 400)
        
# #         # Validate feedback score
# #         score = data.get('feedback_score')
# #         if not isinstance(score, (int, float)) or score < 1 or score > 5:
# #             return ResponseUtils.error_response("Feedback score must be between 1 and 5", 400)
        
# #         # Store feedback (in production, this would go to a database)
# #         # For now, we'll just log it
# #         logging.info(f"Feedback received: {data}")
        
# #         # In the future, this feedback could be used for model retraining
        
# #         response_data = {
# #             'feedback_id': f"fb_{data['type']}_{hash(str(data))}",
# #             'status': 'received',
# #             'message': 'Thank you for your feedback. It will help improve our models.'
# #         }
        
# #         return ResponseUtils.success_response(response_data, "Feedback submitted successfully")
        
# #     except Exception as e:
# #         logging.error(f"Error in feedback endpoint: {str(e)}")
# #         return ResponseUtils.error_response("Internal server error", 500)

# # # @main_bp.route('/api/v1/model-info', methods=['GET'])
# # # @log_api_call
# # # def get_model_info():
# # #     """Get information about the current models"""
# # #     try:
# # #         predictor = get_diagnosis_predictor()
# # #         checker = get_drug_checker()
        
# # #         response_data = {
# # #             'diagnosis_model': {
# # #                 'status': 'loaded' if predictor.model is not None else 'not_loaded',
# # #                 'version': getattr(predictor, 'version', 'unknown'),
# # #                 'last_trained': getattr(predictor, 'last_trained', 'unknown')
# # #             },
# # #             'drug_checker': {
# # #                 'status': 'loaded' if checker.data_loaded else 'not_loaded',
# # #                 'version': getattr(checker, 'version', 'unknown'),
# # #                 'total_drugs': getattr(checker, 'total_drugs', 0)
# # #             }
# # #         }
        
# # #         return ResponseUtils.success_response(response_data, "Model information retrieved")
        
# # #     except Exception as e:
# # #         logging.error(f"Error in model info endpoint: {str(e)}")
# # #         return ResponseUtils.error_response("Internal server error", 500)

# # # Error handlers for the blueprint
# # @main_bp.errorhandler(400)
# # def bad_request(error):
# #     return ResponseUtils.error_response("Bad request", 400)

# # @main_bp.errorhandler(405)
# # def method_not_allowed(error):
# #     return ResponseUtils.error_response("Method not allowed", 405)


# from flask import Blueprint, request, jsonify, current_app
# import logging
# from utils import (
#     ValidationUtils, ResponseUtils, require_json, log_api_call
# )
# from ml.diagnosis_model.predictor import DiagnosisPredictor
# # from ml.drug_model.checker import DrugChecker  # Uncomment when drug checker ready

# # Rename main_bp to diagnosis_bp for clarity and import
# diagnosis_bp = Blueprint('diagnosis', __name__)

# # Initialize predictors (lazy load)
# diagnosis_predictor = None
# # drug_checker = None  # Uncomment when drug checker ready

# def get_diagnosis_predictor():
#     global diagnosis_predictor
#     if diagnosis_predictor is None:
#         diagnosis_predictor = DiagnosisPredictor()
#     return diagnosis_predictor

# # def get_drug_checker():
# #     global drug_checker
# #     if drug_checker is None:
# #         drug_checker = DrugChecker()
# #     return drug_checker

# @diagnosis_bp.route('/')
# def index():
#     return ResponseUtils.success_response({
#         'api_name': current_app.config['API_TITLE'],
#         'version': current_app.config['API_VERSION'],
#         'description': current_app.config['API_DESCRIPTION'],
#         'endpoints': {
#             'diagnosis': '/api/v1/diagnosis',
#             'drug_check': '/api/v1/drug-check',
#             'alternatives': '/api/v1/alternatives',
#             'feedback': '/api/v1/feedback',
#             'health': '/health'
#         }
#     })

# @diagnosis_bp.route('/api/v1/diagnosis', methods=['POST'])
# @require_json
# @log_api_call
# def diagnose():
#     try:
#         data = request.get_json()
#         is_valid, error_message = ValidationUtils.validate_symptoms_input(data)
#         if not is_valid:
#             return ResponseUtils.error_response(error_message, 400)

#         predictor = get_diagnosis_predictor()
#         predictions = predictor.predict(data)

#         if not predictions:
#             return ResponseUtils.error_response("Unable to make diagnosis prediction", 500)

#         formatted_results = ResponseUtils.format_diagnosis_results(predictions)

#         response_data = {
#             'patient_info': {
#                 'age': data['age'],
#                 'gender': data['gender']
#             },
#             'predictions': formatted_results,
#             'total_symptoms': sum(data['symptoms'].values()),
#             'recommendation': 'Please consult with a healthcare provider for proper diagnosis and treatment.'
#         }

#         logging.info(f"Diagnosis prediction made for {data['gender']}, age {data['age']}")
#         return ResponseUtils.success_response(response_data, "Diagnosis prediction completed")

#     except Exception as e:
#         logging.error(f"Error in diagnosis endpoint: {str(e)}")
#         return ResponseUtils.error_response("Internal server error", 500)

# # Uncomment and adapt drug check routes when ready

# @diagnosis_bp.route('/api/v1/feedback', methods=['POST'])
# @require_json
# @log_api_call
# def submit_feedback():
#     try:
#         data = request.get_json()

#         required_fields = ['type', 'feedback_score']
#         for field in required_fields:
#             if field not in data:
#                 return ResponseUtils.error_response(f"Missing required field: {field}", 400)

#         score = data.get('feedback_score')
#         if not isinstance(score, (int, float)) or score < 1 or score > 5:
#             return ResponseUtils.error_response("Feedback score must be between 1 and 5", 400)

#         logging.info(f"Feedback received: {data}")

#         response_data = {
#             'feedback_id': f"fb_{data['type']}_{hash(str(data))}",
#             'status': 'received',
#             'message': 'Thank you for your feedback. It will help improve our models.'
#         }

#         return ResponseUtils.success_response(response_data, "Feedback submitted successfully")

#     except Exception as e:
#         logging.error(f"Error in feedback endpoint: {str(e)}")
#         return ResponseUtils.error_response("Internal server error", 500)

# @diagnosis_bp.errorhandler(400)
# def bad_request(error):
#     return ResponseUtils.error_response("Bad request", 400)

# @diagnosis_bp.errorhandler(405)
# def method_not_allowed(error):
#     return ResponseUtils.error_response("Method not allowed", 405)

from flask import Blueprint, request, jsonify, current_app
import logging
from utils import (
    ValidationUtils, ResponseUtils, require_json, log_api_call
)
from ml.diagnosis_model.predictor import DiagnosisPredictor
# from ml.drug_model.checker import DrugChecker  # Uncomment when drug checker ready

# Rename main_bp to diagnosis_bp for clarity and import
diagnosis_bp = Blueprint('diagnosis', __name__)

# Initialize predictors (lazy load)
diagnosis_predictor = None
# drug_checker = None  # Uncomment when drug checker ready

def get_diagnosis_predictor():
    global diagnosis_predictor
    if diagnosis_predictor is None:
        diagnosis_predictor = DiagnosisPredictor()
    return diagnosis_predictor

# def get_drug_checker():
#     global drug_checker
#     if drug_checker is None:
#         drug_checker = DrugChecker()
#     return drug_checker

@diagnosis_bp.route('/')
def index():
    return ResponseUtils.success_response({
        'api_name': current_app.config['API_TITLE'],
        'version': current_app.config['API_VERSION'],
        'description': current_app.config['API_DESCRIPTION'],
        'endpoints': {
            'diagnosis': '/api/v1/diagnosis',
            'drug_check': '/api/v1/drug-check',
            'alternatives': '/api/v1/alternatives',
            'feedback': '/api/v1/feedback',
            'health': '/health'
        }
    })

# @diagnosis_bp.route('/api/v1/diagnosis', methods=['POST'])
# @require_json
# @log_api_call
# def diagnose():
#     try:
#         data = request.get_json()
#         is_valid, error_message = ValidationUtils.validate_symptoms_input(data)
#         if not is_valid:
#             return ResponseUtils.error_response(error_message, 400)

#         predictor = get_diagnosis_predictor()
#         predictions = predictor.predict(data)  # Expecting list of dicts

#         if not predictions:
#             return ResponseUtils.error_response("Unable to make diagnosis prediction", 500)

#         # Sort predictions by confidence descending
#         predictions_sorted = sorted(predictions, key=lambda x: x['confidence'], reverse=True)

#         # Format results with confidence percentage and message
#         formatted_results = []
#         for p in predictions_sorted:
#             confidence_percent = round(p['confidence'] * 100, 2)
#             condition = p['condition']
#             message = f"It is {confidence_percent}% likely that the patient has {condition}."
#             formatted_results.append({
#                 'condition': condition,
#                 'confidence': confidence_percent,
#                 'message': message
#             })

#         response_data = {
#             'patient_info': {
#                 'age': data['age'],
#                 'gender': data['gender']
#             },
#             'predictions': formatted_results,
#             'total_symptoms': sum(data['symptoms'].values()),
#             'recommendation': 'Please consult with a healthcare provider for proper diagnosis and treatment.'
#         }

#         logging.info(f"Diagnosis prediction made for {data['gender']}, age {data['age']}")
#         return ResponseUtils.success_response(response_data, "Diagnosis prediction completed")

#     except Exception as e:
#         logging.error(f"Error in diagnosis endpoint: {str(e)}")
#         return ResponseUtils.error_response("Internal server error", 500)


@diagnosis_bp.route('/api/v1/diagnosis', methods=['POST'])
@require_json
@log_api_call
def diagnose():
    try:
        data = request.get_json()
        logging.info(f"Received data: {data}")

        is_valid, error_message = ValidationUtils.validate_symptoms_input(data)
        if not is_valid:
            logging.warning(f"Validation failed: {error_message}")
            return ResponseUtils.error_response(error_message, 400)

        predictor = get_diagnosis_predictor()
        predictions = predictor.predict(data)
        logging.info(f"Predictions: {predictions}")

        if not predictions:
            return ResponseUtils.error_response("Unable to make diagnosis prediction", 500)

        formatted_results = ResponseUtils.format_diagnosis_results(predictions)
        response_data = {
            'patient_info': {
                'age': data['age'],
                'gender': data['gender']
            },
            'predictions': formatted_results,
            'total_symptoms': sum(data['symptoms'].values()),
            'recommendation': 'Please consult with a healthcare provider for proper diagnosis and treatment.'
        }

        logging.info(f"Diagnosis prediction made for {data['gender']}, age {data['age']}")
        return ResponseUtils.success_response(response_data, "Diagnosis prediction completed")

    except Exception as e:
        logging.error(f"Error in diagnosis endpoint: {str(e)}", exc_info=True)
        return ResponseUtils.error_response("Internal server error", 500)

# Uncomment and adapt drug check routes when ready

@diagnosis_bp.route('/api/v1/feedback', methods=['POST'])
@require_json
@log_api_call
def submit_feedback():
    try:
        data = request.get_json()

        required_fields = ['type', 'feedback_score']
        for field in required_fields:
            if field not in data:
                return ResponseUtils.error_response(f"Missing required field: {field}", 400)

        score = data.get('feedback_score')
        if not isinstance(score, (int, float)) or score < 1 or score > 5:
            return ResponseUtils.error_response("Feedback score must be between 1 and 5", 400)

        logging.info(f"Feedback received: {data}")

        response_data = {
            'feedback_id': f"fb_{data['type']}_{hash(str(data))}",
            'status': 'received',
            'message': 'Thank you for your feedback. It will help improve our models.'
        }

        return ResponseUtils.success_response(response_data, "Feedback submitted successfully")

    except Exception as e:
        logging.error(f"Error in feedback endpoint: {str(e)}")
        return ResponseUtils.error_response("Internal server error", 500)

@diagnosis_bp.errorhandler(400)
def bad_request(error):
    return ResponseUtils.error_response("Bad request", 400)

@diagnosis_bp.errorhandler(405)
def method_not_allowed(error):
    return ResponseUtils.error_response("Method not allowed", 405)
