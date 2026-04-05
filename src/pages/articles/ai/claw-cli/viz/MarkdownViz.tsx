export default function MarkdownViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Markdown → ANSI 렌더링 파이프라인</text>

        <defs>
          <marker id="md-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Raw markdown */}
        <rect x={35} y={60} width={150} height={96} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={110} y={80} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          LLM 응답
        </text>
        <text x={46} y={100} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">## 제목</text>
        <text x={46} y={116} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">**굵게**</text>
        <text x={46} y={132} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">`code`</text>
        <text x={46} y={148} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">- 리스트</text>

        <line x1={185} y1={108} x2={208} y2={108} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#md-arr)" />

        {/* pulldown-cmark */}
        <rect x={210} y={60} width={140} height={96} rx={8}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1} />
        <text x={280} y={90} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          pulldown-cmark
        </text>
        <text x={280} y={112} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          이벤트 스트림
        </text>
        <text x={280} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Start/End/Text
        </text>

        <line x1={350} y1={108} x2={373} y2={108} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#md-arr)" />

        {/* ANSI 출력 */}
        <rect x={375} y={60} width={150} height={96} rx={8}
          fill="#1f2937" stroke="#10b981" strokeWidth={1} />
        <text x={386} y={80} fontSize={11} fontWeight={700} fill="#e5e7eb">## 제목</text>
        <text x={386} y={98} fontSize={10} fontWeight={700} fill="#e5e7eb">굵게</text>
        <text x={386} y={115} fontSize={9.5} fontFamily="monospace" fill="#f59e0b">code</text>
        <text x={386} y={132} fontSize={9.5} fill="#e5e7eb">• 리스트</text>
        <text x={450} y={148} textAnchor="middle" fontSize={8.5} fontStyle="italic" fill="#10b981">
          터미널
        </text>

        {/* Streaming */}
        <rect x={35} y={180} width={490} height={78} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={202} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">StreamingRenderer — 실시간 렌더링</text>
        <text x={280} y={222} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">줄 단위 렌더링 · 완전한 줄만 출력 · flush()로 즉시 업데이트</text>
        <text x={280} y={240} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">syntect로 코드 블록 100+ 언어 문법 하이라이팅</text>
      </svg>
    </div>
  );
}
