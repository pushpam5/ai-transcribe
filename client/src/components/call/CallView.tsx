import React from 'react';
import { HMSPrebuilt } from '@100mslive/roomkit-react';
import { RECORDING_URL, ROOM_CODE } from '../../lib/constants';

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
        roomCode={ROOM_CODE} 
        onLeave={() => onEndCall(RECORDING_URL)} 
      />
    </div>
  );
};

export default CallView; 