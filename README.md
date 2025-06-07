# POC_AGENT
Frontend-Backend Integration POC for Code Agent

## Overview
This POC demonstrates common frontend-backend integration issues and their solutions. It serves as a reference for code agents working on similar integration problems.

## Project Structure
```
POC_AGENT/
├── package.json          # Node.js dependencies and scripts
├── server.js             # Backend server with intentional integration issues
├── server-fixed.js       # Backend server with fixes applied
├── index.html            # Frontend client that demonstrates integration
└── README.md            # This documentation
```

## Common Integration Issues Demonstrated

### 1. CORS (Cross-Origin Resource Sharing) Issues
**Problem**: Backend doesn't enable CORS, causing browser to block requests from frontend
**Solution**: Properly configure CORS middleware with appropriate origins

### 2. Endpoint Mismatch
**Problem**: Frontend calls `/api/data` but backend serves `/data`
**Solution**: Align endpoint paths between frontend and backend

### 3. Missing Error Handling
**Problem**: Server crashes or returns unclear error messages
**Solution**: Implement proper error handling and meaningful error responses

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
1. Install dependencies:
```bash
npm install
```

### Running the Broken Version (Demonstrates Issues)
1. Start the backend server with issues:
```bash
node server.js
```

2. Open `index.html` in a web browser (or serve it with a local server)

3. Click "Test Backend Integration" - you should see CORS and endpoint errors

### Running the Fixed Version
1. Start the fixed backend server:
```bash
node server-fixed.js
```

2. Refresh the frontend and test again - integration should work correctly

## Testing the Integration

### Manual Testing
1. Open the frontend in a browser
2. Use the "Test Backend Integration" button to test data fetching
3. Use the "Test Health Check" button to verify server connectivity

### Expected Behavior
- **Broken version**: CORS errors, 404 errors for wrong endpoint
- **Fixed version**: Successful data retrieval and display

## Integration Issues and Solutions

| Issue | Symptom | Root Cause | Solution |
|-------|---------|------------|----------|
| CORS Error | `Access-Control-Allow-Origin` error in browser console | Backend doesn't enable CORS | Add `cors()` middleware with proper configuration |
| 404 Not Found | Frontend gets 404 when calling API | Endpoint path mismatch | Align frontend and backend endpoint paths |
| Server Crash | Backend stops responding | Missing error handling | Add error middleware and graceful shutdown |

## Development Notes

### For Code Agents
This POC provides a template for diagnosing and fixing frontend-backend integration issues:

1. **Identify the Integration Point**: Look for API calls in frontend code
2. **Check Endpoint Alignment**: Verify frontend API calls match backend routes
3. **Verify CORS Configuration**: Ensure backend allows frontend origin
4. **Test Error Scenarios**: Check how system handles network errors, server errors
5. **Validate Data Flow**: Confirm data format matches between frontend and backend

### Extending the POC
To add more integration scenarios:
- Add authentication/authorization
- Implement WebSocket connections
- Add file upload/download capabilities
- Include database integration
- Add API versioning

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change PORT in server files if 3001 is in use
2. **Node modules**: Run `npm install` if dependencies are missing
3. **Browser cache**: Clear browser cache if changes don't appear
4. **CORS in production**: Use environment-specific CORS origins

### Useful Commands
```bash
# Check if server is running
curl http://localhost:3001/health

# Test API endpoint directly
curl http://localhost:3001/api/data

# Install dependencies
npm install

# Start server
npm start
```
