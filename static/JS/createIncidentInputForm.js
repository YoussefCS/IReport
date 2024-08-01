import generateIncidentInputForm from './generateIncidentInputForm.js';
import displayMessage from './displayMessage.js';

function createIncidentInputForm(mainContent, incidentData = null) {
  mainContent.innerHTML = generateIncidentInputForm(incidentData);

  // Fetch vehicle types and populate the dropdown
  fetch('/api/vehicle_codes')
    .then(response => response.json())
    .then(data => {
      const vehTypeSelect = document.getElementById('vehType');
      const vehicleTypeMap = new Map();
      
      if (!incidentData || !incidentData.VehType) {
        const noneOption = document.createElement('option');
        noneOption.value = '';
        noneOption.textContent = 'None';
        vehTypeSelect.appendChild(noneOption);
      }
      
      data.forEach(code => {
        vehicleTypeMap.set(code.VEHTYPE, code.VEHDISC);
        const option = document.createElement('option');
        option.value = code.VEHTYPE;
        option.textContent = `${code.VEHTYPE} - ${code.VEHDISC}`;  // Show both type and description
        if (incidentData && code.VEHTYPE === incidentData.VehType) {
          option.selected = true;
          document.getElementById('vehDisc').value = code.VEHDISC;  // Set the description
        }
        vehTypeSelect.appendChild(option);
      });
      
      // Set associated details if a vehicle type is selected
      vehTypeSelect.addEventListener('change', function() {
        const selectedDesc = vehicleTypeMap.get(this.value);
        document.getElementById('vehDisc').value = selectedDesc || '';
        
        // Update dropdown to show only the selected type
        for (const option of vehTypeSelect.options) {
          if (option.value === this.value) {
            option.textContent = this.value;  // Show only the type
          } else {
            option.textContent = `${option.value} - ${vehicleTypeMap.get(option.value)}`;
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching vehicle types:', error);
    });

  // Fetch accident codes and populate the dropdown
  fetch('/api/accident_codes')
    .then(response => response.json())
    .then(data => {
      const codeSelect = document.getElementById('code');
      if (!incidentData || !incidentData.AccidntCode) {
        const noneOption = document.createElement('option');
        noneOption.value = '';
        noneOption.textContent = 'None';
        codeSelect.appendChild(noneOption);
      }
      data.forEach(code => {
        const option = document.createElement('option');
        option.value = code.ACCIDENTCODE;
        option.textContent = `${code.ACCIDENTCODE} - ${code.DESC}`;
        if (incidentData && code.ACCIDENTCODE === incidentData.AccidntCode) {
          option.selected = true;
        }
        codeSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching accident codes:', error);
    });

      /// Fetch vehicle numbers and populate the dropdown
  fetch('/api/vehicle_numbers')
  .then(response => response.json())
  .then(data => {
    const vehNumSelect = document.getElementById('vehNum');
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Choose a vehicle number';
    vehNumSelect.appendChild(defaultOption);

    // Create a mapping of vehicle numbers to descriptions
    const vehicleMap = new Map();
    data.forEach(vehicle => {
      const trimmedVehNum = vehicle.VEHNUM.trim();  // Trim VEHNUM here
      vehicleMap.set(trimmedVehNum, vehicle.VEHDISC);
      const option = document.createElement('option');
      option.value = trimmedVehNum;
      option.textContent = trimmedVehNum;  // Only display trimmed VEHNUM
      if (incidentData && trimmedVehNum === incidentData.VehNum) {
        option.selected = true;
        document.getElementById('vehDisc').value = vehicle.VEHDISC.trim();  // Set the description with trim
      }
      vehNumSelect.appendChild(option);
    });

  // Set associated details if a vehicle number is selected
  vehNumSelect.addEventListener('change', function() {
    const selectedVehicleDesc = vehicleMap.get(this.value)?.trim();  // Trim spaces
    document.getElementById('vehDisc').value = selectedVehicleDesc || '';
    const selectedVehicle = data.find(vehicle => vehicle.VEHNUM.trim() === this.value);
    if (selectedVehicle) {
      document.getElementById('vehYear').value = selectedVehicle.VEHYR;
      document.getElementById('vehMake').value = selectedVehicle.VEHMAKE.trim();  // Trim spaces
    } else {
      document.getElementById('vehYear').value = '';
      document.getElementById('vehMake').value = '';
    }
  });
})
.catch(error => {
  console.error('Error fetching vehicle numbers:', error);
});


  // Populate the year dropdowns with the correct value
  const currentYear = new Date().getFullYear();
  createYearDropdown(document.getElementById('year'), incidentData ? incidentData.FY : currentYear);
  
  function createYearDropdown(element, selectedYear) {
    for (let year = 1900; year <= 2100; year++) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      if (year === Number(selectedYear)) {
        option.selected = true;
      }
      element.appendChild(option);
    }
  }

  // Form submission handler
  const incidentForm = document.getElementById('incidentForm');
  incidentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(incidentForm);


    if (incidentData) {
      // Update existing incident
      formData.append('Number', incidentData.Number);
      fetch('/api/update_incident', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.success) {
            fetch(`/api/incident_details?number=${incidentData.Number}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Incident details not found');
                }
                return response.blob();
              })
              .then(blob => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                displayMessage('Incident updated successfully!', 'Search Incident');
              })
              .catch(error => {
                console.error('Error fetching or opening PDF:', error);
              });
          } else {
            alert('Error updating incident.');
          }
        })
        .catch(error => {
          console.error('Error updating incident:', error);
        });
    } else {
      // Create new incident
      fetch('/api/new_incident', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            fetch(`/api/incident_details?number=${data}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Incident details not found');
                }
                return response.blob();
              })
              .then(blob => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                displayMessage('Incident submitted successfully!', 'New Incident');
              })
              .catch(error => {
                console.error('Error fetching or opening PDF:', error);
              });
          } else {
            console.error('Error: No incident number received');
          }
        })
        .catch(error => {
          console.error('Error adding new incident:', error);
        });
    }
  });
}

export default createIncidentInputForm;
