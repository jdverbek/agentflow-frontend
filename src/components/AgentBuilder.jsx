import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { 
  Bot, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Settings, 
  Brain, 
  Zap,
  Search,
  FileText,
  Calculator,
  Globe,
  Database,
  Sparkles
} from 'lucide-react'

export default function AgentBuilder({ agents, setAgents }) {
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    goal: '',
    tools: [],
    llm_provider: 'openai',
    llm_model: 'gpt-3.5-turbo',
    creativity_level: [0.7],
    risk_tolerance: [0.5],
    output_verbosity: 'medium',
    reasoning_transparency: true
  })

  const availableTools = [
    { id: 'web_search', name: 'Web Search', icon: Search, description: 'Search the internet for information' },
    { id: 'text_processor', name: 'Text Processor', icon: FileText, description: 'Process and analyze text content' },
    { id: 'calculator', name: 'Calculator', icon: Calculator, description: 'Perform mathematical calculations' },
    { id: 'data_analyzer', name: 'Data Analyzer', icon: Database, description: 'Analyze and interpret data' },
    { id: 'file_reader', name: 'File Reader', icon: FileText, description: 'Read and process files' }
  ]

  const agentTemplates = [
    {
      id: 'research_assistant',
      name: 'Research Assistant',
      role: 'Research Assistant specialized in finding and analyzing information',
      goal: 'Help users find accurate, relevant information and provide comprehensive analysis',
      tools: ['web_search', 'data_analyzer', 'text_processor'],
      icon: Search
    },
    {
      id: 'content_creator',
      name: 'Content Creator',
      role: 'Creative Content Creator specialized in writing and content generation',
      goal: 'Create engaging, high-quality content tailored to specific audiences and purposes',
      tools: ['text_processor', 'web_search'],
      icon: FileText
    },
    {
      id: 'data_analyst',
      name: 'Data Analyst',
      role: 'Data Analyst specialized in processing and interpreting data',
      goal: 'Analyze data to extract meaningful insights and provide actionable recommendations',
      tools: ['data_analyzer', 'calculator', 'text_processor'],
      icon: Database
    }
  ]

  const handleCreateAgent = () => {
    setIsCreating(true)
    setSelectedAgent(null)
    setFormData({
      name: '',
      role: '',
      goal: '',
      tools: [],
      llm_provider: 'openai',
      llm_model: 'gpt-3.5-turbo',
      creativity_level: [0.7],
      risk_tolerance: [0.5],
      output_verbosity: 'medium',
      reasoning_transparency: true
    })
  }

  const handleSaveAgent = () => {
    const newAgent = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      goal: formData.goal,
      tools: formData.tools,
      status: 'active',
      ...formData
    }
    
    setAgents([...agents, newAgent])
    setIsCreating(false)
    setFormData({
      name: '',
      role: '',
      goal: '',
      tools: [],
      llm_provider: 'openai',
      llm_model: 'gpt-3.5-turbo',
      creativity_level: [0.7],
      risk_tolerance: [0.5],
      output_verbosity: 'medium',
      reasoning_transparency: true
    })
  }

  const handleUseTemplate = (template) => {
    setFormData({
      ...formData,
      name: template.name,
      role: template.role,
      goal: template.goal,
      tools: template.tools
    })
    setIsCreating(true)
  }

  const toggleTool = (toolId) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter(t => t !== toolId)
        : [...prev.tools, toolId]
    }))
  }

  if (isCreating || selectedAgent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {isCreating ? 'Create New Agent' : 'Edit Agent'}
            </h2>
            <p className="text-muted-foreground">
              Configure your AI agent's behavior and capabilities
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => {setIsCreating(false); setSelectedAgent(null)}}>
              Cancel
            </Button>
            <Button onClick={handleSaveAgent} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Bot className="h-4 w-4 mr-2" />
              Save Agent
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Identity</CardTitle>
                <CardDescription>Define your agent's core identity and purpose</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Research Assistant"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role Description</Label>
                  <Textarea
                    id="role"
                    placeholder="Describe what role this agent plays..."
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal">Primary Goal</Label>
                  <Textarea
                    id="goal"
                    placeholder="What is this agent's main objective?"
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Tools</CardTitle>
                <CardDescription>Select the tools your agent can use</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {availableTools.map((tool) => {
                    const Icon = tool.icon
                    const isSelected = formData.tools.includes(tool.id)
                    
                    return (
                      <div
                        key={tool.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleTool(tool.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                          <div className="flex-1">
                            <h4 className="font-medium">{tool.name}</h4>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                          </div>
                          {isSelected && (
                            <Badge className="bg-blue-600">Selected</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Parameters</CardTitle>
                <CardDescription>Fine-tune your agent's behavior and personality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Creativity Level: {formData.creativity_level[0]}</Label>
                  <Slider
                    value={formData.creativity_level}
                    onValueChange={(value) => setFormData({...formData, creativity_level: value})}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Higher values make the agent more creative and experimental
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Risk Tolerance: {formData.risk_tolerance[0]}</Label>
                  <Slider
                    value={formData.risk_tolerance}
                    onValueChange={(value) => setFormData({...formData, risk_tolerance: value})}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Higher values make the agent more willing to take risks
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Output Verbosity</Label>
                  <Select value={formData.output_verbosity} onValueChange={(value) => setFormData({...formData, output_verbosity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reasoning Transparency</Label>
                    <p className="text-sm text-muted-foreground">
                      Show the agent's reasoning process
                    </p>
                  </div>
                  <Switch
                    checked={formData.reasoning_transparency}
                    onCheckedChange={(checked) => setFormData({...formData, reasoning_transparency: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>LLM Configuration</CardTitle>
                <CardDescription>Configure the underlying language model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select value={formData.llm_provider} onValueChange={(value) => setFormData({...formData, llm_provider: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="local">Local Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select value={formData.llm_model} onValueChange={(value) => setFormData({...formData, llm_model: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Builder</h2>
          <p className="text-muted-foreground">
            Create and manage your AI agents
          </p>
        </div>
        <Button onClick={handleCreateAgent} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Agent Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Quick Start Templates
          </CardTitle>
          <CardDescription>Get started quickly with pre-configured agent templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {agentTemplates.map((template) => {
              const Icon = template.icon
              return (
                <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-medium">{template.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{template.role}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tools.map((tool) => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        {availableTools.find(t => t.id === tool)?.name}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Existing Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Your Agents</CardTitle>
          <CardDescription>Manage your existing AI agents</CardDescription>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No agents yet</h3>
              <p className="text-muted-foreground mb-4">Create your first agent to get started</p>
              <Button onClick={handleCreateAgent}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Agent
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.role}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {agent.tools?.length || 0} tools
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

