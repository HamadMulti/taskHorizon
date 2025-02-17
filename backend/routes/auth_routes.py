from flask import Blueprint
from controllers.auth_controller import register_user, login_user, verify_otp, forgot_password

auth_bp = Blueprint("auth", __name__)

auth_bp.route("/register", methods=["POST"])(register_user)
auth_bp.route("/login", methods=["POST"])(login_user)
auth_bp.route("/verify-otp", methods=["POST"])(verify_otp)
auth_bp.route("/forgot-password", methods=["POST"])(forgot_password)