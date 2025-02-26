from datetime import datetime
from . import db


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Pending")
    owner = db.relationship("User", backref="projects")
    history = db.relationship("ProjectHistory", backref="project", lazy=True)


class ProjectHistory(db.Model):
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
