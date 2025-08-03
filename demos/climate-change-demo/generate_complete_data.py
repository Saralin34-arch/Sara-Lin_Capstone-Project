import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_complete_temperature_data():
    """Generate complete temperature data for 2015-2025 with realistic seasonal patterns"""
    
    # Base temperature patterns for NYC (monthly averages)
    monthly_averages = {
        1: 32.0,  # January
        2: 35.0,  # February
        3: 43.0,  # March
        4: 53.0,  # April
        5: 63.0,  # May
        6: 72.0,  # June
        7: 77.0,  # July
        8: 76.0,  # August
        9: 68.0,  # September
        10: 57.0, # October
        11: 47.0, # November
        12: 37.0  # December
    }
    
    # Temperature variations (standard deviation)
    monthly_std = {
        1: 8.0,   # January
        2: 7.5,   # February
        3: 8.0,   # March
        4: 7.0,   # April
        5: 6.0,   # May
        6: 5.5,   # June
        7: 5.0,   # July
        8: 5.5,   # August
        9: 6.0,   # September
        10: 7.0,  # October
        11: 7.5,  # November
        12: 8.0   # December
    }
    
    # Climate change trend (warming over years) - 2015 as baseline
    yearly_trend = {
        2015: 0.0,
        2016: 0.5,
        2017: 1.0,
        2018: 1.5,
        2019: 2.0,
        2020: 2.5,
        2021: 3.0,
        2022: 3.5,
        2023: 4.0,
        2024: 4.5,
        2025: 5.0
    }
    
    data = []
    
    for year in range(2015, 2026):
        for month in range(1, 13):
            # Get number of days in this month
            if month == 12:
                next_month = datetime(year + 1, 1, 1)
            else:
                next_month = datetime(year, month + 1, 1)
            current_month = datetime(year, month, 1)
            days_in_month = (next_month - current_month).days
            
            base_temp = monthly_averages[month] + yearly_trend[year]
            std_temp = monthly_std[month]
            
            for day in range(1, days_in_month + 1):
                # Generate realistic daily temperature with some randomness
                daily_temp = np.random.normal(base_temp, std_temp)
                
                # Ensure temperatures stay within realistic bounds
                if month in [12, 1, 2]:  # Winter
                    daily_temp = max(10, min(60, daily_temp))
                elif month in [3, 4, 10, 11]:  # Spring/Fall
                    daily_temp = max(25, min(85, daily_temp))
                else:  # Summer
                    daily_temp = max(50, min(100, daily_temp))
                
                date_str = f"{year}-{month:02d}-{day:02d}"
                data.append([date_str, round(daily_temp, 1)])
    
    # Create DataFrame and save to CSV
    df = pd.DataFrame(data, columns=['date', 'value'])
    df.to_csv('nyc_temperature_complete_2015_2025.csv', index=False)
    print(f"Generated complete temperature data with {len(df)} records")
    print("Data covers all months from 2015-2025")
    
    return df

if __name__ == "__main__":
    generate_complete_temperature_data() 