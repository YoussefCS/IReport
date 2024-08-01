import {showModalIncident} from './ShowModal.js';

function createViewForms() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
  
    const mainContentArea = document.createElement('div');
    mainContentArea.classList.add('main-content-area');
  
    mainContentArea.innerHTML = `
      <div class="contact-header">
        <h2><i class="fas fa-search"></i> View Forms</h2>
      </div>
      <div class="message-area">
        <form id="viewIncidentForm">
          <fieldset>
            <legend>Select Incident Number:</legend>
            <label for="incidentnumber">Incident Number:</label>
            <select id="incidentnumber" name="incidentnumber">
              <option value="">Select an incident number</option>
              <!-- Options will be populated via JavaScript -->
            </select>
            <button type="button" id="viewButton" class="view-btn"><i class="fas fa-eye"></i> View</button>
          </fieldset>
          <fieldset>
            <legend>Search Incidents</legend>
            <label for="searchFirstName">First Name:</label>
            <input type="text" id="searchFirstName" name="searchFirstName">
  
            <label for="searchLastName">Last Name:</label>
            <input type="text" id="searchLastName" name="searchLastName">
  
            <label for="searchDate">Date:</label>
            <input type="date" id="searchDate" name="searchDate">
  
            <label for="searchEmpId">Employee ID:</label>
            <input type="text" id="searchEmpId" name="searchEmpId">
  
            <button type="submit" class="search-btn"><i class="fas fa-search"></i> Search</button>
          </fieldset>
          <div id="incidentList" class="incident-list"></div>
        </form>
      </div>
    `;
    mainContent.appendChild(mainContentArea);
  
    // Fetch incident numbers to populate the select dropdown
    fetch('/api/incident_numbers')
      .then(response => response.json())
      .then(data => {
        const incidentSelect = document.getElementById('incidentnumber');
        data.forEach(number => {
          const option = document.createElement('option');
          option.value = number;
          option.textContent = number;
          incidentSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching incident numbers:', error);
      });
  
    // Event listener for the View button
    const viewButton = document.getElementById('viewButton');
    viewButton.addEventListener('click', () => {
      const incidentNumber = document.getElementById('incidentnumber').value;
      if (incidentNumber) {
        fetch(`/api/incident_details?number=${incidentNumber}`)
        .then(response => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .then(blob => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        })
        .catch(error => {
          console.error('Error fetching incident details:', error);
        });
      } else {
        alert('Please select an incident number.');
      }
    });
  
    // Handle the Search form submission
    const viewIncidentForm = document.getElementById('viewIncidentForm');
    viewIncidentForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const firstName = document.getElementById('searchFirstName').value.trim();
      const lastName = document.getElementById('searchLastName').value.trim();
      const date = document.getElementById('searchDate').value;
      const empId = document.getElementById('searchEmpId').value.trim();
  
      const formData = {
        firstName: firstName,
        lastName: lastName,
        date: date,
        empId: empId
      };
  
      try {
        const response = await fetch('/api/search_incidents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const incidentList = document.getElementById('incidentList');
        incidentList.innerHTML = '';
  
        if (data.length === 0) {
          incidentList.innerHTML = '<p>No incidents found.</p>';
          return;
        }
  
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
  
        const headerRow = document.createElement('tr');
        const headers = ['Incident Number', 'Date', 'Employee ID','Employee'];
        headers.forEach(headerText => {
          const th = document.createElement('th');
          th.textContent = headerText;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
  
        data.forEach(incident => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${incident.Number}</td>
            <td>${formatDate(incident.Date)}</td>
            <td>${incident.EmpNum}</td>
            <td>${incident.First} ${incident.Last}</td>
          `;
  
          row.addEventListener('click', () => {
            showModalIncident(incident.Number, incident); // Pass the entire incident object
          });
  
          tbody.appendChild(row);
        });
  
        table.appendChild(thead);
        table.appendChild(tbody);
        incidentList.appendChild(table);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    });
  
    // Helper function to format the date
    function formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    }
  }

export default createViewForms;