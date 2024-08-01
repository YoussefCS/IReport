from flask import Flask, render_template, jsonify, request, send_file
import os
from dotenv import load_dotenv
from IncidentReports_connector import IncidentReportConnector
from OCInjury_connector import OCInjuryConnector
from pdf_generator import PDFGenerator
from wincams_connector import WinCAMSConnector  # Import the correct class

# Load environment variables from .env file
load_dotenv()

# Initialize SQL connectors with environment variables
incidentreport_connector = IncidentReportConnector(
    os.getenv('Main_SERVER'),
    os.getenv('IReport_DATABASE'),
    os.getenv('IReport_USERNAME'),
    os.getenv('IReport_PASSWORD')
)

ocinjury_connector = OCInjuryConnector(
    os.getenv('Main_SERVER'),
    os.getenv('OCInjury_DATABASE'),
    os.getenv('OCInjury_USERNAME'),
    os.getenv('OCInjury_PASSWORD')
)

wincams_connector = WinCAMSConnector(  # Use WinCAMSConnector for vehicle-related APIs
    os.getenv('WINCAMS_SERVER'),
    os.getenv('WINCAMS_DATABASE'),
    os.getenv('WINCAMS_USERNAME'),
    os.getenv('WINCAMS_PASSWORD')
)

pdf_generator = PDFGenerator()

app = Flask(__name__)

@app.route('/')
def incident_report():
    return render_template('index.htm')

@app.route('/api/incident_numbers', methods=['GET'])
def get_incident_numbers():
    incident_numbers = incidentreport_connector.get_incident_numbers()
    if incident_numbers:
        return jsonify(incident_numbers)
    else:
        return jsonify({"error": "Could not fetch incident numbers"}), 500

@app.route('/api/search_incidents', methods=['POST'])
def search_incidents():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    date = data.get('date')
    emp_id = data.get('empId')

    incidents = incidentreport_connector.search_incidents(
        first_name=first_name,
        last_name=last_name,
        date=date,
        emp_id=emp_id
    )
    
    if incidents is not None:
        return jsonify(incidents)
    else:
        return jsonify({"error": "Error searching incidents"}), 500

@app.route('/api/accident_codes', methods=['GET'])
def get_accident_codes():
    accident_codes = incidentreport_connector.get_accident_codes()
    if accident_codes:
        return jsonify(accident_codes)
    else:
        return jsonify({"error": "Could not fetch accident codes"}), 500

@app.route('/api/vehicle_codes', methods=['GET'])
def get_vehicle_codes():
    vehicle_codes = incidentreport_connector.get_vehicle_codes()
    if vehicle_codes:
        return jsonify(vehicle_codes)
    else:
        return jsonify({"error": "Could not fetch vehicle codes"}), 500

@app.route('/api/incident_details', methods=['GET'])
def get_incident_details():
    incident_number = request.args.get('number')
    if incident_number:
        incident = incidentreport_connector.incident_lookup(incident_number)
        if incident:
            try:
                # Generate PDF bytes with title and logo
                pdf_bytes = pdf_generator.create_incident_pdf(incident)
                if pdf_bytes:
                    return send_file(
                        pdf_bytes,
                        mimetype='application/pdf',
                        as_attachment=True,
                        download_name=f'incident_{incident_number}.pdf'
                    )
                else:
                    return jsonify({"error": "Failed to generate PDF"}), 500
            except Exception as e:
                return jsonify({"error": f"Error generating PDF: {e}"}), 500
        else:
            return jsonify({"error": "Incident not found"}), 404
    else:
        return jsonify({"error": "Incident number not provided"}), 400
    
@app.route('/api/new_incident', methods=['POST'])
def new_incident():
    data = request.form.to_dict()  # Get form data as dictionary
    print(data)
    if data:
        incident_number = incidentreport_connector.add_new_incident(data)
        if incident_number:
            return incident_number
        else:
            return jsonify({"error": "Failed to add new incident"}), 500
    else:
        return jsonify({"error": "No data received"}), 400

