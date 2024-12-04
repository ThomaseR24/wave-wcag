import React from 'react';

interface SummaryProps {
  errors: number;
  contrastErrors: number;
  alerts: number;
  features: number;
  structuralElements: number;
  aria: number;
}

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

  const renderSummary = () => {
    if (!results) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Summary</h3>
        {['error', 'contrast', 'alert', 'feature', 'structure', 'aria'].map((key) => (
          <div key={key} className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium capitalize">
                {iconMap[key as keyof typeof iconMap]} {key}
              </span>
              <span className="font-bold">{results.categories[key]?.count || 0}</span>
            </div>
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