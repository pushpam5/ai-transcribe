import React, { useEffect, useState } from 'react';
import { API_URL } from '../lib/constants';
import '../styles/SessionDetails.css';

interface SessionDetailsProps {
  sessionId: string;
  onClose: () => void;
}

interface SessionData {
  _id: string;
  sessionId: string;
  sessionStartedAt: string;
  recordingUrl?: string;
  transcription?: string;
  soapNote?: string;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ sessionId, onClose }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedSoap, setParsedSoap] = useState<any>(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        setLoading(true);
        console.log(sessionId);
        const response = await fetch(`${API_URL}/api/sessions/${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch session details');
        }
        
        const data = await response.json();
        if (data.success) {
          setSessionData(data.data);
          
          if (data.data.soapNote) {
            try {
              setParsedSoap(JSON.parse(data.data.soapNote));
            } catch (e) {
              console.log('SOAP note is not in JSON format');
              setParsedSoap(null);
            }
          }
        } else {
          throw new Error(data.message || 'Failed to fetch session details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="session-details-loading">
        <div className="loading-spinner"></div>
        <h3>Loading session details...</h3>
      </div>
    );
  }

  if (error) {
    return <div className="session-details-error">Error: {error}</div>;
  }

  if (!sessionData) {
    return <div className="session-details-error">No session data found</div>;
  }

  return (
    <div className="session-details">
      <div className="session-details-header">
        <h2>Session Details</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      
      <div className="session-details-info">
        <p><strong>Session ID:</strong> {sessionData.sessionId}</p>
        <p><strong>Date:</strong> {formatDate(sessionData.sessionStartedAt)}</p>
      </div>
      
      {sessionData.transcription && (
        <div className="result-section">
          <h3>Transcription</h3>
          <div className="transcription-box">
            {sessionData.transcription.split('\n').map((line, index) => (
              <div key={index}>
                {line}
                {index < sessionData.transcription!.split('\n').length - 1 && <br />}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {sessionData.soapNote && (
        <div className="result-section">
          <h3>SOAP Note</h3>
          <div className="soap-box">
            {parsedSoap ? (
              <div className="soap-sections">
                {Object.entries(parsedSoap).map(([section, data]: [string, any]) => (
                  <div key={section} className="soap-section">
                    <h4>{section.charAt(0).toUpperCase() + section.slice(1)}</h4>
                    <div className="soap-content">
                      {data.content}
                    </div>
                    
                    {data.references && data.references.length > 0 && (
                      <div className="soap-references">
                        <h5>References:</h5>
                        <ul>
                          {data.references.map((ref: any, i: number) => (
                            <li key={i}>{ref.text}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <pre>{sessionData.soapNote}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetails; 