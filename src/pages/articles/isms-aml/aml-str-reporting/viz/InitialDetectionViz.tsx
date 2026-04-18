import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { fds: '#6366f1', human: '#10b981', review: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: '인지 경로: FDS vs 현업', body: 'FDS 자동 경보(대부분)와 현업 직원 직접 감지(보완). 두 경로 모두 내부 보고서로 수렴.' },
  { label: '현업이 감지해야 할 징후', body: '목적 미소명, 본인확인 회피, 소득-거래 불일치, 급박한 대규모 출금, 타인 명의 정황.' },
  { label: '1차 검토 4단계', body: '경보 유효성 → CDD 대조 → 온체인 분석 → 추가 정보 수집. 결과: 오탐/추가조사/SAR 판정.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#id-arrow)" />;
}

export default function InitialDetectionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="id-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">의심 인지 두 경로</text>
              <ModuleBox x={20} y={30} w={160} h={44} label="FDS 자동 경보" sub="이상거래탐지시스템" color={C.fds} />
              <text x={100} y={90} textAnchor="middle" fontSize={8} fill={C.fds}>전체 인지의 대부분</text>

              <ModuleBox x={300} y={30} w={160} h={44} label="현업 직원 보고" sub="CS팀 / 운영팀" color={C.human} />
              <text x={380} y={90} textAnchor="middle" fontSize={8} fill={C.human}>시스템 미탐지 보완</text>

              {/* Converge */}
              <Arrow x1={140} y1={74} x2={210} y2={110} color={C.fds} />
              <Arrow x1={340} y1={74} x2={270} y2={110} color={C.human} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <DataBox x={170} y={112} w={140} h={30} label="내부 보고서 작성" color={C.review} />
              </motion.g>
              <Arrow x1={240} y1={142} x2={240} y2={158} color={C.review} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={170} y={160} w={140} h={28} label="AML 담당자에게 전달" sub="" color={C.review} />
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.human}>현업이 감지해야 할 이상 징후</text>
              {[
                { label: '거래 목적 미소명', sub: '왜 이 거래인지 설명 못함', y: 30 },
                { label: '본인확인 회피 시도', sub: '신분증 제출 거부·지연', y: 64 },
                { label: '소득-거래 불일치', sub: '대학생인데 5천만 원 입금', y: 98 },
                { label: '급박한 대규모 출금', sub: '전액 즉시 출금 요구', y: 132 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i }}>
                  <ActionBox x={20} y={item.y} w={200} h={28} label={item.label} sub={item.sub} color={C.red} />
                </motion.g>
              ))}
              {/* Arrow to action */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <Arrow x1={220} y1={80} x2={280} y2={80} color={C.review} />
                <rect x={283} y={50} width={180} height={60} rx={6} fill={`${C.review}08`} stroke={C.review} strokeWidth={0.6} />
                <text x={373} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.review}>내부 보고 트리거</text>
                <text x={373} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">징후 1개라도 인지 시</text>
                <text x={373} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">즉시 보고책임자에 전달</text>
              </motion.g>

              <AlertBox x={250} y={128} w={210} h={38} label="타인 명의 이용 정황" sub="본인 계정이 아닌 것으로 의심 시 즉시 보고" color={C.red} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.review}>AML 담당자 1차 검토 4단계</text>
              {[
                { label: '경보 유효성', sub: '오탐(FP) 확인', x: 15 },
                { label: 'CDD 대조', sub: '프로파일 vs 패턴', x: 130 },
                { label: '온체인 분석', sub: '위험점수·믹서 연관', x: 245 },
                { label: '추가 정보', sub: '자금출처 소명 요청', x: 360 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}>
                  <ActionBox x={item.x} y={30} w={105} h={40} label={item.label} sub={item.sub} color={C.review} />
                </motion.g>
              ))}
              {/* Converge to result */}
              {[67, 182, 297, 412].map((x, i) => (
                <Arrow key={i} x1={x} y1={70} x2={240} y2={95} color={C.review} />
              ))}
              <text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">검토 결과</text>
              {/* Three outcomes */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <DataBox x={25} y={118} w={130} h={28} label="(a) 오탐 → 종료" color={C.human} />
                <DataBox x={175} y={118} w={130} h={28} label="(b) 추가 조사" color={C.review} />
                <DataBox x={325} y={118} w={130} h={28} label="(c) SAR 작성" color={C.red} />
              </motion.g>
              <text x={240} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                경보 후 24시간 이내에 1차 검토 완료 (내부 SLA)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
