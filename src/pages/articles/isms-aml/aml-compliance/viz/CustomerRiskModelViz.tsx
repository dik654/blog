import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const C = {
  quant: '#6366f1',
  qual: '#f59e0b',
  result: '#10b981',
};

const STEPS = [
  {
    label: '정량+정성 평가 조합',
    body: '정량 모델(점수)이 초기 등급을 산출하고, 정성 평가(전문가 판단)로 조정. override 시 사유 기록 + 상위자 승인 필수.',
  },
  {
    label: '문서화 의무 체계',
    body: '위험평가 계획서 → 수행 기록 → 결과 보고서 → 위원회 승인 → 이행 계획. 문서 없으면 미이행 판정.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cust-risk-arrow)" />;
}

export default function CustomerRiskModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cust-risk-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">고객 위험등급 산정 흐름</text>

              {/* 정량 평가 */}
              <ModuleBox x={20} y={35} w={180} h={50} label="정량 평가 (Scoring)" sub="국적·직업·거래패턴·자금출처" color={C.quant} />

              {/* 점수 바 */}
              <StatusBox x={60} y={95} w={100} h={40} label="점수 산출" sub="0~100점" color={C.quant} progress={0.65} />

              <Arrow x1={160} y1={115} x2={200} y2={115} color={C.quant} />

              {/* 초기 등급 */}
              <DataBox x={203} y={100} w={85} h={30} label="초기 등급" color={C.quant} />

              <Arrow x1={288} y1={115} x2={310} y2={115} color={C.qual} />

              {/* 정성 평가 */}
              <ModuleBox x={280} y={35} w={180} h={50} label="정성 평가 (Expert)" sub="맥락·직관·업무 경험" color={C.qual} />
              <Arrow x1={370} y1={85} x2={370} y2={100} color={C.qual} />

              {/* 최종 등급 */}
              <ActionBox x={313} y={100} w={115} h={30} label="조정 (Override)" sub="사유 기록 필수" color={C.qual} />

              <Arrow x1={370} y1={130} x2={370} y2={148} color={C.result} />
              <DataBox x={310} y={150} w={120} h={30} label="최종 위험등급" color={C.result} />

              <text x={140} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">일관성(정량) + 맥락(정성) 조합이 최선</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">위험평가 문서화 체계</text>

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={20} y={40} w={80} h={40} label="계획서" sub="범위·일정" color={C.quant} />
              </motion.g>
              <Arrow x1={100} y1={60} x2={115} y2={60} color={C.quant} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={118} y={40} w={80} h={40} label="수행 기록" sub="분석 과정" color={C.quant} />
              </motion.g>
              <Arrow x1={198} y1={60} x2={213} y2={60} color={C.quant} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={216} y={40} w={80} h={40} label="결과 보고" sub="잔여위험" color={C.qual} />
              </motion.g>
              <Arrow x1={296} y1={60} x2={311} y2={60} color={C.qual} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={314} y={40} w={70} h={40} label="승인" sub="위원회" color={C.result} />
              </motion.g>
              <Arrow x1={384} y1={60} x2={399} y2={60} color={C.result} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={402} y={40} w={65} h={40} label="이행" sub="개선 조치" color={C.result} />
              </motion.g>

              <rect x={20} y={105} width={445} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={110} y={115} w={260} h={32} label="문서가 없으면 체계가 있어도 '미이행'" color={C.qual} />
              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FIU 검사에서 최우선 확인 대상: 위험평가 보고서 + 위원회 회의록</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
