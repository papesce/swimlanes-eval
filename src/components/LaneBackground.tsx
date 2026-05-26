import { useViewport } from '@xyflow/react'

interface Lane {
  id: string
  label: string
  color: string
  y: number
}

interface LaneBackgroundProps {
  lanes: Lane[]
}

const LANE_HEIGHT = 200
const LANE_WIDTH = 2000

export function LaneBackground({ lanes }: LaneBackgroundProps) {
  const { x, y, zoom } = useViewport()

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {lanes.map((lane) => (
        <g key={lane.id}>
          <rect
            x={lane.y * zoom + x - 200 * zoom}
            y={0}
            width={LANE_WIDTH * zoom}
            height="100%"
            fill="none"
          />
          <rect
            x={-200 * zoom + x}
            y={lane.y * zoom + y}
            width={LANE_WIDTH * zoom}
            height={LANE_HEIGHT * zoom}
            fill={lane.color}
            opacity={0.5}
            rx={0}
          />
          <text
            x={20 + x}
            y={lane.y * zoom + y + 30 * zoom}
            fontSize={14 * zoom}
            fontWeight="bold"
            fill={lane.id === 'areas' ? '#2e7d32' : lane.id === 'goals' ? '#3f51b5' : '#795548'}
            opacity={0.8}
          >
            {lane.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
