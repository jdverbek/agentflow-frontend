import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Workflow, 
  Plus, 
  Play, 
  Edit, 
  Trash2, 
  Settings, 
  Bot, 
  ArrowRight,
  GitBranch,
  Square,
  Circle,
  Diamond,
  Zap,
  Copy,
  Download,
  Upload
} from 'lucide-react'

export default function WorkflowDesigner({ workflows, setWorkflows, agents }) {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    nodes: [],
    connections: [],
    configuration: {
      max_execution_time_minutes: 30,
      parallel_execution_enabled: true,
      error_handling_strategy: 'stop_on_error'
    }
  })

  const nodeTypes = [
    { id: 'input', name: 'Input', icon: Circle, color: 'bg-green-500', description: 'Workflow input data' },
    { id: 'agent', name: 'Agent', icon: Bot, color: 'bg-blue-500', description: 'AI agent execution' },
    { id: 'condition', name: 'Condition', icon: Diamond, color: 'bg-yellow-500', description: 'Conditional logic' },
    { id: 'action', name: 'Action', icon: Square, color: 'bg-purple-500', description: 'Custom action' },
    { id: 'output', name: 'Output', icon: Circle, color: 'bg-red-500', description: 'Workflow output' }
  ]

  const workflowTemplates = [
    {
      id: 'simple_research',
      name: 'Simple Research Workflow',
      description: 'A basic workflow that researches a topic and summarizes findings',
      nodes: [
        { id: 'input_1', type: 'input', name: 'Research Topic', x: 100, y: 100 },
        { id: 'agent_1', type: 'agent', name: 'Research Agent', x: 300, y: 100 },
        { id: 'agent_2', type: 'agent', name: 'Summary Agent', x: 500, y: 100 },
        { id: 'output_1', type: 'output', name: 'Final Summary', x: 700, y: 100 }
      ],
      connections: [
        { source: 'input_1', target: 'agent_1' },
        { source: 'agent_1', target: 'agent_2' },
        { source: 'agent_2', target: 'output_1' }
      ]
    },
    {
      id: 'content_pipeline',
      name: 'Content Creation Pipeline',
      description: 'A workflow for creating and reviewing content',
      nodes: [
        { id: 'input_1', type: 'input', name: 'Content Brief', x: 100, y: 100 },
        { id: 'agent_1', type: 'agent', name: 'Content Creator', x: 300, y: 100 },
        { id: 'agent_2', type: 'agent', name: 'Content Reviewer', x: 500, y: 100 },
        { id: 'condition_1', type: 'condition', name: 'Quality Check', x: 500, y: 250 },
        { id: 'output_1', type: 'output', name: 'Final Content', x: 700, y: 100 }
      ],
      connections: [
        { source: 'input_1', target: 'agent_1' },
        { source: 'agent_1', target: 'agent_2' },
        { source: 'agent_2', target: 'condition_1' },
        { source: 'condition_1', target: 'output_1' },
        { source: 'condition_1', target: 'agent_1' }
      ]
    }
  ]

  const handleCreateWorkflow = () => {
    setIsCreating(true)
    setSelectedWorkflow(null)
    setFormData({
      name: '',
      description: '',
      nodes: [],
      connections: [],
      configuration: {
        max_execution_time_minutes: 30,
        parallel_execution_enabled: true,
        error_handling_strategy: 'stop_on_error'
      }
    })
  }

  const handleSaveWorkflow = () => {
    const newWorkflow = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      nodes: formData.nodes.length,
      status: 'draft',
      lastRun: 'Never',
      ...formData
    }
    
    setWorkflows([...workflows, newWorkflow])
    setIsCreating(false)
    setFormData({
      name: '',
      description: '',
      nodes: [],
      connections: [],
      configuration: {
        max_execution_time_minutes: 30,
        parallel_execution_enabled: true,
        error_handling_strategy: 'stop_on_error'
      }
    })
  }

  const handleUseTemplate = (template) => {
    setFormData({
      ...formData,
      name: template.name,
      description: template.description,
      nodes: template.nodes,
      connections: template.connections
    })
    setIsCreating(true)
  }

  const handleExecuteWorkflow = (workflow) => {
    // Mock execution
    console.log('Executing workflow:', workflow.name)
    // In a real app, this would trigger the workflow execution
  }

  if (isCreating || selectedWorkflow) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {isCreating ? 'Create New Workflow' : 'Edit Workflow'}
            </h2>
            <p className="text-muted-foreground">
              Design your AI agent workflow
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => {setIsCreating(false); setSelectedWorkflow(null)}}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorkflow} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Workflow className="h-4 w-4 mr-2" />
              Save Workflow
            </Button>
          </div>
        </div>

        <Tabs defaultValue="design" className="space-y-4">
          <TabsList>
            <TabsTrigger value="design">Visual Designer</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-4">
            <div className="grid grid-cols-4 gap-6">
              {/* Node Palette */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm">Node Palette</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {nodeTypes.map((nodeType) => {
                    const Icon = nodeType.icon
                    return (
                      <div
                        key={nodeType.id}
                        className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                        draggable
                      >
                        <div className={`w-4 h-4 ${nodeType.color} rounded flex items-center justify-center`}>
                          <Icon className="h-2 w-2 text-white" />
                        </div>
                        <span className="text-sm">{nodeType.name}</span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Canvas */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    Workflow Canvas
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Zap className="h-3 w-3 mr-1" />
                        Auto Layout
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Test Run
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                    {formData.nodes.length === 0 ? (
                      <div className="text-center">
                        <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Empty Canvas</h3>
                        <p className="text-muted-foreground mb-4">Drag nodes from the palette to start building</p>
                        <Button size="sm" variant="outline">
                          Use Template
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        {/* Mock workflow visualization */}
                        <div className="flex items-center justify-center space-x-8 h-full">
                          {formData.nodes.map((node, index) => {
                            const nodeType = nodeTypes.find(nt => nt.id === node.type)
                            const Icon = nodeType?.icon || Circle
                            
                            return (
                              <div key={node.id} className="flex items-center">
                                <div className={`w-16 h-16 ${nodeType?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center shadow-lg`}>
                                  <Icon className="h-8 w-8 text-white" />
                                </div>
                                {index < formData.nodes.length - 1 && (
                                  <ArrowRight className="h-6 w-6 text-muted-foreground mx-4" />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Configuration</CardTitle>
                <CardDescription>Configure basic workflow settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    placeholder="e.g., Content Creation Pipeline"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea
                    id="workflow-description"
                    placeholder="Describe what this workflow does..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Settings</CardTitle>
                <CardDescription>Configure how the workflow executes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Max Execution Time (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.configuration.max_execution_time_minutes}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        max_execution_time_minutes: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Error Handling Strategy</Label>
                  <Select 
                    value={formData.configuration.error_handling_strategy}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        error_handling_strategy: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stop_on_error">Stop on Error</SelectItem>
                      <SelectItem value="continue_on_error">Continue on Error</SelectItem>
                      <SelectItem value="retry_on_error">Retry on Error</SelectItem>
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
          <h2 className="text-2xl font-bold">Workflow Designer</h2>
          <p className="text-muted-foreground">
            Create and manage AI agent workflows
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleCreateWorkflow} className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Workflow Templates
          </CardTitle>
          <CardDescription>Get started quickly with pre-built workflow templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {workflowTemplates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Workflow className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium">{template.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge variant="outline">{template.nodes.length} nodes</Badge>
                    <Badge variant="outline">{template.connections.length} connections</Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Existing Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Your Workflows</CardTitle>
          <CardDescription>Manage your existing workflows</CardDescription>
        </CardHeader>
        <CardContent>
          {workflows.length === 0 ? (
            <div className="text-center py-8">
              <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
              <p className="text-muted-foreground mb-4">Create your first workflow to get started</p>
              <Button onClick={handleCreateWorkflow}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workflow
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Workflow className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{workflow.name}</h3>
                      <p className="text-sm text-muted-foreground">{workflow.nodes} nodes • Last run: {workflow.lastRun}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                          {workflow.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExecuteWorkflow(workflow)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-3 w-3 mr-1" />
                      Clone
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
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

