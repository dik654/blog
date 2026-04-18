import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  step: '#6366f1',
  verify: '#10b981',
  bank: '#f59e0b',
};

const STEPS = [
  {
    label: 'eKYC 비대면 검증 흐름',
    body: '신분증 촬영 → OCR 정보 추출 → 안면인식(셀피 비교) → 활성도 검사(liveness) → 계좌 1원 인증.',
  },
  {
    label: '실명확인 입출금 계정 구조',
    body: '은행이 1차 실명확인 → VASP와 1:1 가상계좌 연동. 은행 KYC + VASP CDD가 이중 레이어로 결합.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ekyc-flow-arrow)" />;
}

export default function EkycFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ekyc-flow-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">eKYC 비대면 검증 파이프라인</text>

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={10} y={35} w={80} h={45} label="신분증 촬영" sub="사진 업로드" color={C.step} />
              </motion.g>
              <Arrow x1={90} y1={57} x2={105} y2={57} color={C.step} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={108} y={35} w={75} h={45} label="OCR" sub="정보 추출" color={C.step} />
              </motion.g>
              <Arrow x1={183} y1={57} x2={198} y2={57} color={C.step} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={201} y={35} w={80} h={45} label="안면인식" sub="셀피 비교" color={C.verify} />
              </motion.g>
              <Arrow x1={281} y1={57} x2={296} y2={57} color={C.verify} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={299} y={35} w={80} h={45} label="Liveness" sub="활성도 검사" color={C.verify} />
              </motion.g>
              <Arrow x1={379} y1={57} x2={394} y2={57} color={C.verify} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={397} y={35} w={70} h={45} label="1원 인증" sub="계좌 확인" color={C.bank} />
              </motion.g>

              <rect x={10} y={100} width={457} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Liveness = 딥페이크 차단. 고개 돌리기·눈 깜빡이기 동작 요청</text>
              <text x={240} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">자동 검증 실패 시 → 영상통화 검증으로 전환</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">실명확인 입출금 계정 구조</text>

              <ModuleBox x={30} y={40} w={120} h={50} label="은행" sub="1차 실명확인" color={C.bank} />
              <ModuleBox x={330} y={40} w={120} h={50} label="VASP" sub="2차 CDD" color={C.step} />

              {/* 1:1 연동 */}
              <Arrow x1={150} y1={65} x2={200} y2={65} color={C.bank} />
              <DataBox x={200} y={50} w={130} h={30} label="1:1 가상계좌 연동" color={C.verify} />
              <Arrow x1={330} y1={65} x2={280} y2={65} color={C.step} />

              {/* 고객 흐름 */}
              <Arrow x1={90} y1={90} x2={90} y2={110} color={C.bank} />
              <DataBox x={40} y={113} w={100} h={28} label="본인 명의 계좌" color={C.bank} />

              <Arrow x1={90} y1={141} x2={200} y2={155} color={C.bank} />
              <Arrow x1={390} y1={90} x2={390} y2={110} color={C.step} />
              <DataBox x={340} y={113} w={100} h={28} label="거래소 계정" color={C.step} />
              <Arrow x1={390} y1={141} x2={280} y2={155} color={C.step} />

              <DataBox x={170} y={155} w={140} h={30} label="이중 레이어 KYC" color={C.verify} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
