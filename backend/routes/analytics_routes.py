from flask import Blueprint
from controllers.analytics_controller import user_analytics, team_leader_analytics

analytics_bp = Blueprint("analytics", __name__)

analytics_bp.route("/user", methods=["GET"])(user_analytics)
analytics_bp.route("/team-leader", methods=["GET"])(team_leader_analytics)
