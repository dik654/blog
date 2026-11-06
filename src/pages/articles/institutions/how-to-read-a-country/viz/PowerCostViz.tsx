import Arrow from "./Arrow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단 — 공장의 전기 수요 → 설비·연료 → 누가 짓고 요금을 정하는가 → 기업 비용·가계 부담,
 * 전력회사의 부족한 돈을 정부가 채우면 세금이나 차입까지.
 */
const BOXES = [
  { key: "need", x: 10, y: 8, w: 150, lines: ["공장이 전기를", "더 필요로 합니다"] },
  { key: "fuel", x: 200, y: 8, w: 150, lines: ["설비와 연료를", "확보해야 합니다"] },
  { key: "who", x: 50, y: 88, w: 260, lines: ["누가 시설을 짓고", "누가 요금을 정하는가"] },
  { key: "firm", x: 6, y: 168, w: 106, lines: ["기업의 비용"] },
  { key: "home", x: 127, y: 168, w: 106, lines: ["가계 부담"] },
  { key: "gap", x: 248, y: 168, w: 106, lines: ["전력회사의", "부족한 돈"] },
  { key: "gov", x: 248, y: 248, w: 106, lines: ["정부가", "채우면"] },
  { key: "tax", x: 110, y: 248, w: 106, lines: ["세금이나", "차입"] },
] as const;
const BOX_H = 48;

const ARROWS = [
  { from: "need", x1: 160, y1: 32, x2: 200, y2: 32 },
  { from: "who", x1: 275, y1: 56, x2: 275, y2: 88 },
  { from: "firm", x1: 90, y1: 136, x2: 62, y2: 168 },
  { from: "home", x1: 180, y1: 136, x2: 180, y2: 168 },
  { from: "gap", x1: 270, y1: 136, x2: 298, y2: 168 },
  { from: "gov", x1: 301, y1: 216, x2: 301, y2: 248 },
  { from: "tax", x1: 248, y1: 272, x2: 216, y2: 272 },
] as const;

const SHOWN: readonly (readonly string[])[] = [
  ["need", "fuel"],
  ["need", "fuel", "who"],
  ["need", "fuel", "who", "firm", "home"],
  ["need", "fuel", "who", "firm", "home", "gap", "gov", "tax"],
  ["firm", "home", "tax"],
];

const SCENES = [
  { label: "생산에서 출발", summary: "전기 수요 → 설비·연료", note: "공장이 전기를 더 필요로 하면 설비와 연료부터 확보해야 합니다. 여기까지는 생산의 이야기입니다." },
  { label: "갈리는 자리", summary: "누가 짓고 누가 정하는가", note: "시설을 누가 짓고 요금을 누가 정하는지가 다음 갈래를 정합니다." },
  { label: "두 갈래의 부담", summary: "기업의 비용 · 가계 부담", note: "그 결정에 따라 기업의 비용과 가계 부담이 달라집니다." },
  { label: "정부로 넘어가는 갈래", summary: "채우면 세금이나 차입까지", note: "전력회사의 돈이 부족할 때 정부가 채운다면, 이 흐름은 세금이나 차입까지 이어집니다. 채우는 경우의 갈래입니다." },
  { label: "생산만 보면", summary: "비용을 떠안는 쪽을 놓칩니다", note: "남겨 둔 세 칸이 생산만 봐서는 보이지 않는 자리입니다." },
] as const;

const ACCENT = "#2563eb";
const LINE = "#94a3b8";

export default function PowerCostViz() {
  return (
    <SceneShell
      eyebrow="전기 수요의 갈래"
      title="공장의 전기 수요가 누구의 부담으로 이어지는지 따라갑니다"
      description="금액은 정하지 않았습니다. 칸은 누가 관련되는지만 보여 주고 크기는 양이 아닙니다."
      ariaLabel="공장의 전기 수요에서 기업 비용, 가계 부담, 세금이나 차입으로 갈라지는 그림"
      scenes={SCENES}
      render={(active) => {
        const shown = SHOWN[active];
        return (
          <svg viewBox="0 0 360 304" className="mx-auto h-auto w-full max-w-[430px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {ARROWS.map((a) => {
              const isOn = active === 4 ? false : shown.includes(a.from);
              return <Arrow key={a.from} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} color={LINE} opacity={isOn ? 1 : 0.18} dashed={a.from === "gov"} />;
            })}
            {BOXES.map((box) => {
              const on = shown.includes(box.key);
              const strong = active === 4 && on;
              return (
                <g key={box.key} opacity={on ? 1 : 0.2}>
                  <rect x={box.x} y={box.y} width={box.w} height={BOX_H} rx={8} fill="none" stroke={strong ? ACCENT : LINE} strokeWidth={strong ? 1.25 : 1} strokeDasharray={box.key === "gov" ? "4 3" : undefined} />
                  {box.lines.map((line, l) => (
                    <text key={line} x={box.x + box.w / 2} y={box.y + BOX_H / 2 + 4 + (l - (box.lines.length - 1) / 2) * 16} textAnchor="middle" fontSize={12} fontWeight={strong ? 700 : 500} fill="currentColor">{line}</text>
                  ))}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
