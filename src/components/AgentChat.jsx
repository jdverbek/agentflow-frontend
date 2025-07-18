import React, { useState } from 'react';

const AgentChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('research-assistant');

  const agents = [
    { id: 'research-assistant', name: 'Research Assistant', description: 'Conducts web research and analysis' },
    { id: 'content-creator', name: 'Content Creator', description: 'Creates and edits content' },
    { id: 'data-analyst', name: 'Data Analyst', description: 'Analyzes data and creates visualizations' }
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the backend API to execute the agent
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://agentflow-backend-99xa.onrender.com'}/api/agents/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: selectedAgent,
          message: input,
          tools: ['web_search', 'data_analysis', 'document_generation']
        }),
      });

      const data = await response.json();
      
      const agentMessage = {
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your request.',
        timestamp: new Date(),
        cost: data.cost || 0,
        duration: data.duration || 0
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered a technical issue. Please try again.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Agent Chat</h2>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {agents.find(a => a.id === selectedAgent)?.description}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🤖</div>
            <p>Start a conversation with your AI agent!</p>
            <p className="text-sm mt-2">Try asking: "Research the latest AI trends" or "Analyze this data"</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.error
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.cost && (
                  <span className="ml-2">${message.cost.toFixed(3)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm">Agent is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your agent anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AgentChat;

