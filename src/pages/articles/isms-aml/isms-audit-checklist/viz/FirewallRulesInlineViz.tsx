import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = {
  fw: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '위험 규칙 필터링', body: 'ANY→ANY, Hit Count=0, 전체 포트 범위 등 문제 규칙을 선별 조회. 심사원은 이 패턴으로 접근.' },
  { label: '정기 검토 프로세스', body: '규칙 CSV 추출 → 필터링 → 조치 → 보고서 작성. 최소 반기 1회 정기 검토 기록 필수.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#fri-arrow)" />;
}

export default function FirewallRulesInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fri-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={155} y={8} w={170} h={40} label="방화벽 규칙 목록" sub="심사원: 전체 규칙 보여주세요" color={C.fw} />

              <Arrow x1={200} y1={48} x2={80} y2={68} color={C.fail} />
              <Arrow x1={240} y1={48} x2={240} y2={68} color={C.warn} />
              <Arrow x1={280} y1={48} x2={400} y2={68} color={C.fail} />

              <AlertBox x={15} y={72} w={130} h={40} label="ANY → ANY" sub="방화벽 무력화 = 즉시 결함" color={C.fail} />
              <AlertBox x={170} y={72} w={140} h={40} label="Hit Count = 0" sub="미사용 규칙 잔존" color={C.warn} />
              <AlertBox x={335} y={72} w={130} h={40} label="포트 1-65535" sub="전체 포트 허용 = 결함" color={C.fail} />

              <rect x={30} y={128} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={80} y={140} w={320} h={30} label="설명이 비어있는 규칙도 필터링 대상" color={C.warn} />

              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">사전에 문제 규칙을 필터링해두면 심사 대응 시간 단축</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">정기 검토 프로세스</text>

              <ActionBox x={15} y={30} w={100} h={42} label="규칙 추출" sub="CSV/Excel 다운로드" color={C.fw} />
              <Arrow x1={115} y1={51} x2={133} y2={51} color={C.fw} />

              <ActionBox x={135} y={30} w={100} h={42} label="필터링 점검" sub="ANY/Hit0/빈설명" color={C.warn} />
              <Arrow x1={235} y1={51} x2={253} y2={51} color={C.warn} />

              <ActionBox x={255} y={30} w={100} h={42} label="조치 실행" sub="불필요 규칙 삭제" color={C.ok} />
              <Arrow x1={355} y1={51} x2={373} y2={51} color={C.ok} />

              <ActionBox x={375} y={30} w={90} h={42} label="보고서 작성" sub="검토일·조치내역" color={C.ok} />

              <rect x={30} y={92} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={30} y={105} w={200} h={32} label="보고서 필수 항목" color={C.fw} />
              <text x={290} y={118} fontSize={8} fill="var(--muted-foreground)">검토일자 · 검토자 · 대상 규칙 수</text>
              <text x={290} y={130} fontSize={8} fill="var(--muted-foreground)">발견 사항 · 조치 내역 · 다음 검토일</text>

              <AlertBox x={80} y={148} w={320} h={30} label="검토 기록 없음 = 방화벽 관리 미흡 결함" sub="" color={C.fail} />

              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">최소 반기 1회 검토. 규칙 수백 개라도 필터링으로 효율적 점검 가능</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
