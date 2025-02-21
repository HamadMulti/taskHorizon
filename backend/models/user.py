from . import db

class User(db.Model):
    """
    User Model

    Attributes:
        id (int): Primary key for the user.
        username (str): Unique username for the user, maximum length of 80 characters.
        email (str): Unique email address for the user, maximum length of 120 characters.
        password (str): Hashed password for the user, maximum length of 256 characters.
        otp (str, optional): One-time password for the user, maximum length of 6 characters.
        role (str): Role of the user, default is "user", maximum length of 10 characters.
        phone (str, optional): Phone number of the user, maximum length of 20 characters.
        location (str, optional): Location of the user, maximum length of 100 characters.
        gender (str, optional): Gender of the user, maximum length of 10 characters.
        primary_email (str, optional): Primary email address of the user, maximum length of 120 characters.
        verified (bool): Verification status of the user, default is False.
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    otp = db.Column(db.String(6), nullable=True)
    role = db.Column(db.String(10), default="user")
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    primary_email = db.Column(db.String(120), nullable=True)
    verified = db.Column(db.Boolean, default=False)

