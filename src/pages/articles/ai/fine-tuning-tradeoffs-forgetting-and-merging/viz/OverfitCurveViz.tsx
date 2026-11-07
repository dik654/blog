import SceneShell from "./SceneShell";

/**
 * 본문 대응: #data-tradeoff — epoch를 늘릴수록 train loss는 계속 줄고 held-out 정확도는 어느 지점부터 꺾인다.
 * 본문에 수치가 없으므로 눈금 없이 곡선 모양만 그린다. 꺾이는 위치는 설명용이다(가정).
 */
const X0 = 76;
const X1 = 350;
const PEAK = 0.45;
const SAMPLES = Array.from({ length: 61 }, (_, index) => index / 60);
const x = (t: number) => X0 + t * (X1 - X0);

const accuracy = (t: number) => (t <= PEAK ? 1 - 0.75 * ((PEAK - t) / PEAK) ** 2 : 1 - 1.6 * (t - PEAK) ** 2);
const loss = (t: number) => Math.exp(-3.2 * t);
const accY = (t: number) => 72 - accuracy(t) * 58;
const lossY = (t: number) => 164 - loss(t) * 58;
const path = (y: (t: number) => number) => SAMPLES.map((t) => `${x(t).toFixed(1)},${y(t).toFixed(1)}`).join(" ");

const SCENES = [
  { label: "학습 초반", summary: "loss ↓ · held-out ↑", t: 0.18, note: "학습 데이터의 loss가 줄면서 학습에 쓰지 않은 held-out 입력의 정확도도 함께 오릅니다." },
  { label: "꺾이는 지점", summary: "held-out이 가장 높은 곳", t: PEAK, note: "train loss는 아직 내려가는 중인데 held-out 정확도는 여기서부터 꺾입니다. train loss만 봐서는 이 지점을 알 수 없습니다." },
  { label: "더 학습하면", summary: "loss ↓ · held-out ↓", t: 0.88, note: "모델이 학습 데이터의 특정 문구·순서·길이 패턴을 암기하면, 같은 의미라도 표현만 다른 held-out 입력에서 성능이 나빠집니다. 이것이 fine-tuning overfitting입니다." },
] as const;

export default function OverfitCurveViz() {
  return (
    <SceneShell
      eyebrow="Fine-tuning overfitting"
      title="train loss는 계속 줄어도 held-out 정확도는 어느 지점부터 꺾입니다"
      description="가로는 epoch, 위는 held-out 정확도, 아래는 train loss입니다. 곡선 모양만 보이려는 그림이라 눈금을 적지 않았고, 꺾이는 위치는 설명용입니다(가정)."
      ariaLabel="epoch에 따른 train loss와 held-out 정확도 곡선"
      scenes={SCENES}
      render={(active) => {
        const t = SCENES[active].t;
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={4} y={40} fontSize={11} fontWeight={700} fill="#2563eb">held-out</text>
            <text x={4} y={54} fontSize={11} fontWeight={700} fill="#2563eb">정확도</text>
            <text x={4} y={132} fontSize={11} fontWeight={700} fill="#d97706">train loss</text>
            <line x1={X0} x2={X1} y1={76} y2={76} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={168} y2={168} stroke="#94a3b8" strokeWidth={1} />
            <polyline points={path(accY)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <polyline points={path(lossY)} fill="none" stroke="#d97706" strokeWidth={1.25} />
            <line x1={x(t)} x2={x(t)} y1={8} y2={168} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x(t)} cy={accY(t)} r={4} fill="#2563eb" />
            <rect x={x(t) - 4} y={lossY(t) - 4} width={8} height={8} fill="#d97706" />
            <text x={X1} y={186} fontSize={11} textAnchor="end" fill="#64748b">epoch →</text>
          </svg>
        );
      }}
    />
  );
}
