import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = 11;
const C = { layer: '#6366f1', dep: '#0ea5e9', tree: '#10b981', pc2: '#f59e0b' };

const STEPS = [
  { label: 'PC1: SDR 레이어 구조 (11개 레이어)', body: 'Stacked DRG: 각 레이어가 이전 레이어 + 익스팬더 부모 노드를 SHA256 해싱합니다.' },
  { label: 'PC1: 레이어 간 의존성 전파', body: '레이어 i의 각 노드는 레이어 i-1의 DRG 부모 6개 + 익스팬더 부모 8개를 입력으로 받습니다.' },
  { label: 'PC1: 수십억 SHA256 연산', body: '11개 레이어 × 섹터 노드 수 = 대규모 순차 해싱. seal_pre_commit_phase1 호출.' },
  { label: 'PC2: Column Hash + TreeR 생성', body: '각 열(11개 레이어 값)을 Poseidon 해싱 → Arity-8 OctMerkle TreeR 구성.' },
];

const barW = 30, barGap = 5, ox = 60, oy = 20;
const bx = (i: number) => ox + i * (barW + barGap);

export default function SDRLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sdr-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill={C.dep} opacity={0.5} />
            </marker>
          </defs>
          {/* Layer bars */}
          {Array.from({ length: LAYERS }, (_, i) => {
            const h = 20 + i * 5;
            const show = step >= 0;
            return (
              <motion.g key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: show ? 1 : 0.2, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <rect x={bx(i)} y={oy + (80 - h)} width={barW} height={h} rx={3}
                  fill={C.layer + (step === 0 ? '30' : '15')}
                  stroke={C.layer} strokeWidth={step === 0 ? 1.5 : 0.8} />
                <text x={bx(i) + barW / 2} y={oy + 92} textAnchor="middle"
                  fontSize={6.5} fill="var(--muted-foreground)">{i + 1}</text>
              </motion.g>
            );
          })}
          {/* Dependency arrows */}
          {step >= 1 && Array.from({ length: LAYERS - 1 }, (_, i) => (
            <motion.line key={`dep${i}`}
              x1={bx(i) + barW} y1={oy + 50}
              x2={bx(i + 1)} y2={oy + 50}
              stroke={C.dep} strokeWidth={1} markerEnd="url(#sdr-a)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ delay: i * 0.04 }} />
          ))}
          {/* SHA256 count indicator */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={ox} y={oy + 105} width={LAYERS * (barW + barGap) - barGap} height={20} rx={10}
                fill={C.layer + '10'} stroke={C.layer} strokeWidth={1} strokeDasharray="4 2" />
              <text x={ox + (LAYERS * (barW + barGap) - barGap) / 2} y={oy + 118} textAnchor="middle"
                fontSize={9} fill={C.layer} fontWeight={600}>11 × N노드 SHA256 해싱</text>
            </motion.g>
          )}
          {/* PC2: TreeR */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              {/* Tree triangle */}
              <polygon points="405,30 370,100 440,100"
                fill={C.tree + '15'} stroke={C.tree} strokeWidth={1.5} />
              <text x={405} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.tree}>TreeR</text>
              {/* Arrow from layers to tree */}
              <line x1={bx(LAYERS - 1) + barW + 5} y1={oy + 50}
                x2={370} y2={65} stroke={C.pc2} strokeWidth={1} strokeDasharray="3 2" />
              <text x={405} y={112} textAnchor="middle" fontSize={9} fill={C.pc2}>Column Hash</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
