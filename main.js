// AI Home Energy Coach - Main JavaScript File
// Minimalist design with environmental and architectural themes

// Global variables
let currentTool = 'draw-room';
let rooms = [];
let windows = [];
let doors = [];
let isDrawing = false;
let startX, startY;
let temperatureChart, energyChart;

// P5.js Sketch for Floor Plan Drawing with minimalist aesthetic
let sketch = function(p) {
  p.setup = function() {
    let canvas = p.createCanvas(600, 400);
    canvas.parent('p5-canvas');
    p.background(249, 250, 251);
    p.stroke(16, 185, 129); // Environmental green
    p.strokeWeight(2);
    p.noFill();
  };

  p.draw = function() {
    p.background(249, 250, 251);
    
    // Draw architectural grid
    p.stroke(229, 231, 235, 100);
    p.strokeWeight(1);
    for (let i = 0; i < p.width; i += 20) {
      p.line(i, 0, i, p.height);
    }
    for (let i = 0; i < p.height; i += 20) {
      p.line(0, i, p.width, i);
    }
    
    // Draw rooms with minimalist style
    p.stroke(16, 185, 129);
    p.strokeWeight(2);
    p.fill(16, 185, 129, 10);
    rooms.forEach(room => {
      p.rect(room.x, room.y, room.w, room.h);
      p.fill(16, 185, 129);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);
      p.textFont('Inter');
      p.text(room.name, room.x + room.w/2, room.y + room.h/2);
      p.noFill();
      p.stroke(16, 185, 129);
    });
    
    // Draw windows with architectural detail
    p.stroke(59, 130, 246); // Blue for windows
    p.strokeWeight(3);
    p.noFill();
    windows.forEach(window => {
      p.rect(window.x, window.y, window.w, window.h);
      // Add window frame detail
      p.line(window.x + window.w/2, window.y, window.x + window.w/2, window.y + window.h);
      p.line(window.x, window.y + window.h/2, window.x + window.w, window.y + window.h/2);
      p.fill(59, 130, 246);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(10);
      p.text('W', window.x + window.w/2, window.y + window.h/2);
      p.noFill();
      p.stroke(59, 130, 246);
    });
    
    // Draw doors with architectural detail
    p.stroke(107, 114, 128); // Gray for doors
    p.strokeWeight(3);
    p.noFill();
    doors.forEach(door => {
      p.rect(door.x, door.y, door.w, door.h);
      // Add door swing arc
      p.arc(door.x + door.w, door.y + door.h/2, 20, 20, -p.PI/2, p.PI/2);
      p.fill(107, 114, 128);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(10);
      p.text('D', door.x + door.w/2, door.y + door.h/2);
      p.noFill();
      p.stroke(107, 114, 128);
    });
    
    // Draw current selection with minimalist feedback
    if (isDrawing && currentTool === 'draw-room') {
      p.stroke(16, 185, 129, 150);
      p.strokeWeight(2);
      p.noFill();
      p.rect(startX, startY, p.mouseX - startX, p.mouseY - startY);
    }
  };

  p.mousePressed = function() {
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      if (currentTool === 'draw-room') {
        isDrawing = true;
        startX = p.mouseX;
        startY = p.mouseY;
      } else if (currentTool === 'add-window') {
        windows.push({
          x: p.mouseX - 15,
          y: p.mouseY - 5,
          w: 30,
          h: 10,
          orientation: getWindowOrientation(p.mouseX, p.mouseY)
        });
      } else if (currentTool === 'add-door') {
        doors.push({
          x: p.mouseX - 20,
          y: p.mouseY - 15,
          w: 40,
          h: 30
        });
      }
    }
  };

  p.mouseReleased = function() {
    if (isDrawing && currentTool === 'draw-room') {
      let roomName = prompt('Enter room name:');
      if (roomName) {
        rooms.push({
          x: Math.min(startX, p.mouseX),
          y: Math.min(startY, p.mouseY),
          w: Math.abs(p.mouseX - startX),
          h: Math.abs(p.mouseY - startY),
          name: roomName
        });
      }
      isDrawing = false;
    }
  };
};

// Helper function to determine window orientation
function getWindowOrientation(x, y) {
  let margin = 50;
  if (x < margin || x > 550 || y < margin || y > 350) {
    return 'exterior';
  }
  return 'interior';
}

// Initialize P5.js sketch
new p5(sketch);

// DOM Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Floor plan controls
  document.getElementById('draw-room').addEventListener('click', () => currentTool = 'draw-room');
  document.getElementById('add-window').addEventListener('click', () => currentTool = 'add-window');
  document.getElementById('add-door').addEventListener('click', () => currentTool = 'add-door');
  document.getElementById('clear-canvas').addEventListener('click', clearCanvas);
  
  // Analyze button
  document.getElementById('analyze-btn').addEventListener('click', analyzeHome);
  
  // Initialize charts with minimalist design
  initializeCharts();
  
  // Add architectural grid overlay to main content
  addArchitecturalElements();
});

