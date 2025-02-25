from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.project import ProjectHistory, db, Project
from models.user import User


@jwt_required()
def create_project():
    """Creates a new project.

    This endpoint creates a new project with the provided name and description. The project is associated with the current logged-in user.

    Returns:
        Response: A JSON response indicating the success or failure of the project creation.
        - 201: Project created successfully.
        - 400: Missing required fields in the request data.
        - 404: User not found.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    if not data or "name" not in data or "description" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    project = Project(name=data["name"], description=data["description"], owner_id=user_id)
    db.session.add(project)
    db.session.commit()
    return jsonify({"message": "Project created successfully"}), 201


@jwt_required()
def get_projects():
    """
    Retrieves all projects with pagination.

    This function retrieves all projects from the database and returns them in a paginated format.
    It accepts optional query parameters for page number and items per page.

    Returns:
        Response: A JSON response containing the paginated list of projects, total count, number of pages, and current page number.
        - 200: Projects retrieved successfully.
    """
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    projects = Project.query.paginate(page=page, per_page=per_page, error_out=False)

    if not projects:
        return jsonify({"error": "Projects not found"}), 404

    return jsonify({
        "projects": [{"id": p.id, "name": p.name, "description": p.description} for p in projects.items],
        "total": projects.total,
        "pages": projects.pages,
        "current_page": projects.page
    }), 200


@jwt_required()
def get_user_projects():
    """
    Retrieves projects owned by the current user with pagination.

    This function retrieves projects owned by the currently logged-in user from the database
    and returns them in a paginated format. It accepts optional query parameters for page number and items per page.

    Returns:
        Response: A JSON response containing the paginated list of user's projects, total count, number of pages, and current page number.
        - 200: Projects retrieved successfully.
    """
    user_id = get_jwt_identity()

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    projects = Project.query.filter_by(owner_id=user_id).paginate(page=page, per_page=per_page, error_out=False)

    if not projects:
        return jsonify({"error": "Projects not found"}), 404
    data = {
        "my_projects": [{"id": p.id, "name": p.name, "description": p.description} for p in projects.items],
        "total": projects.total,
        "pages": projects.pages,
        "current_page": projects.page
    }
    return jsonify(data), 200


@jwt_required()
def update_project(project_id):
    """Updates a project.

    This function updates a project with the given project_id. The function retrieves the current user's
    identity from the JWT token, verifies the user and project exist, and then updates the project
    with the provided data. The updated project is then committed to the database.

    Returns:
        Response: A JSON response indicating the success or failure of the project update.
        - 200: Project updated successfully.
        - 400: Missing required fields in the request data.
        - 403: Unauthorized access.
        - 404: User or project not found.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    project = Project.query.get(project_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not project:
        return jsonify({"error": "Project not found"}), 404

    if user or project.owner_id == user_id or user.role == "admin":
        data = request.json
        project.name = data.get("name", project.name)
        project.description = data.get("description", project.description)
        db.session.commit()
        return jsonify({"message": "Project updated successfully"}), 200

    return jsonify({"error": "Unauthorized"}), 403


@jwt_required()
def delete_project(project_id):
    """Deletes a project.

    This function deletes a project with the given project_id. The function retrieves the current user's
    identity from the JWT token, verifies the user and project exist, and then deletes the project
    from the database. The changes are then committed to the database.

    Returns:
        Response: A JSON response indicating the success or failure of the project deletion.
        - 200: Project deleted successfully.
        - 403: Unauthorized access.
        - 404: User or project not found.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    project = Project.query.get(project_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not project:
        return jsonify({"error": "Project not found"}), 404

    if user or project.owner_id == user_id or user.role == "admin":
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Project deleted successfully"}), 200

    return jsonify({"error": "Unauthorized"}), 403


@jwt_required()
def assign_project(project_id):
    """Assigns a project to a user.

    This endpoint assigns a project to a new owner by updating the `owner_id`. It also logs the assignment in the `ProjectHistory`.

    Returns:
        Response: A JSON response indicating the success or failure of the project assignment.
        - 200: Project assigned successfully.
        - 403: Unauthorized access.
        - 404: Project not found.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    if user.role not in ["admin", "team_leader"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    new_owner_id = data.get("assigned_to")

    if not new_owner_id:
        return jsonify({"error": "New owner ID is required"}), 400

    new_owner = User.query.get(new_owner_id)

    if not new_owner:
        return jsonify({"error": "New owner not found"}), 404

    history = ProjectHistory(
        project_id=project.id,
        updated_by=user.id,
        old_owner=project.owner_id,
        new_owner=new_owner_id
    )
    db.session.add(history)

    project.owner_id = new_owner_id
    db.session.commit()

    return jsonify({"message": "Project assigned successfully"}), 200
