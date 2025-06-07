# Integration Architecture Documentation

## Overview
This document details the integration points, data flows, and external connections within the Insurance Management System.

## Integration Architecture Diagram

```
┌─────────────────┐    HTTP/REST     ┌─────────────────┐    SQLite      ┌─────────────────┐
│                 │◄────────────────►│                 │◄──────────────►│                 │
│   Frontend      │     JSON         │   Backend       │   Direct       │   Database      │
│   (React)       │     localhost    │   (Flask)       │   Connection   │   (SQLite)      │
│   Port 5173     │     :5000        │   Port 5000     │                │   insurance.db  │
│                 │                  │                 │                │                 │
└─────────────────┘                  └─────────────────┘                └─────────────────┘
        │                                     │                                   │
        │                                     │                                   │
        ▼                                     ▼                                   ▼
┌─────────────────┐                  ┌─────────────────┐                ┌─────────────────┐
│   Web Browser   │                  │  Currency       │                │  File System    │
│   User Interface│                  │  Conversion     │                │  Storage        │
│                 │                  │  USD→INR: 83.0  │                │                 │
└─────────────────┘                  └─────────────────┘                └─────────────────┘
```

## Integration Points

### 1. Frontend-Backend Integration

#### Connection Details
- **Protocol**: HTTP/HTTPS
- **Data Format**: JSON
- **Authentication**: None (currently)
- **Base URL**: `http://localhost:5000`
- **CORS**: Enabled via Flask-CORS

#### API Endpoints

##### POST /upload
```javascript
// Frontend Request
fetch('http://localhost:5000/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    country: 'USA',
    firstName: 'John',
    age: 25,
    streetName: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  })
})

// Backend Response
{
  "uniqueId": "550e8400-e29b-41d4-a716-446655440000"
}
// OR
{
  "uniqueId": "existing-id",
  "error": "Record already exists"
}
```

##### POST /insurance
```javascript
// Frontend Request
fetch('http://localhost:5000/insurance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    uniqueId: '550e8400-e29b-41d4-a716-446655440000',
    country: 'USA'
  })
})

// Backend Response
{
  "uniqueId": "550e8400-e29b-41d4-a716-446655440000",
  "insurancePremium": "$200 per month"
}
```

### 2. Backend-Database Integration

#### Connection Details
- **Database**: SQLite
- **Driver**: Python sqlite3 (built-in)
- **Connection**: Direct file-based connection
- **File Location**: `./insurance.db`
- **Connection Management**: Per-request connection

#### Database Operations

##### User Registration
```python
# Connection Management
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

# Duplicate Check Query
cursor.execute(f"SELECT unique_id FROM {table_name} WHERE first_name = ?", 
               (data['firstName'],))

# Insert New User
cursor.execute(f"""
    INSERT INTO {table_name} (unique_id, first_name, age, street_name, city, state, zip_code)
    VALUES (?, ?, ?, ?, ?, ?, ?)
""", (unique_id, firstName, age, streetName, city, state, zipCode))
```

##### Premium Calculation
```python
# User Lookup Query
cursor.execute(f"SELECT age FROM {table_name} WHERE unique_id = ?", (unique_id,))
result = cursor.fetchone()

# Business Logic Integration
if age <= 20:
    usd_premium = 100
elif 20 < age <= 50:
    usd_premium = 200
else:
    usd_premium = 500
```

### 3. Country-Based Data Segregation

#### Table Routing Logic
```python
def get_table_name(country):
    if country.lower() == 'usa':
        return 'users_usa'
    elif country.lower() == 'india':
        return 'users_india'
    else:
        raise ValueError("Invalid country")
```

#### Data Isolation Strategy
- **USA Users**: Stored in `users_usa` table
- **India Users**: Stored in `users_india` table
- **Schema**: Identical structure across both tables
- **Isolation**: Complete data separation by country

### 4. Currency Conversion Integration

#### Conversion Logic
```python
# Hardcoded Exchange Rate
USD_TO_INR_RATE = 83.0

def convert_usd_to_inr(usd_amount):
    return usd_amount * USD_TO_INR_RATE

# Application in Premium Calculation
if country.lower() == 'usa':
    premium = f"${usd_premium} per month"
elif country.lower() == 'india':
    inr_premium = convert_usd_to_inr(usd_premium)
    premium = f"₹{inr_premium:.0f} per month"
```

#### Currency Display Integration
- **USA**: Dollar symbol with USD amounts
- **India**: Rupee symbol with INR amounts
- **Conversion**: Real-time during premium calculation
- **Rate Source**: Static hardcoded value (not external API)

## Data Flow Patterns

### 1. User Registration Flow
```
User Form Input → Frontend Validation → HTTP POST /upload → 
Country Table Selection → Duplicate Check → UUID Generation → 
Database Insert → Response with Unique ID → Frontend Display
```

### 2. Premium Search Flow
```
Unique ID Input → HTTP POST /insurance → Country Table Selection → 
User Lookup → Age-Based Calculation → Currency Conversion → 
Premium Response → Frontend Alert Display
```

### 3. Error Handling Flow
```
Validation Error → JSON Error Response → Frontend Error Display
Database Error → Exception Handling → HTTP 500 Response
User Not Found → HTTP 404 Response → Frontend Alert
```

## External Dependencies

### Current External Dependencies
- **None**: System is completely self-contained
- **No External APIs**: Currency rate is hardcoded
- **No Third-party Services**: All functionality is internal

### Potential Integration Points
1. **Currency API**: For real-time exchange rates
2. **Payment Gateway**: For premium payments
3. **Email Service**: For notifications
4. **Authentication Provider**: For user management
5. **Analytics Service**: For usage tracking

## Network Architecture

### Development Environment
```
Client Browser ←→ React Dev Server (5173) ←→ Flask API (5000) ←→ SQLite DB
     │                    │                      │                │
     HTTP               Vite HMR              Python            File I/O
```

### Production Environment
```
Internet ←→ Load Balancer ←→ Nginx ←→ Flask App ←→ SQLite DB
    │            │             │         │           │
   HTTPS        SSL         Reverse     Python      File I/O
              Termination    Proxy      Process
```

## Integration Patterns

### Request-Response Pattern
- **Synchronous Communication**: All API calls are synchronous
- **Stateless**: No session management
- **RESTful**: Standard HTTP methods and status codes

### Database Pattern
- **Connection Per Request**: New connection for each API call
- **No Connection Pooling**: Simple connection management
- **Transaction Management**: Basic commit/rollback

### Error Handling Pattern
- **HTTP Status Codes**: Standard error reporting
- **JSON Error Messages**: Consistent error format
- **Try-Catch Blocks**: Exception handling in backend

## Security Integration Points

### Current Security Measures
- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Basic client-side validation
- **SQL Parameters**: Parameterized queries prevent SQL injection

### Missing Security Integrations
- **Authentication**: No user authentication system
- **Authorization**: No access control
- **Rate Limiting**: No API throttling
- **Input Sanitization**: Limited server-side validation
- **HTTPS**: Not configured for production

## Performance Considerations

### Current Performance Characteristics
- **Database**: Single file, no indexing optimization
- **Caching**: No caching layer
- **Concurrent Users**: Limited by SQLite constraints
- **Response Time**: Direct database queries

### Optimization Opportunities
- **Database Indexing**: Add indexes on frequently queried fields
- **Connection Pooling**: Implement database connection pooling
- **Caching**: Add Redis for frequently accessed data
- **CDN**: Use CDN for static assets
- **Database Migration**: Consider PostgreSQL for better concurrency