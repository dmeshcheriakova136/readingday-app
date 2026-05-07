interface BlockIProps {
  size?: number
}

export default function BlockI({ size = 28 }: BlockIProps) {
  const h = Math.round(size * 1.24)
  return (
    <svg width={size} height={h} viewBox="0 0 100 124" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      {/* Navy outer I-beam */}
      <path d="M0 0H100V28H68V96H100V124H0V96H32V28H0Z" fill="#13294B"/>
      {/* Orange inner I-beam */}
      <path d="M7 7H93V21H61V103H93V117H7V103H39V21H7Z" fill="#E84A27"/>
    </svg>
  )
}
