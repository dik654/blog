import { useState } from 'react';

type PathState = 'relay-only' | 'punching' | 'direct';

const STATES: { id: PathState; label: string; desc: string }[] = [
  { id: 'relay-only', label: 'Relay 전용', desc: '연결 초기 or hole punching 실패. 모든 패킷이 relay 서버를 거쳐 전달된다. 지연 높음.' },
  { id: 'punching', label: 'Hole Punching 중', desc: 'relay + UDP 직접 경로 동시 시도. DISCO Ping/Pong 교환으로 NAT 홀을 뚫는 중.' },
  { id: 'direct', label: '직접 UDP', desc: '최적 상태. UDP로 직접 연결. relay는 비활성화. 연결 이동(IP 변경) 시 자동 재협상.' },
];

const W = 380, H = 140;
const A = { x: 50, y: 90 };
const R = { x: 190, y: 36 };
const B = { x: 330, y: 90 };

export default function PathRoutingViz() {
  const [state, setState] = useState<PathState>('relay-only');
  const cur = STATES.find(s => s.id === state)!;

  const showRelay = state === 'relay-only' || state === 'punching';
  const showDirect = state === 'direct' || state === 'punching';

  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      <div className="flex justify-center gap-2 mb-4">
        {STATES.map(s => (
          <button key={s.id} onClick={() => setState(s.id)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
              state === s.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-accent'
            }`}>
            {s.label}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }}>
        {/* Relay */}
        <rect x={R.x - 28} y={R.y - 12} width={56} height={24} rx={6}
          fill="#f59e0b" fillOpacity={showRelay ? 0.2 : 0.05}
          stroke="#f59e0b" strokeWidth={showRelay ? 1.5 : 0.5} />
        <text x={R.x} y={R.y + 5} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={showRelay ? '#f59e0b' : '#f59e0b'} fillOpacity={showRelay ? 1 : 0.3}>Relay</text>

        {/* Relay path A→R→B */}
        {showRelay && (
          <g>
            <line x1={A.x + 28} y1={A.y - 5} x2={R.x - 28} y2={R.y + 8}
              stroke="#f59e0b" strokeWidth={state === 'relay-only' ? 2 : 1}
              strokeOpacity={0.6} strokeDasharray={state === 'punching' ? '4 3' : '0'} />
            <line x1={R.x + 28} y1={R.y + 8} x2={B.x - 28} y2={B.y - 5}
              stroke="#f59e0b" strokeWidth={state === 'relay-only' ? 2 : 1}
              strokeOpacity={0.6} strokeDasharray={state === 'punching' ? '4 3' : '0'} />
          </g>
        )}

        {/* Direct path A→B */}
        {showDirect && (
          <line x1={A.x + 28} y1={A.y} x2={B.x - 28} y2={B.y}
            stroke="#10b981" strokeWidth={state === 'direct' ? 2.5 : 1.5}
            strokeOpacity={0.8} />
        )}

        {/* Node A */}
        <rect x={A.x - 28} y={A.y - 16} width={56} height={32} rx={8}
          fill="#6366f1" fillOpacity={0.15} stroke="#6366f1" strokeWidth={1.5} />
        <text x={A.x} y={A.y + 5} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">Node A</text>

        {/* Node B */}
        <rect x={B.x - 28} y={B.y - 16} width={56} height={32} rx={8}
          fill="#6366f1" fillOpacity={0.15} stroke="#6366f1" strokeWidth={1.5} />
        <text x={B.x} y={B.y + 5} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">Node B</text>

        {/* Labels */}
        {showRelay && (
          <text x={190} y={72} textAnchor="middle" fontSize={10} fill="#f59e0b">relay 경로</text>
        )}
        {showDirect && (
          <text x={190} y={state === 'punching' ? 108 : 116} textAnchor="middle" fontSize={10} fill="#10b981">직접 UDP 경로</text>
        )}
      </svg>
      <div className="mt-3 rounded-lg border border-border/60 bg-background/60 px-4 py-3 text-sm">
        <span className="font-semibold text-foreground">{cur.label}</span>
        <p className="mt-1 text-foreground/80 leading-relaxed">{cur.desc}</p>
      </div>
    </div>
  );
}
