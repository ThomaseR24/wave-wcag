# WAVE Accessibility Analyzer

A Next.js application that uses the WAVE API to analyze web pages for accessibility issues.

## Live Demo

🚀 **[Try the live demo](https://wave-wcag-thomas-er24s-projects.vercel.app/)**

Features available in the demo:
- Test any public URL for accessibility issues
- Choose between different report types
- View detailed accessibility analysis
- Monitor remaining API credits

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_WAVE_API_KEY=your_api_key
```

4. Run the development server:

```bash
npm run dev
```

## WAVE API Integration

The application uses the WAVE API (v3.1) to analyze web pages. API requests are made to:

```bash
https://wave.webaim.org/api/request
```

### Report Types

The API supports four different report types:

1. **Basic Statistics** (1 credit)
   - Number of errors, alerts, and features
   - Page statistics

2. **Detailed Items** (2 credits)
   - Basic statistics
   - Detailed list of all issues

3. **XPath Data** (3 credits)
   - Detailed items
   - XPath locations
   - Contrast data

4. **CSS Selector Data** (3 credits)
   - Detailed items
   - CSS selectors
   - Contrast data

### Example API Response

```json
{
   "status": {
      "success": true,
      "httpstatuscode": 200
   },
   "statistics": {
      "pagetitle": "Page Title",
      "pageurl": "https://example.com",
      "time": 1.27,
      "creditsremaining": 1487,
      "allitemcount": 21,
      "totalelements": 234
   },
   "categories": {
      "error": {
         "description": "Errors",
         "count": 4
      },
      "contrast": {
         "description": "Contrast Errors",
         "count": 2
      }
   }
}
```

### Categories

- `error`: Critical accessibility issues
- `contrast`: Contrast problems
- `alert`: Potential issues
- `feature`: Accessibility features
- `structure`: Structural elements
- `aria`: ARIA labels and attributes

## Project Structure

### Main Components

```typescript
// Interface for Report Types
interface ReportType {
  value: string;
  label: string;
  description: string;
  credits: number;
}

// Icon Mapping for Categories
const iconMap = {
  error: '🔴',
  contrast: '⚫',
  alert: '⚠️',
  feature: '✅',
  structure: '🔷',
  aria: '♿'
};

// Loading Components
const LoadingIndicator = () => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p className="mt-4 text-gray-700">Analyzing page...</p>
    </div>
  </div>
);
```

### Key Features Implementation

- URL input for page analysis
- Selectable report types
- Loading indicators
- Detailed results display
- Remaining credits counter
- Error handling
- Visual representation of issues using icons
- Responsive design

