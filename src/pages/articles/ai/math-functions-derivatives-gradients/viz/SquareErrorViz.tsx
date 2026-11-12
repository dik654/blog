import SceneShell from "./SceneShell";

/**
 * 본문 대응: #local-linearity — 9.6 예측과 9.61 실제 사이의 0.01이 어디서 오는지.
 * x²를 한 변 x인 정사각형의 넓이로 그린다. (3+Δx)² = 9 + 3Δx + 3Δx + Δx².
 * 두 띠 6Δx가 미분 6으로 만든 1차 예측, 모서리 Δx²가 빠진 항(오차)이다.
 * Δx=1: 15 vs 16 · Δx=0.1: 9.6 vs 9.61 · Δx=0.01: 9.06 vs 9.0601.
 */
const SCENES = [
  { label: "Δx = 1", summary: "예측 15 · 실제 16 · 오차 1", dx: 1, band: "6", corner: "1", note: "한 변을 3에서 4로 늘리면 넓이는 16입니다. 미분 6으로 만든 예측은 9에 두 띠 6을 더한 15이고, 오른쪽 아래 1×1 모서리가 예측에서 빠집니다." },
  { label: "Δx = 0.1", summary: "예측 9.6 · 실제 9.61 · 오차 0.01", dx: 0.1, band: "0.6", corner: "0.01", note: "두 띠는 각각 3×0.1=0.3이라 합이 0.6이고 예측은 9.6입니다. 빠진 모서리는 0.1×0.1=0.01이며 이것이 실제 9.61과의 차이입니다." },
  { label: "Δx = 0.01", summary: "예측 9.06 · 실제 9.0601 · 오차 0.0001", dx: 0.01, band: "0.06", corner: "0.0001", note: "간격을 10분의 1로 줄이면 띠의 넓이도 10분의 1이 되지만 모서리는 100분의 1이 됩니다. 이 크기에서는 모서리가 화면에서 거의 보이지 않아 동그라미로 위치만 표시했습니다." },
] as const;

const K = 48;
const X0 = 30;
const Y0 = 18;
const SIDE = 3 * K;

function Square({ dx }: { dx: number }) {
  const d = dx * K;
  const cx = X0 + SIDE + d / 2;
  const cy = Y0 + SIDE + d / 2;
  return (
    <svg viewBox="0 0 272 236" className="mx-auto h-auto w-full max-w-[272px]" role="img" aria-label={`한 변 3에 ${dx}를 더한 정사각형의 넓이 분해`}>
      <rect x={X0} y={Y0} width={SIDE} height={SIDE} fill="#94a3b8" fillOpacity="0.28" stroke="#64748b" strokeWidth="1" />
      <rect x={X0 + SIDE} y={Y0} width={d} height={SIDE} fill="#2563eb" fillOpacity="0.45" stroke="#2563eb" strokeWidth="1" />
      <rect x={X0} y={Y0 + SIDE} width={SIDE} height={d} fill="#2563eb" fillOpacity="0.45" stroke="#2563eb" strokeWidth="1" />
      <rect x={X0 + SIDE} y={Y0 + SIDE} width={d} height={d} fill="#d97706" stroke="#d97706" strokeWidth="1" />
      {dx < 0.5 && <circle cx={cx} cy={cy} r="9" fill="none" stroke="#d97706" strokeWidth="1.25" />}
      <text x={X0 + SIDE / 2} y={Y0 + SIDE / 2 + 5} textAnchor="middle" fontSize="16" fill="currentColor">3×3 = 9</text>
      <text x={X0 + SIDE / 2} y={Y0 - 5} textAnchor="middle" fontSize="14" fill="currentColor">3</text>
      <text x={X0 - 6} y={Y0 + SIDE / 2 + 4} textAnchor="end" fontSize="14" fill="currentColor">3</text>
      <text x={X0 + SIDE + d / 2} y={Y0 - 5} textAnchor="middle" fontSize="14" fill="#2563eb">Δx</text>
      <text x={X0 + SIDE + d + 14} y={cy + 4} fontSize="14" fill="#d97706">Δx²</text>
    </svg>
  );
}

function Row({ color, name, value, meaning }: { color: string; name: string; value: string; meaning: string }) {
  return (
    <div className="grid grid-cols-[0.75rem_minmax(0,1fr)_auto] items-start gap-x-2 py-1.5 text-sm">
      <span className="mt-1.5 h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      <span className="min-w-0 break-keep text-xs leading-5 sm:text-sm sm:leading-6"><strong>{name}</strong><span className="hidden text-xs leading-5 text-muted-foreground sm:block">{meaning}</span></span>
      <span className="font-mono font-bold leading-6">{value}</span>
    </div>
  );
}

export default function SquareErrorViz() {
  return (
    <SceneShell
      eyebrow="빠진 항의 모양"
      title="정사각형 넓이로 보면 예측이 빠뜨린 조각이 모서리에 남습니다"
      description="x²을 한 변이 x인 정사각형의 넓이로 읽습니다. 한 변을 3에서 3+Δx로 늘리면 넓이는 회색 9, 파란 띠 두 개, 주황 모서리로 나뉩니다. 그림은 실제 비율로 그렸습니다."
      note="두 띠의 합 6Δx가 미분계수 6에 이동량을 곱한 1차 예측이고, 모서리 (Δx)²가 생략한 항입니다. 오차가 정확히 (Δx)²인 것은 이 제곱 함수의 성질이며 모든 함수의 오차가 같은 모양이라는 뜻은 아닙니다."
      ariaLabel="입력 간격 1, 0.1, 0.01에서 정사각형 넓이로 본 직선 예측과 실제 제곱값의 차이"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[272px_minmax(0,1fr)] sm:gap-6">
            <Square dx={s.dx} />
            <div className="min-w-0 divide-y divide-border border-y border-border">
              <Row color="#94a3b8" name="회색: 현재 값" value="9" meaning="3×3, 움직이기 전의 넓이" />
              <Row color="#2563eb" name="두 띠: 예측 변화 6Δx" value={s.band} meaning={`3×${s.dx} 두 개, 미분 6으로 만든 변화 예측`} />
              <Row color="#d97706" name="모서리: 오차 (Δx)²" value={s.corner} meaning="직선 예측이 빠뜨린 조각 = 오차" />
            </div>
          </div>
        );
      }}
    />
  );
}
