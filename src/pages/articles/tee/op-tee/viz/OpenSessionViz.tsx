import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'UUID로 TA 컨텍스트 초기화 (이미 로드 시 재사용)',
  '파라미터 타입 검증 (TEEC_PARAM_TYPE 비트필드)',
  'busy 잠금 획득 → open_session() 호출',
  '세션 구조체 반환 (id, clnt_id, ctx)',
];

const C = { init: '#6366f1', check: '#f59e0b', open: '#10b981' };

export default function OpenSessionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Flow boxes */}
          {[
            { label: 'tee_ta_init_session', desc: 'UUID → TA ctx', c: C.init, s: 0 },
            { label: 'check_params', desc: 'PARAM_TYPE 검증', c: C.check, s: 1 },
            { label: 'try_set_busy → open', desc: '잠금 + 세션 열기', c: C.open, s: 2 },
            { label: 'tee_ta_session', desc: '{id, clnt_id, ctx}', c: C.init, s: 3 },
          ].map((b, i) => {
            const active = i === step;
            const done = i < step;
            const x = 30 + i * 125;
            return (
              <g key={b.label}>
                {i > 0 && (
                  <motion.line x1={x - 5} y1={70} x2={x} y2={70}
                    stroke={done || active ? b.c : 'var(--border)'} strokeWidth={1.2}
                    markerEnd="url(#arr)" animate={{ opacity: done || active ? 1 : 0.2 }} />
                )}
                <motion.rect x={x} y={45} width={115} height={50} rx={6}
                  fill={active ? `${b.c}14` : `${b.c}05`}
                  stroke={active ? b.c : `${b.c}30`} strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: active ? 1 : done ? 0.5 : 0.2 }} />
                <text x={x + 8} y={64} fontSize={10} fontWeight={600} fill={b.c}>{b.label}</text>
                <text x={x + 8} y={80} fontSize={10} fill="var(--muted-foreground)">{b.desc}</text>
              </g>
            );
          })}

          {/* Error path */}
          <motion.rect x={175} y={115} width={120} height={28} rx={5}
            fill="#f59e0b08" stroke={step === 1 ? '#f59e0b' : '#f59e0b30'} strokeWidth={0.8}
            animate={{ opacity: step === 1 ? 0.9 : 0.15 }} />
          <text x={195} y={133} fontSize={10} fill="#f59e0b">BAD_PARAMETERS</text>
          <motion.line x1={220} y1={95} x2={220} y2={115}
            stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="3,3"
            animate={{ opacity: step === 1 ? 0.8 : 0.1 }} />

          {/* Busy fail path */}
          <motion.rect x={325} y={115} width={100} height={28} rx={5}
            fill="#f59e0b08" stroke={step === 2 ? '#f59e0b' : '#f59e0b30'} strokeWidth={0.8}
            animate={{ opacity: step === 2 ? 0.9 : 0.15 }} />
          <text x={340} y={133} fontSize={10} fill="#f59e0b">TEE_ERROR_BUSY</text>
          <motion.line x1={345} y1={95} x2={345} y2={115}
            stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="3,3"
            animate={{ opacity: step === 2 ? 0.8 : 0.1 }} />

          <text x={270} y={165} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            tee_ta_open_session() 흐름
          </text>

          <defs>
            <marker id="arr" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
