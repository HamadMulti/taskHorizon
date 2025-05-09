import random
import re
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.task import Task, TaskHistory
from models.project import Project
from utils.security import hash_password
from models.subscribe import Subscriber
from utils.mailer import change_teammate_password, create_teammate, new_subscriber_mail
from models.user import db, User
import random
import string


@jwt_required()
def update_profile():
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
def updates_profile(users_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    user_to_update = User.query.get(users_id)

    if not current_user or not user_to_update:
        return jsonify({"error": "User not found"}), 404

    if current_user.id == user_to_update.id or current_user.role in ["admin", "team_leader"]:
        data = request.json
        user_to_update.username = data.get("username", user_to_update.username)
        user_to_update.email = data.get("email", user_to_update.email)
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200

    return jsonify({"error": "Unauthorized"}), 403
    
    


@jwt_required()
def get_profile():
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
def get_assigned_to(user_id):
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
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    if not user:
        return jsonify({"error": "User not found or unauthorized"}), 403
    
    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

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

def generate_random_password(length=10):
    """Generates a secure random password."""
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(random.choice(characters) for _ in range(length))

@jwt_required()
def create_team_member():
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
        return jsonify({"username": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"email": "Email already exists"}), 400

    generated_password = generate_random_password()
    hashed_password = hash_password(generated_password)

    new_user = User(username=username, email=email, password=hashed_password, role="user")
    db.session.add(new_user)
    db.session.commit()
    create_teammate(new_user.email, new_user.username, generated_password)

    return jsonify({"message": "Team member created successfully. An email has been sent."}), 201

@jwt_required()
def change_team_member_password(users_id):
    user_id = get_jwt_identity()
    user = User.query.get(users_id)
    role_user = User.query.get(user_id)

    if role_user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    if not User.query.filter_by(email=user.email).first():
        return jsonify({"error": "User already exists"}), 400

    generated_password = generate_random_password()
    hashed_password = hash_password(generated_password)

    user.password = hashed_password
    db.session.commit()
    change_teammate_password(user.email, user.username, generated_password)

    return jsonify({"message": "Team member created successfully. An email has been sent."}), 201


@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    user_to_delete = User.query.get(user_id)

    if not current_user or not user_to_delete:
        return jsonify({"error": "User not found"}), 404

    if current_user.id == user_to_delete.id or current_user.role in ["admin", "team_leader"]:
        db.session.query(Task).filter(Task.assigned_to == user_to_delete.id).update({"assigned_to": None})
        db.session.query(Project).filter(Project.owner_id == user_to_delete.id).update({"owner_id": current_user.id})
        db.session.query(TaskHistory).filter(TaskHistory.updated_by == user_to_delete.id).update({"updated_by": current_user.id})

        db.session.delete(user_to_delete)
        db.session.commit()
        
        return jsonify({"message": "User deleted successfully"}), 200

    return jsonify({"error": "Unauthorized"}), 403


