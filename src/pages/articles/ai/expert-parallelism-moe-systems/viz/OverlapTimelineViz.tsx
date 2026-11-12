import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism(7절) 넷째 문단 — dispatch→계산→combine은 의존 순서이고, chunk를 겹치면 처리량이 좋아질 수
 * 있지만 두 시간의 max는 이상적인 겹침의 하한일 뿐이다.
 * 본문 수치: remote 왕복 56MiB / 50GB/s = 1.174ms(편도 0.587ms), 450GB/s면 0.130ms(편도 0.065ms),
 * 균형 계산 1.847ms. 차례로 하면 0.587 + 1.847 + 0.587 = 3.021ms(단순 합).
 * chunk 4개 균등 분할과 통신이 계산 자원을 빼앗지 않는다는 조건은 설명용 가정이다.
 * 4-chunk 일정: dispatch 0.147ms씩 연속, 계산 0.462ms씩 연속(첫 dispatch 뒤 시작), 마지막 combine 0.147ms
 * → 0.147 + 4×0.462 + 0.147 = 2.140ms.
 */
const COMM_ROUND = (56 * 2 ** 20) / 50e9 * 1e3; // 1.174 ms
const COMM_FAST = (56 * 2 ** 20) / 450e9 * 1e3; // 0.130 ms
const COMPUTE = (4096 * 6 * 4096 * 11008) / 600e12 * 1e3; // 1.847 ms
const AXIS = 3.2;
const CHUNKS = 4;

type Bar = { lane: 0 | 1; start: number; len: number; kind: "dispatch" | "compute" | "combine" | "unknown" };

function serial(comm: number): Bar[] {
  const half = comm / 2;
  return [
    { lane: 0, start: 0, len: half, kind: "dispatch" },
    { lane: 1, start: half, len: COMPUTE, kind: "compute" },
    { lane: 0, start: half + COMPUTE, len: half, kind: "combine" },
  ];
}

function chunked(comm: number): Bar[] {
  const d = comm / 2 / CHUNKS;
  const c = COMPUTE / CHUNKS;
  const idx = Array.from({ length: CHUNKS }, (_, i) => i);
  const dispatches: Bar[] = idx.map((i): Bar => ({ lane: 0, start: i * d, len: d, kind: "dispatch" }));
  const computes: Bar[] = idx.map((i): Bar => ({ lane: 1, start: d + i * c, len: c, kind: "compute" }));
  const combines: Bar[] = idx.map((i): Bar => ({ lane: 0, start: d + (i + 1) * c, len: d, kind: "combine" }));
  return [...dispatches, ...computes, ...combines];
}

const endOf = (bars: readonly Bar[]) => bars.reduce<number>((m, b) => Math.max(m, b.start + b.len), 0);

const SCENES = [
  {
    label: "두 작업의 길이",
    summary: "통신 1.174ms · 계산 1.847ms",
    bars: [
      { lane: 0, start: 0, len: COMM_ROUND, kind: "dispatch" },
      { lane: 1, start: 0, len: COMPUTE, kind: "compute" },
    ] as Bar[],
    bound: null as number | null,
    note: "50GB/s(가정한 유효 단방향)에서 remote 왕복 56MiB는 1.174ms, 균형 계산은 1.847ms입니다. 아직 순서 없이 길이만 놓았습니다.",
  },
  {
    label: "차례로 하면",
    summary: "0.587 + 1.847 + 0.587 = 3.021ms",
    bars: serial(COMM_ROUND),
    bound: null,
    note: "token 하나는 dispatch → 계산 → combine 순서입니다. 전체를 한 덩어리로 처리하면 세 구간이 이어져 3.021ms입니다.",
  },
  {
    label: "chunk 4개로 겹치면",
    summary: "2.140ms ≥ 하한 1.847ms",
    bars: chunked(COMM_ROUND),
    bound: Math.max(COMM_ROUND, COMPUTE),
    note: "다른 chunk의 통신과 계산을 겹쳐도 첫 dispatch와 마지막 combine은 남아 2.140ms입니다. max 1.847ms는 보장이 아니라 하한입니다.",
  },
  {
    label: "통신도 GPU 자원을 쓴다",
    summary: "계산 구간이 얼마나 늘지는 측정",
    bars: [...chunked(COMM_ROUND), { lane: 1, start: COMM_ROUND / 2 / CHUNKS + COMPUTE, len: 0, kind: "unknown" }] as Bar[],
    bound: Math.max(COMM_ROUND, COMPUTE),
    note: "통신도 SM과 메모리를 써서 겹치는 동안 계산이 느려질 수 있습니다. 얼마나 늘지는 측정해야 알아 '+ ?'로만 표시했습니다.",
  },
  {
    label: "450GB/s라면",
    summary: "차례로 1.977ms · 하한 1.847ms",
    bars: serial(COMM_FAST),
    bound: Math.max(COMM_FAST, COMPUTE),
    note: "가정한 유효 450GB/s면 왕복은 약 0.130ms입니다. 차례로 해도 1.977ms라 하한 1.847ms와 차이가 작고 계산이 끝을 정합니다.",
  },
] as const;

