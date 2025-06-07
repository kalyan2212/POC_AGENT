#!/usr/bin/env python3
"""
Demo script for the insurance search project
Demonstrates all key features:
1. Database separation (USA/India)
2. Currency conversion (USD to INR)
3. Insurance search and filtering
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from database import DatabaseManager
from currency import currency_converter

def demo_database_separation():
    """Demonstrate separate databases for USA and India"""
    print("🗃️  DEMO: Database Separation")
    print("="*50)
    
    db = DatabaseManager()
    
    # Show USA policies
    usa_policies = db.search_insurance_usa()
    print(f"📊 USA Database: {len(usa_policies)} policies")
    for policy in usa_policies[:2]:  # Show first 2
        print(f"   • {policy['policy_name']} - {policy['insurance_type']}")
    
    # Show India policies
    india_policies = db.search_insurance_india()
    print(f"📊 India Database: {len(india_policies)} policies")
    for policy in india_policies[:2]:  # Show first 2
        print(f"   • {policy['policy_name']} - {policy['insurance_type']}")
    
    print()

def demo_currency_conversion():
    """Demonstrate USD to INR currency conversion"""
    print("💱 DEMO: Currency Conversion")
    print("="*50)
    
    # Show exchange rate
    rate = currency_converter.get_exchange_rate()
    print(f"💲 Current Exchange Rate: 1 USD = {rate} INR")
    
    # Convert sample amounts
    test_amounts = [100, 500, 1000, 5000]
    print("\n🔄 Sample Conversions:")
    for usd in test_amounts:
        inr = currency_converter.usd_to_inr(usd)
        usd_formatted = currency_converter.format_currency_usd(usd)
        inr_formatted = currency_converter.format_currency_inr(inr)
        print(f"   {usd_formatted} → {inr_formatted}")
    
    print()

def demo_search_functionality():
    """Demonstrate insurance search and filtering"""
    print("🔍 DEMO: Search and Filtering")
    print("="*50)
    
    db = DatabaseManager()
    
    # Show available insurance types
    usa_types = db.get_insurance_types_usa()
    india_types = db.get_insurance_types_india()
    print(f"📝 Available Insurance Types:")
    print(f"   USA: {', '.join(usa_types)}")
    print(f"   India: {', '.join(india_types)}")
    
    # Demonstrate filtering by type
    print(f"\n🎯 Filtered Search Example - Auto Insurance:")
    
    # USA Auto Insurance
    usa_auto = db.search_insurance_usa("Auto Insurance")
    if usa_auto:
        policy = usa_auto[0]
        premium_usd = currency_converter.format_currency_usd(policy['premium_usd'])
        print(f"   USA: {policy['policy_name']} - {premium_usd}/year")
    
    # India Auto Insurance with conversion
    india_auto = db.search_insurance_india("Auto Insurance")
    if india_auto:
        policy = india_auto[0]
        premium_usd = policy['premium_usd']
        premium_inr = currency_converter.usd_to_inr(premium_usd)
        premium_inr_formatted = currency_converter.format_currency_inr(premium_inr)
        print(f"   India: {policy['policy_name']} - {premium_inr_formatted}/year")
    
    print()

def demo_api_simulation():
    """Simulate the API responses for both countries"""
    print("🌐 DEMO: API Response Simulation")
    print("="*50)
    
    db = DatabaseManager()
    
    # Simulate USA API response
    print("🇺🇸 USA API Response (with USD formatting):")
    usa_policies = db.search_insurance_usa("Life Insurance")
    for policy in usa_policies:
        policy['premium_formatted'] = currency_converter.format_currency_usd(policy['premium_usd'])
        policy['coverage_formatted'] = currency_converter.format_currency_usd(policy['coverage_amount'])
        print(f"   {policy['policy_name']}: {policy['premium_formatted']} for {policy['coverage_formatted']} coverage")
    
    print("\n🇮🇳 India API Response (with INR conversion):")
    india_policies = db.search_insurance_india("Life Insurance")
    for policy in india_policies:
        premium_inr = currency_converter.usd_to_inr(policy['premium_usd'])
        coverage_inr = currency_converter.usd_to_inr(policy['coverage_amount'])
        policy['premium_formatted'] = currency_converter.format_currency_inr(premium_inr)
        policy['coverage_formatted'] = currency_converter.format_currency_inr(coverage_inr)
        print(f"   {policy['policy_name']}: {policy['premium_formatted']} for {policy['coverage_formatted']} coverage")
    
    print()

def main():
    """Run all demonstrations"""
    print("🎭 INSURANCE SEARCH PROJECT DEMONSTRATION")
    print("="*60)
    print("This demo shows the key features implemented:")
    print("1. Separate databases for USA and India")
    print("2. Currency conversion from USD to INR")
    print("3. Search and filtering functionality")
    print("4. API response formatting\n")
    
    try:
        demo_database_separation()
        demo_currency_conversion()
        demo_search_functionality()
        demo_api_simulation()
        
        print("✅ DEMO COMPLETED SUCCESSFULLY!")
        print("\n🚀 To run the web application:")
        print("   cd app && python app.py")
        print("   Then visit: http://localhost:5000")
        
    except Exception as e:
        print(f"❌ Demo failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()