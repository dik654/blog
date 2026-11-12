import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #recurrent-state — S_t = S_{t-1} + k̃_t v_tᵀ, z_t = z_{t-1} + k̃_t, o_t = (q̃ᵀS_t)/(q̃ᵀz_t).
 * 실제 d=128 대신 d=3과 작은 정수 벡터(가정)로 rank-1 항(열 벡터 × 행 벡터)이 d×d 칸 전체에 더해지는 모양을 보인다.
 * token이 늘어도 state는 3×3=9칸 그대로다. 모든 칸 값은 아래 벡터에서 곱셈·덧셈으로 계산한다.
 */
type Vec = readonly [number, number, number];
type Mat = readonly (readonly number[])[];

const TOKENS: readonly { k: Vec; v: Vec }[] = [
  { k: [1, 1, 2], v: [2, 1, 0] },
  { k: [2, 1, 1], v: [1, 0, 3] },
  { k: [1, 2, 1], v: [0, 2, 1] },
];
const Q: Vec = [1, 1, 1];

const ZERO: Mat = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
const outer = (k: Vec, v: Vec): Mat => k.map((ki) => v.map((vj) => ki * vj));
const add = (a: Mat, b: Mat): Mat => a.map((row, i) => row.map((value, j) => value + b[i][j]));

const TERMS = TOKENS.map((token) => outer(token.k, token.v));
const STATES = TERMS.reduce<Mat[]>((acc, term) => [...acc, add(acc[acc.length - 1] ?? ZERO, term)], []);
const FINAL = STATES[STATES.length - 1];
const Z = TOKENS.reduce<number[]>((acc, token) => acc.map((value, i) => value + token.k[i]), [0, 0, 0]);
const READ = Q.reduce<number[]>((acc, qi, i) => acc.map((value, j) => value + qi * FINAL[i][j]), [0, 0, 0]);
const DENOM = Q.reduce<number>((sum, qi, i) => sum + qi * Z[i], 0);
const OUT = READ.map((value) => value / DENOM);
const fmt = (values: readonly number[]) => `(${values.map((value) => (Number.isInteger(value) ? String(value) : value.toFixed(2))).join(", ")})`;
const APPROX = OUT.some((value) => !Number.isInteger(value)) ? "≈ " : "= ";

const SCENES = [
  ...TOKENS.map((token, index) => ({
    label: `token ${index + 1} · rank-1 항 더하기`,
    summary: `k̃=${fmt(token.k)} · v=${fmt(token.v)}`,
    note:
      index === 0
        ? "k̃를 세로로, v를 가로로 세우고 칸마다 둘을 곱하면 d×d 표 하나가 나옵니다. 벡터 하나 × 벡터 하나로 만든 이 표가 rank-1 항(outer product)이고, 빈 state에 그대로 더해집니다."
        : `새 token도 같은 모양의 3×3 표 하나를 만들어 기존 state 위에 칸별로 더합니다. 지금까지 token ${index + 1}개를 읽었지만 state는 여전히 9칸입니다.`,
  })),
  {
    label: "현재 query로 읽기",
    summary: `o ${APPROX}${fmt(OUT)}`,
    note: `q̃=${fmt(Q)}로 state를 읽으면 q̃의 각 값으로 행에 가중치를 주어 더한 ${fmt(READ)}가 나옵니다. 같은 방식으로 누적한 정규화 벡터 z=${fmt(Z)}와 q̃의 내적 ${DENOM}로 나누면 출력 o가 됩니다.`,
  },
] as const;

const CELL = 24;
const SKY = "#0284c7";
const AMBER = "#d97706";
const SLATE = "#64748b";
const LINE = "#94a3b8";

function Grid({ x, y, m, color, highlight }: { x: number; y: number; m: Mat; color: string; highlight?: (i: number, j: number) => boolean }) {
  return (
    <g>
      {m.map((row, i) =>
        row.map((value, j) => {
          const on = highlight ? highlight(i, j) : value !== 0;
          return (
            <g key={`${i}-${j}`}>
              <rect x={x + j * CELL} y={y + i * CELL} width={CELL} height={CELL} fill={on ? color : "#ffffff"} fillOpacity={on ? 0.16 : 0} stroke={on ? color : LINE} strokeWidth={1} />
              <text x={x + j * CELL + CELL / 2} y={y + i * CELL + 16} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? color : SLATE}>{value}</text>
            </g>
          );
        }),
      )}
    </g>
  );
}

