import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const PROCS = [
  { label: 'API Server', sub: 'FastAPI + Tokenizer', color: '#6366f1', x: 10 },
  { label: 'ZeroMQ IPC', sub: '비동기 메시지', color: '#f59e0b', x: 100 },
  { label: 'EngineCore', sub: 'Scheduler + KV Mgr', color: '#10b981', x: 190 },
  { label: 'GPU Worker', sub: 'FlashAttention', color: '#8b5cf6', x: 280 },
];
const BW = 76, BH = 50, CY = 50;

const STEPS = [
  { label: 'API Server — 요청 수신' },
  { label: 'ZeroMQ IPC — 비동기 전송' },
  { label: 'EngineCore — 스케줄링' },
  { label: 'GPU Worker — 모델 실행' },
  { label: '응답 반환 (역방향)' },
];
const BODY = [
  'FastAPI → Tokenizer 토큰화',
  'ZeroMQ로 비동기 메시지 전달',
  'Prefill/Decode 배치 + KV 블록 할당',
  'FlashAttention + CUDA Graphs',
  'Detokenizer → API → 클라이언트 스트림',
];

export default function VLLMProcessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const fwd = step <= 3;
        const idx = fwd ? step : 3;
        return (
          <svg viewBox="0 0 490 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {PROCS.map((p, i) => {
              const active = fwd ? step === i : step === 4;
              const done = fwd ? step > i : true;
              const op = active ? 1 : done ? 0.5 : 0.2;
              return (
                <g key={p.label}>
                  <motion.rect x={p.x} y={CY - BH / 2} width={BW} height={BH} rx={5}
                    animate={{ fill: `${p.color}${active ? '22' : '0c'}`, stroke: p.color,
                      strokeWidth: active ? 2 : 1, opacity: op }}
                    transition={{ duration: 0.3 }} />
                  <text x={p.x + BW / 2} y={CY - 4} textAnchor="middle" fontSize={7.5}
                    fontWeight={600} fill={active ? p.color : 'var(--foreground)'} opacity={op}>
                    {p.label}
                  </text>
                  <text x={p.x + BW / 2} y={CY + 8} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)" opacity={op * 0.7}>{p.sub}</text>
                  {i < PROCS.length - 1 && (
                    <line x1={p.x + BW + 2} y1={CY} x2={PROCS[i+1].x - 2} y2={CY}
                      stroke="var(--border)" strokeWidth={1} opacity={done ? 0.5 : 0.15} />
                  )}
                </g>
              );
            })}
            {/* Forward packet */}
            {fwd && (
              <motion.circle r={6}
                animate={{ cx: PROCS[idx].x + BW / 2, cy: CY - BH / 2 - 10 }}
                transition={{ type: 'spring', bounce: 0.2 }}
                fill={PROCS[idx].color}
                style={{ filter: `drop-shadow(0 0 4px ${PROCS[idx].color}88)` }} />
            )}
            {/* Reverse arrow */}
            {step === 4 && (
              <motion.path
                d={`M ${PROCS[3].x + BW / 2} ${CY + BH / 2 + 8} L ${PROCS[0].x + BW / 2} ${CY + BH / 2 + 8}`}
                fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }} />
            )}
            {step === 4 && (
              <motion.circle r={5}
                initial={{ cx: PROCS[3].x + BW / 2, cy: CY + BH / 2 + 8 }}
                animate={{ cx: PROCS[0].x + BW / 2, cy: CY + BH / 2 + 8 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                fill="#10b981" style={{ filter: 'drop-shadow(0 0 3px #10b98188)' }} />
            )}
            {step === 4 && (
              <motion.text x={185} y={CY + BH / 2 + 20} textAnchor="middle" fontSize={9}
                fill="#10b981" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                ← 응답 스트리밍
              </motion.text>
            )}
            {/* inline body */}
            <motion.text x={380} y={55} fontSize={9}
              fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
              key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
