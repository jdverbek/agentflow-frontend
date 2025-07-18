import React, { useState, useEffect } from 'react';
import { ChevronDown, Zap, Brain, CheckCircle, AlertCircle } from 'lucide-react';

const LLMSelector = ({ selectedProvider, selectedModel, onProviderChange, onModelChange }) => {
  const [providers, setProviders] = useState({});
  const [models, setModels] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchProviders();
    fetchModels();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/llm/providers`);
      const data = await response.json();
      if (data.success) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/llm/models`);
      const data = await response.json();
      if (data.success) {
        setModels(data.models);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      setLoading(false);
    }
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'openai':
        return <Brain className="w-4 h-4" />;
      case 'grok':
        return <Zap className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'openai':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'grok':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Loading AI models...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Provider Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Provider
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(providers).map(([key, provider]) => (
            <button
              key={key}
              onClick={() => onProviderChange(key)}
              disabled={!provider.available}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200
                ${selectedProvider === key 
                  ? getProviderColor(key)
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${!provider.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center space-x-2">
                {getProviderIcon(key)}
                <div className="text-left">
                  <div className="font-medium text-sm">{provider.name}</div>
                  <div className="text-xs text-gray-500">{provider.description}</div>
                </div>
                {provider.available ? (
                  <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500 ml-auto" />
                )}
              </div>
              {selectedProvider === key && (
                <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-50"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Model Selection */}
      {selectedProvider && models[selectedProvider] && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {selectedModel || 'Select a model'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {models[selectedProvider].map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      onModelChange(model);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg
                      ${selectedModel === model ? 'bg-blue-50 text-blue-700' : ''}
                    `}
                  >
                    <div className="font-medium">{model}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getModelDescription(model)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Provider Status */}
      <div className="text-xs text-gray-500">
        {Object.values(providers).filter(p => p.available).length} of {Object.keys(providers).length} providers available
      </div>
    </div>
  );
};

const getModelDescription = (model) => {
  const descriptions = {
    'gpt-4o': 'Most capable GPT-4 model with vision',
    'gpt-4o-mini': 'Fast and efficient GPT-4 model',
    'gpt-4-turbo': 'High-performance GPT-4 model',
    'gpt-3.5-turbo': 'Fast and cost-effective model',
    'grok-beta': 'xAI\'s conversational AI model',
    'grok-vision-beta': 'Grok with vision capabilities'
  };
  return descriptions[model] || 'Advanced language model';
};

export default LLMSelector;

