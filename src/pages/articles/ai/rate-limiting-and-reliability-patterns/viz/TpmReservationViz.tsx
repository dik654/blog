import SceneShell from "./SceneShell";

/**
 * 본문 대응: #token-reservation — 분당 240,000 token, prompt 1,000, max_tokens 4,000, 실제 출력 200.
 * ⌊240,000/5,000⌋ = 48건, 48×1,200 = 57,600 (24%).
 * max_tokens 300: ⌊240,000/1,300⌋ = 184건, 184×1,300 = 239,200, 184×1,200 = 220,800 (92%).
 * 정산, 진행 중 4건(가정): ⌊220,000/1,200⌋ = 183, 183×1,200 = 219,600, 합계 239,600, 183+4 = 187건, 187×1,200 = 224,400 (93.5%).
 */
const W = 360;
const H = 176;
const LEFT = 14;
const BAR = 332;
const LIMIT = 240000;
const BLUE = "#2563eb";
const SLATE = "#64748b";
const AMBER = "#d97706";

type Cell = { reserved: number; actual: number };
const repeat = (count: number, cell: Cell) => Array.from({ length: count }, () => cell);

const SCENES = [
  {
    label: "한 건을 받을 때",
    summary: "1,000 + 4,000 = 5,000",
    zoom: [{ v: 1000, kind: "input" }, { v: 4000, kind: "unknown" }],
    zoomText: "prompt 1,000 + max_tokens 4,000 → 5,000을 잡음",
    cells: repeat(1, { reserved: 5000, actual: 0 }),
    totalText: "카운터 5,000 / 240,000",
    note: "TPM 한도는 분당 token 상한이고, max_tokens는 요청이 출력할 수 있는 token 상한입니다. 입력은 바로 세지만 출력은 아직 모르므로 도착 시점에 상한까지 더해 카운터에 올립니다.",
  },
  {
    label: "48건이면 한도가 찹니다",
    summary: "실제 57,600 · 24%",
    zoom: [{ v: 1000, kind: "input" }, { v: 200, kind: "output" }, { v: 3800, kind: "unused" }],
    zoomText: "prompt 1,000 + 출력 200 + 안 쓴 3,800",
    cells: repeat(48, { reserved: 5000, actual: 1200 }),
    totalText: "카운터 240,000 · 실제 57,600 → 다음 요청 429",
    note: "칸 하나가 요청 하나입니다. 48칸으로 막대가 찼지만 칠해진 실제 사용량은 24%입니다. 그런데도 다음 요청은 한도 초과 거절 응답인 429를 받습니다.",
  },
  {
    label: "Max_tokens를 300으로 줄이면",
    summary: "184건 · 실제 220,800",
    zoom: [{ v: 1000, kind: "input" }, { v: 200, kind: "output" }, { v: 100, kind: "unused" }],
    zoomText: "prompt 1,000 + 출력 200 + 안 쓴 100",
    cells: repeat(184, { reserved: 1300, actual: 1200 }),
    totalText: "카운터 239,200 · 실제 220,800 (92%)",
    note: "요청마다 1,300만 잡으니 184건까지 받습니다. 빈 몫이 줄어 실제 사용량이 한도의 92%까지 올라옵니다. 문서가 max_tokens를 필요한 만큼만 두라고 권하는 이유입니다.",
  },
  {
    label: "끝날 때 돌려주면",
    summary: "약 187건 · 진행 중 4건(가정)",
    zoom: [{ v: 1000, kind: "input" }, { v: 200, kind: "output" }],
    zoomText: "끝난 요청은 1,200만 남고 3,800을 돌려받음",
    cells: [...repeat(183, { reserved: 1200, actual: 1200 }), ...repeat(4, { reserved: 5000, actual: 0 })],
    totalText: "끝난 219,600 + 진행 중 20,000 = 239,600",
    note: "max_tokens를 다시 4,000으로 둔 경우입니다. 진행 중 4건만 5,000씩 묶이고 끝난 요청은 1,200만 남아 약 187건을 받습니다. 끝난 뒤 돌려주는 정산은 이 글이 제안하는 설계이며 Azure 문서에는 없습니다.",
  },
] as const;

const ZOOM_STYLE = {
  input: { fill: SLATE, stroke: "none", dash: undefined },
  output: { fill: BLUE, stroke: "none", dash: undefined },
  unknown: { fill: "none", stroke: AMBER, dash: "3 2" },
  unused: { fill: AMBER, fillOpacity: 0.25, stroke: AMBER, dash: undefined },
} as const;

export default function TpmReservationViz() {
  return (
    <SceneShell
      eyebrow="카운터와 실제 사용량"
      title="한도를 채운 것은 실제 사용량이 아니라 잡아 둔 최대치입니다"
      description="위 막대는 요청 한 건을 확대한 것이고 아래 막대는 분당 한도 240,000 전체입니다. 진하게 칠한 부분은 실제 token, 옅은 주황은 잡아 두었지만 쓰지 않은 양입니다. 문자 수 기반 근사 오차는 넣지 않았습니다."
      ariaLabel="요청 하나의 예약량과 실제 사용량, 분당 한도에서 차지하는 비율"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        let zoomAt = LEFT;
        let usedAt = 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}. ${scene.totalText}`}>
            <text x={LEFT} y={12} fontSize={11} fontWeight={700} fill={SLATE}>요청 한 건 (막대 전체 = 5,000)</text>
            <rect x={LEFT} y={20} width={BAR} height={22} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.75} opacity={0.5} />
            {scene.zoom.map((part, index) => {
              const width = (part.v / 5000) * BAR;
              const style = ZOOM_STYLE[part.kind];
              const at = zoomAt;
              zoomAt += width;
              return <rect key={index} x={at} y={20} width={width} height={22} fill={style.fill} fillOpacity={"fillOpacity" in style ? style.fillOpacity : undefined} stroke={style.stroke} strokeWidth={1} strokeDasharray={style.dash} />;
            })}
            <text x={LEFT} y={60} fontSize={11.5} fill={SLATE}>{scene.zoomText}</text>

            <text x={LEFT} y={92} fontSize={11} fontWeight={700} fill={SLATE}>분당 한도 240,000</text>
            <rect x={LEFT} y={100} width={BAR} height={30} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {scene.cells.map((cell, index) => {
              const width = (cell.reserved / LIMIT) * BAR;
              const solid = (cell.actual / LIMIT) * BAR;
              const at = LEFT + usedAt;
              usedAt += width;
              return (
                <g key={index}>
                  {/* 184칸처럼 칸이 좁으면 테두리가 칸 폭의 40%를 덮어 8%인 빈 몫을 부풀리므로, 넓은 칸에만 테두리를 긋습니다. */}
                  {cell.actual < cell.reserved && <rect x={at} y={100} width={width} height={30} fill={AMBER} fillOpacity={0.25} stroke={width >= 5 ? AMBER : "none"} strokeWidth={0.75} />}
                  {solid > 0 && <rect x={at} y={100} width={solid} height={30} fill={BLUE} />}
                </g>
              );
            })}
            <text x={LEFT} y={150} fontSize={12} fontWeight={700} fill={BLUE}>{scene.totalText}</text>
          </svg>
        );
      }}
    />
  );
}
