import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 첫 문단(과 #black-box 첫 문단의 사용권 전환).
 * 원주민 공동체의 땅 → 조약·법률·강제 이주로 국가가 경계를 정하고 처분 → 1862.5.20 홈스테드법(160에이커, 적은 수수료, 5년 거주·경작, 성인 가장)
 * → 토지를 담보로 신용 → 1862.7.1 태평양철도법(연방 토지·대출) → 노선 주변 지가·세수 상승, 노선 밖·강제 이주된 공동체에는 같은 편익 없음.
 * 칸 수와 배치는 설명용이며 실제 측량 단위나 지도가 아닙니다.
 */
const W = 360;
const H = 200;
const MAP_X = 16;
const MAP_Y = 20;
const CELL = 40;
const COLS = 6;
const ROWS = 4;
const MAP_W = COLS * CELL;
const MAP_H = ROWS * CELL;
const RAIL_Y = MAP_Y + 2 * CELL;
const HOME = { col: 1, row: 0 };
const SIDE_X = MAP_X + MAP_W + 14;
const SIDE_W = W - SIDE_X - 8;

const SCENES = [
  { label: "공동체의 땅", summary: "사용·통치하던 영토", note: "출발점은 빈 땅이 아니라 원주민 공동체가 사용하고 다스리던 땅입니다. 사냥·경작·이동·정치 권리가 이 땅에 붙어 있었습니다." },
  { label: "경계를 긋고 처분", summary: "조약·법률·강제 이주 → 필지", note: "조약·법률·강제 이주로 연방과 주가 이 땅을 측량하고 처분 가능한 재산으로 바꿉니다. 토지 가격만 보면 사라진 사용권은 장부 밖으로 밀려납니다." },
  { label: "홈스테드법 · 1862.5.20", summary: "160에이커 → 소유 → 담보", note: "홈스테드법은 측량된 공유지 160에이커를 적은 수수료와 5년 거주·경작 조건으로 성인 가장에게 넘겼습니다. 경계가 정해진 토지를 가진 정착민은 그 토지를 담보로 신용을 얻을 수 있습니다." },
  { label: "태평양철도법 · 1862.7.1", summary: "노선 주변만 지가·세수↑", note: "태평양철도법은 대륙횡단 철도 건설에 연방 토지와 대출을 지원했습니다. 철도는 농산물·광물·사람을 항구와 공장에 잇고 주변 지가와 세수를 높이지만, 노선 밖 지역과 강제 이주된 공동체에는 같은 편익이 돌아가지 않습니다." },
] as const;

const DETAILS = [
  ["권리: 사냥 · 경작 · 이동 · 정치", "연방·주가 처분할 재산이 아님"],
  ["국가가 경계를 정함", "처분 가능한 필지 · 공동체는 밖으로"],
  ["160에이커 · 적은 수수료 · 5년 거주·경작", "소유권 → 토지 담보 신용"],
  ["노선 주변: 지가 · 세수 상승", "노선 밖 · 강제 이주된 공동체: 같은 편익 없음"],
] as const;

export default function LandToCollateralViz() {
  return (
    <SceneShell
      eyebrow="토지에서 담보와 철도로"
      title="공동체의 땅이 필지가 되고, 필지가 담보가 되고, 노선이 지가를 가릅니다"
      description="왼쪽 사각형이 한 지역, 칸 하나가 측량된 필지입니다. 칸 수와 배치는 설명용이며 실제 지도나 측량 단위가 아닙니다(가정)."
      ariaLabel="원주민 공동체의 땅이 측량된 필지와 홈스테드, 담보, 철도 노선 주변의 지가 상승으로 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const surveyed = active >= 1;
        const rail = active === 3;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={MAP_X} y={MAP_Y} width={MAP_W} height={MAP_H} rx={4} fill={surveyed ? "none" : "#fde68a"} fillOpacity={surveyed ? 0 : 0.45} stroke="#94a3b8" strokeWidth={1} />
              {!surveyed && (
                <>
                  <text x={MAP_X + MAP_W / 2} y={MAP_Y + MAP_H / 2 - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#92400e">원주민 공동체가</text>
                  <text x={MAP_X + MAP_W / 2} y={MAP_Y + MAP_H / 2 + 14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#92400e">사용·통치하던 땅</text>
                </>
              )}
              {surveyed &&
                Array.from({ length: COLS * ROWS }, (_, index) => {
                  const col = index % COLS;
                  const row = Math.floor(index / COLS);
                  const isHome = col === HOME.col && row === HOME.row && active >= 2;
                  const nearRail = rail && (row === 1 || row === 2);
                  const fill = isHome ? "#2563eb" : nearRail ? "#16a34a" : "none";
                  return (
                    <rect
                      key={index}
                      x={MAP_X + col * CELL + 2}
                      y={MAP_Y + row * CELL + 2}
                      width={CELL - 4}
                      height={CELL - 4}
                      rx={3}
                      fill={fill}
                      fillOpacity={isHome ? 0.85 : nearRail ? 0.3 : 0}
                      stroke="#94a3b8"
                      strokeWidth={1}
                    />
                  );
                })}
              {active >= 2 && (
                <text x={MAP_X + HOME.col * CELL + CELL / 2} y={MAP_Y + HOME.row * CELL + CELL / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">160</text>
              )}
              {rail && (
                <>
                  <line x1={MAP_X} x2={SIDE_X} y1={RAIL_Y} y2={RAIL_Y} stroke="#64748b" strokeWidth={1.25} />
                  {Array.from({ length: 13 }, (_, i) => (
                    <line key={i} x1={MAP_X + 8 + i * 20} x2={MAP_X + 8 + i * 20} y1={RAIL_Y - 3} y2={RAIL_Y + 3} stroke="#64748b" strokeWidth={1} />
                  ))}
                  <text x={MAP_X + 4} y={MAP_Y + MAP_H + 14} fontSize={11} fill="#16a34a">초록 = 노선 주변 필지</text>
                </>
              )}
              <rect x={SIDE_X} y={RAIL_Y - 20} width={SIDE_W} height={40} rx={6} fill="none" stroke={rail ? "#64748b" : "#cbd5e1"} strokeWidth={1} />
              <text x={SIDE_X + SIDE_W / 2} y={RAIL_Y + 4} textAnchor="middle" fontSize={11} fill={rail ? "#64748b" : "#94a3b8"}>항구·공장</text>
              <g opacity={surveyed ? 1 : 0}>
              <rect
                x={SIDE_X}
                y={MAP_Y + MAP_H - 44}
                width={SIDE_W}
                height={44}
                rx={6}
                fill="none"
                stroke={!surveyed ? "#e2e8f0" : rail ? "#dc2626" : "#94a3b8"}
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <text x={SIDE_X + SIDE_W / 2} y={MAP_Y + MAP_H - 26} textAnchor="middle" fontSize={11} fill={!surveyed ? "#cbd5e1" : rail ? "#dc2626" : "#64748b"}>강제 이주된</text>
              <text x={SIDE_X + SIDE_W / 2} y={MAP_Y + MAP_H - 12} textAnchor="middle" fontSize={11} fill={!surveyed ? "#cbd5e1" : rail ? "#dc2626" : "#64748b"}>공동체</text>
              </g>
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={DETAILS.map(([first, second], index) => (
                <div key={index} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-xs">
                  <span className="rounded-md border border-border px-2 py-1.5 text-center">{first}</span>
                  <span aria-hidden className="text-muted-foreground">{index === 3 ? "/" : "→"}</span>
                  <span className="rounded-md border border-primary px-2 py-1.5 text-center font-semibold">{second}</span>
                </div>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
