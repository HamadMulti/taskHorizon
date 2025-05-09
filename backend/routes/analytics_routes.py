"""
This module defines the routes for analytics-related endpoints in the Flask application.

Routes:
  /user (GET): Endpoint to get user analytics.
  /team-leader (GET): Endpoint to get team leader analytics.

Blueprints:
  analytics_bp: Blueprint for the analytics routes.

Imported Functions:
  user_analytics: Controller function to handle user analytics.
  team_leader_analytics: Controller function to handle team leader analytics.
"""
from flask import Blueprint
from controllers.analytics_controller import analytics

analytics_bp = Blueprint("analytics", __name__)


analytics_bp.route("/stats", methods=["GET"])(analytics)
