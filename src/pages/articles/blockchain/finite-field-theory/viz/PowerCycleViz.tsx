import SceneShell from "./SceneShell";

/**
 * 본문 대응: #multiplicative-order — F₇에서 3을 반복해 곱하면 3·2·6·4·5·1(위수 6),
 * 2를 반복해 곱하면 2·4·1(위수 3). 원 위 자리는 3의 거듭제곱 순서(1,3,2,6,4,5)로 놓아
 * ×3은 한 칸, ×2는 두 칸 이동으로 보인다. 3×{1,2,4}={3,6,5}는 본문 숫자의 산술이다.
 */
const W = 340;
const H = 220;
const CX = W / 2;
const CY = 110;
const RAD = 78;
const NODE = 16;
const RING = [1, 3, 2, 6, 4, 5] as const;
const pos = (value: number) => {
  const k = (RING as readonly number[]).indexOf(value);
  const angle = -Math.PI / 2 + (k * 2 * Math.PI) / RING.length;
  return { x: CX + RAD * Math.cos(angle), y: CY + RAD * Math.sin(angle) };
};

/** 1에서 시작해 factor를 곱하며 1로 돌아올 때까지의 값들 */
const orbit = (start: number, factor: number) =>
  Array.from({ length: 6 }, (_, k) => k)
    .reduce<number[]>((acc) => {
      const last = acc[acc.length - 1];
      const next = (last * factor) % 7;
      return acc.includes(next) ? acc : [...acc, next];
    }, [start]);

const POW3 = orbit(1, 3); // 1,3,2,6,4,5
const POW2 = orbit(1, 2); // 1,2,4
const SHIFTED = orbit(3, 2); // 3,6,5

type Path = { values: readonly number[]; color: string };

const SCENES = [
  {
    label: "3을 반복해 곱함",
    summary: "3·2·6·4·5·1 → 6번째에 1",
    note: "1에서 시작해 3을 곱할 때마다 화살표 하나를 따라갑니다. 여섯 번째 곱에서 1로 돌아오므로 3의 위수는 6이고, 0이 아닌 여섯 값을 모두 지나므로 3은 생성원입니다.",
  },
  {
    label: "2를 반복해 곱함",
    summary: "2·4·1 → 3번째에 1",
    note: "2를 곱하면 원 위에서 두 칸씩 건너뜁니다. 세 번째 곱에서 1로 돌아와 3·5·6은 한 번도 지나지 않습니다. 2의 위수는 3입니다.",
  },
  {
    label: "겹치지 않는 두 묶음",
    summary: "{1,2,4} · {3,6,5} → 6 = 2×3",
    note: "2의 반복이 만든 파란 묶음 {1,2,4}에 3을 곱하면 주황 묶음 {3,6,5}입니다. 두 묶음 안의 화살표는 모두 ×2입니다. 두 묶음은 크기가 3으로 같고 겹치지 않으며 합치면 0이 아닌 여섯 값 전체입니다. 그래서 위수 3이 전체 크기 6을 나눕니다.",
  },
] as const;

function Arrows({ values, color }: Path) {
  return (
    <>
      {values.map((from, i) => {
        const to = values[(i + 1) % values.length];
        const a = pos(from);
        const b = pos(to);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy);
        const ux = dx / len;
        const uy = dy / len;
        const x1 = a.x + ux * (NODE + 2);
        const y1 = a.y + uy * (NODE + 2);
        const x2 = b.x - ux * (NODE + 3);
        const y2 = b.y - uy * (NODE + 3);
        const head = `${x2},${y2} ${x2 - ux * 8 - uy * 4},${y2 - uy * 8 + ux * 4} ${x2 - ux * 8 + uy * 4},${y2 - uy * 8 - ux * 4}`;
        return (
          <g key={`${from}-${to}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
            <polygon points={head} fill={color} />
          </g>
        );
      })}
    </>
  );
}

export default function PowerCycleViz() {
  return (
    <SceneShell
      eyebrow="반복해서 곱하기"
      title="같은 값을 계속 곱하면 원을 돌다 1로 돌아옵니다"
      description="원 위의 여섯 점은 F₇의 0이 아닌 값입니다. 화살표 하나가 '한 번 더 곱함'입니다. 처음 1로 돌아올 때까지 곱한 횟수를 위수라고 부릅니다."
      ariaLabel="F7에서 3과 2를 반복해 곱할 때 지나는 값과 두 묶음"
      scenes={SCENES}
      render={(active) => {
        const paths: Path[] =
          active === 0
            ? [{ values: POW3, color: "#2563eb" }]
            : active === 1
              ? [{ values: POW2, color: "#2563eb" }]
              : [
                  { values: POW2, color: "#2563eb" },
                  { values: SHIFTED, color: "#d97706" },
                ];
        const color = (value: number) => paths.find((p) => p.values.includes(value))?.color;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <circle cx={CX} cy={CY} r={RAD} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="2 4" />
            {paths.map((p) => (
              <Arrows key={p.values.join("")} {...p} />
            ))}
            {RING.map((value) => {
              const { x, y } = pos(value);
              const c = color(value);
              return (
                <g key={value}>
                  <circle cx={x} cy={y} r={NODE} fill={c ? "#ffffff" : "#f1f5f9"} stroke={c ?? "#cbd5e1"} strokeWidth={c ? 1.25 : 1} strokeDasharray={c ? undefined : "3 3"} />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={c ? 700 : 400} fill={c ? "#0f172a" : "#94a3b8"}>{value}</text>
                </g>
              );
            })}
            <text x={CX} y={CY - 4} textAnchor="middle" fontSize={11} fill="#64748b">{active === 0 ? "×3" : "×2"}</text>
            <text x={CX} y={CY + 12} textAnchor="middle" fontSize={11} fill="#64748b">{active === 2 ? "주황 = 파랑×3" : active === 0 ? "한 칸씩" : "두 칸씩"}</text>
          </svg>
        );
      }}
    />
  );
}
