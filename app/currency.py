import requests
from typing import Optional

class CurrencyConverter:
    def __init__(self):
        # Using a fixed exchange rate for demo purposes
        # In production, you would fetch this from a real API
        self.usd_to_inr_rate = 83.50  # Approximate rate
    
    def get_exchange_rate(self) -> float:
        """
        Get USD to INR exchange rate
        For demo purposes, using a fixed rate.
        In production, integrate with a real currency API like:
        - https://api.exchangerate-api.com/
        - https://fixer.io/
        - https://currencylayer.com/
        """
        try:
            # Demo implementation with fixed rate
            return self.usd_to_inr_rate
        except Exception as e:
            print(f"Error fetching exchange rate: {e}")
            return self.usd_to_inr_rate  # Fallback to fixed rate
    
    def usd_to_inr(self, usd_amount: float) -> float:
        """Convert USD amount to INR"""
        rate = self.get_exchange_rate()
        return round(usd_amount * rate, 2)
    
    def format_currency_inr(self, amount: float) -> str:
        """Format amount as Indian Rupees"""
        return f"₹{amount:,.2f}"
    
    def format_currency_usd(self, amount: float) -> str:
        """Format amount as US Dollars"""
        return f"${amount:,.2f}"

# Global instance
currency_converter = CurrencyConverter()