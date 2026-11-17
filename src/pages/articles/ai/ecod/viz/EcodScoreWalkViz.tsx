import SceneShell from "./EcodSceneShell";

/**
 * 본문 대응: #algorithm — 논문 식 max(O_L, O_R, O_A)와 PyOD 식 sum_j max(U_L, U_R, U_S).
 * 1절의 네 row(₩12K·2s, ₩18K·4s, ₩24K·5s, ₩910K·39s)를 그대로 씁니다.
 * 두 feature 모두 왼쪽 비율 1/4·1/2·3/4·1, 오른쪽 비율 1·3/4·1/2·1/4.
 * −ln: 1/4→1.39, 1/2→0.69, 3/4→0.29, 1→0. 두 feature의 평균은 ₩241K·12.5초이고
 * 큰 값 하나가 오른쪽으로 멀리 있어 skewness가 양수 → U_S = U_R.
 * 마지막 장면의 row는 순위 비율만 정한 가정이며 네 row의 ECDF에 더하지 않습니다.
 */
type Row = { name: string; raw: string; fl: readonly [number, number]; fr: readonly [number, number] };

const ROWS: readonly Row[] = [
  { name: "row 1", raw: "₩12K · 2s", fl: [1 / 4, 1 / 4], fr: [1, 1] },
  { name: "row 2", raw: "₩18K · 4s", fl: [1 / 2, 1 / 2], fr: [3 / 4, 3 / 4] },
  { name: "row 3", raw: "₩24K · 5s", fl: [3 / 4, 3 / 4], fr: [1 / 2, 1 / 2] },
  { name: "row 4", raw: "₩910K · 39s", fl: [1, 1], fr: [1 / 4, 1 / 4] },
  { name: "(가정) row", raw: "금액 왼쪽·시간 오른쪽", fl: [1 / 4, 1], fr: [1, 1 / 4] },
];

const HYP = ROWS.length - 1;
const nl = (p: number) => -Math.log(p);
const sum2 = (v: readonly [number, number]) => v[0] + v[1];
const uL = (r: Row) => [nl(r.fl[0]), nl(r.fl[1])] as const;
const uR = (r: Row) => [nl(r.fr[0]), nl(r.fr[1])] as const;
const paper = (r: Row) => Math.max(sum2(uL(r)), sum2(uR(r)));
const pyod = (r: Row) => Math.max(uL(r)[0], uR(r)[0]) + Math.max(uL(r)[1], uR(r)[1]);
const f2 = (v: number) => (Math.abs(v) < 0.005 ? "0" : v.toFixed(2));

const SCENES = [
  { label: "−log로 뒤집기", summary: "1/4→1.39 · 1/2→0.69 · 1→0", note: "가운데에서 왼쪽 막대는 작은 쪽 tail, 오른쪽 막대는 큰 쪽 tail의 contribution U입니다. 파랑은 거래액, 청록은 접속 시간입니다. 비율이 작을수록 −log 값이 커지고, 비율 1은 0이 됩니다." },
  { label: "방향별로 더하기", summary: "O_L · O_R", note: "O_L은 한 row의 왼쪽 contribution을 모든 feature에서 더한 값, O_R은 오른쪽만 더한 값입니다. row 1은 O_L 2.77, row 4는 O_R 2.77입니다." },
  { label: "Skewness가 고른 방향", summary: "O_A = O_R (이 예)", note: "O_A는 열마다 skewness 부호가 고른 방향의 contribution만 더한 값입니다. 두 feature 모두 평균(₩241K, 12.5초)보다 훨씬 큰 값 하나가 있어 skewness가 양수이므로 두 열 모두 오른쪽을 고릅니다. 그래서 O_A만 보면 row 4가 2.77, row 1은 0입니다." },
  { label: "논문 score", summary: "max(O_L, O_R, O_A)", note: "세 합 중 가장 큰 값을 고르면 row 1이 O_L 2.77로 돌아와 row 4와 같은 점수가 됩니다. 본문이 말한 대로 max는 skewness 선택이 놓칠 수 있는 all-left 패턴도 후보로 남깁니다." },
  { label: "PyOD score", summary: "Σ feature별 max", note: "PyOD는 열마다 더 큰 contribution을 먼저 고른 뒤 더합니다. 이 네 row는 한 row 안의 큰 contribution이 모두 같은 방향이라 논문 score와 숫자가 같습니다." },
  { label: "두 식이 갈라지는 row", summary: "논문 1.39 · PyOD 2.77", note: "(가정) 거래액은 왼쪽 1/4, 접속 시간은 오른쪽 1/4에 놓인 row라면 O_L·O_R·O_A가 모두 1.39라 논문 score는 1.39입니다. PyOD는 열마다 1.39를 골라 더하므로 2.77입니다. 순서를 바꾸면 같은 row의 점수가 달라집니다." },
] as const;

const W = 360;
const H = 214;
const CX = 186;
const SCALE = 36;
const ROW_Y = (i: number) => 44 + i * 34;
const BAR_H = 9;
const AMOUNT = "#2563eb";
const TIME = "#0d9488";

