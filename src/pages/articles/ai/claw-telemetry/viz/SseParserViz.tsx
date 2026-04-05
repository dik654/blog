export default function SseParserViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">SseParser — 줄 단위 JSON 파싱</text>

        {/* 바이트 스트림 */}
        <rect x={30} y={54} width={500} height={58} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          바이트 스트림 (HTTP chunk)
        </text>

        <g transform="translate(42, 80)">
          <text x={0} y={14} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
            event: content_block_delta\\ndata: &#123;...&#125;\\n\\nevent: ...
          </text>
          <text x={0} y={27} fontSize={8.5} fontStyle="italic" fill="var(--muted-foreground)">
            (line-delimited, \\n\\n = 이벤트 경계)
          </text>
        </g>

        <defs>
          <marker id="sp-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        <line x1={280} y1={112} x2={280} y2={124} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#sp-arr)" />

        {/* Buffer */}
        <rect x={30} y={128} width={500} height={46} rx={6}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={280} y={147} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          SseParser.feed() — 버퍼 누적 + 경계 탐색
        </text>
        <text x={280} y={164} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          완전한 이벤트만 추출 · 부분 이벤트는 버퍼에 유지
        </text>

        <line x1={280} y1={174} x2={280} y2={186} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#sp-arr)" />

        {/* SseEvent */}
        <rect x={30} y={190} width={500} height={52} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
        <text x={280} y={209} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          SseEvent
        </text>

        <g transform="translate(56, 216)">
          <text x={0} y={14} fontSize={9} fontWeight={600} fontFamily="monospace" fill="#10b981">event_type:</text>
          <text x={76} y={14} fontSize={9} fontFamily="monospace" fill="var(--foreground)">Option&lt;String&gt;</text>

          <text x={184} y={14} fontSize={9} fontWeight={600} fontFamily="monospace" fill="#10b981">data:</text>
          <text x={218} y={14} fontSize={9} fontFamily="monospace" fill="var(--foreground)">String</text>

          <text x={304} y={14} fontSize={9} fontWeight={600} fontFamily="monospace" fill="#10b981">id:</text>
          <text x={326} y={14} fontSize={9} fontFamily="monospace" fill="var(--foreground)">Option&lt;String&gt;</text>
        </g>

        <text x={280} y={268} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">Anthropic &amp; OpenAI 차이 흡수 (event 필드 유무)</text>
      </svg>
    </div>
  );
}
