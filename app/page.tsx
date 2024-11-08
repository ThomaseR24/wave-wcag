'use client';
import { useState } from 'react';

interface ReportType {
  value: string;
  label: string;
  description: string;
  credits: number;
}

const reportTypes: ReportType[] = [
  {
    value: '1',
    label: 'Basic Statistics',
    description: 'Basic WAVE statistics (errors, alerts, etc.)',
    credits: 1
  },
  {
    value: '2',
    label: 'Detailed Items',
    description: 'Statistics plus listing of all WAVE items',
    credits: 2
  },
  {
    value: '3',
    label: 'XPath Data',
    description: 'All details plus XPath locations',
    credits: 3
  },
  {
    value: '4',
    label: 'CSS Selector Data',
    description: 'All details plus CSS Selectors',
    credits: 3
  }
];

const iconMap = {
  error: '🔴',
  contrast: '⚫',
  alert: '⚠️',
  feature: '✅',
  structure: '🔷',
  aria: '♿'
};

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const LoadingIndicator = () => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p className="mt-4 text-gray-700">Analyzing page...</p>
    </div>
  </div>
);

const renderIcon = (category: string, count: number) => {
  const icon = iconMap[category as keyof typeof iconMap] || '•';
  return (
    <div className="flex flex-wrap gap-1">
      {Array(count).fill(0).map((_, i) => (
        <span key={i} className="inline-block">{icon}</span>
      ))}
    </div>
  );
};

export default function WaveAnalyzer() {
  const [url, setUrl] = useState('');
  const [reportType, setReportType] = useState('1');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeUrl = async () => {
    const apiKey = process.env.NEXT_PUBLIC_WAVE_API_KEY;
    
    if (!apiKey) {
      setError('API Key is not configured');
      return;
    }

    console.log('API Key:', apiKey);
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = new URL('https://wave.webaim.org/api/request');
      apiUrl.searchParams.append('key', apiKey);
      apiUrl.searchParams.append('url', url);
      apiUrl.searchParams.append('reporttype', reportType);
      
      console.log('Request URL:', apiUrl.toString());
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.status?.success) {
        throw new Error(data.status?.error || 'Analysis failed');
      }
      
      setResults(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDetailedResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-6">
        {reportType !== '1' && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
            {Object.entries(results.categories).map(([categoryName, category]: [string, any]) => (
              category.items && (
                <div key={categoryName} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold capitalize mb-3 flex items-center gap-2">
                    {iconMap[categoryName as keyof typeof iconMap]} {categoryName}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(category.items).map(([itemId, item]: [string, any]) => (
                      <div key={itemId} className="bg-white p-3 rounded shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{item.description}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                            Count: {item.count}
                          </span>
                        </div>
                        {(reportType === '3' && item.xpaths) && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium text-gray-700">XPaths:</p>
                            <div className="max-h-32 overflow-y-auto">
                              {item.xpaths.map((xpath: string, index: number) => (
                                <code key={index} className="block text-xs bg-gray-50 p-1 mt-1 rounded">
                                  {xpath}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}
                        {(reportType === '4' && item.selectors) && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium text-gray-700">CSS Selectors:</p>
                            <div className="max-h-32 overflow-y-auto">
                              {item.selectors.map((selector: string, index: number) => (
                                <code key={index} className="block text-xs bg-gray-50 p-1 mt-1 rounded">
                                  {selector}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">WAVE Accessibility Analyzer</h1>
        {results && (
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-700">
              Credits Remaining: <span className="font-bold">{results.statistics.creditsremaining}</span>
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to analyze..."
          className="flex-1 p-2 border rounded"
        />
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="p-2 border rounded"
        >
          {reportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label} ({type.credits} credit{type.credits > 1 ? 's' : ''})
            </option>
          ))}
        </select>
        <button
          onClick={analyzeUrl}
          disabled={isLoading || !url}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </div>

      <div className="mb-8 text-sm text-gray-600">
        Selected report type will use {reportTypes.find(type => type.value === reportType)?.credits} credit{reportTypes.find(type => type.value === reportType)?.credits !== 1 ? 's' : ''}
      </div>

      {isLoading && <LoadingIndicator />}

      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
          Error: {error}
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Results for: {results.statistics.pagetitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Summary</h3>
                {Object.entries(results.categories).map(([key, category]: [string, any]) => (
                  <div key={key} className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium capitalize">{key}</span>
                      <span className="font-bold">{category.count}</span>
                    </div>
                    {renderIcon(key, category.count)}
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Page Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">URL:</span> {results.statistics.pageurl}</p>
                  <p><span className="font-medium">Total Elements:</span> {results.statistics.totalelements}</p>
                  <p><span className="font-medium">Analysis Time:</span> {results.statistics.time}s</p>
                  <p><span className="font-medium">Credits Remaining:</span> {results.statistics.creditsremaining}</p>
                  <a 
                    href={results.statistics.waveurl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View Full WAVE Report
                  </a>
                </div>
              </div>
            </div>

            {renderDetailedResults()}
          </div>
        </div>
      )}
    </div>
  );
}