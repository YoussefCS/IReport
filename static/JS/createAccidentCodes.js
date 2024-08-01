import displayMessage from "./displayMessage.js";

function createAccidentCodes() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
  
    const mainContentArea = document.createElement('div');
    mainContentArea.classList.add('main-content-area');
  
    mainContentArea.innerHTML = `
      <div class="contact-header">
        <h2><i class="fas fa-car-crash"></i> Update Accident Codes</h2>
      </div>
      <div class="message-area">
        <form id="updateAccidentForm">
          <fieldset>
            <legend>Accident Code Details</legend>
            <label for="accidentCode">Accident Code:</label>
            <input type="text" id="accidentCode" name="ACCIDNTCODE" required class="input-padding">
            <label for="accidentDescription">Description:</label>
            <textarea id="accidentDescription" name="DESC" rows="4" required></textarea>
          </fieldset>
          <button type="submit" class="submit-btn"><i class="fas fa-check"></i> Update</button>
        </form>
      </div>
    `;
  
    mainContent.appendChild(mainContentArea);

   
    // Form submission handler
    const accidentForm = document.getElementById('updateAccidentForm');
    accidentForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(accidentForm);

      
        // Create new accident code
        fetch('/api/new_accidentcode', {
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
            displayMessage('accident code added successfully!','Add Accident Code');
          })
          .catch(error => {
            console.error('Error adding new incident:', error);
          });
    })
    
  }




export default createAccidentCodes;