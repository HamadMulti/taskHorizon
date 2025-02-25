from datetime import datetime, timedelta
import os
from flask import request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models.user import db, User
from utils.mailer import new_registration_email, send_otp_email, send_reset_email
from utils.security import decoded_token, hash_password, verify_password, generate_token
import random
import string
from flask import make_response
from sqlalchemy.exc import IntegrityError
import re


def generate_otp():
    return ''.join(random.choices(string.digits, k=6))


def get_cookie_secure_flag():
    return os.environ.get("FLASK_ENV") == "production"

from datetime import datetime, timedelta, timezone

def _token_handler(user_id, message, **kwargs):
    access_token = generate_token(user_id)
    refresh_token = generate_token(user_id)

    if not access_token or not refresh_token:
        return jsonify({"error": "Token generation failed"}), 500

    response = make_response(jsonify({
        "message": message,
        "access_token": access_token,
        "refresh_token": refresh_token,
        **kwargs
    }), 200)

    response.set_cookie(
        'access_token',
        access_token,
        path="/",
        httponly=True,
        secure=get_cookie_secure_flag(),
        samesite='Lax',
        max_age=3600,
        expires=datetime.now(timezone.utc) + timedelta(hours=1),
    )

    response.set_cookie(
        'refresh_token',
        refresh_token,
        path="/",
        httponly=True,
        secure=get_cookie_secure_flag(),
        samesite='Lax',
        max_age=86400,
        expires=datetime.now(timezone.utc) + timedelta(days=7),
    )

    return response


@jwt_required(refresh=True)
def refresh_access_token():
    try:
        identity = get_jwt_identity()
        user = User.query.get(identity)

        if not user:
            return jsonify({"error": "User not found"}), 404

        new_access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))

        return jsonify({"access_token": new_access_token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



def register_user():
    data = request.json
    
    required_fields = ["username", "email", "password", "confirmPassword"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({field: f"{field} is required"}), 400

    username, email, password, confirm_password = data["username"], data["email"], data["password"], data["confirmPassword"]

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"email": "Invalid email format"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"username": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"email": "Email already exists"}), 400

    if len(password) < 8 or len(password) > 20:
        return jsonify({"password": "Password must be between 8 and 20 characters"}), 400
    if password != confirm_password:
        return jsonify({"confirmPassword": "Passwords do not match"}), 400

    hashed_password = hash_password(password)
    user = User(username=username, email=email, password=hashed_password)

    try:
        db.session.add(user)
        db.session.commit()
        return _register_user(user)
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "User registration failed due to database error"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


def _register_user(user):
    try:
        return _register_user_mail_and_otp(user)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


def _register_user_mail_and_otp(user):
    otp = generate_otp()
    try:
        user.otp = otp
        db.session.commit()
        send_otp_email(user.email, otp)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to save OTP"}), 500

    new_registration_email(user.email)
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
    return _token_handler(user.id, "User registered successfully", user=profile)



def login_user():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and verify_password(user.password, data["password"]):
        return _login_user_otp(user)
    else:
        return jsonify({"error": "Invalid credentials"}), 400


def _login_user_otp(user):
    otp = generate_otp()
    try:
        user.otp = otp
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to save OTP"}), 500
    send_otp_email(user.email, otp)
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
    return _token_handler(user.id, "OTP sent", user=profile)



def logout_user():
    response = make_response(jsonify({"message": "Successfully logged out"}), 200)
    response.set_cookie('access_token', '', expires=0, httponly=True,
                        secure=get_cookie_secure_flag(), samesite='Lax')
    return response


def send_otp():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400
    user = User.query.filter_by(email=email).first()

    if user:
        otp = generate_otp()
        user.otp = otp
        db.session.commit()
        send_otp_email(user.email, otp)
        return jsonify({"message": "OTP sent successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


def verify_otp():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and user.otp == data["otp"]:
        return _token_handler(user.id, "Verification success", role=user.role)
    return jsonify({"error": "Invalid OTP"}), 400


def forgot_password():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user:
        token = generate_token(user.id)
        send_reset_email(user.email, token)
        return jsonify({"message": "Password reset email sent"}), 200
    return jsonify({"error": "User not found"}), 404


def reset_password():
    data = request.json
    token = data.get("token")
    new_password = data.get("password")

    if token is None or new_password is None:
        return jsonify({"error": "Token and password are required"}), 400

    try:
        return _reset_password_(token, new_password)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def _reset_password_(token, new_password):
    user_id = decoded_token(token)

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    hashed_password = hash_password(new_password)
    user.password = hashed_password
    db.session.commit()
    return jsonify({"message": "Password has been updated successfully"}), 200
