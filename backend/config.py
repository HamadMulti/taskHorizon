import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class.

    This class defines the common configuration settings for all environments.
    """
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS") == "True"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

class DevelopmentConfig(Config):
    """Configuration for the development environment.

    This class inherits from the base Config class and sets specific settings for development, including debug mode and the database URI.
    """
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DEV_DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(Config):
    """Configuration for the production environment.

    This class inherits from the base Config class and sets specific settings for production, including debug mode and the database URI.
    """
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("PROD_DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False 

env = os.getenv("FLASK_ENV", "development")
CurrentConfig = ProductionConfig if env == "production" else DevelopmentConfig
