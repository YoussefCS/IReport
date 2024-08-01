import displayMessage from "./displayMessage.js";

function createInjuryCodes() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
  
    const mainContentArea = document.createElement('div');
    mainContentArea.classList.add('main-content-area');
  
    mainContentArea.innerHTML = `
      <div class="contact-header">
        <h2><i class="fa-solid fa-crutch"></i> Update Injury Codes</h2>
      </div>
      <div class="message-area">
        <form id="updateInjuryForm">
          <fieldset>
            <legend>Injury Code Details</legend>
            <label for="Injury">Injury Type:</label>
            <input type="text" id="Injury" name="INJURYCD" required class="input-padding">
            <label for="InjuryDescription">Description:</label>
            <textarea id="InjuryDescription" name="INJDESC" rows="4" required></textarea>
          </fieldset>
          <button type="submit" class="submit-btn"><i class="fas fa-check"></i> Update</button>
        </form>
      </div>
    `;
  
    mainContent.appendChild(mainContentArea);
  

    // Form submission handler
    const InjuryForm = document.getElementById('updateInjuryForm');
    InjuryForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(InjuryForm);
      console.log(formData)

      
        // Create new Injury
        fetch('/api/new_Injury', {
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
            displayMessage('Injury added successfully!','Add Injury');
          })
          .catch(error => {
            console.error('Error adding new Injury:', error);
          });
    })
  }  

export default createInjuryCodes;