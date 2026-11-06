/** 화살촉 하나를 그립니다. angle은 도 단위이며 0이 오른쪽입니다. */
export default function ArrowHead({ x, y, angle = 0, color = "#64748b" }: { x: number; y: number; angle?: number; color?: string }) {
  return <polygon points="-7,-4 0,0 -7,4" fill={color} transform={`translate(${x} ${y}) rotate(${angle})`} />;
}
