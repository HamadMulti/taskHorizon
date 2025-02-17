from flask import Flask
from models import db
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import CurrentConfig
from flask_cors import CORS
from flask_migrate import Migrate

jwt = JWTManager()
mail = Mail()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(CurrentConfig)

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app, supports_credentials=True, origins="*")
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
