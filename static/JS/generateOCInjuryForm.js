function generateOCInjuryForm(OCInjuryData = null) {
    var innerHTML = `
      <div class="main-content-area">
        <div class="contact-header">
          <h2><i class="fas fa-${OCInjuryData ? 'edit' : 'plus'}"></i> OCInjury ${OCInjuryData ? 'Edit' : 'Input'} Form</h2>
        </div>
        <div class="message-area">
          <form id="OCInjuryForm">
            <fieldset>
              <legend>OCInjury Number:</legend>
              <input type="text" id="OCInjuryNumber" name="OCInjuryNumber" ${OCInjuryData ? `value="${OCInjuryData.Number}" readonly` : 'style="display: none;"'}>
            </fieldset>
            <fieldset>
              <legend>Employee Data</legend>
              <label for="empNum">Employee Number:</label>
              <input type="text" id="empNum" name="EMPNUM" value="${OCInjuryData?.EmpNum || ''}" required>
              <label for="firstName">First Name:</label>
              <input type="text" id="firstName" name="FIRST" value="${OCInjuryData?.First || ''}" required>
              <label for="lastName">Last Name:</label>
              <input type="text" id="lastName" name="LAST" value="${OCInjuryData?.Last || ''}" required>
              <label for="yard">Yard:</label>
              <input type="text" id="yard" name="YARD" value="${OCInjuryData?.Yard || ''}" >
              <label for="incidentDate">Incident Date:</label>
              <input type="date" id="incidentDate" name="DATE" value="${OCInjuryData ? new Date(OCInjuryData.Date).toISOString().split('T')[0] : ''}" required>
              <label for="payCntr">Pay Center:</label>
              <input type="text" id="payCntr" name="PAYCNTR" value="${OCInjuryData?.PayCntr || ''}" >
              <label for="position">Position:</label>
              <input type="text" id="position" name="POSITION" value="${OCInjuryData?.Position || ''}" >          
              <label for="code">Body Code:</label>
              <select id="bodycode" name="BODYCODE" >
                <option value="">${!OCInjuryData || !OCInjuryData.BODYCODE ? '' : `${OCInjuryData.BODYCODE} - ${OCInjuryData.BCDESC}`}</option>
              </select>
              <label for="bodycode">Body Description:</label>
              <input type="text" id="bodyDESC" name="BCDESC" value="${OCInjuryData?.BCDESC || ''}" >
              <label for="code">Injury Code:</label>
              <select id="injurycode" name="INJCODE" >
                <option value="">${!OCInjuryData || !OCInjuryData.INJCODE ? '' : `${OCInjuryData.INJCODE} - ${OCInjuryData.INJDESC}`}</option>
              </select>
              <label for="injurycode">Injury Description:</label>
              <input type="text" id="injuryDESC" name="INJDESC" value="${OCInjuryData?.INJDESC || ''}" >
              <label for="code">Comments:</label>
              <textarea id="comment" name="COMMENT" rows="4" required>${OCInjuryData?.Comment || ''}</textarea>
            <button type="submit" class="submit-btn"><i class="fas fa-check"></i> ${OCInjuryData ? 'Update' : 'Submit'}</button>
          </form>
        </div>
      </div>
    `
    return innerHTML
  }
  
  export default generateOCInjuryForm;
  