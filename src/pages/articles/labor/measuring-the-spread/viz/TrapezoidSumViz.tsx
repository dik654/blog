import SceneShell from "./SceneShell";

/**
 * 본문 대응: #one-number의 절차 — 이웃한 점을 직선으로 잇고 사다리꼴 넓이를 더해 B를 구한 뒤 G = 1 − B ÷ 5,000.
 * 프로이센 1892년(Lorenz 214쪽 표 누적): B ≈ 3,213.5 → G ≈ 0.357. 1901년: B ≈ 3,032.4 → G ≈ 0.394.
 * 마지막 장면의 굽은 점선은 구간 안 실제 모양을 모르므로 그린 가정입니다.
 */
const PRUSSIA = {
  1892: { people: [0, 70.1, 96.1, 98.6, 99.3, 99.9, 100], income: [0, 41.2, 71.2, 79.8, 84.0, 91.4, 100] },
  1901: { people: [0, 60.5, 95.3, 98.3, 99.1, 99.8, 100], income: [0, 31.7, 67.0, 76.3, 80.8, 88.9, 100] },
} as const;

const trapezoids = (people: readonly number[], income: readonly number[]) =>
  people.slice(1).map((p, i) => ((income[i] + income[i + 1]) / 2) * (p - people[i]));

const P = PRUSSIA[1892];
const T92 = trapezoids(P.people, P.income);
const B92 = T92.reduce<number>((sum, v) => sum + v, 0);
const REST92 = T92.slice(2).reduce<number>((sum, v) => sum + v, 0);
const B01 = trapezoids(PRUSSIA[1901].people, PRUSSIA[1901].income).reduce<number>((sum, v) => sum + v, 0);
const G92 = 1 - B92 / 5000;
const G01 = 1 - B01 / 5000;

const f1 = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const SCENES = [
  {
    label: "쌓은 점을 직선으로 잇습니다",
    summary: "1892년 · 점 7개",
    note: "Lorenz 214쪽 표의 여섯 계급을 가난한 쪽부터 쌓으면 (0, 0)부터 (100, 100)까지 점 7개가 나옵니다. 첫 계급 하나가 사람의 70.1%를 차지해 첫 구간이 아주 넓습니다.",
  },
  {
    label: "직선 아래를 사다리꼴로 자릅니다",
    summary: "(0 + 41.2) ÷ 2 × 70.1 ≈ " + f1(T92[0]),
    note: "이웃한 두 점과 바닥이 사다리꼴을 만듭니다. 넓이는 두 높이의 평균에 폭을 곱한 값입니다. 첫 사다리꼴은 높이 0과 41.2, 폭 70.1입니다.",
  },
  {
    label: "사다리꼴을 모두 더하면 B입니다",
    summary: f1(T92[0]) + " + " + f1(T92[1]) + " + " + f1(REST92) + " ≈ " + f1(B92),
    note: "두 번째 사다리꼴은 (41.2 + 71.2) ÷ 2 × 26.0 ≈ 1,461.2이고, 폭이 다 합해 3.9뿐인 나머지 네 개가 약 308.3입니다. 이것이 곡선 아래 넓이 B입니다.",
  },
  {
    label: "G = 1 − B ÷ 5,000",
    summary: "1892 " + G92.toFixed(3) + " · 1901 " + G01.toFixed(3),
    note: "가로·세로를 0~100으로 두면 대각선 아래 삼각형 넓이는 5,000입니다. 1 − " + f1(B92) + " ÷ 5,000 ≈ " + G92.toFixed(3) + "이고, 같은 절차로 1901년은 B ≈ " + f1(B01) + ", " + G01.toFixed(3) + "입니다.",
  },
  {
    label: "구간이 굵으면 결과가 작게 나옵니다",
    summary: "직선이 실제 곡선보다 위",
    note: "첫 구간 안에서 사람마다 몫이 달랐다면 실제 곡선은 점선처럼 직선 아래로 처집니다. 그 사이 틈만큼 B가 커지고 G는 작아집니다. 점선의 모양은 표에 없는 그림용 가정입니다.",
  },
] as const;

const X0 = 36;
const SIDE = 160;
const Y0 = 172;
const xOf = (v: number) => X0 + (v / 100) * SIDE;
const yOf = (v: number) => Y0 - (v / 100) * SIDE;
const LINE_C = "#6366f1";
const TRAP_C = "#6366f1";
const GAP_C = "#ef4444";
const EVEN = "#94a3b8";
const MUTED = "#64748b";

const trapPath = (i: number) =>
  `M${xOf(P.people[i])},${yOf(0)} L${xOf(P.people[i])},${yOf(P.income[i])} L${xOf(P.people[i + 1])},${yOf(P.income[i + 1])} L${xOf(P.people[i + 1])},${yOf(0)} Z`;

