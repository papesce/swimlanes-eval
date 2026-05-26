import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react'

// Labels read bottom-to-top: "[source] {label} [target]"
// e.g. "Fix ceiling cable" → supports → "Keep home operational"
export const EDGE_LABELS = [
  'supports',
  'contributes to',
  'enables',
  'is part of',
  'is required by',
  'drives',
  'feeds into',
  'conflicts with',
]

interface LabeledEdgeData {
  label?: string
  onLabelClick?: (edgeId: string) => void
  [key: string]: unknown
}

export function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const edgeData = data as LabeledEdgeData | undefined
  const label = edgeData?.label

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 500,
            background: label ? 'white' : 'rgba(255,255,255,0.7)',
            border: label ? '1px solid #bbb' : '1px dashed #ccc',
            borderRadius: 4,
            padding: '2px 6px',
            color: label ? '#333' : '#999',
            whiteSpace: 'nowrap',
          }}
          className="nodrag nopan"
          data-edge-id={id}
          title="Click to label this connection"
        >
          {label || '+ label'}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
