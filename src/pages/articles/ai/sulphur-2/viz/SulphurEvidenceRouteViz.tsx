import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Braces,
  GitBranch,
  Microscope,
  Scale,
  type LucideIcon,
} from 'lucide-react';
import StepViz, { type StepDef } from '@/components/ui/step-viz';

type RouteStep = {
  label: string;
  short: string;
  owner: string;
  keep: string;
  reject: string;
  icon: LucideIcon;
  color: string;
};

const route: RouteStep[] = [
  {
    label: '공식 카드 snapshot을 먼저 고정한다',
    short: 'Owner card',
    owner: 'SulphurAI가 직접 작성한 model card · checked 2026-07-31',
    keep: 'LTX-2.3 기반, task claim, package guidance, official inference pending',
    reject: 'Hugging Face 자동 integration snippet을 owner workflow로 승격',
    icon: BadgeCheck,
    color: '#2563eb',
  },
  {
    label: '상속 구조는 versioned upstream에서 읽는다',
    short: 'LTX upstream',
    owner: 'Lightricks/LTX-2 repository와 LTX-2.3 documentation revision',
    keep: 'Checkpoint, VAE, text encoder, upscaler, guider와 pipeline contract',
    reject: '상속한 dual-stream·runtime을 Sulphur 고유 발명으로 집계',
    icon: GitBranch,
    color: '#0f766e',
  },
  {
    label: '실제 실행 package를 manifest로 잠근다',
    short: 'Artifact manifest',
    owner: '실험자가 내려받아 hash를 기록한 derivative·adapter·enhancer file',
    keep: 'Full model 또는 대안 LoRA, distill artifact, GGUF·MMPROJ, load order',
    reject: 'Full-model path와 대안 LoRA path를 동시에 적용하거나 filename만 기록',
    icon: Braces,
    color: '#7c3aed',
  },
  {
    label: '같은 조건으로 upstream과 파생물을 짝지어 비교한다',
    short: 'Paired run',
    owner: 'Versioned community graph와 local run receipt',
    keep: 'Prompt, seed, input, frame·FPS, VAE, upscaler, guider, precision 고정',
    reject: 'Enhancer·workflow까지 바꾸고 차이를 checkpoint 성능으로 귀속',
    icon: Microscope,
    color: '#b7791f',
  },
  {
    label: '증거 상한보다 낮은 claim만 공개한다',
    short: 'Claim ceiling',
    owner: 'Card fact · inherited contract · local observation을 분리한 claim ledger',
    keep: '해당 manifest에서 관찰한 delta와 아직 unknown인 training 범위',
    reject: 'Local result를 official benchmark나 공개되지 않은 training recipe로 일반화',
    icon: Scale,
    color: '#b42318',
  },
];

const steps: StepDef[] = route.map((item, index) => ({
  label: `${index + 1}. ${item.label}`,
  body: index === 0
    ? '실행법보다 먼저 누가 직접 작성한 문장인지 고정한다. 같은 페이지의 자동 생성 안내도 증거 owner가 다를 수 있다.'
    : index === 4
      ? '관측한 결과보다 넓은 주장을 만들지 않는다. 새 official workflow가 나오면 같은 manifest로 다시 검증한다.'
      : '앞 단계에서 고정한 owner와 version을 잃지 않은 채 다음 evidence layer로 이동한다.',
}));

function EvidenceRouteScene({ step }: { step: number }) {
  const active = route[step];
  return (
    <div className="grid w-full min-w-0 lg:grid-cols-[minmax(15rem,0.82fr)_minmax(0,1.18fr)]" data-sulphur-evidence-route data-step={step}>
      <ol className="min-w-0 divide-y divide-border border-y border-border lg:border-r lg:border-y-0">
        {route.map((item, index) => {
          const Icon = item.icon;
          const selected = index === step;
          const complete = index < step;
          return (
            <li
              key={item.short}
              className={`relative min-w-0 px-3 py-3.5 sm:px-4 ${selected ? 'bg-muted/25' : ''}`}
              data-route-status={selected ? 'active' : complete ? 'complete' : 'waiting'}
            >
              <motion.div
                animate={{ opacity: index <= step ? 1 : 0.48, x: selected ? 3 : 0 }}
                className="flex min-w-0 items-center gap-3"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background"
                  style={{ borderColor: selected || complete ? item.color : undefined }}
                >
                  <Icon className="h-4 w-4" style={{ color: selected || complete ? item.color : undefined }} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-bold tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="block break-words text-xs font-bold leading-5">{item.short}</span>
                </span>
              </motion.div>
              {selected ? (
                <motion.span
                  layoutId="sulphur-route-marker"
                  className="absolute inset-y-2 left-0 w-0.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <motion.div
        key={active.short}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="min-w-0 px-4 py-5 sm:px-6 sm:py-6"
      >
        <p className="text-[10px] font-bold uppercase text-muted-foreground">Evidence owner</p>
        <p className="mt-2 break-words text-sm font-semibold leading-6">{active.owner}</p>
        <div className="mt-6 grid min-w-0 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="min-w-0 bg-background px-4 py-4">
            <p className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">보존할 결론</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{active.keep}</p>
          </div>
          <div className="min-w-0 bg-background px-4 py-4">
            <p className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-300">넘지 않을 상한</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{active.reject}</p>
          </div>
        </div>
        <p className="mt-5 border-t border-dashed border-border pt-4 text-xs leading-5 text-muted-foreground">
          다음 단계로 갈 때 owner, revision, file hash와 아직 unknown인 칸을 함께 넘긴다.
        </p>
      </motion.div>
    </div>
  );
}

export default function SulphurEvidenceRouteViz() {
  return (
    <StepViz
      steps={steps}
      stageClassName="sm:min-h-[390px]"
    >
      {(step) => <EvidenceRouteScene step={step} />}
    </StepViz>
  );
}
