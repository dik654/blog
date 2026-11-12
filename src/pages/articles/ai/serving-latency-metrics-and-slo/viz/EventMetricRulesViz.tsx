import LatencySceneShell from "./LatencySceneShell";

/**
 * 본문 대응: #source-client-events·#paper-vllm-bench — 1·1·3개 묶음 수신(1.000·1.040·1.327초)에
 * 도구별 규칙을 넣으면 값이 갈린다.
 *   vLLM chat 수신 경로의 목록: 40 · 287ms
 *   GenAI-Perf: 40 · 287/3 ≈ 95.667ms → 단순 평균 ≈ 67.833ms, 토큰 수 가중 (40 + 287)/4 = 81.75ms
 *   usage 이벤트 1.350초가 끝이면: latency 1.350초, TPOT (1.350 − 1)/(5 − 1) = 87.5ms (모두 가정)
 */
const EVENTS = [
  { at: 1000, tokens: 1 },
  { at: 1040, tokens: 1 },
  { at: 1327, tokens: 3 },
] as const;
const USAGE = 1350;
const FIRST = 40;
const BUNDLE = 287;
const PER_TOKEN = BUNDLE / 3;
const SIMPLE_MEAN = (FIRST + PER_TOKEN) / 2;
const WEIGHTED = (FIRST * 1 + PER_TOKEN * 3) / 4;
const USAGE_TPOT = (USAGE - 1000) / 4;

const AX_FROM = 985;
const AX_TO = 1365;
const pos = (ms: number) => `${((ms - AX_FROM) / (AX_TO - AX_FROM)) * 100}%`;
const span = (a: number, b: number) => `${((b - a) / (AX_TO - AX_FROM)) * 100}%`;
const ms3 = (v: number) => (Math.round(v * 1000) / 1000).toString();

const SCENES = [
  {
    label: "vLLM 수신 목록: 이벤트 사이 시각 차",
    summary: `${FIRST} · ${BUNDLE}ms`,
    note: `choices 이벤트 사이의 시각 차이를 그대로 목록에 넣습니다. 토큰은 5개지만 남는 값은 ${FIRST}ms와 ${BUNDLE}ms 두 개이고, 원래 네 토큰 간격은 관측되지 않습니다.`,
  },
  {
    label: "GenAI-Perf: 뒤 응답의 토큰 수로 나눈다",
    summary: `${FIRST} · ${BUNDLE}÷3 ≈ ${ms3(PER_TOKEN)}ms`,
    note: `뒤 응답에 토큰이 3개 들었으므로 ${BUNDLE}ms를 3으로 나눕니다. 칸을 셋으로 나눈 점선은 나눗셈의 결과일 뿐, 묶음 안의 실제 생성 간격을 복원한 것이 아닙니다.`,
  },
  {
    label: "두 값을 어떻게 평균하느냐",
    summary: `≈ ${ms3(SIMPLE_MEAN)} vs ${ms3(WEIGHTED)}ms`,
    note: `두 값을 단순 평균하면 (${FIRST} + ${ms3(PER_TOKEN)}) ÷ 2 ≈ ${ms3(SIMPLE_MEAN)}ms입니다. 토큰 수로 가중하면 (${FIRST}×1 + ${ms3(PER_TOKEN)}×3) ÷ 4 = ${ms3(WEIGHTED)}ms로 7절의 TPOT와 같습니다.`,
  },
  {
    label: "usage 이벤트가 끝을 정하면",
    summary: `latency 1.350초 · TPOT ${ms3(USAGE_TPOT)}ms`,
    note: `11절에서도 이어 쓰는 가정대로 마지막 토큰 뒤 1.350초에 usage 이벤트가 오면 이 chat 경로의 latency는 1.350초가 될 수 있습니다. 그러면 TPOT는 (1.350 − 1) ÷ (5 − 1) = ${ms3(USAGE_TPOT)}ms로 토큰 기준 ${ms3(WEIGHTED)}ms와 다릅니다.`,
  },
];

const DOT = "#2563eb";
const GAP_BORDER = "#93c5fd";
const GAP_FILL = "#dbeafe";
const WARN = "#d97706";

