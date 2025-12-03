import { useState } from 'react';
import './App.css';
import AgenticFramework from './components/AgenticFramework';

function App() {
  const [appMode, setAppMode] = useState('selector'); // 'selector', 'agentic', 'insurance'
  const [page, setPage] = useState('landing');
  const [message, setMessage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Add selected country to the data
    data.country = selectedCountry;

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.error) {
        setMessage(`Your details are already updated in the past. Unique ID: ${result.uniqueId}`);
      } else {
        setMessage(`Your record is updated. Please note your unique ID: ${result.uniqueId}`);
      }

      setPage('message');
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Add selected country to the data
    data.country = selectedCountry;

    try {
      const response = await fetch('http://localhost:5000/insurance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.error) {
        alert(result.error);
      } else {
        alert(`Insurance Premium: ${result.insurancePremium}`);
      }
    } catch (error) {
      console.error('Error fetching insurance premium:', error);
    }
  };

  // Application Selector
  if (appMode === 'selector') {
    return (
      <div className="app-selector">
        <h1>🚀 POC Agent Platform</h1>
        <p className="selector-subtitle">Choose an application to explore</p>
        
        <div className="app-cards">
          <div className="app-card agentic-card" onClick={() => setAppMode('agentic')}>
            <div className="card-icon">🤖</div>
            <h2>Agentic AI Framework</h2>
            <p>Transform business requirements into working applications using AI agents</p>
            <ul className="feature-list">
              <li>✓ Automatic requirement analysis</li>
              <li>✓ User story generation</li>
              <li>✓ Code generation & testing</li>
              <li>✓ Quality assurance</li>
              <li>✓ Demo deployment</li>
            </ul>
            <button className="launch-btn">Launch Framework →</button>
          </div>
          
          <div className="app-card insurance-card" onClick={() => setAppMode('insurance')}>
            <div className="card-icon">🏥</div>
            <h2>Insurance Check</h2>
            <p>Manage insurance records and calculate premiums</p>
            <ul className="feature-list">
              <li>✓ Multi-country support</li>
              <li>✓ Premium calculation</li>
              <li>✓ Record management</li>
            </ul>
            <button className="launch-btn">Launch App →</button>
          </div>
        </div>
      </div>
    );
  }

  // Agentic Framework Mode
  if (appMode === 'agentic') {
    return (
      <div>
        <button 
          className="back-to-selector" 
          onClick={() => setAppMode('selector')}
        >
          ← Back to Platform
        </button>
        <AgenticFramework />
      </div>
    );
  }

  // Insurance App Mode
  return (
    <div className="App">
      <button 
        className="back-to-selector" 
        onClick={() => { setAppMode('selector'); setPage('landing'); setSelectedCountry(''); }}
      >
        ← Back to Platform
      </button>
      <header className="App-header">
        <h1>Welcome to Insurance Check</h1>
      </header>
      <main>
        {page === 'landing' && (
          <div>
            <h2>Select Your Country</h2>
            <div style={{ marginBottom: '2rem' }}>
              <label>
                <input 
                  type="radio" 
                  name="country" 
                  value="USA" 
                  checked={selectedCountry === 'USA'}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                />
                <span style={{ marginLeft: '0.5rem' }}>United States (USD)</span>
              </label>
              <br />
              <label>
                <input 
                  type="radio" 
                  name="country" 
                  value="India" 
                  checked={selectedCountry === 'India'}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                />
                <span style={{ marginLeft: '0.5rem' }}>India (INR)</span>
              </label>
            </div>
            <button 
              onClick={() => setPage('form')} 
              disabled={!selectedCountry}
              style={{ opacity: selectedCountry ? 1 : 0.5 }}
            >
              Update Record
            </button>
            <button 
              onClick={() => setPage('search')} 
              disabled={!selectedCountry}
              style={{ opacity: selectedCountry ? 1 : 0.5 }}
            >
              Search Record
            </button>
          </div>
        )}

        {page === 'form' && (
          <div>
            <h2>Update Record - {selectedCountry}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                First Name:
                <input type="text" name="firstName" required />
              </label>
              <br />
              <label>
                Age:
                <input type="number" name="age" required />
              </label>
              <br />
              <label>
                Address:
                <input type="text" name="streetName" placeholder="Street Name" required />
              </label>
              <br />
              <label>
                City:
                <input type="text" name="city" required />
              </label>
              <br />
              <label>
                State:
                <input type="text" name="state" required />
              </label>
              <br />
              <label>
                Zip Code:
                <input type="text" name="zipCode" pattern="\d{5}" title="Please enter a valid 5-digit ZIP code" required />
              </label>
              <br />
              <button type="submit">Submit</button>
            </form>
            <button onClick={() => { setPage('landing'); setSelectedCountry(''); }}>Back to Landing Page</button>
          </div>
        )}

        {page === 'search' && (
          <div>
            <h2>Search Record - {selectedCountry}</h2>
            <form onSubmit={handleSearch}>
              <label>
                Unique Identifier:
                <input type="text" name="uniqueId" required />
              </label>
              <br />
              <button type="submit">Search Insurance Premium</button>
            </form>
            <button onClick={() => { setPage('landing'); setSelectedCountry(''); }}>Back to Landing Page</button>
          </div>
        )}

        {page === 'message' && (
          <div>
            <p>{message}</p>
            <button onClick={() => { setPage('landing'); setSelectedCountry(''); }}>Back to Landing Page</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
