import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const SUBS = [
  { label: 'Explore', color: '#10b981', x: 50, y: 62 },
  { label: 'Plan', color: '#6366f1', x: 155, y: 62 },
  { label: 'General', color: '#f59e0b', x: 260, y: 62 },
];
const ROOT = { x: 155, y: 14, w: 64, h: 30, color: '#3b82f6' };

const STEPS = [
  { label: '루트 에이전트 — 작업 수신' },
  { label: '서브에이전트 생성 (spawn)' },
  { label: '독립 작업 수행' },
  { label: '결과 병합 & 응답' },
];
const BODY = [
  '복합 요청을 수신·분석',
  'Task Tool로 병렬 생성',
  '각자 도구 세트로 독립 수행',
  '결과 수집 → 최종 응답 조합',
];

export default function SubAgentTreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* root agent */}
          <motion.rect x={ROOT.x} y={ROOT.y} width={ROOT.w} height={ROOT.h} rx={5}
            animate={{ fill: `${ROOT.color}${step === 0 ? '22' : '12'}`,
              stroke: ROOT.color, strokeWidth: step === 0 || step === 3 ? 2 : 1 }} />
          <text x={ROOT.x + ROOT.w / 2} y={ROOT.y + 18} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={ROOT.color}>Root Agent</text>
          {/* branch lines + sub-agents */}
          {SUBS.map((s, i) => {
            const show = step >= 1;
            const working = step === 2;
            const done = step === 3;
            return (
              <g key={s.label}>
                {show && (
                  <motion.line x1={ROOT.x + ROOT.w / 2} y1={ROOT.y + ROOT.h}
                    x2={s.x + 30} y2={s.y} stroke={s.color} strokeWidth={1.2}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ delay: i * 0.1 }} />
                )}
                <motion.rect x={s.x} y={s.y} width={60} height={30} rx={5}
                  animate={{ fill: `${s.color}${working ? '25' : show ? '12' : '06'}`,
                    stroke: s.color, strokeWidth: working ? 2 : show ? 1 : 0.5,
                    opacity: show ? 1 : 0.15 }}
                  transition={{ duration: 0.3, delay: show ? i * 0.1 : 0 }} />
                <text x={s.x + 30} y={s.y + 18} textAnchor="middle" fontSize={7.5}
                  fontWeight={600} fill={s.color} opacity={show ? 1 : 0.2}>{s.label}</text>
                {/* working indicator */}
                {working && (
                  <motion.circle cx={s.x + 52} cy={s.y + 8} r={3}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    fill={s.color} />
                )}
                {/* result arrow up */}
                {done && (
                  <motion.line x1={s.x + 30} y1={s.y} x2={ROOT.x + ROOT.w / 2} y2={ROOT.y + ROOT.h}
                    stroke={s.color} strokeWidth={1.5} strokeDasharray="3 2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.12 }} />
                )}
              </g>
            );
          })}
          {/* merge label */}
          {step === 3 && (
            <motion.text x={185} y={108} textAnchor="middle" fontSize={9} fill="#3b82f6"
              fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              결과 병합 → 최종 응답
            </motion.text>
          )}
          <motion.text x={380} y={60} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
