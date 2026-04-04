import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#ef4444', C3 = '#10b981';
const STEPS = [
  { label: 'Byzantine 장군 문제 (Lamport, 1982)', body: '신뢰할 수 없는 참가자가 있는 분산 시스템에서 합의를 달성하는 문제.' },
  { label: 'n=4, f=1 — 합의 가능', body: '3f+1=4 조건 충족. 정직한 3명이 다수결로 배신자 1명을 무력화.' },
  { label: 'n=3, f=1 — 합의 불가', body: '3f+1=4 > 3. 배신자가 다른 메시지를 보내면 정직한 2명이 구별 불가.' },
  { label: 'f < n/3 한계', body: 'BFT 합의에 필요한 정직 노드: n ≥ 3f+1. 1/3 이상 비잔틴이면 합의 불가능.' },
];

const INFO: Record<number, [string, string[]]> = {
  0: [C1, ['장군 n명 중 f명이', '배신자(Byzantine)', '', '정직한 장군들만이라도', '동일한 결정에 도달해야 함']],
  1: [C3, ['합의 가능', 'n=4, f=1', '3f+1 = 4 ≤ n = 4 ✓', '정직 3명이 다수결로', '배신자 무력화']],
  2: [C2, ['합의 불가', 'n=3, f=1', '3f+1 = 4 > n = 3 ✗', '배신자의 이중 메시지를', '정직한 2명이 구별 불가']],
  3: [C1, ['f < n/3', '필요 충분 조건:', 'n ≥ 3f + 1', 'PBFT: 2f+1 투표로 결정', 'HotStuff: 선형 통신']],
};

export default function ByzantineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const n = step === 2 ? 3 : 4;
        const gens = Array.from({ length: n }, (_, i) => {
          const a = (i / n) * 2 * Math.PI - Math.PI / 2;
          return { x: 150 + Math.cos(a) * 50, y: 80 + Math.sin(a) * 50 };
        });
        const tIdx = n - 1;
        const [titleColor, lines] = INFO[step] ?? [C1, []];
        return (
          <svg viewBox="0 0 420 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {gens.map((g, i) => gens.map((g2, j) => {
              if (j <= i) return null;
              const t = i === tIdx || j === tIdx;
              return (<line key={`${i}-${j}`} x1={g.x} y1={g.y} x2={g2.x} y2={g2.y}
                stroke={t && step >= 1 ? C2 : 'var(--border)'} strokeWidth={0.6}
                strokeDasharray={t && step >= 1 ? '3,3' : 'none'} opacity={0.5} />);
            }))}
            {gens.map((g, i) => {
              const t = i === tIdx && step >= 1;
              return (
                <motion.g key={i}>
                  <circle cx={g.x} cy={g.y} r={16} fill={t ? `${C2}15` : `${C1}10`}
                    stroke={t ? C2 : C1} strokeWidth={1} />
                  <text x={g.x} y={g.y + 3} textAnchor="middle" fontSize={10}
                    fontWeight={500} fill={t ? C2 : C1}>G{i + 1}</text>
                  {t && <text x={g.x} y={g.y + 15} textAnchor="middle" fontSize={10} fill={C2}>배신</text>}
                </motion.g>);
            })}
            <rect x={260} y={20} width={145} height={130} rx={6}
              fill={`${C1}06`} stroke={C1} strokeWidth={0.5} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={step}>
              {lines.map((l, i) => (
                <text key={i} x={270} y={45 + i * 18} fontSize={10}
                  fontWeight={i === 0 ? 500 : 400} fill={i === 0 ? titleColor : 'var(--muted-foreground)'}>{l}</text>
              ))}
            </motion.g>
          </svg>);
      }}
    </StepViz>
  );
}
