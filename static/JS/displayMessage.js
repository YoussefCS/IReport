import createIncidentInputForm from './createIncidentInputForm.js';
import createViewForms from './createViewForms.js';
import createAccidentCodes from './createAccidentCodes.js';
import createVehicleTypeCodes from './createVehicleTypesCodes.js';
import createOCInjuryForm from './createOCInjuryForm.js';
import createViewOCInjuryForms from './createViewOCInjuryForms.js';
import createBodyCodes from './createBodyCodes.js';
import createInjuryCodes from './createInjuryCodes.js';


function displayMessage(message, actionType) {
    const mainContent = document.getElementById('main-content');
    let buttonLabel = '';
    let buttonFunction = null;

    switch (actionType) {
        case 'New Incident':
            buttonLabel = 'New Incident';
            buttonFunction = () => createIncidentInputForm(mainContent);
            break;
        case 'Search Incident':
            buttonLabel = 'Search Incident';
            buttonFunction = () => createViewForms();
            break;
        case 'Add Accident Code':
            buttonLabel = 'Add another Accident Code';
            buttonFunction = () => createAccidentCodes();
            break;
        case 'Add Vehicle':
            buttonLabel = 'Add another Vehicle';
            buttonFunction = () => createVehicleTypeCodes();
            break;
        case 'New OCInjury':
            buttonLabel = 'New OCInjury';
            buttonFunction = () => createOCInjuryForm(mainContent);
            break;
        case 'Search OCInjury':
            buttonLabel = 'Search OCInjury';
            buttonFunction = () => createViewOCInjuryForms();
            break;
        case 'Add Body':
            buttonLabel = 'Add another Body Code';
            buttonFunction = () => createBodyCodes();
            break;
        case 'Add Injury':
            buttonLabel = 'Add another Injury code';
            buttonFunction = () => createInjuryCodes();
            break;
        default:
            buttonLabel = 'Action';
            buttonFunction = () => console.log('No action defined');
    }

    mainContent.innerHTML = `
      <div class="success-message">
        <p>${message}</p>
        <button id="actionBtn" class="print-btn">${buttonLabel}</button>
      </div>
    `;

    document.getElementById('actionBtn').addEventListener('click', buttonFunction);
}


export default displayMessage;
