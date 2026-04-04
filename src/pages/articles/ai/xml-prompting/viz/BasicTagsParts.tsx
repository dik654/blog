const MF = 'ui-monospace,monospace';

interface TagProps { color: string; tag: string }

export function TagContent({ step, color, tag }: TagProps & { step: number }) {
  if (step === 0) return <TagInstructions color={color} tag={tag} />;
  if (step === 1) return <TagContext color={color} tag={tag} />;
  if (step === 2) return <TagExamples color={color} tag={tag} />;
  return <TagOutput color={color} tag={tag} />;
}

function TagInstructions({ color, tag }: TagProps) {
  return (
    <g>
      <text x={280} y={62} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">  한국어로 3줄 요약</text>
      <text x={270} y={78} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={color}>{`</${tag}>`}</text>
      <text x={270} y={98} fontSize={9} fontFamily={MF}
        fill="#10b981">{`<document>`}</text>
      <text x={280} y={112} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">  인공지능의 역사는...</text>
      <text x={270} y={126} fontSize={9} fontFamily={MF}
        fill="#10b981">{`</document>`}</text>
    </g>
  );
}

function TagContext({ color, tag }: TagProps) {
  return (
    <g>
      <text x={280} y={62} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">  인공지능의 역사는</text>
      <text x={280} y={76} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">  1950년부터...</text>
      <text x={270} y={92} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={color}>{`</${tag}>`}</text>
      <text x={350} y={120} textAnchor="middle" fontSize={9}
        fill={color}>↑ 지시문과 분리됨</text>
    </g>
  );
}

function TagExamples({ color, tag }: TagProps) {
  return (
    <g>
      <text x={275} y={60} fontSize={9} fontFamily={MF}
        fill="#f59e0b">{`  <example>`}</text>
      <text x={280} y={74} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">{`    <input>질문A</input>`}</text>
      <text x={280} y={88} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">{`    <output>답변A</output>`}</text>
      <text x={275} y={102} fontSize={9} fontFamily={MF}
        fill="#f59e0b">{`  </example>`}</text>
      <text x={270} y={118} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={color}>{`</${tag}>`}</text>
    </g>
  );
}

function TagOutput({ color, tag }: TagProps) {
  return (
    <g>
      <text x={280} y={62} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">{`  { "summary": "...",`}</text>
      <text x={280} y={76} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">{`    "score": 0-10 }`}</text>
      <text x={270} y={92} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={color}>{`</${tag}>`}</text>
      <text x={350} y={120} textAnchor="middle" fontSize={9}
        fill={color}>↑ 파싱 가능한 출력</text>
    </g>
  );
}
