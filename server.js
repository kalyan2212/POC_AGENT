const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// INTENTIONAL ISSUE 1: CORS not properly configured
// This will cause frontend integration to break
// app.use(cors()); // This line is commented out to simulate the issue

app.use(express.json());

// INTENTIONAL ISSUE 2: Wrong endpoint path
// Frontend will try to call /api/data but this is /data
app.get('/data', (req, res) => {
    const responseData = {
        message: 'Hello from backend!',
        timestamp: new Date().toISOString(),
        status: 'success',
        data: [
            { id: 1, name: 'Agent Task 1', completed: false },
            { id: 2, name: 'Agent Task 2', completed: true },
            { id: 3, name: 'Agent Task 3', completed: false }
        ]
    };
    
    res.json(responseData);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'POC Agent Backend' });
});

// INTENTIONAL ISSUE 3: Missing error handling
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Data endpoint: http://localhost:${PORT}/data`);
});