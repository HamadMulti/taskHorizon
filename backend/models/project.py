from . import db

class Project(db.Model):
    """
    Represents a project in the database.

    Attributes:
        id (int): The unique identifier for the project.
        name (str): The name of the project. Cannot be null.
        description (str, optional): A brief description of the project.
        owner_id (int): The ID of the user who owns the project. References the user table.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
