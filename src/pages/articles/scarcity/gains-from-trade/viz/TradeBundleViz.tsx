import SceneShell from "./SceneShell";

/**
 * 본문 대응: where-gain-comes-from 절 — 특화하고 주고받으면 둘 다 혼자서는 닿지 못하던 조합에 닿는다.
 * 경계선: 가온 빵 8판 또는 케이크 4개, 나루 빵 3판 또는 케이크 3개(기회비용이 일정하다는 글의 가정이라 직선).
 * 혼자: 가온 (빵 4, 케이크 2), 나루 (빵 3, 케이크 0).
 * 특화: 가온 (8, 0), 나루 (0, 3). 가온이 빵 3판을 주고 나루가 케이크 2개를 준다.
 * 교환 뒤: 가온 (5, 2), 나루 (3, 1). 가온 경계선 위 빵은 8 − 2×2 = 4판, 나루 경계선 위 케이크는 3 − 3 = 0개.
 */
interface Point {
  bread: number;
  cake: number;
}

const PEOPLE = [
  {
    name: "가온",
    maxBread: 8,
    maxCake: 4,
    alone: { bread: 4, cake: 2 },
    special: { bread: 8, cake: 0 },
    after: { bread: 5, cake: 2 },
    gives: "빵 3판을 줌",
  },
  {
    name: "나루",
    maxBread: 3,
    maxCake: 3,
    alone: { bread: 3, cake: 0 },
    special: { bread: 0, cake: 3 },
    after: { bread: 3, cake: 1 },
    gives: "케이크 2개를 줌",
  },
] as const;

const SCENES = [
  {
    label: "혼자 만들면 경계선 위에 섭니다",
    summary: "가온 빵 4·케이크 2 · 나루 빵 3·케이크 0",
    note: "선은 하루를 두 가지에 나눠 쓸 때 만들 수 있는 조합의 끝, 곧 앞 글의 경계선입니다. 이 글은 기회비용이 수량과 무관하게 일정하다고 두므로 직선입니다. 가온이 케이크 2개를 직접 만들면 빵 4판을 포기해 빵 4판이 남고, 나루가 빵 3판을 만들면 케이크는 0개입니다.",
  },
  {
    label: "각자 싸게 만드는 쪽에 몰아 만듭니다",
    summary: "가온 빵 8판 · 나루 케이크 3개",
    note: "가온은 빵이 싸고 나루는 케이크가 쌉니다. 가온은 하루를 빵에, 나루는 케이크에 몰아 경계선의 끝점에 섭니다. 여기까지는 아직 아무것도 주고받지 않았습니다.",
  },
  {
    label: "빵 3판과 케이크 2개를 맞바꿉니다",
    summary: "케이크 1개 = 빵 1.5판",
    note: "가온이 빵 3판을 넘기고 나루가 케이크 2개를 넘깁니다. 케이크 한 개에 빵 3 ÷ 2 = 1.5판이라 앞 절의 구간 1판에서 2판 사이에 있습니다. 화살표가 교환 전후의 위치입니다.",
  },
  {
    label: "둘 다 경계선 바깥에 닿습니다",
    summary: "가온 빵 +1판 · 나루 케이크 +1개",
    note: "가온은 케이크 2개를 그대로 두고 빵이 4판에서 5판이 되었고, 나루는 빵 3판을 그대로 두고 케이크가 0개에서 1개가 되었습니다. 경계선은 첫 장면과 같은 자리에 있습니다. 선이 밀린 것이 아니라 교환이라는 다른 경로로 선 바깥의 점에 닿은 것입니다.",
  },
] as const;

const W = 236;
const H = 196;
const X0 = 34;
const Y0 = 160;
const XW = 168;
const YH = 128;
const BREAD_MAX = 9;
const CAKE_MAX = 5;
const px = (bread: number) => X0 + (bread / BREAD_MAX) * XW;
const py = (cake: number) => Y0 - (cake / CAKE_MAX) * YH;

const LINE = "#64748b";
const ALONE = "#94a3b8";
const SPECIAL = "#6366f1";
const AFTER = "#059669";
const MUTED = "#6b7280";

function Dot({ at, color, label, hollow = false, dx = 6, dy = -6, anchor = "start" }: { at: Point; color: string; label: string; hollow?: boolean; dx?: number; dy?: number; anchor?: "start" | "end" | "middle" }) {
  return (
    <g>
      <circle cx={px(at.bread)} cy={py(at.cake)} r={4} fill={hollow ? "none" : color} stroke={color} strokeWidth={1.25} />
      <text x={px(at.bread) + dx} y={py(at.cake) + dy} fontSize={9.5} fontWeight={700} fill={color} textAnchor={anchor}>
        {label}
      </text>
    </g>
  );
}