// Clear canvas function
function clearCanvas() {
  rooms = [];
  windows = [];
  doors = [];
}

// Add architectural design elements
function addArchitecturalElements() {
  // Add grid overlay to main content
  const main = document.querySelector('main');
  main.classList.add('grid-overlay');
  
  // Add architectural accents to titles
  const titles = document.querySelectorAll('.project-title');
  titles.forEach(title => {
    title.classList.add('architectural-accent');
  });
}

// Main analysis function
function analyzeHome() {
  const zipcode = document.getElementById('zipcode').value;
  const buildingType = document.getElementById('building-type').value;
  const workFromHome = document.getElementById('work-from-home').checked;
  const windowsOpen = document.getElementById('windows-open').checked;
  const acHigh = document.getElementById('ac-high').checked;
  const cookingFrequent = document.getElementById('cooking-frequent').checked;
  
  // Validate inputs
  if (!zipcode || !buildingType || rooms.length === 0) {
    showError('Please fill in all required fields and draw at least one room.');
    return;
  }
  
  // Show loading state
  document.getElementById('analyze-btn').textContent = 'ANALYZING...';
  document.getElementById('analyze-btn').classList.add('loading');
  
  // Simulate AI analysis
  setTimeout(() => {
    generateRecommendations(zipcode, buildingType, workFromHome, windowsOpen, acHigh, cookingFrequent);
    updateCharts();
    document.getElementById('analyze-btn').textContent = 'ANALYZE MY HOME';
    document.getElementById('analyze-btn').classList.remove('loading');
  }, 2000);
}

// Generate AI recommendations with environmental focus
function generateRecommendations(zipcode, buildingType, workFromHome, windowsOpen, acHigh, cookingFrequent) {
  const recommendationsContainer = document.getElementById('recommendations-container');
  
  // Clear previous recommendations
  recommendationsContainer.innerHTML = '';
  
  // Add welcome message with environmental theme
  const welcomeMessage = document.createElement('div');
  welcomeMessage.className = 'coach-message';
  welcomeMessage.innerHTML = `
    <div class="coach-avatar">🌱</div>
    <div class="coach-text">
      <strong>Analysis Complete!</strong> Based on your home profile, here are my personalized recommendations to improve your comfort and reduce environmental impact.
    </div>
  `;
  recommendationsContainer.appendChild(welcomeMessage);
  
  // Generate recommendations based on inputs
  const recommendations = [];
  
  // Building type recommendations
  if (buildingType === 'apartment') {
    recommendations.push({
      title: 'Thermal Curtains for South-Facing Windows',
      description: 'Install thermal curtains on your south-facing windows to reduce heat gain by up to 25% during summer months.',
      impact: 'High',
      cost: 'Low',
      environmental_benefit: 'Reduces cooling energy by 25%'
    });
  }
  
  // Window usage recommendations
  if (windowsOpen) {
    recommendations.push({
      title: 'Optimize Natural Ventilation',
      description: 'Your habit of opening windows at night is excellent for passive cooling. Consider cross-ventilation strategies.',
      impact: 'Medium',
      cost: 'Free',
      environmental_benefit: 'Zero-energy cooling solution'
    });
  }
  
  // AC usage recommendations
  if (acHigh) {
    recommendations.push({
      title: 'Smart AC Scheduling',
      description: 'Instead of running AC on high after 6pm, try setting it to 78°F and using ceiling fans.',
      impact: 'High',
      cost: 'Free',
      environmental_benefit: 'Reduces carbon footprint by 20-30%'
    });
  }
  
  // Cooking recommendations
  if (cookingFrequent) {
    recommendations.push({
      title: 'Kitchen Ventilation Strategy',
      description: 'Use your range hood when cooking and consider opening a window to prevent heat buildup.',
      impact: 'Medium',
      cost: 'Free',
      environmental_benefit: 'Reduces need for additional cooling'
    });
  }
  
  // Work from home recommendations
  if (workFromHome) {
    recommendations.push({
      title: 'Zone Heating for Home Office',
      description: 'Since you work from home, consider using a space heater in your work area instead of heating the entire home.',
      impact: 'Medium',
      cost: 'Low',
      environmental_benefit: 'Reduces heating energy by 15-25%'
    });
  }
  
  // Add room-specific recommendations
  rooms.forEach(room => {
    const exteriorWindows = windows.filter(w => w.orientation === 'exterior' && 
      w.x >= room.x && w.x + w.w <= room.x + room.w &&
      w.y >= room.y && w.y + w.h <= room.y + room.h);
    
    if (exteriorWindows.length > 0) {
      recommendations.push({
        title: `${room.name} Window Optimization`,
        description: `Your ${room.name} has ${exteriorWindows.length} exterior window(s). Consider adding window film or thermal blinds.`,
        impact: 'Medium',
        cost: 'Low',
        environmental_benefit: 'Improves thermal efficiency by 30-50%'
      });
    }
  });
  
  // Add general recommendations
  recommendations.push({
    title: 'Smart Thermostat Installation',
    description: 'Consider installing a smart thermostat to automatically adjust temperature based on your schedule.',
    impact: 'High',
    cost: 'Medium',
    environmental_benefit: 'Reduces total energy consumption by 10-15%'
  });
  
  // Display recommendations with minimalist design
  recommendations.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    card.innerHTML = `
      <h4>${rec.title}</h4>
      <p>${rec.description}</p>
      <div class="tags">
        <span class="tag impact">Impact: ${rec.impact}</span>
        <span class="tag cost">Cost: ${rec.cost}</span>
        <span class="tag environmental" style="background: #059669; color: white;">${rec.environmental_benefit}</span>
      </div>
    `;
    recommendationsContainer.appendChild(card);
  });
}

