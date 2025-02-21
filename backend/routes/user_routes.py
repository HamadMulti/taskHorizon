"""
This module defines the routes for user-related operations in the application.

Routes:
  /update-profile (PUT): Updates the user's profile using the `update_profile` controller function.
  /profile (GET): Retrieves the user's profile using the `get_profile` controller function.

Blueprints:
  user_bp: A Flask Blueprint for user-related routes.
"""
from flask import Blueprint
from controllers.user_controller import get_profile, update_profile

user_bp = Blueprint("user", __name__)

user_bp.route("/update-profile", methods=["PUT"])(update_profile)
user_bp.route("/profile", methods=["GET"])(get_profile)