function Timeline({ active }: { active: number }) {
  const showUsage = active === 3;
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-muted-foreground">수신 이벤트 · 안의 숫자는 토큰 수</p>
      <div className="relative mx-3 mt-2 h-8">
        <div className="absolute inset-x-0 top-3 border-t border-border" />
        {EVENTS.map((e) => (
          <span
            key={e.at}
            className="absolute top-0 size-6 -translate-x-1/2 rounded-full border text-center font-mono text-[11px] font-bold leading-6 text-white"
            style={{ left: pos(e.at), backgroundColor: DOT, borderColor: DOT }}
          >
            {e.tokens}
          </span>
        ))}
        <span
          className={`absolute top-0 flex h-6 -translate-x-1/2 items-center rounded-sm border border-dashed px-1 font-mono text-[10px] font-bold ${showUsage ? "" : "invisible"}`}
          style={{ left: pos(USAGE), borderColor: WARN, color: WARN }}
          aria-hidden={!showUsage}
        >
          u
        </span>
      </div>
      <div className="relative mx-3 mt-1 h-4 font-mono text-[10px] text-muted-foreground">
        {[1000, 1100, 1200, 1300].map((t) => (
          <span key={t} className="absolute -translate-x-1/2" style={{ left: pos(t) }}>
            {(t / 1000).toFixed(1)}s
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] font-bold text-muted-foreground">이 규칙이 남기는 간격 값 (ms)</p>
      <div className="relative mx-3 mt-2 h-9">
        <div
          className="absolute top-0 flex h-9 items-center justify-center rounded-sm border font-mono text-[11px] font-bold text-[#1e3a8a]"
          style={{ left: pos(1000), width: span(1000, 1040), borderColor: GAP_BORDER, backgroundColor: GAP_FILL }}
        >
          {FIRST}
        </div>
        <div
          className="absolute top-0 flex h-9 items-center justify-center overflow-hidden rounded-sm border font-mono text-[11px] font-bold text-[#1e3a8a]"
          style={{ left: pos(1040), width: span(1040, 1327), borderColor: GAP_BORDER, backgroundColor: GAP_FILL }}
        >
          {(active === 1 || active === 2) && (
            <>
              <span className="absolute inset-y-0 left-1/3 border-l border-dashed border-[#1e3a8a]/50" aria-hidden />
              <span className="absolute inset-y-0 left-2/3 border-l border-dashed border-[#1e3a8a]/50" aria-hidden />
            </>
          )}
          <span className="relative bg-[#dbeafe] px-1">{active === 0 || active === 3 ? BUNDLE : `${BUNDLE}÷3 ≈ ${ms3(PER_TOKEN)}`}</span>
        </div>
        <div
          className={`absolute top-0 flex h-9 items-center justify-center rounded-sm border border-dashed ${showUsage ? "" : "invisible"}`}
          style={{ left: pos(1327), width: span(1327, USAGE), borderColor: WARN }}
          aria-hidden={!showUsage}
        />
      </div>
    </div>
  );
}

function Bar({ label, value, color, shown }: { label: string; value: number; color: string; shown: boolean }) {
  return (
    <div aria-hidden={!shown} className={`${shown ? "" : "invisible"} grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs`}>
      <span>{label}</span>
      <div className="h-3.5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(value / 100) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">{ms3(value)}</span>
    </div>
  );
}

export default function EventMetricRulesViz() {
  return (
    <LatencySceneShell
      eyebrow="수신 이벤트와 측정 규칙"
      title="같은 묶음 수신 기록이 규칙에 따라 다른 간격과 평균이 됩니다"
      description="10절의 가정 기록입니다. 다섯 토큰이 1개·1개·3개로 묶여 1.000·1.040·1.327초에 도착했습니다. 가로축은 요청 전송 뒤 경과 시간입니다."
      note="모든 시각은 설명용 가정이며, 각 규칙은 본문이 고정한 버전의 코드와 문서 정의를 따른 것입니다. u는 마지막 토큰 뒤에 오는 usage(사용량) 이벤트입니다."
      ariaLabel="묶음 수신 기록에 도구별 간격 규칙을 적용한 결과"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <Timeline active={active} />
          <div className="mt-4 space-y-2">
            <p className={`text-[11px] font-bold text-muted-foreground ${active >= 2 ? "" : "invisible"}`}>평균 간격 (ms, 축 0–100)</p>
            <Bar label="두 값 단순 평균" value={SIMPLE_MEAN} color={active === 2 ? WARN : "#cbd5e1"} shown={active >= 2} />
            <Bar label="토큰 수 가중" value={WEIGHTED} color={active >= 2 ? DOT : "#cbd5e1"} shown={active >= 2} />
            <Bar label="usage 끝 TPOT" value={USAGE_TPOT} color={WARN} shown={active === 3} />
          </div>
        </div>
      )}
    />
  );
}
