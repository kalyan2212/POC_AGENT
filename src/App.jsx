import { useState } from 'react';
import './App.css';

function App() {
  const [page, setPage] = useState('landing');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Insurance Check</h1>
      </header>
      <main>
        {page === 'landing' && (
          <div>
            <button onClick={() => setPage('form')}>Update Record</button>
            <button onClick={() => setPage('search')}>Search Record</button>
          </div>
        )}

        {page === 'form' && (
          <div>
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
            <button onClick={() => setPage('landing')}>Back to Landing Page</button>
          </div>
        )}

        {page === 'search' && (
          <div>
            <form onSubmit={handleSearch}>
              <label>
                Unique Identifier:
                <input type="text" name="uniqueId" required />
              </label>
              <br />
              <button type="submit">Search Insurance Premium</button>
            </form>
            <button onClick={() => setPage('landing')}>Back to Landing Page</button>
          </div>
        )}

        {page === 'message' && (
          <div>
            <p>{message}</p>
            <button onClick={() => setPage('landing')}>Back to Landing Page</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
