from flask import jsonify


def home_api():
  return jsonify({
    "status": 200,
    "message": "Welcome to taskHorizon Backend api",
  }), 200