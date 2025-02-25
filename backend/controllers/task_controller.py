from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.task import db, Task, TaskHistory
from models.archive import ArchivedTask
from models.user import User


@jwt_required()
def create_task():
    """Creates a new task.

    This endpoint creates a new task with the provided title, description, and project ID. The task is initially unassigned.

    Returns:
        Response: A JSON response indicating the success or failure of the task creation.
        - 201: Task created successfully.
        - 403: Unauthorized access.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 403

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    task = Task(title=data["title"], description=data["description"], assigned_to=None, project_id=data["project_id"])
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task created successfully"}), 201


@jwt_required()
def get_tasks():
    """Retrieves all tasks.

    This endpoint retrieves all tasks from the database.

    Returns:
        Response: A JSON response containing a list of all tasks.
        - 200: Tasks retrieved successfully.
        - 403: Unauthorized access.
    """
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    tasks = None

    if not tasks:
        return jsonify({"error": "Tasks not found"}), 404

    if user.role == "admin":
        tasks = Task.query.all()
    elif user.role == "team_leader":
        tasks = Task.query.filter((Task.project_id == user.project_id)).paginate(
            page=page, per_page=per_page, error_out=False)
    else:
        tasks = Task.query.filter(
            (Task.assigned_to == user_id)).paginate(page=page, per_page=per_page, error_out=False)
    if not user:
        return jsonify({"error": "Unauthorized"}), 403
    return jsonify(
        {
            "tasks": [{"id": t.id, "title": t.title, "status": t.status, "assigned_to": t.assigned_to} for t in tasks],
            "total": tasks.total,
            "pages": tasks.pages,
            "current_page": tasks.page
        }), 200


@jwt_required()
def assign_task(task_id):
    """Assigns a task to a user.

    This endpoint assigns a task to a user by updating the task's assignee. It also logs the assignment in the task history.

    Returns:
        Response: A JSON response indicating the success or failure of the task assignment.
        - 200: Task assigned successfully.
        - 403: Unauthorized access.
        - 404: Task not found.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    if user:
        data = request.json
        new_assignee = data.get("assigned_to")

        history = TaskHistory(task_id=task.id, updated_by=user.id,
                                old_assignee=task.assigned_to, new_assignee=new_assignee)
        db.session.add(history)

        task.assigned_to = new_assignee
        task.status = "Pending"
        db.session.commit()
        return jsonify({"message": "Task assigned successfully"}), 200
    return jsonify({"error": "Unauthorized"}), 403


@jwt_required()
def update_task(task_id):
    """Updates a task.

    This endpoint updates an existing task with the provided data. It also logs the update in the task history.

    Returns:
        Response: A JSON response indicating the success or failure of the task update.
        - 200: Task updated successfully.
        - 403: Unauthorized access.
        - 404: Task not found.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    if user and user.role == "admin" or (user.role == "team_leader" and task.project_id == data["project_id"]) or task.assigned_to == user_id:
        data = request.json
        history = TaskHistory(task_id=task.id, updated_by=user.id, old_status=task.status,
                                new_status=data.get("status", task.status))
        db.session.add(history)

        task.title = data.get("title", task.title)
        task.description = data.get("description", task.description)
        task.status = data.get("status", task.status)
        db.session.commit()
        return jsonify({"message": "Task updated successfully"}), 200

    return jsonify({"error": "Unauthorized"}), 403


@jwt_required()
def archive_task(task_id):
    """Archives a task.

    This endpoint archives a task by moving it to the archived tasks table. It retrieves the task by ID, and if found, creates a copy in the ArchivedTask table and deletes the original task.

    Returns:
        Response: A JSON response indicating the success or failure of the task archival.
        - 200: Task archived successfully.
        - 403: Unauthorized access.
        - 404: Task not found.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    if user:
        archived_task = ArchivedTask(task_id=task.id, title=task.title, description=task.description,
                                        status=task.status, assigned_to=task.assigned_to, project_id=task.project_id, deleted_by=user.id)
        db.session.add(archived_task)

        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task archived successfully"}), 200
    return jsonify({"error": "Unauthorized"}), 403


@jwt_required()
def get_user_tasks():
    """Retrieves tasks assigned to the current user.

    Returns:
        Response: A JSON response containing a list of tasks.
        - 200: Tasks retrieved successfully.
    """
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    user_id = get_jwt_identity()

    tasks_query = Task.query.filter(Task.assigned_to == user_id)

    paginated_tasks = tasks_query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "my_tasks": [{"id": t.id, "title": t.title, "status": t.status, "assigned_to": t.assigned_to} for t in paginated_tasks.items],
        "total": paginated_tasks.total,
        "pages": paginated_tasks.pages,
        "current_page": paginated_tasks.page
    }), 200


@jwt_required()
def get_team_tasks():
    """Retrieves all tasks.

    This endpoint retrieves all tasks. This is intended for team leaders, but currently retrieves all tasks regardless of user role.

    Returns:
        Response: A JSON response containing a list of tasks.
        - 200: Tasks retrieved successfully.
        - 403: Unauthorized access.
    """
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != "team_leader":
        return jsonify({"error": "Unauthorized"}), 403

    if user:
        tasks = Task.query.paginate(page=page, per_page=per_page, error_out=False)
        return jsonify(
            {
                "team_tasks": [{"id": t.id, "title": t.title, "status": t.status, "assigned_to": t.assigned_to} for t in tasks],
                "total": tasks.total,
                "pages": tasks.pages,
                "current_page": tasks.page
            }), 200
    return jsonify({"error": "Unauthorized"}), 403
