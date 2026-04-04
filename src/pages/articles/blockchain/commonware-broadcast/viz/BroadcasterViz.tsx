import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './BroadcasterVizData';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

interface Props { onOpenCode?: (key: string) => void }

export default function BroadcasterViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {step === 0 && <TraitStep />}
            {step === 1 && <EngineStep />}
            {step === 2 && <MailboxStep />}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}

function TraitStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={120} y={20} width={240} height={50} rx={6} fill="var(--card)" />
      <rect x={120} y={20} width={240} height={50} rx={6} fill={`${C1}10`} stroke={C1} strokeWidth={1} />
      <text x={240} y={42} textAnchor="middle" fontSize={11} fontWeight={600} fill={C1}>Broadcaster</text>
      <text x={240} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">trait — Clone + Send + &apos;static</text>
      {['Recipients', 'Message: Codec', 'Response'].map((t, i) => (
        <g key={i}>
          <rect x={60 + i * 130} y={90} width={110} height={30} rx={4} fill="var(--card)" />
          <rect x={60 + i * 130} y={90} width={110} height={30} rx={4}
            fill={`${[C1, C2, C3][i]}08`} stroke={[C1, C2, C3][i]} strokeWidth={0.6} />
          <text x={115 + i * 130} y={109} textAnchor="middle" fontSize={10} fill={[C1, C2, C3][i]}>{t}</text>
        </g>
      ))}
      <text x={240} y={145} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        broadcast() → oneshot::Receiver&lt;Response&gt;
      </text>
    </motion.g>
  );
}

function EngineStep() {
  const boxes = [
    { label: 'items', sub: 'BTreeMap', c: C1, x: 30 },
    { label: 'deques', sub: 'per-peer LRU', c: C2, x: 170 },
    { label: 'counts', sub: 'refcount', c: C3, x: 310 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Engine 캐시 구조</text>
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={30} width={130} height={44} rx={5} fill="var(--card)" />
          <rect x={b.x} y={30} width={130} height={44} rx={5} fill={`${b.c}10`} stroke={b.c} strokeWidth={0.8} />
          <text x={b.x + 65} y={50} textAnchor="middle" fontSize={10} fontWeight={500} fill={b.c}>{b.label}</text>
          <text x={b.x + 65} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{b.sub}</text>
        </g>
      ))}
      <rect x={60} y={95} width={360} height={30} rx={4} fill="var(--card)" />
      <rect x={60} y={95} width={360} height={30} rx={4} fill={`${C2}08`} stroke={C2} strokeWidth={0.6} />
      <text x={240} y={114} textAnchor="middle" fontSize={10} fill={C2}>select_loop! — Mailbox + Network + PeerSet 동시 처리</text>
    </motion.g>
  );
}

function MailboxStep() {
  const msgs = ['Broadcast', 'Subscribe', 'Get'];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Mailbox → Engine</text>
      {msgs.map((m, i) => (
        <g key={i}>
          <rect x={40 + i * 140} y={30} width={120} height={36} rx={5} fill="var(--card)" />
          <rect x={40 + i * 140} y={30} width={120} height={36} rx={5}
            fill={`${[C1, C2, C3][i]}10`} stroke={[C1, C2, C3][i]} strokeWidth={0.8} />
          <text x={100 + i * 140} y={52} textAnchor="middle" fontSize={10} fontWeight={500} fill={[C1, C2, C3][i]}>{m}</text>
        </g>
      ))}
      <rect x={120} y={90} width={240} height={30} rx={4} fill="var(--card)" />
      <rect x={120} y={90} width={240} height={30} rx={4} fill={`${C1}08`} stroke={C1} strokeWidth={0.6} />
      <text x={240} y={109} textAnchor="middle" fontSize={10} fill={C1}>impl Broadcaster for Mailbox</text>
      <text x={240} y={140} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        소비자는 Broadcaster trait만 의존 — 구현 교체 가능
      </text>
    </motion.g>
  );
}
