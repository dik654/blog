import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { clawViz, comparisonAccent } from '../../claw-viz-tokens';

const AXES = [
  ['도구 실행', 'PreToolUse / PostToolUse', 'PostToolUseFailure까지 포함해 성공/실패 분기'],
  ['세션 lifecycle', '없음', 'SessionStart / End / Setup / Stop'],
  ['컴팩션', '없음', 'PreCompact / PostCompact로 요약 지시와 표시 메시지 mutate'],
  ['파일 변화', '없음', 'FileChanged watcher와 worktree create/remove'],
  ['transport', 'shell command only', 'shell + agent LLM + HTTP webhook + prompt inject'],
] as const;

export default function HookEventScopeStepViz() {
  return (
    <StepViz steps={AXES.map(([axis, claw, original]) => ({
      label: axis,
      body: `claw: ${claw}\n원본: ${original}`,
    }))}>
      {(step) => {
        const [axis, claw, original] = AXES[step];
        const color = step === 4 ? clawViz.danger : comparisonAccent(step);
        return (
          <svg viewBox="0 0 390 280" className="w-full h-auto" style={{ maxWidth: 720, width: '100%' }}>
            <text x={195} y={24} textAnchor="middle" fontSize={12} fontWeight={700} fill={clawViz.text}>
              이벤트 범위가 커지면 훅의 역할도 바뀐다
            </text>
            <rect x={30} y={52} width={330} height={36} rx={6} fill={clawViz.panelAlt} fillOpacity={0.38} stroke={color} strokeOpacity={0.55} />
            <line x1={48} y1={87} x2={342} y2={87} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
            <text x={195} y={75} textAnchor="middle" fontSize={14} fontWeight={800} fill={color}>{axis}</text>
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
              <rect x={32} y={124} width={142} height={94} rx={6} fill={clawViz.panel} stroke={clawViz.border} />
              <line x1={44} y1={138} x2={82} y2={138} stroke={clawViz.claw} strokeWidth={2} strokeLinecap="round" />
              <text x={103} y={150} textAnchor="middle" fontSize={11} fontWeight={800} fill={clawViz.claw}>claw-code</text>
              <foreignObject x={44} y={164} width={118} height={42}>
                <div className="flex h-full items-center justify-center text-center text-[10px] font-semibold leading-snug text-foreground">{claw}</div>
              </foreignObject>
            </motion.g>
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, delay: 0.08 }}>
              <rect x={216} y={124} width={142} height={94} rx={6} fill={clawViz.panel} stroke={clawViz.border} />
              <line x1={228} y1={138} x2={266} y2={138} stroke={clawViz.original} strokeWidth={2} strokeLinecap="round" />
              <text x={287} y={150} textAnchor="middle" fontSize={11} fontWeight={800} fill={clawViz.original}>원본 Claude Code</text>
              <foreignObject x={228} y={164} width={118} height={42}>
                <div className="flex h-full items-center justify-center text-center text-[10px] font-semibold leading-snug text-foreground">{original}</div>
              </foreignObject>
            </motion.g>
            <line x1={174} y1={172} x2={216} y2={172} stroke={color} strokeWidth={1.4} strokeDasharray="4 3" />
            <foreignObject x={34} y={238} width={322} height={34}>
              <div className="flex h-full items-center justify-center text-center text-[9px] font-medium leading-snug text-muted-foreground">
                hook이 도구 주변 callback에서 운영 event bus로 커지는 지점을 축별로 확인한다.
              </div>
            </foreignObject>
          </svg>
        );
      }}
    </StepViz>
  );
}
