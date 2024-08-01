import displayMessage from "./displayMessage.js";

function createVehicleTypeCodes() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
  
    const mainContentArea = document.createElement('div');
    mainContentArea.classList.add('main-content-area');
  
    mainContentArea.innerHTML = `
      <div class="contact-header">
        <h2><i class="fas fa-truck"></i> Update Vehicle Codes</h2>
      </div>
      <div class="message-area">
        <form id="updateVehicleForm">
          <fieldset>
            <legend>Vehicle Code Details</legend>
            <label for="vehicleType">Vehicle Type:</label>
            <input type="text" id="vehicleType" name="VEHTYPE" required class="input-padding">
            <label for="vehicleDescription">Description:</label>
            <textarea id="vehicleDescription" name="VEHDISC" rows="4" required></textarea>
          </fieldset>
          <button type="submit" class="submit-btn"><i class="fas fa-check"></i> Update</button>
        </form>
      </div>
    `;
  
    mainContent.appendChild(mainContentArea);
  

    // Form submission handler
    const vehicleForm = document.getElementById('updateVehicleForm');
    vehicleForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(vehicleForm);
      console.log(formData)

      
        // Create new vehicle
        fetch('/api/new_vehicle', {
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
            console.log(data);
            displayMessage('vehicle added successfully!','Add Vehicle');
          })
          .catch(error => {
            console.error('Error adding new vehicle:', error);
          });
    })
  }  

export default createVehicleTypeCodes;