import pyodbc
from dotenv import load_dotenv
import os

class OCInjuryConnector:
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

    def get_OCInjury_numbers(self):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()
                cursor.execute("SELECT Number FROM dbo.OICLEAN")
                OCInjury_numbers = [row.Number for row in cursor.fetchall()]
                cursor.close()
                conn.close()
                return OCInjury_numbers
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error fetching incident numbers: {e}")
            return None
    
    def get_body_codes(self):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()
                cursor.execute("SELECT BODYCD, BCDESC FROM dbo.BODYCODE")
                body_codes = [{'BODYCD': row[0], 'BCDESC': row[1]} for row in cursor.fetchall()]
                cursor.close()
                conn.close()
                return body_codes
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error fetching accident codes: {e}")
            return None
        
    def get_injury_codes(self):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()
                cursor.execute("SELECT INJURYCD, INJDESC FROM dbo.INJCODE")
                injury_codes = [{'INJURYCD': row[0], 'INJDESC': row[1]} for row in cursor.fetchall()]
                cursor.close()
                conn.close()
                return injury_codes
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error fetching accident codes: {e}")
            return None



    def OCInjury_lookup(self, OCInjury_number):
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
                          ,[BODYCODE]
                          ,[BCDESC]
                          ,[INJCODE]
                          ,[INJDESC]
                          ,[COMMENT]
                    FROM dbo.OICLEAN
                    WHERE NUMBER = ?
                """, OCInjury_number)
                row = cursor.fetchone()
                cursor.close()
                conn.close()
                if row:
                    OCINJURY = {
                        'Number': row.NUMBER,
                        'Yard': row.YARD,
                        'Date': row.DATE,
                        'First': row.FIRST,
                        'Last': row.LAST,
                        'EmpNum': row.EMPNUM,
                        'PayCntr': row.PAYCNTR,
                        'Position': row.POSITION,
                        'BODYCODE': row.BODYCODE,
                        'BCDESC': row.BCDESC,
                        'INJCODE': row.INJCODE,
                        'INJDESC': row.INJDESC,
                        'Comment': row.COMMENT,
                    }
                    return OCINJURY
                else:
                    return None
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error fetching OCInjury details: {e}")
            return None

    def add_new_OCInjury(self, OCInjury_data):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()

                # Replace empty strings with None to insert NULL into the database
                sanitized_data = {k: (v if v else None) for k, v in OCInjury_data.items()}

                insert_query = """
                    INSERT INTO dbo.OICLEAN (
                        YARD, DATE, FIRST, LAST, EMPNUM, PAYCNTR,
                        POSITION, BODYCODE, BCDESC, INJCODE, INJDESC, COMMENT
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                cursor.execute(insert_query, (
                    sanitized_data.get('YARD'),
                    sanitized_data.get('DATE'),
                    sanitized_data.get('FIRST'),
                    sanitized_data.get('LAST'),
                    sanitized_data.get('EMPNUM'),
                    sanitized_data.get('PAYCNTR'),
                    sanitized_data.get('POSITION'),
                    sanitized_data.get('BODYCODE'),
                    sanitized_data.get('BCDESC'),
                    sanitized_data.get('INJCODE'),
                    sanitized_data.get('INJDESC'),
                    sanitized_data.get('COMMENT')
                ))

                cursor.execute("SELECT IDENT_CURRENT('dbo.OICLEAN')")
                OCInjury_number = cursor.fetchone()[0]

                conn.commit()
                cursor.close()
                conn.close()
                return str(OCInjury_number)
            else:
                return None
        except pyodbc.Error as e:
            print(f"Error adding new OCInjury: {e}")
            return None


    def update_OCInjury(self, OCInjury_number, OCInjury_data):
        try:
            conn = self.connect()
            if conn:
                cursor = conn.cursor()

                # Replace empty strings with None
                sanitized_data = {k: (v if v else None) for k, v in OCInjury_data.items()}

                update_query = """
                    UPDATE dbo.OICLEAN
                    SET YARD = ?, DATE = ?, FIRST = ?, LAST = ?, EMPNUM = ?, PAYCNTR = ?,
                        POSITION = ?, BODYCODE = ?, BCDESC = ?, INJCODE = ?, INJDESC = ?, 
                        COMMENT = ?
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
                    sanitized_data.get('BODYCODE'),
                    sanitized_data.get('BCDESC'),
                    sanitized_data.get('INJCODE'),
                    sanitized_data.get('INJDESC'),
                    sanitized_data.get('COMMENT'),
                    OCInjury_number
                ))
                conn.commit()
                cursor.close()
                conn.close()
                return True
            else:
                return False
        except pyodbc.Error as e:
            print(f"Error updating OCInjury: {e}")
            return False

        
    def search_OCInjury(self, first_name=None, last_name=None, date=None, emp_id=None):
            try:
                conn = self.connect()
                if conn:
                    cursor = conn.cursor()
                    query = "SELECT * FROM dbo.OICLEAN WHERE 1=1"
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
                    OCInjuries = [{
                        'Number': row.NUMBER,
                        'Yard': row.YARD,
                        'Date': row.DATE,
                        'First': row.FIRST,
                        'Last': row.LAST,
                        'EmpNum': row.EMPNUM,
                        'PayCntr': row.PAYCNTR,
                        'Position': row.POSITION,
                        'BODYCODE': row.BODYCODE,
                        'BCDESC': row.BCDESC,
                        'INJCODE': row.INJCODE,
                        'INJDESC': row.INJDESC,
                        'Comment': row.COMMENT,
                    } for row in results]
                    cursor.close()
                    conn.close()
                    return OCInjuries
                else:
                    return None
            except pyodbc.Error as e:
                print(f"Error searching OCInjuries: {e}")
                return None
            
    def add_body_code(self, body_data):
            try:
                conn = self.connect()
                if conn:
                    cursor = conn.cursor()

                    # Insert new incident with provided data
                    insert_query = """
                        INSERT INTO dbo.BODYCODE (
                            BODYCD, BCDESC
                        )
                        VALUES (?, ?)
                    """
                    cursor.execute(insert_query, (
                        body_data.get('BODYCD', ''),
                        body_data.get('BCDESC', ''),
                    ))
                    
                    body_code = body_data.get('BODYCD', '')


                    conn.commit()
                    cursor.close()
                    conn.close()
                    return str(body_code)  # Convert incident_number to string before returning
                else:
                    return None
            except pyodbc.Error as e:
                print(f"Error adding new body code: {e}")
                return None

    def add_injury_code(self, Injury_data):
            try:
                conn = self.connect()
                if conn:
                    cursor = conn.cursor()

                    # Insert new vehicle with provided data
                    insert_query = """
                        INSERT INTO dbo.INJCODE (
                            INJURYCD, INJDESC
                        )
                        VALUES (?, ?)
                    """
                    cursor.execute(insert_query, (
                        Injury_data.get('INJURYCD', ''),
                        Injury_data.get('INJDESC', ''),
                    ))
                    
                    Injury_code = Injury_data.get('INJURYCD', '')


                    conn.commit()
                    cursor.close()
                    conn.close()
                    return str(Injury_code)  # Convert vehicle to string before returning
                else:
                    return None
            except pyodbc.Error as e:
                print(f"Error adding new Injury code: {e}")
                return None