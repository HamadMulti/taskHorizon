import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev_50622e91c04ebe6b7fa9e2a619631397c85783c373477e96b587bc37dfb50367_key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt_2203eac3af174e5d1d5aaf664373c6f5b6058aedec46a59052a87973b241d0cc_key")
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS") == "True"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DEV_DATABASE_URL", "sqlite:///./development.sqlite3")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("PROD_DATABASE_URL", "sqlite:///./production.sqlite3")

env = os.getenv("FLASK_ENV", "development")
CurrentConfig = ProductionConfig if env == "production" else DevelopmentConfig
