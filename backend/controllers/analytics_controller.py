from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.task import Task
from models.user import User

@jwt_required()
def analytics():
    """
    Retrieve analytics for team leaders/admin or users.
    This function retrieves the analytics data for team leaders, including the total tasks,
    completed tasks, due tasks, and productivity percentage for each user in the system.
    It ensures that only users with the role of "team_leader" can access this data.
    Returns:
        Response: A JSON response containing the analytics data for each user if the
                    requesting user is a team leader. Otherwise, returns an error message
                    with a 403 status code.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    user_stats = []
    users = User.query.all()
    
    for u in users:
        total_tasks = Task.query.filter_by(assigned_to=u.id).count()
        completed_tasks = Task.query.filter_by(assigned_to=u.id, status="Completed").count()
        due_tasks = Task.query.filter(Task.assigned_to == u.id, Task.status == "Pending").count()
        productivity = (completed_tasks / total_tasks * 100) if total_tasks else 0
        pending_tasks = Task.query.filter_by(assigned_to=user_id, status="Pending").count()
        
        if user.role in ["admin", "team_leader"]:
            user_stats.append({"analytics": {
                "user_id": u.id,
                "username": u.username,
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "due_tasks": due_tasks,
                "productivity_percentage": round(productivity, 2)
            }})
        else:
            user_stats.append({"analytics": {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "productivity_percentage": round(productivity, 2)
            }})

    return jsonify({"analytics": user_stats}), 200
