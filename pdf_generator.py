import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from io import BytesIO
from datetime import datetime

class PDFGenerator:
    @staticmethod
    def wrap_text(text, font):
        lines = []
        current_line = []
        current_width = 0
        canvas_obj = canvas.Canvas(BytesIO())

        # Calculate available width dynamically based on page size
        page_width, _ = letter
        max_text_width = page_width - 2 * 120  # Adjust margins as needed

        for word in text.split():
            word_width = canvas_obj.stringWidth(word, font, 12)
            if current_width + word_width <= max_text_width:
                current_line.append(word)
                current_width += word_width + canvas_obj.stringWidth(' ', font, 12)
            else:
                lines.append(' '.join(current_line))
                current_line = [word]
                current_width = word_width + canvas_obj.stringWidth(' ', font, 12)

        if current_line:
            lines.append(' '.join(current_line))

        return lines

    @staticmethod
    def create_incident_pdf(data):
        try:
            # Generate PDF
            pdf_buffer = BytesIO()
            c = canvas.Canvas(pdf_buffer, pagesize=letter)

            # Constants for layout
            page_width, page_height = letter
            left_margin = 50  # Adjust as needed for left side margin
            logo_x = left_margin
            logo_y = page_height - 100  # Adjust as needed for logo position
            title_x = logo_x + 120  # Position the title to the right of the logo
            title_y = page_height - 80  # Adjust vertical position for the title

            # Logo image
            logo_path = os.getenv('PDF_LOGO_PATH')
            if logo_path:
                img = ImageReader(logo_path)
                img_width, img_height = img.getSize()
                c.drawImage(img, logo_x, logo_y, width=100, height=50, mask='auto')  # Use 'auto' to handle transparency

            # Title
            c.setFont("Helvetica-Bold", 20)  # Set title font size and style
            title_text = "San Bernardino County Incident Form"
            title_width = c.stringWidth(title_text)  # Get width of title text
            c.drawString(title_x, title_y, title_text)  # Draw title to the right of the logo

            # Initialize y_position for the first section
            y_position = title_y - 50  # Adjusted for initial spacing

            # Incident Number (first data item) - Adjusted to be on the same line
            c.setFont("Helvetica-Bold", 12)
            c.drawString(left_margin, y_position, "Incident Number:")
            c.setFont("Helvetica", 12)
            incident_number = str(data.get("Number", ""))
            incident_number_lines = PDFGenerator.wrap_text(incident_number, "Helvetica")

            # Displaying "Incident Number:" and its value on the same line
            c.drawString(left_margin + 150, y_position, incident_number)  # Adjust x position for value
            y_position -= 15  # Adjust vertical position

            # Draw thicker gray line after Incident Number section
            c.setStrokeColorRGB(0.7, 0.7, 0.7)  # Set gray color for the line
            c.setLineWidth(4)  # Increased line width
            c.line(left_margin, y_position - 10, page_width - 50, y_position - 10)  # Draw line below the Incident Number section

            # Employee Data (9 items)
            c.setFont("Helvetica-Bold", 12)  # Set subtitle font size and style to bold
            c.drawString(left_margin, y_position - 30, "Employee Data:")
            y_position -= 50  # Adjust y position for Employee Data section

            employee_data_items = [
                ("First", "First Name"), ("Last", "Last Name"), ("EmpNum", "Employee Number"),
                ("PayCntr", "Pay Center"), ("Position", "Position"), ("DeptNum", "Department Number"),
                ("Fund", "Fund"), ("Yard", "Yard"), ("Date", "Date")
            ]
            for key, label in employee_data_items:
                c.setFont("Helvetica", 12)  # Set data item font size and style to bold
                c.drawString(left_margin + 20, y_position, f"{label}:")
                c.setFont("Helvetica", 12)  # Reset font to regular for data items
                if key == "Date":
                    date_value = str(data.get(key, ''))
                    formatted_date = datetime.strptime(date_value, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d')
                    text_lines = PDFGenerator.wrap_text(formatted_date, "Helvetica")
                else:
                    text = str(data.get(key, ''))
                    text_lines = PDFGenerator.wrap_text(text, "Helvetica")

                for line in text_lines:
                    c.drawString(left_margin + 150, y_position, line)  # Adjust x position for value
                    y_position -= 15  # Adjust vertical position

            # Draw thicker gray line after Employee Data section
            c.setStrokeColorRGB(0.7, 0.7, 0.7)  # Set gray color for the line
            c.setLineWidth(4)  # Increased line width
            c.line(left_margin, y_position - 10, page_width - 50, y_position - 10)  # Draw line below the Employee Data section

            # Vehicle Data (5 items)
            c.setFont("Helvetica-Bold", 12)  # Set subtitle font size and style to bold
            c.drawString(left_margin, y_position - 30, "Vehicle Data:")
            y_position -= 50  # Adjust y position for Vehicle Data section

            vehicle_data_items = [
                ("VehNum", "Vehicle Number"), ("VehYr", "Vehicle Year"), ("VehMake", "Vehicle Make"),
                ("VehType", "Vehicle Type"), ("VehDisc", "Vehicle Description")
            ]
            for key, label in vehicle_data_items:
                c.setFont("Helvetica", 12)  # Set data item font size and style to bold
                c.drawString(left_margin + 20, y_position, f"{label}:")
                c.setFont("Helvetica", 12)  # Reset font to regular for data items
                text = str(data.get(key, ''))
                text_lines = PDFGenerator.wrap_text(text, "Helvetica")
                for line in text_lines:
                    c.drawString(left_margin + 150, y_position, line)  # Adjust x position for value
                    y_position -= 15  # Adjust vertical position

            # Draw thicker gray line after Vehicle Data section
            c.setStrokeColorRGB(0.7, 0.7, 0.7)  # Set gray color for the line
            c.setLineWidth(4)  # Increased line width
            c.line(left_margin, y_position - 10, page_width - 50, y_position - 10)  # Draw line below the Vehicle Data section

            # Evaluation Data (8 items)
            c.setFont("Helvetica-Bold", 12)  # Set subtitle font size and style to bold
            c.drawString(left_margin, y_position - 30, "Evaluation Data:")
            y_position -= 50  # Adjust y position for Evaluation Data section

            evaluation_data_items = [
                ("AccidntCode", "Accident Code"), ("Desc", "Description"), ("Prevent", "Prevention"),
                ("Comments", "Comments"), ("FY", "Fiscal Year"), ("Snow", "Snow"), ("SARB", "SARB"),
                ("SafetyCom", "Safety Committee")
            ]
            for key, label in evaluation_data_items:
                c.setFont("Helvetica", 12)  # Set data item font size and style to bold
                c.drawString(left_margin + 20, y_position, f"{label}:")
                c.setFont("Helvetica", 12)  # Reset font to regular for data items

                # Special handling for "Snow" field to display "Yes" or "No"
                if key == "Snow":
                    text = "Yes" if data.get(key, False) else "No"
                else:
                    text = str(data.get(key, ''))

                text_lines = PDFGenerator.wrap_text(text, "Helvetica")
                for line in text_lines:
                    c.drawString(left_margin + 150, y_position, line)  # Adjust x position for value
                    y_position -= 15  # Adjust vertical position

            c.save()

            # Reset buffer position to start
            pdf_buffer.seek(0)

            # Return the BytesIO object containing the PDF
            return pdf_buffer

        except Exception as e:
            print(f"Error generating PDF: {e}")
            return None
        
    @staticmethod
    def create_ocinjury_pdf(data):
        try:
            # Generate PDF
            pdf_buffer = BytesIO()
            c = canvas.Canvas(pdf_buffer, pagesize=letter)

            # Constants for layout
            page_width, page_height = letter
            left_margin = 50  # Adjust as needed for left side margin
            logo_x = left_margin
            logo_y = page_height - 100  # Adjust as needed for logo position
            title_x = logo_x + 120  # Position the title to the right of the logo
            title_y = page_height - 80  # Adjust vertical position for the title

            # Logo image
            logo_path = os.getenv('PDF_LOGO_PATH')
            if logo_path:
                img = ImageReader(logo_path)
                img_width, img_height = img.getSize()
                c.drawImage(img, logo_x, logo_y, width=100, height=50, mask='auto')  # Use 'auto' to handle transparency

            # Title
            c.setFont("Helvetica-Bold", 20)  # Set title font size and style
            title_text = "San Bernardino County Incident Form"
            title_width = c.stringWidth(title_text)  # Get width of title text
            c.drawString(title_x, title_y, title_text)  # Draw title to the right of the logo

            # Initialize y_position for the first section
            y_position = title_y - 50  # Adjusted for initial spacing

            # Incident Number (first data item) - Adjusted to be on the same line
            c.setFont("Helvetica-Bold", 12)
            c.drawString(left_margin, y_position, "Incident Number:")
            c.setFont("Helvetica", 12)
            incident_number = str(data.get("Number", ""))
            incident_number_lines = PDFGenerator.wrap_text(incident_number, "Helvetica")

            # Displaying "Incident Number:" and its value on the same line
            c.drawString(left_margin + 150, y_position, incident_number)  # Adjust x position for value
            y_position -= 15  # Adjust vertical position

            # Draw thicker gray line after Incident Number section
            c.setStrokeColorRGB(0.7, 0.7, 0.7)  # Set gray color for the line
            c.setLineWidth(4)  # Increased line width
            c.line(left_margin, y_position - 10, page_width - 50, y_position - 10)  # Draw line below the Incident Number section

            # Employee Data (9 items)
            c.setFont("Helvetica-Bold", 12)  # Set subtitle font size and style to bold
            c.drawString(left_margin, y_position - 30, "Employee Data:")
            y_position -= 50  # Adjust y position for Employee Data section

            employee_data_items = [
                ("First", "First Name"), ("Last", "Last Name"), ("EmpNum", "Employee Number"),
                ("PayCntr", "Pay Center"), ("Position", "Position"), ("Yard", "Yard"), ("Date", "Date")
            ]
            print(data)
            for key, label in employee_data_items:
                c.setFont("Helvetica", 12)  # Set data item font size and style to bold
                c.drawString(left_margin + 20, y_position, f"{label}:")
                c.setFont("Helvetica", 12)  # Reset font to regular for data items
                if key == "Date":
                    date_value = str(data.get(key, ''))
                    formatted_date = datetime.strptime(date_value, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d')
                    text_lines = PDFGenerator.wrap_text(formatted_date, "Helvetica")
                #elif value == " ":
                #    value = data.get(key)
                #    text = str(value) if value else "None"
                else:
                    text = str(data.get(key, ''))
                    text_lines = PDFGenerator.wrap_text(text, "Helvetica")

                for line in text_lines:
                    c.drawString(left_margin + 150, y_position, line)  # Adjust x position for value
                    y_position -= 15  # Adjust vertical position

            # Draw thicker gray line after Employee Data section
            c.setStrokeColorRGB(0.7, 0.7, 0.7)  # Set gray color for the line
            c.setLineWidth(4)  # Increased line width
            c.line(left_margin, y_position - 10, page_width - 50, y_position - 10)  # Draw line below the Employee Data section


            # Evaluation Data (8 items)
            c.setFont("Helvetica-Bold", 12)  # Set subtitle font size and style to bold
            c.drawString(left_margin, y_position - 30, "Evaluation Data:")
            y_position -= 50  # Adjust y position for Evaluation Data section

            evaluation_data_items = [
                ("BODYCODE", "Body Code"), ("BCDESC", "Body Description"), ("INJCODE", "Injury Code"), 
                ("INJDESC", "Injury Descripition"), ("Comment", "Comment"), 
            ]
            for key, label in evaluation_data_items:
                c.setFont("Helvetica", 12)  # Set data item font size and style to bold
                c.drawString(left_margin + 20, y_position, f"{label}:")
                c.setFont("Helvetica", 12)  # Reset font to regular for data items

                # Special handling for "Snow" field to display "Yes" or "No"
                if key == "Snow":
                    text = "Yes" if data.get(key, False) else "No"
                else:
                    text = str(data.get(key, ''))

                text_lines = PDFGenerator.wrap_text(text, "Helvetica")
                for line in text_lines:
                    c.drawString(left_margin + 150, y_position, line)  # Adjust x position for value
                    y_position -= 15  # Adjust vertical position

            c.save()

            # Reset buffer position to start
            pdf_buffer.seek(0)

            # Return the BytesIO object containing the PDF
            return pdf_buffer

        except Exception as e:
            print(f"Error generating PDF: {e}")
            return None