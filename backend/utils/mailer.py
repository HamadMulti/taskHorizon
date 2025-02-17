import os
from flask_mail import Message
from app import mail

my_email = os.getenv("MAIL_USERNAME")

def send_otp_email(email, otp):
    msg = Message("Your OTP Code", sender=my_email, recipients=[email])
    msg.body = f"Your OTP Code is {otp}"
    mail.send(msg)

def send_reset_email(email, token):
    msg = Message("Password Reset Link", sender=my_email, recipients=[email])
    msg.body = f"Click the link to reset your password: http://localhost:3000/reset-password/{token}"
    mail.send(msg)


def new_registration_email(email):
    msg = Message("Welcome to our platform", sender=my_email, recipients=[email])
    msg.body = "Welcome to our platform. We are glad to have you here."
    mail.send(msg)