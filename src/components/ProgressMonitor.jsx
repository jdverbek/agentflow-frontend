import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, AlertCircle, Users, Brain, Target, BarChart3, RefreshCw, Eye, Download } from 'lucide-react';

const ProgressMonitor = ({ executionId, onClose }) => {
  const [progress, setProgress] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`https://agentflow-backend-99xa.onrender.com/api/progress/${executionId}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        setLogs(data.logs || []);
        setError(null);
      } else {
        setError('Failed to fetch progress data');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
    
    let interval;
    if (autoRefresh && progress?.status !== 'completed' && progress?.status !== 'error') {
      interval = setInterval(fetchProgress, 2000); // Refresh every 2 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [executionId, autoRefresh, progress?.status]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress': return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getAgentIcon = (agentType) => {
    switch (agentType) {
      case 'research_analyst': return <Target className="w-4 h-4 text-blue-500" />;
      case 'content_creator': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'data_analyst': return <BarChart3 className="w-4 h-4 text-green-500" />;
      case 'execution_agent': return <Play className="w-4 h-4 text-orange-500" />;
      case 'oversight_manager': return <Eye className="w-4 h-4 text-red-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mr-3" />
            <span className="text-lg font-medium">Loading progress data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center text-red-600 mb-4">
            <AlertCircle className="w-8 h-8 mr-3" />
            <span className="text-lg font-medium">Error Loading Progress</span>
          </div>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={fetchProgress}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(progress?.status)}
              <div className="ml-3">
                <h2 className="text-xl font-bold">Task Execution Monitor</h2>
                <p className="text-blue-100 text-sm">Execution ID: {executionId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                Auto-refresh
              </label>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">Status</span>
                {getStatusIcon(progress?.status)}
              </div>
              <p className="text-lg font-bold text-blue-900 capitalize">{progress?.status || 'Unknown'}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">Progress</span>
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-lg font-bold text-green-900">{progress?.progress || 0}%</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-600">Current Step</span>
                <RefreshCw className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-sm font-bold text-purple-900">{progress?.current_step || 'Initializing...'}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-600">Agents</span>
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-lg font-bold text-orange-900">{Object.keys(progress?.agents || {}).length}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress?.progress || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Agent Status */}
        {progress?.agents && Object.keys(progress.agents).length > 0 && (
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Agent Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(progress.agents).map(([agentName, agentData]) => (
                <div key={agentName} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getAgentIcon(agentName)}
                      <span className="ml-2 font-medium text-sm capitalize">
                        {agentName.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agentData.status === 'completed' ? 'bg-green-100 text-green-800' :
                      agentData.status === 'failed' ? 'bg-red-100 text-red-800' :
                      agentData.status === 'executing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {agentData.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agentData.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{agentData.current_task}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Execution Logs
              <span className="ml-2 text-sm text-gray-500">({logs.length} entries)</span>
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No logs available yet...</p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${getLogLevelColor(log.level)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          {getAgentIcon(log.agent)}
                          <span className="ml-2 text-sm font-medium capitalize">
                            {log.agent.replace('_', ' ')}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{log.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Last updated: {progress?.start_time ? new Date(progress.start_time).toLocaleString() : 'Unknown'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchProgress}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressMonitor;

