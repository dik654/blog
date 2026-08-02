import { useMemo, useState, type ReactNode } from 'react';

const QUERY_HEADS = 32;
const HEAD_DIMENSION = 128;
const BYTES_PER_ELEMENT = 2;
const ROUTED_EXPERTS = 256;
const SHARED_EXPERTS = 1;
const LOCAL_PER_GLOBAL = 4;

const contextOptions = [8_192, 16_384, 131_072];
const kvHeadOptions = [32, 4, 1];

function formatContext(value: number) {
  return value >= 1024 ? `${value / 1024}K` : value.toLocaleString();
}

function formatGiB(bytes: number) {
  return (bytes / 1024 ** 3).toFixed(2);
}

function attentionLabel(kvHeads: number) {
  if (kvHeads === QUERY_HEADS) return 'MHA';
  if (kvHeads === 1) return 'MQA';
  return 'GQA';
}

export default function ArchitectureFingerprintLab() {
  const [batch, setBatch] = useState(2);
  const [layers, setLayers] = useState(48);
  const [context, setContext] = useState(8_192);
  const [kvHeads, setKvHeads] = useState(4);
  const [topK, setTopK] = useState(8);

  const metrics = useMemo(() => {
    const kvBytes = 2 * batch * layers * kvHeads * HEAD_DIMENSION * context * BYTES_PER_ELEMENT;
    const queryPerKv = QUERY_HEADS / kvHeads;
    const globalLayers = Math.floor(layers / (LOCAL_PER_GLOBAL + 1));
    const localLayers = layers - globalLayers;
    const actualLocalRatio = globalLayers === 0 ? localLayers : localLayers / globalLayers;
    const routedRatio = (topK / ROUTED_EXPERTS) * 100;
    const globalIndices = Array.from({ length: globalLayers }, (_, index) => (index + 1) * (LOCAL_PER_GLOBAL + 1));

    return {
      kvBytes,
      queryPerKv,
      globalLayers,
      localLayers,
      actualLocalRatio,
      routedRatio,
      globalIndices,
      kvSaving: (1 - kvHeads / QUERY_HEADS) * 100,
    };
  }, [batch, context, kvHeads, layers, topK]);

  return (
    <figure
      className="not-prose my-10 overflow-hidden rounded-md border border-border bg-background"
      data-architecture-fingerprint
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-5 py-5 sm:px-6">
        <div className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">STRUCTURE READING LAB · UNSEEN MODEL</div>
        <h3 className="mt-2 text-lg font-bold leading-7">모델 이름을 가리고 비용과 정보 경로만 읽는다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          같은 모델도 MHA·GQA 선택, context, layer 수, expert 활성 수에 따라 병목이 달라진다. 숫자를 바꾸며 하나의 family 이름이 아니라 여러 구조 축의 조합으로 판독한다.
        </p>
      </figcaption>

      <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="space-y-6 border-b border-border bg-muted/20 p-5 lg:border-b-0 lg:border-r sm:p-6">
          <Control label="동시 sequence · B" value={batch} suffix="개">
            <input
              aria-label="Architecture batch size"
              className="w-full accent-blue-600"
              type="range"
              min="1"
              max="4"
              step="1"
              value={batch}
              onChange={(event) => setBatch(Number(event.target.value))}
            />
          </Control>

          <Control label="Decoder layer · L" value={layers} suffix="층">
            <input
              aria-label="Architecture layer count"
              className="w-full accent-amber-600"
              type="range"
              min="10"
              max="80"
              step="1"
              value={layers}
              onChange={(event) => setLayers(Number(event.target.value))}
            />
          </Control>

          <OptionControl label="Context token · N">
            {contextOptions.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={`Architecture context ${option}`}
                aria-pressed={context === option}
                onClick={() => setContext(option)}
                className={`min-h-10 border px-2 text-xs font-bold transition-colors ${context === option ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-muted'}`}
              >
                {formatContext(option)}
              </button>
            ))}
          </OptionControl>

          <OptionControl label="KV head · Hkv">
            {kvHeadOptions.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={`Architecture KV heads ${option}`}
                aria-pressed={kvHeads === option}
                onClick={() => setKvHeads(option)}
                className={`min-h-10 border px-2 text-xs font-bold transition-colors ${kvHeads === option ? 'border-blue-700 bg-blue-700 text-white' : 'border-border bg-background hover:bg-muted'}`}
              >
                {option} · {attentionLabel(option)}
              </button>
            ))}
          </OptionControl>

          <Control label="Routed expert · top-k" value={topK} suffix={` / ${ROUTED_EXPERTS}`}>
            <input
              aria-label="Architecture routed top k"
              className="w-full accent-emerald-600"
              type="range"
              min="1"
              max="16"
              step="1"
              value={topK}
              onChange={(event) => setTopK(Number(event.target.value))}
            />
          </Control>
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            <MetricPanel
              tone="bg-sky-50 dark:bg-sky-950/25"
              eyebrow={`${attentionLabel(kvHeads)} · KV MEMORY`}
              value={`${formatGiB(metrics.kvBytes)} GiB`}
              detail={`${QUERY_HEADS} Q : ${kvHeads} KV = ${metrics.queryPerKv.toFixed(metrics.queryPerKv % 1 === 0 ? 0 : 2)}:1 공유`}
              dataName="data-architecture-kv"
            />
            <MetricPanel
              tone="bg-amber-50 dark:bg-amber-950/20"
              eyebrow="LOCAL / GLOBAL SCHEDULE"
              value={`${metrics.localLayers} / ${metrics.globalLayers}`}
              detail={`설계 4:1 · 실제 ${metrics.actualLocalRatio.toFixed(2)}:1`}
              dataName="data-architecture-layer-mix"
            />
            <MetricPanel
              tone="bg-emerald-50 dark:bg-emerald-950/20"
              eyebrow="ROUTED CAPACITY"
              value={`${metrics.routedRatio.toFixed(3)}%`}
              detail={`${topK}/${ROUTED_EXPERTS} routed · shared ${SHARED_EXPERTS}개 별도`}
              dataName="data-architecture-active-ratio"
            />
            <MetricPanel
              tone="bg-violet-50 dark:bg-violet-950/20"
              eyebrow="DEPTH MIXER · FIXED SYNTHETIC"
              value="6 → 2"
              detail="합성 사양 고정값 · 이전 output 6개 중 강한 2개"
              dataName="data-architecture-depth"
            />
          </div>

          <div className="mt-6 border-y border-border py-5" data-architecture-flow>
            <div className="grid gap-3 sm:grid-cols-4">
              <FlowStep order="01" label="문맥 읽기" value={`${QUERY_HEADS}Q → ${kvHeads}KV`} tone="border-sky-500" />
              <FlowStep order="02" label="원거리 갱신" value={`${metrics.globalLayers} global`} tone="border-amber-500" />
              <FlowStep order="03" label="용량 선택" value={`${topK} routed + 1 shared`} tone="border-emerald-500" />
              <FlowStep order="04" label="깊이 선택" value="6 candidates → 2" tone="border-violet-500" />
            </div>
            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              Global layer 위치: <strong className="text-foreground">{metrics.globalIndices.length > 0 ? metrics.globalIndices.join(', ') : '없음'}</strong>.
              48층 기본값은 마지막에 local 3층이 남으므로 실제 layer 비율이 정확히 4:1이 아니다.
            </p>
          </div>

          <div className="mt-6" data-architecture-verdict>
            <div className="text-xs font-bold text-muted-foreground">이 모델의 구조 fingerprint</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Fingerprint label="Dense decoder baseline" />
              <Fingerprint label={kvHeads === QUERY_HEADS ? 'MHA memory' : `${attentionLabel(kvHeads)} · KV-efficient`} />
              <Fingerprint label="Local/global long-context" />
              <Fingerprint label="Sparse MoE" />
              <Fingerprint label="Depth mixing" />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              KV 절감률 <strong className="text-foreground" data-architecture-kv-saving>{metrics.kvSaving.toFixed(1)}%</strong>는 MHA와 같은 head dimension을 가정한 cache 비교다.
              Context·KV head·top-k를 바꿨을 때 메모리와 활성 용량은 서로 독립적으로 움직인다. 입력 경계와 6→2 depth mixer는 이 합성 사양의 고정 조건이다.
              Expert width가 없으므로 routed 비율을 total active parameter 비율로 바꾸지 않았고, 128K를 선택해도 실제 장거리 retrieval 품질을 보증하지 않는다.
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Control({
  label,
  value,
  suffix,
  children,
}: {
  label: string;
  value: number;
  suffix: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4 text-xs font-bold text-muted-foreground">
        {label}
        <span className="text-sm tabular-nums text-foreground">{value.toLocaleString()}{suffix}</span>
      </span>
      <span className="mt-3 block">{children}</span>
    </label>
  );
}

function OptionControl({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold text-muted-foreground">{label}</div>
      <div className="mt-3 grid grid-cols-3 gap-2">{children}</div>
    </div>
  );
}

function MetricPanel({
  tone,
  eyebrow,
  value,
  detail,
  dataName,
}: {
  tone: string;
  eyebrow: string;
  value: string;
  detail: string;
  dataName: string;
}) {
  return (
    <div className={`${tone} min-w-0 p-5`} {...{ [dataName]: '' }}>
      <div className="text-xs font-bold text-muted-foreground">{eyebrow}</div>
      <div className="mt-2 text-2xl font-bold tabular-nums tracking-normal">{value}</div>
      <div className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</div>
    </div>
  );
}

function FlowStep({ order, label, value, tone }: { order: string; label: string; value: string; tone: string }) {
  return (
    <div className={`min-w-0 border-l-2 ${tone} pl-3`}>
      <div className="font-mono text-xs font-bold text-muted-foreground">{order}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm font-bold leading-5">{value}</div>
    </div>
  );
}

function Fingerprint({ label }: { label: string }) {
  return <span className="rounded-sm border border-border bg-muted/25 px-2.5 py-1.5 text-xs font-semibold">{label}</span>;
}
