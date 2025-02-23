from datetime import datetime, timedelta
import os
from flask import request, jsonify
from models.user import db, User
from utils.mailer import new_registration_email, send_otp_email, send_reset_email
from utils.security import decoded_token, hash_password, verify_password, generate_token
import random
import string
from flask import make_response


def generate_otp():
    """Generates a random 6-digit OTP.

    This function generates a random 6-digit One-Time Password (OTP) using the `random` and `string` modules.
    It returns the generated OTP as a string.

    Returns:
        str: The generated 6-digit OTP.
    """
    return ''.join(random.choices(string.digits, k=6))


def get_cookie_secure_flag():
    """Determines the secure flag for cookies based on the environment.

    This function checks if the application is running in production mode and returns True if it is, indicating that cookies should be marked as secure. Otherwise, it returns False.

    Returns:
        bool: True if in production mode, False otherwise.
    """
    return os.environ.get("FLASK_ENV") == "production"

def _token_handler(user_id, message, **kwargs):
    """
    Generates an access token for the given user ID, creates a JSON response with the token,
    and sets the token as an HTTP-only cookie.

    Args:
        user_id (int): The ID of the user for whom the token is generated.
        message (str): A message to include in the JSON response.
        **kwargs: Additional keyword arguments to include in the JSON response.

    Returns:
        Response: A Flask response object containing the JSON response with the access token
                    and the token set as an HTTP-only cookie.

    Raises:
        500 Internal Server Error: If token generation fails.
    """
    # sourcery skip: aware-datetime-for-utc
    token = generate_token(user_id)
    if not token:
        return jsonify({"error": "Token generation failed"}), 500
    response = make_response(jsonify({"message": message, "access_token": token, **kwargs}), 200)
    response.set_cookie(
        'access_token',
        token,
        path="/",
        httponly=True,
        secure=get_cookie_secure_flag(),
        samesite='Lax',
        max_age=14400,
        expires=datetime.utcnow() + timedelta(hours=4) 
    )
    return response

def register_user():
    """
    Registers a new user.

    This function handles the registration of a new user by performing the following steps:
    1. Retrieves the JSON data from the request.
    2. Checks if the username already exists in the database.
    3. Checks if the email already exists in the database.
    4. Validates the password length (must be between 8 and 20 characters).
    5. Confirms that the password and confirmPassword fields match.
    6. Hashes the password and creates a new user record in the database.
    7. Sends a registration email to the new user.
    8. Returns a success message with a token if the registration is successful.
    9. Returns an error message if the registration fails.

    Returns:
        Response: A JSON response indicating the result of the registration process.
    """
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
    return jsonify({"error": "User registration failed"}), 500


def login_user():
    """Logs in an existing user.

    This function handles user login by verifying the provided email and password
    against the database. If the credentials are valid, it proceeds with OTP generation and sending.

    Returns:
        Response: A JSON response indicating success with OTP sent or an error message if login fails.
    """
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and verify_password(user.password, data["password"]):
        return _login_user_otp(user)
    return jsonify({"error": "Invalid credentials"}), 401


def _login_user_otp(user):
    """Generates and sends an OTP to the user for login verification.

    This function generates a new OTP, updates the user's OTP field in the database,
    sends the OTP via email, and returns a token handler response.

    Args:
        user (User): The user object.

    Returns:
        Response: A Flask response object.
    """
    otp = generate_otp()
    user.otp = otp
    db.session.commit()
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
    """Logs out the current user.

    This function clears the access token cookie, effectively logging the user out.

    Returns:
        Response: A JSON response indicating successful logout.
    """
    response = make_response(jsonify({"message": "Successfully logged out"}), 200)
    response.set_cookie('access_token', '', expires=0, httponly=True,
                        secure=get_cookie_secure_flag(), samesite='Lax')
    return response


def send_otp():
    """Sends an OTP to the user's email address.

    This function retrieves the user's email from the request data, generates an OTP,
    updates the user's OTP field in the database, and sends the OTP via email.

    Returns:
        Response: A JSON response indicating success or an error message if sending fails.
    """
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
    """Verifies the user's OTP.

    This function retrieves the user's email and OTP from the request data,
    compares it with the OTP stored in the database, and if matched, generates and returns an access token.

    Returns:
        Response: A JSON response containing the access token and user role if OTP is valid, or an error message if invalid.
    """
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and user.otp == data["otp"]:
        access_token = generate_token(user.id)
        return jsonify({"access_token": access_token, "role": user.role}), 200
    return jsonify({"error": "Invalid OTP"}), 401


def forgot_password():
    """Initiates the password reset process.

    This function retrieves the user's email from the request data, generates a reset token,
    and sends a password reset email containing the token to the user.

    Returns:
        Response: A JSON response indicating success or an error message if the user is not found.
    """
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user:
        token = generate_token(user.id)
        send_reset_email(user.email, token)
        return jsonify({"message": "Password reset email sent"}), 200
    return jsonify({"error": "User not found"}), 404


def reset_password():
    """Resets the user's password.

    This function retrieves the reset token and new password from the request data,
    validates the token, and updates the user's password in the database.

    Returns:
        Response: A JSON response indicating success or an error message if reset fails.
    """
    data = request.json
    token = data.get("token")
    new_password = data.get("password")
    print(token)
    print(new_password)

    if token is None or new_password is None:
        return jsonify({"error": "Token and password are required"}), 400

    try:
        return _reset_password_(token, new_password)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def _reset_password_(token, new_password):
    """Resets the user's password.

    This function decodes the provided token to get the user ID, retrieves the user from the database,
    hashes the new password, updates the user's password, and commits the changes.

    Args:
        token (str): The reset token.
        new_password (str): The new password.

    Returns:
        Response: A JSON response indicating successful password update or an error if the user is not found.
    """
    user_id = decoded_token(token)

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    hashed_password = hash_password(new_password)
    user.password = hashed_password
    db.session.commit()
    return jsonify({"message": "Password has been updated successfully"}), 200
