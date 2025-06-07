# Data Model Documentation

## Overview
This document provides a comprehensive analysis of the data model used in the Insurance Management System, including database schema, data relationships, and data flow patterns.

## Database Schema

### SQLite Database: `insurance.db`

#### Table Structure

##### users_usa Table
```sql
CREATE TABLE IF NOT EXISTS users_usa (
    unique_id TEXT PRIMARY KEY,
    first_name TEXT,
    age INTEGER,
    street_name TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT
);
```

##### users_india Table
```sql
CREATE TABLE IF NOT EXISTS users_india (
    unique_id TEXT PRIMARY KEY,
    first_name TEXT,
    age INTEGER,
    street_name TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT
);
```

#### Additional Tables
- **users**: Legacy table (detected in database but not used in current implementation)

## Data Model Diagram

```
┌─────────────────────────────────────┐
│           users_usa                 │
├─────────────────────────────────────┤
│ unique_id (TEXT) [PK]               │
│ first_name (TEXT)                   │
│ age (INTEGER)                       │
│ street_name (TEXT)                  │
│ city (TEXT)                         │
│ state (TEXT)                        │
│ zip_code (TEXT)                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│           users_india               │
├─────────────────────────────────────┤
│ unique_id (TEXT) [PK]               │
│ first_name (TEXT)                   │
│ age (INTEGER)                       │
│ street_name (TEXT)                  │
│ city (TEXT)                         │
│ state (TEXT)                        │
│ zip_code (TEXT)                     │
└─────────────────────────────────────┘

Note: Both tables have identical schema but store 
      country-specific user data separately
```

## Field Specifications

### Primary Key
- **Field**: `unique_id`
- **Type**: TEXT
- **Format**: UUID v4 (e.g., "550e8400-e29b-41d4-a716-446655440000")
- **Generation**: Python `uuid.uuid4()` function
- **Purpose**: Unique identifier for user records and premium lookups

### User Information Fields

#### Personal Information
- **first_name**
  - Type: TEXT
  - Constraints: Required (NOT NULL in application logic)
  - Purpose: User identification and duplicate checking
  - Validation: Client-side required field

- **age**
  - Type: INTEGER
  - Constraints: Required, Positive number
  - Purpose: Insurance premium calculation
  - Business Logic: Determines premium tier (≤20, 21-50, >50)

#### Address Information
- **street_name**
  - Type: TEXT
  - Constraints: Required
  - Purpose: User address (Street/House number and name)
  - Validation: Client-side required field

- **city**
  - Type: TEXT
  - Constraints: Required
  - Purpose: User's city of residence
  - Validation: Client-side required field

- **state**
  - Type: TEXT
  - Constraints: Required
  - Purpose: User's state/province
  - Validation: Client-side required field

- **zip_code**
  - Type: TEXT
  - Constraints: Required, 5-digit pattern
  - Purpose: Postal code
  - Validation: Client-side pattern validation `\d{5}`

## Data Relationships

### Table Relationships
- **No Foreign Keys**: Tables are independent with no explicit relationships
- **Identical Schema**: Both country tables have the same structure
- **Data Segregation**: Country-based data isolation strategy

### Implicit Relationships
```
Country Selection → Table Routing
    │
    ├── "USA" → users_usa table
    └── "India" → users_india table

unique_id → Premium Calculation
    │
    └── Links user record to insurance premium
```

## Data Access Patterns

### 1. User Registration Pattern
```python
# Data Flow: Frontend → Backend → Database
Input Data: {
    country: "USA",
    firstName: "John",
    age: 25,
    streetName: "123 Main St",
    city: "New York", 
    state: "NY",
    zipCode: "10001"
}

# Table Selection Logic
table_name = get_table_name(country)  # "users_usa"

# Duplicate Check
SELECT unique_id FROM users_usa WHERE first_name = 'John'

# Insert New Record
INSERT INTO users_usa VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'John', 25, '123 Main St', 'New York', 'NY', '10001'
)
```

### 2. Premium Lookup Pattern
```python
# Data Flow: Frontend → Backend → Database
Input Data: {
    uniqueId: "550e8400-e29b-41d4-a716-446655440000",
    country: "USA"
}

# Table Selection
table_name = get_table_name(country)  # "users_usa"

# User Lookup
SELECT age FROM users_usa WHERE unique_id = '550e8400-e29b-41d4-a716-446655440000'

# Premium Calculation (Business Logic)
age = 25 → Premium Tier: $200 per month
```

## Business Logic Integration

