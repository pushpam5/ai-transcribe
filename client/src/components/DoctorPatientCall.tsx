import React, { useState } from 'react';
import '../styles/DoctorPatientCall.css';
import { API_URL } from '../lib/constants';
import PreCallView from './call/PreCallView';
import CallView from './call/CallView';
import LoadingView from './call/LoadingView';
import ResultsView from './call/ResultsView';

interface DoctorPatientCallProps {
  patientName?: string;
}

const DoctorPatientCall: React.FC<DoctorPatientCallProps> = ({
  patientName: initialPatientName = 'Patient',
}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [patientName, setPatientName] = useState(initialPatientName);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    transcription: string;
    soapSummary: string;
  } | null>(null);

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = async (recordingUrl: string) => {
    setIsCallActive(false);
    setIsLoading(true);
    
    // This will not be required once we have the webhook working
    // which is after deployment of the backend
    try {
      const response = await fetch(`${API_URL}/webhook/recordings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recordingUrl }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        console.error('Error processing recording:', data.error);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAppointment = () => {
    setResults(null);
    setPatientName(initialPatientName);
  };
  
  const renderContent = () => {
    if (isCallActive) {
      return (
        <CallView 
          patientName={patientName} 
          onEndCall={handleEndCall} 
        />
      );
    }
    
    if (isLoading) {
      return <LoadingView />;
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
      </div>
      
      <div className="call-status">
        {renderContent()}
      </div>
    </div>
  );
};

export default DoctorPatientCall; 