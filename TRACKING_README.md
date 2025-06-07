# FedEx-Style Package Tracking UI

A modern, responsive package tracking interface inspired by FedEx.com's tracking page design. This implementation provides a professional and user-friendly experience for package tracking with real-time status updates and detailed shipment information.

## 🚀 Features

### Core Functionality
- **Package Search**: Enter tracking numbers to get detailed shipment information
- **Visual Timeline**: Progressive status indicators showing package journey
- **Shipment Details**: Comprehensive package and delivery information
- **Tracking History**: Chronological list of all package events
- **Error Handling**: User-friendly validation and error messages

### Design Highlights
- **FedEx-Inspired Styling**: Professional purple and orange color scheme
- **Responsive Design**: Mobile-first approach that works on all devices
- **Interactive Elements**: Smooth animations and hover effects
- **Modern Typography**: Clean, readable Open Sans font family
- **Accessibility**: Proper semantic HTML and keyboard navigation support

## 📋 Getting Started

### Option 1: Open Directly in Browser
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start tracking packages immediately!

### Option 2: Run with Local Server
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have it installed)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎯 How to Use

### Track a Package
1. Enter a tracking number in the search field
2. Click "Track Package" or press Enter
3. View detailed tracking information and timeline

### Demo Tracking Numbers
For demonstration purposes, try these sample tracking numbers:
- `123456789012` - Package out for delivery
- `987654321098` - Delivered package

### Features to Test
- **Responsive Design**: Resize browser window or test on mobile
- **Timeline Animation**: Watch the animated progress indicators
- **Interactive Elements**: Click delivery option buttons
- **Error Handling**: Try entering invalid tracking numbers

## 📁 File Structure

```
package-tracking/
├── index.html          # Main tracking page
├── style.css           # Responsive CSS styling
├── script.js           # Interactive functionality
└── README.md           # This documentation
```

## 🎨 Design System

### Color Palette
- **Primary Purple**: `#4f46e5` - Header and primary buttons
- **Accent Orange**: `#ff6b35` - Call-to-action buttons
- **Success Green**: `#10b981` - Completed status indicators
- **Info Blue**: `#3b82f6` - Active status indicators
- **Neutral Grays**: Various shades for text and backgrounds

### Typography
- **Font Family**: Open Sans (Google Fonts)
- **Weights Used**: 300 (Light), 400 (Regular), 600 (Semi-Bold), 700 (Bold)

### Layout
- **Container Max Width**: 1200px
- **Grid System**: CSS Grid for responsive layouts
- **Spacing Scale**: Consistent rem-based spacing

## 🔧 Customization

### Adding New Tracking Data
Edit the `trackingData` object in `script.js`:

```javascript
const trackingData = {
    'your-tracking-number': {
        status: 'In Transit',
        statusType: 'active',
        shipmentFacts: {
            service: 'Express Service',
            weight: '3.0 lbs',
            dimensions: '10" x 8" x 6"',
            shipDate: 'Jan 15, 2024'
        },
        // ... additional data structure
    }
};
```

### Modifying Styles
The CSS is organized into logical sections:
- Reset and base styles
- Header and navigation
- Search section
- Results and timeline
- Responsive breakpoints

### Extending Functionality
Key functions in `script.js`:
- `handleTrackPackage()` - Main tracking logic
- `updateTrackingResults()` - Display results
- `updateTimeline()` - Render progress timeline

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🌟 Technical Highlights

### Performance
- **Lightweight**: No external dependencies except Google Fonts
- **Fast Loading**: Optimized CSS and minimal JavaScript
- **Efficient Rendering**: CSS animations with hardware acceleration

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels where needed
- **Color Contrast**: WCAG AA compliant color ratios

### Responsive Features
- **Mobile-First**: Designed for mobile, enhanced for desktop
- **Flexible Grid**: CSS Grid with fallbacks
- **Touch-Friendly**: Appropriate button sizes and spacing

## 🔮 Future Enhancements

Potential improvements for a production version:
- **Real API Integration**: Connect to actual tracking services
- **Push Notifications**: Real-time updates via WebSocket or SSE
- **Multi-Language Support**: Internationalization capabilities
- **Advanced Filtering**: Filter by date range, status, etc.
- **Export Options**: PDF or email tracking summaries
- **Progressive Web App**: Offline capabilities and app-like experience

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

This tracking UI was created as a demonstration of FedEx-style design patterns. Feel free to use, modify, and enhance it for your own projects!

---

**Created for POC_AGENT repository** - Demonstrating modern frontend development practices with a focus on user experience and responsive design.