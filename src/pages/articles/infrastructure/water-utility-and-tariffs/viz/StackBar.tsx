export interface BarPart {
  value: number;
  label: string;
  fill: string;
  /** true면 채우지 않고 점선 테두리만 그립니다(아직 마련되지 않은 몫) */
  dashed?: boolean;
}

/** 금액 1을 3px로 그리는 가로 누적 막대입니다. 장부 Viz들이 같은 축척을 씁니다. */
export function StackBar({ y, parts, height = 38 }: { y: number; parts: readonly BarPart[]; height?: number }) {
  return (
    <g>
      {parts.map((part, index) => {
        const before = parts.slice(0, index).reduce<number>((sum, item) => sum + item.value, 0);
        const x = 20 + before * 3;
        const width = part.value * 3;
        return (
          <g key={`${part.label}-${index}`}>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill={part.dashed ? "none" : part.fill}
              stroke={part.dashed ? part.fill : "none"}
              strokeWidth={1.25}
              strokeDasharray={part.dashed ? "4 3" : undefined}
            />
            <text
              x={x + width / 2}
              y={y + height / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill={part.dashed ? part.fill : "#ffffff"}
            >
              {part.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
