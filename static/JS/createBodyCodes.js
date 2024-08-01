import displayMessage from "./displayMessage.js";

function createBodyCodes() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
  
    const mainContentArea = document.createElement('div');
    mainContentArea.classList.add('main-content-area');
  
    mainContentArea.innerHTML = `
      <div class="contact-header">
        <h2><i class="fa-solid fa-child"></i> Update Body Codes</h2>
      </div>
      <div class="message-area">
        <form id="updateBodyForm">
          <fieldset>
            <legend>Body Code Details</legend>
            <label for="Body">Body Part:</label>
            <input type="text" id="Body" name="BODYCD" required class="input-padding">
            <label for="BodyDescription">Description:</label>
            <textarea id="BodyDescription" name="BCDESC" rows="4" required></textarea>
          </fieldset>
          <button type="submit" class="submit-btn"><i class="fas fa-check"></i> Update</button>
        </form>
      </div>
    `;
  
    mainContent.appendChild(mainContentArea);
  

    // Form submission handler
    const BodyForm = document.getElementById('updateBodyForm');
    BodyForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(BodyForm);
      console.log(formData)

      
        // Create new body
        fetch('/api/new_body', {
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
            displayMessage('Body added successfully!','Add Body');
          })
          .catch(error => {
            console.error('Error adding new body:', error);
          });
    })
  }  

export default createBodyCodes;