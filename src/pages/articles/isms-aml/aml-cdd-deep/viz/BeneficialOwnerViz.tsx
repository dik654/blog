import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  corp: '#6366f1',
  owner: '#f59e0b',
  trace: '#10b981',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '실제소유자 판정 우선순위',
    body: '1순위: 25%+ 지분 보유 자연인 → 2순위: 실질적 지배자 → 3순위: 대표이사. 간접 보유(다단계 구조)도 포함.',
  },
  {
    label: '다단계 지배구조 추적',
    body: 'A법인 → B법인 100% → C법인 30% 보유 시, A의 실제소유자가 C에 대해 간접 30% 지분. 최상위 자연인까지 추적.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#bo-viz-arrow)" />;
}

export default function BeneficialOwnerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="bo-viz-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">실제소유자(Beneficial Owner) 판정</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={30} y={35} w={120} h={45} label="1순위" sub="25%+ 지분 자연인" color={C.owner} />
              </motion.g>

              <Arrow x1={150} y1={57} x2={180} y2={57} color={C.owner} />
              <text x={165} y={50} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">없으면</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={183} y={35} w={120} h={45} label="2순위" sub="실질적 지배자" color={C.trace} />
              </motion.g>

              <Arrow x1={303} y1={57} x2={333} y2={57} color={C.trace} />
              <text x={318} y={50} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">없으면</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={336} y={35} w={120} h={45} label="3순위" sub="대표이사/CEO" color={C.corp} />
              </motion.g>

              {/* 핵심 포인트 */}
              <rect x={30} y={100} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <DataBox x={90} y={110} w={140} h={30} label="25% 기준 = FATF 권고" color={C.owner} />
              <AlertBox x={260} y={108} w={165} h={35} label="간접 보유도 합산" sub="자회사·손자회사 경유" color={C.warn} />
              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">EU는 더 낮은 기준(10%) 적용 — 국가별 차이 존재</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">다단계 지배구조 추적 예시</text>

              {/* 최상위 자연인 */}
              <motion.g initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <DataBox x={180} y={30} w={120} h={30} label="실제소유자 (자연인)" color={C.owner} />
              </motion.g>

              <Arrow x1={240} y1={60} x2={240} y2={75} color={C.owner} />

              <ModuleBox x={180} y={78} w={120} h={35} label="A법인" sub="" color={C.corp} />
              <text x={320} y={100} fontSize={8} fill={C.corp}>100% 보유</text>
              <Arrow x1={240} y1={113} x2={240} y2={128} color={C.corp} />

              <ModuleBox x={180} y={131} w={120} h={35} label="B법인" sub="" color={C.corp} />
              <text x={320} y={152} fontSize={8} fill={C.trace}>30% 보유</text>
              <Arrow x1={300} y1={148} x2={340} y2={148} color={C.trace} />

              <ModuleBox x={343} y={131} w={100} h={35} label="C법인" sub="VASP 계정" color={C.trace} />

              {/* 추적 결과 */}
              <AlertBox x={15} y={100} w={140} h={40} label="간접 30% 지분" sub="A의 실제소유자 → C" color={C.warn} />
              <Arrow x1={155} y1={120} x2={180} y2={120} color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
