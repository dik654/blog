import LinePlot from "./LinePlot";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #subsampling — P_discard = max(0, 1 − √(t/f)). t=10⁻⁵.
 * f=10⁻³: r=0.01 → 0.9. f=10⁻⁶: r=10 → 1−√10 ≈ −2.162이므로 0으로 제한. 경계 f=t.
 */
const T = -5;
const POINTS = Array.from({ length: 141 }, (_, i) => {
  const lf = -7 + i * 0.05;
  return [lf, Math.max(0, 1 - Math.sqrt(10 ** (T - lf)))] as const;
});
const X_TICKS = [-7, -6, -5, -4, -3, -2, -1, 0].map((at) => ({ at, text: at === 0 ? "1" : `10⁻${"⁰¹²³⁴⁵⁶⁷"[-at]}` }));
const Y_TICKS = [0, 0.5, 0.9, 1].map((at) => ({ at, text: String(at) }));

const SCENES = [
  { label: "흔한 단어", summary: "f=10⁻³ → 버릴 확률 0.9", note: "상대빈도 f가 기준 t보다 백 배 크면 t/f=0.01, 제곱근은 0.1이라 버릴 확률은 0.9입니다.", at: -3, y: 0.9 },
  { label: "드문 단어", summary: "f=10⁻⁶ → 버릴 확률 0", note: "t/f=10이면 1−√10이 약 −2.162로 음수입니다. 확률이 될 수 없어 0으로 제한합니다. 이 max는 논문 식을 확률로 읽기 위한 제한이며, 원본 C에 이 호출이 있다는 뜻은 아닙니다.", at: -6, y: 0 },
  { label: "꺾이는 자리", summary: "f = t", note: "f가 t와 같을 때 t/f=1이라 버릴 확률이 0입니다. 그보다 드문 단어는 모두 남기고, 더 흔할수록 버릴 확률이 1에 가까워집니다. 빈도가 작다고 중요한 단어라고 증명되는 것은 아닙니다.", at: -5, y: 0 },
] as const;

export default function DiscardCurveViz() {
  return (
    <SceneShell
      eyebrow="논문 식의 제거 확률"
      title="기준 t보다 흔해지는 순간부터 버릴 확률이 올라갑니다"
      description="가로는 단어의 상대빈도 f(칸마다 10배)이고 세로는 한 출현을 버릴 확률입니다. 기준은 논문이 보통이라고 설명한 t=10⁻⁵입니다."
      ariaLabel="상대빈도에 따른 논문 식의 제거 확률 곡선과 두 사례"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <LinePlot
            domain={[-7, 0]}
            range={[0, 1.08]}
            xTicks={X_TICKS}
            yTicks={Y_TICKS}
            xLabel="상대빈도 f"
            yLabel="버릴 확률"
            ariaLabel={`${scene.label}: ${scene.summary}`}
            series={[{ points: POINTS, color: "#2563eb" }]}
            guides={[{ x: T, color: "#94a3b8" }]}
            markers={[{ x: scene.at, y: scene.y, color: "#dc2626", label: active === 0 ? "0.9" : active === 1 ? "0" : "t", dx: active === 0 ? -8 : 0, dy: -8, anchor: active === 0 ? "end" : "middle" }]}
          />
        );
      }}
    />
  );
}
