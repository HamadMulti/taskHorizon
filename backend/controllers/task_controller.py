from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.task import db, Task, TaskHistory
from models.archive import ArchivedTask
from models.user import User

@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    task = Task(title=data["title"], description=data["description"], assigned_to=None, project_id=data["project_id"])
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task created successfully"}), 201

@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role == "admin":
        tasks = Task.query.all()
    elif user.role == "team_leader":
        tasks = Task.query.filter((Task.project_id == user.project_id)| (Task.project_id is None)).all()
    else:
        tasks = Task.query.filter(
            (Task.assigned_to == user_id) | (Task.assigned_to is None)
        ).all()

    return jsonify({"tasks": [{"id": t.id, "title": t.title, "status": t.status, "assigned_to": t.assigned_to} for t in tasks]}), 200

@jwt_required()
def assign_task(task_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    new_assignee = data.get("assigned_to")

    history = TaskHistory(task_id=task.id, updated_by=user.id, old_assignee=task.assigned_to, new_assignee=new_assignee)
    db.session.add(history)

    task.assigned_to = new_assignee
    task.status = "Pending"
    db.session.commit()
    return jsonify({"message": "Task assigned successfully"}), 200

@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    if user.role == "admin" or (user.role == "team_leader" and task.project_id == data["project_id"]) or task.assigned_to == user_id:
        data = request.json
        history = TaskHistory(task_id=task.id, updated_by=user.id, old_status=task.status, new_status=data.get("status", task.status))
        db.session.add(history)

        task.title = data.get("title", task.title)
        task.description = data.get("description", task.description)
        task.status = data.get("status", task.status)
        db.session.commit()
        return jsonify({"message": "Task updated successfully"}), 200

    return jsonify({"error": "Unauthorized"}), 403

@jwt_required()
def archive_task(task_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    archived_task = ArchivedTask(task_id=task.id, title=task.title, description=task.description, status=task.status, assigned_to=task.assigned_to, project_id=task.project_id, deleted_by=user.id)
    db.session.add(archived_task)

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task archived successfully"}), 200

@jwt_required()
def get_user_tasks():
    """User can view their assigned & unassigned tasks"""
    user_id = get_jwt_identity()
    tasks = Task.query.filter(
        (Task.assigned_to == user_id) | (Task.assigned_to is None)
    ).all()
    return jsonify({"tasks": [{"id": t.id, "title": t.title, "status": t.status, "assigned_to": t.assigned_to} for t in tasks]}), 200

@jwt_required()
def get_team_tasks():
    """Team Leader can view all tasks assigned to users"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != "team_leader":
        return jsonify({"error": "Unauthorized"}), 403

    tasks = Task.query.all()
    return jsonify({"tasks": [{"id": t.id, "title": t.title, "status": t.status, "assigned_to": t.assigned_to} for t in tasks]}), 200
