import random
import re
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.subscribe import Subscriber
from utils.mailer import create_teammate, new_subscriber_mail
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

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    if not user:
        return jsonify({"error": "User not found or unauthorized"}), 403

    users = User.query.paginate(page=page, per_page=per_page, error_out=False)

    if not users:
        return jsonify({"message": "No users found", "users": []}), 200

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
        } for u in users],
        "total": users.total,
        "pages": users.pages,
        "current_page": users.page
    }

    return jsonify(profiles), 200


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
    
import random
import string
from werkzeug.security import generate_password_hash

def generate_random_password(length=10):
    """Generates a secure random password."""
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))

@jwt_required()
def create_team_member():
    """Allows an admin or team leader to create a team member.

    The function generates a random password, saves the user in the database, and sends an email with the login credentials.

    Returns:
        Response: A JSON response indicating success or failure.
        - 201: Team member created successfully.
        - 400: Bad request (e.g., missing fields, duplicate user).
        - 403: Unauthorized access.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    username = data.get("username")
    email = data.get("email")

    if not username or not email:
        return jsonify({"error": "Username and email are required"}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({"username": "Username already taken"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    generated_password = generate_random_password()
    hashed_password = generate_password_hash(generated_password)

    new_user = User(username=username, email=email, password=hashed_password, role="user")
    db.session.add(new_user)
    db.session.commit()
    create_teammate(new_user.email, new_user.username, generated_password)

    return jsonify({"message": "Team member created successfully. An email has been sent."}), 201
