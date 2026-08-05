import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  a: '#6366f1',
  b: '#10b981',
  k: '#f59e0b',
  bad: '#ef4444',
  pub: '#a855f7',
  shared: '#0ea5e9',
};

const STEPS = [
  {
    label: '1: 공개 파라미터 p, g',
    body: 'p = 23 (소수), g = 5 (생성원).\nord(g) = p−1 = 22 → g 의 거듭제곱이 {1..22} 전체 순회. 도청자도 알 수 있지만 DLP 때문에 안전.',
  },
  {
    label: '2: 비밀 선택 + 공개값 계산',
    body: 'Alice: a=6 (비밀) → A = 5⁶ mod 23 = 8. Bob: b=15 (비밀) → B = 5¹⁵ mod 23 = 19.\n각자 비밀은 로컬 보관, 공개값만 전송 준비.',
  },
  {
    label: '3: 공개값 교환',
    body: 'Alice → Bob: A = 8.\nBob → Alice: B = 19.\n도청자는 A, B, p, g 모두 관측 가능 — 그러나 a, b 복원은 DLP.',
  },
  {
    label: '4: 공유 키 계산',
    body: 'Alice: K = B^a mod p = 19⁶ mod 23 = 2.\nBob: K = A^b mod p = 8¹⁵ mod 23 = 2.\n양측 동일한 K = g^(ab).',
  },
  {
    label: '5: 도청자의 한계 — DLP',
    body: '도청자: A=8 = 5^a mod 23 에서 a 풀어야.\n|Fp*|=22 → BSGS O(√22) ≈ 5번 가능. 그러나 |Fp*|=2²⁵⁶ → O(2¹²⁸) → 비현실.',
  },
];

export default function DHFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dh-arr-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.a} />
            </marker>
            <marker id="dh-arr-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.b} />
            </marker>
          </defs>

          <ModuleBox x={10} y={20} w={90} h={42} label="Alice" color={C.a} />
          <ModuleBox x={400} y={20} w={90} h={42} label="Bob" color={C.b} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={150} y={80} w={100} h={50} label="p = 23" sub="소수" color={C.pub} outlined />
              <DataBox x={260} y={80} w={100} h={50} label="g = 5" sub="생성원" color={C.pub} outlined />
              <DataBox x={130} y={150} w={240} h={50} label="ord(g) = 22 = p − 1" sub="{1..22} 전체 순회" color={C.k} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={80} w={170} h={42} label="a = 6" sub="비밀 (로컬)" color={C.a} outlined />
              <ActionBox x={20} y={130} w={170} h={42} label="A = 5⁶ mod 23" sub="modpow" color={C.a} />
              <DataBox x={20} y={180} w={170} h={32} label="A = 8" color={C.pub} outlined />

              <DataBox x={310} y={80} w={170} h={42} label="b = 15" sub="비밀 (로컬)" color={C.b} outlined />
              <ActionBox x={310} y={130} w={170} h={42} label="B = 5¹⁵ mod 23" sub="modpow" color={C.b} />
              <DataBox x={310} y={180} w={170} h={32} label="B = 19" color={C.pub} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={75} w={170} h={32} label="A = 8" color={C.pub} outlined />
              <DataBox x={310} y={75} w={170} h={32} label="B = 19" color={C.pub} outlined />

              <motion.line x1={195} y1={91} x2={310} y2={91} stroke={C.a} strokeWidth={1.5}
                markerEnd="url(#dh-arr-a)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
              <motion.line x1={310} y1={130} x2={195} y2={130} stroke={C.b} strokeWidth={1.5}
                markerEnd="url(#dh-arr-b)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />

              <DataBox x={310} y={115} w={170} h={32} label="B = 19 (Bob → Alice)" color={C.b} outlined />

              <AlertBox x={130} y={170} w={240} h={42} label="Eavesdropper 관측" sub="A, B, p, g 모두 알 수 있음" color={C.bad} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={20} y={80} w={170} h={42} label="K = B^a mod p" sub="19⁶ mod 23" color={C.a} />
              <DataBox x={20} y={130} w={170} h={42} label="K = 2" color={C.shared} outlined />

              <ActionBox x={310} y={80} w={170} h={42} label="K = A^b mod p" sub="8¹⁵ mod 23" color={C.b} />
              <DataBox x={310} y={130} w={170} h={42} label="K = 2" color={C.shared} outlined />

              <StatusBox x={130} y={180} w={240} h={28} label="동일 키 = g^(ab) = 5⁹⁰ mod 23" sub=" " color={C.shared} progress={1} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={75} w={170} h={36} label="알려진 값" sub="p, g, A, B" color={C.bad} outlined />
              <ActionBox x={210} y={75} w={140} h={36} label="DLP" sub="a = logₘ(A)" color={C.bad} />
              <DataBox x={370} y={75} w={120} h={36} label="a = ?" color={C.bad} outlined />

              <DataBox x={50} y={125} w={170} h={36} label="|Fp*| = 22" sub="BSGS ~5 step (toy)" color={C.k} outlined />
              <DataBox x={250} y={125} w={220} h={36} label="|Fp*| = 2²⁵⁶" sub="O(2¹²⁸) → 비현실" color={C.bad} outlined />

              <text x={250} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                CDH 가정: g^(ab) 계산 어려움 → DH 안전성의 핵심
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
