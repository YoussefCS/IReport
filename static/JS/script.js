import createIncidentInputForm from './createIncidentInputForm.js'
import createViewForms from './createViewForms.js'
import createAccidentCodes from './createAccidentCodes.js'
import createVehicleTypeCodes from './createVehicleTypesCodes.js'
import createOCInjuryForm from './createOCInjuryForm.js'
import createViewOCInjuryForms from './createViewOCInjuryForms.js'
import createBodyCodes from './createBodyCodes.js'
import createInjuryCodes from './createInjuryCodes.js'

document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.menu .contact-item a');
  const mainContent = document.getElementById('main-content');

  // Event listener for menu items
  menuItems.forEach(item => {
    item.addEventListener('click', function (event) {
      event.preventDefault();
      const section = this.getAttribute('data-section');

      switch (section) {
        case 'inputForm':
          createIncidentInputForm(mainContent); // Pass mainContent
          break;
        case 'viewForms':
          createViewForms()
          break;
        case 'updateAccidentCodes':
          createAccidentCodes();
          break;
        case 'updateVehicleCodes':
          createVehicleTypeCodes();
          break;
        case 'OCInjury':
          createOCInjuryForm(mainContent);
          break;
        case 'viewOCInjuryForms':
          createViewOCInjuryForms();
          break;
        case 'updateBodyCodes':
          createBodyCodes();
          break;
        case 'updateInjuryCodes':
          createInjuryCodes();
          break;
        default:
          mainContent.innerHTML = `
            <div class="message-area">
              <div class="contact-header">
                <h2>${this.textContent}</h2>
              </div>
              <!-- Placeholder content for other menu items -->
            </div>
          `;
          break;
      }
    });
  });
});
