import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  state: '#6366f1',
  alloc: '#0ea5e9',
  key: '#10b981',
  init: '#f59e0b',
  done: '#8b5cf6',
  err: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'tee_cryp_state — algo · mode · state · ctx · 소유 session 보관' },
  { label: 'Operation lifecycle — Allocated → KeySet → Initialized → Completed' },
  { label: '잘못된 순서 — TEE_ERROR_BAD_STATE 반환' },
  { label: 'Syscall 계층 — utee → syscall → tee_svc_cryp → backend' },
  { label: 'TA-TA 격리 — 세션마다 독립 state, 종료 시 모든 op 해제' },
];

const STRUCT = [
  { f: 'algo', t: 'uint32_t', d: 'Algorithm ID (TEE_ALG_AES_CBC...)', color: C.alloc },
  { f: 'mode', t: 'uint32_t', d: 'ENCRYPT / DECRYPT / MAC / DIGEST...', color: C.alloc },
  { f: 'state', t: 'uint32_t', d: 'state machine 현재 위치', color: C.state },
  { f: 'ctx', t: 'void *', d: 'Algorithm-specific 컨텍스트 (heap)', color: C.init },
  { f: 'session', t: 'tee_ta_session_t *', d: '소유 TA session — 격리 키', color: C.done },
];

const STATES = [
  { id: 'Allocated', x: 60, y: 90, color: C.alloc },
  { id: 'KeySet', x: 170, y: 90, color: C.key },
  { id: 'Initialized', x: 280, y: 90, color: C.init },
  { id: 'InProgress', x: 400, y: 60, color: C.init },
  { id: 'Completed', x: 400, y: 130, color: C.done },
];

export default function CrypStateLifecycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            tee_svc_cryp.c — Crypto operation 상태 머신
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.state}>
                struct tee_cryp_state
              </text>
              {STRUCT.map((s, i) => (
                <motion.g key={s.f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={30} y={52 + i * 28} width={420} height={24} rx={4}
                    fill={`${s.color}10`} stroke={`${s.color}45`} strokeWidth={0.6} />
                  <text x={42} y={68 + i * 28} fontSize={9} fontWeight={700} fontFamily="monospace" fill={s.color}>{s.f}</text>
                  <text x={100} y={68 + i * 28} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">{s.t}</text>
                  <text x={210} y={68 + i * 28} fontSize={8.5} fill="var(--muted-foreground)">{s.d}</text>
                </motion.g>
              ))}
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.state}>
                Operation 상태 전이
              </text>
              {STATES.map((s, i) => (
                <motion.g key={s.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }}>
                  <rect x={s.x - 50} y={s.y - 14} width={100} height={26} rx={5}
                    fill={`${s.color}15`} stroke={s.color} strokeWidth={1} />
                  <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={s.color}>{s.id}</text>
                </motion.g>
              ))}
              {[
                { fx: 110, fy: 90, tx: 120, ty: 90, lbl: 'SetKey', c: C.key },
                { fx: 220, fy: 90, tx: 230, ty: 90, lbl: 'Init', c: C.init },
                { fx: 330, fy: 90, tx: 350, ty: 65, lbl: 'Update', c: C.init },
                { fx: 350, fy: 75, tx: 330, ty: 90, lbl: 'loop', c: C.init },
                { fx: 330, fy: 90, tx: 350, ty: 130, lbl: 'DoFinal', c: C.done },
              ].map((e, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.6 + i * 0.1 }}>
                  <line x1={e.fx} y1={e.fy} x2={e.tx} y2={e.ty} stroke={e.c} strokeWidth={1} markerEnd="url(#arr-cs)" />
                  <text x={(e.fx + e.tx) / 2} y={(e.fy + e.ty) / 2 - 4} textAnchor="middle" fontSize={7.5} fill={e.c} fontWeight={600}>{e.lbl}</text>
                </motion.g>
              ))}
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Update 호출은 stream 데이터에 사용 (CipherUpdate, DigestUpdate)
              </text>
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.err}>
                상태 전이 검증 — 잘못된 순서는 거부
              </text>
              {[
                { ok: false, line: 'Allocate → DoFinal     ✗  no key + no init', c: C.err },
                { ok: false, line: 'Allocate → SetKey → DoFinal  ✗  no init', c: C.err },
                { ok: false, line: 'SetKey → SetKey         ✗  re-key after init', c: C.err },
                { ok: true, line: 'Allocate → SetKey → Init → DoFinal  ✓', c: C.done },
                { ok: true, line: 'Allocate → SetKey → Init → Update* → DoFinal  ✓', c: C.done },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={52 + i * 26} width={420} height={22} rx={4}
                    fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={42} y={67 + i * 26} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <AlertBox x={130} y={190} w={220} h={26} label="잘못된 호출 → TEE_ERROR_BAD_STATE" color={C.err} />
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.alloc}>
                Syscall 계층 (TA → kernel → backend)
              </text>
              {[
                { layer: 'libutee', call: 'utee_cryp_obj_alloc()', desc: 'TA 측 wrapper', c: C.alloc, x: 30 },
                { layer: 'syscall', call: 'syscall_cryp_obj_alloc()', desc: 'syscall trampoline', c: C.init, x: 30 },
                { layer: 'tee_svc_cryp', call: 'cryp_state 생성/관리', desc: '권한·격리 검사', c: C.state, x: 30 },
                { layer: 'crypto backend', call: 'mbedtls or HW (CAAM)', desc: '실제 알고리즘', c: C.done, x: 30 },
              ].map((b, i) => (
                <motion.g key={b.layer} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={b.x} y={56 + i * 32} width={420} height={28} rx={5}
                    fill={`${b.c}10`} stroke={`${b.c}45`} strokeWidth={0.7} />
                  <rect x={b.x} y={56 + i * 32} width={3.5} height={28} rx={1} fill={b.c} />
                  <text x={b.x + 12} y={73 + i * 32} fontSize={9.5} fontWeight={700} fill={b.c}>{b.layer}</text>
                  <text x={b.x + 90} y={73 + i * 32} fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">{b.call}</text>
                  <text x={b.x + 280} y={73 + i * 32} fontSize={8.5} fill="var(--muted-foreground)">{b.desc}</text>
                </motion.g>
              ))}
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.done}>
                TA-TA 격리 (per-session state)
              </text>
              <ActionBox x={30} y={56} w={130} h={36} label="TA #1 session" sub="ops: AES, RSA" color={C.alloc} />
              <ActionBox x={170} y={56} w={130} h={36} label="TA #2 session" sub="ops: SHA, HMAC" color={C.init} />
              <ActionBox x={310} y={56} w={140} h={36} label="TA #3 session" sub="ops: ECDSA" color={C.done} />
              {[
                '✓ 각 TA 세션마다 독립 cryp_state 리스트',
                '✓ 다른 TA의 operation handle 접근 불가',
                '✓ TA 종료 시 자체 ops 자동 해제 (cleanup)',
                '✓ Key 객체도 세션 scope (storage 명시 시 persistent)',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.1 }}
                  x={36} y={120 + i * 18} fontSize={8.5} fill={C.done} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
          <defs>
            <marker id="arr-cs" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={C.init} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
