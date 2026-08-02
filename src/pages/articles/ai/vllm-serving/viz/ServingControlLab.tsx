import { useMemo, useState } from 'react';
import { ArrowRight, Database, Gauge, TimerReset, TriangleAlert } from 'lucide-react';

type Workload = 'interactive' | 'mixed' | 'batch';
type PromptShape = 'short' | 'long';
type Headroom = 'healthy' | 'tight';

const buttonBase = 'min-h-11 min-w-0 rounded-md border px-3 py-2 text-left text-sm transition-colors';

function Choice<T extends string>({
  label,
  value,
  active,
  detail,
  wide = false,
  onClick,
}: {
  label: string;
  value: T;
  active: boolean;
  detail: string;
  wide?: boolean;
  onClick: (value: T) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onClick(value)}
      className={`${buttonBase} ${wide ? 'sm:col-span-2' : ''} ${active
        ? 'border-blue-600/45 bg-blue-500/[0.07] text-foreground'
        : 'border-border text-muted-foreground hover:border-foreground/30'}`}
    >
      <span className="block font-bold">{label}</span>
      <span className="mt-1 block text-xs leading-snug">{detail}</span>
    </button>
  );
}

function Toggle({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`${buttonBase} flex items-center justify-between gap-3 ${checked
        ? 'border-teal-600/45 bg-teal-500/[0.06] text-foreground'
        : 'border-border text-muted-foreground hover:border-foreground/30'}`}
    >
      <span className="min-w-0">
        <span className="block font-bold">{label}</span>
        <span className="mt-1 block text-xs leading-snug">{detail}</span>
      </span>
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${checked
          ? 'border-teal-700 bg-teal-600'
          : 'border-border bg-muted'}`}
      >
        <span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </span>
    </button>
  );
}

export default function ServingControlLab() {
  const [workload, setWorkload] = useState<Workload>('mixed');
  const [promptShape, setPromptShape] = useState<PromptShape>('long');
  const [headroom, setHeadroom] = useState<Headroom>('healthy');
  const [chunkedPrefill, setChunkedPrefill] = useState(true);
  const [repeatedPrefix, setRepeatedPrefix] = useState(true);

  const result = useMemo(() => {
    const promptTokens = promptShape === 'long' ? 6144 : 256;
    const concurrency = workload === 'interactive' ? 32 : workload === 'mixed' ? 64 : 96;
    const freeBlocks = headroom === 'healthy' ? 128 : 8;
    const reusableTokens = repeatedPrefix ? Math.round(promptTokens * 0.5) : 0;
    const newPrefillTokens = promptTokens - reusableTokens;
    const prefillChunk = chunkedPrefill ? Math.min(896, newPrefillTokens) : newPrefillTokens;

    let ttft = promptShape === 'long' ? (chunkedPrefill ? 690 : 1260) : 330;
    let tpot = promptShape === 'long' && !chunkedPrefill ? 61 : 42;
    if (repeatedPrefix) ttft -= promptShape === 'long' ? 170 : 35;
    if (headroom === 'tight') {
      ttft += 280;
      tpot += 12;
    }
    if (workload === 'mixed') {
      ttft += 70;
      tpot += 4;
    } else if (workload === 'batch') {
      ttft += 90;
      tpot += 4;
    }

    let throughput = workload === 'batch' ? 1110 : workload === 'mixed' ? 920 : 730;
    if (promptShape === 'long' && !chunkedPrefill) throughput += 95;
    if (repeatedPrefix) throughput += 80;
    if (headroom === 'tight') throughput -= 330;

    const preemptionRisk = headroom === 'tight'
      ? (promptShape === 'long' ? '높음 · free pool 고갈 시 recompute preemption' : '중간 · 새 decode block을 계속 감시')
      : '낮음 · 그래도 free-block 추세를 계측';
    const interactivePass = ttft <= 800 && tpot <= 50;
    const batchPass = throughput >= 950 && headroom === 'healthy';
    const mixedPass = interactivePass && batchPass;
    const passed = workload === 'interactive'
      ? interactivePass
      : workload === 'mixed'
        ? mixedPass
        : batchPass;
    const firstBottleneck = headroom === 'tight'
      ? 'KV admission'
      : promptShape === 'long' && !chunkedPrefill
        ? '긴 prefill의 step 독점'
        : workload === 'interactive'
          ? 'queue → prefill 경로'
          : workload === 'mixed'
            ? 'decode 우선 뒤 남는 step budget'
            : 'GPU token throughput';

    const plan = chunkedPrefill
      ? workload === 'mixed'
        ? `진행 중 decode 320 token 우선 → 남은 budget을 신규 prompt와 반복 batch의 prefill ${prefillChunk.toLocaleString()} token에 분배`
        : `decode 320 token 우선 → 남은 budget으로 prefill ${prefillChunk.toLocaleString()} token`
      : workload === 'mixed'
        ? `진행 중 decode와 prefill ${newPrefillTokens.toLocaleString()} token이 한 step budget을 두고 경합`
        : `prefill ${newPrefillTokens.toLocaleString()} token을 한 덩어리로 요청`;

    return {
      promptTokens,
      concurrency,
      freeBlocks,
      reusableTokens,
      newPrefillTokens,
      prefillChunk,
      ttft,
      tpot,
      throughput,
      preemptionRisk,
      passed,
      firstBottleneck,
      primaryMetric: workload === 'interactive'
        ? 'p95 TTFT ≤ 800 ms + p95 TPOT ≤ 50 ms를 만족한 goodput'
        : workload === 'mixed'
          ? '대화 p95 TTFT ≤ 800 ms · TPOT ≤ 50 ms와 batch throughput ≥ 950 token/s를 모두 만족'
          : '같은 품질 조건의 total token throughput ≥ 950 token/s',
      plan,
      nextOwner: headroom === 'tight'
        ? 'PagedAttention · free block과 refcount 장부'
        : promptShape === 'long'
          ? 'Scheduler · token budget과 chunked prefill'
          : '운영 benchmark · 같은 workload 재현',
    };
  }, [chunkedPrefill, headroom, promptShape, repeatedPrefix, workload]);

  return (
    <div
      data-vllm-runtime-viz
      data-serving-control-lab
      className="my-8 w-full min-w-0 scroll-mt-20 overflow-hidden rounded-md border border-border bg-background"
    >
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-black text-foreground">서빙 판단 실험실</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              수치는 원리를 비교하기 위한 교육용 fixture이며 vLLM benchmark가 아니다.
            </p>
          </div>
          <span className="rounded-sm border border-border px-2 py-1 font-mono text-xs font-bold text-muted-foreground">
            v0.26.0 semantics
          </span>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-5">
          <fieldset className="min-w-0">
            <legend className="mb-2 text-xs font-bold text-muted-foreground">1 · 같은 GPU에 도착한 workload를 고른다</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <Choice label="혼재" value="mixed" active={workload === 'mixed'} detail="decode 중 대화 + 새 prompt + 반복 batch" wide onClick={setWorkload} />
              <Choice label="대화형 단독" value="interactive" active={workload === 'interactive'} detail="동시 32 요청 · latency SLO" onClick={setWorkload} />
              <Choice label="배치 단독" value="batch" active={workload === 'batch'} detail="동시 96 요청 · throughput" onClick={setWorkload} />
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-2 text-xs font-bold text-muted-foreground">2 · 입력과 KV 여유를 고른다</legend>
            <div className="grid grid-cols-2 gap-2">
              <Choice label="256-token prompt" value="short" active={promptShape === 'short'} detail="짧은 질의" onClick={setPromptShape} />
              <Choice label="6,144-token prompt" value="long" active={promptShape === 'long'} detail="긴 문서 질의" onClick={setPromptShape} />
              <Choice label="KV 여유" value="healthy" active={headroom === 'healthy'} detail="free 128 block" onClick={setHeadroom} />
              <Choice label="KV 압박" value="tight" active={headroom === 'tight'} detail="free 8 block" onClick={setHeadroom} />
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-2 text-xs font-bold text-muted-foreground">3 · 두 최적화의 역할을 분리한다</legend>
            <div className="grid gap-2">
              <Toggle
                label="Chunked prefill"
                detail="긴 prefill을 step token budget 안에서 잘라 decode와 공존"
                checked={chunkedPrefill}
                onChange={setChunkedPrefill}
              />
              <Toggle
                label="반복 prefix"
                detail="같은 앞부분 50%의 prefill 계산을 재사용"
                checked={repeatedPrefix}
                onChange={setRepeatedPrefix}
              />
            </div>
          </fieldset>
        </div>

        <div className="min-w-0">
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <div className="min-w-0 bg-background p-4">
              <TimerReset className="h-4 w-4 text-blue-700 dark:text-blue-300" aria-hidden="true" />
              <p className="mt-3 text-xs font-bold text-muted-foreground">p95 TTFT / TPOT</p>
              <p data-serving-latency className="mt-1 break-words font-mono text-lg font-black tabular-nums">
                {result.ttft} / {result.tpot} ms
              </p>
            </div>
            <div className="min-w-0 bg-background p-4">
              <Gauge className="h-4 w-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />
              <p className="mt-3 text-xs font-bold text-muted-foreground">total throughput</p>
              <p data-serving-throughput className="mt-1 break-words font-mono text-lg font-black tabular-nums">
                {result.throughput} token/s
              </p>
            </div>
            <div className="min-w-0 bg-background p-4">
              <Database className="h-4 w-4 text-amber-700 dark:text-amber-300" aria-hidden="true" />
              <p className="mt-3 text-xs font-bold text-muted-foreground">KV free pool</p>
              <p data-serving-headroom className="mt-1 font-mono text-lg font-black tabular-nums">
                {result.freeBlocks} block
              </p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-border border-y border-border">
            {[
              ['출시 기준', result.primaryMetric],
              ['이번 step', result.plan],
              ['prefix 효과', repeatedPrefix
                ? `${result.reusableTokens.toLocaleString()} token 계산 재사용 · free memory가 늘어난다는 뜻은 아님`
                : '재사용 없음 · 전체 prompt를 새로 prefill'],
              ['preemption', result.preemptionRisk],
              ['첫 병목', result.firstBottleneck],
            ].map(([label, value]) => (
              <div key={label} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <span className="text-xs font-bold text-muted-foreground">{label}</span>
                <span className="break-words text-sm font-semibold leading-relaxed text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div
            data-serving-release
            data-release-state={result.passed ? 'pass' : 'hold'}
            className={`mt-5 border-l-2 pl-4 ${result.passed ? 'border-teal-600' : 'border-rose-600'}`}
          >
            <div className="flex items-center gap-2">
              {result.passed
                ? <ArrowRight className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
                : <TriangleAlert className="h-4 w-4 shrink-0 text-rose-700 dark:text-rose-300" aria-hidden="true" />}
              <p className="text-sm font-black">{result.passed ? '이 fixture에서는 다음 검증으로 진행' : '출시 보류 · 병목부터 수정'}</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              다음 소유자: <strong className="text-foreground">{result.nextOwner}</strong>. 실제 결론은 같은 model·GPU·precision·version·입출력 분포·request rate·burstiness·concurrency로 다시 측정한다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
