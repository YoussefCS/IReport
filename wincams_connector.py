import pyodbc
import os
from dotenv import load_dotenv

class WinCAMSConnector:
    def __init__(self, server, database, username, password):
        self.server = server
        self.database = database
        self.username = username
        self.password = password
        self.connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={self.server};DATABASE={self.database};UID={self.username};PWD={self.password}'

    def get_vehicle_numbers(self):
        query = """
        SELECT Vem, Year, Make
        FROM WinCAMS_Vehicles
        """
        try:
            with pyodbc.connect(self.connection_string) as conn:
                cursor = conn.cursor()
                cursor.execute(query)
                rows = cursor.fetchall()
                vehicle_numbers = []
                for row in rows:
                    vehicle_numbers.append({
                        'VEHNUM': row.Vem,
                        'VEHYR': row.Year,
                        'VEHMAKE': row.Make
                    })
                return vehicle_numbers
        except pyodbc.Error as e:
            print(f"Database error: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None

# Ensure environment variables are loaded
load_dotenv()

