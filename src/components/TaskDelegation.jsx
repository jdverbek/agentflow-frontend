import React, { useState } from 'react';
import { Play, Clock, CheckCircle, AlertCircle, Users, Brain, Target, BarChart3 } from 'lucide-react';

const TaskDelegation = () => {
  const [task, setTask] = useState('');
  const [maxIterations, setMaxIterations] = useState(5);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [executionStatus, setExecutionStatus] = useState(null);
  const [executionId, setExecutionId] = useState(null);

  const handleTaskSubmission = async () => {
    if (!task.trim()) return;

    setIsExecuting(true);
    setExecutionResult(null);
    setExecutionStatus(null);

    try {
      const response = await fetch('https://agentflow-backend-99xa.onrender.com/api/orchestration/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: task,
          max_iterations: maxIterations,
          async: false  // Use synchronous for now
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setExecutionResult(data);
        setIsExecuting(false);
      } else {
        console.error('Error response:', data);
        setExecutionResult({ error: data.error || 'Unknown error occurred' });
        setIsExecuting(false);
      }
    } catch (error) {
      console.error('Error executing task:', error);
      setExecutionResult({ error: 'Network error: ' + error.message });
      setIsExecuting(false);
    }
  };

  const monitorExecution = async (execId) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/orchestration/status/${execId}`);
        const status = await response.json();
        
        setExecutionStatus(status);
        
        if (status.status === 'completed' || status.status === 'failed') {
          setIsExecuting(false);
          if (status.result) {
            setExecutionResult(status.result);
          }
        } else {
          // Continue monitoring
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setIsExecuting(false);
      }
    };

    checkStatus();
  };

  const getAgentIcon = (agentType) => {
    switch (agentType) {
      case 'research_analyst': return <Brain className="w-4 h-4" />;
      case 'content_creator': return <Target className="w-4 h-4" />;
      case 'data_analyst': return <BarChart3 className="w-4 h-4" />;
      case 'oversight_manager': return <CheckCircle className="w-4 h-4" />;
      case 'execution_agent': return <Play className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'needs_revision': return 'text-orange-600 bg-orange-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exampleTasks = [
    {
      category: 'Market Research',
      task: 'Research the AI automation market and create a comprehensive report with data analysis and PowerPoint presentation',
      description: 'Complete market analysis with research, data insights, and professional deliverables'
    },
    {
      category: 'Content Strategy',
      task: 'Analyze competitor content strategies and create a content marketing plan with blog posts and social media content',
      description: 'Strategic content analysis with actionable marketing materials'
    },
    {
      category: 'Business Analysis',
      task: 'Analyze our Q4 performance data and create executive dashboard with recommendations and presentation',
      description: 'Data-driven business analysis with executive-level deliverables'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">🤖 Manager Agent - Task Delegation</h1>
        <p className="text-blue-100">
          Delegate complex tasks to specialized AI agents. The Manager Agent will intelligently coordinate 
          multiple sub-agents, provide feedback, and iterate until delivering perfect solutions.
        </p>
      </div>

      {/* Task Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Task Delegation</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your complex task
            </label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Example: Research the latest AI trends, analyze market data, create a comprehensive report, and build a PowerPoint presentation with key insights and recommendations"
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isExecuting}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Iterations
              </label>
              <select
                value={maxIterations}
                onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={isExecuting}
              >
                <option value={3}>3 iterations</option>
                <option value={5}>5 iterations</option>
                <option value={7}>7 iterations</option>
                <option value={10}>10 iterations</option>
              </select>
            </div>

            <div className="flex-1">
              <button
                onClick={handleTaskSubmission}
                disabled={!task.trim() || isExecuting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isExecuting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Execute Task</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Example Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Example Tasks</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {exampleTasks.map((example, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
              onClick={() => setTask(example.task)}
            >
              <h3 className="font-semibold text-blue-600 mb-2">{example.category}</h3>
              <p className="text-sm text-gray-600 mb-2">{example.description}</p>
              <p className="text-xs text-gray-500 italic">Click to use this example</p>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Status */}
      {executionStatus && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Execution Status</h2>
          
          <div className="space-y-4">
            {/* Overall Progress */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Overall Progress</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(executionStatus.status)}`}>
                  {executionStatus.status}
                </span>
              </div>
              
              {executionStatus.progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Completed Subtasks</span>
                    <span>{executionStatus.progress.completed_subtasks}/{executionStatus.progress.total_subtasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(executionStatus.progress.completed_subtasks / executionStatus.progress.total_subtasks) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Iteration</span>
                    <span>{executionStatus.progress.current_iteration}/{executionStatus.progress.max_iterations}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Agent Status */}
            {executionStatus.subtasks && (
              <div>
                <h3 className="font-medium mb-3">Agent Status</h3>
                <div className="space-y-2">
                  {executionStatus.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getAgentIcon(subtask.agent_type)}
                        <div>
                          <div className="font-medium capitalize">
                            {subtask.agent_type.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {subtask.description.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subtask.status)}`}>
                          {subtask.status}
                        </span>
                        {subtask.iteration > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Iteration {subtask.iteration}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Execution Result */}
      {executionResult && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Task Completed Successfully!</span>
          </h2>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 max-h-96 overflow-y-auto">
              {executionResult}
            </pre>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => navigator.clipboard.writeText(executionResult)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
            >
              Copy Result
            </button>
            <button
              onClick={() => {
                setExecutionResult(null);
                setExecutionStatus(null);
                setTask('');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Start New Task
            </button>
          </div>
        </div>
      )}

      {/* Agent Capabilities Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Available Specialized Agents</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Research Analyst</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Uses O3 Pro + Grok4 Heavy</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Market research & analysis</li>
              <li>• Competitive intelligence</li>
              <li>• Trend identification</li>
              <li>• Fact checking & validation</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">Content Creator</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Uses GPT-4 + Claude</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Blog posts & articles</li>
              <li>• Marketing copy</li>
              <li>• Social media content</li>
              <li>• SEO optimization</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold">Data Analyst</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Uses O3 Pro</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Statistical analysis</li>
              <li>• Data visualization</li>
              <li>• Trend identification</li>
              <li>• Insights generation</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Play className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold">Execution Agent</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Uses Manus Tools</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Document generation</li>
              <li>• Presentation creation</li>
              <li>• File operations</li>
              <li>• Automation tasks</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold">Oversight Manager</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Uses Grok4</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Quality assessment</li>
              <li>• Feedback generation</li>
              <li>• Improvement suggestions</li>
              <li>• Coordination oversight</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold">Manager Agent</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Orchestration System</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Task delegation</li>
              <li>• Agent coordination</li>
              <li>• Feedback loops</li>
              <li>• Quality iteration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDelegation;

