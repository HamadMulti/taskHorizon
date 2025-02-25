"""
This module defines the routes for user-related operations in the application.

Routes:
  /update-profile (PUT): Updates the user's profile using the `update_profile` controller function.
  /profile (GET): Retrieves the user's profile using the `get_profile` controller function.

Blueprints:
  user_bp: A Flask Blueprint for user-related routes.
"""
from flask import Blueprint
from controllers.user_controller import change_team_member_password, create_team_member, delete_user, get_profile, get_profiles, subscribe_user, update_profile, updates_profile

user_bp = Blueprint("user", __name__)

user_bp.route("/update-profile", methods=["PUT"])(update_profile)
user_bp.route("/profile", methods=["GET"])(get_profile)
user_bp.route("/profiles", methods=["GET"])(get_profiles)
user_bp.route("/subscribe", methods=["POST"])(subscribe_user)
user_bp.route("/create-user", methods=["POST"])(create_team_member)
user_bp.route("/<int:user_id>", methods=["DELETE"])(delete_user)
user_bp.route("/updates-profile/<int:users_id>", methods=["PUT"])(updates_profile)
user_bp.route("/change-password/<int:users_id>", methods=["PUT"])(change_team_member_password)

