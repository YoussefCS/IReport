import createIncidentInputForm from './createIncidentInputForm.js'
import createOCInjuryForm from './createOCInjuryForm.js';

function showModalIncident(incidentNumber, incidentData) {
    const mainContent = document.getElementById('main-content');
    // HTML structure for the modal
    const modalHTML = `
    <div id="modal" class="modal">
        <div class="modal-content">
        <div class="modal-header">
            <span id="incidentNumberDisplay"></span>
            <span class="close" id="closeModal">&times;</span>
        </div>
        <div class="modal-buttons">
            <button id="editButton" class="modal-button">Edit</button>
            <button id="printButton" class="modal-button">Print</button>
        </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('modal');
    const incidentNumberDisplay = document.getElementById('incidentNumberDisplay');
    const closeModal = document.getElementById('closeModal');
    const editButton = document.getElementById('editButton');
    const printButton = document.getElementById('printButton');
    incidentNumberDisplay.textContent = `Incident Number: ${incidentNumber}`;
    modal.style.display = 'block';

    printButton.onclick = () => {
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
    };

    editButton.onclick = () => {
        console.log(`Edit clicked for incident number ${incidentNumber}`);
        createIncidentInputForm(mainContent, incidentData); // Pass the incident data to the form for editing
        console.log(incidentData);
        modal.style.display = 'none';
    };
    // Close the modal when clicking on the "x" button
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
        modal.style.display = 'none';
        }
    };
}

function showModalOCInjury(OCInjuryNumber, OCInjuryData) {
    const mainContent = document.getElementById('main-content');
    // HTML structure for the modal
    const modalHTML = `
    <div id="modal" class="modal">
        <div class="modal-content">
        <div class="modal-header">
            <span id="OCInjuryNumberDisplay"></span>
            <span class="close" id="closeModal">&times;</span>
        </div>
        <div class="modal-buttons">
            <button id="editButton" class="modal-button">Edit</button>
            <button id="printButton" class="modal-button">Print</button>
        </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('modal');
    const OCInjuryNumberDisplay = document.getElementById('OCInjuryNumberDisplay');
    const closeModal = document.getElementById('closeModal');
    const editButton = document.getElementById('editButton');
    const printButton = document.getElementById('printButton');
    OCInjuryNumberDisplay.textContent = `OCInjury Number: ${OCInjuryNumber}`;
    modal.style.display = 'block';

    printButton.onclick = () => {
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
    };

    editButton.onclick = () => {
        console.log(`Edit clicked for OCInjury number ${OCInjuryNumber}`);
        createOCInjuryForm(mainContent, OCInjuryData); // Pass the incident data to the form for editing
        console.log(OCInjuryData);
        modal.style.display = 'none';
    };
    // Close the modal when clicking on the "x" button
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
        modal.style.display = 'none';
        }
    };
}

export { showModalIncident, showModalOCInjury };
