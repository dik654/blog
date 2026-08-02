import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  Braces,
  Check,
  FileImage,
  ScanText,
  Split,
} from 'lucide-react';

type PipelineMode = 'ocr' | 'donut';

const pipelineModes: Record<PipelineMode, {
  label: string;
  steps: Array<{ owner: string; artifact: string; risk: string }>;
  boundary: string;
}> = {
  ocr: {
    label: 'OCR 기반',
    steps: [
      { owner: 'Text detector', artifact: '문자 영역 box', risk: '영역을 놓치면 뒤 단계가 볼 수 없다.' },
      { owner: 'Text recognizer', artifact: '문자열 + box', risk: '오독이 token input으로 고정된다.' },
      { owner: 'Serializer', artifact: '읽기 순서 token', risk: '다단·표 순서가 뒤섞일 수 있다.' },
      { owner: 'VDU model', artifact: '분류·field·answer', risk: '앞 오류 위에서만 추론할 수 있다.' },
    ],
    boundary: '중간 계약은 OCR text와 좌표다. OCR 교체가 downstream 입력 분포도 바꾼다.',
  },
  donut: {
    label: 'Donut',
    steps: [
      { owner: 'Swin encoder', artifact: '시각 patch embeddings', risk: '해상도가 작으면 tiny text evidence가 사라진다.' },
      { owner: 'BART decoder', artifact: '구조 token sequence', risk: '이전 token 오류가 다음 생성에 이어질 수 있다.' },
      { owner: 'Field parser', artifact: 'JSON', risk: 'END token이 없으면 해당 field를 잃는다.' },
    ],
    boundary: '외부 OCR 출력은 추론 입력이 아니다. 하지만 structured output의 정확성과 provenance는 별도로 검증해야 한다.',
  },
};

