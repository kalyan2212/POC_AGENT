# POC_AGENT - Insurance Search Project

This repository contains an enhanced insurance search application that supports both USA and India markets with automatic currency conversion.

## Quick Start

1. **Install dependencies:**
   ```bash
   cd app
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Access the application:**
   Open http://localhost:5000 in your browser

## Features

- **Dual Country Support**: Separate insurance databases for USA and India
- **Smart Currency Conversion**: Automatic USD to INR conversion for Indian policies
- **Interactive Web Interface**: Country selection and policy search
- **RESTful API**: JSON endpoints for programmatic access
- **Comprehensive Search**: Filter by insurance type (Life, Health, Auto, Home, Business)

## Project Structure

- `/app` - Python Flask backend with APIs and database
- `/database` - SQL schema and sample data
- `/frontend` - Static web assets
- `DOCUMENTATION.md` - Detailed project documentation

## API Endpoints

- `GET /api/search/usa` - Search USA insurance policies
- `GET /api/search/india` - Search India insurance policies (with INR conversion)
- `GET /api/types/<country>` - Get available insurance types
- `GET /api/exchange-rate` - Get USD to INR exchange rate

See `DOCUMENTATION.md` for complete API documentation and examples.
