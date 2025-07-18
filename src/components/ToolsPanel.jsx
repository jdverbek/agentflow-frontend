import React, { useState, useEffect } from 'react';
import { 
  Search, Globe, FileText, Terminal, Image, Volume2, 
  BarChart3, FileDown, Link, Code, Play, Settings,
  ChevronRight, ChevronDown, Zap, CheckCircle, AlertCircle
} from 'lucide-react';

const ToolsPanel = ({ onToolSelect, selectedTools = [] }) => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [executingTool, setExecutingTool] = useState(null);

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tools`);
      const data = await response.json();
      if (data.success) {
        setTools(data.tools);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
        // Expand all categories by default
        const expanded = {};
        Object.keys(data.categories).forEach(category => {
          expanded[category] = true;
        });
        setExpandedCategories(expanded);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setLoading(false);
    }
  };

  const executeToolDemo = async (toolName) => {
    setExecutingTool(toolName);
    try {
      const demoParams = getDemoParameters(toolName);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool_name: toolName,
          parameters: demoParams
        })
      });
      
      const result = await response.json();
      console.log('Tool execution result:', result);
      
      // Show result in a simple alert for demo
      if (result.success) {
        alert(`Tool "${toolName}" executed successfully!\n\nResult: ${JSON.stringify(result.result, null, 2)}`);
      } else {
        alert(`Tool execution failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Tool execution error:', error);
      alert(`Tool execution error: ${error.message}`);
    } finally {
      setExecutingTool(null);
    }
  };

  const getDemoParameters = (toolName) => {
    const demoParams = {
      web_search: { query: "AI workflow automation", max_results: 3 },
      web_browse: { url: "https://example.com", extract_type: "text" },
      file_operations: { operation: "read", file_path: "/tmp/demo.txt" },
      shell_command: { command: "echo Hello AgentFlow", working_directory: "/tmp" },
      image_generation: { prompt: "A futuristic AI robot", style: "realistic", size: "512x512" },
      text_to_speech: { text: "Hello from AgentFlow", voice: "default", speed: 1.0 },
      data_analysis: { data: [1, 2, 3, 4, 5], analysis_type: "summary" },
      document_generation: { content: "Sample document content", format: "pdf", template: "default" },
      api_call: { url: "https://api.github.com/users/octocat", method: "GET" },
      code_execution: { code: "print('Hello from AgentFlow!')", language: "python" }
    };
    return demoParams[toolName] || {};
  };

  const getToolIcon = (toolName) => {
    const icons = {
      web_search: Search,
      web_browse: Globe,
      file_operations: FileText,
      shell_command: Terminal,
      image_generation: Image,
      text_to_speech: Volume2,
      data_analysis: BarChart3,
      document_generation: FileDown,
      api_call: Link,
      code_execution: Code
    };
    const IconComponent = icons[toolName] || Settings;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      information: Search,
      file_system: FileText,
      system: Terminal,
      media: Image,
      analysis: BarChart3,
      document: FileDown,
      integration: Link,
      development: Code
    };
    const IconComponent = icons[category] || Settings;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      information: 'text-blue-600 bg-blue-50 border-blue-200',
      file_system: 'text-green-600 bg-green-50 border-green-200',
      system: 'text-red-600 bg-red-50 border-red-200',
      media: 'text-purple-600 bg-purple-50 border-purple-200',
      analysis: 'text-orange-600 bg-orange-50 border-orange-200',
      document: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      integration: 'text-teal-600 bg-teal-50 border-teal-200',
      development: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[category] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const isToolSelected = (toolName) => {
    return selectedTools.includes(toolName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading tools...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Manus Tools</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Zap className="w-4 h-4" />
          <span>{tools.length} tools available</span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(categories).map(([category, categoryTools]) => (
          <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category)}
              className={`w-full p-3 text-left transition-colors hover:bg-gray-50 ${getCategoryColor(category)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <span className="font-medium capitalize">{category.replace('_', ' ')}</span>
                  <span className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded-full">
                    {categoryTools.length}
                  </span>
                </div>
                {expandedCategories[category] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </button>

            {expandedCategories[category] && (
              <div className="border-t border-gray-200 bg-white">
                {categoryTools.map((tool) => (
                  <div
                    key={tool.name}
                    className={`p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                      isToolSelected(tool.name) ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getToolIcon(tool.name)}
                          <span className="font-medium text-sm">{tool.name.replace('_', ' ')}</span>
                          {isToolSelected(tool.name) && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{tool.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {tool.parameters.map((param) => (
                            <span
                              key={param}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {param}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => onToolSelect && onToolSelect(tool.name)}
                          className={`p-1 rounded text-xs transition-colors ${
                            isToolSelected(tool.name)
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={isToolSelected(tool.name) ? 'Remove from workflow' : 'Add to workflow'}
                        >
                          {isToolSelected(tool.name) ? 'Remove' : 'Add'}
                        </button>
                        <button
                          onClick={() => executeToolDemo(tool.name)}
                          disabled={executingTool === tool.name}
                          className="p-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs transition-colors disabled:opacity-50"
                          title="Test tool"
                        >
                          {executingTool === tool.name ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-green-700"></div>
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTools.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Selected Tools</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTools.map((toolName) => (
              <span
                key={toolName}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {toolName.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsPanel;

