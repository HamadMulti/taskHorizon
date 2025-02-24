from flask import Blueprint

from controllers.home_controller import home_api

home_bp = Blueprint("/", __name__)

home_bp.route("", methods=["GET"])(home_api)