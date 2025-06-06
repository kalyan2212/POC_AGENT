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

    # Create users table if it doesn't exist
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
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

@app.route('/upload', methods=['POST'])
def upload_data():
    data = request.json

    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Check if the first name already exists
        cursor.execute("SELECT unique_id FROM users WHERE first_name = ?", (data['firstName'],))
        existing_record = cursor.fetchone()

        if existing_record:
            unique_id = existing_record[0]
            cursor.close()
            conn.close()
            return jsonify({"uniqueId": unique_id, "error": "Record already exists"})

        # Generate a new unique ID and insert data into the database
        unique_id = str(uuid.uuid4())
        cursor.execute(
            """
            INSERT INTO users (unique_id, first_name, age, street_name, city, state, zip_code)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (unique_id, data['firstName'], data['age'], data['streetName'], data['city'], data['state'], data['zipCode'])
        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"uniqueId": unique_id})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/insurance', methods=['POST'])
def calculate_insurance():
    data = request.json
    unique_id = data.get('uniqueId')

    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Fetch user data based on unique ID
        cursor.execute("SELECT age FROM users WHERE unique_id = ?", (unique_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "User not found"}), 404

        age = result[0]

        # Calculate insurance premium
        if age <= 20:
            premium = "$100 per month"
        elif 20 < age <= 50:
            premium = "$200 per month"
        else:
            premium = "$500+ per month"

        cursor.close()
        conn.close()

        return jsonify({"uniqueId": unique_id, "insurancePremium": premium})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True)