import sqlite3
import os
from typing import List, Dict, Optional

class DatabaseManager:
    def __init__(self, db_path: str = 'insurance.db'):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database with schema and sample data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Read and execute schema
            schema_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'schema.sql')
            with open(schema_path, 'r') as f:
                schema_sql = f.read()
            cursor.executescript(schema_sql)
            
            # Check if data already exists
            cursor.execute("SELECT COUNT(*) FROM insurance_usa")
            usa_count = cursor.fetchone()[0]
            
            if usa_count == 0:  # Only insert if tables are empty
                sample_data_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'sample_data.sql')
                with open(sample_data_path, 'r') as f:
                    sample_sql = f.read()
                cursor.executescript(sample_sql)
            
            conn.commit()
            conn.close()
            print("Database initialized successfully")
        except Exception as e:
            print(f"Error initializing database: {e}")
    
    def get_connection(self):
        """Get database connection"""
        return sqlite3.connect(self.db_path)
    
    def search_insurance_usa(self, insurance_type: Optional[str] = None) -> List[Dict]:
        """Search insurance policies in USA table"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if insurance_type:
            cursor.execute("""
                SELECT id, policy_name, insurance_type, coverage_amount, premium_usd, provider, description
                FROM insurance_usa 
                WHERE insurance_type = ?
                ORDER BY premium_usd
            """, (insurance_type,))
        else:
            cursor.execute("""
                SELECT id, policy_name, insurance_type, coverage_amount, premium_usd, provider, description
                FROM insurance_usa 
                ORDER BY premium_usd
            """)
        
        results = cursor.fetchall()
        conn.close()
        
        return [
            {
                'id': row[0],
                'policy_name': row[1],
                'insurance_type': row[2],
                'coverage_amount': row[3],
                'premium_usd': row[4],
                'provider': row[5],
                'description': row[6]
            }
            for row in results
        ]
    
    def search_insurance_india(self, insurance_type: Optional[str] = None) -> List[Dict]:
        """Search insurance policies in India table"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if insurance_type:
            cursor.execute("""
                SELECT id, policy_name, insurance_type, coverage_amount, premium_usd, provider, description
                FROM insurance_india 
                WHERE insurance_type = ?
                ORDER BY premium_usd
            """, (insurance_type,))
        else:
            cursor.execute("""
                SELECT id, policy_name, insurance_type, coverage_amount, premium_usd, provider, description
                FROM insurance_india 
                ORDER BY premium_usd
            """)
        
        results = cursor.fetchall()
        conn.close()
        
        return [
            {
                'id': row[0],
                'policy_name': row[1],
                'insurance_type': row[2],
                'coverage_amount': row[3],
                'premium_usd': row[4],
                'provider': row[5],
                'description': row[6]
            }
            for row in results
        ]
    
    def get_insurance_types_usa(self) -> List[str]:
        """Get unique insurance types from USA table"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT insurance_type FROM insurance_usa ORDER BY insurance_type")
        results = cursor.fetchall()
        conn.close()
        return [row[0] for row in results]
    
    def get_insurance_types_india(self) -> List[str]:
        """Get unique insurance types from India table"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT insurance_type FROM insurance_india ORDER BY insurance_type")
        results = cursor.fetchall()
        conn.close()
        return [row[0] for row in results]