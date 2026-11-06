import SceneShell from "./SceneShell";

/**
 * 본문 대응: #divergence — 가로 lane 32칸, 세로 issue slot. 같은 축척에서 세 경우를 비교한다.
 * 10 slot 320/320, 20 slot 320/640 = 50%, 40 slot 340/1280 = 26.5625%.
 */
const LEFT = 42;
const TOP = 22;
const LANE = 9;
const SLOT = 6;
const INK = "#64748b";
const PATH_A = "#2563eb";
const PATH_B = "#d97706";

const BLOCKS = [
  { slots: 10, paths: [{ lane: 0, lanes: 32, from: 0, to: 10, color: PATH_A, text: "모두 같은 경로 · 명령 10개" }] },
  {
    slots: 20,
    paths: [
      { lane: 0, lanes: 16, from: 0, to: 10, color: PATH_A, text: "경로 A · 명령 10개" },
      { lane: 16, lanes: 16, from: 10, to: 20, color: PATH_B, text: "경로 B · 명령 10개" },
    ],
  },
  {
    slots: 40,
    paths: [
      { lane: 0, lanes: 1, from: 0, to: 30, color: PATH_B, text: "예외 경로 · lane 1개 · 명령 30개" },
      { lane: 1, lanes: 31, from: 30, to: 40, color: PATH_A, text: "lane 31개 · 명령 10개" },
    ],
  },
] as const;

const SCENES = [
  { label: "갈리지 않을 때", summary: "slot 10 · 320/320 = 100%", note: "뒤의 두 경우와 비교할 기준입니다. Lane 32개가 모두 명령 10개의 경로를 가면 slot 10개의 모든 자리가 유효한 일입니다." },
  { label: "16개와 16개로 갈릴 때", summary: "slot 20 · 320/640 = 50%", note: "두 경로를 각각 발행하므로 slot이 20개입니다. 유효한 lane 명령은 160+160 = 320개이고, 가능한 32×20 = 640개 자리의 절반입니다." },
  { label: "1개만 긴 경로로 갈 때", summary: "slot 40 · 340/1280 = 26.5625%", note: "유효한 lane 명령은 30+310 = 340개입니다. 기준의 4배 slot이지만 실행 시간이 반드시 4배라는 뜻은 아닙니다. 실제 compiler는 짧은 분기를 predication(분기 없이 조건부로 실행)으로 바꾸거나 경로를 최적화할 수 있습니다." },
] as const;

export default function LaneOccupancyViz() {
  return (
    <SceneShell
      eyebrow="Warp 안의 참여 자리"
      title="경로가 갈리면 slot은 늘고 채워지는 자리의 비율은 줄어듭니다"
      description="가로 32칸이 lane, 세로 한 줄이 issue slot 하나입니다. 파랑·주황 칸만 유효한 lane 명령이고 회색 칸은 참여하지 않는 자리입니다. 분기·재합류 명령을 뺀 모형이며 경로의 앞뒤와 예외 lane의 위치는 그림의 가정입니다."
      ariaLabel="경로 갈림에 따른 lane과 slot 사용 비율 비교"
      scenes={SCENES}
      render={(index) => {
        const block = BLOCKS[index];
        return (
          <svg viewBox="0 0 360 272" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <text x={LEFT} y={14} fontSize={12} fill={INK}>lane 1 → 32</text>
            <rect x={LEFT} y={TOP} width={32 * LANE} height={block.slots * SLOT} fill="#94a3b8" opacity={0.2} stroke="#94a3b8" strokeWidth={1} />
            {block.paths.map((path) => (
              <g key={path.text}>
                <rect x={LEFT + path.lane * LANE} y={TOP + path.from * SLOT} width={path.lanes * LANE} height={(path.to - path.from) * SLOT} fill={path.color} />
                <text x={path.lanes === 1 ? LEFT + LANE + 8 : LEFT + path.lane * LANE + (path.lanes * LANE) / 2} y={TOP + path.from * SLOT + ((path.to - path.from) * SLOT) / 2 + 4} textAnchor={path.lanes === 1 ? "start" : "middle"} fontSize={12} fontWeight={700} fill={path.lanes === 1 ? PATH_B : "#ffffff"}>
                  {path.text}
                </text>
              </g>
            ))}
            {[10, 20, 30, 40].map((tick) => (
              <g key={tick}>
                <line x1={LEFT - 4} x2={LEFT} y1={TOP + tick * SLOT} y2={TOP + tick * SLOT} stroke={INK} strokeWidth={1} />
                <text x={LEFT - 7} y={TOP + tick * SLOT + 4} textAnchor="end" fontSize={11} fill={INK}>{tick}</text>
              </g>
            ))}
            <text x={LEFT - 7} y={TOP + 9} textAnchor="end" fontSize={11} fill={INK}>slot</text>
          </svg>
        );
      }}
    />
  );
}
