import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'

const variantStyles: Record<string, React.CSSProperties> = {
  area: {
    background: '#ffffff',
    border: '2px solid #2e7d32',
    color: '#1b5e20',
    fontWeight: 700,
    fontSize: 16,
  },
  goal: {
    background: '#ffffff',
    border: '2px solid #5c6bc0',
    color: '#283593',
    fontWeight: 500,
    fontSize: 14,
  },
  task: {
    background: '#ffffff',
    border: '2px solid #9e9e9e',
    color: '#424242',
    fontWeight: 400,
    fontSize: 13,
  },
}

export const GoalNode = memo(({ data, selected }: NodeProps) => {
  const variant = (data.variant as string) || 'task'
  const style = variantStyles[variant] || variantStyles.task

  return (
    <div
      style={{
        ...style,
        padding: '12px 20px',
        borderRadius: 8,
        minWidth: 140,
        textAlign: 'center',
        boxShadow: selected
          ? '0 0 0 3px #5c6bc0'
          : '0 1px 4px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s',
        cursor: 'grab',
      }}
    >
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ background: '#999', width: 8, height: 8 }}
      />
      <div>{data.label as string}</div>
      <Handle
        type="source"
        position={Position.Top}
        style={{ background: '#999', width: 8, height: 8 }}
      />
    </div>
  )
})

GoalNode.displayName = 'GoalNode'
