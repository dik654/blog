import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-counts — v(n)=13−n. 3시간의 변화율 10, 4시간의 변화율 9.
 * 3시간에서 4시간까지 선 아래 넓이 = 평균 9.5 × 길이 1 = B(4)−B(3) = 44−34.5.
 */
const X0 = 40;
const X1 = 340;
const Y0 = 176;
const Y1 = 16;
const NMIN = 2;
const NMAX = 5;
const VMAX = 12;
const sx = (n: number) => X0 + ((n - NMIN) / (NMAX - NMIN)) * (X1 - X0);
const sy = (v: number) => Y0 - (v / VMAX) * (Y0 - Y1);
const rate = (n: number) => 13 - n;

const SCENES = [
  { label: "두 시점의 변화율", summary: "v(3)=10 · v(4)=9", note: "변화율은 노동을 아주 조금 늘릴 때 수입이 늘어나는 속도입니다. 선 위의 한 점이 그 시간에서의 속도입니다. 아직 한 시간 전체의 수입은 아닙니다." },
  { label: "한 시간의 수입 증가", summary: "44 − 34.5 = 9.5", note: "3시간에서 4시간으로 늘릴 때의 수입 증가는 두 점 사이 선 아래의 넓이입니다. B(4) − B(3)과 같은 값입니다." },
  { label: "넓이를 계산합니다", summary: "평균 9.5 × 길이 1", note: "변화율이 직선으로 10에서 9까지 내려가므로 평균은 9.5이고 구간 길이는 1입니다. 왼쪽 끝 10으로도 오른쪽 끝 9로도 이 넓이를 맞게 셀 수 없습니다." },
  { label: "넷째 시간은 9가 아닙니다", summary: "13 − 4 = 9 는 끝점", note: "13 − 4 = 9는 구간 오른쪽 끝의 변화율입니다. 이 식에서 네 번째 한 시간의 수입은 9.5입니다. 두 값을 섞으면 뒤의 최적점도 달라집니다." },
] as const;

export default function RateIntervalViz() {
  return (
    <SceneShell
      eyebrow="변화율과 구간"
      title="점에서 읽는 변화율과 구간의 넓이는 다릅니다"
      description="가로는 노동시간 n, 세로는 수입 변화율 v(n)=13−n입니다. 설명용 가정이며 가로축은 2시간부터 그렸습니다(가정)."
      ariaLabel="변화율 직선과 3시간에서 4시간까지의 넓이 9.5"
      scenes={SCENES}
      render={(active) => {
        const area = `${sx(3)},${sy(0)} ${sx(3)},${sy(10)} ${sx(4)},${sy(9)} ${sx(4)},${sy(0)}`;
        return (
          <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active >= 1 && <polygon points={area} fill="#2563eb" opacity={0.2} />}
            {active >= 1 && <text x={sx(3.5)} y={sy(4.4)} textAnchor="middle" fontSize={15} fontWeight={700} fill="#2563eb">9.5</text>}
            {active === 2 && (
              <>
                <line x1={sx(3)} x2={sx(4)} y1={sy(9.5)} y2={sy(9.5)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={sx(3.5)} y={sy(9.5) + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">평균 9.5</text>
                <text x={sx(3.5)} y={sy(0) - 8} textAnchor="middle" fontSize={11} fill="#2563eb">길이 1</text>
              </>
            )}
            {active === 3 && (
              <text x={sx(3.5)} y={sy(2.2)} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">넷째 시간</text>
            )}
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            {[0, 3, 6, 9, 12].map((v) => (
              <text key={v} x={X0 - 6} y={sy(v) + 4} textAnchor="end" fontSize={11} fill="#64748b">{v}</text>
            ))}
            {[2, 3, 4, 5].map((n) => (
              <text key={n} x={sx(n)} y={Y0 + 15} textAnchor="middle" fontSize={11} fill="#64748b">{n}시간</text>
            ))}
            <line x1={sx(2)} x2={sx(5)} y1={sy(rate(2))} y2={sy(rate(5))} stroke="#2563eb" strokeWidth={1.25} />
            <text x={sx(5)} y={sy(rate(5)) + 16} textAnchor="end" fontSize={11} fill="#2563eb">v(n) = 13 − n</text>
            {[3, 4].map((n) => {
              const strong = active === 0 || (active === 3 && n === 4);
              return (
                <g key={n}>
                  <line x1={sx(n)} x2={sx(n)} y1={sy(rate(n))} y2={Y0} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={sx(n)} cy={sy(rate(n))} r={4} fill="#2563eb" />
                  <text x={sx(n)} y={sy(rate(n)) - 9} textAnchor="middle" fontSize={11} fontWeight={strong ? 700 : 400} className="fill-foreground">v({n}) = {rate(n)}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
