import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import AgentChat from './components/AgentChat'
import { 
  Bot, 
  Workflow, 
  Settings, 
  Play, 
  Plus, 
  Users, 
  BarChart3, 
  Zap,
  Brain,
  Network,
  Eye,
  Sparkles,
  MessageCircle
} from 'lucide-react'
import Dashboard from './components/Dashboard'
import AgentBuilder from './components/AgentBuilder'
import WorkflowDesigner from './components/WorkflowDesigner'
import ExecutionMonitor from './components/ExecutionMonitor'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [agents, setAgents] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [executions, setExecutions] = useState([])

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading data
    setAgents([
      { id: 1, name: 'Research Assistant', role: 'Research Specialist', status: 'active' },
      { id: 2, name: 'Content Creator', role: 'Creative Writer', status: 'active' },
      { id: 3, name: 'Data Analyst', role: 'Data Processor', status: 'inactive' }
    ])
    
    setWorkflows([
      { id: 1, name: 'Content Pipeline', nodes: 3, status: 'active', lastRun: '2 hours ago' },
      { id: 2, name: 'Research Workflow', nodes: 4, status: 'draft', lastRun: 'Never' }
    ])
    
    setExecutions([
      { id: 1, workflow: 'Content Pipeline', status: 'completed', duration: '2m 34s', cost: '$0.12' },
      { id: 2, workflow: 'Research Workflow', status: 'running', duration: '1m 15s', cost: '$0.08' }
    ])
  }, [])

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'executions', label: 'Executions', icon: Play },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard agents={agents} workflows={workflows} executions={executions} />
      case 'agents':
        return <AgentBuilder agents={agents} setAgents={setAgents} />
      case 'workflows':
        return <WorkflowDesigner workflows={workflows} setWorkflows={setWorkflows} agents={agents} />
      case 'executions':
        return <ExecutionMonitor executions={executions} />
      case 'settings':
        return <SettingsPanel />
      default:
        return <Dashboard agents={agents} workflows={workflows} executions={executions} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AgentFlow
              </h1>
              <p className="text-xs text-muted-foreground">AI Workflow Automation</p>
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Zap className="h-3 w-3 mr-1" />
              MVP Active
            </Badge>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 border-r min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 space-y-4">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Active Agents</p>
                  <p className="text-lg font-semibold">{agents.filter(a => a.status === 'active').length}</p>
                </div>
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Workflows</p>
                  <p className="text-lg font-semibold">{workflows.length}</p>
                </div>
                <Network className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Key Features</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>Transparent Execution</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Brain className="h-3 w-3" />
                <span>Universal LLM Support</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Network className="h-3 w-3" />
                <span>Visual Workflow Design</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

// Settings Panel Component
function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure your AgentFlow environment</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="llm">LLM Providers</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                </div>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-save Workflows</p>
                  <p className="text-sm text-muted-foreground">Automatically save workflow changes</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LLM Providers</CardTitle>
              <CardDescription>Configure your AI model providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">OpenAI</h4>
                  <p className="text-sm text-muted-foreground">GPT-3.5, GPT-4</p>
                  <Badge className="mt-2">Connected</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Local Models</h4>
                  <p className="text-sm text-muted-foreground">Ollama, Hugging Face</p>
                  <Badge variant="outline" className="mt-2">Configure</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and privacy options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Audit Logging</p>
                  <p className="text-sm text-muted-foreground">Log all agent actions</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Encryption</p>
                  <p className="text-sm text-muted-foreground">Encrypt sensitive data</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App