@app.route('/api/update_incident', methods=['POST'])
def update_incident():
    try:
        data = request.form.to_dict()
        incident_number = data.get('Number')
        if incident_number:
            success = incidentreport_connector.update_incident(incident_number, data)
            if success:
                return jsonify({'success': True})
            else:
                return jsonify({'success': False, 'error': 'Failed to update incident'}), 500
        else:
            return jsonify({'success': False, 'error': 'Incident number not provided'}), 400
    except Exception as e:
        print(f"Error updating incident: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    
@app.route('/api/new_accidentcode', methods=['POST'])
def new_accidentcode():
    data = request.form.to_dict()  # Get form data as dictionary
    if data:
        print(data)
        accident_code = incidentreport_connector.add_accident_code(data)
        if accident_code:
            return accident_code
        else:
            return jsonify({"error": "Failed to add new accident code"}), 500
    else:
        return jsonify({"error": "No data received"}), 400
    
@app.route('/api/new_vehicle', methods=['POST'])
def new_vehicle():
    data = request.form.to_dict()  # Get form data as dictionary
    if data:
        print(data)
        vehicle = incidentreport_connector.add_vehicle(data)
        if vehicle:
            print(vehicle)
            return vehicle
        else:
            return jsonify({"error": "Failed to add new vehicle"}), 500
    else:
        return jsonify({"error": "No data received"}), 400

@app.route('/api/vehicle_numbers', methods=['GET'])
def get_vehicle_numbers():
    vehicle_numbers = wincams_connector.get_vehicle_numbers()
    if vehicle_numbers:
        return jsonify(vehicle_numbers)
    else:
        return jsonify({"error": "Could not fetch vehicle numbers"}), 500


#################################OCINJURY########################################
@app.route('/api/body_codes', methods=['GET'])
def get_body_codes():
    body_codes = ocinjury_connector.get_body_codes()
    if body_codes:
        return jsonify(body_codes)
    else:
        return jsonify({"error": "Could not fetch accident codes"}), 500

@app.route('/api/injury_codes', methods=['GET'])
def get_injury_codes():
    injury_codes = ocinjury_connector.get_injury_codes()
    if injury_codes:
        return jsonify(injury_codes)
    else:
        return jsonify({"error": "Could not fetch vehicle codes"}), 500
    

@app.route('/api/OCInjury_numbers', methods=['GET'])
def get_OCInjury_numbers():
    OCInjury_numbers = ocinjury_connector.get_OCInjury_numbers()
    if OCInjury_numbers:
        return jsonify(OCInjury_numbers)
    else:
        return jsonify({"error": "Could not fetch OCInjury numbers"}), 500

@app.route('/api/search_OCInjuries', methods=['POST'])
def search_OCInjuries():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    date = data.get('date')
    emp_id = data.get('empId')

    OCInjuries = ocinjury_connector.search_OCInjury(
        first_name=first_name,
        last_name=last_name,
        date=date,
        emp_id=emp_id
    )
    
    if OCInjuries is not None:
        return jsonify(OCInjuries)
    else:
        return jsonify({"error": "Error searching OCInjuries"}), 500

@app.route('/api/OCInjury_details', methods=['GET'])
def get_OCInjury_details():
    OCInjury_number = request.args.get('number')
    if OCInjury_number:
        OCInjury = ocinjury_connector.OCInjury_lookup(OCInjury_number)
        if OCInjury:
            try:
                # Generate PDF bytes with title and logo
                pdf_bytes = pdf_generator.create_ocinjury_pdf(OCInjury)
                if pdf_bytes:
                    return send_file(
                        pdf_bytes,
                        mimetype='application/pdf',
                        as_attachment=True,
                        download_name=f'OCInjury_{OCInjury_number}.pdf'
                    )
                else:
                    return jsonify({"error": "Failed to generate PDF"}), 500
            except Exception as e:
                return jsonify({"error": f"Error generating PDF: {e}"}), 500
        else:
            return jsonify({"error": "OCInjury not found"}), 404
    else:
        return jsonify({"error": "OCInjury number not provided"}), 400
    
@app.route('/api/new_OCInjury', methods=['POST'])
def new_OCInjury():
    data = request.form.to_dict()  # Get form data as dictionary
    print(data)
    if data:
        OCInjury_number = ocinjury_connector.add_new_OCInjury(data)
        if OCInjury_number:
            return OCInjury_number
        else:
            return jsonify({"error": "Failed to add new OCInjury"}), 500
    else:
        return jsonify({"error": "No data received"}), 400

@app.route('/api/update_OCInjury', methods=['POST'])
def update_OCInjury():
    try:
        data = request.form.to_dict()
        OCInjury_number = data.get('Number')
        if OCInjury_number:
            success = ocinjury_connector.update_OCInjury(OCInjury_number, data)
            if success:
                return jsonify({'success': True})
            else:
                return jsonify({'success': False, 'error': 'Failed to update OCInjury'}), 500
        else:
            return jsonify({'success': False, 'error': 'OCInjury number not provided'}), 400
    except Exception as e:
        print(f"Error updating OCInjury: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    
@app.route('/api/new_body', methods=['POST'])
def new_body():
    data = request.form.to_dict()  # Get form data as dictionary
    if data:
        print(data)
        body_code = ocinjury_connector.add_body_code(data)
        if body_code:
            return body_code
        else:
            return jsonify({"error": "Failed to add new body code"}), 500
    else:
        return jsonify({"error": "No data received"}), 400
    
@app.route('/api/new_Injury', methods=['POST'])
def new_injury():
    data = request.form.to_dict()  # Get form data as dictionary
    if data:
        print(data)
        injury_code = ocinjury_connector.add_injury_code(data)
        if injury_code:
            print(injury_code)
            return injury_code
        else:
            return jsonify({"error": "Failed to add new Injury"}), 500
    else:
        return jsonify({"error": "No data received"}), 400

if __name__ == '__main__':
    app.run(port=8000, debug=True)
