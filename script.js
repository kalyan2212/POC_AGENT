// Sample tracking data for demonstration
const trackingData = {
    '123456789012': {
        status: 'Out for Delivery',
        statusType: 'active',
        shipmentFacts: {
            service: 'Express Overnight',
            weight: '2.5 lbs',
            dimensions: '12" x 8" x 4"',
            shipDate: 'Dec 5, 2024'
        },
        deliveryInfo: {
            recipient: 'John Smith',
            address: '123 Main Street\nNew York, NY 10001\nUnited States'
        },
        timeline: [
            {
                step: 1,
                title: 'Package Shipped',
                date: 'Dec 5, 2024 • 2:30 PM',
                location: 'Chicago, IL',
                status: 'completed',
                icon: '✓'
            },
            {
                step: 2,
                title: 'In Transit',
                date: 'Dec 6, 2024 • 8:15 AM',
                location: 'Indianapolis, IN',
                status: 'completed',
                icon: '✓'
            },
            {
                step: 3,
                title: 'Out for Delivery',
                date: 'Today • 9:45 AM',
                location: 'New York, NY',
                status: 'active',
                icon: '📦'
            },
            {
                step: 4,
                title: 'Delivered',
                date: 'Expected today by 6:00 PM',
                location: 'New York, NY',
                status: 'pending',
                icon: '🏠'
            }
        ],
        history: [
            {
                date: 'Dec 7, 2024',
                time: '9:45 AM',
                status: 'Out for delivery',
                location: 'NEW YORK, NY'
            },
            {
                date: 'Dec 6, 2024',
                time: '8:15 AM',
                status: 'At destination sort facility',
                location: 'INDIANAPOLIS, IN'
            },
            {
                date: 'Dec 5, 2024',
                time: '11:30 PM',
                status: 'Departed shipping facility',
                location: 'CHICAGO, IL'
            },
            {
                date: 'Dec 5, 2024',
                time: '2:30 PM',
                status: 'Package shipped',
                location: 'CHICAGO, IL'
            }
        ]
    },
    '987654321098': {
        status: 'Delivered',
        statusType: 'completed',
        shipmentFacts: {
            service: 'Ground Service',
            weight: '1.2 lbs',
            dimensions: '8" x 6" x 2"',
            shipDate: 'Dec 3, 2024'
        },
        deliveryInfo: {
            recipient: 'Jane Doe',
            address: '456 Oak Avenue\nLos Angeles, CA 90210\nUnited States'
        },
        timeline: [
            {
                step: 1,
                title: 'Package Shipped',
                date: 'Dec 3, 2024 • 1:15 PM',
                location: 'Phoenix, AZ',
                status: 'completed',
                icon: '✓'
            },
            {
                step: 2,
                title: 'In Transit',
                date: 'Dec 4, 2024 • 6:30 AM',
                location: 'Los Angeles, CA',
                status: 'completed',
                icon: '✓'
            },
            {
                step: 3,
                title: 'Out for Delivery',
                date: 'Dec 5, 2024 • 8:00 AM',
                location: 'Los Angeles, CA',
                status: 'completed',
                icon: '✓'
            },
            {
                step: 4,
                title: 'Delivered',
                date: 'Dec 5, 2024 • 2:30 PM',
                location: 'Los Angeles, CA',
                status: 'completed',
                icon: '✓'
            }
        ],
        history: [
            {
                date: 'Dec 5, 2024',
                time: '2:30 PM',
                status: 'Delivered - Left at front door',
                location: 'LOS ANGELES, CA'
            },
            {
                date: 'Dec 5, 2024',
                time: '8:00 AM',
                status: 'Out for delivery',
                location: 'LOS ANGELES, CA'
            },
            {
                date: 'Dec 4, 2024',
                time: '6:30 AM',
                status: 'At destination sort facility',
                location: 'LOS ANGELES, CA'
            },
            {
                date: 'Dec 3, 2024',
                time: '1:15 PM',
                status: 'Package shipped',
                location: 'PHOENIX, AZ'
            }
        ]
    }
};

// DOM elements
const trackingInput = document.getElementById('trackingInput');
const trackBtn = document.getElementById('trackBtn');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const tryAgainBtn = document.getElementById('tryAgainBtn');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    trackBtn.addEventListener('click', handleTrackPackage);
    tryAgainBtn.addEventListener('click', showSearchSection);
    
    // Allow tracking with Enter key
    trackingInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleTrackPackage();
        }
    });

    // Add sample tracking numbers on focus for demo
    trackingInput.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = 'Try: 123456789012 or 987654321098';
        }
    });

    trackingInput.addEventListener('blur', function() {
        this.placeholder = 'Enter tracking number (e.g., 123456789012)';
    });
});

// Main tracking function
function handleTrackPackage() {
    const trackingNumber = trackingInput.value.trim();
    
    if (!trackingNumber) {
        showError('Please enter a tracking number');
        return;
    }

    if (!isValidTrackingNumber(trackingNumber)) {
        showError('Please enter a valid tracking number format');
        return;
    }

    // Show loading state
    showLoading();

    // Simulate API call delay
    setTimeout(() => {
        const packageData = trackingData[trackingNumber];
        
        if (packageData) {
            showTrackingResults(trackingNumber, packageData);
        } else {
            showTrackingNotFound();
        }
    }, 1000);
}

