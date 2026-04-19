import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  app: '#0ea5e9',
  enclave: '#10b981',
  cpu: '#ef4444',
  marshal: '#f59e0b',
  edl: '#8b5cf6',
  inOnly: '#6366f1',
  outOnly: '#ec4899',
  inOut: '#14b8a6',
  unsafe: '#ef4444',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'ECALL: Untrusted → Enclave (6 steps)',
    body: 'App ecall_foo → Edger8r marshal → sgx_ecall(eid, idx, ms) → uRTS trampoline → EENTER → CPU mode switch → enclave entry.',
  },
  {
    label: 'Enclave 측: 검증 후 ECALL 실행',
    body: 'sgx_entry()(tRTS) → ecall_table 확인 → 매개변수 검증(in-enclave) → do_ecall(idx, ms) → 실제 함수 호출 → return copy back → EEXIT.',
  },
  {
    label: 'OCALL: Enclave → Untrusted',
    body: 'Enclave가 printf/fopen 호출 → ocall_context 저장 → EEXIT → App에서 OCALL 분기 → 호출 → ERESUME → enclave state 복원.',
  },
  {
    label: 'EDL Definition Language',
    body: 'enclave { trusted { public int ecall_add([in] int* a, [in,out] int* b); }; untrusted { void ocall_print([in,string] const char* str); }; };',
  },
  {
    label: 'Parameter Marshaling 4종',
    body: '[in] copy in (untrusted→trusted), [out] copy out, [in,out] 양방향, [user_check] 검증 안 함(위험). 사용자 포인터 직접 역참조 금지.',
  },
];

interface CallStep { side: 'app' | 'cpu' | 'enclave'; label: string; sub?: string; color: string; }

const ECALL_OUT: CallStep[] = [
  { side: 'app', label: '1. ecall_foo(eid, ...)', sub: 'app code', color: C.app },
  { side: 'app', label: '2. Marshal params', sub: 'Edger8r wrapper', color: C.marshal },
  { side: 'app', label: '3. sgx_ecall(...)', sub: 'uRTS', color: C.app },
  { side: 'app', label: '4. trampoline', sub: 'uRTS', color: C.app },
  { side: 'cpu', label: '5. EENTER', sub: 'CPU instruction', color: C.cpu },
  { side: 'cpu', label: '6. enclave mode', sub: 'TCS load + entry', color: C.cpu },
];

const ECALL_IN: CallStep[] = [
  { side: 'enclave', label: '7. sgx_entry()', sub: 'tRTS', color: C.enclave },
  { side: 'enclave', label: '8. verify ecall', sub: 'ecall_table check', color: C.enclave },
  { side: 'enclave', label: '9. validate params', sub: 'in-enclave check', color: C.marshal },
  { side: 'enclave', label: '10. do_ecall(idx, ms)', sub: 'tRTS dispatch', color: C.enclave },
  { side: 'enclave', label: '11. ECALL function', sub: 'user code', color: C.enclave },
  { side: 'cpu', label: '12. EEXIT', sub: 'return to app', color: C.cpu },
];

function CallFlow({ steps, title, color, foot }: { steps: CallStep[]; title: string; color: string; foot?: string }) {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{title}</text>
      {steps.map((s, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 18 + col * 230;
        const y = 22 + row * 28;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}>
            <rect x={x} y={y} width={222} height={24} rx={3}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={0.6} />
            <text x={x + 8} y={y + 12} fontSize={9} fontFamily="monospace" fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            {s.sub && (
              <text x={x + 8} y={y + 21} fontSize={7.5} fill={C.muted}>{s.sub}</text>
            )}
          </motion.g>
        );
      })}
      {foot && (
        <motion.text x={240} y={130} textAnchor="middle" fontSize={9} fill={C.muted}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          {foot}
        </motion.text>
      )}
    </g>
  );
}

