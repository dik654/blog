import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  detect: '#6366f1',
  action: '#f59e0b',
  report: '#ef4444',
  done: '#10b981',
};

const STEPS = [
  {
    label: '경보 발생 → STR 보고 6단계',
    body: 'FDS 자동 감지 → 1차 분석(오탐 필터) → 계정 조치 → 심층 조사 → 보고 결정 → 후속 조치. 의심 인지 후 3영업일 이내 보고.',
  },
  {
    label: 'SAR 작성과 Tipping-off 금지',
    body: 'SAR은 거래 시점·계정 정보·외부 지갑 주소·조치 내역을 포함. 보고 사실을 고객에게 알리면 형사처벌.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#fds-alert-arrow)" />;
}

export default function FdsAlertFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fds-alert-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 상단 3단계 */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={10} y={15} w={70} h={42} label="감지" sub="FDS 자동" color={C.detect} />
              </motion.g>
              <Arrow x1={80} y1={36} x2={95} y2={36} color={C.detect} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={98} y={15} w={80} h={42} label="1차 분석" sub="오탐 필터링" color={C.detect} />
              </motion.g>
              <Arrow x1={178} y1={36} x2={193} y2={36} color={C.action} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={196} y={15} w={80} h={42} label="계정 조치" sub="정지·차단" color={C.action} />
              </motion.g>
              <Arrow x1={276} y1={36} x2={291} y2={36} color={C.action} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={294} y={15} w={80} h={42} label="심층 조사" sub="온체인 분석" color={C.action} />
              </motion.g>
              <Arrow x1={374} y1={36} x2={389} y2={36} color={C.report} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <AlertBox x={392} y={15} w={75} h={42} label="STR" sub="FIU 보고" color={C.report} />
              </motion.g>

              {/* 하단: 시한과 담당자 */}
              <rect x={15} y={78} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={20} y={90} w={90} h={28} label="실시간" color={C.detect} />
              <text x={65} y={130} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">시스템 자동</text>

              <DataBox x={130} y={90} w={90} h={28} label="24시간 이내" color={C.detect} />
              <text x={175} y={130} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">AML 담당자</text>

              <DataBox x={240} y={90} w={90} h={28} label="즉시 실행" color={C.action} />
              <text x={285} y={130} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">운영팀</text>

              <DataBox x={350} y={90} w={110} h={28} label="3영업일 이내" color={C.report} />
              <text x={405} y={130} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">준법감시인</text>

              <StatusBox x={140} y={145} w={200} h={45} label="전체 처리 시한" sub="의심 인지 → FIU 보고: 3영업일" color={C.report} progress={1} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">SAR 구성과 Tipping-off 금지</text>

              {/* SAR 구성 요소 */}
              <DataBox x={20} y={35} w={80} h={28} label="거래 시점" color={C.detect} />
              <DataBox x={115} y={35} w={80} h={28} label="계정 정보" color={C.detect} />
              <DataBox x={210} y={35} w={80} h={28} label="자산 종류" color={C.detect} />
              <DataBox x={305} y={35} w={85} h={28} label="지갑 주소" color={C.detect} />
              <DataBox x={405} y={35} w={65} h={28} label="조치 내역" color={C.detect} />

              <Arrow x1={240} y1={63} x2={240} y2={82} color={C.report} />

              <ActionBox x={165} y={85} w={150} h={38} label="SAR → FIU 제출" sub="수사기관 전달 가능" color={C.report} />

              {/* Tipping-off 경고 */}
              <rect x={15} y={142} width={450} height={1} stroke={C.report} strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={120} y={152} w={240} h={40} label="Tipping-off 금지" sub="보고 사실 고객 통보 시 형사처벌" color={C.report} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
