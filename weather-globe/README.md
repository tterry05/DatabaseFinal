# 🌍 Global Weather Globe

A full-stack data visualization web application that renders an interactive, rotatable 3D globe using D3.js. Each country is represented by a dot plotted at its capital city's coordinates, colored on a red-to-blue temperature gradient.

## Features
- **Interactive 3D Globe**: Built with D3.js and TopoJSON. Supports drag to rotate and scroll to zoom.
- **Rich Data Tooltips**: Hovering or clicking on a country reveals a comprehensive weather data tooltip containing temperature, wind, atmospheric conditions, air quality, and astronomical data.
- **Dynamic Color Scale**: Markers are colored based on surface temperature (blue for cold, red for hot).
- **Data Source Toggle**: Seamlessly switch between:
  - **Demo Mode**: Uses a bundled static JSON file (`weather_fake.json`) with over 60 generated data points (works offline).
  - **Live DB Mode**: Fetches live data from a Flask API backed by PostgreSQL.
- **Live Statistics**: Displays total countries, hottest/coldest locations, and average temperature.

## Tech Stack
- **Backend**: Python 3, Flask, PostgreSQL (via `psycopg2-binary`)
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript, D3.js (v7), TopoJSON (v3)
- **Deployment**: Single-folder application running via `flask run` or `python app.py`

## Prerequisites
- Python 3.9+
- PostgreSQL database (for Live DB mode)

## Setup Instructions

1. **Clone the repository** (if you haven't already) and navigate to the project folder:
   ```bash
   cd weather-globe
   ```

2. **Create and activate a virtual environment**:
   - On Windows:
     ```cmd
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Database (Optional - for Live DB Mode)**:
   Copy the example environment file and update it with your PostgreSQL credentials.
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`.

5. **Run the application**:
   ```bash
   python app.py
   ```
   *(Alternatively, use `flask run`)*

6. **View in browser**:
   Open [http://localhost:5000](http://localhost:5000)

## Usage Notes
- The application starts in **Demo Mode** by default. No database connection is required to view the globe or interact with the demo dataset.
- To switch to live data, ensure your `.env` file is properly configured with valid PostgreSQL credentials containing the `marigold` database and `weather` schema, then flip the UI toggle to **Live DB**.