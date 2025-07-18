import React, { useState } from 'react';
import { Play, Clock, CheckCircle, AlertCircle, Users, Brain, Target, BarChart3, RefreshCw, Eye } from 'lucide-react';
import ProgressMonitor from './ProgressMonitor';

const TaskDelegation = () => {
  const [task, setTask] = useState('');
  const [maxIterations, setMaxIterations] = useState(3);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [executionId, setExecutionId] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const handleTaskSubmission = async () => {
    if (!task.trim()) return;
    
    setIsExecuting(true);
    setError(null);
    setResult(null);
    setExecutionId(null);
    setShowProgress(false);
    
    try {
      const response = await fetch('https://agentflow-backend-99xa.onrender.com/api/orchestration/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: task,
          max_iterations: maxIterations
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setExecutionId(data.execution_id);
        setShowProgress(true);
        setResult(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to execute task');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const exampleTasks = [
    {
      title: "Market Research Report",
      description: "Create a comprehensive market analysis report on AI trends in healthcare",
      task: "Create a comprehensive market research report on AI trends in healthcare. Include latest developments, key players, market size, and future projections. Format as a professional PDF report."
    },
    {
      title: "PowerPoint Presentation",
      description: "Build a professional presentation with research and content",
      task: "Create a powerpoint presentation in English about 'Large Language Models and agentic AI in cardiology'. Search for the latest novelties. We're based in Belgium. Provide narrative text for each slide. The presentation should have a duration of about 30 min."
    },
    {
      title: "Content Marketing Campaign",
      description: "Develop a complete content marketing strategy with deliverables",
      task: "Develop a complete content marketing campaign for a SaaS startup. Include blog posts, social media content, email sequences, and landing page copy. Research target audience and competitors."
    },
    {
      title: "Data Analysis Project",
      description: "Analyze business data and create insights with visualizations",
      task: "Analyze our sales data from the last 12 months. Identify trends, patterns, and opportunities. Create visualizations and a comprehensive report with actionable recommendations."
    }
  ];

  const getAgentIcon = (agentType) => {
    switch (agentType) {
      case 'research_analyst': return <Brain className="w-4 h-4 text-blue-500" />;
      case 'content_creator': return <Target className="w-4 h-4 text-purple-500" />;
      case 'data_analyst': return <BarChart3 className="w-4 h-4 text-green-500" />;
      case 'oversight_manager': return <Eye className="w-4 h-4 text-red-500" />;
      case 'execution_agent': return <Play className="w-4 h-4 text-orange-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg mr-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Agent</h1>
            <p className="text-gray-600">Intelligent task delegation with multi-agent orchestration</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center">
              {getAgentIcon('research_analyst')}
              <span className="ml-2 text-blue-700">Research Analyst</span>
            </div>
            <div className="flex items-center">
              {getAgentIcon('content_creator')}
              <span className="ml-2 text-purple-700">Content Creator</span>
            </div>
            <div className="flex items-center">
              {getAgentIcon('data_analyst')}
              <span className="ml-2 text-green-700">Data Analyst</span>
            </div>
            <div className="flex items-center">
              {getAgentIcon('execution_agent')}
              <span className="ml-2 text-orange-700">Execution Agent</span>
            </div>
            <div className="flex items-center">
              {getAgentIcon('oversight_manager')}
              <span className="ml-2 text-red-700">Oversight Manager</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Input */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Task Delegation
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your complex task
                </label>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter a complex task that requires multiple specialized agents to complete..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Iterations: {maxIterations}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Quick (1)</span>
                  <span>Balanced (3)</span>
                  <span>Perfect (5)</span>
                </div>
              </div>
              
              <button
                onClick={handleTaskSubmission}
                disabled={isExecuting || !task.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isExecuting || !task.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Executing Task...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Execute Task
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-medium text-red-800">Execution Error</span>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                <span className="font-semibold text-green-800 text-lg">Task Completed Successfully!</span>
              </div>
              
              {/* Execution Summary */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Execution Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium text-green-600">{result.result?.status || result.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Subtasks:</span>
                    <span className="ml-2 font-medium">{result.result?.subtasks_completed || result.subtasks_completed}/{result.result?.total_subtasks || result.total_subtasks}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Execution Time:</span>
                    <span className="ml-2 font-medium">{result.result?.execution_summary?.execution_time?.toFixed(2) || 'N/A'}s</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Agents Used:</span>
                    <span className="ml-2 font-medium">{result.result?.execution_summary?.total_agents || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Task Summary */}
              {result.result?.summary && (
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Summary</h3>
                  <p className="text-gray-700 text-sm">{result.result.summary}</p>
                </div>
              )}

              {/* Deliverables */}
              {result.result?.deliverables && (
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Deliverables Created</h3>
                  <div className="space-y-3">
                    {result.result.deliverables.presentation && (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Play className="w-4 h-4 text-orange-500 mr-2" />
                          <span className="font-medium text-gray-800">PowerPoint Presentation</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>File:</strong> {result.result.deliverables.presentation.file_path}</p>
                          <p><strong>Slides:</strong> {result.result.deliverables.presentation.slides_count}</p>
                          <p><strong>Duration:</strong> {result.result.deliverables.presentation.estimated_duration}</p>
                          <p><strong>Format:</strong> {result.result.deliverables.presentation.format}</p>
                          <div className="mt-2">
                            <strong>Features:</strong>
                            <ul className="list-disc list-inside ml-2">
                              {result.result.deliverables.presentation.features?.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {result.result.deliverables.content && (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Target className="w-4 h-4 text-purple-500 mr-2" />
                          <span className="font-medium text-gray-800">Content & Narrative</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Target Audience:</strong> {result.result.deliverables.content.target_audience}</p>
                          <p><strong>Duration:</strong> {result.result.deliverables.content.estimated_duration}</p>
                          <div className="mt-2">
                            <strong>Slides Created:</strong>
                            <div className="mt-1 space-y-1">
                              {result.result.deliverables.content.slides?.map((slide, idx) => (
                                <div key={idx} className="bg-gray-50 p-2 rounded">
                                  <div className="font-medium text-xs text-gray-800">{slide.title}</div>
                                  <div className="text-xs text-gray-600 mt-1">{slide.narrative?.substring(0, 100)}...</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Agent Results */}
              {result.result?.agent_results && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Agent Contributions</h3>
                  <div className="space-y-3">
                    {Object.entries(result.result.agent_results).map(([agentName, agentResult]) => (
                      <div key={agentName} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          {getAgentIcon(agentName)}
                          <span className="ml-2 font-medium text-gray-800 capitalize">
                            {agentName.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {agentResult.findings && <p><strong>Findings:</strong> {agentResult.findings}</p>}
                          {agentResult.content && <p><strong>Content:</strong> {agentResult.content}</p>}
                          {agentResult.deliverable && <p><strong>Deliverable:</strong> {agentResult.deliverable}</p>}
                          {agentResult.review && <p><strong>Review:</strong> {agentResult.review}</p>}
                          {agentResult.confidence && <p><strong>Confidence:</strong> {(agentResult.confidence * 100).toFixed(0)}%</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Example Tasks */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Example Tasks
            </h2>
            
            <div className="space-y-4">
              {exampleTasks.map((example, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h3 className="font-medium text-gray-900 mb-2">{example.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                  <button
                    onClick={() => setTask(example.task)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Use this example →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Capabilities */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              Specialized Agents
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                {getAgentIcon('research_analyst')}
                <div className="ml-3">
                  <h4 className="font-medium text-blue-900">Research Analyst</h4>
                  <p className="text-sm text-blue-700">Deep research, data collection, trend analysis</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-purple-50 rounded-lg">
                {getAgentIcon('content_creator')}
                <div className="ml-3">
                  <h4 className="font-medium text-purple-900">Content Creator</h4>
                  <p className="text-sm text-purple-700">Creative writing, marketing copy, storytelling</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-green-50 rounded-lg">
                {getAgentIcon('data_analyst')}
                <div className="ml-3">
                  <h4 className="font-medium text-green-900">Data Analyst</h4>
                  <p className="text-sm text-green-700">Statistical analysis, insights, visualizations</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-orange-50 rounded-lg">
                {getAgentIcon('execution_agent')}
                <div className="ml-3">
                  <h4 className="font-medium text-orange-900">Execution Agent</h4>
                  <p className="text-sm text-orange-700">Document creation, presentations, deliverables</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-red-50 rounded-lg">
                {getAgentIcon('oversight_manager')}
                <div className="ml-3">
                  <h4 className="font-medium text-red-900">Oversight Manager</h4>
                  <p className="text-sm text-red-700">Quality control, feedback, optimization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Monitor Modal */}
      {showProgress && executionId && (
        <ProgressMonitor
          executionId={executionId}
          onClose={() => setShowProgress(false)}
        />
      )}
    </div>
  );
};

export default TaskDelegation;

