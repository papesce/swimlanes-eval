import { useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  Panel,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { GoalNode } from './GoalNode'
import { LaneBackground } from './LaneBackground'
import { LabeledEdge } from './LabeledEdge'
import { EdgeLabelPicker } from './EdgeLabelPicker'

const LANE_HEIGHT = 200
const LANES = [
  { id: 'areas', label: 'AREAS', color: '#e8f5e9', y: 0 },
  { id: 'goals', label: 'GOALS', color: '#e8eaf6', y: LANE_HEIGHT },
  { id: 'tasks', label: 'TASKS', color: '#f5f5dc', y: LANE_HEIGHT * 2 },
]

const initialNodes: Node[] = [
  {
    id: 'area-1',
    type: 'goalNode',
    position: { x: 200, y: 50 },
    data: { label: 'Wellbeing', lane: 'areas', variant: 'area' },
  },
  {
    id: 'area-2',
    type: 'goalNode',
    position: { x: 600, y: 50 },
    data: { label: 'Productivity', lane: 'areas', variant: 'area' },
  },
  {
    id: 'obj-1',
    type: 'goalNode',
    position: { x: 100, y: 250 },
    data: { label: 'Keep home operational', lane: 'goals', variant: 'goal' },
  },
  {
    id: 'obj-2',
    type: 'goalNode',
    position: { x: 380, y: 250 },
    data: { label: 'Reduce home stress', lane: 'goals', variant: 'goal' },
  },
  {
    id: 'obj-3',
    type: 'goalNode',
    position: { x: 650, y: 250 },
    data: { label: 'Electrical safety', lane: 'goals', variant: 'goal' },
  },
  {
    id: 'task-1',
    type: 'goalNode',
    position: { x: 80, y: 460 },
    data: { label: 'Fix ceiling cable', lane: 'tasks', variant: 'task' },
  },
  {
    id: 'task-2',
    type: 'goalNode',
    position: { x: 370, y: 460 },
    data: { label: 'Check electrical panel', lane: 'tasks', variant: 'task' },
  },
  {
    id: 'task-3',
    type: 'goalNode',
    position: { x: 650, y: 460 },
    data: { label: 'Call the electrician', lane: 'tasks', variant: 'task' },
  },
]

// Edges flow bottom-to-top: source (lower) → target (upper)
// Read as: "[source] {label} [target]"
const initialEdges: Edge[] = [
  // "Fix ceiling cable" supports "Keep home operational"
  { id: 'e-task1-obj1', source: 'task-1', target: 'obj-1', type: 'labeled', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#999' }, data: { label: 'supports' } },
  // "Fix ceiling cable" contributes to "Reduce home stress"
  { id: 'e-task1-obj2', source: 'task-1', target: 'obj-2', type: 'labeled', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#999' }, data: { label: 'contributes to' } },
  // "Check electrical panel" enables "Electrical safety"
  { id: 'e-task2-obj3', source: 'task-2', target: 'obj-3', type: 'labeled', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#999' }, data: { label: 'enables' } },
  // "Call the electrician" is required by "Electrical safety"
  { id: 'e-task3-obj3', source: 'task-3', target: 'obj-3', type: 'labeled', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#999' }, data: { label: 'is required by' } },
  // "Keep home operational" is part of "Wellbeing"
  { id: 'e-obj1-area1', source: 'obj-1', target: 'area-1', type: 'labeled', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#999' }, data: { label: 'is part of' } },
  // "Reduce home stress" feeds into "Wellbeing"
  { id: 'e-obj2-area1', source: 'obj-2', target: 'area-1', type: 'labeled', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#999' }, data: { label: 'feeds into' } },
  // "Electrical safety" drives "Productivity"
  { id: 'e-obj3-area2', source: 'obj-3', target: 'area-2', type: 'labeled', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#999' }, data: { label: 'drives' } },
  // "Reduce home stress" contributes to "Productivity" (weak/indirect)
  { id: 'e-obj2-area2', source: 'obj-2', target: 'area-2', type: 'labeled', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#999', strokeDasharray: '5,5' }, data: { label: 'contributes to' } },
]

const nodeTypes: NodeTypes = {
  goalNode: GoalNode,
}

const edgeTypes: EdgeTypes = {
  labeled: LabeledEdge,
}

let nodeId = 100

export function GoalEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedLane, setSelectedLane] = useState<string>('tasks')
  const [labelPicker, setLabelPicker] = useState<{ edgeId: string; x: number; y: number } | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'labeled',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#999' },
            data: {},
          },
          eds
        )
      )
    },
    [setEdges]
  )

  const onEdgeLabelClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    const edgeLabelEl = target.closest('[data-edge-id]') as HTMLElement | null
    if (edgeLabelEl) {
      const edgeId = edgeLabelEl.dataset.edgeId!
      setLabelPicker({ edgeId, x: event.clientX, y: event.clientY })
    }
  }, [])

  const onLabelSelect = useCallback(
    (label: string | undefined) => {
      if (!labelPicker) return
      setEdges((eds) =>
        eds.map((e) =>
          e.id === labelPicker.edgeId
            ? { ...e, data: { ...e.data, label } }
            : e
        )
      )
      setLabelPicker(null)
    },
    [labelPicker, setEdges]
  )

  const addNode = useCallback(() => {
    const id = `node-${nodeId++}`
    const lane = LANES.find((l) => l.id === selectedLane)!
    const variant = selectedLane === 'areas' ? 'area' : selectedLane === 'goals' ? 'goal' : 'task'
    const newNode: Node = {
      id,
      type: 'goalNode',
      position: {
        x: 200 + Math.random() * 300,
        y: lane.y + 40 + Math.random() * 80,
      },
      data: { label: `New ${variant}`, lane: selectedLane, variant },
    }
    setNodes((nds) => [...nds, newNode])
  }, [selectedLane, setNodes])

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const newLabel = prompt('Edit label:', node.data.label as string)
      if (newLabel !== null) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
          )
        )
      }
    },
    [setNodes]
  )

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected))
    setEdges((eds) => eds.filter((e) => !e.selected))
  }, [setNodes, setEdges])

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }} onClick={onEdgeLabelClick}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        deleteKeyCode="Delete"
        style={{ background: '#fafafa' }}
      >
        <LaneBackground lanes={LANES} />
        <Background gap={20} size={1} color="#e0e0e0" />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const variant = n.data?.variant
            if (variant === 'area') return '#2e7d32'
            if (variant === 'goal') return '#3f51b5'
            return '#795548'
          }}
        />
        <Panel position="top-left">
          <div style={{
            background: 'white',
            padding: '12px 16px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            fontSize: 14,
          }}>
            <select
              value={selectedLane}
              onChange={(e) => setSelectedLane(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
            >
              {LANES.map((lane) => (
                <option key={lane.id} value={lane.id}>
                  {lane.label}
                </option>
              ))}
            </select>
            <button onClick={addNode} style={btnStyle}>
              + Add Node
            </button>
            <button onClick={onDeleteSelected} style={{ ...btnStyle, background: '#e53935', color: 'white' }}>
              Delete Selected
            </button>
          </div>
        </Panel>
        <Panel position="top-right">
          <div style={{
            background: 'white',
            padding: '10px 14px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: 12,
            color: '#666',
            lineHeight: 1.6,
          }}>
            <strong>Controls:</strong><br/>
            Drag nodes to move • Double-click to edit<br/>
            Drag from handle to connect • Scroll to zoom<br/>
            Click edge label to rename • Select + Delete to remove
          </div>
        </Panel>
      </ReactFlow>
      {labelPicker && (
        <EdgeLabelPicker
          x={labelPicker.x}
          y={labelPicker.y}
          currentLabel={edges.find((e) => e.id === labelPicker.edgeId)?.data?.label as string | undefined}
          onSelect={onLabelSelect}
          onClose={() => setLabelPicker(null)}
        />
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 4,
  border: '1px solid #ccc',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 500,
}
