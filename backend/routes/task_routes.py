"""
This module defines the routes for task-related operations in the application.

Routes:
  POST /:
    - Description: Create a new task.
    - Controller: create_task

  GET /:
    - Description: Retrieve all tasks.
    - Controller: get_tasks

  PUT /<int:task_id>:
    - Description: Update an existing task by its ID.
    - Controller: update_task

  PUT /<int:task_id>/assign:
    - Description: Assign a task to a user by task ID.
    - Controller: assign_task

  DELETE /<int:task_id>/archive:
    - Description: Archive a task by its ID.
    - Controller: archive_task

  GET /user-tasks:
    - Description: Retrieve tasks assigned to the current user.
    - Controller: get_user_tasks

  GET /team-tasks:
    - Description: Retrieve tasks assigned to the user's team.
    - Controller: get_team_tasks
"""
from flask import Blueprint
from controllers.task_controller import create_task, get_tasks, update_task, assign_task, archive_task, get_user_tasks, get_team_tasks

task_bp = Blueprint("task", __name__)

task_bp.route("/", methods=["POST", "OPTIONS"])(create_task)
task_bp.route("/", methods=["GET", "OPTIONS"])(get_tasks)
task_bp.route("/user-tasks", methods=["GET", "OPTIONS"])(get_user_tasks)
task_bp.route("/team-tasks", methods=["GET", "OPTIONS"])(get_team_tasks)
task_bp.route("/<int:task_id>", methods=["PUT", "OPTIONS"])(update_task)
task_bp.route("/<int:task_id>/assign", methods=["PUT", "OPTIONS"])(assign_task)
task_bp.route("/<int:task_id>/archive", methods=["DELETE", "OPTIONS"])(archive_task)
