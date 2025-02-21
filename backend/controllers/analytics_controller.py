from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.task import Task
from models.user import User

@jwt_required()
def user_analytics():
    """
    Retrieve analytics for the current user based on their tasks.

    This function fetches the total number of tasks assigned to the user,
    the number of pending tasks, and the number of completed tasks. It also
    calculates the user's productivity percentage based on the ratio of
    completed tasks to total tasks.

    Returns:
        Response: A JSON response containing the user's analytics, including:
            - total_tasks (int): The total number of tasks assigned to the user.
            - pending_tasks (int): The number of tasks that are pending.
            - completed_tasks (int): The number of tasks that are completed.
            - productivity_percentage (float): The user's productivity percentage,
                rounded to two decimal places.
    """
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
    """
    Retrieve analytics for team leaders.
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
