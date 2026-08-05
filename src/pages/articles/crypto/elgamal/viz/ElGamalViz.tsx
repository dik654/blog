import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  s: '#6366f1',
  r: '#10b981',
  k: '#f59e0b',
  pub: '#a855f7',
  ct: '#0ea5e9',
  bad: '#ef4444',
};

const STEPS = [
  {
    label: '1: 키 생성 (수신자)',
    body: 'p=23, g=5 공개. x=6 비밀, y = g^x mod p = 8.\n공개키 (p, g, y) 발행, 비밀키 x 는 수신자만 보유.',
  },
  {
    label: '2: 암호화 (송신자)',
    body: 'm=7 메시지, k=3 일회용 랜덤.\nc₁ = g^k mod p = 10. s = y^k mod p = 6.\nc₂ = m·s mod p = 19.',
  },
  {
    label: '3: 암호문 전송 (c₁, c₂)',
    body: '송신자 → 수신자: (10, 19).\n도청자는 c₁, c₂, p, g, y 모두 봄. s 복원에 x 또는 k 필요 → DLP.',
  },
  {
    label: '4: 복호화 (수신자)',
    body: 's = c₁^x mod p = 10⁶ mod 23 = 6 (= y^k).\ns⁻¹ = 4. m = c₂·s⁻¹ mod p = 76 mod 23 = 7 ✓.',
  },
];

export default function ElGamalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="eg-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.s} />
            </marker>
          </defs>

          <ModuleBox x={10} y={20} w={90} h={42} label="Sender" color={C.s} />
          <ModuleBox x={400} y={20} w={90} h={42} label="Receiver" color={C.r} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={310} y={80} w={170} h={36} label="x = 6" sub="비밀키 (로컬)" color={C.r} outlined />
              <ActionBox x={310} y={125} w={170} h={36} label="y = g^x mod p" color={C.r} />
              <DataBox x={310} y={170} w={170} h={32} label="y = 8" color={C.pub} outlined />

              <DataBox x={20} y={80} w={170} h={50} label="공개 파라미터" sub="p=23, g=5, y=8" color={C.pub} outlined />
              <text x={105} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                publish (p, g, y)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={80} w={150} h={36} label="m = 7" sub="원문" color={C.s} outlined />
              <DataBox x={20} y={125} w={150} h={36} label="k = 3" sub="일회용 랜덤" color={C.s} outlined />

              <ActionBox x={185} y={80} w={150} h={36} label="c₁ = g^k mod p" color={C.s} />
              <ActionBox x={185} y={125} w={150} h={36} label="s = y^k mod p" color={C.s} />
              <ActionBox x={185} y={170} w={150} h={36} label="c₂ = m·s mod p" color={C.s} />

              <DataBox x={350} y={80} w={130} h={36} label="c₁ = 10" color={C.ct} outlined />
              <DataBox x={350} y={125} w={130} h={36} label="s = 6" color={C.k} outlined />
              <DataBox x={350} y={170} w={130} h={36} label="c₂ = 19" color={C.ct} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={75} w={170} h={36} label="c₁ = 10" color={C.ct} outlined />
              <DataBox x={20} y={120} w={170} h={36} label="c₂ = 19" color={C.ct} outlined />

              <motion.line x1={195} y1={91} x2={400} y2={42} stroke={C.s} strokeWidth={1.5}
                markerEnd="url(#eg-arr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
              <motion.line x1={195} y1={138} x2={400} y2={42} stroke={C.s} strokeWidth={1.5}
                markerEnd="url(#eg-arr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />

              <AlertBox x={130} y={170} w={240} h={42} label="Eavesdropper" sub="s 복원에 x 또는 k 필요 (DLP)" color={C.bad} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={75} w={140} h={36} label="c₁, c₂" color={C.ct} outlined />
              <DataBox x={20} y={120} w={140} h={36} label="x = 6" sub="비밀키" color={C.r} outlined />

              <ActionBox x={180} y={75} w={150} h={36} label="s = c₁^x mod p" color={C.r} />
              <ActionBox x={180} y={120} w={150} h={36} label="s⁻¹ = modpow(s,-1)" color={C.r} />
              <ActionBox x={180} y={165} w={150} h={36} label="m = c₂·s⁻¹ mod p" color={C.r} />

              <DataBox x={345} y={75} w={140} h={36} label="s = 6" color={C.k} outlined />
              <DataBox x={345} y={120} w={140} h={36} label="s⁻¹ = 4" color={C.k} outlined />
              <StatusBox x={345} y={165} w={140} h={36} label="m = 7 ✓" sub=" " color={C.r} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
