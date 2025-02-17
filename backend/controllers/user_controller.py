from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import db, User
from utils.security import hash_password

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

