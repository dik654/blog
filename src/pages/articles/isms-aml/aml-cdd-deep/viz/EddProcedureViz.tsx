import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const C = {
  edd: '#ef4444',
  check: '#6366f1',
  approve: '#10b981',
};

const STEPS = [
  {
    label: 'EDD 5가지 추가 조치',
    body: '자금출처 소명 → 자산출처 소명 → 거래목적 심층 → 경영진 승인 → 강화 모니터링. 일반 CDD 전부 포함 + 추가.',
  },
  {
    label: 'PEP 관리 — 직위 종료 후에도 유지',
    body: 'PEP 퇴직 후 12~24개월간 EDD 유지. 축적한 부정 자금을 퇴직 직후 세탁할 가능성 대비.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#edd-proc-arrow)" />;
}

export default function EddProcedureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="edd-proc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">EDD 추가 조치 5단계</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={15} y={35} w={80} h={50} label="자금출처" sub="이번 거래의 돈" color={C.edd} />
              </motion.g>
              <Arrow x1={95} y1={60} x2={110} y2={60} color={C.edd} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={113} y={35} w={80} h={50} label="자산출처" sub="전체 재산 축적" color={C.edd} />
              </motion.g>
              <Arrow x1={193} y1={60} x2={208} y2={60} color={C.edd} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={211} y={35} w={80} h={50} label="거래목적" sub="경제적 합리성" color={C.check} />
              </motion.g>
              <Arrow x1={291} y1={60} x2={306} y2={60} color={C.check} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={309} y={35} w={75} h={50} label="경영진 승인" sub="CCO 이상" color={C.approve} />
              </motion.g>
              <Arrow x1={384} y1={60} x2={399} y2={60} color={C.approve} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={402} y={35} w={68} h={50} label="강화 감시" sub="낮은 임계값" color={C.approve} />
              </motion.g>

              <rect x={15} y={105} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <DataBox x={130} y={115} w={220} h={28} label="일반 CDD 전부 포함 + 위 5가지 추가" color={C.check} />
              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">자금출처: "이번 거래의 돈" / 자산출처: "전체 재산의 형성 경로" — 범위가 다르다</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">PEP 관리 타임라인</text>

              {/* 타임라인 */}
              <line x1={40} y1={70} x2={440} y2={70} stroke="var(--border)" strokeWidth={1} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <circle cx={80} cy={70} r={5} fill={C.edd} />
                <text x={80} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.edd}>재직 중</text>
                <text x={80} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">EDD 필수</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <circle cx={220} cy={70} r={5} fill={C.edd} />
                <text x={220} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.edd}>퇴직</text>
                <text x={220} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">EDD 유지 시작</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={220} y={64} width={140} height={12} rx={3} fill={C.edd} opacity={0.15} />
                <text x={290} y={73} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.edd}>12~24개월 유지</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <circle cx={360} cy={70} r={5} fill={C.approve} />
                <text x={360} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.approve}>해제 검토</text>
                <text x={360} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">위험 재평가</text>
              </motion.g>

              <AlertBox x={100} y={110} w={280} h={40} label="퇴직 직후 세탁 시도 가능성" sub="축적한 부정 자금의 세탁 타이밍" color={C.edd} />
              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2012년 FATF 개정: 외국 PEP뿐 아니라 내국인 PEP도 EDD 대상</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
