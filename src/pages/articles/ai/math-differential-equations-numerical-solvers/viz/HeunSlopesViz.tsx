import SceneShell from "./SceneShell";
import { PlotLegend } from "./PlotParts";
import { linePath, sample } from "./plotHelpers";

/**
 * 본문 대응: #heun-runge-kutta — x′=−x, x₀=1, h=.5의 첫 단계.
 * k₁=−1 → 예상 끝점 .5, k₂=−.5, 평균 −.75, 변화량 −.375, 새 값 .625. 기준값 ≈.6065.
 */
const sx = (t: number) => 44 + 440 * t;
const sy = (x: number) => 206 + (0.4 - x) * 280;

const SCENES = [
  { label: "출발 기울기", summary: "−1로 가면 예상 끝점 0.5", note: "기울기는 그 자리의 변화율입니다. 출발점의 기울기 −1을 0.5초 유지하면 예상 끝점 0.5에 닿습니다. 아직 최종 답이 아니라 다음 기울기를 읽을 자리입니다." },
  { label: "끝점 기울기", summary: "예상 끝점에서 −0.5", note: "예상 끝점의 양이 0.5이므로 그곳의 기울기는 −0.5입니다. 출발점보다 완만합니다. 여기까지 변화율을 두 번 읽었습니다." },
  { label: "평균 기울기", summary: "(−1 − 0.5) ÷ 2 = −0.75", note: "두 기울기의 평균 −0.75를 들고 예상 끝점이 아니라 원래 출발점으로 돌아옵니다. 0.5초 움직이면 변화량은 −0.375, 새 값은 0.625입니다." },
  { label: "기준값과 비교", summary: "0.5 · 0.625 · 기준 ≈0.6065", note: "기준값 약 0.6065와의 차이는 첫 Euler 값 0.5일 때 약 0.1065, 평균한 값 0.625일 때 약 0.0185입니다. 그 대신 변화율을 한 번이 아니라 두 번 읽었습니다." },
] as const;

export default function HeunSlopesViz() {
  return (
    <SceneShell
      eyebrow="두 기울기의 평균"
      title="예상 끝점에서 기울기를 다시 읽고 출발점에서 평균으로 움직입니다"
      description="x′=−x, 시작값 1, 간격 0.5의 첫 단계만 확대했습니다. 세로축은 0.4부터 시작합니다."
      ariaLabel="출발 기울기, 끝점 기울기, 평균 기울기로 만드는 한 단계"
      scenes={SCENES}
      render={(active) => (
        <div>
          <PlotLegend items={[{ label: "기준 경로", color: "#64748b", kind: "dash" }, { label: "출발 기울기 −1", color: "#2563eb" }, { label: "끝점 기울기 −0.5", color: "#d97706" }, { label: "평균 기울기 −0.75", color: "#16a34a" }]} />
          <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <path d={`M${sx(0)} ${sy(1.05)}V${sy(0.4)}H${sx(0.65)}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {[0.4, 0.6, 0.8, 1].map((tick) => <text key={tick} x={sx(0) - 7} y={sy(tick) + 3.5} textAnchor="end" fontSize={11.5} fill="#64748b">{tick}</text>)}
            {[0, 0.25, 0.5].map((tick) => <text key={tick} x={sx(tick)} y={sy(0.4) + 15} textAnchor="middle" fontSize={11.5} fill="#64748b">{tick}</text>)}
            <text x={sx(0.65)} y={sy(0.4) + 29} textAnchor="end" fontSize={11.5} fill="#64748b">시간(초)</text>
            <path d={linePath(sample((t) => Math.exp(-t), 0, 0.5), sx, sy)} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 3" />
            <path d={`M${sx(0)} ${sy(1)}L${sx(0.5)} ${sy(0.5)}`} fill="none" stroke="#2563eb" strokeWidth={active === 0 ? 1.25 : 1} opacity={active === 0 ? 1 : 0.55} />
            <circle cx={sx(0)} cy={sy(1)} r={3.5} fill="#2563eb" />
            <circle cx={sx(0.5)} cy={sy(0.5)} r={3.5} fill={active >= 1 ? "#d97706" : "#2563eb"} />
            <text x={sx(0.5) + 7} y={sy(0.5) + 4} fontSize={12} fontWeight={700} fill={active >= 1 ? "#d97706" : "#2563eb"}>예상 끝점 0.5</text>
            {active >= 1 && <path d={`M${sx(0.4)} ${sy(0.55)}L${sx(0.5)} ${sy(0.5)}`} fill="none" stroke="#d97706" strokeWidth={1.25} />}
            {active === 1 && <text x={sx(0.4) - 6} y={sy(0.55) + 16} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">기울기 −0.5</text>}
            {active >= 2 && (
              <g>
                <path d={`M${sx(0)} ${sy(1)}L${sx(0.5)} ${sy(0.625)}`} fill="none" stroke="#16a34a" strokeWidth={1.25} />
                <circle cx={sx(0.5)} cy={sy(0.625)} r={3.5} fill="#16a34a" />
                <text x={sx(0.5) + 7} y={sy(0.625) - 5} fontSize={12} fontWeight={700} fill="#16a34a">새 값 0.625</text>
              </g>
            )}
            {active === 3 && (
              <g>
                <circle cx={sx(0.5)} cy={sy(Math.exp(-0.5))} r={2.8} fill="none" stroke="#64748b" strokeWidth={1.25} />
                <text x={sx(0.5) + 7} y={sy(Math.exp(-0.5)) + 15} fontSize={12} fontWeight={700} fill="#64748b">기준 ≈0.6065</text>
              </g>
            )}
          </svg>
        </div>
      )}
    />
  );
}
