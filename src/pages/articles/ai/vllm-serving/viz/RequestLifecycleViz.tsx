import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };
const STAGES = [
  { label: 'HTTP', x: 10, color: '#6366f1' },
  { label: 'Tokenize', x: 65, color: '#3b82f6' },
  { label: 'Scheduler', x: 125, color: '#10b981' },
  { label: 'Prefill', x: 185, color: '#f59e0b' },
  { label: 'Decode', x: 240, color: '#8b5cf6' },
  { label: 'SSE 스트림', x: 300, color: '#ef4444' },
];
const SY = 40, SW = 48;
const TOKENS = ['안', '녕', '하', '세', '요'];
const STEPS = [
  { label: '요청 수신 (HTTP)' },
  { label: '토크나이징' },
  { label: '스케줄링' },
  { label: 'Prefill (프롬프트 처리)' },
  { label: 'Decode → SSE 스트리밍' },
];
const BODY = [
  'OpenAI 호환 요청 수신',
  '텍스트 → 토큰 ID 시퀀스 변환',
  'waiting→running 배치 결정',
  '프롬프트 일괄 처리 → KV 캐시 생성',
  '자기회귀 생성 → 실시간 스트리밍',
];

export default function RequestLifecycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {STAGES.map((s, i) => {
            const active = i <= step, current = i === step || (step === 4 && i >= 4);
            return (
              <motion.g key={s.label} animate={{ opacity: active ? 1 : 0.25 }} transition={sp}>
                <rect x={s.x} y={SY} width={SW} height={24} rx={4}
                  fill={current ? `${s.color}20` : `${s.color}08`}
                  stroke={s.color} strokeWidth={current ? 2 : 0.8} />
                <text x={s.x + SW / 2} y={SY + 14} textAnchor="middle" fontSize={7.5}
                  fill={s.color} fontWeight={current ? 700 : 400}>{s.label}</text>
                {i < STAGES.length - 1 && (
                  <text x={s.x + SW + 3} y={SY + 15} fontSize={10}
                    fill="var(--muted-foreground)" fillOpacity={active ? 0.6 : 0.2}>→</text>
                )}
              </motion.g>
            );
          })}
          <motion.circle r={5} animate={{ cx: STAGES[Math.min(step, 5)].x + SW / 2, cy: SY - 8 }}
            transition={sp} fill="#6366f140" stroke="#6366f1" strokeWidth={1.5} />
          <motion.text animate={{ x: STAGES[Math.min(step, 5)].x + SW / 2, y: SY - 5 }}
            transition={sp} textAnchor="middle" fontSize={9} fill="#6366f1" fontWeight={600}>req</motion.text>
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={190} y={72} width={46} height={14} rx={3} fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1} />
              <text x={213} y={82} textAnchor="middle" fontSize={9} fill="#f59e0b">KV Cache</text>
              <line x1={213} y1={64} x2={213} y2={72} stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="2 2" />
            </motion.g>
          )}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <path d="M264,64 L264,75 L149,75 L149,64" fill="none"
                stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arrowGrn)" />
              <text x={206} y={83} textAnchor="middle" fontSize={9} fill="#10b981">다음 iter</text>
              {TOKENS.map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.12 }}>
                  <rect x={300 + i * 12} y={92} width={10} height={12} rx={2}
                    fill="#ef444420" stroke="#ef4444" strokeWidth={0.8} />
                  <text x={305 + i * 12} y={101} textAnchor="middle" fontSize={9} fill="#ef4444">{t}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step <= 1 && (
            <motion.text x={35} y={82} fontSize={9} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              "오늘 날씨 어때?" → [1045, 2387, 891, 42]
            </motion.text>
          )}
          <defs>
            <marker id="arrowGrn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#10b981" />
            </marker>
          </defs>
          {/* inline body */}
          <motion.text x={370} y={52} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
