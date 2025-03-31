import React from 'react';

interface ResultsViewProps {
  results: {
    transcription: string;
    soapSummary: string;
  };
  onNewCall: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, onNewCall }) => {
  let parsedSoap = results.soapSummary;
  try {
    parsedSoap = JSON.parse(results.soapSummary);
  } catch (e) {
    console.log('SOAP note is not in JSON format, displaying the raw text');
  }
  
  return (
    <div className="results-container">
      <h2>Appointment Transcription and SOAP Note</h2>
      
      <div className="result-section">
        <h3>Transcription</h3>
        <div className="transcription-box">
          {results.transcription.split('\n').map((line, index) => (
            <div key={index}>
              {line}
              {index < results.transcription.split('\n').length - 1 && <br />}
            </div>
          ))}
        </div>
      </div>
      
      <div className="result-section">
        <h3>SOAP Note</h3>
        <div className="soap-box">
          {typeof parsedSoap === 'object' ? (
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
            <pre>{results.soapSummary}</pre>
          )}
        </div>
      </div>
      
      <button 
        className="new-call-button"
        onClick={onNewCall}
      >
        Start New Appointment
      </button>
    </div>
  );
};

export default ResultsView; 