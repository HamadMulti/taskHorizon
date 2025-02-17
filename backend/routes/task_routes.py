from flask import Blueprint
from controllers.task_controller import create_task, get_tasks, update_task, assign_task, archive_task, get_user_tasks, get_team_tasks

task_bp = Blueprint("task", __name__)

task_bp.route("/", methods=["POST"])(create_task)
task_bp.route("/", methods=["GET"])(get_tasks)
task_bp.route("/<int:task_id>", methods=["PUT"])(update_task)
task_bp.route("/<int:task_id>/assign", methods=["PUT"])(assign_task)
task_bp.route("/<int:task_id>/archive", methods=["DELETE"])(archive_task)
task_bp.route("/user-tasks", methods=["GET"])(get_user_tasks)
task_bp.route("/team-tasks", methods=["GET"])(get_team_tasks)
