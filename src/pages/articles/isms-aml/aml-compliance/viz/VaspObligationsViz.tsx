import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  duty: '#6366f1',
  org: '#10b981',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '5가지 의무의 방어 흐름',
    body: 'FIU 신고가 진입 요건, CDD가 입구 통제, STR이 내부 감시, 기록 보관이 추적 가능성, 내부 통제가 조직적 실행을 담당.',
  },
  {
    label: '3선 방어 보고 라인',
    body: '1선(현업)이 CDD를 실행하고 2선(준법감시)이 감독. 3선(감사)은 1선·2선 모두를 독립 검증하여 이사회에 직접 보고.',
  },
  {
    label: 'VASP 특유의 기술적 난제',
    body: '24/7 거래, 실시간 국경 간 이전, 온체인 믹싱 — 은행 AML 체계를 그대로 적용하면 부족. 블록체인 분석 역량이 추가로 필요.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#vasp-obl-arrow)" />;
}

export default function VaspObligationsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="vasp-obl-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">의무별 방어 역할</text>

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={10} y={35} w={80} h={50} label="FIU 신고" sub="진입 요건" color={C.duty} />
              </motion.g>
              <Arrow x1={90} y1={60} x2={105} y2={60} color={C.duty} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={108} y={35} w={80} h={50} label="CDD" sub="입구 통제" color={C.duty} />
              </motion.g>
              <Arrow x1={188} y1={60} x2={203} y2={60} color={C.duty} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={206} y={35} w={80} h={50} label="STR" sub="내부 감시" color={C.duty} />
              </motion.g>
              <Arrow x1={286} y1={60} x2={301} y2={60} color={C.duty} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={304} y={35} w={80} h={50} label="기록 보관" sub="추적 가능성" color={C.org} />
              </motion.g>
              <Arrow x1={384} y1={60} x2={399} y2={60} color={C.org} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={402} y={35} w={68} h={50} label="내부 통제" sub="조직 실행" color={C.org} />
              </motion.g>

              {/* 하단 전체 연결 */}
              <rect x={30} y={110} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <DataBox x={155} y={120} w={170} h={32} label="5가지가 맞물려 방어 체계 완성" color={C.duty} />
              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">하나라도 빠지면 전체 체계에 구멍 → FIU 검사 시 지적 대상</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">3선 방어 보고 라인</text>

              <ModuleBox x={15} y={40} w={120} h={50} label="1선 현업" sub="CDD 실행" color={C.duty} />
              <ModuleBox x={180} y={40} w={120} h={50} label="2선 준법감시" sub="정책·STR 결정" color={C.org} />
              <ModuleBox x={345} y={40} w={120} h={50} label="3선 감사" sub="독립 검증" color={C.warn} />

              <Arrow x1={180} y1={60} x2={140} y2={60} color={C.org} />
              <text x={160} y={55} textAnchor="middle" fontSize={7} fill={C.org}>감독</text>
              <Arrow x1={345} y1={60} x2={305} y2={60} color={C.warn} />
              <text x={325} y={55} textAnchor="middle" fontSize={7} fill={C.warn}>감사</text>

              <Arrow x1={405} y1={90} x2={300} y2={130} color={C.warn} />

              <ModuleBox x={170} y={135} w={140} h={45} label="이사회" sub="최종 보고·의사결정" color="#8b5cf6" />
              <text x={380} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">직접 보고</text>
              <text x={380} y={130} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">(독립성 보장)</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">VASP vs 전통 금융 — 추가 난제</text>

              <ModuleBox x={30} y={35} w={170} h={45} label="전통 금융 AML" sub="업무시간 · 국내 중심 · 실명 기반" color={C.org} />
              <Arrow x1={200} y1={58} x2={230} y2={58} color={C.duty} />
              <text x={215} y={50} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">부족</text>

              <ModuleBox x={233} y={35} w={230} h={45} label="VASP AML 추가 요구사항" sub="24/7 · 국경 무관 · 가명 기반" color={C.warn} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={30} y={105} w={120} h={40} label="블록체인 분석" sub="온체인 추적" color={C.duty} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={170} y={105} w={120} h={40} label="지갑 클러스터링" sub="주소 그룹핑" color={C.duty} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={310} y={105} w={140} h={40} label="DeFi 프로토콜 추적" sub="탈중앙화 경로" color={C.duty} />
              </motion.g>

              <AlertBox x={120} y={165} w={240} h={35} label="기술적 역량 없이는 규제 준수 불가" sub="블록체인 분석 = VASP AML의 핵심 차별점" color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
