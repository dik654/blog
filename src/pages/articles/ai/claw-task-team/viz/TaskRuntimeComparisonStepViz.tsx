import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { clawViz, comparisonAccent } from '../../claw-viz-tokens';

const AXES = [
  ['작업 명세', 'TaskPacket의 Goal / Constraint / Acceptance', 'LocalAgentTask 중심, 자연어 task 비중 큼'],
  ['실행 클래스', 'Task / Team / Worker registry', 'LocalAgent, LocalShell, RemoteAgent, InProcessTeammate'],
  ['스케줄링', 'Cron / PolicyEngine과 결합', 'multi-session lock, missed recovery, jitter, durable cron'],
  ['협업 UI', '구조화 상태 전이 중심', 'swarm, mailbox, pane backend, coordinator'],
] as const;

export default function TaskRuntimeComparisonStepViz() {
  return (
    <StepViz steps={AXES.map(([axis, claw, original]) => ({
      label: axis,
      body: `claw: ${claw}\n원본: ${original}`,
    }))}>
      {(step) => {
        const [axis, claw, original] = AXES[step];
        const color = comparisonAccent(step);
        return (
          <svg viewBox="0 0 390 280" className="w-full h-auto" style={{ maxWidth: 720, width: '100%' }}>
            <text x={195} y={24} textAnchor="middle" fontSize={12} fontWeight={700} fill={clawViz.text}>
              TaskPacket과 원본 task runtime 비교
            </text>
            <rect x={30} y={52} width={330} height={36} rx={6} fill={clawViz.panelAlt} fillOpacity={0.38} stroke={color} strokeOpacity={0.55} />
            <line x1={48} y1={87} x2={342} y2={87} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
            <text x={195} y={75} textAnchor="middle" fontSize={14} fontWeight={800} fill={color}>{axis}</text>

            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
              <rect x={32} y={124} width={142} height={94} rx={6} fill={clawViz.panel} stroke={clawViz.border} />
              <line x1={44} y1={138} x2={82} y2={138} stroke={clawViz.claw} strokeWidth={2} strokeLinecap="round" />
              <text x={103} y={150} textAnchor="middle" fontSize={11} fontWeight={800} fill={clawViz.claw}>claw-code</text>
              <foreignObject x={44} y={160} width={118} height={50}>
                <div className="flex h-full items-center justify-center text-center text-[10px] font-semibold leading-snug text-foreground">{claw}</div>
              </foreignObject>
            </motion.g>

            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, delay: 0.08 }}>
              <rect x={216} y={124} width={142} height={94} rx={6} fill={clawViz.panel} stroke={clawViz.border} />
              <line x1={228} y1={138} x2={266} y2={138} stroke={clawViz.original} strokeWidth={2} strokeLinecap="round" />
              <text x={287} y={150} textAnchor="middle" fontSize={11} fontWeight={800} fill={clawViz.original}>원본 Claude Code</text>
              <foreignObject x={228} y={160} width={118} height={50}>
                <div className="flex h-full items-center justify-center text-center text-[10px] font-semibold leading-snug text-foreground">{original}</div>
              </foreignObject>
            </motion.g>

            <line x1={174} y1={172} x2={216} y2={172} stroke={color} strokeWidth={1.4} strokeDasharray="4 3" />
            <foreignObject x={34} y={238} width={322} height={34}>
              <div className="flex h-full items-center justify-center text-center text-[9px] font-medium leading-snug text-muted-foreground">
                claw는 작업 명세를 강하게 구조화하고, 원본은 장기 실행 runtime과 운영 UI를 깊게 만든다.
              </div>
            </foreignObject>
          </svg>
        );
      }}
    </StepViz>
  );
}
