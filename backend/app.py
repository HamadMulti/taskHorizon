from flask import Flask
from models import db
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import CurrentConfig
from flask_cors import CORS
from flask_migrate import Migrate
import os

jwt = JWTManager()
mail = Mail()
migrate = Migrate()
front_end_url = os.getenv("FRONTEND_URL")

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = CurrentConfig.SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = CurrentConfig.SQLALCHEMY_TRACK_MODIFICATIONS
    app.config["SECRET_KEY"] = CurrentConfig.SECRET_KEY
    app.config["JWT_SECRET_KEY"] = CurrentConfig.JWT_SECRET_KEY
    app.config["MAIL_SERVER"] = CurrentConfig.MAIL_SERVER
    app.config["MAIL_PORT"] = CurrentConfig.MAIL_PORT
    app.config["MAIL_USE_TLS"] = CurrentConfig.MAIL_USE_TLS
    app.config["MAIL_USERNAME"] = CurrentConfig.MAIL_USERNAME
    app.config["MAIL_PASSWORD"] = CurrentConfig.MAIL_PASSWORD
    app.config["DEBUG"] = CurrentConfig.DEBUG

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app, supports_credentials=True, origins=[front_end_url])
    migrate.init_app(app, db)

    from routes.auth_routes import auth_bp
    from routes.user_routes import user_bp
    from routes.task_routes import task_bp
    from routes.project_routes import project_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(task_bp, url_prefix="/tasks")
    app.register_blueprint(project_bp, url_prefix="/projects")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=app.config["DEBUG"])
