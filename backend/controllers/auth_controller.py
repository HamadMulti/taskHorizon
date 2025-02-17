from flask import request, jsonify
from models.user import db, User
from utils.mailer import send_otp_email, send_reset_email
from utils.security import hash_password, verify_password, generate_token
import random, string

def register_user():
    data = request.json
    hashed_password = hash_password(data["password"])
    user = User(username=data["username"], email=data["email"], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

def login_user():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and verify_password(user.password, data["password"]):
        otp = ''.join(random.choices(string.digits, k=6))
        user.otp = otp
        db.session.commit()
        send_otp_email(user.email, otp)
        return jsonify({"message": "OTP sent"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

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
