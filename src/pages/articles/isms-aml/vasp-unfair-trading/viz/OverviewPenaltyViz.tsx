import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  base: '#6366f1',
  mid: '#f59e0b',
  max: '#ef4444',
  admin: '#10b981',
};

const STEPS = [
  { label: '형사처벌 단계별 체계', body: '부당이득 규모에 따라 형량이 가중된다. 기본 1년 이상 → 5억~50억이면 3년 이상 → 50억 초과 시 무기징역까지 가능.' },
  { label: '벌금과 과징금: 이중 제재', body: '벌금은 형사(법원), 과징금은 행정(금융위). 벌금 3~5배 + 과징금 2배로 범죄 수익보다 더 큰 불이익을 부과.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#op-arrow)" />;
}

export default function OverviewPenaltyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="op-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">형사처벌 가중 체계</text>

              <ActionBox x={15} y={35} w={120} h={42} label="기본" sub="1년 이상 징역" color={C.base} />
              <Arrow x1={135} y1={56} x2={163} y2={56} color={C.mid} />
              <ActionBox x={165} y={35} w={130} h={42} label="5억~50억 이득" sub="3년 이상 징역" color={C.mid} />
              <Arrow x1={295} y1={56} x2={323} y2={56} color={C.max} />
              <AlertBox x={325} y={32} w={140} h={48} label="50억 초과 이득" sub="무기징역 가능" color={C.max} />

              <rect x={60} y={105} width={360} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={125} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">부당이득 규모에 비례하여 형량 가중</text>

              {/* 이득 규모 바 */}
              <rect x={60} y={140} width={360} height={10} rx={5} fill="var(--border)" opacity={0.2} />
              <rect x={60} y={140} width={120} height={10} rx={5} fill={C.base} opacity={0.6} />
              <rect x={180} y={140} width={120} height={10} rx={5} fill={C.mid} opacity={0.6} />
              <rect x={300} y={140} width={120} height={10} rx={5} fill={C.max} opacity={0.6} />

              <text x={120} y={168} textAnchor="middle" fontSize={8} fill={C.base}>5억 미만</text>
              <text x={240} y={168} textAnchor="middle" fontSize={8} fill={C.mid}>5억~50억</text>
              <text x={360} y={168} textAnchor="middle" fontSize={8} fill={C.max}>50억 초과</text>

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill={C.max}>2026.02 최초 실형 선고</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">이중 제재 구조</text>

              <DataBox x={40} y={35} w={170} h={40} label="벌금: 부당이득의 3~5배" color={C.max} />
              <text x={125} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">형사처벌 (법원 선고)</text>

              <DataBox x={270} y={35} w={170} h={40} label="과징금: 부당이득의 2배" color={C.admin} />
              <text x={355} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">행정 제재 (금융위 부과)</text>

              <Arrow x1={125} y1={100} x2={200} y2={125} color={C.max} />
              <Arrow x1={355} y1={100} x2={280} y2={125} color={C.admin} />

              <rect x={140} y={125} width={200} height={35} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={143} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">범죄 수익 &lt; 제재 비용</text>
              <text x={240} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">경제적 유인 차단 구조</text>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">형사(벌금) + 행정(과징금) 동시 부과 가능 → "범죄는 안 남는 장사"</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
