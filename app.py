#!/usr/bin/env python3
"""
AI Home Energy Coach - Backend API
Flask application for AI-powered energy recommendations
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Mock AI model for energy prediction
class EnergyPredictionModel:
    def __init__(self):
        self.weather_data = {}
        self.building_types = {
            'apartment': {'insulation_factor': 0.7, 'thermal_mass': 0.8},
            'house': {'insulation_factor': 0.9, 'thermal_mass': 1.0},
            'studio': {'insulation_factor': 0.6, 'thermal_mass': 0.6},
            'loft': {'insulation_factor': 0.5, 'thermal_mass': 0.7}
        }
    
    def predict_energy_usage(self, home_data):
        """Predict energy usage based on home characteristics and habits"""
        building_type = home_data.get('building_type', 'apartment')
        rooms = home_data.get('rooms', [])
        windows = home_data.get('windows', [])
        habits = home_data.get('habits', {})
        zipcode = home_data.get('zipcode', '10027')
        
        # Base energy usage (kWh per day)
        base_usage = {
            'heating': 45,
            'cooling': 38,
            'lighting': 12,
            'appliances': 18,
            'electronics': 8
        }
        
        # Adjust based on building type
        insulation = self.building_types[building_type]['insulation_factor']
        thermal_mass = self.building_types[building_type]['thermal_mass']
        
        # Adjust based on room count and size
        room_factor = len(rooms) * 0.1 + 0.9
        
        # Adjust based on window count and orientation
        exterior_windows = [w for w in windows if w.get('orientation') == 'exterior']
        window_factor = 1 + len(exterior_windows) * 0.15
        
        # Adjust based on habits
        habit_adjustments = {
            'work_from_home': {'heating': 1.2, 'cooling': 1.1, 'lighting': 1.3},
            'windows_open': {'heating': 0.8, 'cooling': 0.9},
            'ac_high': {'cooling': 1.4},
            'cooking_frequent': {'appliances': 1.3, 'cooling': 1.1}
        }
        
        # Calculate adjusted usage
        adjusted_usage = {}
        for category, base in base_usage.items():
            adjustment = 1.0
            
            # Apply building and room factors
            if category in ['heating', 'cooling']:
                adjustment *= insulation * room_factor * window_factor
            
            # Apply habit adjustments
            for habit, checked in habits.items():
                if checked and habit in habit_adjustments:
                    if category in habit_adjustments[habit]:
                        adjustment *= habit_adjustments[habit][category]
            
            adjusted_usage[category] = round(base * adjustment, 1)
        
        return adjusted_usage
    
    def generate_recommendations(self, home_data, current_usage):
        """Generate personalized energy-saving recommendations"""
        recommendations = []
        building_type = home_data.get('building_type', 'apartment')
        rooms = home_data.get('rooms', [])
        windows = home_data.get('windows', [])
        habits = home_data.get('habits', {})
        
        # Building type recommendations
        if building_type == 'apartment':
            recommendations.append({
                'title': 'Thermal Curtains for South-Facing Windows',
                'description': 'Install thermal curtains on your south-facing windows to reduce heat gain by up to 25% during summer months.',
                'impact': 'High',
                'cost': 'Low',
                'estimated_savings': '15-25% cooling costs'
            })
        
        # Window optimization
        exterior_windows = [w for w in windows if w.get('orientation') == 'exterior']
        if len(exterior_windows) > 2:
            recommendations.append({
                'title': 'Window Film Installation',
                'description': f'Your home has {len(exterior_windows)} exterior windows. Low-E window film can reduce heat transfer by 30-50%.',
                'impact': 'Medium',
                'cost': 'Medium',
                'estimated_savings': '10-20% heating/cooling costs'
            })
        
        # Habit-based recommendations
        if habits.get('ac_high'):
            recommendations.append({
                'title': 'Smart AC Scheduling',
                'description': 'Instead of running AC on high after 6pm, try setting it to 78°F and using ceiling fans. This can save 20-30% on cooling costs.',
                'impact': 'High',
                'cost': 'Free',
                'estimated_savings': '20-30% cooling costs'
            })
        
        if habits.get('work_from_home'):
            recommendations.append({
                'title': 'Zone Heating for Home Office',
                'description': 'Since you work from home, consider using a space heater in your work area instead of heating the entire home.',
                'impact': 'Medium',
                'cost': 'Low',
                'estimated_savings': '15-25% heating costs'
            })
        
        # General recommendations
        recommendations.append({
            'title': 'Smart Thermostat Installation',
            'description': 'Consider installing a smart thermostat to automatically adjust temperature based on your schedule and preferences.',
            'impact': 'High',
            'cost': 'Medium',
            'estimated_savings': '10-15% total energy costs'
        })
        
        return recommendations
    
    def predict_temperature_profile(self, home_data, weather_data=None):
        """Predict 24-hour temperature profile"""
        # Mock temperature data - in real implementation, this would use weather APIs
        base_temp = [72, 74, 78, 80, 82, 79, 75]  # 6AM, 9AM, 12PM, 3PM, 6PM, 9PM, 12AM
        
        # Adjust based on building characteristics
        building_type = home_data.get('building_type', 'apartment')
        insulation = self.building_types[building_type]['insulation_factor']
        
        # Create optimized profile (better insulation, smarter usage)
        optimized_temp = [t - 2 for t in base_temp]  # 2 degrees lower on average
        
        return {
            'current': base_temp,
            'optimized': optimized_temp,
            'labels': ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM']
        }

# Initialize the model
model = EnergyPredictionModel()

@app.route('/')
def index():
    """Serve the main application"""
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_home():
    """Analyze home data and provide recommendations"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['zipcode', 'building_type', 'rooms']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Predict energy usage
        current_usage = model.predict_energy_usage(data)
        
        # Generate recommendations
        recommendations = model.generate_recommendations(data, current_usage)
        
        # Predict temperature profile
        temperature_profile = model.predict_temperature_profile(data)
        
        # Calculate potential savings
        total_current = sum(current_usage.values())
        optimized_usage = {k: v * 0.8 for k, v in current_usage.items()}  # 20% reduction
        total_optimized = sum(optimized_usage.values())
        potential_savings = total_current - total_optimized
        
        response = {
            'success': True,
            'current_usage': current_usage,
            'optimized_usage': optimized_usage,
            'recommendations': recommendations,
            'temperature_profile': temperature_profile,
            'potential_savings': round(potential_savings, 1),
            'analysis_timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather/<zipcode>')
def get_weather(zipcode):
    """Get weather data for a zipcode (mock implementation)"""
    # In real implementation, this would call a weather API
    weather_data = {
        'temperature': 75,
        'humidity': 60,
        'forecast': 'sunny',
        'zipcode': zipcode,
        'timestamp': datetime.now().isoformat()
    }
    return jsonify(weather_data)

@app.route('/api/energy-rates/<zipcode>')
def get_energy_rates(zipcode):
    """Get energy rates for a zipcode (mock implementation)"""
    # In real implementation, this would call utility APIs
    rates = {
        'electricity': 0.12,  # $ per kWh
        'gas': 0.08,         # $ per therm
        'zipcode': zipcode,
        'timestamp': datetime.now().isoformat()
    }
    return jsonify(rates)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    # For development
    app.run(debug=True, host='0.0.0.0', port=5000) 