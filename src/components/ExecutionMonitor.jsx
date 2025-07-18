import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  DollarSign, 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Download,
  RefreshCw,
  Zap,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

export default function ExecutionMonitor({ executions }) {
  const [selectedExecution, setSelectedExecution] = useState(null)
  const [filter, setFilter] = useState('all')

  const filteredExecutions = executions.filter(execution => {
    if (filter === 'all') return true
    return execution.status === filter
  })

  const stats = {
    total: executions.length,
    running: executions.filter(e => e.status === 'running').length,
    completed: executions.filter(e => e.status === 'completed').length,
    failed: executions.filter(e => e.status === 'failed').length,
    totalCost: executions.reduce((sum, e) => sum + parseFloat(e.cost.replace('$', '')), 0),
    avgDuration: '2m 15s',
    successRate: executions.length > 0 ? (executions.filter(e => e.status === 'completed').length / executions.length * 100).toFixed(1) : 0
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (selectedExecution) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={() => setSelectedExecution(null)}>
              ← Back to Executions
            </Button>
            <h2 className="text-2xl font-bold mt-2">Execution Details</h2>
            <p className="text-muted-foreground">
              {selectedExecution.workflow} • Execution #{selectedExecution.id}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
            {selectedExecution.status === 'running' && (
              <Button variant="outline">
                <Square className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedExecution.status)}
                <Badge className={getStatusColor(selectedExecution.status)}>
                  {selectedExecution.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{selectedExecution.duration}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{selectedExecution.cost}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={selectedExecution.status === 'completed' ? 100 : selectedExecution.status === 'running' ? 65 : 0} />
                <span className="text-sm text-muted-foreground">
                  {selectedExecution.status === 'completed' ? '100%' : selectedExecution.status === 'running' ? '65%' : '0%'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
            <TabsTrigger value="nodes">Node Details</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Execution Logs
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[
                    { time: '14:32:01', level: 'info', message: 'Workflow execution started', node: 'system' },
                    { time: '14:32:02', level: 'info', message: 'Input node processed successfully', node: 'input_1' },
                    { time: '14:32:05', level: 'info', message: 'Research Agent initialized', node: 'agent_1' },
                    { time: '14:32:08', level: 'info', message: 'Web search completed: 5 results found', node: 'agent_1' },
                    { time: '14:32:12', level: 'info', message: 'Research analysis in progress...', node: 'agent_1' },
                    { time: '14:32:18', level: 'success', message: 'Research Agent completed successfully', node: 'agent_1' },
                    { time: '14:32:19', level: 'info', message: 'Summary Agent initialized', node: 'agent_2' },
                    { time: '14:32:22', level: 'info', message: 'Generating summary from research data...', node: 'agent_2' },
                    { time: '14:32:28', level: 'success', message: 'Summary generated successfully', node: 'agent_2' },
                    { time: '14:32:29', level: 'success', message: 'Workflow execution completed', node: 'system' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded text-sm font-mono">
                      <span className="text-muted-foreground min-w-[60px]">{log.time}</span>
                      <Badge 
                        variant="outline" 
                        className={`min-w-[70px] text-xs ${
                          log.level === 'success' ? 'border-green-500 text-green-700' :
                          log.level === 'error' ? 'border-red-500 text-red-700' :
                          log.level === 'warning' ? 'border-yellow-500 text-yellow-700' :
                          'border-blue-500 text-blue-700'
                        }`}
                      >
                        {log.level}
                      </Badge>
                      <span className="text-muted-foreground min-w-[80px]">[{log.node}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nodes" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { id: 'input_1', name: 'Research Topic Input', type: 'input', status: 'completed', duration: '0.1s', cost: '$0.00' },
                { id: 'agent_1', name: 'Research Agent', type: 'agent', status: 'completed', duration: '16.2s', cost: '$0.08' },
                { id: 'agent_2', name: 'Summary Agent', type: 'agent', status: 'completed', duration: '9.8s', cost: '$0.04' },
                { id: 'output_1', name: 'Final Summary Output', type: 'output', status: 'completed', duration: '0.1s', cost: '$0.00' }
              ].map((node) => (
                <Card key={node.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      {node.name}
                      {getStatusIcon(node.status)}
                    </CardTitle>
                    <CardDescription>{node.type} node</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{node.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost:</span>
                        <span>{node.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(node.status)}>
                          {node.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Token Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-muted-foreground">tokens consumed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">API Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">total API calls</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-muted-foreground">execution efficiency</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Execution Monitor</h2>
          <p className="text-muted-foreground">
            Monitor and analyze workflow executions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.running} currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} completed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration}</div>
            <p className="text-xs text-muted-foreground">
              average execution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              across all executions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="running">Running ({stats.running})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({stats.failed})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>Recent workflow execution results</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredExecutions.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No executions found</h3>
                  <p className="text-muted-foreground">
                    {filter === 'all' ? 'No workflow executions yet' : `No ${filter} executions`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredExecutions.map((execution) => (
                    <div 
                      key={execution.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      onClick={() => setSelectedExecution(execution)}
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(execution.status)}
                        <div>
                          <h4 className="font-medium">{execution.workflow}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {execution.duration}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {execution.cost}
                            </span>
                            <span>Execution #{execution.id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                        
                        {execution.status === 'running' && (
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Pause className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Square className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

