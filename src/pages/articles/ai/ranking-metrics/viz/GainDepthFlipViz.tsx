import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ndcg 끝 — 이득 변환과 관찰 깊이 k가 승자를 바꾸는 두 예.
 * k=2, X=[3,0], Y=[2,2]: 지수 이득 X 7 · Y 4.893, 관련도 그대로 X 3 · Y 3.262.
 * X=[3,0,0,0], Y=[2,2,2,2], 지수 이득: k=1 X 7 · Y 3, k=4 Y 7.685가 X 7을 넘음.
 * k=2·3의 4.893·6.393은 같은 식으로 계산한 중간값입니다.
 */
const discount = (pos: number) => 1 / Math.log2(pos + 1);
const expGain = (rel: number) => 2 ** rel - 1;
const linGain = (rel: number) => rel;
const parts = (rels: readonly number[], g: (rel: number) => number) =>
  rels.map((rel, i) => g(rel) * discount(i + 1));
const total = (values: readonly number[]) => values.reduce<number>((acc, v) => acc + v, 0);

const X2 = [3, 0] as const;
const Y2 = [2, 2] as const;
const X4 = [3, 0, 0, 0] as const;
const Y4 = [2, 2, 2, 2] as const;
const KS = [1, 2, 3, 4] as const;

const fmt = (v: number) => (Math.round(v * 1000) / 1000).toString();

const W = 360;
const H = 200;
const MAX_V = 8;
const INK = "#334155";
const MUTED = "#94a3b8";
const X_FILL = ["#1d4ed8", "#93c5fd"] as const;
const Y_FILL = ["#d97706", "#fcd34d", "#fde68a", "#fef3c7"] as const;
const WIN = "#16a34a";

const SCENES = [
  {
    label: "지수 이득이면 X가 앞섭니다",
    summary: "k=2 · X 7 > Y 4.893",
    note: "X는 1위에 관련도 3, 2위에 0을 두고 Y는 두 칸 모두 2를 둡니다. 2ʳ−1로 바꾸면 3은 7, 2는 3입니다. X는 7, Y는 3에 2위 할인 약 0.631을 곱한 1.893을 더해 약 4.893이라 X가 앞섭니다.",
  },
  {
    label: "관련도 자체를 이득으로 쓰면 Y가 앞섭니다",
    summary: "k=2 · X 3 < Y 3.262",
    note: "같은 두 목록인데 이득을 관련도 그대로 두면 X는 3, Y는 2에 2×0.631을 더해 약 3.262입니다. 높은 관련도 하나를 지수로 크게 키울지 말지가 승자를 바꿉니다.",
  },
  {
    label: "관찰 깊이 k를 늘리면 Y가 따라잡습니다",
    summary: "k=1 · 7 > 3 → k=4 · 7 < 7.685",
    note: "이번에는 네 칸 목록 X=[3,0,0,0], Y=[2,2,2,2]에 지수 이득을 씁니다. X는 1위 뒤로 더할 것이 없어 7에 머물고, Y는 칸마다 3에 할인을 곱한 만큼 계속 쌓여 k=4에서 약 7.685로 X를 넘습니다. k=2·3의 값은 같은 식으로 계산한 중간값입니다.",
  },
] as const;

