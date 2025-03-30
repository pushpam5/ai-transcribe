import React from 'react';
import { HMSPrebuilt } from '@100mslive/roomkit-react';

interface CallViewProps {
  patientName: string;
  onEndCall: (recordingUrl: string) => void;
}

const CallView: React.FC<CallViewProps> = ({ patientName, onEndCall }) => {
  const options = {
    userName: patientName,
  };

  return (
    <div style={{ height: "100vh" }}>
      <HMSPrebuilt
        options={options} 
        roomCode="hdf-udxp-bxn" 
        onLeave={() => onEndCall(process.env.REACT_APP_RECORDING_URL || '')} 
      />
    </div>
  );
};

export default CallView; 