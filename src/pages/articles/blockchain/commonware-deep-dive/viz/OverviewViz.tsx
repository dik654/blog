import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '블록체인 개발 스펙트럼', body: '모놀리식(Bitcoin) → 프레임워크(Cosmos SDK) → Anti-Framework(Commonware) → 처음부터 구축. 오른쪽일수록 유연하지만 개발 비용 증가.' },
  { label: '프레임워크의 한계', body: 'Sei, Celestia, dYdX, Penumbra 모두 CometBFT Fork 필수. 합의 커스터마이징, DA 특화, 오더북 최적화 등 각각의 이유로 Fork 후 유지보수 부담.' },
  { label: '6가지 프리미티브', body: 'consensus(합의) · broadcast(전파) · storage(저장) · cryptography(암호화) · p2p(네트워킹) · runtime(런타임). 각각 독립적으로 선택·조합 가능.' },
];

const spectrum = [
  { label: '모놀리식', sub: 'Bitcoin, Ethereum', c: '#94a3b8' },
  { label: '프레임워크', sub: 'Cosmos SDK, OP Stack', c: C1 },
  { label: 'Anti-Framework', sub: 'Commonware', c: C2 },
  { label: '처음부터', sub: 'Custom Build', c: C3 },
];

const prims = [
  { label: 'consensus', sub: 'simplex', c: C1 },
  { label: 'broadcast', sub: 'ordered', c: '#8b5cf6' },
  { label: 'storage', sub: 'mmr · adb', c: C2 },
  { label: 'cryptography', sub: 'bls · ed25519', c: C3 },
  { label: 'p2p', sub: 'authenticated', c: '#ec4899' },
  { label: 'runtime', sub: 'deterministic', c: '#06b6d4' },
];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={230} y={18} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                ← 빠른 개발 · · · · · · · · · · · · · · · · · · 높은 유연성 →
              </text>
              {spectrum.map((s, i) => {
                const x = 30 + i * 110;
                return (
                  <g key={i}>
                    <rect x={x} y={30} width={96} height={40} rx={5} fill="var(--card)" />
                    <rect x={x} y={30} width={96} height={40} rx={5} fill={`${s.c}12`}
                      stroke={s.c} strokeWidth={i === 2 ? 1.5 : 0.7} />
                    <text x={x + 48} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.c}>{s.label}</text>
                    <text x={x + 48} y={62} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{s.sub}</text>
                    {i < 3 && <line x1={x + 96} y1={50} x2={x + 110} y2={50} stroke="var(--border)" strokeWidth={0.6} />}
                  </g>
                );
              })}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { proj: 'Sei', fw: 'CometBFT', issue: '합의 커스터마이징' },
                { proj: 'Celestia', fw: 'CometBFT', issue: 'DA 레이어 특화' },
                { proj: 'dYdX', fw: 'CometBFT', issue: '오더북 최적화' },
                { proj: 'L2s', fw: 'OP Stack', issue: '실행 규칙 변경' },
              ].map((r, i) => (
                <g key={i}>
                  <rect x={30} y={20 + i * 34} width={80} height={26} rx={4}
                    fill={`${C1}10`} stroke={C1} strokeWidth={0.6} />
                  <text x={70} y={37 + i * 34} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>{r.proj}</text>
                  <text x={140} y={37 + i * 34} fontSize={10} fill="var(--muted-foreground)">→ {r.fw} Fork 필수</text>
                  <text x={310} y={37 + i * 34} fontSize={10} fill="#ef4444">{r.issue}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {prims.map((p, i) => {
                const col = i % 3, row = Math.floor(i / 3);
                const x = 30 + col * 142, y = 20 + row * 70;
                return (
                  <g key={i}>
                    <rect x={x} y={y} width={130} height={50} rx={5} fill="var(--card)" />
                    <rect x={x} y={y} width={130} height={50} rx={5} fill={`${p.c}10`}
                      stroke={p.c} strokeWidth={0.8} />
                    <text x={x + 65} y={y + 22} textAnchor="middle" fontSize={10} fontWeight={600} fill={p.c}>{p.label}</text>
                    <text x={x + 65} y={y + 38} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{p.sub}</text>
                  </g>
                );
              })}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
