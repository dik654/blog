import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  audit: '#6366f1',
  minor: '#f59e0b',
  major: '#ef4444',
  fix: '#10b981',
};

const STEPS = [
  { label: '결함 분류', body: '심사원이 발견한 문제는 결함(Minor)과 중결함(Major)으로 분류. 등급에 따라 후속 조치가 다르다.' },
  { label: '보완조치 전략', body: '일시적 땜질이 아닌 "재발 방지 체계"를 증적으로 제출. 절차서 수립 + 자동화 + 모니터링까지.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#dgi-arrow)" />;
}

export default function DefectGradeInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dgi-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={15} w={120} h={44} label="심사 완료" sub="결함 보고서 도출" color={C.audit} />

              <Arrow x1={140} y1={30} x2={178} y2={30} color={C.minor} />
              <Arrow x1={140} y1={50} x2={178} y2={65} color={C.major} />

              <StatusBox x={180} y={12} w={140} h={40} label="결함 (Minor)" sub="40일 이내 개선" color={C.minor} progress={0.7} />
              <StatusBox x={180} y={60} w={140} h={40} label="중결함 (Major)" sub="심사 중단 가능" color={C.major} progress={0.3} />

              <Arrow x1={320} y1={32} x2={350} y2={48} color={C.fix} />
              <Arrow x1={320} y1={80} x2={350} y2={64} color={C.fix} />

              <ModuleBox x={352} y={30} w={110} h={44} label="보완조치 제출" sub="증적 기반 개선" color={C.fix} />

              <rect x={30} y={115} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={135} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">대부분의 조직은 5~15개 결함을 받는다</text>
              <AlertBox x={80} y={145} w={320} h={35} label="결함 = 인증 실패가 아님" sub="보완조치의 품질이 핵심. '재발 방지 체계'를 증적으로 보여줘야 함" color={C.minor} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">보완조치 전략: 패치 미적용 결함 예시</text>

              <AlertBox x={15} y={30} w={100} h={42} label="결함 발견" sub="패치 미적용" color={C.major} />
              <Arrow x1={115} y1={51} x2={133} y2={51} color={C.major} />

              <ActionBox x={135} y={30} w={100} h={42} label="원인 분석" sub="패치 절차 부재" color={C.minor} />
              <Arrow x1={235} y1={51} x2={253} y2={51} color={C.fix} />

              <ActionBox x={255} y={30} w={100} h={42} label="절차서 수립" sub="정기 패치 프로세스" color={C.fix} />
              <Arrow x1={355} y1={51} x2={373} y2={51} color={C.fix} />

              <ActionBox x={375} y={30} w={90} h={42} label="자동화" sub="스크립트 + 알림" color={C.fix} />

              {/* 비교: 나쁜 vs 좋은 */}
              <rect x={30} y={95} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={108} w={195} h={40} label="나쁜 보완: 단순 패치 적용" sub="이번만 처리 → 같은 결함 재발" color={C.major} />
              <ModuleBox x={255} y={108} w={195} h={40} label="좋은 보완: 재발 방지 체계" sub="절차서 + 자동화 + 모니터링 설정" color={C.fix} />

              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">심사원은 "이번에 고쳤다"가 아니라 "앞으로 안 생긴다"를 본다</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
