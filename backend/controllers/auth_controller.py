import os
from flask import request, jsonify
from models.user import db, User
from utils.mailer import new_registration_email, send_otp_email, send_reset_email
from utils.security import decoded_token, hash_password, verify_password, generate_token
import random
import string
from flask import make_response


def generate_otp():
    return ''.join(random.choices(string.digits, k=6))


def get_cookie_secure_flag():
    return os.environ.get("FLASK_ENV") == "production"

def _token_handler(user_id, message):
    token = generate_token(user_id)
    if not token:
        return jsonify({"error": "Token generation failed"}), 500
    response = make_response(jsonify({"message": message, "access_token": token}), 200)
    response.set_cookie('access_token', token, path="/", httponly=True, secure=get_cookie_secure_flag(), samesite='Strict')
    return response

def register_user():
    data = request.json
    existing_username = User.query.filter_by(username=data["username"]).first()
    if existing_username:
        return jsonify({"username": "Username already exists"}), 400
    existing_user_by_email = User.query.filter_by(email=data["email"]).first()
    if existing_user_by_email:
        return jsonify({"email": "Email already exists"}), 400
    if len(data["password"]) < 8 or len(data["password"]) > 20:
        return jsonify({"password": "Password must be between 8 and 20 characters"}), 400
    if data["password"] != data["confirmPassword"]:
        return jsonify({"confirmPassword": "Passwords do not match"}), 400
    hashed_password = hash_password(data["password"])
    user = User(username=data["username"], email=data["email"], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    if user:
        new_registration_email(user.email)
        return _token_handler(user.id, "User registered successfully")
    return jsonify({"error": "User registration failed"}), 500


def login_user():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and verify_password(user.password, data["password"]):
        return _login_user_otp(user)
    return jsonify({"error": "Invalid credentials"}), 401


def _login_user_otp(user):
    otp = generate_otp()
    user.otp = otp
    db.session.commit()
    send_otp_email(user.email, otp)
    return _token_handler(user.id, "OTP sent")



def logout_user():
    response = make_response(jsonify({"message": "Successfully logged out"}), 200)
    response.set_cookie('access_token', '', expires=0, httponly=True,
                        secure=get_cookie_secure_flag(), samesite='Strict')
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
        access_token = generate_token(user.id)
        return jsonify({"access_token": access_token, "role": user.role}), 200
    return jsonify({"error": "Invalid OTP"}), 401


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

    if not token or not new_password:
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