function Panel({ index, active }: { index: number; active: number }) {
  const p = PEOPLE[index];
  const isGaon = index === 0;
  const markerId = `trade-bundle-arrow-${index}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${p.name}: ${SCENES[active].label}`}>
      <defs>
        <marker id={markerId} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" fill={AFTER} />
        </marker>
      </defs>
      <text x={X0} y={14} fontSize={11.5} fontWeight={700} fill="currentColor">
        {p.name}
      </text>
      <text x={W - 8} y={14} fontSize={8.5} textAnchor="end" fill={MUTED}>
        빵 {p.maxBread}판 또는 케이크 {p.maxCake}개
      </text>

      <line x1={X0} y1={Y0} x2={X0 + XW} y2={Y0} stroke={ALONE} strokeWidth={1} />
      <line x1={X0} y1={Y0} x2={X0} y2={Y0 - YH} stroke={ALONE} strokeWidth={1} />
      {[0, 3, 6, 9].map((b) => (
        <text key={b} x={px(b)} y={Y0 + 12} fontSize={8.5} textAnchor="middle" fill={MUTED}>
          {b}
        </text>
      ))}
      {[0, 2, 4].map((c) => (
        <text key={c} x={X0 - 6} y={py(c) + 3} fontSize={8.5} textAnchor="end" fill={MUTED}>
          {c}
        </text>
      ))}
      <text x={X0 + XW} y={Y0 + 26} fontSize={8.5} textAnchor="end" fill={MUTED}>
        빵(판) →
      </text>
      <text x={X0 - 26} y={py(CAKE_MAX) - 4} fontSize={8.5} fill={MUTED}>
        ↑ 케이크(개)
      </text>

      <line x1={px(p.maxBread)} y1={py(0)} x2={px(0)} y2={py(p.maxCake)} stroke={LINE} strokeWidth={1.25} />
      <text x={px(p.maxBread * 0.15) + 8} y={py(p.maxCake * 0.85)} fontSize={8.5} fill={LINE}>
        경계선
      </text>

      {active === 0 && <Dot at={p.alone} color={LINE} label="혼자" dx={isGaon ? 6 : 7} dy={-6} />}
      {active === 1 && <Dot at={p.special} color={SPECIAL} label="몰아 만듦" dx={6} dy={isGaon ? -4 : -8} />}
      {active === 2 && (
        <>
          <Dot at={p.special} color={SPECIAL} label="몰아 만듦" hollow dx={6} dy={isGaon ? -4 : -8} />
          <line
            x1={px(p.special.bread)}
            y1={py(p.special.cake)}
            x2={px(p.after.bread)}
            y2={py(p.after.cake)}
            stroke={AFTER}
            strokeWidth={1.25}
            strokeDasharray="3 2"
            markerEnd={`url(#${markerId})`}
          />
          <Dot at={p.after} color={AFTER} label="교환 뒤" dx={7} dy={-6} />
          <text x={W - 8} y={Y0 - YH + 6} fontSize={9} fontWeight={700} textAnchor="end" fill={AFTER}>
            {p.gives}
          </text>
        </>
      )}
      {active === 3 && (
        <>
          <Dot at={p.alone} color={ALONE} label="혼자" hollow dx={isGaon ? -6 : 7} dy={isGaon ? 14 : -6} anchor={isGaon ? "end" : "start"} />
          <Dot at={p.after} color={AFTER} label="교환 뒤" dx={7} dy={-6} />
          <text x={W - 8} y={Y0 - YH + 6} fontSize={9} fontWeight={700} textAnchor="end" fill={AFTER}>
            {isGaon ? "빵 +1판, 선 바깥" : "케이크 +1개, 선 바깥"}
          </text>
        </>
      )}
    </svg>
  );
}

export default function TradeBundleViz() {
  return (
    <SceneShell
      eyebrow="이득은 어디서 오는가"
      title="몰아 만들고 바꾸면 둘 다 경계선 바깥에 닿습니다"
      description="그래프 하나가 한 사람이고 위에 이름이 있습니다. 가로는 빵, 세로는 케이크이고 점 하나가 그 사람이 하루 끝에 가진 조합입니다."
      note="두 사람의 생산량과 주고받는 양은 본문의 숫자 그대로입니다. 경계선이 직선인 것은 기회비용이 일정하다는 이 글의 가정 때문이고, 주고받는 데 드는 값은 0으로 두었습니다(다음 절에서 풉니다)."
      ariaLabel="가온과 나루가 혼자 만들 때, 몰아 만들 때, 교환한 뒤의 빵과 케이크 조합"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Panel index={0} active={active} />
          <Panel index={1} active={active} />
        </div>
      )}
    />
  );
}