function PairBars({ g, label }: { g: (rel: number) => number; label: string }) {
  const rows = [
    { name: "X", p: parts(X2, g), fill: X_FILL as readonly string[] },
    { name: "Y", p: parts(Y2, g), fill: Y_FILL as readonly string[] },
  ];
  const bx = 40;
  const bw = 230;
  const sx = (v: number) => (v / MAX_V) * bw;
  const totals = rows.map((row) => total(row.p));
  const best = Math.max(...totals);
  return (
    <>
      <text x={12} y={18} fontSize={11.5} fill={MUTED}>
        {label}
      </text>
      {rows.map((row, r) => {
        const y = 48 + r * 64;
        const starts = row.p.map((_, i) => total(row.p.slice(0, i)));
        const t = totals[r];
        return (
          <g key={row.name}>
            <text x={12} y={y + 12} fontSize={13} fontWeight={700} fill={INK}>
              {row.name}
            </text>
            <rect x={bx} y={y} width={bw} height={16} rx={2} fill="#f1f5f9" />
            {row.p.map((v, i) =>
              v > 0 ? (
                <rect key={i} x={bx + sx(starts[i])} y={y} width={sx(v)} height={16} fill={row.fill[i]} stroke="#ffffff" strokeWidth={1} />
              ) : null,
            )}
            <text x={bx} y={y + 32} fontSize={11.5} fill={INK}>
              {row.p.map((v, i) => `${i + 1}위 ${fmt(v)}`).join(" + ")}
            </text>
            <text x={bx + bw + 8} y={y + 13} fontSize={13} fontWeight={700} fill={t === best ? WIN : INK}>
              {fmt(t)}
              {t === best ? " 앞섬" : ""}
            </text>
          </g>
        );
      })}
    </>
  );
}

function DepthBars() {
  const base = 160;
  const maxH = 112;
  const sy = (v: number) => (v / MAX_V) * maxH;
  const groupW = 76;
  const x0 = 40;
  return (
    <>
      <text x={12} y={18} fontSize={11.5} fill={MUTED}>
        지수 이득 · 상위 k칸까지 더한 값
      </text>
      {KS.map((k, i) => {
        const xv = total(parts(X4.slice(0, k), expGain));
        const yv = total(parts(Y4.slice(0, k), expGain));
        const gx = x0 + i * groupW;
        const xWins = xv > yv;
        return (
          <g key={k}>
            <rect x={gx} y={base - sy(xv)} width={22} height={sy(xv)} rx={2} fill={X_FILL[0]} />
            <rect x={gx + 30} y={base - sy(yv)} width={22} height={sy(yv)} rx={2} fill={Y_FILL[0]} />
            <text x={gx + 11} y={base - sy(xv) - 5} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={xWins ? WIN : INK}>
              {fmt(xv)}
            </text>
            <text x={gx + 41} y={base - sy(yv) - 5} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={xWins ? INK : WIN}>
              {fmt(yv)}
            </text>
            <text x={gx + 26} y={base + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>
              k={k}
            </text>
            <text x={gx + 26} y={base + 31} textAnchor="middle" fontSize={11.5} fill={xWins ? X_FILL[0] : Y_FILL[0]} fontWeight={700}>
              {xWins ? "X 앞섬" : "Y 앞섬"}
            </text>
          </g>
        );
      })}
      <line x1={x0 - 6} x2={x0 + 4 * groupW - 20} y1={base} y2={base} stroke={MUTED} strokeWidth={1} />
      <rect x={290} y={10} width={10} height={10} rx={2} fill={X_FILL[0]} />
      <text x={304} y={19} fontSize={11.5} fill={INK}>X</text>
      <rect x={320} y={10} width={10} height={10} rx={2} fill={Y_FILL[0]} />
      <text x={334} y={19} fontSize={11.5} fill={INK}>Y</text>
    </>
  );
}

export default function GainDepthFlipViz() {
  return (
    <SceneShell
      eyebrow="같은 목록, 다른 승자"
      title="이득을 어떻게 세는지와 몇 칸까지 보는지가 승자를 바꿉니다"
      description="막대는 위치 할인을 곱한 이득의 합(DCG)입니다. 칸 하나가 한 위치의 몫입니다. 목록 X와 Y는 본문의 설명용 예시입니다."
      ariaLabel="이득 변환과 관찰 깊이 k에 따라 X와 Y의 승패가 바뀌는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto h-auto w-full max-w-[460px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          {active === 0 && <PairBars g={expGain} label="지수 이득 2ʳ−1 · k=2 · X=[3,0] · Y=[2,2]" />}
          {active === 1 && <PairBars g={linGain} label="관련도 그대로 · k=2 · X=[3,0] · Y=[2,2]" />}
          {active === 2 && <DepthBars />}
        </svg>
      )}
    />
  );
}
