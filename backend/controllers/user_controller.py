import re
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.subscribe import Subscriber
from utils.mailer import new_subscriber_mail
from models.user import db, User


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

def is_valid_email(email):
    """Check if email is valid using regex"""
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email)

def subscribe_user():
    data = request.json
    email = data.get("email")

    if not email or not is_valid_email(email):
        return jsonify({'error': 'Invalid email format!'}), 400

    existing_user = Subscriber.query.filter(Subscriber.email.ilike(email)).first()

    if existing_user:
        return jsonify({'error': 'Email already subscribed!'}), 400

    try:
        new_user = Subscriber(email=email)
        db.session.add(new_user)
        db.session.commit()
        new_subscriber_mail(email)
        return jsonify({"message": "Congratulations! You have successfully subscribed."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Subscription failed. Please try again."}), 500

    
