"""
This module defines the routes for project-related operations in the Flask application.

Routes:
  POST /: Create a new project.
  GET /: Retrieve all projects.
  GET /user: Retrieve projects associated with the current user.
  PUT /<int:project_id>: Update an existing project by its ID.
  DELETE /<int:project_id>: Delete an existing project by its ID.

Blueprint:
  project_bp: Blueprint for project routes.
"""
from flask import Blueprint
from controllers.project_controller import create_project, get_projects, get_user_projects, update_project, delete_project

project_bp = Blueprint("project", __name__)

project_bp.route("/", methods=["POST"])(create_project)
project_bp.route("/", methods=["GET"])(get_projects)
project_bp.route("/user", methods=["GET"])(get_user_projects)
project_bp.route("/<int:project_id>", methods=["PUT"])(update_project)
project_bp.route("/<int:project_id>", methods=["DELETE"])(delete_project)
