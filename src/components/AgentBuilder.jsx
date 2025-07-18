import React, { useState } from 'react';
import { Plus, Bot, Sparkles, Settings, Save, Play, Trash2 } from 'lucide-react';
import LLMSelector from './LLMSelector';
import ToolsPanel from './ToolsPanel';

const AgentBuilder = () => {
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [selectedTools, setSelectedTools] = useState([]);
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 1000
  });

  const handleToolSelect = (toolName) => {
    setSelectedTools(prev => {
      if (prev.includes(toolName)) {
        return prev.filter(t => t !== toolName);
      } else {
        return [...prev, toolName];
      }
    });
  };

  const handleSaveAgent = () => {
    const agent = {
      ...agentConfig,
      provider: selectedProvider,
      model: selectedModel,
      tools: selectedTools,
      createdAt: new Date().toISOString()
    };
    console.log('Saving agent:', agent);
    // Here you would typically save to your backend
    alert('Agent saved successfully!');
  };

  const handleTestAgent = () => {
    if (!agentConfig.name) {
      alert('Please enter an agent name first');
      return;
    }
    console.log('Testing agent with config:', {
      ...agentConfig,
      provider: selectedProvider,
      model: selectedModel,
      tools: selectedTools
    });
    alert('Agent test initiated! Check console for details.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agent Builder</h2>
          <p className="text-gray-600">Create and manage your AI agents</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleTestAgent}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Test Agent</span>
          </button>
          <button
            onClick={handleSaveAgent}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Agent</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Configuration */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={agentConfig.name}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Research Assistant"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={agentConfig.description}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this agent does..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Prompt
                </label>
                <textarea
                  value={agentConfig.systemPrompt}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="You are a helpful AI assistant that..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={agentConfig.temperature}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 text-center">{agentConfig.temperature}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={agentConfig.maxTokens}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    min="100"
                    max="4000"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LLM Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Selection</h3>
            <LLMSelector
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              onProviderChange={setSelectedProvider}
              onModelChange={setSelectedModel}
            />
          </div>
        </div>

        {/* Tools Panel */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <ToolsPanel
            onToolSelect={handleToolSelect}
            selectedTools={selectedTools}
          />
        </div>
      </div>

      {/* Quick Start Templates */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Templates</h3>
        <p className="text-gray-600 mb-4">Get started quickly with pre-configured agent templates</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "Research Assistant",
              description: "Research Specialist with web search and analysis tools",
              icon: "🔍",
              tools: ["web_search", "web_browse", "data_analysis"],
              prompt: "You are a research assistant specialized in finding and analyzing information from various sources."
            },
            {
              name: "Content Creator", 
              description: "Creative Writer with document and media generation",
              icon: "✍️",
              tools: ["document_generation", "image_generation", "text_to_speech"],
              prompt: "You are a creative content creator that helps generate engaging written and visual content."
            },
            {
              name: "Data Analyst",
              description: "Data Processor with analysis and visualization tools",
              icon: "📊", 
              tools: ["data_analysis", "file_operations", "document_generation"],
              prompt: "You are a data analyst specialized in processing, analyzing, and visualizing data insights."
            }
          ].map((template) => (
            <button
              key={template.name}
              onClick={() => {
                setAgentConfig({
                  name: template.name,
                  description: template.description,
                  systemPrompt: template.prompt,
                  temperature: 0.7,
                  maxTokens: 1000
                });
                setSelectedTools(template.tools);
              }}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <div className="font-medium text-gray-900">{template.name}</div>
              <div className="text-sm text-gray-600 mt-1">{template.description}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tools.map((tool) => (
                  <span key={tool} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tool.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Your Agents */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Agents</h3>
        <p className="text-gray-600 mb-4">Manage your existing AI agents</p>
        
        <div className="space-y-3">
          {[
            { name: "Research Assistant", type: "Research Specialist", status: "active", provider: "OpenAI", model: "gpt-4o-mini" },
            { name: "Content Creator", type: "Creative Writer", status: "active", provider: "Grok", model: "grok-beta" },
            { name: "Data Analyst", type: "Data Processor", status: "inactive", provider: "OpenAI", model: "gpt-3.5-turbo" }
          ].map((agent, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{agent.name}</div>
                  <div className="text-sm text-gray-600">{agent.type}</div>
                  <div className="text-xs text-gray-500">{agent.provider} • {agent.model}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  agent.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {agent.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Play className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;

