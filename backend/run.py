# from flask import Flask
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager

# from config import config
# from utils import setup_logging
# import logging

# from app.routes import diagnosis_bp
# app.register_blueprint(main_bp)



# # Import your Blueprints or Routes
# # from routes.diagnosis_routes import diagnosis_bp
# # from routes.drug_routes import drug_bp (once available)

# def create_app(config_name='default'):
#     """Create and configure the Flask app"""
#     app = Flask(__name__)
    
#     # Load configuration
#     app.config.from_object(config[config_name])
    
#     # Setup logging
#     setup_logging(app.config['LOG_LEVEL'], app.config['LOG_FILE'])
#     logging.info(f"Starting DiagHer app with {config_name} config")

#     # Enable CORS
#     CORS(app, origins=app.config['CORS_ORIGINS'])
    
#     # Setup JWT
#     jwt = JWTManager(app)

#     # Register blueprints
#     app.register_blueprint(diagnosis_bp, url_prefix='/api/v1/diagnosis')
#     # app.register_blueprint(drug_bp, url_prefix='/api/v1/drugs')  # later
    


#     # Optional health route
#     @app.route('/api/health', methods=['GET'])
#     def health_check():
#         return {"status": "OK", "message": "DiagHer API running"}

#     return app

# if __name__ == '__main__':
#     app = create_app()
#     app.run(debug=True)


from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import config
from utils import setup_logging
import logging

# ✅ Import the blueprint AFTER defining the Flask app
from app.routes import diagnosis_bp

def create_app(config_name='default'):
    """Create and configure the Flask app"""
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config[config_name])

    # Setup logging
    setup_logging(app.config['LOG_LEVEL'], app.config['LOG_FILE'])
    logging.info(f"Starting DiagHer app with {config_name} config")

    # Enable CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])

    # Setup JWT
    jwt = JWTManager(app)

    # ✅ Register blueprints
    app.register_blueprint(diagnosis_bp)  # Already has full route paths inside

    # Optional health check
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {"status": "OK", "message": "DiagHer API running"}

    return app

# ✅ Create and run the app only if executed directly
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
