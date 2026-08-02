import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';

export type StepDef = string | { label: string; body?: ReactNode };

interface Props {
  steps: StepDef[];
  children: (step: number) => ReactNode;
  headerClassName?: string;
  stageClassName?: string;
}

export default function StepViz({
  steps,
  children,
  headerClassName = '',
  stageClassName = '',
}: Props) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const cur = steps[step];
  const label = typeof cur === 'string' ? cur : cur.label;
  const body = typeof cur === 'string' ? undefined : cur.body;

  useEffect(() => {
    if (!playing || steps.length < 2) return undefined;
    const timer = window.setTimeout(() => {
      setStep((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [playing, step, steps.length]);

  const selectStep = (next: number) => {
    setPlaying(false);
    setStep(next);
  };

  return (
    <div className="step-viz not-prose my-10 max-w-full scroll-mt-20 overflow-hidden rounded-lg border border-border/70 bg-card" data-step-viz>
      <div className={`step-viz__header grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] border-b border-border/60 ${headerClassName}`}>
        <div className="step-viz__index flex min-h-[6.5rem] flex-col items-center justify-center border-r border-border/60">
          <span className="font-mono text-xs font-bold uppercase text-muted-foreground">Scene</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={step}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-1 font-mono text-2xl font-black tabular-nums"
            >
              {String(step + 1).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={`text-${step}`}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="min-w-0 px-4 py-4 pr-4 sm:px-5 sm:pr-20"
            data-step-viz-narrative>
            <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
              {step + 1} / {steps.length}
            </div>
            <p className="min-w-0 text-[15px] font-bold leading-snug text-foreground break-words [overflow-wrap:anywhere] sm:text-base">{label}</p>
            {body && (
              <p className="mt-2 min-w-0 text-sm leading-relaxed text-muted-foreground whitespace-pre-line break-words [overflow-wrap:anywhere]">
                {body}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="step-viz__progress flex min-w-0 flex-wrap items-stretch gap-1 border-b border-border/60 px-3 py-2 sm:px-4">
        {steps.map((_, i) => {
          const active = i === step;
          const complete = i < step;
          return (
            <button
              key={i}
              type="button"
              onClick={() => selectStep(i)}
              aria-label={`step ${i + 1}`}
              aria-current={active ? 'step' : undefined}
              className="group flex min-h-11 min-w-11 flex-1 basis-11 items-center py-1"
            >
              <span className={`block h-1 w-full rounded-full transition-all duration-300 ${active || complete ? 'step-viz__progress-fill' : 'bg-border/80 group-hover:bg-muted-foreground/35'}`} />
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, scale: 0.992 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.992 }}
          transition={{ duration: 0.24 }}
          className={`step-viz__stage flex min-h-[190px] w-full items-center overflow-hidden px-3 py-4 sm:min-h-[360px] sm:px-5 sm:py-7 ${stageClassName}`}
          data-step-viz-stage>
          <div className="step-viz-canvas" data-viz-canvas>
            {children(step)}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="step-viz__controls flex items-center justify-between gap-3 border-t border-border/60 bg-card px-3 py-3 sm:px-4">
        <button onClick={() => selectStep(Math.max(0, step - 1))} disabled={step === 0}
          title="이전 장면" aria-label="이전 장면"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-35">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => { setPlaying(false); setStep(0); }} disabled={step === 0 && !playing}
            title="처음부터" aria-label="처음부터"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-35">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              if (step === steps.length - 1) setStep(0);
              setPlaying((current) => !current);
            }}
            title={playing ? '일시 정지' : '장면 재생'}
            aria-label={playing ? '일시 정지' : '장면 재생'}
            aria-pressed={playing}
            className="step-viz__play inline-flex h-11 w-11 items-center justify-center rounded-md text-white transition-transform hover:scale-[1.03]"
          >
            {playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="ml-0.5 h-3.5 w-3.5" aria-hidden="true" />}
          </button>
        </div>
        <button onClick={() => selectStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1}
          title="다음 장면" aria-label="다음 장면"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-35">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
