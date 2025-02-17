from flask_mail import Message
from app import mail

def send_otp_email(email, otp):
    msg = Message("Your OTP Code", sender="your-email@gmail.com", recipients=[email])
    msg.body = f"Your OTP Code is {otp}"
    mail.send(msg)

def send_reset_email(email, token):
    msg = Message("Password Reset Link", sender="your-email@gmail.com", recipients=[email])
    msg.body = f"Click the link to reset your password: http://localhost:3000/reset-password/{token}"
    mail.send(msg)
