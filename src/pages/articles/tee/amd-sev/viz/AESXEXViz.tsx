import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  plain: '#6366f1',
  tweak: '#8b5cf6',
  aes: '#0ea5e9',
  cipher: '#10b981',
  bad: '#ef4444',
  good: '#10b981',
};

const STEPS = [
  { label: '평문 P + tweak T(주소 유래) 준비', body: '같은 평문이라도 tweak이 다르면 결과가 달라지도록' },
  { label: '내부 mask 계산: M = AES_K(T)', body: 'tweak을 같은 키로 암호화해 위치 의존 마스크 생성' },
  { label: '핵심: C = AES_K(P ⊕ M) ⊕ M (XEX)', body: 'XOR-Encrypt-XOR — 평문에 마스크 결합 후 다시 마스킹' },
  { label: '결과 — 위치 의존 암호문 + 무패턴', body: 'rainbow table·블록 반복 패턴 무력화' },
];

export default function AESXEXViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Inputs */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <DataBox x={20} y={28} w={130} h={36} label="평문 P (16B)" color={C.plain} outlined />
            <DataBox x={20} y={86} w={130} h={36} label="Tweak T = f(PA)" color={C.tweak} outlined />
          </motion.g>

          {/* Mask */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }}>
            <ActionBox x={170} y={86} w={130} h={36} label="AES_K(T)" sub="mask 생성" color={C.aes} />
            <DataBox x={320} y={86} w={130} h={36} label="M = AES_K(T)" color={C.aes} outlined />
          </motion.g>

          {/* Core XEX */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }}>
            <ActionBox x={170} y={28} w={130} h={36} label="P ⊕ M" sub="첫 XOR" color={C.aes} />
            <ActionBox x={320} y={28} w={130} h={36} label="AES_K(·)" sub="암호화" color={C.aes} />
            <ActionBox x={170} y={140} w={130} h={36} label="⊕ M" sub="둘째 XOR" color={C.aes} />
            <DataBox x={320} y={140} w={130} h={36} label="C (암호문)" color={C.cipher} outlined />
          </motion.g>

          {/* Arrows */}
          {step >= 2 && (
            <>
              <motion.line x1={150} y1={46} x2={170} y2={46} stroke={C.plain} strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={300} y1={46} x2={320} y2={46} stroke={C.aes} strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={385} y1={64} x2={385} y2={140} stroke={C.aes} strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={300} y1={158} x2={320} y2={158} stroke={C.aes} strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={300} y1={104} x2={235} y2={104} stroke={C.aes} strokeWidth={0.6} strokeDasharray="2 2" />
              <motion.line x1={235} y1={104} x2={235} y2={140} stroke={C.aes} strokeWidth={0.6} strokeDasharray="2 2" />
              <motion.line x1={235} y1={104} x2={235} y2={64} stroke={C.aes} strokeWidth={0.6} strokeDasharray="2 2" />
            </>
          )}

          {/* Result panel */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ModuleBox x={20} y={186} w={210} h={28} label="✓ 위치 의존" sub="같은 평문, 다른 주소 → 다른 C" color={C.good} />
              <AlertBox x={250} y={186} w={210} h={28} label="✗ 초기 SEV (ECB-유사)" sub="블록 반복 → 패턴 누출" color={C.bad} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
