from flask import Blueprint
from controllers.user_controller import update_profile

user_bp = Blueprint("user", __name__)

user_bp.route("/update-profile", methods=["PUT"])(update_profile)
