from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import uuid

app = Flask(__name__)
CORS(app)

# Database file
DB_FILE = "insurance.db"

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Create users_usa table if it doesn't exist
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users_usa (
            unique_id TEXT PRIMARY KEY,
            first_name TEXT,
            age INTEGER,
            street_name TEXT,
            city TEXT,
            state TEXT,
            zip_code TEXT
        )
        """
    )

    # Create users_india table if it doesn't exist
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users_india (
            unique_id TEXT PRIMARY KEY,
            first_name TEXT,
            age INTEGER,
            street_name TEXT,
            city TEXT,
            state TEXT,
            zip_code TEXT
        )
        """
    )

    conn.commit()
    cursor.close()
    conn.close()

# Connect to SQLite database
def connect_db():
    return sqlite3.connect(DB_FILE)

# Currency conversion rate (USD to INR)
USD_TO_INR_RATE = 83.0  # Approximate exchange rate

def convert_usd_to_inr(usd_amount):
    """Convert USD amount to INR"""
    return usd_amount * USD_TO_INR_RATE

def get_table_name(country):
    """Get table name based on country"""
    if country.lower() == 'usa':
        return 'users_usa'
    elif country.lower() == 'india':
        return 'users_india'
    else:
        raise ValueError("Invalid country. Supported countries: USA, India")

@app.route('/upload', methods=['POST'])
def upload_data():
    data = request.json

    try:
        country = data.get('country')
        if not country:
            return jsonify({"error": "Country is required"}), 400
        
        table_name = get_table_name(country)
        
        conn = connect_db()
        cursor = conn.cursor()

        # Check if the first name already exists in the country-specific table
        cursor.execute(f"SELECT unique_id FROM {table_name} WHERE first_name = ?", (data['firstName'],))
        existing_record = cursor.fetchone()

        if existing_record:
            unique_id = existing_record[0]
            cursor.close()
            conn.close()
            return jsonify({"uniqueId": unique_id, "error": "Record already exists"})

        # Generate a new unique ID and insert data into the country-specific database
        unique_id = str(uuid.uuid4())
        cursor.execute(
            f"""
            INSERT INTO {table_name} (unique_id, first_name, age, street_name, city, state, zip_code)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (unique_id, data['firstName'], data['age'], data['streetName'], data['city'], data['state'], data['zipCode'])
        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"uniqueId": unique_id})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/insurance', methods=['POST'])
def calculate_insurance():
    data = request.json
    unique_id = data.get('uniqueId')
    country = data.get('country')

    try:
        if not country:
            return jsonify({"error": "Country is required"}), 400
            
        table_name = get_table_name(country)
        
        conn = connect_db()
        cursor = conn.cursor()

        # Fetch user data based on unique ID from country-specific table
        cursor.execute(f"SELECT age FROM {table_name} WHERE unique_id = ?", (unique_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "User not found"}), 404

        age = result[0]

        # Calculate insurance premium in USD
        if age <= 20:
            usd_premium = 100
        elif 20 < age <= 50:
            usd_premium = 200
        else:
            usd_premium = 500

        # Convert to appropriate currency based on country
        if country.lower() == 'usa':
            premium = f"${usd_premium} per month"
        elif country.lower() == 'india':
            inr_premium = convert_usd_to_inr(usd_premium)
            premium = f"₹{inr_premium:.0f} per month"
        else:
            premium = f"${usd_premium} per month"

        cursor.close()
        conn.close()

        return jsonify({"uniqueId": unique_id, "insurancePremium": premium})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True)