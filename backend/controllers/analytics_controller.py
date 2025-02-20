from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.task import Task
from models.user import User

@jwt_required()
def user_analytics():
    """User views their own analytics: total tasks, pending/completed ratio"""
    user_id = get_jwt_identity()
    total_tasks = Task.query.filter_by(assigned_to=user_id).count()
    pending_tasks = Task.query.filter_by(assigned_to=user_id, status="Pending").count()
    completed_tasks = Task.query.filter_by(assigned_to=user_id, status="Completed").count()

    productivity_percentage = (completed_tasks / total_tasks * 100) if total_tasks else 0

    return jsonify({"user_analytics": {
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks,
        "productivity_percentage": round(productivity_percentage, 2)
    }}), 200

@jwt_required()
def team_leader_analytics():
    """Team leader views analytics of all users in the project"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != "team_leader":
        return jsonify({"error": "Unauthorized"}), 403

    user_stats = []
    users = User.query.all()
    
    for u in users:
        total_tasks = Task.query.filter_by(assigned_to=u.id).count()
        completed_tasks = Task.query.filter_by(assigned_to=u.id, status="Completed").count()
        due_tasks = Task.query.filter(Task.assigned_to == u.id, Task.status == "Pending").count()
        productivity = (completed_tasks / total_tasks * 100) if total_tasks else 0

        user_stats.append({"team_leader_analytics": {
            "user_id": u.id,
            "username": u.username,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "due_tasks": due_tasks,
            "productivity_percentage": round(productivity, 2)
        }})

    return jsonify({"team_analytics": user_stats}), 200
