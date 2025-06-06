// FORFX Strategic Expansion Analysis Dashboard
const dashboardData = {
  "global_metrics": {
    "total_addressable_market": "$18.1B",
    "weighted_average_growth": "17.6%",
    "investment_requirement": "$2.25M",
    "projected_roi": "265%"
  },
  "competitive_landscape": [
    {"company": "DNA Funded", "market_presence": "9.7/10", "challenge_fee": "$49", "max_funding": "Varies", "key_focus": "Market presence"},
    {"company": "FTMO", "market_presence": "9.2/10", "challenge_fee": "$155", "max_funding": "$200K", "key_focus": "Market presence"},
    {"company": "FundedNext", "market_presence": "8.8/10", "challenge_fee": "$59", "max_funding": "$4M", "key_focus": "Market presence"},
    {"company": "OANDA Prop Trader", "market_presence": "8.5/10", "challenge_fee": "undefined", "max_funding": "undefined", "key_focus": "Regulatory credibility"},
    {"company": "City Traders Imperium", "market_presence": "8.2/10", "challenge_fee": "undefined", "max_funding": "undefined", "key_focus": "Maximum profit sharing"}
  ],
  "investment_phases": [
    {"phase": "Phase 1", "timeline": "3-4 months", "markets": "UAE & Singapore", "investment": "$750,000", "target": "1,000 funded traders"},
    {"phase": "Phase 2", "timeline": "5 months", "markets": "Brazil", "investment": "$850,000", "target": "1,200 funded traders"},
    {"phase": "Phase 3", "timeline": "6 months", "markets": "Switzerland", "investment": "$650,000", "target": "400 premium traders"}
  ],
  "revenue_projections": [
    {"month": "Month 1", "revenue": 120},
    {"month": "Month 3", "revenue": 380},
    {"month": "Month 6", "revenue": 720},
    {"month": "Month 9", "revenue": 1150},
    {"month": "Month 12", "revenue": 1680},
    {"month": "Month 15", "revenue": 2240},
    {"month": "Month 18", "revenue": 2850},
    {"month": "Month 21", "revenue": 3420},
    {"month": "Month 24", "revenue": 4200}
  ]
};

// FORFX Brand Colors
const colors = {
  primary: '#8d40bc',
  secondary: '#9f65dc',
  tertiary: '#d1cbc7',
  background: '#1e1329',
  cardBg: 'rgba(141, 64, 188, 0.1)',
  borderColor: 'rgba(159, 101, 220, 0.3)',
  textPrimary: '#d1cbc7',
  textSecondary: 'rgba(209, 203, 199, 0.8)',
  gradients: [
    '#8d40bc', '#9f65dc', '#b584e6', '#cba3f0', '#d1cbc7'
  ]
};

// Chart.js default configurations
if (typeof Chart !== 'undefined') {
  Chart.defaults.color = colors.textPrimary;
  Chart.defaults.backgroundColor = colors.primary;
  Chart.defaults.borderColor = colors.borderColor;
}

// Global variables for charts
let charts = {};

// Debug logging function
function debugLog(message, data = null) {
  console.log(`[FORFX Dashboard] ${message}`, data || '');
}

// Navigation functionality - FIXED VERSION
function initializeNavigation() {
  debugLog('Initializing navigation...');
  
  // Get all navigation links and sections
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  
  debugLog(`Found ${navLinks.length} nav links and ${sections.length} sections`);

  navLinks.forEach((link, index) => {
    debugLog(`Setting up nav link ${index}: ${link.getAttribute('href')}`);
    
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const href = this.getAttribute('href');
      const targetId = href ? href.substring(1) : '';
      
      debugLog(`Navigation clicked: ${targetId}`);
      
      if (!targetId) {
        debugLog('No target ID found');
        return;
      }
      
      // Remove active class from all nav links
      navLinks.forEach(nl => nl.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Hide all sections
      sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
      });
      
      // Show target section
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        debugLog(`Showing section: ${targetId}`);
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        
        // Trigger chart redraw if this section has charts
        setTimeout(() => {
          if (charts.competitor && targetId === 'competitive') {
            charts.competitor.resize();
          }
          if (charts.revenue && targetId === 'investment') {
            charts.revenue.resize();
          }
        }, 100);
      } else {
        debugLog(`Target section not found: ${targetId}`);
      }
    });
  });
  
  debugLog('Navigation initialized successfully');
}

