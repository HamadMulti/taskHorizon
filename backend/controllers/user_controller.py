from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import db, User
from utils.security import hash_password


@jwt_required()
def update_profile():
    """Updates the user's profile.

    This endpoint allows users to update their profile information, such as phone number, location, gender, and primary email.
    It retrieves the user's ID from the JWT token and updates the corresponding user record in the database.

    Returns:
        tuple: A tuple containing the JSON response and HTTP status code.
        - 200: Profile updated successfully.
        - 403: Unauthorized access.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        data = request.json
        user.phone = data.get("phone", user.phone)
        user.location = data.get("location", user.location)
        user.gender = data.get("gender", user.gender)
        user.primary_email = data.get("primary_email", user.primary_email)
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    return jsonify({"error": "Unauthorized"}), 403


@jwt_required()
def get_profile():
    """Retrieves the user's profile.

    This endpoint retrieves the profile information of the currently logged-in user.
    It retrieves the user's ID from the JWT token and returns the corresponding user details.

    Returns:
        tuple: A tuple containing the JSON response and HTTP status code.
        - 200: Profile retrieved successfully.
        - 403: Unauthorized access.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        profile = {
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "phone": user.phone,
                "location": user.location,
                "gender": user.gender,
                "primary_email": user.primary_email,
                "verified": user.verified,
            }
        
        return jsonify({"user": profile}), 200

    return jsonify({"error": "Unauthorized"}), 403


@jwt_required()
def get_profiles():
    """Retrieves all user profiles.

    This endpoint retrieves all user profiles from the database.
    It retrieves the user's ID from the JWT token and returns the corresponding user details.

    Returns:
        tuple: A tuple containing the JSON response and HTTP status code.
        - 200: Profiles retrieved successfully.
        - 403: Unauthorized access.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        users = User.query.all()
        profiles = {
            "users": [{
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "phone": u.phone,
                "location": u.location,
                "gender": u.gender,
                "primary_email": u.primary_email,
                "verified": u.verified,
        } for u in users]}
        
        return jsonify(profiles), 200

    return jsonify({"error": "Unauthorized"}), 403
