import sqlite3

# Connect to the SQLite database
DB_FILE = "insurance.db"

def check_database():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Query to list all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        if tables:
            print("Tables in the database:")
            for table in tables:
                print(table[0])
        else:
            print("No tables found in the database.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    check_database()