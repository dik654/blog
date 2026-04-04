import { useState } from 'react';

const ITEMS = [
  {
    id: 'shor', label: 'Shor 알고리즘', x: 20, y: 30, color: '#ef4444',
    desc: '양자 컴퓨터의 Shor 알고리즘은 이산 로그 문제를 다항 시간에 해결합니다. ECDSA의 secp256k1 곡선 위 이산 로그를 풀면 공개키에서 개인키를 복원할 수 있습니다.',
  },
  {
    id: 'ecdsa', label: 'ECDSA 해독 가능', x: 185, y: 30, color: '#f59e0b',
    desc: '충분한 큐비트(~2500 논리 큐비트)의 양자 컴퓨터가 등장하면, 이더리움 트랜잭션에 노출된 공개키로부터 개인키를 복원하여 자산을 탈취할 수 있습니다.',
  },
  {
    id: 'lattice', label: '격자 기반 서명', x: 350, y: 30, color: '#10b981',
    desc: 'CRYSTALS-Dilithium은 Module-LWE 문제에 기반합니다. 격자 위의 최단 벡터 문제(SVP)는 양자 컴퓨터로도 효율적으로 풀 수 없어, 양자 내성을 제공합니다.',
  },
  {
    id: 'aa', label: 'Account Abstraction', x: 100, y: 100, color: '#6366f1',
    desc: 'ERC-4337 스마트 계정은 서명 검증 로직을 교체할 수 있습니다. ECDSA 대신 Dilithium 검증을 사용하면 양자 내성 계정이 됩니다.',
  },
  {
    id: 'hybrid', label: '하이브리드 전환', x: 270, y: 100, color: '#8b5cf6',
    desc: 'ECDSA와 Dilithium을 동시에 검증하는 하이브리드 모드로 시작하여, 양자 위협이 현실화되면 ECDSA를 제거하고 PQ 전용으로 전환합니다.',
  },
];

const EDGES = [['shor', 'ecdsa'], ['ecdsa', 'lattice'], ['lattice', 'aa'], ['aa', 'hybrid']];

function pos(id: string) {
  const it = ITEMS.find(i => i.id === id)!;
  return { cx: it.x + 65, cy: it.y + 18 };
}

export default function ContextViz() {
  const [active, setActive] = useState<string | null>(null);
  const sel = ITEMS.find(i => i.id === active);

  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      <p className="text-xs text-foreground/50 mb-3 text-center">컴포넌트 클릭 → 상세 설명</p>
      <svg viewBox="0 0 480 160" className="w-full max-w-2xl mx-auto block" style={{ height: 160 }}>
        {EDGES.map(([a, b]) => {
          const pa = pos(a), pb = pos(b);
          return <line key={`${a}-${b}`} x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy}
            stroke="currentColor" strokeOpacity={0.15} strokeWidth={1.5} />;
        })}
        {ITEMS.map(c => (
          <g key={c.id} onClick={() => setActive(active === c.id ? null : c.id)} className="cursor-pointer">
            <rect x={c.x} y={c.y} width={130} height={36} rx={8}
              fill={c.color} fillOpacity={active === c.id ? 0.9 : 0.2}
              stroke={c.color} strokeWidth={active === c.id ? 2 : 1} className="transition-all duration-200" />
            <text x={c.x + 65} y={c.y + 22} textAnchor="middle" fontSize={10} fontWeight={600}
              fill={active === c.id ? '#fff' : c.color}>{c.label}</text>
          </g>
        ))}
      </svg>
      {sel ? (
        <div className="mt-3 rounded-lg border border-border/60 bg-background/60 px-4 py-3 text-sm">
          <span className="font-semibold" style={{ color: sel.color }}>{sel.label}</span>
          <p className="mt-1 text-foreground/80 leading-relaxed">{sel.desc}</p>
        </div>
      ) : (
        <p className="mt-3 text-xs text-foreground/40 text-center">위 컴포넌트를 클릭하세요</p>
      )}
    </div>
  );
}