// Validation function
function isValidTrackingNumber(trackingNumber) {
    // Simple validation - should be 12 digits for this demo
    return /^\d{12}$/.test(trackingNumber);
}

// Show loading state
function showLoading() {
    trackBtn.innerHTML = '<span style="opacity: 0.7">Tracking...</span>';
    trackBtn.disabled = true;
    hideAllSections();
}

// Show tracking results
function showTrackingResults(trackingNumber, data) {
    hideAllSections();
    updateTrackingResults(trackingNumber, data);
    resultsSection.style.display = 'block';
    resetTrackButton();
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Update the tracking results display
function updateTrackingResults(trackingNumber, data) {
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    statusText.textContent = data.status;
    
    // Update badge color based on status
    statusBadge.className = 'status-badge';
    if (data.statusType === 'completed') {
        statusBadge.style.background = '#10b981'; // Green
    } else if (data.statusType === 'active') {
        statusBadge.style.background = '#3b82f6'; // Blue
    } else {
        statusBadge.style.background = '#6b7280'; // Gray
    }

    // Update tracking number display
    document.getElementById('displayTrackingNumber').textContent = trackingNumber;

    // Update timeline
    updateTimeline(data.timeline);

    // Update shipment facts
    updateShipmentFacts(data.shipmentFacts);

    // Update delivery information
    updateDeliveryInfo(data.deliveryInfo);

    // Update tracking history
    updateTrackingHistory(data.history);
}

// Update timeline display
function updateTimeline(timeline) {
    const timelineContainer = document.querySelector('.timeline-container');
    timelineContainer.innerHTML = '';

    timeline.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = `timeline-step ${step.status}`;
        stepElement.setAttribute('data-step', step.step);

        stepElement.innerHTML = `
            <div class="step-icon">${step.icon}</div>
            <div class="step-info">
                <h4>${step.title}</h4>
                <p class="step-date">${step.date}</p>
                <p class="step-location">${step.location}</p>
            </div>
        `;

        timelineContainer.appendChild(stepElement);
    });
}

// Update shipment facts
function updateShipmentFacts(facts) {
    const factRows = document.querySelectorAll('.fact-row');
    const values = [facts.service, facts.weight, facts.dimensions, facts.shipDate];
    
    factRows.forEach((row, index) => {
        const valueElement = row.querySelector('.value');
        if (valueElement && values[index]) {
            valueElement.textContent = values[index];
        }
    });
}

// Update delivery information
function updateDeliveryInfo(deliveryInfo) {
    const addressElement = document.querySelector('.address p:last-child');
    if (addressElement) {
        addressElement.innerHTML = `${deliveryInfo.recipient}<br>${deliveryInfo.address}`;
    }
}

// Update tracking history
function updateTrackingHistory(history) {
    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = '';

    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        historyItem.innerHTML = `
            <div class="history-time">
                <span class="date">${item.date}</span>
                <span class="time">${item.time}</span>
            </div>
            <div class="history-status">
                <strong>${item.status}</strong>
                <p>${item.location}</p>
            </div>
        `;

        historyList.appendChild(historyItem);
    });
}

// Show tracking not found error
function showTrackingNotFound() {
    hideAllSections();
    errorSection.style.display = 'block';
    resetTrackButton();
    errorSection.scrollIntoView({ behavior: 'smooth' });
}

// Show error message
function showError(message) {
    alert(message); // Simple alert for demo - could be improved with custom modal
    resetTrackButton();
}

// Show search section (hide results/error)
function showSearchSection() {
    hideAllSections();
    trackingInput.value = '';
    trackingInput.focus();
}

// Hide all sections
function hideAllSections() {
    resultsSection.style.display = 'none';
    errorSection.style.display = 'none';
}

// Reset track button to normal state
function resetTrackButton() {
    trackBtn.innerHTML = 'Track Package';
    trackBtn.disabled = false;
}

// Additional features for enhanced UX
function addDeliveryOptionsHandlers() {
    const deliveryBtns = document.querySelectorAll('.delivery-btn');
    deliveryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.includes('Map') ? 'map' : 'sms';
            handleDeliveryOption(action);
        });
    });
}

function handleDeliveryOption(action) {
    if (action === 'map') {
        alert('🗺️ Map tracking feature would open here in a full implementation');
    } else if (action === 'sms') {
        alert('📱 SMS notifications feature would be configured here');
    }
}

// Initialize delivery options when results are shown
document.addEventListener('DOMContentLoaded', function() {
    // Re-add event listeners when results are displayed
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.id === 'resultsSection' && 
                mutation.target.style.display === 'block') {
                setTimeout(addDeliveryOptionsHandlers, 100);
            }
        });
    });

    observer.observe(resultsSection, {
        attributes: true,
        attributeFilter: ['style']
    });
});

// Format tracking number input (add spaces for readability)
trackingInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 12) {
        value = value.substring(0, 12); // Limit to 12 digits
    }
    e.target.value = value;
});

// Add some visual feedback for form validation
trackingInput.addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && !isValidTrackingNumber(value)) {
        this.style.borderColor = '#ef4444';
        this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
        this.style.borderColor = '';
        this.style.boxShadow = '';
    }
});

trackingInput.addEventListener('focus', function() {
    this.style.borderColor = '';
    this.style.boxShadow = '';
});