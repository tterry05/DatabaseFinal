import json
import random
import os

countries = [
    {"country": "Nigeria", "location_name": "Abuja", "lat": 9.0579, "lon": 7.4951, "tz": "Africa/Lagos", "temp_base": 32},
    {"country": "Egypt", "location_name": "Cairo", "lat": 30.0444, "lon": 31.2357, "tz": "Africa/Cairo", "temp_base": 28},
    {"country": "South Africa", "location_name": "Pretoria", "lat": -25.7479, "lon": 28.2293, "tz": "Africa/Johannesburg", "temp_base": 24},
    {"country": "Kenya", "location_name": "Nairobi", "lat": -1.2921, "lon": 36.8219, "tz": "Africa/Nairobi", "temp_base": 22},
    {"country": "Ethiopia", "location_name": "Addis Ababa", "lat": 9.032, "lon": 38.7482, "tz": "Africa/Addis_Ababa", "temp_base": 20},
    {"country": "Morocco", "location_name": "Rabat", "lat": 34.0209, "lon": -6.8416, "tz": "Africa/Casablanca", "temp_base": 21},
    {"country": "Ghana", "location_name": "Accra", "lat": 5.6037, "lon": -0.187, "tz": "Africa/Accra", "temp_base": 30},
    {"country": "Tanzania", "location_name": "Dodoma", "lat": -6.163, "lon": 35.7516, "tz": "Africa/Dar_es_Salaam", "temp_base": 26},
    {"country": "Algeria", "location_name": "Algiers", "lat": 36.7538, "lon": 3.0588, "tz": "Africa/Algiers", "temp_base": 24},
    {"country": "Angola", "location_name": "Luanda", "lat": -8.839, "lon": 13.2894, "tz": "Africa/Luanda", "temp_base": 28},
    {"country": "Senegal", "location_name": "Dakar", "lat": 14.7167, "lon": -17.4677, "tz": "Africa/Dakar", "temp_base": 25},
    {"country": "Tunisia", "location_name": "Tunis", "lat": 36.8065, "lon": 10.1815, "tz": "Africa/Tunis", "temp_base": 22},
    {"country": "China", "location_name": "Beijing", "lat": 39.9042, "lon": 116.4074, "tz": "Asia/Shanghai", "temp_base": 12},
    {"country": "India", "location_name": "New Delhi", "lat": 28.6139, "lon": 77.209, "tz": "Asia/Kolkata", "temp_base": 34},
    {"country": "Japan", "location_name": "Tokyo", "lat": 35.6762, "lon": 139.6503, "tz": "Asia/Tokyo", "temp_base": 15},
    {"country": "South Korea", "location_name": "Seoul", "lat": 37.5665, "lon": 126.978, "tz": "Asia/Seoul", "temp_base": 10},
    {"country": "Thailand", "location_name": "Bangkok", "lat": 13.7563, "lon": 100.5018, "tz": "Asia/Bangkok", "temp_base": 33},
    {"country": "Vietnam", "location_name": "Hanoi", "lat": 21.0285, "lon": 105.8542, "tz": "Asia/Ho_Chi_Minh", "temp_base": 26},
    {"country": "Indonesia", "location_name": "Jakarta", "lat": -6.2088, "lon": 106.8456, "tz": "Asia/Jakarta", "temp_base": 31},
    {"country": "Philippines", "location_name": "Manila", "lat": 14.5995, "lon": 120.9842, "tz": "Asia/Manila", "temp_base": 32},
    {"country": "Saudi Arabia", "location_name": "Riyadh", "lat": 24.7136, "lon": 46.6753, "tz": "Asia/Riyadh", "temp_base": 35},
    {"country": "UAE", "location_name": "Abu Dhabi", "lat": 24.4539, "lon": 54.3773, "tz": "Asia/Dubai", "temp_base": 36},
    {"country": "Israel", "location_name": "Jerusalem", "lat": 31.7683, "lon": 35.2137, "tz": "Asia/Jerusalem", "temp_base": 20},
    {"country": "Turkey", "location_name": "Ankara", "lat": 39.9208, "lon": 32.8541, "tz": "Europe/Istanbul", "temp_base": 14},
    {"country": "Pakistan", "location_name": "Islamabad", "lat": 33.6844, "lon": 73.0479, "tz": "Asia/Karachi", "temp_base": 28},
    {"country": "Bangladesh", "location_name": "Dhaka", "lat": 23.8103, "lon": 90.4125, "tz": "Asia/Dhaka", "temp_base": 31},
    {"country": "Malaysia", "location_name": "Kuala Lumpur", "lat": 3.139, "lon": 101.6869, "tz": "Asia/Kuala_Lumpur", "temp_base": 32},
    {"country": "Germany", "location_name": "Berlin", "lat": 52.52, "lon": 13.405, "tz": "Europe/Berlin", "temp_base": 12},
    {"country": "France", "location_name": "Paris", "lat": 48.8566, "lon": 2.3522, "tz": "Europe/Paris", "temp_base": 13},
    {"country": "UK", "location_name": "London", "lat": 51.5074, "lon": -0.1278, "tz": "Europe/London", "temp_base": 10},
    {"country": "Italy", "location_name": "Rome", "lat": 41.9028, "lon": 12.4964, "tz": "Europe/Rome", "temp_base": 18},
    {"country": "Spain", "location_name": "Madrid", "lat": 40.4168, "lon": -3.7038, "tz": "Europe/Madrid", "temp_base": 19},
    {"country": "Netherlands", "location_name": "Amsterdam", "lat": 52.3676, "lon": 4.9041, "tz": "Europe/Amsterdam", "temp_base": 11},
    {"country": "Sweden", "location_name": "Stockholm", "lat": 59.3293, "lon": 18.0686, "tz": "Europe/Stockholm", "temp_base": 5},
    {"country": "Norway", "location_name": "Oslo", "lat": 59.9139, "lon": 10.7522, "tz": "Europe/Oslo", "temp_base": 3},
    {"country": "Finland", "location_name": "Helsinki", "lat": 60.1695, "lon": 24.9354, "tz": "Europe/Helsinki", "temp_base": 2},
    {"country": "Poland", "location_name": "Warsaw", "lat": 52.2297, "lon": 21.0122, "tz": "Europe/Warsaw", "temp_base": 9},
    {"country": "Greece", "location_name": "Athens", "lat": 37.9838, "lon": 23.7275, "tz": "Europe/Athens", "temp_base": 20},
    {"country": "Albania", "location_name": "Tirana", "lat": 41.3275, "lon": 19.8189, "tz": "Europe/Tirane", "temp_base": 18},
    {"country": "Portugal", "location_name": "Lisbon", "lat": 38.7223, "lon": -9.1393, "tz": "Europe/Lisbon", "temp_base": 17},
    {"country": "Switzerland", "location_name": "Bern", "lat": 46.948, "lon": 7.4474, "tz": "Europe/Zurich", "temp_base": 8},
    {"country": "Austria", "location_name": "Vienna", "lat": 48.2082, "lon": 16.3738, "tz": "Europe/Vienna", "temp_base": 11},
    {"country": "USA", "location_name": "Washington DC", "lat": 38.9072, "lon": -77.0369, "tz": "America/New_York", "temp_base": 16},
    {"country": "Canada", "location_name": "Ottawa", "lat": 45.4215, "lon": -75.6972, "tz": "America/Toronto", "temp_base": 2},
    {"country": "Mexico", "location_name": "Mexico City", "lat": 19.4326, "lon": -99.1332, "tz": "America/Mexico_City", "temp_base": 22},
    {"country": "Cuba", "location_name": "Havana", "lat": 23.1136, "lon": -82.3666, "tz": "America/Havana", "temp_base": 28},
    {"country": "Jamaica", "location_name": "Kingston", "lat": 17.9712, "lon": -76.7936, "tz": "America/Jamaica", "temp_base": 30},
    {"country": "Guatemala", "location_name": "Guatemala City", "lat": 14.6349, "lon": -90.5069, "tz": "America/Guatemala", "temp_base": 23},
    {"country": "Brazil", "location_name": "Brasilia", "lat": -15.8267, "lon": -47.9218, "tz": "America/Sao_Paulo", "temp_base": 27},
    {"country": "Argentina", "location_name": "Buenos Aires", "lat": -34.6037, "lon": -58.3816, "tz": "America/Argentina/Buenos_Aires", "temp_base": 20},
    {"country": "Colombia", "location_name": "Bogota", "lat": 4.711, "lon": -74.0721, "tz": "America/Bogota", "temp_base": 15},
    {"country": "Chile", "location_name": "Santiago", "lat": -33.4489, "lon": -70.6693, "tz": "America/Santiago", "temp_base": 18},
    {"country": "Peru", "location_name": "Lima", "lat": -12.0464, "lon": -77.0428, "tz": "America/Lima", "temp_base": 22},
    {"country": "Venezuela", "location_name": "Caracas", "lat": 10.4806, "lon": -66.9036, "tz": "America/Caracas", "temp_base": 26},
    {"country": "Ecuador", "location_name": "Quito", "lat": -0.1807, "lon": -78.4678, "tz": "America/Guayaquil", "temp_base": 14},
    {"country": "Bolivia", "location_name": "Sucre", "lat": -19.0333, "lon": -65.2627, "tz": "America/La_Paz", "temp_base": 16},
    {"country": "Australia", "location_name": "Canberra", "lat": -35.2809, "lon": 149.13, "tz": "Australia/Sydney", "temp_base": 22},
    {"country": "New Zealand", "location_name": "Wellington", "lat": -41.2865, "lon": 174.7762, "tz": "Pacific/Auckland", "temp_base": 15},
    {"country": "Papua New Guinea", "location_name": "Port Moresby", "lat": -9.4431, "lon": 147.1803, "tz": "Pacific/Port_Moresby", "temp_base": 29},
    {"country": "Fiji", "location_name": "Suva", "lat": -18.1248, "lon": 178.4501, "tz": "Pacific/Fiji", "temp_base": 27},
    {"country": "Greenland", "location_name": "Nuuk", "lat": 64.1814, "lon": -51.6941, "tz": "America/Godthab", "temp_base": -18},
    {"country": "Iceland", "location_name": "Reykjavik", "lat": 64.1466, "lon": -21.9426, "tz": "Atlantic/Reykjavik", "temp_base": 0},
    {"country": "Russia", "location_name": "Moscow", "lat": 55.7558, "lon": 37.6173, "tz": "Europe/Moscow", "temp_base": 1},
    {"country": "Kazakhstan", "location_name": "Astana", "lat": 51.1694, "lon": 71.4491, "tz": "Asia/Almaty", "temp_base": -5},
]

