import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  chief: '#ef4444',
  aml: '#6366f1',
  sec: '#f59e0b',
  ops: '#10b981',
};

const STEPS = [
  {
    label: '감시 조직 역할 분담',
    body: '준법감시인(최종 결정) → AML 담당자(1차 분석) → 보안팀(온체인 분석) → 운영팀(조치 실행). 단일 부서가 아닌 협력 체계.',
  },
  {
    label: '경보 처리 흐름',
    body: 'FDS 경보 → AML 1차 → 보안팀 심층 → 준법감시인 결정 → 운영팀 실행. 각 단계에서 역할과 권한이 분리.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#mon-org-arrow)" />;
}

export default function MonitoringOrgViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="mon-org-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">FDS 감시 조직 4역할</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ModuleBox x={20} y={35} w={100} h={55} label="준법감시인" sub="최종 결정권자" color={C.chief} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={140} y={35} w={100} h={55} label="AML 담당자" sub="1차 분석·분류" color={C.aml} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={260} y={35} w={100} h={55} label="보안팀" sub="온체인·클러스터" color={C.sec} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ModuleBox x={380} y={35} w={85} h={55} label="운영팀" sub="조치 실행" color={C.ops} />
              </motion.g>

              {/* 하단: 담당 영역 */}
              <DataBox x={20} y={105} w={100} h={25} label="STR 보고 결정" color={C.chief} />
              <DataBox x={140} y={105} w={100} h={25} label="오탐 필터링" color={C.aml} />
              <DataBox x={260} y={105} w={100} h={25} label="지갑 추적" color={C.sec} />
              <DataBox x={380} y={105} w={85} h={25} label="계정 정지" color={C.ops} />

              <text x={240} y={155} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">단일 부서가 아닌 다부서 협력 체계</text>
              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">가상자산이용자보호법: "상시감시조직" 구성·운영 의무</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">경보 처리 체인</text>

              <ActionBox x={15} y={45} w={70} h={40} label="FDS 경보" sub="자동" color={C.aml} />
              <Arrow x1={85} y1={65} x2={105} y2={65} color={C.aml} />

              <ActionBox x={108} y={45} w={80} h={40} label="AML 1차" sub="오탐 필터" color={C.aml} />
              <Arrow x1={188} y1={65} x2={208} y2={65} color={C.sec} />

              <ActionBox x={211} y={45} w={75} h={40} label="보안 심층" sub="온체인 분석" color={C.sec} />
              <Arrow x1={286} y1={65} x2={306} y2={65} color={C.chief} />

              <ActionBox x={309} y={45} w={75} h={40} label="최종 결정" sub="준법감시인" color={C.chief} />
              <Arrow x1={384} y1={65} x2={404} y2={65} color={C.ops} />

              <ActionBox x={407} y={45} w={60} h={40} label="실행" sub="운영팀" color={C.ops} />

              {/* 분기 */}
              <rect x={15} y={108} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <Arrow x1={346} y1={85} x2={200} y2={125} color={C.chief} />
              <Arrow x1={346} y1={85} x2={346} y2={125} color={C.chief} />

              <DataBox x={120} y={125} w={160} h={28} label="STR 보고 (의심 확정)" color={C.chief} />
              <DataBox x={280} y={125} w={140} h={28} label="종결 (오탐 확인)" color={C.ops} />

              <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">각 단계에서 권한과 책임이 분리 — 견제와 균형</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
