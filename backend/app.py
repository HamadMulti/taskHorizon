from flask import Flask, make_response, request
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
front_end_urls = os.getenv("FRONTEND_URL").split(",")
front_end_url = [url.strip() for url in front_end_urls]


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
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {"origins": front_end_url,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "supports_credentials": True}})

    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            origin = request.headers.get("Origin")
            response = make_response()
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response

    from routes.auth_routes import auth_bp
    from routes.user_routes import user_bp
    from routes.task_routes import task_bp
    from routes.project_routes import project_bp
    from routes.home_route import home_bp
    from routes.analytics_routes import analytics_bp

    app.register_blueprint(home_bp, url_prefix="/")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(task_bp, url_prefix="/tasks")
    app.register_blueprint(project_bp, url_prefix="/projects")
    app.register_blueprint(analytics_bp, url_prefix="/analytics")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=app.config["DEBUG"])
