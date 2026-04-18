import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = {
  ext: '#6366f1',
  int: '#ef4444',
  fix: '#10b981',
};

const STEPS = [
  {
    label: '외부 vs 내부 사고 대응',
    body: '외부(고객 세탁·해킹)는 FDS로 탐지 후 계정 정지. 내부(직원 횡령·공모)는 감사 로그로 탐지 후 권한 회수·격리.',
  },
  {
    label: '재발 방지 고도화 방향',
    body: 'AI FDS, 블랙리스트 실시간 갱신, eKYC 강화, 정기 교육 — 기술과 인적 역량의 균형이 성숙도를 결정.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#inc-resp-arrow)" />;
}

export default function IncidentResponseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="inc-resp-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 외부 경로 */}
              <ModuleBox x={20} y={15} w={90} h={45} label="외부 사고" sub="고객·해커" color={C.ext} />
              <Arrow x1={110} y1={37} x2={140} y2={37} color={C.ext} />
              <ActionBox x={143} y={18} w={80} h={38} label="FDS 탐지" sub="자동 감지" color={C.ext} />
              <Arrow x1={223} y1={37} x2={253} y2={37} color={C.ext} />
              <ActionBox x={256} y={18} w={80} h={38} label="계정 정지" sub="출금 차단" color={C.ext} />
              <Arrow x1={336} y1={37} x2={366} y2={37} color={C.ext} />
              <AlertBox x={369} y={15} w={95} h={42} label="STR 보고" sub="FIU·수사기관" color={C.ext} />

              {/* 내부 경로 */}
              <rect x={20} y={78} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ModuleBox x={20} y={90} w={90} h={45} label="내부 사고" sub="임직원·외주" color={C.int} />
              <Arrow x1={110} y1={112} x2={140} y2={112} color={C.int} />
              <ActionBox x={143} y={93} w={80} h={38} label="감사 로그" sub="접근·권한" color={C.int} />
              <Arrow x1={223} y1={112} x2={253} y2={112} color={C.int} />
              <ActionBox x={256} y={93} w={80} h={38} label="권한 회수" sub="격리·조사" color={C.int} />
              <Arrow x1={336} y1={112} x2={366} y2={112} color={C.int} />
              <AlertBox x={369} y={90} w={95} h={42} label="수사 의뢰" sub="이사회·감사위" color={C.int} />

              <text x={240} y={160} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">내부 사고가 더 치명적</text>
              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FDS 규칙 인지 · 개인정보 접근 · 로그 조작 가능 → 최소 권한 + 직무 분리 필수</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">재발 방지 고도화 4방향</text>

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={20} y={40} w={100} h={50} label="AI FDS" sub="미지 패턴 학습" color={C.ext} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={140} y={40} w={100} h={50} label="블랙리스트" sub="실시간 갱신" color={C.ext} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={260} y={40} w={100} h={50} label="eKYC 강화" sub="딥페이크 대응" color={C.fix} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={380} y={40} w={85} h={50} label="교육·훈련" sub="연 1회 이상" color={C.fix} />
              </motion.g>

              <Arrow x1={70} y1={90} x2={70} y2={110} color={C.ext} />
              <Arrow x1={190} y1={90} x2={190} y2={110} color={C.ext} />
              <Arrow x1={310} y1={90} x2={310} y2={110} color={C.fix} />
              <Arrow x1={422} y1={90} x2={422} y2={110} color={C.fix} />

              <DataBox x={100} y={115} w={280} h={32} label="기술(FDS/AI) + 인적 역량(교육/조직) = 성숙도" color={C.fix} />

              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">XAI(설명 가능 AI) — "왜 의심스러운지" 설명 가능해야 규제 적정성 인정</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