/** scene별로 (row, side, feature) 막대의 진하기를 정합니다. */
function weight(scene: number, row: number, side: "L" | "R", feat: 0 | 1): number {
  const r = ROWS[row];
  if (scene === 5) return row === HYP ? 0.95 : 0.15;
  if (scene <= 1) return 0.85;
  if (scene === 2) return side === "R" ? 0.95 : 0.12;
  if (scene === 3) {
    const pickLeft = sum2(uL(r)) > sum2(uR(r));
    return (side === "L") === pickLeft ? 0.95 : 0.12;
  }
  const leftWins = uL(r)[feat] > uR(r)[feat];
  return (side === "L") === leftWins ? 0.95 : 0.12;
}

function scoreText(scene: number, row: number): string {
  const r = ROWS[row];
  if (scene <= 1) return "";
  if (scene === 2) return f2(sum2(uR(r)));
  if (scene === 3) return f2(paper(r));
  return f2(pyod(r));
}

function sideLabel(scene: number, values: readonly [number, number]): string {
  if (scene === 0) return values[0] < 0.005 && values[1] < 0.005 ? "0" : `${f2(values[0])}+${f2(values[1])}`;
  return f2(sum2(values));
}

export default function EcodScoreWalkViz() {
  return (
    <SceneShell
      eyebrow="Score walk"
      title="네 row의 tail 비율이 논문 score와 PyOD score가 되기까지"
      description="1절의 거래 네 건을 그대로 씁니다. U는 한 feature의 tail contribution(−log 비율)입니다. 마지막 장면의 row만 순위 비율을 정해 둔 가정입니다."
      ariaLabel="ECOD contribution을 방향별로 더하고 논문 식과 PyOD 식으로 합치는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={CX - 6} y={14} textAnchor="end" fontSize={10} fill="#64748b">← 작은 쪽 tail</text>
          <text x={CX + 6} y={14} fontSize={10} fill="#64748b">큰 쪽 tail →</text>
          <text x={W - 4} y={14} textAnchor="end" fontSize={10} fontWeight={700} fill="#64748b">
            {active === 2 ? "O_A" : active === 3 ? "논문" : active >= 4 ? "PyOD" : ""}
          </text>
          <line x1={CX} x2={CX} y1={22} y2={H - 8} stroke="#94a3b8" strokeWidth={1} />
          {ROWS.map((r, i) => {
            const y = ROW_Y(i);
            const show = i !== HYP || active === 5;
            const l = uL(r);
            const rr = uR(r);
            if (!show) {
              return (
                <g key={r.name}>
                  <line x1={74} x2={W - 70} y1={y} y2={y} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 4" />
                  <text x={4} y={y + 4} fontSize={9} fill="#94a3b8">마지막 장면의 가정 row</text>
                </g>
              );
            }
            const segs = [
              { side: "L" as const, feat: 0 as const, x: CX - l[0] * SCALE, w: l[0] * SCALE, c: AMOUNT },
              { side: "L" as const, feat: 1 as const, x: CX - (l[0] + l[1]) * SCALE, w: l[1] * SCALE, c: TIME },
              { side: "R" as const, feat: 0 as const, x: CX, w: rr[0] * SCALE, c: AMOUNT },
              { side: "R" as const, feat: 1 as const, x: CX + rr[0] * SCALE, w: rr[1] * SCALE, c: TIME },
            ];
            const leftLen = sum2(l) * SCALE;
            const rightLen = sum2(rr) * SCALE;
            const hypBoth = active === 5 && i === HYP;
            return (
              <g key={r.name}>
                <text x={4} y={y - 1} fontSize={11} fontWeight={700} fill={i === HYP ? "#b45309" : "#334155"}>{r.name}</text>
                <text x={4} y={y + 11} fontSize={9} fill="#64748b">{r.raw}</text>
                {segs.map((s) => (s.w > 0.5 ? (
                  <rect key={`${s.side}${s.feat}`} x={s.x} y={y - BAR_H / 2} width={s.w} height={BAR_H} fill={s.c} opacity={weight(active, i, s.side, s.feat)} />
                ) : null))}
                {active <= 1 && (
                  <>
                    <text x={CX - Math.max(leftLen, 14) / 2} y={y - 8} textAnchor="middle" fontSize={9} fill="#475569">{sideLabel(active, l)}</text>
                    <text x={CX + Math.max(rightLen, 14) / 2} y={y + 15} textAnchor="middle" fontSize={9} fill="#475569">{sideLabel(active, rr)}</text>
                  </>
                )}
                {hypBoth ? (
                  <>
                    <text x={W - 4} y={y - 2} textAnchor="end" fontSize={10} fontWeight={700} fill="#b45309">논문 {f2(paper(r))}</text>
                    <text x={W - 4} y={y + 11} textAnchor="end" fontSize={10} fontWeight={700} fill="#2563eb">PyOD {f2(pyod(r))}</text>
                  </>
                ) : (
                  <text x={W - 4} y={y + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={active === 5 ? "#94a3b8" : "#2563eb"}>{scoreText(active, i)}</text>
                )}
              </g>
            );
          })}
          <rect x={74} y={H - 12} width={9} height={7} fill={AMOUNT} />
          <text x={87} y={H - 6} fontSize={9} fill="#475569">거래액</text>
          <rect x={124} y={H - 12} width={9} height={7} fill={TIME} />
          <text x={137} y={H - 6} fontSize={9} fill="#475569">접속 시간</text>
          <text x={W - 4} y={H - 6} textAnchor="end" fontSize={9} fill="#64748b">막대 길이 = U</text>
        </svg>
      )}
    />
  );
}
