import React, { useEffect, useState } from 'react';
import { API_URL } from '../lib/constants';
import '../styles/SessionList.css';
import SessionDetails from './SessionDetails';

interface Session {
  _id: string;
  sessionId: string;
  sessionStartedAt: string;
}

const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/sessions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        
        const data = await response.json();
        if (data.success) {
          setSessions(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch sessions');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleSession = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  if (loading) {
    return <div className="session-loading">Loading sessions...</div>;
  }

  if (error) {
    return <div className="session-error">Error: {error}</div>;
  }

  return (
    <div className="session-list-container">
      <h2>Past Sessions</h2>
      {sessions.length === 0 ? (
        <p className="no-sessions">No sessions found</p>
      ) : (
        <div className="session-list">
          {sessions.map((session) => (
            <div key={session._id} className="session-expansion-tile">
              <div 
                className="session-header"
                onClick={() => toggleSession(session.sessionId)}
              >
                <div className="session-info">
                  <span className="session-id">Session ID: {session.sessionId}</span>
                  <span className="session-date">Date: {formatDate(session.sessionStartedAt)}</span>
                </div>
                <div className="expansion-indicator">
                  {expandedSessionId === session.sessionId ? '▼' : '▶'}
                </div>
              </div>
              
              {expandedSessionId === session.sessionId && (
                <div className="session-details-expanded">
                  <SessionDetails 
                    sessionId={session.sessionId} 
                    onClose={() => setExpandedSessionId(null)} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionList; 