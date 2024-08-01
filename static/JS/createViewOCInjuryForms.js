import {showModalOCInjury} from './ShowModal.js';

function createViewOCInjuryForms() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
  
    const mainContentArea = document.createElement('div');
    mainContentArea.classList.add('main-content-area');
  
    mainContentArea.innerHTML = `
      <div class="contact-header">
        <h2><i class="fas fa-search"></i> View OCInjury Forms</h2>
      </div>
      <div class="message-area">
        <form id="viewOCInjuryForm">
          <fieldset>
            <legend>Select OCInjury Number:</legend>
            <label for="OCInjurynumber">OCInjury Number:</label>
            <select id="OCInjurynumber" name="OCInjurynumber">
              <option value="">Select an OCInjury number</option>
              <!-- Options will be populated via JavaScript -->
            </select>
            <button type="button" id="viewButton" class="view-btn"><i class="fas fa-eye"></i> View</button>
          </fieldset>
          <fieldset>
            <legend>Search OCInjury</legend>
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
          <div id="OCInjuryList" class="OCInjury-list"></div>
        </form>
      </div>
    `;
    mainContent.appendChild(mainContentArea);
  
    // Fetch OCInjury numbers to populate the select dropdown
    fetch('/api/OCInjury_numbers')
      .then(response => response.json())
      .then(data => {
        const OCInjurySelect = document.getElementById('OCInjurynumber');
        data.forEach(number => {
          const option = document.createElement('option');
          option.value = number;
          option.textContent = number;
          OCInjurySelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching OCInjury numbers:', error);
      });
  
    // Event listener for the View button
    const viewButton = document.getElementById('viewButton');
    viewButton.addEventListener('click', () => {
      const OCInjuryNumber = document.getElementById('OCInjurynumber').value;
      if (OCInjuryNumber) {
        fetch(`/api/OCInjury_details?number=${OCInjuryNumber}`)
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
          console.error('Error fetching OCInjury details:', error);
        });
      } else {
        alert('Please select an OCInjury number.');
      }
    });
  
    // Handle the Search form submission
    const viewOCInjuryForm = document.getElementById('viewOCInjuryForm');
    viewOCInjuryForm.addEventListener('submit', async function (event) {
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
        const response = await fetch('/api/search_OCInjuries', {
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
        const OCInjuryList = document.getElementById('OCInjuryList');
        OCInjuryList.innerHTML = '';
  
        if (data.length === 0) {
          OCInjuryList.innerHTML = '<p>No OCInjury found.</p>';
          return;
        }
  
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
  
        const headerRow = document.createElement('tr');
        const headers = ['OCInjury Number', 'Date', 'Employee ID','Employee'];
        headers.forEach(headerText => {
          const th = document.createElement('th');
          th.textContent = headerText;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
  
        data.forEach(OCInjury => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${OCInjury.Number}</td>
            <td>${formatDate(OCInjury.Date)}</td>
            <td>${OCInjury.EmpNum}</td>
            <td>${OCInjury.First} ${OCInjury.Last}</td>
          `;
  
          row.addEventListener('click', () => {
            showModalOCInjury(OCInjury.Number, OCInjury); // Pass the entire OCInjury object
          });
  
          tbody.appendChild(row);
        });
  
        table.appendChild(thead);
        table.appendChild(tbody);
        OCInjuryList.appendChild(table);
      } catch (error) {
        console.error('Error fetching OCInjury:', error);
      }
    });
  
    // Helper function to format the date
    function formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    }
  }

export default createViewOCInjuryForms;