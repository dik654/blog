import SceneShell from "./SceneShell";

/**
 * 본문 대응: #many-buyers, #one-buyer — 추가 수입 13−n, 필요한 시급 n+3, 임금 총액의 변화율 2n+3.
 * 경쟁 기준 5시간·시급 8. 동일 임금 고용주 n=10/3: v=W′=29/3, w=19/3, 차이 10/3.
 */
const X0 = 34;
const X1 = 344;
const Y0 = 196;
const Y1 = 10;
const NMAX = 7;
const YMAX = 18;
const sx = (n: number) => X0 + (n / NMAX) * (X1 - X0);
const sy = (y: number) => Y0 - (y / YMAX) * (Y0 - Y1);

const STAR = 10 / 3;
const V_STAR = 29 / 3;
const W_STAR = 19 / 3;

const SCENES = [
  { label: "시장 기준", summary: "5시간 · 시급 8", note: "앞 절에서 전체 수요 13−n과 공급 n+3이 만나는 지점입니다. 경쟁 기준의 비교점으로 둡니다. 개별 가게가 이미 정해진 시급을 받아들이는 조건과는 구분합니다(가정)." },
  { label: "시간을 더 구하면", summary: "2n+3 = 시급 + n", note: "모든 시간에 같은 시급을 주면 임금 총액은 n(n+3)이고 그 변화율은 2n+3입니다. 예를 들어 3시간에서 시급은 6인데 변화율은 9입니다. 기존 시간의 지급액도 함께 늘기 때문입니다." },
  { label: "멈추는 곳", summary: "n = 10/3, 곧 3시간 20분", note: "고용주는 추가 수입이 시급과 같아지는 곳이 아니라 임금 총액의 변화율과 같아지는 곳까지 늘립니다. 두 선은 3시간 20분에서 만나고 그 값은 29/3입니다." },
  { label: "실제로 주는 시급", summary: "시급 19/3 · 추가 수입 29/3", note: "그 시간을 구하는 데 필요한 시급은 19/3입니다. 추가 수입과의 차이 10/3은 다른 시간의 지급 증가에 해당합니다. 경쟁 기준 5시간보다 적게 쓰는 것도 이 가정 안의 결과입니다." },
] as const;

export default function MonopsonyLinesViz() {
  return (
    <SceneShell
      eyebrow="세 개의 선"
      title="시급선이 아니라 임금 총액의 변화율에서 멈춥니다"
      description="가로는 노동시간, 세로는 달러입니다. 더 구하려면 모든 시간의 시급을 함께 올려야 한다고 가정한 연속 시간 모형입니다(가정)."
      ariaLabel="추가 수입, 필요한 시급, 임금 총액 변화율의 세 직선과 선택되는 노동시간"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 228" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
          <line x1={X0} x2={X0} y1={Y1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
          {[0, 6, 12, 18].map((y) => (
            <text key={y} x={X0 - 6} y={sy(y) + 4} textAnchor="end" fontSize={11} fill="#64748b">{y}</text>
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
            <text key={n} x={sx(n)} y={Y0 + 15} textAnchor="middle" fontSize={11} fill="#64748b">{n}</text>
          ))}
          <text x={X1} y={Y0 + 30} textAnchor="end" fontSize={11} fill="#64748b">노동시간 n</text>

          <line x1={sx(0)} x2={sx(7)} y1={sy(13)} y2={sy(6)} stroke="#2563eb" strokeWidth={1.25} />
          <text x={X1} y={sy(3.2)} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">추가 수입 13−n</text>
          <line x1={sx(0)} x2={sx(7)} y1={sy(3)} y2={sy(10)} stroke="#64748b" strokeWidth={1.25} />
          <text x={X1} y={sy(11.2)} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">필요한 시급 n+3</text>
          {active >= 1 && (
            <>
              <line x1={sx(0)} x2={sx(7)} y1={sy(3)} y2={sy(17)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
              <text x={sx(5.5)} y={sy(16.4)} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">임금 총액 변화율 2n+3</text>
            </>
          )}

          <line x1={sx(5)} x2={sx(5)} y1={sy(8)} y2={Y0} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={sx(5)} cy={sy(8)} r={4} fill={active === 0 ? "#16a34a" : "#94a3b8"} />
          <text x={sx(5) + 6} y={sy(5.2)} fontSize={11} fontWeight={active === 0 ? 700 : 400} fill={active === 0 ? "#15803d" : "#64748b"}>5시간·시급 8</text>

          {active === 1 && (
            <g>
              <line x1={sx(3)} x2={sx(3)} y1={sy(9)} y2={sy(6)} stroke="#b45309" strokeWidth={1.25} />
              <circle cx={sx(3)} cy={sy(9)} r={3.5} fill="#d97706" />
              <circle cx={sx(3)} cy={sy(6)} r={3.5} fill="#64748b" />
              <text x={sx(3) - 6} y={sy(9) - 6} textAnchor="end" fontSize={11} fill="#b45309">9</text>
              <text x={sx(3) + 6} y={sy(6) + 13} fontSize={11} className="fill-foreground">6</text>
            </g>
          )}
          {active >= 2 && (
            <g>
              <line x1={sx(STAR)} x2={sx(STAR)} y1={sy(V_STAR)} y2={Y0} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={sx(STAR)} cy={sy(V_STAR)} r={4} fill="#2563eb" />
              <text x={sx(STAR) - 7} y={sy(V_STAR) - 7} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">29/3</text>
            </g>
          )}
          {active === 3 && (
            <g>
              <line x1={sx(STAR)} x2={sx(STAR)} y1={sy(V_STAR)} y2={sy(W_STAR)} stroke="#dc2626" strokeWidth={1.25} />
              <circle cx={sx(STAR)} cy={sy(W_STAR)} r={4} fill="#64748b" />
              <text x={sx(STAR) + 6} y={sy(W_STAR) + 14} fontSize={11} fontWeight={700} className="fill-foreground">시급 19/3</text>
              <text x={sx(STAR) + 5} y={sy(8) + 4} fontSize={11} fontWeight={700} fill="#dc2626">10/3</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
