from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.project import db, Project
from models.user import User


@jwt_required()
def create_project():
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
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    projects = Project.query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "projects": [{"id": p.id, "name": p.name, "description": p.description} for p in projects.items],
        "total": projects.total,
        "pages": projects.pages,
        "current_page": projects.page
    }), 200


@jwt_required()
def update_project(project_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    project = Project.query.get(project_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not project:
        return jsonify({"error": "Project not found"}), 404

    if user.role == "admin" or project.owner_id == user_id:
        data = request.json
        project.name = data.get("name", project.name)
        project.description = data.get("description", project.description)
        db.session.commit()
        return jsonify({"message": "Project updated successfully"}), 200

    return jsonify({"error": "Unauthorized"}), 403


@jwt_required()
def delete_project(project_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    project = Project.query.get(project_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not project:
        return jsonify({"error": "Project not found"}), 404

    if user.role == "admin":
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Project deleted successfully"}), 200

    return jsonify({"error": "Unauthorized"}), 403