const COLORS = { dispatch: "#d97706", combine: "#0d9488", compute: "#2563eb", unknown: "#2563eb" } as const;
const LANES = ["통신", "계산"] as const;

export default function OverlapTimelineViz() {
  return (
    <SceneShell
      eyebrow="Overlap"
      title="통신과 계산을 겹쳐도 끝나는 시각은 두 시간의 max보다 앞당겨지지 않습니다"
      description="가로축은 한 GPU의 시간(ms)입니다. 위 줄은 통신, 아래 줄은 expert 계산입니다. 7절의 가정 수치(56MiB, 50GB/s, 600TFLOP/s)를 그대로 썼고, chunk 4개 균등 분할은 설명용 가정입니다."
      note="고정 지연, 경합, metadata는 넣지 않았습니다. 가장 바쁜 GPU가 1.75배를 받는 경우는 1절 그림이 다룹니다."
      ariaLabel="통신과 계산을 차례로 할 때와 chunk로 겹칠 때의 한 GPU 시간표"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const bars: readonly Bar[] = scene.bars;
        const end = endOf(bars.filter((b) => b.kind !== "unknown"));
        const ordered = active > 0;
        const open = bars.some((b) => b.kind === "unknown");
        const pct = (v: number) => `${(v / AXIS) * 100}%`;
        return (
          <div className="min-w-0">
            <div className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-2 gap-y-2 text-xs">
              <div className="pointer-events-none absolute bottom-5 right-0 top-0 z-10" style={{ left: "3.25rem" }} aria-hidden="true">
                {scene.bound !== null && (
                  <span className="absolute inset-y-0 border-l border-dashed border-[#7c3aed]" style={{ left: pct(scene.bound) }} />
                )}
                {ordered && <span className="absolute inset-y-0 border-l-2 border-foreground" style={{ left: pct(end) }} />}
              </div>
              {LANES.map((lane, li) => (
                <div key={lane} className="contents">
                  <span className="self-center text-muted-foreground">{lane}</span>
                  <div className="relative h-8 rounded-sm bg-muted/40">
                    {bars
                      .filter((b) => b.lane === li)
                      .map((b, i) =>
                        b.kind === "unknown" ? (
                          <span
                            key={i}
                            className="absolute inset-y-1 flex items-center rounded-[3px] border border-dashed border-[#2563eb] px-1 font-mono text-[11px] font-bold text-[#2563eb]"
                            style={{ left: pct(b.start) }}
                          >
                            + ?
                          </span>
                        ) : (
                        <div
                          key={i}
                          className="absolute inset-y-1 rounded-[3px] border"
                          style={{
                            left: pct(b.start),
                            width: pct(b.len),
                            borderColor: COLORS[b.kind],
                            backgroundColor: `${COLORS[b.kind]}${b.kind === "compute" ? "40" : "55"}`,
                          }}
                        />
                        ),
                      )}
                  </div>
                </div>
              ))}
              <span />
              <div className="relative h-5">
                {[0, 1, 2, 3].map((t) => (
                  <span key={t} className="absolute top-0 -translate-x-1/2 font-mono text-[10px] text-muted-foreground" style={{ left: pct(t) }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#d9770655", border: "1px solid #d97706" }} />
                {active === 0 ? "remote 왕복" : "dispatch"}
              </span>
              <span className={active === 0 ? "invisible" : ""}>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#0d948855", border: "1px solid #0d9488" }} />
                combine
              </span>
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#2563eb40", border: "1px solid #2563eb" }} />
                expert 계산
              </span>
              <span className={ordered ? "" : "invisible"}>
                <span className="mr-1 inline-block h-2.5 w-0.5 bg-foreground align-middle" /> 끝나는 시각 {end.toFixed(3)}ms{open ? " 이상" : ""}
              </span>
              <span className={scene.bound === null ? "invisible" : ""}>
                <span className="mr-1 inline-block h-2.5 border-l border-dashed border-[#7c3aed] align-middle" /> 하한 max = {(scene.bound ?? 0).toFixed(3)}ms
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
