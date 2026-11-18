import SceneShell from "./SceneShell";

/**
 * 본문 대응: #row-space, #prove-path — 5행을 3비트 Boolean 꼭짓점 8개에 놓고
 * sumcheck 세 라운드가 변수 하나씩 challenge로 고정해 8 → 4 → 2 → 1 항으로 줄인다.
 * 행 번호 = 4·x₁ + 2·x₂ + x₃ 주소 배치와 변수 고정 순서는 그림용 가정이다.
 * 꼭짓점 숫자는 #query-relation 설명용 장부의 s·c (101,102,103,104,0).
 */
const SC = [101, 102, 103, 104, 0] as const;
const ROW_COUNT = SC.length;

type Vec = readonly [number, number];
const project = (x1: number, x2: number, x3: number): Vec => [72 + x3 * 168 + x2 * 62, 214 - x1 * 132 - x2 * 48];

const VERTICES = Array.from({ length: 8 }, (_, row) => {
  const x1 = (row >> 2) & 1;
  const x2 = (row >> 1) & 1;
  const x3 = row & 1;
  return { row, x1, x2, x3, at: project(x1, x2, x3) };
});
const EDGES = VERTICES.flatMap((a) => VERTICES.filter((b) => b.row > a.row && [1, 2, 4].includes(a.row ^ b.row)).map((b) => [a, b] as const));

const SCENES = [
  {
    label: "2비트면 4칸",
    summary: "2² = 4 < 5",
    stage: 0,
    note: "두 비트 (x₂,x₃)로는 아래 사각형의 네 위치밖에 구별하지 못합니다. row 0~3은 자리가 있지만 row 4는 놓을 주소가 없습니다.",
  },
  {
    label: "3비트면 8칸",
    summary: "8 = 5행 + padding 3",
    stage: 1,
    note: "세 번째 비트 x₁을 더하면 꼭짓점이 8개가 됩니다. row 4가 위쪽 면에 놓이고 남는 3칸은 실제 행이 아닌 padding입니다. 길이 5를 나타내는 indicator가 이 세 칸을 실제 행처럼 쓰지 못하게 합니다.",
  },
  {
    label: "라운드 1 · x₁ = r₁",
    summary: "남은 항 8 → 4",
    stage: 2,
    note: "첫 라운드는 x₁을 verifier challenge r₁로 고정합니다. 위아래로 짝지은 두 꼭짓점이 한 항이 되어 남은 항은 4개입니다. 파란 점은 공간 속 위치가 아니라 남은 항 하나이며 r₁은 0이나 1이 아닐 수 있습니다. 각 라운드에서 보낸 일변수 다항식이 직전 주장과 맞아야 다음으로 넘어갑니다.",
  },
  {
    label: "라운드 2 · x₂ = r₂",
    summary: "남은 항 4 → 2",
    stage: 3,
    note: "둘째 라운드는 x₂를 r₂로 고정합니다. 앞뒤로 짝지은 두 항이 다시 하나가 되어 2개가 남습니다.",
  },
  {
    label: "라운드 3 · x₃ = r₃",
    summary: "임의점 r = (r₁,r₂,r₃) 하나",
    stage: 4,
    note: "셋째 라운드 뒤에는 8칸 전체 합의 주장이 임의점 r 하나의 값에 대한 주장으로 줄어듭니다. 이 값이 실제 committed columns에서 왔는지는 마지막 opening이 따로 확인합니다.",
  },
] as const;

const W = 380;
const H = 262;
const mid = (a: Vec, b: Vec): Vec => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/** 라운드마다 남은 항을 짝지어 하나로 합친 대표점 (위치는 그림용). */
const LEVEL1 = [0, 1, 2, 3].map((low) => mid(VERTICES[low].at, VERTICES[low + 4].at));
const LEVEL2 = [0, 1].map((low) => mid(LEVEL1[low], LEVEL1[low + 2]));
const LEVEL3 = [mid(LEVEL2[0], LEVEL2[1])];
const TERMS: readonly (readonly Vec[])[] = [[], [], LEVEL1, LEVEL2, LEVEL3];

export default function RowCubeSumcheckViz() {
  return (
    <SceneShell
      eyebrow="5행 · 3변수 · 3라운드"
      title="다섯 행을 정육면체 꼭짓점에 놓고 한 변수씩 고정합니다"
      description="꼭짓점 하나가 3비트 주소 (x₁x₂x₃)이고 숫자는 3절 설명용 장부의 s·c입니다. sumcheck는 큰 합의 주장을 라운드마다 변수 하나씩 임의값으로 고정해 줄여 가는 검사입니다."
      note="행 번호 = 4·x₁+2·x₂+x₃ 배치와 변수 고정 순서는 그림용 가정입니다. 실제로 줄이는 합은 s·c 장부가 아니라 aggregate 열을 beta로 접은 ZeroSum 관계이고 verifier는 그 합을 0으로 두고 검사합니다."
      ariaLabel="다섯 행을 8개 Boolean 꼭짓점에 놓고 sumcheck 세 라운드로 한 점까지 줄이는 과정"
      scenes={SCENES}
      render={(active) => {
        const { stage } = SCENES[active];
        const terms = TERMS[stage];
        const faded = stage >= 2;
        const visible = (x1: number) => stage >= 1 || x1 === 0;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto max-h-[13rem] w-full max-w-[520px] sm:max-h-[16rem]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {EDGES.map(([a, b]) => (visible(a.x1) && visible(b.x1) ? (
                <line key={`${a.row}-${b.row}`} x1={a.at[0]} y1={a.at[1]} x2={b.at[0]} y2={b.at[1]} stroke="#94a3b8" strokeWidth={1} opacity={faded ? 0.45 : 1} />
              ) : null))}
              {stage === 0 ? (
                <g>
                  <rect x={22} y={34} width={136} height={44} rx={6} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={90} y={52} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">row 4 (s·c = 0)</text>
                  <text x={90} y={68} textAnchor="middle" fontSize={11} fill="#dc2626">놓을 주소 없음</text>
                </g>
              ) : null}
              {VERTICES.map((v) => {
                if (!visible(v.x1)) return null;
                const real = v.row < ROW_COUNT;
                const bits = `${v.x1}${v.x2}${v.x3}`;
                const label = stage === 0 ? `${v.x2}${v.x3}` : bits;
                const value = real ? `row ${v.row} · ${SC[v.row]}` : "padding";
                return (
                  <g key={v.row} opacity={faded ? 0.4 : 1}>
                    <circle cx={v.at[0]} cy={v.at[1]} r={6} fill={real ? "#64748b" : "none"} stroke="#64748b" strokeWidth={1} strokeDasharray={real ? undefined : "2 2"} />
                    <text x={v.at[0] + 9} y={v.at[1] - 8} fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700} fill="#64748b">{label}</text>
                    <text x={v.at[0] + 9} y={v.at[1] + 15} fontSize={10.5} fill="#64748b">{value}</text>
                  </g>
                );
              })}
              {terms.map((p, index) => (
                <circle key={index} cx={p[0]} cy={p[1]} r={stage === 4 ? 9 : 7} fill="#2563eb" />
              ))}
              {stage === 4 ? (
                <text x={LEVEL3[0][0] + 14} y={LEVEL3[0][1] + 4} fontSize={12} fontWeight={700} fill="#2563eb">r = (r₁, r₂, r₃)</text>
              ) : null}
            </svg>
          </div>
        );
      }}
    />
  );
}
