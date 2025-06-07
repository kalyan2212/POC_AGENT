# API Specification Documentation

## Overview
This document provides a comprehensive specification of the REST API endpoints exposed by the Insurance Management System Flask backend.

## Base Configuration

### Server Information
- **Base URL**: `http://localhost:5000` (development)
- **Protocol**: HTTP (development), HTTPS (production recommended)
- **Content-Type**: `application/json`
- **CORS**: Enabled for cross-origin requests

### Global Headers
```http
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## API Endpoints

### 1. User Registration Endpoint

#### POST /upload

**Purpose**: Register a new user and receive a unique identifier

##### Request Specification
```http
POST /upload HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "country": "USA",
  "firstName": "John",
  "age": 25,
  "streetName": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

##### Request Schema
```json
{
  "type": "object",
  "required": ["country", "firstName", "age", "streetName", "city", "state", "zipCode"],
  "properties": {
    "country": {
      "type": "string",
      "enum": ["USA", "India"],
      "description": "Country for user registration"
    },
    "firstName": {
      "type": "string",
      "description": "User's first name"
    },
    "age": {
      "type": "integer",
      "minimum": 1,
      "maximum": 120,
      "description": "User's age in years"
    },
    "streetName": {
      "type": "string",
      "description": "Street address"
    },
    "city": {
      "type": "string", 
      "description": "City name"
    },
    "state": {
      "type": "string",
      "description": "State or province"
    },
    "zipCode": {
      "type": "string",
      "pattern": "\\d{5}",
      "description": "5-digit postal code"
    }
  }
}
```

##### Response Specifications

**Success Response (201 Created)**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "uniqueId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Duplicate User Response (200 OK)**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "uniqueId": "existing-uuid-here",
  "error": "Record already exists"
}
```

**Validation Error Response (400 Bad Request)**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Country is required"
}
```

**Invalid Country Response (400 Bad Request)**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid country. Supported countries: USA, India"
}
```

**Server Error Response (500 Internal Server Error)**
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Database connection failed"
}
```

### 2. Insurance Premium Calculation Endpoint

#### POST /insurance

**Purpose**: Calculate insurance premium for a registered user

##### Request Specification
```http
POST /insurance HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "uniqueId": "550e8400-e29b-41d4-a716-446655440000",
  "country": "USA"
}
```

##### Request Schema
```json
{
  "type": "object",
  "required": ["uniqueId", "country"],
  "properties": {
    "uniqueId": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier from user registration"
    },
    "country": {
      "type": "string",
      "enum": ["USA", "India"],
      "description": "Country for premium calculation"
    }
  }
}
```

##### Response Specifications

**Success Response (200 OK) - USA**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "uniqueId": "550e8400-e29b-41d4-a716-446655440000",
  "insurancePremium": "$200 per month"
}
```

**Success Response (200 OK) - India**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "uniqueId": "550e8400-e29b-41d4-a716-446655440000", 
  "insurancePremium": "₹16600 per month"
}
```

**User Not Found Response (404 Not Found)**
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "User not found"
}
```

**Missing Country Response (400 Bad Request)**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Country is required"
}
```

**Invalid Country Response (400 Bad Request)**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid country. Supported countries: USA, India"
}
```

## Business Logic Documentation

### Premium Calculation Rules

#### Age-Based Premium Tiers
```python
# Premium calculation logic
if age <= 20:
    base_premium_usd = 100
elif 20 < age <= 50:
    base_premium_usd = 200
else:  # age > 50
    base_premium_usd = 500
```

#### Currency Conversion
```python
# Exchange rate (hardcoded)
USD_TO_INR_RATE = 83.0

# Country-specific formatting
USA: "${amount} per month"
India: "₹{amount} per month" (converted from USD)
```

### Data Processing Logic

#### Country Table Routing
```python
def get_table_name(country):
    if country.lower() == 'usa':
        return 'users_usa'
    elif country.lower() == 'india':
        return 'users_india'
    else:
        raise ValueError("Invalid country")
