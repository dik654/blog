import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scoreboard-barrier — block 256 thread = warp 8개, 한 warp 가 100 clock 예외 경로.
 * 7 × 100 = 700, 8 × 100 = 800. 넷째 장면의 512 thread → 256 thread 2개(warp 16 → 8 + 8)와
 * "한 warp 만 늦음"은 처방을 보이려는 가정.
 */
const LEFT = 30;
const SCALE = 2.8;
const TOP = 34;
const ROW = 20;
const WARPS = Array.from({ length: 8 }, (_, index) => index);
const BUSY = "#2563eb";
const BARRIER = "#64748b";
const FREE = "#16a34a";

const SCENES = [
  { label: "한 warp 만 늦습니다", summary: "256 thread = warp 8개", note: "Block 은 barrier 를 함께 맞추는 thread 묶음입니다. W0 이 barrier 앞에서 100 clock 짜리 예외 경로를 도는 동안 나머지 7개는 이미 barrier 에 도착해 있습니다." },
  { label: "기다린 쪽을 셉니다", summary: "7 × 100 = 700", note: "먼저 도착한 warp 7개는 W0 이 끝날 때까지 issue 할 instruction 이 없습니다. 그 100 clock 씩이 전부 barrier 표본입니다. 여기서는 warp 하나의 clock 하나를 표본 하나로 셉니다." },
  { label: "전체에서의 비중", summary: "700 / 800 = 87.5%", note: "Warp 8개 × 100 clock 이면 표본 800개이고 그중 700개가 barrier 입니다. 일을 한 warp 는 하나인데 표본 대부분이 barrier 로 찍힙니다. 문서는 이 경우를 barrier 앞의 갈라진 경로로 진단합니다." },
  { label: "Block 을 쪼개면", summary: "기다리는 warp 15 → 7 (가정)", note: "쪼개면 한 barrier 를 기다리는 warp 수가 줄어 eligible warp(다음 instruction 을 낼 준비가 된 warp)가 늘어납니다. 다만 block 마다 shared memory 를 따로 잡으므로 SM 에 함께 올릴 수 있는 warp 수(occupancy)의 새 한도가 될 수 있습니다." },
] as const;

function Grid({ x, y, cols, cells }: { x: number; y: number; cols: number; cells: readonly ("busy" | "bar" | "free")[] }) {
  const color = { busy: BUSY, bar: BARRIER, free: FREE };
  const mark = { busy: "일", bar: "B", free: "E" };
  return (
    <g>
      {cells.map((cell, index) => {
        const cx = x + (index % cols) * 26;
        const cy = y + Math.floor(index / cols) * 26;
        return (
          <g key={index}>
            <rect x={cx} y={cy} width={23} height={23} fill={color[cell]} fillOpacity={0.22} stroke={color[cell]} strokeWidth={1} strokeDasharray={cell === "bar" ? "3 2" : undefined} />
            <text x={cx + 11.5} y={cy + 16} textAnchor="middle" fontSize={11} fill="currentColor">{mark[cell]}</text>
          </g>
        );
      })}
    </g>
  );
}

const fill = (kind: "bar" | "free", count: number) => Array.from({ length: count }, () => kind);

export default function BarrierSamplesViz() {
  return (
    <SceneShell
      eyebrow="Barrier 표본 세기"
      title="한 warp 가 100 clock 늦으면 표본 800개 중 700개가 barrier 입니다"
      description="가로줄 하나가 warp, 막대 길이가 clock 입니다. 256 thread·100 clock 은 글의 예이고, 넷째 장면의 512 thread 와 “한 warp 만 늦음”은 가정입니다."
      ariaLabel="한 warp 가 늦을 때 barrier 표본이 쌓이는 셈과 block 을 쪼갠 결과"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 ? (
            <g>
              <text x={LEFT} y={14} fontSize={11} fill="currentColor">0</text>
              <text x={LEFT + 100 * SCALE} y={14} textAnchor="end" fontSize={11} fill="currentColor">100 clock</text>
              <line x1={LEFT} x2={LEFT + 100 * SCALE} y1={22} y2={22} stroke="#94a3b8" strokeWidth={1} />
              {WARPS.map((warp) => {
                const y = TOP + warp * ROW;
                const isBusy = warp === 0;
                return (
                  <g key={warp}>
                    <text x={0} y={y + 12} fontSize={11} fill="currentColor">W{warp}</text>
                    {isBusy ? (
                      <rect x={LEFT} y={y} width={100 * SCALE} height={15} fill={BUSY} fillOpacity={0.3} stroke={BUSY} strokeWidth={1} />
                    ) : active === 0 ? (
                      <rect x={LEFT} y={y} width={100 * SCALE} height={15} fill="none" stroke="#94a3b8" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 3" />
                    ) : (
                      <rect x={LEFT} y={y} width={100 * SCALE} height={15} fill={BARRIER} fillOpacity={0.35} stroke={BARRIER} strokeWidth={1} strokeDasharray="3 2" />
                    )}
                    <text x={LEFT + 6} y={y + 12} fontSize={11} fill="currentColor">
                      {isBusy ? "barrier 앞 예외 경로" : active === 0 ? "barrier 도착, 대기" : "barrier 표본 100"}
                    </text>
                  </g>
                );
              })}
              {active === 2 && (
                <g>
                  <path d={`M${LEFT + 100 * SCALE + 3},${TOP + ROW} h5 v${7 * ROW - 5} h-5`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                  <text x={LEFT + 100 * SCALE + 12} y={TOP + ROW * 4 + 8} fontSize={13} fontWeight={700} fill="currentColor">700</text>
                </g>
              )}
            </g>
          ) : (
            <g>
              <text x={0} y={16} fontSize={12} fontWeight={700} fill="currentColor">512 thread 한 block</text>
              <text x={0} y={34} fontSize={11} fill="currentColor">warp 16개 · 15개 대기</text>
              <Grid x={0} y={46} cols={4} cells={["busy", ...fill("bar", 15)]} />
              <text x={136} y={100} fontSize={14} fill="currentColor">→</text>
              <text x={160} y={16} fontSize={12} fontWeight={700} fill="currentColor">256 thread 두 block</text>
              <text x={160} y={34} fontSize={11} fill="currentColor">block A: 7개 대기</text>
              <Grid x={160} y={46} cols={4} cells={["busy", ...fill("bar", 7)]} />
              <text x={160} y={118} fontSize={11} fill="currentColor">block B: 이 barrier 와 무관</text>
              <Grid x={160} y={130} cols={4} cells={fill("free", 8)} />
              <g fontSize={11} fill="currentColor">
                <text x={0} y={172}>일: 예외 경로</text>
                <text x={0} y={188}>B: barrier 대기</text>
                <text x={0} y={204}>E: eligible 될 수 있음</text>
              </g>
            </g>
          )}
        </svg>
      )}
    />
  );
}
