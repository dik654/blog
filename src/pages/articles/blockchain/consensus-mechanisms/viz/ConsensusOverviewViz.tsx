import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const MECHS = [
  { label: 'PoW', sub: '채굴', color: '#f59e0b', energy: 90, finality: 95, decentral: 90 },
  { label: 'PoS', sub: '스테이킹', color: '#10b981', energy: 10, finality: 50, decentral: 60 },
  { label: 'BFT', sub: '투표', color: '#6366f1', energy: 5, finality: 5, decentral: 25 },
];
const ATTRS = ['에너지', '최종성(s)', '탈중앙화'];
const CX = [80, 175, 270], CY = 28, BW = 70, BH = 28;

const STEPS = [
  { label: '세 가지 합의 메커니즘', body: 'PoW, PoS, BFT — 각각 다른 트레이드오프' },
  { label: 'PoW: 높은 에너지, 높은 탈중앙화', body: '해시 퍼즐로 Sybil 방어 — 15년간 검증된 보안' },
  { label: 'PoS: 균형 잡힌 선택', body: '토큰 스테이킹으로 검증 — 에너지 99.95% 절감' },
  { label: 'BFT: 즉시 최종성', body: '2/3 투표로 1초 내 확정 — 포크 불가' },
];

export default function ConsensusOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {MECHS.map((m, i) => {
            const active = step === i + 1;
            const op = step === 0 || active ? 1 : 0.2;
            const vals = [m.energy, m.finality, m.decentral];
            return (
              <g key={m.label}>
                <motion.rect x={CX[i] - BW / 2} y={CY - BH / 2} width={BW} height={BH} rx={5}
                  animate={{ fill: `${m.color}${active ? '22' : '0c'}`, stroke: m.color,
                    strokeWidth: active ? 2.5 : 1, opacity: op }}
                  transition={{ duration: 0.3 }} />
                <text x={CX[i]} y={CY - 2} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={m.color} opacity={op}>{m.label}</text>
                <text x={CX[i]} y={CY + 9} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)" opacity={op * 0.7}>{m.sub}</text>
                {/* bar chart per attribute */}
                {vals.map((v, ai) => {
                  const barY = 60 + ai * 26;
                  return (
                    <g key={ai}>
                      {i === 0 && (
                        <text x={10} y={barY + 8} fontSize={10} fill="var(--muted-foreground)">{ATTRS[ai]}</text>
                      )}
                      <rect x={CX[i] - 30} y={barY} width={60} height={12} rx={3}
                        fill="var(--border)" opacity={0.2} />
                      <motion.rect x={CX[i] - 30} y={barY} height={12} rx={3}
                        animate={{ width: (active || step === 0) ? v * 0.6 : 20, opacity: op }}
                        transition={{ type: 'spring', bounce: 0.1 }}
                        fill={`${m.color}${active ? '60' : '30'}`} />
                      <text x={CX[i] - 25} y={barY + 9} fontSize={10} fontWeight={600}
                        fill={m.color} opacity={op}>
                        {ai === 0 ? (v > 50 ? 'HIGH' : 'LOW') : ai === 1 ? (v > 80 ? '60m' : v > 30 ? '12s' : '1s') : (v > 70 ? 'HIGH' : v > 40 ? 'MED' : 'LOW')}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
          {step > 0 && (
            <motion.circle r={4} initial={{ opacity: 0 }} animate={{ opacity: 1, cx: CX[step - 1], cy: 6 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              fill={MECHS[step - 1].color}
              style={{ filter: `drop-shadow(0 0 4px ${MECHS[step - 1].color}88)` }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
