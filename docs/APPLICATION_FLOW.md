# Application Flow Documentation

## Overview
This document details the complete application flow, user journeys, and process workflows within the Insurance Management System.

## Application Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Entry    │───►│  Country Select │───►│   Action Choice │
│   (Browser)     │    │   (USA/India)   │    │ (Update/Search) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                            ┌───────────────────────────┼───────────────────────────┐
                            ▼                           ▼                           ▼
                   ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
                   │  Registration   │         │  Premium Search │         │   Landing Page  │
                   │     Flow        │         │      Flow       │         │     Return      │
                   └─────────────────┘         └─────────────────┘         └─────────────────┘
```

## User Journey Maps

### 1. New User Registration Journey

#### User Story
"As a new user, I want to register my details and get a unique ID for future insurance premium lookups."

#### Flow Steps
```
Step 1: Landing Page
├── User opens application
├── Sees country selection (USA/India)
└── Must select country to proceed

Step 2: Country Selection  
├── User selects USA or India
├── Buttons become enabled
└── User clicks "Update Record"

Step 3: Registration Form
├── Form displays with country-specific context
├── User fills required fields:
│   ├── First Name
│   ├── Age  
│   ├── Street Address
│   ├── City
│   ├── State
│   └── ZIP Code (5 digits)
└── User submits form

Step 4: Backend Processing
├── Frontend sends POST to /upload
├── Backend validates country
├── Checks for duplicate first name
├── Generates UUID if new user
└── Stores in country-specific table

Step 5: Response Handling
├── Success: Display unique ID
├── Duplicate: Display existing ID with message
└── Error: Show error message

Step 6: Completion
├── User sees confirmation message
├── User notes down unique ID
└── Can return to landing page
```

#### Frontend State Flow
```javascript
// State Transitions
'landing' → (country selected) → 'form' → (submit success) → 'message'
    ↑                                                              │
    └────────────────── (back button) ───────────────────────────┘
```

### 2. Premium Search Journey

#### User Story
"As an existing user, I want to search for my insurance premium using my unique ID."

#### Flow Steps
```
Step 1: Landing Page Return
├── User returns to application
├── Selects same country as registration
└── Clicks "Search Record"

Step 2: Search Form
├── Simple form with unique ID field
├── Country automatically selected
└── User enters their unique ID

Step 3: Premium Calculation
├── Frontend sends POST to /insurance
├── Backend looks up user by ID
├── Retrieves age from database
├── Calculates premium based on age tier
└── Converts currency based on country

Step 4: Result Display
├── Success: Premium shown in popup alert
├── Error: User not found message
└── Can return to landing page

Step 5: Completion
├── User sees premium amount
├── Can perform another search
└── Can return to main menu
```

## Detailed Process Flows

### Registration Process Flow

```
Frontend Form Submission
         │
         ▼
Frontend Validation
         │
         ├─── Invalid ───► Error Display
         │
         ▼
HTTP POST /upload
         │
         ▼
Backend Receives Request
         │
         ▼
Extract Country Parameter
         │
         ├─── Missing ───► 400 Error Response
         │
         ▼
Get Country Table Name
         │
         ├─── Invalid Country ───► 400 Error Response
         │
         ▼
Database Connection
         │
         ├─── Connection Failed ───► 500 Error Response
         │
         ▼
Duplicate Name Check
         │
         ├─── Duplicate Found ───► Return Existing ID
         │
         ▼
Generate New UUID
         │
         ▼
Insert User Record
         │
         ├─── Insert Failed ───► 500 Error Response
         │
         ▼
Commit Transaction
         │
         ▼
Return Success Response
         │
         ▼
Frontend Displays Result
```

### Premium Search Process Flow

```
Frontend Search Submission
         │
         ▼
Frontend Validation
         │
         ├─── Invalid ───► Error Display
         │
         ▼
HTTP POST /insurance
         │
         ▼
Backend Receives Request
         │
         ▼
Extract Parameters (ID, Country)
         │
         ├─── Missing Country ───► 400 Error Response
         │
         ▼
Get Country Table Name
         │
         ├─── Invalid Country ───► 400 Error Response
         │
         ▼
Database Connection
         │
         ├─── Connection Failed ───► 500 Error Response
         │
         ▼
User Lookup by ID
         │
         ├─── User Not Found ───► 404 Error Response
         │
         ▼
Extract User Age
         │
         ▼
Calculate Premium Tier
         │
         ▼
Apply Currency Conversion
         │
         ▼
Format Premium String
         │
         ▼
Return Premium Response
         │
         ▼
Frontend Displays Premium
```

## State Management Flow

### Frontend State Diagram

```
Initial State: { page: 'landing', selectedCountry: '', message: '' }

Landing Page State:
├── selectedCountry: '' → (radio selection) → 'USA' | 'India'
├── buttons disabled → (country selected) → buttons enabled
└── page: 'landing' → (button click) → 'form' | 'search'

Form Page State:
├── page: 'form'
├── selectedCountry: preserved from landing
├── form data: collected on submit
└── page: 'form' → (successful submit) → 'message'

Search Page State:  
├── page: 'search'
├── selectedCountry: preserved from landing
├── search data: collected on submit
└── result: displayed in alert popup

Message Page State:
├── page: 'message'  
├── message: success/error text
└── page: 'message' → (back button) → 'landing'

Navigation Flow:
landing ←→ form → message → landing
   ↓        ↑         ↑
   └─── search ──────┘
