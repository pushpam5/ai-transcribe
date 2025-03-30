import React from 'react';

interface PreCallViewProps {
  patientName: string;
  setPatientName: (name: string) => void;
  onStartCall: () => void;
}

const PreCallView: React.FC<PreCallViewProps> = ({ 
  patientName, 
  setPatientName, 
  onStartCall 
}) => {
  const isStartButtonEnabled = patientName.trim() !== '';
  
  return (
    <div className="pre-call">
      <div className="call-description">
        <h2>Ready to Have a Call with a Doctor?</h2>
        <p>Consult the doctor by tapping the start button below.</p>
        <p className='note'>NOTE: The recording will automatically begin once the call starts.</p>
      </div>
      
      <div className="user-inputs">
        <div className="input-group">
          <label htmlFor="patientName">Patient's Name</label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient's name"
          />
        </div>
      </div>
      
      <button 
        className={`start-call-button ${!isStartButtonEnabled ? 'disabled' : ''}`}
        onClick={onStartCall}
        disabled={!isStartButtonEnabled}
      >
        Start Call
      </button>
      
      {!isStartButtonEnabled && (
        <p className="validation-message">Please enter patient name to start the call</p>
      )}
    </div>
  );
};

export default PreCallView; 