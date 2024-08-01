import pyodbc
from dotenv import load_dotenv
import os

class IncidentReportConnector:
    def __init__(self, server, database, username, password):
        self.server = server
        self.database = database
        self.username = username
        self.password = password

    def connect(self):
        try:
            conn_str = (
                f"DRIVER={{SQL Server}};"
                f"SERVER={self.server};"
                f"DATABASE={self.database};"
                f"UID={self.username};"
                f"PWD={self.password};"
            )
            conn = pyodbc.connect(conn_str)
            return conn
        except pyodbc.Error as e:
            print(f"Error connecting to SQL Server: {e}")
            return None

    def get_incident_numbers(self):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()
                cursor.execute("SELECT Number FROM dbo.IRCLEAN")
                incident_numbers = [row.Number for row in cursor.fetchall()]
                cursor.close()
                conn.close()
                return incident_numbers
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error fetching incident numbers: {e}")
            return None
    
    def get_accident_codes(self):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()
                cursor.execute("SELECT ACCIDNTCODE, [DESC] FROM dbo.ACCIDENT")
                accident_codes = [{'ACCIDENTCODE': row[0], 'DESC': row[1]} for row in cursor.fetchall()]
                cursor.close()
                conn.close()
                return accident_codes
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error fetching accident codes: {e}")
            return None
        
    def get_vehicle_codes(self):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()
                cursor.execute("SELECT VEHTYPE, VEHDISC FROM dbo.VEHICLE")
                vehicle_codes = [{'VEHTYPE': row[0], 'VEHDISC': row[1]} for row in cursor.fetchall()]
                cursor.close()
                conn.close()
                return vehicle_codes
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error fetching accident codes: {e}")
            return None



    def incident_lookup(self, incident_number):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT [NUMBER]
                          ,[YARD]
                          ,[DATE]
                          ,[FIRST]
                          ,[LAST]
                          ,[EMPNUM]
                          ,[PAYCNTR]
                          ,[POSITION]
                          ,[DEPTNUM]
                          ,[FUND]
                          ,[VEHNUM]
                          ,[VEHYR]
                          ,[VEHMAKE]
                          ,[VEHTYPE]
                          ,[VEHDISC]
                          ,[ACCIDNTCODE]
                          ,[DESC]
                          ,[PREVENT]
                          ,[COMMENTS]
                          ,[FY]
                          ,[SNOW]
                          ,[SARB]
                          ,[SAFETYCOM]
                          ,[SICOM]
                    FROM dbo.IRCLEAN
                    WHERE NUMBER = ?
                """, incident_number)
                row = cursor.fetchone()
                cursor.close()
                conn.close()
                if row:
                    incident = {
                        'Number': row.NUMBER,
                        'Yard': row.YARD,
                        'Date': row.DATE,
                        'First': row.FIRST,
                        'Last': row.LAST,
                        'EmpNum': row.EMPNUM,
                        'PayCntr': row.PAYCNTR,
                        'Position': row.POSITION,
                        'DeptNum': row.DEPTNUM,
                        'Fund': row.FUND,
                        'VehNum': row.VEHNUM,
                        'VehYr': row.VEHYR,
                        'VehMake': row.VEHMAKE,
                        'VehType': row.VEHTYPE,
                        'VehDisc': row.VEHDISC,
                        'AccidntCode': row.ACCIDNTCODE,
                        'Desc': row.DESC,
                        'Prevent': row.PREVENT,
                        'Comments': row.COMMENTS,
                        'FY': row.FY,
                        'Snow': row.SNOW,
                        'SARB': row.SARB,
                        'SafetyCom': row.SAFETYCOM,
                        'SICom': row.SICOM
                    }
                    return incident
                else:
                    return None
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error fetching incident details: {e}")
            return None

    def add_new_incident(self, incident_data):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()

                # Replace empty strings with None to insert NULL into the database
                sanitized_data = {k: (v if v else None) for k, v in incident_data.items()}
                print (sanitized_data)

                insert_query = """
                    INSERT INTO dbo.IRCLEAN (
                        YARD, DATE, FIRST, LAST, EMPNUM, PAYCNTR,
                        POSITION, DEPTNUM, FUND, VEHNUM, VEHYR, VEHMAKE,
                        VEHTYPE, VEHDISC, ACCIDNTCODE, [DESC], PREVENT,
                        FY, SNOW, SARB, SAFETYCOM, SICOM, COMMENTS
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                cursor.execute(insert_query, (
                    sanitized_data.get('YARD'),
                    sanitized_data.get('DATE'),
                    sanitized_data.get('FIRST'),
                    sanitized_data.get('LAST'),
                    sanitized_data.get('EMPNUM'),
                    sanitized_data.get('PAYCNTR'),
                    sanitized_data.get('POSITION'),
                    sanitized_data.get('DEPTNUM'),
                    sanitized_data.get('FUND'),
                    sanitized_data.get('VEHNUM'),
                    sanitized_data.get('VEHYR'),
                    sanitized_data.get('VEHMAKE'),
                    sanitized_data.get('VEHTYPE'),
                    sanitized_data.get('VEHDISC'),
                    sanitized_data.get('ACCIDNTCODE'),
                    sanitized_data.get('DESC'),
                    sanitized_data.get('PREVENT'),
                    sanitized_data.get('FY'),
                    sanitized_data.get('SNOW'),
                    sanitized_data.get('SARB'),
                    sanitized_data.get('SAFETYCOM'),
                    sanitized_data.get('SICOM'),
                    sanitized_data.get('COMMENTS')
                ))
                
                cursor.execute("SELECT IDENT_CURRENT('dbo.IRCLEAN')")
                incident_number = cursor.fetchone()[0]

                conn.commit()
                cursor.close()
                conn.close()
                return str(incident_number)
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error adding new incident: {e}")
            return None

    def update_incident(self, incident_number, incident_data):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()

                # Replace empty strings with None
                sanitized_data = {k: (v if v else None) for k, v in incident_data.items()}

                update_query = """
                    UPDATE dbo.IRCLEAN
                    SET YARD = ?, DATE = ?, FIRST = ?, LAST = ?, EMPNUM = ?, PAYCNTR = ?,
                        POSITION = ?, DEPTNUM = ?, FUND = ?, VEHNUM = ?, VEHYR = ?, VEHMAKE = ?,
                        VEHTYPE = ?, VEHDISC = ?, ACCIDNTCODE = ?, [DESC] = ?, PREVENT = ?,
                        FY = ?, SNOW = ?, SARB = ?, SAFETYCOM = ?, SICOM = ?, COMMENTS = ?
                    WHERE NUMBER = ?
                """
                cursor.execute(update_query, (
                    sanitized_data.get('YARD'),
                    sanitized_data.get('DATE'),
                    sanitized_data.get('FIRST'),
                    sanitized_data.get('LAST'),
                    sanitized_data.get('EMPNUM'),
                    sanitized_data.get('PAYCNTR'),
                    sanitized_data.get('POSITION'),
                    sanitized_data.get('DEPTNUM'),
                    sanitized_data.get('FUND'),
                    sanitized_data.get('VEHNUM'),
                    sanitized_data.get('VEHYR'),
                    sanitized_data.get('VEHMAKE'),
                    sanitized_data.get('VEHTYPE'),
                    sanitized_data.get('VEHDISC'),
                    sanitized_data.get('ACCIDNTCODE'),
                    sanitized_data.get('DESC'),
                    sanitized_data.get('PREVENT'),
                    sanitized_data.get('FY'),
                    sanitized_data.get('SNOW'),
                    sanitized_data.get('SARB'),
                    sanitized_data.get('SAFETYCOM'),
                    sanitized_data.get('SICOM'),
                    sanitized_data.get('COMMENTS'),
                    incident_number
                ))
                conn.commit()
                cursor.close()
                conn.close()
                return True
            else:
                return False
        except pyodbc.Error as e:
            print(f"Error updating incident: {e}")
            return False

        
    def search_incidents(self, first_name=None, last_name=None, date=None, emp_id=None):
            try:
                conn = self.connect()
                if conn:
                    cursor = conn.cursor()
                    query = "SELECT * FROM dbo.IRCLEAN WHERE 1=1"
                    params = []
                    
                    if first_name:
                        query += " AND FIRST = ?"
                        params.append(first_name)
                    if last_name:
                        query += " AND LAST = ?"
                        params.append(last_name)
                    if date:
                        query += " AND DATE = ?"
                        params.append(date)
                    if emp_id:
                        query += " AND EMPNUM = ?"
                        params.append(emp_id)
                    
                    cursor.execute(query, params)
                    results = cursor.fetchall()
                    incidents = [{
                        'Number': row.NUMBER,
                        'Yard': row.YARD,
                        'Date': row.DATE,
                        'First': row.FIRST,
                        'Last': row.LAST,
                        'EmpNum': row.EMPNUM,
                        'PayCntr': row.PAYCNTR,
                        'Position': row.POSITION,
                        'DeptNum': row.DEPTNUM,
                        'Fund': row.FUND,
                        'VehNum': row.VEHNUM,
                        'VehYr': row.VEHYR,
                        'VehMake': row.VEHMAKE,
                        'VehType': row.VEHTYPE,
                        'VehDisc': row.VEHDISC,
                        'AccidntCode': row.ACCIDNTCODE,
                        'Desc': row.DESC,
                        'Prevent': row.PREVENT,
                        'Comments': row.COMMENTS,
                        'FY': row.FY,
                        'Snow': row.SNOW,
                        'SARB': row.SARB,
                        'SafetyCom': row.SAFETYCOM,
                        'SICom': row.SICOM
                    } for row in results]
                    cursor.close()
                    conn.close()
                    return incidents
                else:
                    return None
            except pyodbc.Error as e:
                print(f"Error searching incidents: {e}")
                return None
            
    def add_accident_code(self, accident_data):
            try:
                conn = self.connect()
                if conn:
                    cursor = conn.cursor()

                    # Insert new incident with provided data
                    insert_query = """
                        INSERT INTO dbo.ACCIDENT (
                            ACCIDNTCODE, [DESC]
                        )
                        VALUES (?, ?)
                    """
                    cursor.execute(insert_query, (
                        accident_data.get('ACCIDNTCODE', ''),
                        accident_data.get('DESC', ''),
                    ))
                    
                    accident_code = accident_data.get('ACCIDNTCODE', '')


                    conn.commit()
                    cursor.close()
                    conn.close()
                    return str(accident_code)  # Convert incident_number to string before returning
                else:
                    return None
            except pyodbc.Error as e:
                print(f"Error adding new accident code: {e}")
                return None

    def add_vehicle(self, vehicle_data):
            try:
                conn = self.connect()
                if conn:
                    cursor = conn.cursor()

                    # Insert new vehicle with provided data
                    insert_query = """
                        INSERT INTO dbo.VEHICLE (
                            VEHTYPE, VEHDISC
                        )
                        VALUES (?, ?)
                    """
                    cursor.execute(insert_query, (
                        vehicle_data.get('VEHTYPE', ''),
                        vehicle_data.get('VEHDISC', ''),
                    ))
                    
                    vehicle_code = vehicle_data.get('VEHTYPE', '')


                    conn.commit()
                    cursor.close()
                    conn.close()
                    return str(vehicle_code)  # Convert vehicle to string before returning
                else:
                    return None
            except pyodbc.Error as e:
                print(f"Error adding new vehicle code: {e}")
                return None