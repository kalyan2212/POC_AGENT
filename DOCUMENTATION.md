# Insurance Search Project

This project implements an insurance search portal that supports both USA and India markets with automatic currency conversion.

## Features

### Core Functionality
- **Country Selection**: Users choose between USA and India on the landing page
- **Separate Databases**: Dedicated tables for USA and India insurance policies
- **Currency Conversion**: Automatic USD to INR conversion for Indian policies
- **Insurance Search**: Filter policies by type (Life, Health, Auto, Home, Business)
- **Responsive Design**: Works on desktop and mobile devices

### Database Structure
- **insurance_usa**: Contains USA insurance policies with USD pricing
- **insurance_india**: Contains India insurance policies with USD pricing (converted to INR on display)

### API Endpoints
- `GET /`: Landing page with country selection
- `GET /search/<country>`: Insurance search page for specific country
- `GET /api/types/<country>`: Get available insurance types for a country
- `GET /api/search/<country>`: Search insurance policies with optional type filter
- `GET /api/exchange-rate`: Get current USD to INR exchange rate

## Installation and Setup

### Prerequisites
- Python 3.7+
- pip package manager

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   cd app
   pip install -r requirements.txt
   ```

### Running the Application
```bash
cd app
python app.py
```

The application will be available at http://localhost:5000

## Project Structure
```
POC_AGENT/
├── app/
│   ├── app.py              # Main Flask application
│   ├── database.py         # Database operations
│   ├── currency.py         # Currency conversion utilities
│   ├── requirements.txt    # Python dependencies
│   └── test_insurance.py   # Test suite
├── database/
│   ├── schema.sql          # Database schema
│   └── sample_data.sql     # Sample insurance data
├── frontend/
│   └── static/
│       └── styles.css      # CSS styles (future enhancement)
└── README.md
```

## Database Schema

### insurance_usa Table
- `id`: Primary key
- `policy_name`: Name of the insurance policy
- `insurance_type`: Type (Life, Health, Auto, Home, Business)
- `coverage_amount`: Coverage amount in USD
- `premium_usd`: Premium amount in USD
- `provider`: Insurance provider name
- `description`: Policy description
- `created_at`: Timestamp

### insurance_india Table
- Same structure as insurance_usa
- Premiums stored in USD but displayed in INR

## Currency Conversion

The application uses a demo exchange rate of 83.50 USD to INR. In production, this would be replaced with a real-time currency API such as:
- ExchangeRate-API
- Fixer.io
- CurrencyLayer

## Testing

Run the test suite:
```bash
cd app
python test_insurance.py
```

Tests cover:
- Database operations
- Currency conversion
- API simulation

## Sample Data

The application includes sample insurance policies for both countries:

### USA Policies
- Life Protection Plus ($1,200/year for $500,000 coverage)
- Health Shield Premium ($800/year for $100,000 coverage)
- Auto Guardian ($600/year for $50,000 coverage)
- Home Secure ($900/year for $300,000 coverage)
- Business Shield ($2,500/year for $1,000,000 coverage)

### India Policies
- Jeevan Raksha ($400/year for $250,000 coverage)
- Swasthya Suraksha ($250/year for $50,000 coverage)
- Gaadi Suraksha ($180/year for $25,000 coverage)
- Ghar Suraksha ($300/year for $150,000 coverage)
- Vyavasaya Suraksha ($800/year for $500,000 coverage)

## Future Enhancements

1. **Real-time Currency API**: Replace fixed exchange rate with live data
2. **User Authentication**: Add user accounts and saved searches
3. **Advanced Filtering**: Filter by premium range, coverage amount, provider
4. **Comparison Feature**: Side-by-side policy comparison
5. **Email Quotes**: Send policy quotes via email
6. **Mobile App**: Native mobile applications
7. **Payment Integration**: Online premium payment
8. **Policy Management**: Track and manage purchased policies

## API Usage Examples

### Get Insurance Types
```bash
curl http://localhost:5000/api/types/usa
curl http://localhost:5000/api/types/india
```

### Search All Policies
```bash
curl http://localhost:5000/api/search/usa
curl http://localhost:5000/api/search/india
```

### Search by Type
```bash
curl "http://localhost:5000/api/search/usa?type=Auto%20Insurance"
curl "http://localhost:5000/api/search/india?type=Life%20Insurance"
```

### Get Exchange Rate
```bash
curl http://localhost:5000/api/exchange-rate
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is for demonstration purposes as part of a Proof of Concept (POC).