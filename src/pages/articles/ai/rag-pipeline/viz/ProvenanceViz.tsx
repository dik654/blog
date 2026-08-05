import StepViz, { type StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  {
    label: '인용 문자열만 붙이면 실제 근거 경로를 알 수 없다',
    body: '답은 문서 3을 가리키지만 어느 문장이 어느 claim을 지지했는지, 중간 요약에서 무엇이 바뀌었는지는 기록하지 않는다.',
  },
  {
    label: '모든 입력과 중간 출력에 stable id를 붙여 DAG를 만든다',
    body: 'source span → chunk → retrieval snapshot → generation node → claim의 입력 관계를 edge로 저장한다.',
  },
  {
    label: 'Claim별 지지 상태와 오류가 들어온 단계를 분리한다',
    body: 'supported는 노출하고, inconclusive는 재검색하며, unsupported는 제거한다. 오류 node를 알면 전체 pipeline을 다시 돌리지 않아도 된다.',
  },
];

const tone = {
  source: 'border-sky-500/35 bg-sky-500/[0.06] text-sky-800 dark:text-sky-200',
  process: 'border-violet-500/35 bg-violet-500/[0.06] text-violet-800 dark:text-violet-200',
  good: 'border-emerald-500/35 bg-emerald-500/[0.06] text-emerald-800 dark:text-emerald-200',
  warn: 'border-amber-500/40 bg-amber-500/[0.07] text-amber-900 dark:text-amber-200',
  bad: 'border-rose-500/40 bg-rose-500/[0.06] text-rose-800 dark:text-rose-200',
};

function Node({ id, title, body, className }: { id: string; title: string; body: string; className: string }) {
  return (
    <div className={`min-w-0 border px-3 py-3 ${className}`}>
      <span className="font-mono text-[10px] font-bold opacity-65">{id}</span>
      <strong className="mt-1 block text-sm leading-snug">{title}</strong>
      <span className="mt-1 block text-xs leading-relaxed opacity-75">{body}</span>
    </div>
  );
}

function Arrow() {
  return <div aria-hidden="true" className="flex h-7 items-center justify-center text-sm text-muted-foreground sm:h-auto sm:w-8">→</div>;
}

function CitationOnly() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-5 px-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:px-4">
      <Node id="ANSWER" title="모터 온도는 80°C까지 안전하다 [문서 3]" body="하나의 문장에 정격 조건과 안전 판정이 섞여 있다." className={tone.warn} />
      <Node id="DOC-3" title="문서 3" body="문서 전체만 연결되어 정확한 page·span과 사용 경로를 알 수 없다." className={tone.source} />
      <div className="border-t border-dashed border-border pt-4 text-xs leading-relaxed text-muted-foreground sm:col-span-2">
        누락된 질문: 80°C는 주변 온도인가, winding 온도인가? 연속 정격인가, 일시 peak인가? 이 문장이 실제 prompt에 들어갔는가?
      </div>
    </div>
  );
}

function ProvenanceDag() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-stretch px-2 sm:flex-row sm:items-center sm:justify-center sm:px-4">
      <Node id="SRC-17:L42-46" title="원문 span" body="연속 운전 시 winding 80°C 이하" className={tone.source} />
      <Arrow />
      <Node id="CHK-204" title="검색 chunk" body="source id와 정확한 line 범위를 보존" className={tone.process} />
      <Arrow />
      <Node id="RUN-81" title="Context snapshot" body="rerank 뒤 실제 prompt에 들어간 입력" className={tone.process} />
      <Arrow />
      <Node id="CLM-9" title="검증할 claim" body="연속 운전 조건에서 winding ≤ 80°C" className={tone.good} />
    </div>
  );
}

function Verdicts() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-3 px-2 sm:px-4">
      <Node id="CLM-9 · SUPPORTED" title="연속 운전에서 winding은 80°C 이하여야 한다" body="SRC-17:L42-46이 조건과 수치를 모두 지지한다." className={tone.good} />
      <Node id="CLM-10 · INCONCLUSIVE" title="모터 외함 80°C도 안전하다" body="원문은 winding만 말한다. 외함 온도 근거를 재검색한다." className={tone.warn} />
      <Node id="CLM-11 · UNSUPPORTED" title="80°C를 넘으면 즉시 화재가 난다" body="중간 요약 GEN-4에서 과장되었다. 답에서 제거하고 해당 node를 재생성한다." className={tone.bad} />
    </div>
  );
}

export default function ProvenanceViz() {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <div className="w-full">
          {step === 0 ? <CitationOnly /> : step === 1 ? <ProvenanceDag /> : <Verdicts />}
        </div>
      )}
    </StepViz>
  );
}
