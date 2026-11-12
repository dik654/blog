import SceneShell from "./SceneShell";

/**
 * 본문 대응: #taxonomy — 시간을 잰 경계가 어디냐에 따라 micro·macro·종단 간 측정이 나뉜다.
 * 바깥에서 안쪽으로 클라이언트 > HTTP·network > engine process(scheduler·KV cache) > kernel·decode step.
 * 장면마다 잰 경계 안쪽만 진하게 칠하고, 경계 밖은 그 측정에 들어 있지 않은 것으로 흐리게 둔다.
 */
const LAYERS = [
  { name: "클라이언트", detail: "요청을 보내고 스트리밍 응답이 도착한 시각을 기록" },
  { name: "HTTP · network", detail: "요청과 응답 token 이 오가는 경로, 도착 간격" },
  { name: "Engine process", detail: "scheduler 가 batch 를 짜고 KV cache 를 나눔" },
  { name: "Kernel · decode step", detail: "예: Attention kernel 하나" },
] as const;

const SCENES = [
  {
    label: "Microbenchmark",
    summary: "batch 32 · seq 2k → 1.8 ms",
    inner: 3,
    note: "가장 안쪽 칸 하나만 잽니다. Scheduler 와 network 가 경계 밖에 있으니 어느 kernel 이 병목인지 가리기는 쉽지만, 사용자가 겪는 latency 는 이 값으로 말할 수 없습니다.",
  },
  {
    label: "Macrobenchmark",
    summary: "요청 1,000개 일괄 투입 → tokens/s",
    inner: 2,
    note: "Engine 전체를 한 process 안에서 돌립니다. Network 와 도착 간격이 경계 밖이라 scheduler 와 KV cache 가 만드는 상한에 가까운 값이 나옵니다.",
  },
  {
    label: "종단 간 측정",
    summary: "클라이언트 시각 → TTFT · ITL",
    inner: 0,
    note: "클라이언트가 HTTP 로 보내고 스트리밍으로 받는 경로 전체가 경계 안입니다. 사용자에게 약속할 SLO 는 이 층에서 검증하고, 원인을 나누려면 안쪽 층도 함께 잽니다.",
  },
] as const;

function Layer({ depth, inner }: { depth: number; inner: number }) {
  const layer = LAYERS[depth];
  const measured = depth >= inner;
  const isBoundary = depth === inner;
  const child = depth + 1 < LAYERS.length ? <Layer depth={depth + 1} inner={inner} /> : null;
  return (
    <div
      className={`min-w-0 rounded-lg px-2 py-1.5 transition-colors duration-300 motion-reduce:transition-none sm:px-3 ${
        isBoundary
          ? "border-[1.25px] border-primary bg-primary/5"
          : measured
            ? "border border-primary/40 bg-background"
            : "border border-dashed border-border bg-muted/20"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <span className={`text-xs font-bold sm:text-sm ${measured ? "text-foreground" : "text-muted-foreground/70"}`}>{layer.name}</span>
        <span className={`text-[11px] font-semibold ${isBoundary ? "text-primary" : measured ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
          {isBoundary ? "여기부터 잼" : measured ? "측정에 포함" : "측정 밖"}
        </span>
      </div>
      <p className={`text-[11px] leading-4 sm:text-xs sm:leading-5 ${measured ? "text-muted-foreground" : "text-muted-foreground/60"}`}>{layer.detail}</p>
      {child ? <div className="mt-1.5">{child}</div> : null}
    </div>
  );
}

export default function MeasureScopeViz() {
  return (
    <SceneShell
      eyebrow="측정 범위"
      title="같은 ‘벤치마크’도 시간을 잰 경계가 다릅니다"
      description="상자가 안쪽으로 겹칠수록 시스템의 더 작은 부분입니다. 진한 테두리가 그 측정이 시간을 잰 경계이고, 점선 상자는 그 측정에 들어 있지 않습니다."
      note="세 층의 예시 값은 본문 예시를 그대로 옮긴 것입니다. 서로 다른 층의 숫자는 같은 양이 아니므로 크기를 비교하지 않습니다."
      ariaLabel="microbenchmark, macrobenchmark, 종단 간 측정이 각각 시간을 재는 경계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <Layer depth={0} inner={scene.inner} />
            <div className="mt-2 flex justify-between gap-2 text-[11px] text-muted-foreground sm:text-xs">
              <span>안쪽(좁은 경계)일수록 원인 찾기 쉬움</span>
              <span className="text-right">바깥(넓은 경계)일수록 사용자 결과에 가까움</span>
            </div>
          </div>
        );
      }}
    />
  );
}
