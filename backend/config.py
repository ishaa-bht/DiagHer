import os
from datetime import timedelta

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'diagher-secret-key-2024'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///diagher.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # API Configuration
    API_VERSION = 'v1'
    API_TITLE = 'DiagHer API'
    API_DESCRIPTION = 'Healthcare AI API for gender-aware medical diagnosis'
    
    # ML Model Configuration
    MODEL_PATH = os.path.join('ml', 'models')
    DATA_PATH = os.path.join('data')
    
    # Enhanced Diagnosis Model Settings
    DIAGNOSIS_MODEL_CONFIDENCE_THRESHOLD = 0.4  # Lowered for better coverage
    MAX_DIAGNOSIS_RESULTS = 3  # Top 3 predictions as per your requirement
    MIN_DIAGNOSIS_CONFIDENCE = 0.1  # Minimum confidence for consideration
    
    # Confidence Level Thresholds
    HIGH_CONFIDENCE_THRESHOLD = 0.8
    MEDIUM_CONFIDENCE_THRESHOLD = 0.6
    LOW_CONFIDENCE_THRESHOLD = 0.4
    
    # Prediction Settings
    ENABLE_DETAILED_PREDICTIONS = True
    INCLUDE_RELEVANT_SYMPTOMS = True
    INCLUDE_CONFIDENCE_LEVELS = True
    
    # Drug Checker Settings (for future use)
    DRUG_RISK_THRESHOLD = 0.7
    MAX_ALTERNATIVE_SUGGESTIONS = 5
    
    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'
    LOG_FILE = 'logs/diagher.log'
    LOG_MAX_BYTES = 10 * 1024 * 1024  # 10MB
    LOG_BACKUP_COUNT = 5
    
    # CORS Settings
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # File Upload Settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'csv', 'json', 'xlsx'}
    
    # Rate Limiting
    RATELIMIT_STORAGE_URL = "memory://"
    RATELIMIT_DEFAULT = "100 per hour"
    RATELIMIT_DIAGNOSIS = "50 per hour"  # Specific limit for diagnosis endpoint
    
    # Cache Settings
    CACHE_TYPE = "simple"
    CACHE_DEFAULT_TIMEOUT = 300  # 5 minutes
    
    # Model Loading Settings
    MODEL_LAZY_LOADING = True
    MODEL_RETRY_ATTEMPTS = 3
    MODEL_RETRY_DELAY = 1  # seconds
    
    # API Response Settings
    INCLUDE_TIMESTAMPS = True
    INCLUDE_REQUEST_ID = False
    PRETTY_JSON = True

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False
    SQLALCHEMY_ECHO = True
    
    # Development-specific settings
    LOG_LEVEL = 'DEBUG'
    RATELIMIT_ENABLED = False
    
    # Relaxed validation for development
    DIAGNOSIS_MODEL_CONFIDENCE_THRESHOLD = 0.1
    
    # Enable detailed logging in development
    SQLALCHEMY_RECORD_QUERIES = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_ECHO = False
    
    # Production-specific settings
    LOG_LEVEL = 'INFO'
    RATELIMIT_ENABLED = True
    
    # Stricter settings for production
    DIAGNOSIS_MODEL_CONFIDENCE_THRESHOLD = 0.4
    
    # Security settings
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Enhanced rate limiting for production
    RATELIMIT_DEFAULT = "50 per hour"
    RATELIMIT_DIAGNOSIS = "20 per hour"

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
    
    # Testing-specific settings
    LOG_LEVEL = 'DEBUG'
    RATELIMIT_ENABLED = False
    
    # Relaxed settings for testing
    DIAGNOSIS_MODEL_CONFIDENCE_THRESHOLD = 0.1
    MODEL_LAZY_LOADING = False
    
    # Fast cache timeout for testing
    CACHE_DEFAULT_TIMEOUT = 1

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

# Configuration validation
def validate_config(config_obj):
    """Validate configuration settings"""
    required_paths = [config_obj.MODEL_PATH, config_obj.DATA_PATH, config_obj.UPLOAD_FOLDER]
    
    for path in required_paths:
        if not os.path.exists(path):
            try:
                os.makedirs(path, exist_ok=True)
            except Exception as e:
                raise ValueError(f"Cannot create required directory {path}: {str(e)}")
    
    # Validate thresholds
    if not (0 <= config_obj.DIAGNOSIS_MODEL_CONFIDENCE_THRESHOLD <= 1):
        raise ValueError("DIAGNOSIS_MODEL_CONFIDENCE_THRESHOLD must be between 0 and 1")
    
    if not (0 <= config_obj.HIGH_CONFIDENCE_THRESHOLD <= 1):
        raise ValueError("HIGH_CONFIDENCE_THRESHOLD must be between 0 and 1")
    
    return True

# Add these lines to the Config class after the existing drug settings
DRUG_MODEL_PATH = os.path.join('C:\BCT\Hackathon\DiagHer-main\backend\data', 'female_drug_side_effects.csv')
DRUG_ANALYZER_ENABLED = True