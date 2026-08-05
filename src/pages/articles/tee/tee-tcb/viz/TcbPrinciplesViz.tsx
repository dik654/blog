import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  sep: '#6366f1',
  surf: '#f59e0b',
  least: '#10b981',
  depth: '#ec4899',
  formal: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: '1. Privilege Separation: 권한 분리',
    body: 'Enclave에는 minimal 코드만 둡니다. 권한 있는 작업과 일반 로직을 분리하여 trust boundary를 좁힙니다.',
  },
  {
    label: '2. Attack Surface Reduction: 인터페이스 축소',
    body: 'ECALL/OCALL 인터페이스를 제한하고 모든 입력을 검증합니다. 경계가 좁을수록 검증·감사 가능성이 높아집니다.',
  },
  {
    label: '3. Least Authority: 필요한 권한만',
    body: 'Capability 기반 설계로 enclave에 꼭 필요한 권한만 부여합니다. 침해 시 피해 범위를 제한합니다.',
  },
  {
    label: '4. Defense in Depth: 다층 방어',
    body: 'Hardware + Firmware + SW 여러 계층의 방어선. 한 층이 뚫려도 나머지가 보호합니다.',
  },
  {
    label: '5. Formal Verification: 정형 검증',
    body: 'Coq/Isabelle로 수학적 증명. seL4가 대표 사례. TCB가 작아야만 검증이 가능하므로 1번 원칙과 결합됩니다.',
  },
];

function PrincipleSep() {
  return (
    <g>
      <ModuleBox x={20} y={30} w={150} h={56} label="기존 시스템" sub="권한·일반 로직 혼재" color={C.surf} />
      <ActionBox x={195} y={30} w={70} h={56} label="분리" sub="separate" color={C.sep} />
      <ModuleBox x={290} y={12} w={170} h={36} label="Trusted (Enclave)" sub="권한 있는 minimal 코드" color={C.sep} />
      <ModuleBox x={290} y={66} w={170} h={36} label="Untrusted (App)" sub="대부분의 비즈니스 로직" color={C.muted} />
      <motion.path d="M170 58 L195 58" stroke={C.sep} strokeWidth={1.2}
        markerEnd="url(#arrSep)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      <motion.path d="M265 58 L290 30" stroke={C.sep} strokeWidth={1.2}
        markerEnd="url(#arrSep)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
      <motion.path d="M265 58 L290 84" stroke={C.muted} strokeWidth={1.2}
        markerEnd="url(#arrMuted)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
      <defs>
        <marker id="arrSep" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill={C.sep} /></marker>
        <marker id="arrMuted" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill={C.muted} /></marker>
      </defs>
    </g>
  );
}

function PrincipleSurface() {
  const items = [
    { label: 'ECALL: 정의된 함수만', delay: 0.1 },
    { label: 'OCALL: whitelist만', delay: 0.2 },
    { label: '입력 size·범위 검증', delay: 0.3 },
    { label: 'Pointer dereference 금지', delay: 0.4 },
  ];
  return (
    <g>
      <rect x={20} y={20} width={140} height={100} rx={6} fill={`${C.surf}10`} stroke={C.surf} strokeWidth={1.2} />
      <text x={90} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.surf}>Enclave</text>
      <rect x={50} y={50} width={80} height={50} rx={4} fill={`${C.surf}25`} stroke={C.surf} strokeWidth={0.8} />
      <text x={90} y={78} textAnchor="middle" fontSize={9} fill={C.surf}>Trusted Code</text>
      <text x={90} y={113} textAnchor="middle" fontSize={8} fill={C.muted}>좁은 경계</text>
      {items.map((it, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: it.delay }}>
          <rect x={195} y={26 + i * 22} width={250} height={18} rx={3}
            fill={`${C.surf}12`} stroke={`${C.surf}50`} strokeWidth={0.6} />
          <text x={205} y={38 + i * 22} fontSize={9} fill={C.surf} fontWeight={500}>{it.label}</text>
        </motion.g>
      ))}
    </g>
  );
}

function PrincipleLeast() {
  const caps = ['read:keys', 'write:log', 'sign:req'];
  return (
    <g>
      <DataBox x={20} y={30} w={130} h={28} label="Enclave Process" color={C.least} />
      <text x={170} y={48} fontSize={10} fontWeight={600} fill={C.muted}>capabilities:</text>
      {caps.map((c, i) => (
        <motion.g key={c} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}>
          <rect x={250 + i * 70} y={32} width={62} height={22} rx={11}
            fill={`${C.least}15`} stroke={C.least} strokeWidth={0.8} />
          <text x={281 + i * 70} y={47} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={C.least}>{c}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <AlertBox x={20} y={80} w={440} h={36} label="X 권한 없음: net, fs:write, exec, ptrace ..." color="#ef4444" sub="capability list 외 모든 동작 거부" />
      </motion.g>
    </g>
  );
}

function PrincipleDepth() {
  const layers = [
    { label: 'Application logic', color: C.muted, w: 360 },
    { label: 'SW: ECALL/OCALL validation', color: C.depth, w: 320 },
    { label: 'FW: SGX microcode / SEAM', color: C.formal, w: 280 },
    { label: 'HW: CPU enclave engine', color: C.least, w: 240 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        다층 방어 (Defense in Depth)
      </text>
      {layers.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={(480 - l.w) / 2} y={26 + i * 24} width={l.w} height={20} rx={4}
            fill={`${l.color}22`} stroke={l.color} strokeWidth={1} />
          <text x={240} y={40 + i * 24} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={l.color}>
            {l.label}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

function PrincipleFormal() {
  return (
    <g>
      <DataBox x={30} y={26} w={120} h={32} label="Source code" sub="C / Haskell" color={C.formal} />
      <ActionBox x={170} y={26} w={100} h={32} label="Coq / Isabelle" sub="proof system" color={C.formal} />
      <DataBox x={290} y={26} w={160} h={32} label="Math proof" sub="bug-free guarantee" color={C.least} />
      <motion.path d="M150 42 L170 42" stroke={C.formal} strokeWidth={1.2}
        markerEnd="url(#arrFormal)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
      <motion.path d="M270 42 L290 42" stroke={C.formal} strokeWidth={1.2}
        markerEnd="url(#arrFormal)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={30} y={80} width={420} height={32} rx={4}
          fill={`${C.least}10`} stroke={C.least} strokeWidth={0.8} />
        <text x={45} y={95} fontSize={10} fontWeight={700} fill={C.least}>seL4: 10K LOC fully verified</text>
        <text x={45} y={107} fontSize={8.5} fill={C.muted}>"TCB가 작아야 검증 가능" — 1번 원칙과 직결</text>
      </motion.g>
      <defs>
        <marker id="arrFormal" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill={C.formal} /></marker>
      </defs>
    </g>
  );
}

export default function TcbPrinciplesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <PrincipleSep />}
          {step === 1 && <PrincipleSurface />}
          {step === 2 && <PrincipleLeast />}
          {step === 3 && <PrincipleDepth />}
          {step === 4 && <PrincipleFormal />}
        </svg>
      )}
    </StepViz>
  );
}
