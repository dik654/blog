import { useState } from 'react';
import { ArrowDown, Check, CircleAlert, Gauge, Route } from 'lucide-react';
import { InternalLink } from '@/components/learning/ArticleLearning';

type Support = 'separated' | 'overlap';
type Sampling = 'one-forward' | 'iterative';

const supportOptions: Array<{ value: Support; label: string; detail: string }> = [
  { value: 'separated', label: 'Support가 떨어짐', detail: 'D(fake) 0.02 · 생성 mode 1/4' },
  { value: 'overlap', label: '일부 겹침', detail: '판별 신호는 남음 · 생성 mode 1/4' },
];

const samplingOptions: Array<{ value: Sampling; label: string; detail: string }> = [
  { value: 'one-forward', label: '한 번의 forward 필요', detail: '생성 지연을 가장 먼저 지킨다.' },
  { value: 'iterative', label: '반복 sampling 허용', detail: '안정성과 coverage 실험을 우선한다.' },
];

export default function SignalContractLab() {
  const [support, setSupport] = useState<Support>('separated');
  const [sampling, setSampling] = useState<Sampling>('iterative');
  const separated = support === 'separated';
  const iterative = sampling === 'iterative';

  const diagnosis = separated
    ? '두 실패를 분리한다. Minimax G의 logit gradient가 약한 문제와, 1/4 mode만 덮는 coverage 붕괴는 같은 증상이 아니다.'
    : '판별 경계의 신호는 남아 있다. 그래도 sharp sample 하나로 1/4 coverage를 정당화할 수는 없다.';
  const repair = separated
    ? '먼저 non-saturating G objective로 포화 구간을 벗긴다. 같은 data order에서 WGAN-GP branch를 비교하되 precision·recall을 따로 기록한다.'
    : 'D/G update ratio와 gradient norm을 확인한다. 고정 latent grid와 precision·recall로 mode가 실제로 늘었는지 검증한다.';
  const target = iterative
    ? '알려진 noise를 정답으로 쓰는 denoising objective를 별도 baseline으로 연다.'
    : '움직이는 critic을 쓰는 GAN branch를 유지하되, critic과 coverage evidence를 release 조건으로 둔다.';
  const cost = iterative
    ? '학습 신호는 고정되지만 생성 시 denoiser를 여러 번 평가한다. 실제 step 수와 지연은 runtime에서 측정해야 한다.'
    : '샘플은 G 한 번으로 만들 수 있지만 두 모델의 capacity·regularization·update 비율을 함께 운영해야 한다.';
  const decision = iterative
    ? 'Diffusion을 자동 승자로 정하지 않는다. 같은 조건에서 coverage, fidelity, 조건 일치와 end-to-end latency를 비교한다.'
    : '한 번의 생성 경로를 지키면서 GAN의 신호와 coverage를 먼저 복구한다. 실패하면 제품 지연 예산부터 다시 협상한다.';

  return (
    <div
      data-gan-signal-lab
      className="not-prose my-8 scroll-mt-20 overflow-hidden rounded-md border border-border bg-background"
    >
      <div className="border-b border-border bg-muted/20 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold">학습 신호에서 다음 생성 계약까지</p>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              아래 값은 원리를 확인하는 교육용 상태다. 모델 품질이나 속도 benchmark가 아니다.
            </p>
          </div>
          <span className="rounded-sm border border-border bg-background px-2 py-1 text-[11px] font-semibold text-muted-foreground">
            teaching fixture
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <fieldset className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <legend className="text-xs font-bold text-muted-foreground">1. 현재 분포 관계</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {supportOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={support === option.value}
                onClick={() => setSupport(option.value)}
                className={`min-h-14 min-w-0 rounded-md border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  support === option.value
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background hover:bg-muted/35'
                }`}
              >
                <span className="block text-xs font-bold">{option.label}</span>
                <span className={`mt-1 block text-[11px] leading-relaxed ${
                  support === option.value ? 'text-background/75' : 'text-muted-foreground'
                }`}>
                  {option.detail}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0">
          <legend className="text-xs font-bold text-muted-foreground">2. 제품의 sampling 제약</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {samplingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={sampling === option.value}
                onClick={() => setSampling(option.value)}
                className={`min-h-14 min-w-0 rounded-md border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  sampling === option.value
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background hover:bg-muted/35'
                }`}
              >
                <span className="block text-xs font-bold">{option.label}</span>
                <span className={`mt-1 block text-[11px] leading-relaxed ${
                  sampling === option.value ? 'text-background/75' : 'text-muted-foreground'
                }`}>
                  {option.detail}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="divide-y divide-border border-t border-border">
        {[
          { number: '01', icon: CircleAlert, label: '진단', value: diagnosis, attr: 'data-gan-diagnosis' },
          { number: '02', icon: Check, label: '안전한 첫 조치', value: repair, attr: 'data-gan-repair' },
          { number: '03', icon: Route, label: '비교할 신호 계약', value: target, attr: 'data-gan-target' },
          { number: '04', icon: Gauge, label: '치르는 비용', value: cost, attr: 'data-gan-cost' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.number} className="grid min-w-0 gap-3 px-4 py-4 sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)] sm:px-6">
              <span className="font-mono text-sm font-bold text-muted-foreground">{item.number}</span>
              <p className="flex items-center gap-2 text-xs font-bold">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {item.label}
              </p>
              <p {...{ [item.attr]: true }} className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div
        data-gan-decision={iterative ? 'compare-diffusion' : 'repair-gan'}
        aria-live="polite"
        className="border-t border-border bg-muted/15 px-4 py-5 sm:px-6"
      >
        <p className="text-xs font-bold text-muted-foreground">현재 판단</p>
        <p className="mt-2 text-sm font-semibold leading-relaxed">{decision}</p>
        <div className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <ArrowDown className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            {iterative ? (
              <>
                다음은 <InternalLink slug="diffusion-models">Diffusion의 고정 noise target과 reverse sampling</InternalLink>이다.
              </>
            ) : (
              <>
                먼저 <InternalLink slug="generative-theory">생성 모델의 네 가지 분포 학습 계약</InternalLink>에서
                one-pass 제약과 평가 기준을 다시 고른다.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
