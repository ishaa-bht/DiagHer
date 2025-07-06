from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import logging
from config import config
from utils import setup_logging

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.environ.get('FLASK_CONFIG', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Setup logging
    setup_logging(app.config['LOG_LEVEL'], app.config.get('LOG_FILE'))
    
    # Initialize extensions
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Initialize rate limiter
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        default_limits=[app.config['RATELIMIT_DEFAULT']],
        storage_uri=app.config['RATELIMIT_STORAGE_URL']
    )
    
    # Register blueprints
    from app.routes import main_bp
    app.register_blueprint(main_bp)
    
    # Create necessary directories
    os.makedirs(app.config['MODEL_PATH'], exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(os.path.dirname(app.config['LOG_FILE']), exist_ok=True)
    
    @app.errorhandler(404)
    def not_found(error):
        return {
            'status': 'error',
            'message': 'Resource not found',
            'data': None
        }, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logging.error(f"Internal server error: {str(error)}")
        return {
            'status': 'error',
            'message': 'Internal server error',
            'data': None
        }, 500
    
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return {
            'status': 'error',
            'message': 'Rate limit exceeded',
            'data': None
        }, 429
    
    @app.route('/health')
    def health_check():
        """Health check endpoint"""
        return {
            'status': 'healthy',
            'message': 'DiagHer API is running',
            'version': app.config['API_VERSION']
        }
    
    logging.info(f"DiagHer Flask app created with config: {config_name}")
    return app