export function DonutPipelineLab() {
  const [mode, setMode] = useState<PipelineMode>('ocr');
  const selected = pipelineModes[mode];

  return (
    <figure data-donut-pipeline-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Responsibility boundary</p>
          <p className="mt-1 text-sm font-black">같은 문서 이미지가 어떤 중간 계약을 거치는가</p>
        </div>
        <div role="tablist" aria-label="문서 이해 파이프라인" className="grid grid-cols-2 gap-1">
          {(Object.keys(pipelineModes) as PipelineMode[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              onClick={() => setMode(key)}
              className={`min-h-10 rounded-md border px-3 text-xs font-bold transition-colors motion-reduce:transition-none ${
                mode === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
              }`}
            >
              {pipelineModes[key].label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-3 py-5 lg:grid-cols-[8rem_minmax(0,1fr)] lg:items-start">
        <div className="flex min-h-24 items-center gap-3 border-l-2 border-blue-600 bg-blue-500/[0.05] px-4 py-3 lg:flex-col lg:justify-center lg:text-center">
          <FileImage className="size-6 shrink-0 text-blue-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-black">문서 이미지</p>
            <p className="mt-1 text-xs text-muted-foreground">raw pixels</p>
          </div>
        </div>

        <ol className={`grid min-w-0 gap-2 ${selected.steps.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          {selected.steps.map((step, index) => (
            <li key={step.owner} className="min-w-0 border-t-2 border-border px-1 py-3 md:px-3">
              <div className="flex items-center gap-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border font-mono text-xs font-black">
                  {index + 1}
                </span>
                <p className="break-words text-sm font-black">{step.owner}</p>
              </div>
              <p className="mt-3 break-words text-xs font-semibold text-blue-700 dark:text-blue-300">{step.artifact}</p>
              <p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground">{step.risk}</p>
            </li>
          ))}
        </ol>
      </div>

      <figcaption className="flex gap-2 border-t border-border py-4 text-xs leading-relaxed text-muted-foreground">
        {mode === 'ocr'
          ? <Split className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
          : <ScanText className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />}
        <span><strong className="text-foreground">{selected.label}.</strong> {selected.boundary}</span>
      </figcaption>
    </figure>
  );
}

type SequenceTask = 'classification' | 'extraction' | 'vqa';

const sequenceTasks: Record<SequenceTask, {
  label: string;
  prompt: string;
  tokens: string[];
  json: string[];
  decision: string;
}> = {
  classification: {
    label: '문서 분류',
    prompt: '[CLS_RVLCDIP]',
    tokens: ['[START_class]', 'memo', '[END_class]'],
    json: ['{', '  "class": "memo"', '}'],
    decision: '하나의 class field를 생성한다. OCR text 목록은 decoder 입력이 아니다.',
  },
  extraction: {
    label: '정보 추출',
    prompt: '[PARSE_CORD]',
    tokens: [
      '[START_menu]',
      '[START_name]',
      '비빔밥',
      '[END_name]',
      '[START_price]',
      '9,000',
      '[END_price]',
      '[END_menu]',
      '[START_total]',
      '9,000',
      '[END_total]',
    ],
    json: [
      '{',
      '  "menu": {',
      '    "name": "비빔밥",',
      '    "price": "9,000"',
      '  },',
      '  "total": "9,000"',
      '}',
    ],
    decision: '중첩된 START/END 경계가 영수증의 계층 구조를 JSON tree로 복원한다.',
  },
  vqa: {
    label: 'DocVQA',
    prompt: 'Q: 승객 이름은?',
    tokens: ['[START_answer]', 'KIM MINJI', '[END_answer]'],
    json: ['{', '  "answer": "KIM MINJI"', '}'],
    decision: '질문 자체가 decoder 시작 prompt가 되고 answer token을 생성한다.',
  },
};

export function DonutSequenceLab() {
  const [task, setTask] = useState<SequenceTask>('extraction');
  const [malformed, setMalformed] = useState(false);
  const selected = sequenceTasks[task];
  const omittedEndIndex = selected.tokens.findIndex((token) => token.startsWith('[END_'));
  const omittedEnd = omittedEndIndex >= 0 ? selected.tokens[omittedEndIndex] : null;
  const tokens = useMemo(
    () => malformed ? selected.tokens.filter((_, index) => index !== omittedEndIndex) : selected.tokens,
    [malformed, omittedEndIndex, selected.tokens],
  );
  const lostField = malformed && omittedEnd
    ? omittedEnd.replace('[END_', '').replace(']', '')
    : null;

  return (
    <figure data-donut-sequence-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Token grammar</p>
            <p className="mt-1 text-sm font-black">Prompt와 field 경계가 한 sequence 안에 들어간다</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              아래 값과 prompt 철자는 원문의 생성 규칙을 재구성한 교육용 예시이며, 논문 Figure의 전사본이 아니다.
            </p>
          </div>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-xs font-bold">
            <input
              type="checkbox"
              checked={malformed}
              onChange={(event) => setMalformed(event.target.checked)}
              className="size-4 accent-foreground"
            />
              END token 하나 누락
          </label>
        </div>
        <div role="tablist" aria-label="Donut downstream task" className="grid gap-1 sm:grid-cols-3">
          {(Object.keys(sequenceTasks) as SequenceTask[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={task === key}
              onClick={() => {
                setTask(key);
                setMalformed(false);
              }}
              className={`min-h-10 rounded-md border px-3 text-xs font-bold ${
                task === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
              }`}
            >
              {sequenceTasks[key].label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-0 py-5 lg:grid-cols-[minmax(0,1.15fr)_3rem_minmax(0,0.85fr)] lg:items-stretch">
        <div className="min-w-0 border-l-2 border-blue-600 px-4 py-3">
          <p className="text-xs font-semibold text-muted-foreground">Decoder input · {selected.prompt}</p>
          <div className="mt-4 flex min-h-24 flex-wrap content-start gap-2" aria-label="생성 token sequence">
            {tokens.map((token, index) => (
              <span
                key={`${token}-${index}`}
                className={`min-w-0 break-all rounded-sm border px-2 py-2 font-mono text-xs font-bold ${
                  token.startsWith('[START_') || token.startsWith('[END_')
                    ? 'border-blue-600/35 bg-blue-500/10 text-blue-800 dark:text-blue-200'
                    : 'border-border bg-muted/30'
                }`}
              >
                {token}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <ArrowDown className="size-5 -rotate-90 text-muted-foreground" aria-hidden="true" />
        </div>

        <div className={`min-w-0 border-l-2 px-4 py-3 ${malformed ? 'border-red-600 bg-red-500/[0.04]' : 'border-emerald-600 bg-emerald-500/[0.04]'}`}>
          <div className="flex items-center gap-2">
            {malformed
              ? <AlertTriangle className="size-4 shrink-0 text-red-600" aria-hidden="true" />
              : <Braces className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />}
            <p className="text-xs font-semibold text-muted-foreground">Regex parse result</p>
          </div>
          {malformed ? (
            <div className="mt-4 min-h-24">
              <p className="text-sm font-black text-red-700 dark:text-red-300">{lostField ?? 'field'} boundary unresolved</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {omittedEnd} 하나를 제거했다. 원문 parser 규칙은 빠진 경계를 추측해 고치지 않고 이 field와 이를 감싸는 상위 구조를 review 대상으로 남긴다.
              </p>
            </div>
          ) : (
            <pre className="mt-4 min-h-24 overflow-hidden whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
              {selected.json.join('\n')}
            </pre>
          )}
        </div>
      </div>

      <figcaption className="flex gap-2 border-t border-border py-4 text-xs leading-relaxed text-muted-foreground">
        {malformed
          ? <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
          : <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />}
        {malformed ? '문법 실패를 숨기지 않는다. 이 state는 parser 보완이 아니라 model output failure다.' : selected.decision}
      </figcaption>
    </figure>
  );
}

type EvidenceView = 'classification' | 'ie' | 'docvqa' | 'resolution';

const evidenceViews: Record<EvidenceView, {
  label: string;
  headline: string;
  scope: string;
  rows: Array<{ model: string; metric: string; value?: number; display: string; emphasis?: 'good' | 'warn' }>;
  reading: string;
}> = {
  classification: {
    label: '문서 분류',
    headline: 'RVL-CDIP · Table 1',
    scope: 'P40에서 측정한 end-to-end 시간. OCR baseline은 논문이 선택한 MS/CLOVA API를 포함한다.',
    rows: [
      { model: 'LayoutLMv2 + OCR', metric: 'accuracy', value: 95.25, display: '95.25% · 1,489ms' },
      { model: 'Donut', metric: 'accuracy', value: 95.3, display: '95.30% · 752ms', emphasis: 'good' },
    ],
    reading: '이 설정에서는 비슷한 정확도로 약 2배 빠르다. 다른 OCR engine·GPU·batch에 그대로 이식할 보편 배수가 아니다.',
  },
  ie: {
    label: '영수증 IE',
    headline: 'CORD · Table 2',
    scope: 'Field F1은 한 글자라도 틀리면 field 실패다. Acc.는 TED로 JSON tree 구조를 비교한다.',
    rows: [
      { model: 'LayoutLMv2 + OCR', metric: 'TED accuracy', value: 82.4, display: 'F1 78.9 · TED 82.4' },
      { model: 'Donut', metric: 'TED accuracy', value: 90.9, display: 'F1 84.1 · TED 90.9', emphasis: 'good' },
    ],
    reading: '문자 field와 nested group을 함께 읽어야 한다. 이 수치만으로 cross-page 관계나 source coordinate provenance가 증명되지는 않는다.',
  },
  docvqa: {
    label: 'DocVQA',
    headline: 'DocVQA · Table 3',
    scope: '전체 ANLS와 handwritten slice의 순위가 다르다. Fine-tuning data도 train-only와 train+dev+QG로 다르다.',
    rows: [
      { model: 'LayoutLMv2 train', metric: 'ANLS', value: 78.1, display: '전체 ANLS 78.1' },
      { model: 'Donut train', metric: 'ANLS', value: 67.5, display: '전체 67.5 · 필기 72.1', emphasis: 'warn' },
      { model: 'LayoutLMv2-Large-QG', metric: 'ANLS', value: 86.7, display: '전체 86.7 · 필기 67.3' },
    ],
    reading: 'Donut은 전체 DocVQA 1위가 아니다. 논문의 강점은 OCR-free 경쟁력과 handwritten slice이고, tiny text에서는 해상도 제약으로 실패했다.',
  },
  resolution: {
    label: '해상도',
    headline: 'CORD · Section 3.3–3.4',
    scope: '같은 Donut family에서도 입력 해상도가 accuracy·low-resource robustness·compute를 함께 바꾼다.',
    rows: [
      { model: '1280×960', metric: 'TED accuracy', value: 91.1, display: '91.1 · 0.7s/image' },
      { model: '2560×1920', metric: 'qualitative finding', display: '저자 관찰: tiny text·80-sample 조건에서 더 강함', emphasis: 'good' },
    ],
    reading: '원문이 같은 조건의 단일 accuracy 숫자를 제시하지 않은 2560×1920 결과는 막대 길이로 비교하지 않는다. 저자가 보고한 low-resource 우세와 급격한 compute 증가만 정성 근거로 남긴다.',
  },
};

export function DonutEvidenceLab() {
  const [view, setView] = useState<EvidenceView>('docvqa');
  const selected = evidenceViews[view];
  const numericValues = selected.rows.flatMap((row) => row.value === undefined ? [] : [row.value]);
  const max = Math.max(1, ...numericValues);

  return (
    <figure data-donut-evidence-lab className="not-prose my-8 border-y border-border">
      <header className="py-4">
        <p className="text-xs font-semibold text-muted-foreground">Source receipt</p>
        <p className="mt-1 text-sm font-black">평균 한 줄이 아니라 task·metric·setup을 함께 읽는다</p>
        <div role="tablist" aria-label="Donut source evidence" className="mt-4 grid grid-cols-2 gap-1 sm:grid-cols-4">
          {(Object.keys(evidenceViews) as EvidenceView[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={view === key}
              onClick={() => setView(key)}
              className={`min-h-10 rounded-md border px-2 text-xs font-bold ${
                view === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
              }`}
            >
              {evidenceViews[key].label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-5 py-5 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="border-l-2 border-blue-600 pl-4">
          <p className="text-sm font-black">{selected.headline}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selected.scope}</p>
        </div>
        <div className="min-w-0 space-y-4">
          {selected.rows.map((row) => (
            <div key={row.model} className="min-w-0">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-xs font-bold">{row.model}</p>
                <p className="text-xs text-muted-foreground">{row.display}</p>
              </div>
              {row.value === undefined ? (
                <div className="border-l-2 border-emerald-600 bg-emerald-500/[0.04] px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  수치 축이 없는 원문 관찰이므로 다른 accuracy 막대와 길이를 비교하지 않는다.
                </div>
              ) : (
                <div className="h-3 overflow-hidden rounded-sm bg-muted">
                  <div
                    className={`h-full transition-[width] duration-300 motion-reduce:transition-none ${
                      row.emphasis === 'good' ? 'bg-emerald-600' : row.emphasis === 'warn' ? 'bg-amber-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }}
                    aria-label={`${row.model} ${row.metric} ${row.value}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <figcaption className="flex gap-2 border-t border-border py-4 text-xs leading-relaxed text-muted-foreground">
        {view === 'docvqa'
          ? <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
          : <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />}
        {selected.reading}
      </figcaption>
    </figure>
  );
}