function Strip({ x, y, values, vertical, color }: { x: number; y: number; values: readonly number[]; vertical: boolean; color: string }) {
  return (
    <g>
      {values.map((value, i) => (
        <g key={i}>
          <rect x={vertical ? x : x + i * CELL} y={vertical ? y + i * CELL : y} width={CELL} height={CELL} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1} />
          <text x={(vertical ? x : x + i * CELL) + CELL / 2} y={(vertical ? y + i * CELL : y) + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{value}</text>
        </g>
      ))}
    </g>
  );
}

function Caption({ x, text, sub }: { x: number; text: string; sub?: string }) {
  return (
    <g>
      <text x={x} y={142} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">{text}</text>
      {sub && <text x={x} y={156} textAnchor="middle" fontSize={10} fill={SLATE}>{sub}</text>}
    </g>
  );
}

function UpdateScene({ index }: { index: number }) {
  const token = TOKENS[index];
  const prev = index === 0 ? ZERO : STATES[index - 1];
  const term = TERMS[index];
  return (
    <svg viewBox="0 0 360 184" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`token ${index + 1}의 rank-1 항을 state에 더하는 계산`}>
      <text x={22} y={38} textAnchor="middle" fontSize={10} fill={AMBER}>v →</text>
      <Strip x={40} y={20} values={token.v} vertical={false} color={AMBER} />
      <Strip x={10} y={50} values={token.k} vertical color={SKY} />
      <text x={22} y={136} textAnchor="middle" fontSize={10} fill={SKY}>k̃ ↑</text>
      <Grid x={40} y={50} m={term} color={SKY} />
      <Caption x={76} text="k̃ vᵀ" sub="rank-1 항" />
      <text x={128} y={92} textAnchor="middle" fontSize={14} fill={SLATE}>+</text>
      <Grid x={144} y={50} m={prev} color={SLATE} highlight={() => false} />
      <Caption x={180} text={`S${index}`} sub={index === 0 ? "빈 state" : "이전 state"} />
      <text x={232} y={92} textAnchor="middle" fontSize={14} fill={SLATE}>=</text>
      <Grid x={248} y={50} m={STATES[index]} color={SKY} highlight={(i, j) => term[i][j] !== 0} />
      <Caption x={284} text={`S${index + 1}`} sub="색칠 = 이번에 바뀐 칸" />
      <text x={180} y={178} textAnchor="middle" fontSize={10} fill={SLATE}>읽은 token {index + 1}개 · state는 3×3 = 9칸 그대로</text>
    </svg>
  );
}

function ReadScene() {
  return (
    <svg viewBox="0 0 360 184" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="현재 query로 state의 행을 읽고 정규화해 출력을 얻는 계산">
      <text x={22} y={44} textAnchor="middle" fontSize={10} fill={AMBER}>q̃</text>
      <Strip x={10} y={50} values={Q} vertical color={AMBER} />
      <Grid x={40} y={50} m={FINAL} color={AMBER} highlight={(i) => Q[i] !== 0} />
      <Caption x={76} text="S3" sub="q̃ 값으로 행마다 가중" />
      <line x1={124} x2={146} y1={62} y2={62} stroke={LINE} strokeWidth={1} />
      <path d="M142 58 L148 62 L142 66" fill="none" stroke={LINE} strokeWidth={1} />
      <text x={156} y={66} fontSize={11} fill="#64748b">q̃ᵀS3 = {fmt(READ)}</text>
      <text x={156} y={92} fontSize={11} fill="#64748b">z3 = k̃ 세 개의 합 = {fmt(Z)}</text>
      <text x={156} y={112} fontSize={11} fill="#64748b">q̃ᵀz3 = {DENOM}</text>
      <text x={156} y={140} fontSize={12} fontWeight={700} fill={AMBER}>o = {fmt(READ)} ÷ {DENOM}</text>
      <text x={156} y={158} fontSize={12} fontWeight={700} fill={AMBER}>{APPROX}{fmt(OUT)}</text>
    </svg>
  );
}

export default function RankOneUpdateViz() {
  return (
    <SceneShell
      eyebrow="Recurrent state 한 step"
      title="Token마다 같은 크기의 표 하나를 state에 더합니다"
      description="실제 d=128 대신 d=3과 작은 정수 벡터를 골랐습니다(가정). k̃=φ(k), q̃=φ(q)이고, φ가 양수 값을 내므로 k̃와 q̃의 칸은 모두 양수로 골랐고 v는 임의로 골랐습니다. 칸 숫자는 모두 이 벡터로 계산했습니다."
      ariaLabel="d=3 예시에서 rank-1 항을 누적하고 query로 읽는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[...TOKENS.map((_, index) => <UpdateScene key={index} index={index} />), <ReadScene key="read" />]}
        />
      )}
    />
  );
}