// Initialize charts with minimalist design
function initializeCharts() {
  // Temperature chart
  const tempCtx = document.getElementById('temperature-chart').getContext('2d');
  temperatureChart = new Chart(tempCtx, {
    type: 'line',
    data: {
      labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'],
      datasets: [{
        label: 'Current Temperature',
        data: [72, 74, 78, 80, 82, 79, 75],
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        tension: 0.4,
        borderWidth: 2
      }, {
        label: 'Optimized Temperature',
        data: [70, 72, 76, 78, 78, 76, 72],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 5]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: '24-Hour Temperature Profile',
          font: {
            family: 'Inter',
            size: 16,
            weight: '600'
          },
          color: '#1a1a1a'
        },
        legend: {
          labels: {
            font: {
              family: 'Inter',
              size: 12
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 65,
          max: 85,
          grid: {
            color: '#e5e5e5'
          },
          ticks: {
            font: {
              family: 'Inter',
              size: 12
            }
          }
        },
        x: {
          grid: {
            color: '#e5e5e5'
          },
          ticks: {
            font: {
              family: 'Inter',
              size: 12
            }
          }
        }
      }
    }
  });
  
  // Energy usage chart
  const energyCtx = document.getElementById('energy-usage-chart').getContext('2d');
  energyChart = new Chart(energyCtx, {
    type: 'bar',
    data: {
      labels: ['Heating', 'Cooling', 'Lighting', 'Appliances', 'Electronics'],
      datasets: [{
        label: 'Current Usage (kWh)',
        data: [45, 38, 12, 18, 8],
        backgroundColor: [
          'rgba(107, 114, 128, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          '#6b7280',
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 1
      }, {
        label: 'Optimized Usage (kWh)',
        data: [35, 28, 8, 15, 6],
        backgroundColor: [
          'rgba(107, 114, 128, 0.4)',
          'rgba(59, 130, 246, 0.4)',
          'rgba(16, 185, 129, 0.4)',
          'rgba(245, 158, 11, 0.4)',
          'rgba(239, 68, 68, 0.4)'
        ],
        borderColor: [
          '#6b7280',
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Energy Usage Breakdown',
          font: {
            family: 'Inter',
            size: 16,
            weight: '600'
          },
          color: '#1a1a1a'
        },
        legend: {
          labels: {
            font: {
              family: 'Inter',
              size: 12
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'kWh per day',
            font: {
              family: 'Inter',
              size: 12
            }
          },
          grid: {
            color: '#e5e5e5'
          },
          ticks: {
            font: {
              family: 'Inter',
              size: 12
            }
          }
        },
        x: {
          grid: {
            color: '#e5e5e5'
          },
          ticks: {
            font: {
              family: 'Inter',
              size: 12
            }
          }
        }
      }
    }
  });
}

// Update charts with new data
function updateCharts() {
  // Update temperature chart with optimized data
  const optimizedTemp = [68, 70, 74, 76, 76, 74, 70];
  temperatureChart.data.datasets[1].data = optimizedTemp;
  temperatureChart.update();
  
  // Update energy chart with optimized data
  const optimizedEnergy = [32, 25, 7, 13, 5];
  energyChart.data.datasets[1].data = optimizedEnergy;
  energyChart.update();
}

// Show error message with minimalist design
function showError(message) {
  const recommendationsContainer = document.getElementById('recommendations-container');
  recommendationsContainer.innerHTML = `
    <div class="coach-message" style="background: #fef2f2; border-color: #fecaca; color: #991b1b;">
      <div class="coach-avatar" style="background: #ef4444;">⚠️</div>
      <div class="coach-text">
        <strong>Please complete all fields:</strong> ${message}
      </div>
    </div>
  `;
}

// Weather API integration (placeholder for future implementation)
async function getWeatherData(zipcode) {
  return {
    temperature: 75,
    humidity: 60,
    forecast: 'sunny'
  };
}

// Energy cost calculation (placeholder for future implementation)
function calculateEnergyCosts(usage) {
  const rate = 0.12; // $0.12 per kWh
  return usage * rate;
}

// Export functions for potential backend integration
window.AIHomeEnergyCoach = {
  analyzeHome,
  generateRecommendations,
  getWeatherData,
  calculateEnergyCosts
};
