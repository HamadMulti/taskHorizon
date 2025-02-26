from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.project import Project
from models.task import db, Task, TaskHistory
from models.archive import ArchivedTask
from models.user import User


@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    if not data or "title" not in data or "description" not in data or "project_id" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    project = Project.query.get(data["project_id"])
    if not project:
        return jsonify({"error": "Project not found"}), 404

    existing_task = Task.query.filter_by(title=data["title"], project_id=data["project_id"]).first()
    if existing_task:
        return jsonify({"error": "A task with this title already exists in this project"}), 400
    
    assigned = data["assigned_to"]
    project_ids = data["project_id"]
    
    if not assigned:
        assigned = None
        
    if not project_ids:
        project_ids = None

    task = Task(title=data["title"], description=data["description"], assigned_to=assigned, project_id=project_ids)
    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task created successfully"}), 201


@jwt_required()
def get_tasks():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 403

    if user.role == "admin":
        tasks = Task.query.paginate(page=page, per_page=per_page, error_out=False)
    elif user.role == "team_leader":
        tasks = Task.query.filter(Task.project_id == user.project_id).paginate(
            page=page, per_page=per_page, error_out=False
        )
    else:
        tasks = Task.query.filter(Task.assigned_to == user_id).paginate(
            page=page, per_page=per_page, error_out=False
        )

    return jsonify(
        {
            "tasks": [
                {"id": t.id, "title": t.title, "status": t.status, "assigned_to": t.assigned_to, "description": t.description, "project_id": t.project_id}
                for t in tasks.items
            ],
            "total": tasks.total,
            "pages": tasks.pages,
            "current_page": tasks.page,
        }
    ), 200


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
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    task = Task.query.get(task_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 403

    if not task:
        return jsonify({"error": "Task not found"}), 404

    if task.assigned_to != user_id and user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized: You are not allowed to update this task"}), 403

    data = request.get_json()

    if not data:
        return jsonify({"error": "No update data provided"}), 400

    history = TaskHistory(
        task_id=task.id,
        updated_by=user.id,
        old_status=task.status,
        old_assignee=task.assigned_to,
        new_status=data.get("status", task.status),
        new_assignee=data.get("assigned_to", task.assigned_to)
    )
    db.session.add(history)

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.status = data.get("status", task.status)
    task.assigned_to = data.get("assigned_to", task.assigned_to)

    db.session.commit()

    return jsonify({"message": "Task updated successfully"}), 200


@jwt_required()
def archive_task(task_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    task = Task.query.get(task_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 403

    if not task:
        return jsonify({"error": "Task not found"}), 404

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized: Only an admin or team leader can archive tasks"}), 403

    archived_task = ArchivedTask(
        task_id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        assigned_to=task.assigned_to,
        project_id=task.project_id,
        deleted_by=user.id
    )
    db.session.add(archived_task)

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task archived successfully"}), 200



@jwt_required()
def get_user_tasks():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    user = User.query.get(user_id)

    tasks_query = Task.query.filter(Task.assigned_to == user.username).order_by(Task.id.desc())

    paginated_tasks = tasks_query.paginate(page=page, per_page=per_page, error_out=False)

    tasks_list = [
        {"id": t.id, "title": t.title, "status": t.status, "assigned_to": t.assigned_to, "description": t.description, "project_id": t.project_id}
        for t in paginated_tasks.items
    ]

    return jsonify({
        "my_tasks": tasks_list,
        "total": paginated_tasks.total,
        "pages": paginated_tasks.pages,
        "current_page": paginated_tasks.page
    }), 200



@jwt_required()
def get_team_tasks():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    if user:
        tasks = Task.query.paginate(page=page, per_page=per_page, error_out=False)
        return jsonify(
            {
                "team_tasks": [{"id": t.id, "title": t.title, "status": t.status, "assigned_to": t.assigned_to, "description": t.description, "project_id": t.project_id} for t in tasks],
                "total": tasks.total,
                "pages": tasks.pages,
                "current_page": tasks.page
            }), 200
    return jsonify({"error": "Unauthorized"}), 403

@jwt_required()
def get_archived_tasks():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 403

    if user.role == "admin":
        archived_tasks = ArchivedTask.query.paginate(page=page, per_page=per_page, error_out=False)
    elif user.role == "team_leader":
        archived_tasks = ArchivedTask.query.filter(ArchivedTask.project_id == user.project_id).paginate(
            page=page, per_page=per_page, error_out=False
        )
    else:
        archived_tasks = ArchivedTask.query.filter(ArchivedTask.assigned_to == user_id).paginate(
            page=page, per_page=per_page, error_out=False
        )

    return jsonify(
        {
            "archived_tasks": [
                {
                    "id": t.task_id,
                    "title": t.title,
                    "status": t.status,
                    "assigned_to": t.assigned_to,
                    "deleted_by": t.deleted_by,
                    "description": t.description,
                    "project_id": t.project_id
                }
                for t in archived_tasks.items
            ],
            "total": archived_tasks.total,
            "pages": archived_tasks.pages,
            "current_page": archived_tasks.page,
        }
    ), 200


@jwt_required()
def restore_task(task_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 403

    archived_task = ArchivedTask.query.get(task_id)

    if not archived_task:
        return jsonify({"error": "Archived task not found"}), 404

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    restored_task = Task(
        id=archived_task.task_id,
        title=archived_task.title,
        description=archived_task.description,
        status=archived_task.status,
        assigned_to=archived_task.assigned_to,
        project_id=archived_task.project_id
    )

    db.session.add(restored_task)
    db.session.delete(archived_task)
    db.session.commit()

    return jsonify({"message": "Task restored successfully"}), 200

