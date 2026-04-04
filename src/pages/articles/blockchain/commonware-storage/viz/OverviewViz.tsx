import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const C = { ssd: '#6366f1', persist: '#10b981', ctx: '#f59e0b' };

interface Props { onOpenCode?: (key: string) => void }

export default function OverviewViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 460 140" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {step === 0 && <SsdStep />}
            {step === 1 && <PersistableStep />}
            {step === 2 && <ContextStep />}
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

function SsdStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={20} y={30} width={120} height={50} rx={6} fill={`${C.ssd}15`} stroke={C.ssd} strokeWidth={1.2} />
      <text x={80} y={50} textAnchor="middle" fontSize={10} fill={C.ssd} fontWeight={600}>Sequential Write</text>
      <text x={80} y={65} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">append-only, 순차 I/O</text>
      <rect x={180} y={30} width={120} height={50} rx={6} fill="#ef444415" stroke="#ef4444" strokeWidth={1.2} strokeDasharray="4 2" />
      <text x={240} y={50} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight={600}>Random Write</text>
      <text x={240} y={65} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">리밸런싱, WAF 높음</text>
      <line x1={142} y1={55} x2={178} y2={55} stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="3 2" />
      <text x={160} y={52} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">vs</text>
      <text x={350} y={50} fontSize={10} fill="var(--muted-foreground)">SSD 쓰기 증폭 최소화</text>
      <text x={350} y={65} fontSize={10} fill="var(--muted-foreground)">GC 불필요 (비활성 마킹)</text>
    </motion.g>
  );
}

function PersistableStep() {
  const boxes = [
    { label: 'commit', desc: '→ 페이지 캐시', x: 30, c: C.persist },
    { label: 'sync', desc: '→ SSD (fsync)', x: 175, c: C.ssd },
    { label: 'destroy', desc: '→ 해제', x: 320, c: '#ef4444' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={35} width={110} height={45} rx={6} fill={`${b.c}15`} stroke={b.c} strokeWidth={1.2} />
          <text x={b.x + 55} y={53} textAnchor="middle" fontSize={10} fill={b.c} fontWeight={600}>{b.label}()</text>
          <text x={b.x + 55} y={68} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{b.desc}</text>
          {i < 2 && <line x1={b.x + 112} y1={57} x2={b.x + 140} y2={57} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#ov-arw)" />}
        </g>
      ))}
      <text x={230} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">모든 프리미티브(MMR, QMDB, Archive)가 구현</text>
      <defs><marker id="ov-arw" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" /></marker></defs>
    </motion.g>
  );
}

function ContextStep() {
  const traits = [
    { label: 'Storage', desc: '파일 I/O', c: C.ssd },
    { label: 'Clock', desc: '시간 (교체 가능)', c: C.persist },
    { label: 'Metrics', desc: '관측', c: C.ctx },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={140} y={10} width={180} height={30} rx={6} fill={`${C.ctx}15`} stroke={C.ctx} strokeWidth={1.2} />
      <text x={230} y={30} textAnchor="middle" fontSize={10} fill={C.ctx} fontWeight={600}>Context</text>
      {traits.map((t, i) => (
        <g key={i}>
          <line x1={230} y1={40} x2={80 + i * 150} y2={70} stroke={t.c} strokeWidth={0.8} opacity={0.5} />
          <rect x={30 + i * 150} y={70} width={100} height={40} rx={6} fill={`${t.c}12`} stroke={t.c} strokeWidth={1} />
          <text x={80 + i * 150} y={87} textAnchor="middle" fontSize={10} fill={t.c} fontWeight={600}>{t.label}</text>
          <text x={80 + i * 150} y={101} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{t.desc}</text>
        </g>
      ))}
    </motion.g>
  );
}
