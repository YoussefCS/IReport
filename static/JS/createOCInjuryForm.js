import generateOCInjuryForm from './generateOCInjuryForm.js';
import displayMessage from './displayMessage.js';

function createOCInjuryForm(mainContent, OCInjuryData = null) {
  // Render the form in the main content area
  mainContent.innerHTML = generateOCInjuryForm(OCInjuryData);

  // Fetch body codes and populate the dropdown
  fetch('/api/body_codes')
    .then(response => response.json())
    .then(data => {
      const bodySelect = document.getElementById('bodycode');
      const bodyMap = new Map();

      if (!OCInjuryData || !OCInjuryData.BODYCODE) {
        // Add a "None" option if OCInjuryData.BODYCODE is empty
        const noneOption = document.createElement('option');
        noneOption.value = '';
        noneOption.textContent = 'None';
        bodySelect.appendChild(noneOption);
      }

      data.forEach(code => {
        const bodyCode = String(code.BODYCD);
        bodyMap.set(bodyCode, code.BCDESC);
        const option = document.createElement('option');
        option.value = code.BODYCD;
        option.textContent = `${code.BODYCD} - ${code.BCDESC}`; // Display both code and description
        // Select the option if it matches OCInjuryData.BODYCODE
        if (OCInjuryData && code.BODYCD === OCInjuryData.BODYCODE) {
          option.selected = true;
          document.getElementById('bodyDESC').value = code.BCDESC;  // Set the description
        }
        bodySelect.appendChild(option);

      });

      // Event listener to update description when a new body type is selected
      bodySelect.addEventListener('change', function() {
        const selectedDesc = bodyMap.get(this.value);
        document.getElementById('bodyDESC').value = selectedDesc || '';

        // Update dropdown to show only the selected type
        for (const option of bodySelect.options) {
          if (option.value === this.value) {
            option.textContent = this.value;  // Show only the type
          } else {
            option.textContent = `${option.value} - ${bodyMap.get(option.value)}`;
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching body types:', error);
    });

  // Fetch accident codes and populate the dropdown
  fetch('/api/injury_codes')
    .then(response => response.json())
    .then(data => {
      const injurySelect = document.getElementById('injurycode');
      const injuryMap = new Map();

      if (!OCInjuryData || !OCInjuryData.INJCODE) {
        // Add a "None" option if OCInjuryData.INJURYCODE is empty
        const noneOption = document.createElement('option');
        noneOption.value = '';
        noneOption.textContent = 'None';
        injurySelect.appendChild(noneOption);
      }

      data.forEach(code => {
        const injuryCode = String(code.INJURYCD);
        injuryMap.set(injuryCode, code.INJDESC);
        const option = document.createElement('option');
        option.value = code.INJURYCD;
        option.textContent = `${code.INJURYCD} - ${code.INJDESC}`; // Display both code and description

        // Select the option if it matches OCInjuryData.INJURYCODE
        if (OCInjuryData && code.INJURYCD === OCInjuryData.INJCODE) {
          option.selected = true;
          injDescInput.value = code.INJDESC;  // Set the description
        }
        injurySelect.appendChild(option);

      });

      // Event listener to update description when a new injury code is selected
      injurySelect.addEventListener('change', function() {
        const selectedDesc = injuryMap.get(this.value);
        document.getElementById('injuryDESC').value = selectedDesc || '';

        // Update dropdown to show only the selected type
        for (const option of injurySelect.options) {
          if (option.value === this.value) {
            option.textContent = this.value;  // Show only the type
          } else {
            option.textContent = `${option.value} - ${injuryMap.get(option.value)}`;
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching injury codes:', error);
    });

  // Form submission handler
  const ocInjuryForm = document.getElementById('OCInjuryForm');
  ocInjuryForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(ocInjuryForm);

    if (OCInjuryData) {
      // Update existing OCInjury
      formData.append('Number', OCInjuryData.Number);
      fetch('/api/update_OCInjury', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.success) {
            fetch(`/api/OCInjury_details?number=${OCInjuryData.Number}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('OCInjury details not found');
                }
                return response.blob();
              })
              .then(blob => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                displayMessage('OCInjury updated successfully!', 'Search OCInjury');
              })
              .catch(error => {
                console.error('Error fetching or opening PDF:', error);
              });
          } else {
            alert('Error updating OCInjury.');
          }
        })
        .catch(error => {
          console.error('Error updating OCInjury:', error);
        });
    } else {
      // Create new OCInjury
      fetch('/api/new_OCInjury', {
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
            fetch(`/api/OCInjury_details?number=${data}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('OCInjury details not found');
                }
                return response.blob();
              })
              .then(blob => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                displayMessage('OCInjury submitted successfully!', 'New OCInjury');
              })
              .catch(error => {
                console.error('Error fetching or opening PDF:', error);
              });
          } else {
            console.error('Error: No OCInjury number received');
          }
        })
        .catch(error => {
          console.error('Error adding new OCInjury:', error);
        });
    }
  });
}

export default createOCInjuryForm;
