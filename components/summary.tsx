import React from 'react';

interface SummaryProps {
  errors: number;
  contrastErrors: number;
  alerts: number;
  features: number;
  structuralElements: number;
  aria: number;
}

const categoryDescriptions: { [key: string]: string } = {
  error: 'Kritische Barrierefreiheitsprobleme, sofort beheben.',
  contrast: 'Niedriger Farbkontrast zwischen Text und Hintergrund.',
  alert: 'Potenzielle Probleme, die überprüft werden sollten.',
  feature: 'Elemente, die die Barrierefreiheit verbessern.',
  structure: 'Semantische HTML-Elemente für Struktur und Screenreader.',
  aria: 'ARIA (Accessible Rich Internet Applications): Attribute für bessere Zugänglichkeit dynamischer Inhalte.'
};

const Summary: React.FC<SummaryProps> = ({
  errors,
  contrastErrors,
  alerts,
  features,
  structuralElements,
  aria,
}) => {
  const iconMap = {
    error: '🔴',
    contrast: '⚫',
    alert: '⚠️',
    feature: '✅',
    structure: '🔷',
    aria: '♿'
  };

  const renderIcon = (category: string, count: number) => {
    const icon = iconMap[category as keyof typeof iconMap] || '•';
    return (
      <div className="flex items-center gap-2">
        <span className="inline-block">{icon}</span>
        <span className="font-bold">{count}</span>
      </div>
    );
  };

  const renderSummary = (results: any) => {
    if (!results) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Summary</h3>
        {Object.entries(results.categories).map(([key, category]: [string, any]) => (
          <div key={key} className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium capitalize">{key}</span>
              {renderIcon(key, category.count)}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {categoryDescriptions[key] || 'Beschreibung nicht verfügbar'}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="flex flex-col items-center">
        <span className="text-red-600 font-bold text-xl">{errors}</span>
        <span>Errors</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-red-600 font-bold text-xl">{contrastErrors}</span>
        <span>Contrast Errors</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-yellow-600 font-bold text-xl">{alerts}</span>
        <span>Alerts</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-green-600 font-bold text-xl">{features}</span>
        <span>Features</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-blue-600 font-bold text-xl">{structuralElements}</span>
        <span>Structural Elements</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-purple-600 font-bold text-xl">{aria}</span>
        <span>ARIA</span>
      </div>
    </div>
  );
};

export default Summary;