export default function TrapezoidSumViz() {
  return (
    <SceneShell
      eyebrow="넓이를 더하는 절차"
      title="점 사이를 사다리꼴로 잘라 더하면 곡선 아래 넓이가 나옵니다"
      description="프로이센 1892년의 쌓은 점입니다. 가로는 사람의 누적 %, 세로는 소득의 누적 %이고 회색 점선은 똑같이 나눈 경우입니다."
      note="점은 Lorenz(1905) 214쪽 표를 쌓은 값이고, 넓이와 0.357·0.394는 이 글이 계산한 값입니다."
      ariaLabel="사다리꼴 넓이를 더해 곡선 아래 넓이 B와 넓이 비를 구하는 절차"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={SCENES[active].label + ": " + SCENES[active].summary}>
          <line x1={X0} y1={Y0} x2={X0 + SIDE} y2={Y0} stroke={EVEN} strokeWidth={0.75} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y0 - SIDE} stroke={EVEN} strokeWidth={0.75} />
          <line x1={xOf(0)} y1={yOf(0)} x2={xOf(100)} y2={yOf(100)} stroke={EVEN} strokeWidth={1} strokeDasharray="4 3" />
          {[0, 50, 100].map((v) => (
            <text key={"x" + v} x={xOf(v)} y={Y0 + 13} fontSize={10} fill={MUTED} textAnchor="middle">
              {v}
            </text>
          ))}
          {[50, 100].map((v) => (
            <text key={"y" + v} x={X0 - 5} y={yOf(v) + 4} fontSize={10} fill={MUTED} textAnchor="end">
              {v}
            </text>
          ))}

          {active >= 1 &&
            T92.map((_, i) => {
              const shown = active === 1 ? i === 0 : active <= 3;
              if (!shown && active !== 4) return null;
              return <path key={i} d={trapPath(i)} fill={TRAP_C} opacity={i === 0 ? 0.32 : i === 1 ? 0.2 : 0.45} />;
            })}

          {/* 그림용 곡선의 조절점 (35, 6): 끝 기울기 ≈ 1.0이 다음 구간 직선 기울기 1.15보다 작아,
              가난한 쪽부터 줄 세운 곡선이 지켜야 할 "기울기가 줄지 않는다"는 조건을 어기지 않습니다. */}
          {active === 4 && (
            <path
              d={`M${xOf(0)},${yOf(0)} Q${xOf(35)},${yOf(6)} ${xOf(P.people[1])},${yOf(P.income[1])} Z`}
              fill={GAP_C}
              opacity={0.3}
            />
          )}
          {active === 4 && (
            <path
              d={`M${xOf(0)},${yOf(0)} Q${xOf(35)},${yOf(6)} ${xOf(P.people[1])},${yOf(P.income[1])}`}
              fill="none"
              stroke={GAP_C}
              strokeWidth={1.25}
              strokeDasharray="3 2"
            />
          )}

          <polyline points={P.people.map((p, i) => xOf(p) + "," + yOf(P.income[i])).join(" ")} fill="none" stroke={LINE_C} strokeWidth={1.25} />
          {P.people.map((p, i) => (
            <circle key={i} cx={xOf(p)} cy={yOf(P.income[i])} r={2.2} fill={LINE_C} />
          ))}

          {active >= 1 && active <= 2 && (
            <text x={xOf(35)} y={yOf(6)} fontSize={10} fontWeight={700} fill="#312e81" textAnchor="middle">
              {f1(T92[0])}
            </text>
          )}
          {active === 2 && (
            <text x={xOf(83)} y={yOf(14)} fontSize={10} fontWeight={700} fill="#312e81" textAnchor="middle">
              {f1(T92[1])}
            </text>
          )}

          <g>
            <text x={232} y={34} fontSize={11} fontWeight={700} fill={MUTED}>
              {active === 0 ? "점 (사람, 소득)" : active === 4 ? "첫 구간 안" : "넓이 장부"}
            </text>
            {active === 0 &&
              P.people.slice(1, 4).map((p, i) => (
                <text key={p} x={232} y={54 + i * 16} fontSize={10.5} fill={LINE_C}>
                  ({p}, {P.income[i + 1]})
                </text>
              ))}
            {active === 0 && (
              <text x={232} y={102} fontSize={10.5} fill={MUTED}>
                … (100, 100)
              </text>
            )}
            {active >= 1 && active <= 3 && (
              <g>
                <text x={232} y={54} fontSize={10.5} fill={LINE_C}>
                  첫 칸 {f1(T92[0])}
                </text>
                {active >= 2 && (
                  <text x={232} y={70} fontSize={10.5} fill={LINE_C}>
                    둘째 {f1(T92[1])}
                  </text>
                )}
                {active >= 2 && (
                  <text x={232} y={86} fontSize={10.5} fill={LINE_C}>
                    나머지 넷 {f1(REST92)}
                  </text>
                )}
                {active >= 2 && (
                  <text x={232} y={106} fontSize={11} fontWeight={700} fill={LINE_C}>
                    B ≈ {f1(B92)}
                  </text>
                )}
                {active === 3 && (
                  <g>
                    <text x={232} y={130} fontSize={10.5} fill={MUTED}>
                      삼각형 5,000
                    </text>
                    <text x={232} y={150} fontSize={12} fontWeight={700} fill={LINE_C}>
                      G ≈ {G92.toFixed(3)}
                    </text>
                    <text x={232} y={168} fontSize={10.5} fill={MUTED}>
                      1901 · {G01.toFixed(3)}
                    </text>
                  </g>
                )}
              </g>
            )}
            {active === 4 && (
              <g>
                <text x={232} y={54} fontSize={10.5} fill={LINE_C}>
                  실선 = 표로 이은 직선
                </text>
                <text x={232} y={70} fontSize={10.5} fill={GAP_C}>
                  점선 = 실제 모양 (가정)
                </text>
                <text x={232} y={94} fontSize={10.5} fill={GAP_C}>
                  빨간 틈만큼 B ↑
                </text>
                <text x={232} y={110} fontSize={10.5} fill={GAP_C}>
                  그래서 G ↓
                </text>
              </g>
            )}
          </g>
          <text x={X0 + 6} y={Y0 - SIDE + 14} fontSize={10} fill={MUTED}>
            소득의 누적 %
          </text>
          <text x={X0 + SIDE / 2} y={Y0 + 25} fontSize={10} fill={MUTED} textAnchor="middle">
            사람의 누적 %
          </text>
        </svg>
      )}
    />
  );
}
