function generateIncidentInputForm(incidentData = null) {
  var innerHTML = `
    <div class="main-content-area">
      <div class="contact-header">
        <h2><i class="fas fa-${incidentData ? 'edit' : 'plus'}"></i> Incident ${incidentData ? 'Edit' : 'Input'} Form</h2>
      </div>
      <div class="message-area">
        <form id="incidentForm">
          <fieldset>
            <legend>Incident Number:</legend>
            <input type="text" id="incidentNumber" name="incidentNumber" ${incidentData ? `value="${incidentData.Number}" readonly` : 'style="display: none;"'}>
          </fieldset>
          <fieldset>
            <legend>Employee Data</legend>
            <label for="empNum">Employee Number:</label>
            <input type="text" id="empNum" name="EMPNUM" value="${incidentData?.EmpNum || ''}" required>
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="FIRST" value="${incidentData?.First || ''}" required>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="LAST" value="${incidentData?.Last || ''}" required>
            <label for="yard">Yard:</label>
            <input type="text" id="yard" name="YARD" value="${incidentData?.Yard || ''}" required>
            <label for="incidentDate">Incident Date:</label>
            <input type="date" id="incidentDate" name="DATE" value="${incidentData ? new Date(incidentData.Date).toISOString().split('T')[0] : ''}" required>
            <label for="payCntr">Pay Center:</label>
            <input type="text" id="payCntr" name="PAYCNTR" value="${incidentData?.PayCntr || ''}" >
            <label for="position">Position:</label>
            <input type="text" id="position" name="POSITION" value="${incidentData?.Position || ''}" >
            <label for="deptNum">Department Number:</label>
            <input type="text" id="deptNum" name="DEPTNUM" value="${incidentData?.DeptNum || ''}" >
            <label for="fund">Fund:</label>
            <input type="text" id="fund" name="FUND" value="${incidentData?.Fund || ''}" >
          </fieldset>
          <fieldset>
            <legend>Vehicle Data</legend>
            <label for="vehNum">Vehicle Number:</label>
            <select id="vehNum" name="VEHNUM" required>
              <option value="">${!incidentData || !incidentData.VehNum ? '' : `${incidentData.VehNum}`}</option>
            </select>
            <label for="vehYear">Vehicle Year:</label>
            <input type="text" id="vehYear" name="VEHYR" value="${incidentData?.VehYr || ''}" required>
            <label for="vehMake">Vehicle Make:</label>
            <input type="text" id="vehMake" name="VEHMAKE" value="${incidentData?.VehMake || ''}" required>
            <label for="vehType">Vehicle Type:</label>
            <select id="vehType" name="VEHTYPE" >
              <option value="">${!incidentData || !incidentData.VehType ? '' : `${incidentData.VehType} - ${incidentData.VehDisc}`}</option>
            </select>
            <label for="vehDisc">Vehicle Description:</label>
            <input type="text" id="vehDisc" name="VEHDISC" value="${incidentData?.VehDisc || ''}" required>
          </fieldset>
          <fieldset>
            <legend>Evaluation Data</legend>
            <label for="code">Accident Code:</label>
            <select id="code" name="ACCIDNTCODE" required>
              <option value="">${!incidentData || !incidentData.AccidntCode ? '' : `${incidentData.AccidntCode} - ${incidentData.Desc}`}</option>
            </select>
            <label for="prevent">Prevent:</label>
            <input type="text" id="prevent" name="PREVENT" value="${incidentData?.Prevent || ''}" >
            <label for="year">Fiscal Year:</label>
            <select id="year" name="FY" required>
              <!-- Year options will be populated via JavaScript -->
            </select>
            <label for="description">Description:</label>
            <textarea id="description" name="DESC" rows="4">${incidentData?.Desc || ''}</textarea>
            <label for="comments">Comments:</label>
            <textarea id="comments" name="COMMENTS" rows="4" >${incidentData?.Comments || ''}</textarea>
            <label for="sarb">SARB:</label>
            <select id="stCommittee" name="SARB" >
              <option value="">Select an option</option>
              <option value="P" ${incidentData && incidentData.SARB === 'P' ? 'selected' : ''}>P</option>
              <option value="NP" ${incidentData && incidentData.SARB === 'NP' ? 'selected' : ''}>NP</option>
            </select>
            <label for="safetyCommittee">Safety Committee:</label>
            <select id="stCommittee" name="SAFETYCOM" >
              <option value="">Select an option</option>
              <option value="P" ${incidentData && incidentData.SafetyCom === 'P' ? 'selected' : ''}>P</option>
              <option value="NP" ${incidentData && incidentData.SafetyCom === 'NP' ? 'selected' : ''}>NP</option>
            </select>
            <label for="stCommittee">ST Committee:</label>
            <select id="stCommittee" name="SICOM" >
              <option value="">Select an option</option>
              <option value="P" ${incidentData && incidentData.SIcom === 'P' ? 'selected' : ''}>P</option>
              <option value="NP" ${incidentData && incidentData.SIcom === 'NP' ? 'selected' : ''}>NP</option>
            </select>
            <label for="snowRelated">Snow Related:</label>
            <input type="checkbox" id="snowRelated" name="SNOW" value="1" ${incidentData && incidentData.Snow ? 'checked' : ''}>
            <!-- Add more fields as needed -->
          </fieldset>
          <button type="submit" class="submit-btn"><i class="fas fa-check"></i> ${incidentData ? 'Update' : 'Submit'}</button>
        </form>
      </div>
    </div>
  `
  return innerHTML;
}

export default generateIncidentInputForm;
