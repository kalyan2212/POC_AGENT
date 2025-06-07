const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// FIX 1: Enable CORS properly
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:5500', 'null'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// FIX 2: Correct endpoint path that matches frontend expectations
app.get('/api/data', (req, res) => {
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

// Keep the old endpoint for backward compatibility
app.get('/data', (req, res) => {
    res.redirect('/api/data');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'POC Agent Backend' });
});

// FIX 3: Add proper error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Endpoint ${req.method} ${req.path} not found`
    });
});

const server = app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Data endpoint: http://localhost:${PORT}/api/data`);
    console.log('CORS enabled for frontend integration');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = app;