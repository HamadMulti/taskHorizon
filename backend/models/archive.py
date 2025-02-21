from . import db
from datetime import datetime

class ArchivedTask(db.Model):
    """
    ArchivedTask Model

    This model represents an archived task in the system.

    Attributes:
        id (int): The primary key for the archived task.
        task_id (int): The ID of the original task.
        title (str): The title of the task.
        description (str): A detailed description of the task.
        status (str): The current status of the task.
        assigned_to (int, optional): The ID of the user to whom the task is assigned.
        project_id (int, optional): The ID of the project to which the task belongs.
        deleted_by (int): The ID of the user who deleted the task.
        deleted_at (datetime): The timestamp when the task was deleted.
    """
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    status = db.Column(db.String(20))
    assigned_to = db.Column(db.Integer, nullable=True)
    project_id = db.Column(db.Integer, nullable=True)
    deleted_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    deleted_at = db.Column(db.DateTime, default=datetime.utcnow)
