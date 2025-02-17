from . import db
from datetime import datetime

class ArchivedTask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    status = db.Column(db.String(20))
    assigned_to = db.Column(db.Integer, nullable=True)
    project_id = db.Column(db.Integer, nullable=True)
    deleted_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    deleted_at = db.Column(db.DateTime, default=datetime.utcnow)
