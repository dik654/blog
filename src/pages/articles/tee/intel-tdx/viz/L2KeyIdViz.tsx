import { motion } from 'framer-motion';

const STRONG = '#10b981';
const LITE = '#f59e0b';
const L1 = '#3b82f6';
const L2A = '#8b5cf6';
const L2B = '#ef4444';

interface Mode {
  title: string;
  subtitle: string;
  l1: { kid: number; color: string };
  l2: { name: string; kid: number; color: string }[];
  outcome: string;
  modeColor: string;
}

const MODES: Mode[] = [
  {
    title: 'Strong Partitioning',
    subtitle: '완전 격리 — L1도 L2 메모리 못 봄',
    l1: { kid: 5, color: L1 },
    l2: [
      { name: 'L2_1', kid: 6, color: L2A },
      { name: 'L2_2', kid: 7, color: L2B },
    ],
    outcome: 'L1이 L2 메모리 접근 시 복호화 실패 (random bits)',
    modeColor: STRONG,
  },
  {
    title: 'Lite Partitioning',
    subtitle: '공유 KeyID — L1이 L2 디버그 가능',
    l1: { kid: 5, color: L1 },
    l2: [
      { name: 'L2_1', kid: 5, color: L1 },
      { name: 'L2_2', kid: 5, color: L1 },
    ],
    outcome: 'L1이 L2 메모리 평문 접근 (개발용 · 프로덕션 금지)',
    modeColor: LITE,
  },
];

export default function L2KeyIdViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 380" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">L2 메모리 격리 — KeyID 모드 선택</text>

        {MODES.map((m, mi) => {
          const yBase = 38 + mi * 145;
          return (
            <motion.g key={mi}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + mi * 0.2 }}>
              <rect x={20} y={yBase} width={440} height={130} rx={8}
                fill={m.modeColor} fillOpacity={0.06} stroke={m.modeColor} strokeWidth={1} />

              {/* Title */}
              <rect x={20} y={yBase} width={440} height={22} rx={6}
                fill={m.modeColor} fillOpacity={0.18} />
              <text x={32} y={yBase + 14} fontSize={9} fontWeight={700} fill={m.modeColor}>
                {m.title}
              </text>
              <text x={448} y={yBase + 14} textAnchor="end" fontSize={7} fontStyle="italic" fill={m.modeColor}>
                {m.subtitle}
              </text>

              {/* L1 box */}
              <rect x={32} y={yBase + 32} width={130} height={48} rx={5}
                fill={m.l1.color} fillOpacity={0.12} stroke={m.l1.color} strokeWidth={1} />
              <text x={97} y={yBase + 50} textAnchor="middle" fontSize={9} fontWeight={700} fill={m.l1.color}>
                L1 TD
              </text>
              <rect x={42} y={yBase + 56} width={110} height={16} rx={3}
                fill={m.l1.color} fillOpacity={0.22} />
              <text x={97} y={yBase + 67} textAnchor="middle"
                fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={m.l1.color}>
                KeyID = {m.l1.kid}
              </text>

              {/* L2 boxes */}
              {m.l2.map((l2, j) => (
                <g key={j} transform={`translate(${178 + j * 145}, ${yBase + 32})`}>
                  <rect x={0} y={0} width={130} height={48} rx={5}
                    fill={l2.color} fillOpacity={0.12} stroke={l2.color} strokeWidth={1} />
                  <text x={65} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill={l2.color}>
                    {l2.name}
                  </text>
                  <rect x={10} y={24} width={110} height={16} rx={3}
                    fill={l2.color} fillOpacity={0.22} />
                  <text x={65} y={35} textAnchor="middle"
                    fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={l2.color}>
                    KeyID = {l2.kid}
                  </text>
                </g>
              ))}

              {/* Outcome */}
              <rect x={32} y={yBase + 90} width={416} height={28} rx={4}
                fill="var(--card)" stroke={m.modeColor} strokeWidth={0.6} strokeOpacity={0.5} />
              <text x={42} y={yBase + 102} fontSize={7.5} fontWeight={700} fill={m.modeColor}>
                결과
              </text>
              <text x={42} y={yBase + 114} fontSize={7} fill="var(--muted-foreground)">
                {m.outcome}
              </text>
            </motion.g>
          );
        })}

        {/* S-EPT bottom note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
          <text x={240} y={350} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
            S-EPT 3-계층
          </text>
          <text x={240} y={364} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">
            Host S-EPT (Lv0) → L1 S-EPT (Lv1) → L2 S-EPT (Lv2) — TDX Module이 전체 walk
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
