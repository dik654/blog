import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'check_client: 호출자 신원 검증 (화이트리스트/로그인 정책)',
  'try_set_busy: 동시 접근 잠금 획득',
  'enter → invoke_cmd → leave: 명령 실행 사이클',
  'TA에서 수신: TA_InvokeCommandEntryPoint(ctx, cmd, params)',
];

const C = { auth: '#6366f1', lock: '#f59e0b', exec: '#10b981' };

export default function InvokeCommandViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Pipeline */}
          {[
            { label: 'check_client', desc: '신원 검증', c: C.auth, s: 0 },
            { label: 'try_set_busy', desc: '잠금 획득', c: C.lock, s: 1 },
            { label: 'enter_invoke', desc: '진입 후크', c: C.exec, s: 2 },
            { label: 'invoke_cmd', desc: '명령 실행', c: C.exec, s: 2 },
            { label: 'leave_invoke', desc: '정리 + 해제', c: C.exec, s: 2 },
          ].map((b, i) => {
            const active = step === b.s;
            const done = step > b.s;
            const x = 20 + i * 102;
            return (
              <g key={i}>
                {i > 0 && (
                  <motion.line x1={x - 4} y1={55} x2={x} y2={55}
                    stroke={done || active ? b.c : 'var(--border)'} strokeWidth={1}
                    animate={{ opacity: done || active ? 0.8 : 0.2 }} />
                )}
                <motion.rect x={x} y={30} width={96} height={50} rx={6}
                  fill={active ? `${b.c}14` : `${b.c}05`}
                  stroke={active ? b.c : `${b.c}30`} strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: active ? 1 : done ? 0.5 : 0.2 }} />
                <text x={x + 8} y={50} fontSize={10} fontWeight={600} fill={b.c}>{b.label}</text>
                <text x={x + 8} y={66} fontSize={10} fill="var(--muted-foreground)">{b.desc}</text>
              </g>
            );
          })}

          {/* TA callback */}
          <motion.rect x={150} y={100} width={240} height={32} rx={6}
            fill={step === 3 ? `${C.exec}14` : `${C.exec}05`}
            stroke={step === 3 ? C.exec : `${C.exec}30`} strokeWidth={step === 3 ? 1.5 : 1}
            animate={{ opacity: step === 3 ? 1 : 0.15 }} />
          <text x={170} y={120} fontSize={10} fontWeight={600}
            fill={step === 3 ? C.exec : 'var(--muted-foreground)'}>
            TA_InvokeCommandEntryPoint(ctx, cmd, params)
          </text>
          <motion.line x1={270} y1={80} x2={270} y2={100}
            stroke={C.exec} strokeWidth={1} strokeDasharray="3,3"
            animate={{ opacity: step >= 2 ? 0.7 : 0.1 }} />

          <text x={270} y={150} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            파라미터: MEMREF(공유 메모리) / VALUE(32-bit 쌍) / NONE
          </text>
        </svg>
      )}
    </StepViz>
  );
}
