import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { line1: '#10b981', line2: '#f59e0b', line3: '#6366f1', red: '#ef4444' };

const STEPS = [
  { label: '1선 → 2선 견제 구조', body: '1선(현업)의 이해 충돌을 2선(준법감시)이 독립적으로 견제. 영업 실적 vs AML 통제.' },
  { label: '2선 핵심 업무: FDS 알림 검토', body: 'FDS 자동 경보 → 오탐/진짜 판별 → 규칙 튜닝. 2선이 가장 많이 수행하는 업무.' },
  { label: '3선: 독립적 감사', body: '1선+2선 체계 전체를 독립 평가. 이사회 직보 라인이 생명선 — CCO 은폐도 견제 가능.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#dl-arrow)" />;
}

export default function DefenseLineFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dl-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">1선 ↔ 2선 견제 구조</text>
              {/* 1선 */}
              <ModuleBox x={20} y={30} w={180} h={50} label="1선: 현업" sub="영업·CS·온보딩" color={C.line1} />
              <text x={110} y={98} textAnchor="middle" fontSize={8} fill={C.line1}>CDD 실행 + 이상 징후 감지</text>
              {/* Conflict */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <AlertBox x={20} y={108} w={180} h={32} label="이해 충돌" sub="고위험 거절 → 매출 감소" color={C.red} />
              </motion.g>
              {/* 2선 */}
              <ModuleBox x={280} y={30} w={180} h={50} label="2선: 준법감시" sub="CCO·AML팀·FDS" color={C.line2} />
              <text x={370} y={98} textAnchor="middle" fontSize={8} fill={C.line2}>정책 수립 + CDD 품질 검토</text>
              {/* Check */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <DataBox x={280} y={108} w={180} h={32} label="독립적 시각으로 견제" color={C.line2} />
              </motion.g>
              {/* Arrow: 2선 checks 1선 */}
              <Arrow x1={280} y1={55} x2={200} y2={55} color={C.line2} />
              <text x={240} y={50} textAnchor="middle" fontSize={8} fill={C.line2}>품질 검토</text>
              {/* Bottom */}
              <rect x={60} y={158} width={360} height={26} rx={5} fill={`${C.line2}08`} stroke={C.line2} strokeWidth={0.5} />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill={C.line2}>
                2선은 영업 실적 책임 없음 → 이해 충돌 없이 판단 가능
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.line2}>2선 핵심 업무: FDS 알림 검토</text>
              {/* FDS generates alerts */}
              <ActionBox x={20} y={35} w={120} h={40} label="FDS 시스템" sub="자동 경보 생성" color={C.line2} />
              <Arrow x1={140} y1={55} x2={175} y2={55} color={C.line2} />
              {/* AML analyst reviews */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={178} y={30} w={140} h={50} label="AML 분석가" sub="경보 검토 + 판별" color={C.line2} />
              </motion.g>
              {/* Three outcomes */}
              <Arrow x1={248} y1={80} x2={100} y2={105} color={C.line1} />
              <Arrow x1={248} y1={80} x2={248} y2={105} color={C.line2} />
              <Arrow x1={248} y1={80} x2={396} y2={105} color={C.red} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <DataBox x={30} y={108} w={140} h={28} label="오탐 (False Positive)" color={C.line1} />
                <DataBox x={185} y={108} w={126} h={28} label="추가 조사 필요" color={C.line2} />
                <DataBox x={326} y={108} w={140} h={28} label="STR 보고 판정" color={C.red} />
              </motion.g>
              {/* Rule tuning feedback */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <line x1={100} y1={136} x2={100} y2={165} stroke={C.line1} strokeWidth={0.7} strokeDasharray="3 2" />
                <line x1={100} y1={165} x2={50} y2={165} stroke={C.line1} strokeWidth={0.7} strokeDasharray="3 2" />
                <line x1={50} y1={165} x2={50} y2={55} stroke={C.line1} strokeWidth={0.7} strokeDasharray="3 2" markerEnd="url(#dl-arrow)" />
                <text x={30} y={115} textAnchor="middle" fontSize={7} fill={C.line1} transform="rotate(-90, 30, 115)">규칙 튜닝</text>
              </motion.g>
              <text x={300} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">오탐률 낮추기 위한 규칙 튜닝도 2선 책임</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.line3}>3선: 독립적 감사 → 이사회 직보</text>
              {/* 1선 + 2선 */}
              <ActionBox x={20} y={35} w={120} h={36} label="1선 (현업)" sub="CDD + 감지" color={C.line1} />
              <ActionBox x={160} y={35} w={120} h={36} label="2선 (준법감시)" sub="정책 + 모니터링" color={C.line2} />
              {/* 3선 evaluates both */}
              <Arrow x1={80} y1={71} x2={140} y2={95} color={C.line3} />
              <Arrow x1={220} y1={71} x2={195} y2={95} color={C.line3} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={100} y={95} w={140} h={44} label="3선 (내부감사)" sub="설계 + 운영 효과성 평가" color={C.line3} />
              </motion.g>
              {/* Direct to board */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Arrow x1={240} y1={117} x2={320} y2={80} color={C.line3} />
                <ModuleBox x={320} y={50} w={140} h={50} label="이사회" sub="감사위원회" color={C.line3} />
                <text x={350} y={115} fontSize={8} fill={C.line3} fontWeight={600}>직보 라인</text>
              </motion.g>
              {/* Why direct? */}
              <AlertBox x={70} y={155} w={340} h={32} label="CCO 은폐 방지" sub="3선이 이사회에 직접 보고 → 2선(CCO) 자체의 부적절 행위도 견제" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