### Age-Based Premium Calculation
```python
# Premium Tiers
if age <= 20:
    base_premium_usd = 100
elif 20 < age <= 50:
    base_premium_usd = 200
else:  # age > 50
    base_premium_usd = 500
```

### Currency Conversion Logic
```python
# Country-Based Currency Display
if country == 'USA':
    premium = f"${base_premium_usd} per month"
elif country == 'India':
    inr_amount = base_premium_usd * 83.0
    premium = f"₹{inr_amount:.0f} per month"
```

## Data Validation

### Client-Side Validation
```javascript
// HTML5 Form Validation
<input type="text" name="firstName" required />
<input type="number" name="age" required />
<input type="text" name="streetName" required />
<input type="text" name="city" required />
<input type="text" name="state" required />
<input type="text" name="zipCode" pattern="\d{5}" required />
```

### Server-Side Validation
```python
# Backend Validation
- Country presence check
- Required field validation via database constraints
- Error handling for invalid data types
```

## Data Storage Characteristics

### Storage Format
- **Database Type**: SQLite (file-based)
- **File Location**: `./insurance.db`
- **Character Encoding**: UTF-8
- **Collation**: Default SQLite collation

### Storage Limitations
- **Concurrency**: SQLite limitations for concurrent writes
- **Size**: No practical limit for current use case
- **Backup**: Single file backup strategy
- **Replication**: No built-in replication

## Data Security

### Current Security Measures
- **SQL Injection Prevention**: Parameterized queries
- **Primary Key Uniqueness**: UUID generation prevents collisions
- **Data Isolation**: Country-based table separation

### Data Privacy Considerations
- **No Encryption**: Data stored in plain text
- **No Data Masking**: Full data visibility
- **No Audit Trail**: No tracking of data changes
- **No Data Retention Policy**: Data persists indefinitely

## Data Migration Patterns

### Country Table Selection
```python
def get_table_name(country):
    """Route data to appropriate country table"""
    country_table_mapping = {
        'usa': 'users_usa',
        'india': 'users_india'
    }
    
    if country.lower() in country_table_mapping:
        return country_table_mapping[country.lower()]
    else:
        raise ValueError("Invalid country")
```

### Data Consistency
- **Schema Consistency**: Both tables maintain identical structure
- **Data Integrity**: Primary key uniqueness enforced
- **Referential Integrity**: Not applicable (no foreign keys)

## Performance Characteristics

### Query Performance
- **Primary Key Lookups**: O(log n) with B-tree index
- **First Name Lookups**: O(n) without index (sequential scan)
- **Insert Performance**: O(log n) for primary key maintenance

### Optimization Opportunities
```sql
-- Recommended Indexes
CREATE INDEX idx_users_usa_first_name ON users_usa(first_name);
CREATE INDEX idx_users_india_first_name ON users_india(first_name);
CREATE INDEX idx_users_usa_age ON users_usa(age);
CREATE INDEX idx_users_india_age ON users_india(age);
```

## Data Model Evolution

### Current Version
- **Version**: 1.0 (inferred from schema)
- **Tables**: 2 active tables (users_usa, users_india)
- **Fields**: 7 fields per table
- **Relationships**: None

### Future Considerations
1. **Normalization**: Consider separate address table
2. **Additional Countries**: Scalable country table strategy
3. **User Authentication**: Add user credentials table
4. **Premium History**: Track premium calculations over time
5. **Audit Trail**: Add created_at, updated_at timestamps

### Schema Migration Strategy
```sql
-- Potential Future Schema Additions
ALTER TABLE users_usa ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users_usa ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Potential New Tables
CREATE TABLE countries (
    code TEXT PRIMARY KEY,
    name TEXT,
    currency_code TEXT,
    exchange_rate REAL
);

CREATE TABLE premium_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    calculated_at TIMESTAMP,
    premium_amount REAL,
    currency TEXT,
    FOREIGN KEY(user_id) REFERENCES users_usa(unique_id)
);
```

## Data Quality

### Current Data Quality Measures
- **Required Fields**: Enforced via application logic
- **Data Types**: Basic type enforcement via SQLite
- **Format Validation**: Client-side ZIP code pattern

### Data Quality Issues
- **No Server-Side Validation**: Relies heavily on client-side validation
- **No Data Constraints**: Minimal database constraints
- **No Data Cleansing**: No standardization of inputs
- **Duplicate Detection**: Only by first name (insufficient)

### Recommendations
1. Add comprehensive server-side validation
2. Implement proper constraint definitions
3. Add data standardization routines
4. Improve duplicate detection logic
5. Add data quality monitoring