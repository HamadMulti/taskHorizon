from . import db
from datetime import datetime

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default="Pending")
    assigned_to = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    due_date = db.Column(db.Date, nullable=True)

class TaskHistory(db.Model):
    """
    Represents the history of changes made to tasks.

    Attributes:
        id (int): The primary key of the task history record.
        task_id (int): The ID of the task that was updated.
        updated_by (int): The ID of the user who made the update.
        old_status (str): The previous status of the task.
        new_status (str): The new status of the task.
        old_assignee (int, optional): The previous assignee of the task.
        new_assignee (int, optional): The new assignee of the task.
        timestamp (datetime): The time when the update was made.
    """
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey("task.id"))
    updated_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    old_status = db.Column(db.String(20))
    new_status = db.Column(db.String(20))
    old_assignee = db.Column(db.Integer, nullable=True)
    new_assignee = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
