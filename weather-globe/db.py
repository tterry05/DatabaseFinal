import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "weather"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "")
    )

def get_weather_data():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT
            country,
            location_name,
            latitude,
            longitude,
            timezone,
            last_updated,
            temperature_celsius,
            temperature_fahrenheit,
            condition_text,
            wind_mph,
            wind_kph,
            wind_degree,
            wind_direction,
            pressure_mb,
            pressure_in,
            precip_mm,
            precip_in,
            humidity,
            cloud,
            feels_like_celsius,
            feels_like_fahrenheit,
            visibility_km,
            visibility_miles,
            uv_index,
            gust_mph,
            gust_kph,
            "air_quality_Carbon_Monoxide"  AS air_quality_Carbon_Monoxide,
            "air_quality_Ozone"            AS air_quality_Ozone,
            "air_quality_Nitrogen_dioxide" AS air_quality_Nitrogen_dioxide,
            "air_quality_Sulphur_dioxide"  AS air_quality_Sulphur_dioxide,
            "air_quality_PM2.5"            AS air_quality_PM2_5,
            "air_quality_PM10"             AS air_quality_PM10,
            "air_quality_us-epa-index"     AS air_quality_us_epa_index,
            "air_quality_gb-defra-index"   AS air_quality_gb_defra_index,
            sunrise,
            sunset,
            moonrise,
            moonset,
            moon_phase,
            moon_illumination
        FROM "world_weather"."GlobalWeatherRepository";
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    # Convert RealDictRow to plain dict, cast Decimal/datetime to serializable types
    result = []
    for row in rows:
        d = dict(row)
        for k, v in d.items():
            if hasattr(v, 'isoformat'):
                d[k] = str(v)
            elif hasattr(v, '__float__'):
                d[k] = float(v)
        result.append(d)
    return result