```

#### Duplicate Detection
- **Method**: First name matching within country-specific table
- **Query**: `SELECT unique_id FROM {table} WHERE first_name = ?`
- **Behavior**: Returns existing UUID if duplicate found

## Error Handling

### Error Response Format
All error responses follow this structure:
```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Code Usage

| Status Code | Usage | Description |
|-------------|--------|-------------|
| 200 | Success | Request processed successfully |
| 400 | Bad Request | Invalid input data or missing required fields |
| 404 | Not Found | User not found for given unique ID |
| 500 | Internal Server Error | Database errors or unexpected exceptions |

### Error Categories

#### Validation Errors (400)
- Missing required fields
- Invalid country values
- Malformed request data

#### Business Logic Errors (404)
- User not found for premium calculation
- Invalid unique ID format

#### System Errors (500)
- Database connection failures
- Unexpected exceptions
- File system errors

## API Usage Examples

### Complete User Registration Flow

```javascript
// Step 1: Register User
const registrationResponse = await fetch('http://localhost:5000/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    country: 'USA',
    firstName: 'John',
    age: 25,
    streetName: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  })
});

const registrationResult = await registrationResponse.json();
console.log('User ID:', registrationResult.uniqueId);
```

### Premium Calculation Flow

```javascript
// Step 2: Get Insurance Premium
const premiumResponse = await fetch('http://localhost:5000/insurance', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    uniqueId: registrationResult.uniqueId,
    country: 'USA'
  })
});

const premiumResult = await premiumResponse.json();
console.log('Premium:', premiumResult.insurancePremium);
```

### Error Handling Example

```javascript
try {
  const response = await fetch('http://localhost:5000/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    console.error('API Error:', result.error);
    return;
  }
  
  if (result.error) {
    console.log('Business Logic Warning:', result.error);
    console.log('Existing ID:', result.uniqueId);
  } else {
    console.log('New User Created:', result.uniqueId);
  }
  
} catch (error) {
  console.error('Network Error:', error);
}
```

## API Testing

### Curl Examples

#### Register New User
```bash
curl -X POST http://localhost:5000/upload \
  -H "Content-Type: application/json" \
  -d '{
    "country": "USA",
    "firstName": "Jane",
    "age": 30,
    "streetName": "456 Oak Ave",
    "city": "Los Angeles", 
    "state": "CA",
    "zipCode": "90210"
  }'
```

#### Get Insurance Premium
```bash
curl -X POST http://localhost:5000/insurance \
  -H "Content-Type: application/json" \
  -d '{
    "uniqueId": "550e8400-e29b-41d4-a716-446655440000",
    "country": "USA"
  }'
```

### Test Cases

#### Valid Registration Test
```json
POST /upload
{
  "country": "India",
  "firstName": "Raj",
  "age": 35,
  "streetName": "12 Gandhi Road",
  "city": "Mumbai",
  "state": "Maharashtra", 
  "zipCode": "40001"
}

Expected: 200 OK with uniqueId
```

#### Premium Calculation Test
```json
POST /insurance
{
  "uniqueId": "valid-uuid-here",
  "country": "India"
}

Expected: 200 OK with "₹16600 per month" (for age 35)
```

#### Error Test Cases
```json
// Missing country
POST /upload
{ "firstName": "Test" }
Expected: 400 Bad Request

// Invalid country  
POST /upload  
{ "country": "Canada", "firstName": "Test" }
Expected: 400 Bad Request

// User not found
POST /insurance
{ "uniqueId": "nonexistent-id", "country": "USA" }
Expected: 404 Not Found
```

## Rate Limiting
**Current Implementation**: None
**Recommendation**: Implement rate limiting for production use

## Authentication
**Current Implementation**: None
**Recommendation**: Add authentication for production use

## API Versioning
**Current Implementation**: No versioning
**Recommendation**: Consider API versioning for future updates (e.g., `/api/v1/upload`)

## Deprecation Policy
**Current Implementation**: No formal policy
**Recommendation**: Establish deprecation guidelines for API changes