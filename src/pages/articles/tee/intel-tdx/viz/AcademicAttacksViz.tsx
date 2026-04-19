import { motion } from 'framer-motion';

const SC = '#f59e0b';
const TIME = '#3b82f6';
const PHY = '#ef4444';
const NOTE = '#8b5cf6';

interface Attack {
  name: string;
  venue: string;
  vector: string;
  mitigation: string;
  color: string;
  applies: 'TDX' | 'SGX' | 'both';
}

const ATTACKS: Attack[] = [
  {
    name: 'TDXDown',
    venue: 'USENIX Security 2024',
    vector: 'SEAMCALL latency 프로파일링 → TD 내부 패턴 유추',
    mitigation: 'constant-time SEAMCALL · noise 추가',
    color: TIME,
    applies: 'TDX',
  },
  {
    name: 'WeSee',
    venue: 'CCS 2024',
    vector: 'SGX side-channel 타겟팅 (LLC 공유)',
    mitigation: 'TDX엔 직접 적용 어려움 (VM 단위 격리)',
    color: SC,
    applies: 'SGX',
  },
  {
    name: 'Memory Bus Monitoring',
    venue: 'IEEE S&P 2023',
    vector: '물리 버스 logic analyzer로 access frequency 분석',
    mitigation: 'ORAM · dummy access (앱 레벨)',
    color: PHY,
    applies: 'both',
  },
];

export default function AcademicAttacksViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 340" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">학술 공격 분석 — 2023~2024 주요 연구</text>

        {ATTACKS.map((a, i) => {
          const y = 38 + i * 88;
          return (
            <motion.g key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.18 }}>
              <rect x={20} y={y} width={440} height={78} rx={8}
                fill={a.color} fillOpacity={0.08} stroke={a.color} strokeWidth={1} />

              {/* Title row */}
              <text x={32} y={y + 18} fontSize={10} fontWeight={700} fill={a.color}>
                [{i + 1}] {a.name}
              </text>
              <text x={448} y={y + 18} textAnchor="end" fontSize={7.5} fontStyle="italic" fill="var(--muted-foreground)">
                {a.venue}
              </text>

              {/* Applies badge */}
              <rect x={32} y={y + 25} width={50} height={12} rx={2}
                fill={a.color} fillOpacity={0.2} stroke={a.color} strokeWidth={0.4} />
              <text x={57} y={y + 34} textAnchor="middle"
                fontSize={6.5} fontFamily="monospace" fontWeight={700} fill={a.color}>
                {a.applies}
              </text>

              {/* Vector */}
              <text x={92} y={y + 34} fontSize={7} fontWeight={600} fill="var(--muted-foreground)">
                Vector:
              </text>
              <text x={130} y={y + 34} fontSize={7} fill="var(--foreground)">
                {a.vector}
              </text>

              {/* Mitigation */}
              <rect x={32} y={y + 44} width={416} height={26} rx={4}
                fill="var(--card)" stroke={a.color} strokeWidth={0.4} strokeOpacity={0.5} />
              <text x={42} y={y + 56} fontSize={7} fontWeight={600} fill={a.color}>
                완화:
              </text>
              <text x={70} y={y + 56} fontSize={7} fill="var(--muted-foreground)">
                {a.mitigation}
              </text>
            </motion.g>
          );
        })}

        {/* Summary box */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <rect x={30} y={306} width={420} height={28} rx={6}
            fill={NOTE} fillOpacity={0.08} stroke={NOTE} strokeWidth={0.6} strokeDasharray="3 2" />
          <text x={240} y={322} textAnchor="middle" fontSize={7.5} fill={NOTE}>
            실전 위협도: 국가급 공격자 수준 · 멀티테넌트 시나리오 &lt; 10% · 금융·의료엔 추가 방어 필요
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
