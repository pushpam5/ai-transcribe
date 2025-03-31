import React, { useState } from 'react';
import '../styles/DoctorPatientCall.css';
import PreCallView from './call/PreCallView';
import CallView from './call/CallView';
import ResultsView from './call/ResultsView';
import SessionList from './SessionList';

interface DoctorPatientCallProps {
  patientName?: string;
}

const DoctorPatientCall: React.FC<DoctorPatientCallProps> = ({
  patientName: initialPatientName = 'Patient',
}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [patientName, setPatientName] = useState(initialPatientName);
  const [results, setResults] = useState<{
    transcription: string;
    soapSummary: string;
  } | null>(null);
  const [viewSessions, setViewSessions] = useState(false);

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = async (recordingUrl: string) => {
    setIsCallActive(false);
  };

  const resetAppointment = () => {
    setResults(null);
    setPatientName(initialPatientName);
  };
  
  const renderContent = () => {
    if (viewSessions) {
      return <SessionList />;
    }
    
    if (isCallActive) {
      return (
        <CallView 
          patientName={patientName} 
          onEndCall={handleEndCall} 
        />
      );
    }
    
    if (results) {
      return (
        <ResultsView 
          results={results} 
          onNewCall={resetAppointment} 
        />
      );
    }
    
    return (
      <PreCallView
        patientName={patientName}
        setPatientName={setPatientName}
        onStartCall={handleStartCall}
      />
    );
  };
  
  return (
    <div className="doctor-patient-call">
      <div className="call-header">
        <h1>Consultation</h1>
        <div className="header-actions">
          <button 
            className="view-sessions-button"
            onClick={() => setViewSessions(!viewSessions)}
          >
            {viewSessions ? 'New Consultation' : 'View Past Sessions'}
          </button>
        </div>
      </div>
      
      <div className="call-status">
        {renderContent()}
      </div>
    </div>
  );
};

export default DoctorPatientCall; 