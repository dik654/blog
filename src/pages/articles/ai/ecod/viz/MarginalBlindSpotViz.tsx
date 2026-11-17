import SceneShell from "./EcodSceneShell";

/**
 * 본문 대응: #comparison — "개별 marginal에서는 평범한데 조합만 비정상인 row"를 ECOD가 놓칠 수 있다.
 * 점 10개는 모두 가정입니다: (1,1)…(9,9)의 대각선 9개와 패턴에서 벗어난 (6.5, 2.5) 하나.
 * score는 Algorithm 절의 PyOD 식 Σ_j max(U_L, U_R)로 계산합니다(skew 선택 U_S는 둘 중 하나라 max가 같음).
 * 결과: 양 끝 (1,1)·(9,9) 4.61, (2,2)·(8,8) 3.22, (7,7) 2.41, 벗어난 점과 (3,3) 2.12 → 10개 중 6–7위.
 */
const POINTS = [
  ...Array.from({ length: 9 }, (_, k) => ({ x: k + 1, y: k + 1, odd: false })),
  { x: 6.5, y: 2.5, odd: true },
];
const XS = POINTS.map((p) => p.x);
const YS = POINTS.map((p) => p.y);
const N = POINTS.length;

const frac = (vals: readonly number[], v: number, dir: "L" | "R") => vals.filter((w) => (dir === "L" ? w <= v : w >= v)).length / N;
const contrib = (vals: readonly number[], v: number) => Math.max(-Math.log(frac(vals, v, "L")), -Math.log(frac(vals, v, "R")));
const SCORES = POINTS.map((p) => contrib(XS, p.x) + contrib(YS, p.y));
const ODD = POINTS.findIndex((p) => p.odd);
const ODD_P = POINTS[ODD];
const higher = SCORES.filter((s) => s > SCORES[ODD] + 1e-9).length;
const ties = SCORES.filter((s) => Math.abs(s - SCORES[ODD]) < 1e-9).length;
const RANK_TEXT = `${higher + 1}–${higher + ties}위 / ${N}`;
const TOP = Math.max(...SCORES);

const fmtFrac = (vals: readonly number[], v: number, dir: "L" | "R") => `${Math.round(frac(vals, v, dir) * N)}/${N}`;

const SCENES = [
  { label: "조합만 어긋난 점", summary: "대각선 9개 + 빨간 점 1개", note: "(가정) 점 아홉 개는 x가 크면 y도 큰 대각선을 따릅니다. 빨간 점은 x는 중간보다 크고 y는 작아 그 패턴을 깹니다. 사람 눈에는 이 점이 가장 이상해 보입니다." },
  { label: "x축만 보면", summary: `왼쪽 ${fmtFrac(XS, ODD_P.x, "L")} · 오른쪽 ${fmtFrac(XS, ODD_P.x, "R")}`, note: "ECDF는 열 하나씩 따로 셉니다. 빨간 점의 x는 열 개 가운데 중간쯤이라 양쪽 tail 비율이 모두 크고, contribution도 작습니다." },
  { label: "y축만 보면", summary: `왼쪽 ${fmtFrac(YS, ODD_P.y, "L")} · 오른쪽 ${fmtFrac(YS, ODD_P.y, "R")}`, note: "y도 가장 작은 값이 아닙니다. 1과 2가 더 작아서 왼쪽 비율이 3/10입니다. 두 열 어디에서도 빨간 점은 끝에 있지 않습니다." },
  { label: "ECOD 순위", summary: `빨간 점 ${SCORES[ODD].toFixed(2)} · ${RANK_TEXT}`, note: `두 열의 contribution을 더하면 대각선 양 끝 (1,1)·(9,9)가 ${TOP.toFixed(2)}로 가장 높고, 빨간 점은 ${SCORES[ODD].toFixed(2)}로 중간입니다. 이런 interaction은 본문대로 scatter·conditional rule이나 다른 detector로 확인합니다.` },
] as const;

const W = 360;
const H = 226;
const PX0 = 34;
const PX1 = 226;
const PY0 = 200;
const PY1 = 18;
const px = (v: number) => PX0 + (v / 10) * (PX1 - PX0);
const py = (v: number) => PY0 - (v / 10) * (PY0 - PY1);