conditions = ["Sunny", "Partly cloudy", "Cloudy", "Overcast", "Mist", "Patchy rain possible", "Light rain", "Moderate rain", "Heavy rain", "Snow"]
directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
moon_phases = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"]

output = []
for c in countries:
    tc = c["temp_base"] + random.uniform(-5, 5)
    tf = (tc * 9/5) + 32
    
    wind_kph = random.uniform(5, 40)
    wind_mph = wind_kph / 1.609
    
    output.append({
        "country": c["country"],
        "location_name": c["location_name"],
        "latitude": c["lat"],
        "longitude": c["lon"],
        "timezone": c["tz"],
        "last_updated": "2025-03-15 10:45:00",
        "temperature_celsius": round(tc, 1),
        "temperature_fahrenheit": round(tf, 1),
        "condition_text": random.choice(conditions),
        "wind_mph": round(wind_mph, 1),
        "wind_kph": round(wind_kph, 1),
        "wind_degree": random.randint(0, 360),
        "wind_direction": random.choice(directions),
        "pressure_mb": round(random.uniform(990, 1030), 1),
        "pressure_in": round(random.uniform(29.0, 30.5), 2),
        "precip_mm": round(random.uniform(0, 20), 1),
        "precip_in": round(random.uniform(0, 0.8), 2),
        "humidity": random.randint(10, 100),
        "cloud": random.randint(0, 100),
        "feels_like_celsius": round(tc + random.uniform(-2, 2), 1),
        "feels_like_fahrenheit": round(tf + random.uniform(-4, 4), 1),
        "visibility_km": round(random.uniform(5, 15), 1),
        "visibility_miles": round(random.uniform(3, 9), 1),
        "uv_index": round(random.uniform(1, 11), 1),
        "gust_mph": round(wind_mph * random.uniform(1.2, 2.0), 1),
        "gust_kph": round(wind_kph * random.uniform(1.2, 2.0), 1),
        "air_quality_Carbon_Monoxide": round(random.uniform(100, 500), 1),
        "air_quality_Ozone": round(random.uniform(20, 150), 1),
        "air_quality_Nitrogen_dioxide": round(random.uniform(1, 30), 3),
        "air_quality_Sulphur_dioxide": round(random.uniform(0.5, 10), 2),
        "air_quality_PM2_5": round(random.uniform(5, 100), 1),
        "air_quality_PM10": round(random.uniform(10, 150), 2),
        "air_quality_us_epa_index": random.randint(1, 6),
        "air_quality_gb_defra_index": random.randint(1, 10),
        "sunrise": "06:00 AM",
        "sunset": "06:00 PM",
        "moonrise": "07:00 PM",
        "moonset": "05:00 AM",
        "moon_phase": random.choice(moon_phases),
        "moon_illumination": random.randint(0, 100)
    })

os.makedirs("static/data", exist_ok=True)
with open("static/data/weather_fake.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

print("Created weather_fake.json with", len(output), "records.")