// Populate competitor table
function populateCompetitorTable() {
  debugLog('Populating competitor table...');
  const tableBody = document.getElementById('competitorTableBody');
  if (!tableBody) {
    debugLog('Competitor table body not found');
    return;
  }
  
  tableBody.innerHTML = '';
  
  dashboardData.competitive_landscape.forEach(competitor => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${competitor.company}</strong></td>
      <td><span style="color: ${colors.secondary}; font-weight: 600;">${competitor.market_presence}</span></td>
      <td>${competitor.challenge_fee}</td>
      <td>${competitor.max_funding}</td>
      <td>${competitor.key_focus}</td>
    `;
    tableBody.appendChild(row);
  });
  debugLog('Competitor table populated successfully');
}

// Create competitor chart
function createCompetitorChart() {
  debugLog('Creating competitor chart...');
  const ctx = document.getElementById('competitorChart');
  if (!ctx) {
    debugLog('Competitor chart canvas not found');
    return;
  }
  
  if (charts.competitor) {
    charts.competitor.destroy();
  }
  
  try {
    const presenceData = dashboardData.competitive_landscape.map(c => {
      const score = parseFloat(c.market_presence.split('/')[0]);
      return score;
    });
    
    charts.competitor = new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: dashboardData.competitive_landscape.map(d => d.company),
        datasets: [{
          label: 'Market Presence Score',
          data: presenceData,
          backgroundColor: colors.gradients,
          borderColor: colors.primary,
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: colors.textPrimary,
              font: { family: 'Poppins', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: colors.cardBg,
            titleColor: colors.textPrimary,
            bodyColor: colors.textPrimary,
            borderColor: colors.borderColor,
            borderWidth: 1,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 10,
            grid: { color: colors.borderColor },
            ticks: { color: colors.textPrimary, font: { family: 'Poppins' } }
          },
          y: {
            grid: { color: colors.borderColor },
            ticks: { color: colors.textPrimary, font: { family: 'Poppins' } }
          }
        }
      }
    });
    debugLog('Competitor chart created successfully');
  } catch (error) {
    debugLog('Error creating competitor chart:', error);
  }
}

// Create revenue projections chart
function createRevenueChart() {
  debugLog('Creating revenue chart...');
  const ctx = document.getElementById('revenueChart');
  if (!ctx) {
    debugLog('Revenue chart canvas not found');
    return;
  }
  
  if (charts.revenue) {
    charts.revenue.destroy();
  }
  
  try {
    charts.revenue = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: dashboardData.revenue_projections.map(d => d.month),
        datasets: [{
          label: 'Revenue ($K)',
          data: dashboardData.revenue_projections.map(d => d.revenue),
          borderColor: colors.primary,
          backgroundColor: colors.secondary,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.primary,
          pointBorderColor: colors.secondary,
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: colors.textPrimary,
              font: { family: 'Poppins', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: colors.cardBg,
            titleColor: colors.textPrimary,
            bodyColor: colors.textPrimary,
            borderColor: colors.borderColor,
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return `Revenue: $${context.parsed.y}K`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: colors.borderColor },
            ticks: { 
              color: colors.textPrimary, 
              font: { family: 'Poppins' },
              maxRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: colors.borderColor },
            ticks: { 
              color: colors.textPrimary, 
              font: { family: 'Poppins' },
              callback: function(value) {
                return '$' + value + 'K';
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
    debugLog('Revenue chart created successfully');
  } catch (error) {
    debugLog('Error creating revenue chart:', error);
  }
}

// Initialize all charts with proper sequencing
function initializeCharts() {
  debugLog('Starting chart initialization sequence...');
  
  // Check if Chart.js is available
  if (typeof Chart === 'undefined') {
    debugLog('Chart.js not loaded yet, retrying...');
    setTimeout(initializeCharts, 300);
    return;
  }

  debugLog('Chart.js is available, proceeding with chart creation...');
  
  // Create charts with delays to ensure proper initialization
  setTimeout(() => {
    try {
      createCompetitorChart();
    } catch (error) {
      debugLog('Error creating competitor chart:', error);
    }
  }, 200);
  
  setTimeout(() => {
    try {
      createRevenueChart();
    } catch (error) {
      debugLog('Error creating revenue chart:', error);
    }
  }, 400);
  
  debugLog('Chart initialization sequence started');
}

// Enhanced user experience functions
function enhanceUserExperience() {
  debugLog('Enhancing user experience...');
  
  // Add smooth animations to cards
  const cards = document.querySelectorAll('.metric-card, .region-card, .phase-card, .gtm-card, .roadmap-phase');
  cards.forEach((card, index) => {
    // Stagger the animation
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });

  // Add hover effects
  const metricCards = document.querySelectorAll('.metric-card');
  metricCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  debugLog('User experience enhancements applied');
}

// Main initialization function
function initializeDashboard() {
  debugLog('=== FORFX Strategic Expansion Dashboard Initialization Started ===');
  
  try {
    // Core functionality first
    initializeNavigation();
    
    // Populate data
    populateCompetitorTable();
    
    // Initialize charts
    initializeCharts();
    
    // Enhanced features
    enhanceUserExperience();
    
    // Ensure the overview section is visible by default
    const overviewSection = document.getElementById('overview');
    if (overviewSection) {
      overviewSection.classList.add('active');
      overviewSection.style.display = 'block';
    }
    
    // Ensure overview nav link is active
    const overviewLink = document.querySelector('.nav-link[href="#overview"]');
    if (overviewLink) {
      overviewLink.classList.add('active');
    }
    
    debugLog('=== Dashboard initialization complete! ===');
  } catch (error) {
    debugLog('Error during dashboard initialization:', error);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  debugLog('DOM Content Loaded - Starting dashboard initialization...');
  initializeDashboard();
});

// Handle window resize for charts
window.addEventListener('resize', function() {
  debugLog('Window resized - updating charts...');
  Object.values(charts).forEach(chart => {
    if (chart && typeof chart.resize === 'function') {
      try {
        chart.resize();
      } catch (error) {
        debugLog('Error resizing chart:', error);
      }
    }
  });
});

// Export for debugging
window.FORFX_DASHBOARD = {
  charts,
  dashboardData,
  colors,
  debugLog,
  initializeCharts,
  createCompetitorChart,
  createRevenueChart,
  initializeNavigation
};

debugLog('FORFX Dashboard script loaded successfully');