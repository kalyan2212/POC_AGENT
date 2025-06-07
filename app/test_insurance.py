#!/usr/bin/env python3
"""
Simple test script for the insurance search project
"""
import sys
import os
sys.path.append(os.path.dirname(__file__))

from database import DatabaseManager
from currency import currency_converter

def test_database():
    """Test database functionality"""
    print("Testing database...")
    db = DatabaseManager()
    
    # Test USA search
    usa_policies = db.search_insurance_usa()
    assert len(usa_policies) > 0, "No USA policies found"
    print(f"✓ Found {len(usa_policies)} USA policies")
    
    # Test India search
    india_policies = db.search_insurance_india()
    assert len(india_policies) > 0, "No India policies found"
    print(f"✓ Found {len(india_policies)} India policies")
    
    # Test filtering
    usa_auto = db.search_insurance_usa("Auto Insurance")
    assert len(usa_auto) > 0, "No USA auto insurance found"
    print(f"✓ Found {len(usa_auto)} USA auto insurance policies")
    
    india_auto = db.search_insurance_india("Auto Insurance")
    assert len(india_auto) > 0, "No India auto insurance found"
    print(f"✓ Found {len(india_auto)} India auto insurance policies")
    
    # Test insurance types
    usa_types = db.get_insurance_types_usa()
    india_types = db.get_insurance_types_india()
    assert len(usa_types) > 0, "No USA insurance types found"
    assert len(india_types) > 0, "No India insurance types found"
    print(f"✓ Found {len(usa_types)} USA insurance types and {len(india_types)} India types")

def test_currency_conversion():
    """Test currency conversion functionality"""
    print("\nTesting currency conversion...")
    
    # Test exchange rate
    rate = currency_converter.get_exchange_rate()
    assert rate > 0, "Invalid exchange rate"
    print(f"✓ Exchange rate: {rate}")
    
    # Test USD to INR conversion
    usd_amount = 100
    inr_amount = currency_converter.usd_to_inr(usd_amount)
    expected_inr = usd_amount * rate
    assert abs(inr_amount - expected_inr) < 0.01, "Incorrect conversion"
    print(f"✓ ${usd_amount} = ₹{inr_amount}")
    
    # Test formatting
    usd_formatted = currency_converter.format_currency_usd(1000)
    inr_formatted = currency_converter.format_currency_inr(83500)
    assert "$" in usd_formatted, "USD formatting failed"
    assert "₹" in inr_formatted, "INR formatting failed"
    print(f"✓ Formatting: {usd_formatted}, {inr_formatted}")

def test_api_simulation():
    """Simulate API calls"""
    print("\nTesting API simulation...")
    db = DatabaseManager()
    
    # Simulate USA search with currency formatting
    usa_policies = db.search_insurance_usa()
    for policy in usa_policies:
        policy['premium_formatted'] = currency_converter.format_currency_usd(policy['premium_usd'])
        policy['coverage_formatted'] = currency_converter.format_currency_usd(policy['coverage_amount'])
    print(f"✓ Formatted {len(usa_policies)} USA policies with USD")
    
    # Simulate India search with currency conversion
    india_policies = db.search_insurance_india()
    for policy in india_policies:
        premium_inr = currency_converter.usd_to_inr(policy['premium_usd'])
        coverage_inr = currency_converter.usd_to_inr(policy['coverage_amount'])
        policy['premium_formatted'] = currency_converter.format_currency_inr(premium_inr)
        policy['coverage_formatted'] = currency_converter.format_currency_inr(coverage_inr)
    print(f"✓ Formatted {len(india_policies)} India policies with INR conversion")

if __name__ == "__main__":
    try:
        test_database()
        test_currency_conversion()
        test_api_simulation()
        print("\n🎉 All tests passed!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)