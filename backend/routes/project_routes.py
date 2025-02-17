from flask import Blueprint
from controllers.project_controller import create_project, get_projects, update_project, delete_project

project_bp = Blueprint("project", __name__)

project_bp.route("/", methods=["POST"])(create_project)
project_bp.route("/", methods=["GET"])(get_projects)
project_bp.route("/<int:project_id>", methods=["PUT"])(update_project)
project_bp.route("/<int:project_id>", methods=["DELETE"])(delete_project)
