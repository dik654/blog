import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  monitor: '#6366f1',
  detect: '#f59e0b',
  action: '#10b981',
  alert: '#ef4444',
};

const STEPS = [
  { label: '내부 감시 시스템', body: '임직원 거래 모니터링 + 비정상 패턴 감지. 24시간 자동화 필수. 규칙 기반 + ML 모델 병행.' },
  { label: '교육과 내부 신고 체계', body: '연 1회 전 임직원 교육 + 신규 입사자 별도. 내부 신고 채널(익명 가능) + 신고자 보호(보복 금지).' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ms-arrow)" />;
}

export default function MonitoringSystemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ms-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">자동화 감시 시스템</text>

              <ModuleBox x={140} y={25} w={200} h={35} label="거래 데이터 수집" sub="호가 / 체결 / 주문 / 접속 로그" color={C.monitor} />
              <Arrow x1={200} y1={60} x2={120} y2={80} color={C.detect} />
              <Arrow x1={280} y1={60} x2={360} y2={80} color={C.detect} />

              <ActionBox x={30} y={82} w={180} h={40} label="규칙 기반 탐지" sub="임계값 초과 시 자동 알림" color={C.detect} />
              <ActionBox x={270} y={82} w={180} h={40} label="ML 모델 탐지" sub="과거 패턴 학습 + 변종 탐지" color={C.detect} />

              <Arrow x1={120} y1={122} x2={200} y2={142} color={C.alert} />
              <Arrow x1={360} y1={122} x2={280} y2={142} color={C.alert} />

              <StatusBox x={160} y={142} w={160} h={30} label="이상 거래 알림 발생" progress={0.7} color={C.alert} />

              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">오탐(false positive) 관리 → 조사 인력 부담과 탐지 정밀도 균형</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">교육 + 내부 신고 체계</text>

              {/* Education */}
              <ModuleBox x={20} y={30} w={200} h={42} label="전 임직원 교육 (연 1회+)" sub="법률 + 내부규정 + 사례 + 신고절차" color={C.monitor} />
              <DataBox x={20} y={82} w={200} h={25} label="신규 입사자: 1개월 내 별도 교육" color={C.monitor} />

              {/* Reporting */}
              <ModuleBox x={260} y={30} w={200} h={42} label="내부 신고 채널" sub="준법감시인 직통 · 익명 가능" color={C.action} />
              <Arrow x1={360} y1={72} x2={360} y2={90} color={C.action} />

              <rect x={260} y={92} width={200} height={48} rx={6} fill={`${C.action}08`} stroke={C.action} strokeWidth={0.6} />
              <text x={270} y={109} fontSize={9} fontWeight={600} fill={C.action}>신고자 보호</text>
              <text x={270} y={124} fontSize={8} fill="var(--muted-foreground)">인사상 불이익 금지 + 신원 비공개</text>
              <text x={270} y={136} fontSize={8} fill="var(--muted-foreground)">보복 시 징계/법적 조치</text>

              <AlertBox x={80} y={155} w={320} h={30} label="기업 부정의 43%가 내부 제보로 발견 (ACFE)" sub="" color={C.detect} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
