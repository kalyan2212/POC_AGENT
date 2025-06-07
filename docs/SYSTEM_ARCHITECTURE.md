# System Architecture Documentation

## Overview
This document provides a comprehensive architectural analysis of the Insurance Management System, created through reverse engineering of the existing codebase.

## Architecture Pattern
The system follows a **3-Tier Architecture** pattern:
- **Presentation Tier**: React.js Frontend
- **Application Tier**: Flask REST API
- **Data Tier**: SQLite Database

## System Components

### 1. Frontend Layer (React.js + Vite)
```
┌─────────────────────────────────────┐
│           Frontend (React)          │
│  ┌─────────────────────────────────┐│
│  │         App.jsx                 ││
│  │  ┌─────────────────────────────┐││
│  │  │  Landing Page Component     │││
│  │  │  - Country Selection       │││
│  │  │  - Navigation Controls     │││
│  │  └─────────────────────────────┘││
│  │  ┌─────────────────────────────┐││
│  │  │  Form Component             │││
│  │  │  - User Registration        │││
│  │  │  - Data Validation          │││
│  │  └─────────────────────────────┘││
│  │  ┌─────────────────────────────┐││
│  │  │  Search Component           │││
│  │  │  - Premium Lookup           │││
│  │  │  - Result Display           │││
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
         │ HTTP REST API
         ▼
```

### 2. Backend Layer (Flask API)
```
┌─────────────────────────────────────┐
│        Backend (Flask)              │
│  ┌─────────────────────────────────┐│
│  │       kalyan_logic.py           ││
│  │  ┌─────────────────────────────┐││
│  │  │  /upload Endpoint           │││
│  │  │  - User Registration        │││
│  │  │  - Duplicate Check          │││
│  │  │  - UUID Generation          │││
│  │  └─────────────────────────────┘││
│  │  ┌─────────────────────────────┐││
│  │  │  /insurance Endpoint        │││
│  │  │  - Premium Calculation      │││
│  │  │  - Currency Conversion      │││
│  │  │  - User Lookup              │││
│  │  └─────────────────────────────┘││
│  │  ┌─────────────────────────────┐││
│  │  │  Database Functions         │││
│  │  │  - Connection Management    │││
│  │  │  - Table Operations         │││
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
         │ SQLite Connection
         ▼
```

### 3. Data Layer (SQLite)
```
┌─────────────────────────────────────┐
│        Database (SQLite)            │
│         insurance.db                │
│  ┌─────────────────────────────────┐│
│  │      users_usa Table            ││
│  │  - unique_id (PK)               ││
│  │  - first_name                   ││
│  │  - age                          ││
│  │  - address fields               ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │      users_india Table          ││
│  │  - unique_id (PK)               ││
│  │  - first_name                   ││
│  │  - age                          ││
│  │  - address fields               ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Communication Flow

### Request Flow
1. **User Interaction** → Frontend (React)
2. **HTTP Request** → Backend API (Flask)
3. **Database Query** → SQLite Database
4. **Response Chain** → Database → Backend → Frontend → User

### Data Flow Diagram
```
User Input → React State → HTTP Request → Flask Route → SQLite Query → Database
    ↑                                                                        │
    └── UI Update ← JSON Response ← HTTP Response ← Python Object ← Query Result
```

## Technology Stack

### Frontend Stack
- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Language**: JavaScript (ES6+)
- **Styling**: CSS
- **HTTP Client**: Fetch API

### Backend Stack
- **Framework**: Flask
- **Language**: Python 3
- **CORS**: Flask-CORS
- **Database Driver**: sqlite3 (built-in)
- **UUID Generation**: uuid (built-in)

### Database Stack
- **Database**: SQLite
- **File**: insurance.db
- **Schema**: Relational with country-specific tables

## Deployment Architecture

### Development Environment
```
localhost:5173 (Frontend) ←→ localhost:5000 (Backend) ←→ insurance.db (SQLite)
```

### Production Environment (AWS EC2)
```
EC2_IP:3000 (Frontend) ←→ EC2_IP:5000 (Backend) ←→ insurance.db (SQLite)
                │                    │
                └── Port 80 ─────────┴── Port 5000
                    (via Nginx)          (Direct)
```

## Security Considerations

### Current Implementation
- **CORS**: Enabled for cross-origin requests
- **Validation**: Basic client-side validation
- **Authentication**: None implemented
- **HTTPS**: Not configured (development)

### Production Recommendations
- Implement authentication/authorization
- Add input sanitization
- Configure HTTPS
- Use environment variables for sensitive data
- Implement rate limiting

## Scalability Considerations

### Current Limitations
- Single SQLite database file
- No connection pooling
- No caching layer
- Synchronous processing

### Improvement Recommendations
- Migrate to PostgreSQL/MySQL for multi-user support
- Implement database connection pooling
- Add Redis for caching
- Consider microservices architecture for larger scale