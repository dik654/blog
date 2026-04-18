import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  collect: '#6366f1',
  analyze: '#f59e0b',
  alert: '#ef4444',
  act: '#10b981',
};

const STEPS = [
  {
    label: 'FDS 4단계 아키텍처',
    body: '데이터 수집 → 패턴 분석(규칙+통계+ML) → 경보 발생 → 조치 실행. 자동 감지 + 사람의 판단이 결합.',
  },
  {
    label: '3가지 접근 방식 병행',
    body: '규칙 기반(1차 필터) + 행위 기반(개인화) + AI(복합 패턴). 단일 방식으로는 한계 — 세 가지 병행이 실무 표준.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#fds-arch-arrow)" />;
}

export default function FdsArchitectureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fds-arch-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">FDS 파이프라인 4단계</text>

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={15} y={35} w={95} h={55} label="1. 수집" sub="거래·접속·지갑" color={C.collect} />
              </motion.g>
              <Arrow x1={110} y1={62} x2={130} y2={62} color={C.collect} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={133} y={35} w={95} h={55} label="2. 분석" sub="규칙+통계+ML" color={C.analyze} />
              </motion.g>
              <Arrow x1={228} y1={62} x2={248} y2={62} color={C.analyze} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={251} y={35} w={95} h={55} label="3. 경보" sub="등급별 알림" color={C.alert} />
              </motion.g>
              <Arrow x1={346} y1={62} x2={366} y2={62} color={C.alert} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={369} y={35} w={95} h={55} label="4. 조치" sub="사람이 판단" color={C.act} />
              </motion.g>

              <rect x={15} y={110} width={449} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={50} y={120} w={170} h={28} label="시스템 자동 감지" color={C.collect} />
              <text x={135} y={162} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">초당 수천 건 처리</text>

              <text x={280} y={137} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">+</text>

              <DataBox x={300} y={120} w={140} h={28} label="사람의 최종 판단" color={C.act} />
              <text x={370} y={162} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">오탐 필터링·STR 결정</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">탐지 3방식 병행 구조</text>

              <ModuleBox x={20} y={40} w={130} h={55} label="규칙 기반" sub="미리 정의한 조건" color={C.collect} />
              <text x={85} y={110} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">설명 가능 / 새 수법 못잡음</text>

              <ModuleBox x={175} y={40} w={130} h={55} label="행위 기반" sub="개인 프로파일 이탈" color={C.analyze} />
              <text x={240} y={110} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">개인화 / 신규 고객 부족</text>

              <ModuleBox x={330} y={40} w={130} h={55} label="AI 기반" sub="ML/DL 패턴 학습" color={C.alert} />
              <text x={395} y={110} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">복합 인식 / 블랙박스</text>

              <Arrow x1={85} y1={95} x2={200} y2={135} color={C.collect} />
              <Arrow x1={240} y1={95} x2={240} y2={135} color={C.analyze} />
              <Arrow x1={395} y1={95} x2={280} y2={135} color={C.alert} />

              <DataBox x={150} y={138} w={180} h={30} label="3방식 병행 = 실무 표준" color={C.act} />
              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">규칙(1차 필터) + 행위(개인화) + AI(복합 패턴) 상호 보완</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
