import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Bot, 
  Workflow, 
  Play, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Activity,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'

export default function Dashboard({ agents, workflows, executions }) {
  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.status === 'active').length,
    totalExecutions: executions.length,
    runningExecutions: executions.filter(e => e.status === 'running').length,
    completedExecutions: executions.filter(e => e.status === 'completed').length,
    totalCost: executions.reduce((sum, e) => sum + parseFloat(e.cost.replace('$', '')), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to AgentFlow - Your AI workflow automation platform
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Play className="h-4 w-4 mr-2" />
            Quick Start
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalAgents} total agents
            </p>
            <Progress value={(stats.activeAgents / stats.totalAgents) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalWorkflows} total workflows
            </p>
            <Progress value={(stats.activeWorkflows / stats.totalWorkflows) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions</CardTitle>
            <Play className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.runningExecutions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedExecutions} completed today
            </p>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">95% success rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Today</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              -12% from yesterday
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">Optimized</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              Recent Agents
            </CardTitle>
            <CardDescription>Your most recently created agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.slice(0, 3).map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Agents
            </Button>
          </CardContent>
        </Card>

        {/* Recent Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Workflow className="h-5 w-5 mr-2" />
              Recent Workflows
            </CardTitle>
            <CardDescription>Your workflow execution history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Workflow className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{workflow.name}</p>
                      <p className="text-sm text-muted-foreground">{workflow.nodes} nodes • {workflow.lastRun}</p>
                    </div>
                  </div>
                  <Badge variant={workflow.status === 'active' ? 'default' : 'outline'}>
                    {workflow.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Workflows
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Executions
          </CardTitle>
          <CardDescription>Latest workflow execution results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {executions.map((execution) => (
              <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    execution.status === 'completed' ? 'bg-green-500' :
                    execution.status === 'running' ? 'bg-blue-500 animate-pulse' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{execution.workflow}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {execution.duration}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {execution.cost}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    execution.status === 'completed' ? 'default' :
                    execution.status === 'running' ? 'secondary' :
                    'destructive'
                  }>
                    {execution.status}
                  </Badge>
                  {execution.status === 'running' && (
                    <Button size="sm" variant="outline">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Monitor
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Get started with AgentFlow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-auto p-4 flex-col space-y-2" variant="outline">
              <Bot className="h-6 w-6" />
              <span>Create Agent</span>
              <span className="text-xs text-muted-foreground">Build your first AI agent</span>
            </Button>
            <Button className="h-auto p-4 flex-col space-y-2" variant="outline">
              <Workflow className="h-6 w-6" />
              <span>Design Workflow</span>
              <span className="text-xs text-muted-foreground">Create agent workflows</span>
            </Button>
            <Button className="h-auto p-4 flex-col space-y-2" variant="outline">
              <Play className="h-6 w-6" />
              <span>Run Template</span>
              <span className="text-xs text-muted-foreground">Use pre-built templates</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

