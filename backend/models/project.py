from datetime import datetime
from . import db


class Project(db.Model):
    """
    Represents a project in the database.

    Attributes:
        id (int): The unique identifier for the project.
        name (str): The name of the project. Cannot be null.
        description (str, optional): A brief description of the project.
        owner_id (int): The ID of the user who owns the project. References the user table.
        status (str): The current status of the project.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Pending")
    owner = db.relationship("User", backref="projects")
    history = db.relationship("ProjectHistory", backref="project", lazy=True)


class ProjectHistory(db.Model):
    """
    Represents the history of changes made to projects.

    Attributes:
        id (int): The primary key of the project history record.
        project_id (int): The ID of the project that was updated.
        updated_by (int): The ID of the user who made the update.
        old_owner (int, optional): The previous owner of the project.
        new_owner (int, optional): The new owner of the project.
        old_status (str, optional): The previous status of the project.
        new_status (str, optional): The new status of the project.
        timestamp (datetime): The time when the update was made.
    """
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    updated_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    old_owner = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    new_owner = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    old_status = db.Column(db.String(20), nullable=True)
    new_status = db.Column(db.String(20), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updater = db.relationship("User", foreign_keys=[updated_by], backref="project_updates")
    old_owner_user = db.relationship("User", foreign_keys=[old_owner], backref="previous_projects", lazy=True)
    new_owner_user = db.relationship("User", foreign_keys=[new_owner], backref="new_projects", lazy=True)
