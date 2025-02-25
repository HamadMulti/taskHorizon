import os
from flask import jsonify
from flask_mail import Message
from app import mail

my_email = os.getenv("MAIL_USERNAME")
front_end_url = os.getenv("FRONTEND_URL")


def send_otp_email(email, otp):
    """
    Sends an OTP (One-Time Password) email to the specified recipient.

    Args:
        email (str): The recipient's email address.
        otp (str): The OTP code to be sent in the email.

    Returns:
        None
    """
    msg = Message("Your OTP Code", sender=my_email, recipients=[email])
    msg.body = f"Your OTP Code is {otp}"
    mail.send(msg)


def send_reset_email(email, token):
    """
    Sends a password reset email to the specified recipient.

    Args:
        email (str): The recipient's email address.
        token (str): The password reset token.

    Returns:
        None
    """
    msg = Message("Password Reset Link", sender=my_email, recipients=[email])
    msg.body = f"Click the link to reset your password: {front_end_url}/reset-password/{token}"
    mail.send(msg)


def new_registration_email(email):
    """
    Sends a welcome email to a newly registered user.

    Args:
        email (str): The recipient's email address.

    Returns:
        None
    """
    msg = Message("Welcome to our platform", sender=my_email, recipients=[email])
    msg.body = "Welcome to our platform. We are glad to have you here."
    mail.send(msg)


def new_subscriber_mail(email):
    """
    Sends a Subscription email to a user.

    Args:
        email (str): The recipient's email address.

    Returns:
        None
    """
    msg = Message("Thank You for Subscribing!", sender=my_email, recipients=[email])
    msg.body = "Hello,\n\nThank you for subscribing to our newsletter! Stay tuned for updates.\n\nBest Regards,\nThe Team"
    mail.send(msg)


def create_teammate(email, username, generated_password):
    """Sends an email to the newly created team member with login details."""
    try:
        msg = Message(
            "Welcome to the Team!",
            sender=my_email,
            recipients=[email]
        )
        msg.body = (
            f"Hello {username},\n\n"
            f"Your account has been created.\n\n"
            f"Username: {username}\n"
            f"Password: {generated_password}\n\n"
            "Please log in and change your password as soon as possible."
        )
        mail.send(msg)
        return True
    except Exception as e:
        return jsonify({"error": "Failed to send email", "details": str(e)}), 500

def change_teammate_password(email, username, generated_password):
    try:
        msg = Message(
            "Welcome to the Team!",
            sender=my_email,
            recipients=[email]
        )
        msg.body = (
            f"Hello {username},\n\n"
            f"Your rested password has been created.\n\n"
            f"Username: {username}\n"
            f"Password: {generated_password}\n\n"
            "Please log in and change your password as soon as possible."
        )
        mail.send(msg)
        return True
    except Exception as e:
        return jsonify({"error": "Failed to send email", "details": str(e)}), 500