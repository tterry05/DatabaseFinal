from flask import Flask, jsonify, render_template
from db import get_weather_data
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/weather")
def weather():
    """Returns all weather rows as JSON array from PostgreSQL."""
    try:
        data = get_weather_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)