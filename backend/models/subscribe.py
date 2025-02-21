from . import db

class Subscriber(db.Model):
    """
    Represents a subscriber in the database.

    Attributes:
      id (int): The unique identifier for the subscriber.
      email (str): The email address of the subscriber. Must be unique and cannot be null.
    """
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)