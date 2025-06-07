from flask import Flask, request, jsonify, render_template_string
import os
from database import DatabaseManager
from currency import currency_converter

app = Flask(__name__)

# Initialize database
db = DatabaseManager()

@app.route('/')
def index():
    """Landing page for country selection"""
    return render_template_string("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insurance Search - Select Country</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
        .country-selection {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 30px;
        }
        .country-card {
            background: #f8f9fa;
            border: 2px solid #ddd;
            border-radius: 10px;
            padding: 30px;
            cursor: pointer;
            transition: all 0.3s;
            min-width: 200px;
        }
        .country-card:hover {
            border-color: #007bff;
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .country-card h2 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .country-card p {
            margin: 0;
            color: #666;
        }
        .flag {
            font-size: 48px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Insurance Search Portal</h1>
        <p>Select your country to find the best insurance policies</p>
        
        <div class="country-selection">
            <div class="country-card" onclick="selectCountry('usa')">
                <div class="flag">🇺🇸</div>
                <h2>United States</h2>
                <p>Search insurance policies in USD</p>
            </div>
            
            <div class="country-card" onclick="selectCountry('india')">
                <div class="flag">🇮🇳</div>
                <h2>India</h2>
                <p>Search insurance policies with INR conversion</p>
            </div>
        </div>
    </div>

    <script>
        function selectCountry(country) {
            window.location.href = '/search/' + country;
        }
    </script>
</body>
</html>
    """)

@app.route('/search/<country>')
def search_page(country):
    """Insurance search page for specific country"""
    if country not in ['usa', 'india']:
        return "Invalid country", 400
    
    return render_template_string("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insurance Search - {{ country.upper() }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .search-form {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .results {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .policy-card {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 15px;
            background: #f9f9f9;
        }
        .policy-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .premium {
            font-size: 18px;
            font-weight: bold;
            color: #28a745;
        }
        select, button {
            padding: 10px;
            margin: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        button {
            background: #007bff;
            color: white;
            cursor: pointer;
        }
        button:hover {
            background: #0056b3;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #007bff;
            text-decoration: none;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <a href="/" class="back-link">← Back to Country Selection</a>
    
    <div class="header">
        <h1>Insurance Search - {{ country.upper() }}</h1>
        <p>Find the best insurance policies for {{ country.title() }}</p>
    </div>
    
    <div class="search-form">
        <label for="insuranceType">Filter by Insurance Type:</label>
        <select id="insuranceType">
            <option value="">All Types</option>
        </select>
        <button onclick="searchPolicies()">Search</button>
    </div>
    
    <div class="results" id="results">
        <p>Loading policies...</p>
    </div>

    <script>
        const country = '{{ country }}';
        
        // Load insurance types and initial results
        document.addEventListener('DOMContentLoaded', function() {
            loadInsuranceTypes();
            searchPolicies();
        });
        
        async function loadInsuranceTypes() {
            try {
                const response = await fetch(`/api/types/${country}`);
                const types = await response.json();
                const select = document.getElementById('insuranceType');
                
                types.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading insurance types:', error);
            }
        }
        
        async function searchPolicies() {
            const type = document.getElementById('insuranceType').value;
            const resultsDiv = document.getElementById('results');
            
            try {
                resultsDiv.innerHTML = '<p>Searching...</p>';
                
                let url = `/api/search/${country}`;
                if (type) {
                    url += `?type=${encodeURIComponent(type)}`;
                }
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.policies && data.policies.length > 0) {
                    let html = '<h2>Available Policies</h2>';
                    data.policies.forEach(policy => {
                        html += `
                            <div class="policy-card">
                                <h3>${policy.policy_name}</h3>
                                <p><strong>Type:</strong> ${policy.insurance_type}</p>
                                <p><strong>Provider:</strong> ${policy.provider}</p>
                                <p><strong>Coverage:</strong> ${policy.coverage_formatted}</p>
                                <p><strong>Premium:</strong> <span class="premium">${policy.premium_formatted}</span></p>
                                <p><strong>Description:</strong> ${policy.description}</p>
                            </div>
                        `;
                    });
                    resultsDiv.innerHTML = html;
                } else {
                    resultsDiv.innerHTML = '<p>No policies found.</p>';
                }
            } catch (error) {
                console.error('Error searching policies:', error);
                resultsDiv.innerHTML = '<p>Error loading policies. Please try again.</p>';
            }
        }
    </script>
</body>
</html>
    """, country=country)

@app.route('/api/types/<country>')
def get_insurance_types(country):
    """Get available insurance types for a country"""
    try:
        if country == 'usa':
            types = db.get_insurance_types_usa()
        elif country == 'india':
            types = db.get_insurance_types_india()
        else:
            return jsonify({'error': 'Invalid country'}), 400
        
        return jsonify(types)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search/<country>')
def search_insurance(country):
    """Search insurance policies for a country"""
    try:
        insurance_type = request.args.get('type')
        
        if country == 'usa':
            policies = db.search_insurance_usa(insurance_type)
            # Format USD amounts
            for policy in policies:
                policy['premium_formatted'] = currency_converter.format_currency_usd(policy['premium_usd'])
                policy['coverage_formatted'] = currency_converter.format_currency_usd(policy['coverage_amount'])
        elif country == 'india':
            policies = db.search_insurance_india(insurance_type)
            # Convert USD to INR and format
            for policy in policies:
                premium_inr = currency_converter.usd_to_inr(policy['premium_usd'])
                coverage_inr = currency_converter.usd_to_inr(policy['coverage_amount'])
                policy['premium_formatted'] = currency_converter.format_currency_inr(premium_inr)
                policy['coverage_formatted'] = currency_converter.format_currency_inr(coverage_inr)
                policy['premium_inr'] = premium_inr
                policy['coverage_inr'] = coverage_inr
        else:
            return jsonify({'error': 'Invalid country'}), 400
        
        return jsonify({
            'country': country,
            'policies': policies,
            'total': len(policies)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/exchange-rate')
def get_exchange_rate():
    """Get current USD to INR exchange rate"""
    try:
        rate = currency_converter.get_exchange_rate()
        return jsonify({
            'usd_to_inr': rate,
            'source': 'demo_fixed_rate'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)