```

### Backend State Management

```
Request State: Stateless HTTP requests

Per-Request Flow:
├── Receive HTTP Request
├── Parse JSON payload  
├── Validate input data
├── Open database connection
├── Execute business logic
├── Close database connection
└── Return HTTP response

No Session State:
├── No user sessions
├── No authentication state
├── No request caching
└── Each request independent
```

## Business Logic Flow

### Age-Based Premium Calculation

```
User Age Input
      │
      ▼
Age Validation
      │
      ▼
Premium Tier Assignment:
      │
      ├── Age ≤ 20 ────► $100 USD base
      │
      ├── 20 < Age ≤ 50 ─► $200 USD base  
      │
      └── Age > 50 ─────► $500 USD base
                            │
                            ▼
                    Currency Conversion:
                            │
                            ├── USA ──► "$XXX per month"
                            │
                            └── India ► "₹XXXX per month"
                                       (USD × 83.0)
```

### Country-Specific Data Routing

```
Country Selection
       │
       ▼
Table Name Resolution:
       │
       ├── "USA" ──────► users_usa table
       │
       ├── "India" ────► users_india table  
       │
       └── Other ──────► ValueError exception
                              │
                              ▼
                         400 Error Response
```

## Error Handling Flow

### Client-Side Error Flow

```
User Input
    │
    ▼
HTML5 Validation
    │
    ├─── Validation Failed ───► Display browser error
    │
    ▼
JavaScript Validation  
    │
    ├─── Validation Failed ───► Display custom error
    │
    ▼
Network Request
    │
    ├─── Network Error ───► Console.error + user notification
    │
    ▼
Response Processing
    │
    ├─── HTTP Error Status ───► Display error message
    │
    ├─── Business Logic Error ─► Display warning message
    │
    └─── Success ─────────────► Display success message
```

### Server-Side Error Flow

```
Request Received
       │
       ▼
Input Validation
       │
       ├─── Validation Failed ───► 400 Bad Request
       │
       ▼
Business Logic Processing
       │
       ├─── Business Rule Violated ───► 404 Not Found
       │
       ▼
Database Operations
       │
       ├─── Database Error ───► 500 Internal Server Error
       │
       ▼
Success Response
       │
       ▼
JSON Response Sent
```

## Data Flow Patterns

### Registration Data Flow

```
User Form Input:
{
  firstName: "John",
  age: 25,
  streetName: "123 Main St", 
  city: "New York",
  state: "NY",
  zipCode: "10001"
}
        │
        ▼
Frontend Processing:
data.country = selectedCountry ("USA")
        │
        ▼
HTTP Request:
POST /upload + JSON payload
        │
        ▼
Backend Processing:
- Validate country
- Generate UUID
- Store in users_usa table
        │
        ▼
Database Record:
{
  unique_id: "550e8400-e29b-41d4-a716-446655440000",
  first_name: "John",
  age: 25,
  street_name: "123 Main St",
  city: "New York", 
  state: "NY",
  zip_code: "10001"
}
        │
        ▼
Response:
{ uniqueId: "550e8400-e29b-41d4-a716-446655440000" }
```

### Search Data Flow

```
User Search Input:
{
  uniqueId: "550e8400-e29b-41d4-a716-446655440000"
}
        │
        ▼
Frontend Processing:
data.country = selectedCountry ("USA")
        │
        ▼
HTTP Request:
POST /insurance + JSON payload
        │
        ▼
Backend Processing:
- Look up user in users_usa
- Extract age (25)
- Calculate premium ($200)
- Format for USA ("$200 per month")
        │
        ▼
Response:
{
  uniqueId: "550e8400-e29b-41d4-a716-446655440000",
  insurancePremium: "$200 per month"
}
```

## Integration Touch Points

### Frontend-Backend Integration Points

1. **Country Selection Sync**
   - Frontend state → Backend table selection
   - Maintains consistency across requests

2. **Form Data Transformation**
   - HTML form data → JSON payload
   - Client validation → Server validation

3. **Response Processing**
   - JSON response → UI state updates
   - Error handling → User feedback

### Backend-Database Integration Points

1. **Connection Management**
   - Per-request connection lifecycle
   - Transaction management

2. **Country-Based Routing**
   - Runtime table name resolution
   - Data isolation enforcement

3. **Business Logic Integration**
   - Database queries → Premium calculation
   - Age data → Business rules application

## Performance Flow Characteristics

### Request Processing Time

```
User Action → Frontend Processing (10ms)
           → Network Request (50ms)
           → Backend Processing (100ms)
           → Database Query (50ms)  
           → Response Generation (10ms)
           → Network Response (50ms)
           → Frontend Update (10ms)
           
Total: ~280ms typical response time
```

### Concurrent User Flow

```
Current Limitation: SQLite write serialization
├── Multiple reads: Concurrent
├── Multiple writes: Serialized  
└── Read + Write: Potential blocking

Recommended Flow for Scale:
├── Connection pooling
├── Database migration (PostgreSQL)
└── Caching layer (Redis)
```

## Future Flow Enhancements

### Authentication Flow
```
User Login → Session Management → Authenticated Requests → Session Validation
```

### Payment Flow  
```
Premium Calculation → Payment Gateway → Payment Processing → Confirmation
```

### Notification Flow
```
User Action → Event Trigger → Email/SMS Service → User Notification
```