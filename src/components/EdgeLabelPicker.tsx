import { EDGE_LABELS } from './LabeledEdge'

interface EdgeLabelPickerProps {
  x: number
  y: number
  currentLabel?: string
  onSelect: (label: string | undefined) => void
  onClose: () => void
}

export function EdgeLabelPicker({ x, y, currentLabel, onSelect, onClose }: EdgeLabelPickerProps) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: x,
          top: y,
          zIndex: 1000,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          padding: '6px 0',
          minWidth: 160,
        }}
      >
        <div style={{
          padding: '4px 12px 6px',
          fontSize: 11,
          color: '#888',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}>
          Connection type
        </div>
        {EDGE_LABELS.map((label) => (
          <button
            key={label}
            onClick={() => onSelect(label)}
            style={{
              display: 'block',
              width: '100%',
              padding: '6px 12px',
              border: 'none',
              background: label === currentLabel ? '#e3f2fd' : 'transparent',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: 13,
              color: '#333',
              fontWeight: label === currentLabel ? 600 : 400,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f5' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = label === currentLabel ? '#e3f2fd' : 'transparent' }}
          >
            {label}
          </button>
        ))}
        {currentLabel && (
          <>
            <div style={{ borderTop: '1px solid #eee', margin: '4px 0' }} />
            <button
              onClick={() => onSelect(undefined)}
              style={{
                display: 'block',
                width: '100%',
                padding: '6px 12px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 13,
                color: '#e53935',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#fff3f3' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              Remove label
            </button>
          </>
        )}
      </div>
    </>
  )
}