export default function MarginalBlindSpotViz() {
  return (
    <SceneShell
      eyebrow="Marginal blind spot"
      title="열마다 평범한 점은 조합이 어긋나도 ECOD 순위 위로 올라오지 않습니다"
      description="점과 값은 모두 가정이며 단위가 없습니다. score는 Algorithm 절의 PyOD 식(열마다 큰 tail contribution을 골라 더함)으로 계산합니다."
      ariaLabel="두 feature의 조합만 비정상인 점이 각 feature의 ECDF에서는 중간에 놓이는 예"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={PX0} x2={PX1} y1={PY0} y2={PY0} stroke="#94a3b8" strokeWidth={1} />
          <line x1={PX0} x2={PX0} y1={PY0} y2={PY1} stroke="#94a3b8" strokeWidth={1} />
          <text x={PX1} y={PY0 + 16} textAnchor="end" fontSize={10} fill="#64748b">feature x →</text>
          <text x={PX0 + 4} y={PY1 + 4} fontSize={10} fill="#64748b">↑ feature y</text>
          <line x1={px(0.5)} y1={py(0.5)} x2={px(9.5)} y2={py(9.5)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" />
          {active === 1 && POINTS.map((p, i) => (
            <line key={`tx${i}`} x1={px(p.x)} x2={px(p.x)} y1={PY0 - 6} y2={PY0 + 6} stroke={p.odd ? "#dc2626" : "#64748b"} strokeWidth={p.odd ? 1.25 : 1} />
          ))}
          {active === 1 && <line x1={px(ODD_P.x)} x2={px(ODD_P.x)} y1={py(ODD_P.y)} y2={PY0} stroke="#dc2626" strokeWidth={1} strokeDasharray="2 3" />}
          {active === 2 && POINTS.map((p, i) => (
            <line key={`ty${i}`} x1={PX0 - 6} x2={PX0 + 6} y1={py(p.y)} y2={py(p.y)} stroke={p.odd ? "#dc2626" : "#64748b"} strokeWidth={p.odd ? 1.25 : 1} />
          ))}
          {active === 2 && <line x1={PX0} x2={px(ODD_P.x)} y1={py(ODD_P.y)} y2={py(ODD_P.y)} stroke="#dc2626" strokeWidth={1} strokeDasharray="2 3" />}
          {POINTS.map((p, i) => {
            const r = active === 3 ? 2.5 + (SCORES[i] / TOP) * 4.5 : 4;
            return (
              <g key={`p${i}`}>
                <circle cx={px(p.x)} cy={py(p.y)} r={r} fill={p.odd ? "#dc2626" : "#2563eb"} opacity={active === 3 && !p.odd ? 0.55 : 0.9} />
                {active === 3 && (p.odd || SCORES[i] >= TOP - 1e-9) && (
                  <text x={px(p.x) + (p.x > 8 ? 0 : 9)} y={py(p.y) + (p.x > 8 ? -10 : 4)} textAnchor={p.x > 8 ? "middle" : "start"} fontSize={10} fontWeight={700} fill={p.odd ? "#dc2626" : "#1d4ed8"}>
                    {SCORES[i].toFixed(2)}
                  </text>
                )}
              </g>
            );
          })}
          <g>
            <text x={244} y={36} fontSize={10} fontWeight={700} fill="#334155">빨간 점</text>
            <text x={244} y={54} fontSize={10} fill={active === 1 ? "#dc2626" : "#94a3b8"}>x: 왼쪽 {fmtFrac(XS, ODD_P.x, "L")}</text>
            <text x={244} y={68} fontSize={10} fill={active === 1 ? "#dc2626" : "#94a3b8"}>x: 오른쪽 {fmtFrac(XS, ODD_P.x, "R")}</text>
            <text x={244} y={88} fontSize={10} fill={active === 2 ? "#dc2626" : "#94a3b8"}>y: 왼쪽 {fmtFrac(YS, ODD_P.y, "L")}</text>
            <text x={244} y={102} fontSize={10} fill={active === 2 ? "#dc2626" : "#94a3b8"}>y: 오른쪽 {fmtFrac(YS, ODD_P.y, "R")}</text>
            <text x={244} y={126} fontSize={10} fill={active === 3 ? "#dc2626" : "#94a3b8"}>score {SCORES[ODD].toFixed(2)}</text>
            <text x={244} y={140} fontSize={10} fontWeight={700} fill={active === 3 ? "#dc2626" : "#94a3b8"}>{RANK_TEXT}</text>
            <text x={244} y={164} fontSize={9} fill={active === 3 ? "#1d4ed8" : "#94a3b8"}>최고 {TOP.toFixed(2)}:</text>
            <text x={244} y={177} fontSize={9} fill={active === 3 ? "#1d4ed8" : "#94a3b8"}>대각선 양 끝</text>
          </g>
        </svg>
      )}
    />
  );
}
