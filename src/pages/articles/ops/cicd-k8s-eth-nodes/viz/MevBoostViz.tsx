/**
 * MEV-Boost 흐름 — Validator → mev-boost daemon → multi relays → builders → block.
 * Local fallback path 강조.
 */
export default function MevBoostViz() {
  const W = 720;
  const H = 360;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">MEV-Boost 흐름 — multi-relay + local fallback</text>

        {/* Validator */}
        <g>
          <rect x={20} y={130} width={130} height={70} rx={6}
            fill="#f59e0b" fillOpacity={0.10} stroke="#f59e0b" strokeWidth={1.4} />
          <text x={85} y={155} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">Validator</text>
          <text x={85} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">block proposal 차례</text>
          <text x={85} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">slot 12s 안에 결정</text>
        </g>

        {/* MEV-Boost daemon */}
        <g>
          <rect x={195} y={130} width={150} height={70} rx={6}
            fill="#3b82f6" fillOpacity={0.10} stroke="#3b82f6" strokeWidth={1.4} />
          <text x={270} y={155} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">MEV-Boost daemon</text>
          <text x={270} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">multiple relays 동시 query</text>
          <text x={270} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">최고 입찰 헤더 선택</text>
        </g>
        <line x1={150} y1={165} x2={195} y2={165} stroke="#3b82f6" strokeWidth={1.4} />
        <polygon points="195,165 189,162 189,168" fill="#3b82f6" />

        {/* Relays (3개) */}
        <g>
          <rect x={395} y={50} width={140} height={50} rx={6}
            fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={1} />
          <text x={465} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">Flashbots Relay</text>
          <text x={465} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">기본 · OFAC 필터링</text>

          <rect x={395} y={142} width={140} height={50} rx={6}
            fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={1} />
          <text x={465} y={162} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">bloXroute Max-Profit</text>
          <text x={465} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">최대 수익 우선</text>

          <rect x={395} y={234} width={140} height={50} rx={6}
            fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={1} />
          <text x={465} y={254} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">Agnostic / Ultra Sound</text>
          <text x={465} y={270} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">censorship-resistant</text>
        </g>

        {/* Daemon → relays */}
        <g>
          <line x1={345} y1={155} x2={395} y2={75} stroke="#3b82f6" strokeWidth={1} />
          <line x1={345} y1={165} x2={395} y2={167} stroke="#3b82f6" strokeWidth={1} />
          <line x1={345} y1={175} x2={395} y2={259} stroke="#3b82f6" strokeWidth={1} />
        </g>

        {/* Builders */}
        <g>
          <rect x={580} y={120} width={120} height={90} rx={6}
            fill="#8b5cf6" fillOpacity={0.10} stroke="#8b5cf6" strokeWidth={1} />
          <text x={640} y={145} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">Builders</text>
          <text x={640} y={162} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">block 조립 + bid</text>
          <text x={640} y={176} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">private orderflow</text>
          <text x={640} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">searcher bundle</text>
        </g>
        <g>
          <line x1={535} y1={75} x2={580} y2={140} stroke="#8b5cf6" strokeWidth={1} />
          <line x1={535} y1={167} x2={580} y2={167} stroke="#8b5cf6" strokeWidth={1} />
          <line x1={535} y1={259} x2={580} y2={195} stroke="#8b5cf6" strokeWidth={1} />
        </g>

        {/* Local fallback */}
        <g>
          <rect x={195} y={250} width={150} height={48} rx={6}
            fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
          <text x={270} y={270} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">Local fallback (EL txpool)</text>
          <text x={270} y={285} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">모든 relay timeout 시</text>
        </g>
        <g>
          <line x1={85} y1={200} x2={85} y2={274} stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" />
          <line x1={85} y1={274} x2={195} y2={274} stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" />
          <polygon points="195,274 189,271 189,277" fill="#ef4444" />
          <text x={70} y={240} fontSize={8} fontStyle="italic" fill="#ef4444">fallback</text>
        </g>

        {/* 운영 메모 */}
        <text x={W / 2} y={325} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          한 relay 실패해도 다른 곳에서 받음 / min_bid 너무 높으면 missed proposal / fallback 항상 살아 있게
        </text>
        <text x={W / 2} y={344} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          OFAC 필터링 relay 만 쓰면 검열 검증자 표시 — censorship-resistant relay 포함은 정책 결정
        </text>
      </svg>
    </div>
  );
}