function OcallFlow() {
  const arrows = [
    { from: 'enclave', to: 'app', label: '1. ocall_print()', y: 32 },
    { from: 'enclave', to: 'app', label: '2. save ocall_context', y: 50 },
    { from: 'enclave', to: 'app', label: '3. EEXIT', y: 68 },
    { from: 'app', to: 'enclave', label: '4. App: dispatch + execute', y: 86 },
    { from: 'app', to: 'enclave', label: '5. ERESUME → restore state', y: 104 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.enclave}>
        OCALL — Enclave → Untrusted
      </text>
      <rect x={20} y={24} width={120} height={96} rx={6}
        fill={`${C.enclave}10`} stroke={C.enclave} strokeWidth={1} />
      <text x={80} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.enclave}>Enclave</text>
      <text x={80} y={84} textAnchor="middle" fontSize={8} fill={C.muted}>(trusted)</text>

      <rect x={340} y={24} width={120} height={96} rx={6}
        fill={`${C.app}10`} stroke={C.app} strokeWidth={1} />
      <text x={400} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.app}>App</text>
      <text x={400} y={84} textAnchor="middle" fontSize={8} fill={C.muted}>(untrusted)</text>

      {arrows.map((a, i) => {
        const fromX = a.from === 'enclave' ? 140 : 340;
        const toX = a.from === 'enclave' ? 340 : 140;
        const color = a.from === 'enclave' ? C.enclave : C.app;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15 }}>
            <line x1={fromX} y1={a.y} x2={toX} y2={a.y}
              stroke={color} strokeWidth={1.2} strokeDasharray="3 2"
              markerEnd={a.from === 'enclave' ? 'url(#arrEn)' : 'url(#arrAp)'} />
            <text x={240} y={a.y - 2} textAnchor="middle" fontSize={8.5}
              fontWeight={600} fill={color}>{a.label}</text>
          </motion.g>
        );
      })}
      <defs>
        <marker id="arrEn" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill={C.enclave} /></marker>
        <marker id="arrAp" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill={C.app} /></marker>
      </defs>
    </g>
  );
}

function EdlExample() {
  const lines = [
    { l: 'enclave {', c: C.edl },
    { l: '    trusted {', c: C.enclave },
    { l: '        public int ecall_add(', c: C.enclave },
    { l: '            [in] int* a,', c: C.inOnly },
    { l: '            [in, out] int* b', c: C.inOut },
    { l: '        );', c: C.enclave },
    { l: '    };', c: C.enclave },
    { l: '    untrusted {', c: C.app },
    { l: '        void ocall_print([in, string] const char* str);', c: C.app },
    { l: '    };', c: C.app },
    { l: '};', c: C.edl },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.edl}>
        EDL — Enclave Definition Language
      </text>
      {lines.map((ln, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}>
          <text x={30} y={32 + i * 11} fontSize={8.5} fontFamily="monospace"
            fontWeight={500} fill={ln.c}>{ln.l}</text>
        </motion.g>
      ))}
    </g>
  );
}

const MARSHALS = [
  { name: '[in]', dir: 'untrusted → trusted', desc: 'copy in to enclave', color: C.inOnly },
  { name: '[out]', dir: 'trusted → untrusted', desc: 'copy out from enclave', color: C.outOnly },
  { name: '[in, out]', dir: '양방향', desc: 'copy in + copy back', color: C.inOut },
  { name: '[user_check]', dir: '검증 X', desc: '직접 역참조 (위험)', color: C.unsafe },
];

function MarshalingTable() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        Parameter Marshaling — 4종
      </text>
      {MARSHALS.map((m, i) => {
        const y = 28 + i * 24;
        return (
          <motion.g key={m.name} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={20} y={y} width={440} height={20} rx={3}
              fill={`${m.color}10`} stroke={m.color} strokeWidth={0.7} />
            <text x={30} y={y + 13} fontSize={9.5} fontFamily="monospace" fontWeight={700} fill={m.color}>
              {m.name}
            </text>
            <text x={140} y={y + 13} fontSize={9} fontWeight={600} fill="var(--foreground)">{m.dir}</text>
            <text x={290} y={y + 13} fontSize={9} fill={C.muted}>{m.desc}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={124} width={440} height={16} rx={3}
          fill={`${C.unsafe}10`} stroke={C.unsafe} strokeWidth={0.7} strokeDasharray="3 2" />
        <text x={240} y={135} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.unsafe}>
          ! 사용자 포인터는 enclave 안에서 직접 역참조 금지
        </text>
      </motion.g>
    </g>
  );
}

export default function EcallOcallFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <CallFlow steps={ECALL_OUT} title="ECALL Outbound — App → Enclave" color={C.app}
            foot="Total latency: ~8,000 cycles (EENTER + EEXIT)" />}
          {step === 1 && <CallFlow steps={ECALL_IN} title="Enclave 측 — 검증 + 실행 + 종료" color={C.enclave} />}
          {step === 2 && <OcallFlow />}
          {step === 3 && <EdlExample />}
          {step === 4 && <MarshalingTable />}
        </svg>
      )}
    </StepViz>
  );
}
