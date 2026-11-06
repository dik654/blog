import SceneShell from "./SceneShell";
import { PhaseDial } from "./PhaseDial";

/**
 * 본문 대응: #extension-attempts — PI는 m을 m/s로 바꾼다. s=8.
 * 느린 차원(i=63) 마지막 위치: 216.8° → 216.8/8 = 27.1°.
 * 빠른 차원(i=0, θ=1 rad) 이웃 token의 각도 차: 57.3° → 57.3/8 ≈ 7.2°.
 */
const SLOW_BEFORE = 216.8;
const SLOW_AFTER = 27.1;
const NEAR_BEFORE = 180 / Math.PI;
const NEAR_AFTER = NEAR_BEFORE / 8;

const SCENES = [
  { label: "PI를 쓰기 전", summary: "216.8° · 이웃 차 57.3°", slow: SLOW_BEFORE, near: NEAR_BEFORE, note: "왼쪽은 위치 32768에서 느린 차원의 바늘입니다. 오른쪽은 가장 빠른 차원에서 이웃한 두 token이 만드는 각도 차입니다. 이 차원은 한 칸에 1 라디안, 약 57.3°를 돕니다." },
  { label: "얻는 것", summary: "216.8° → 27.1°", slow: SLOW_AFTER, near: NEAR_BEFORE, note: "모든 위치를 8로 나누면 32768은 4096 자리로 들어옵니다. 느린 차원의 바늘은 216.8÷8=27.1°, 학습 때 본 범위의 끝으로 돌아옵니다." },
  { label: "내주는 것", summary: "57.3° → 약 7.2°", slow: SLOW_AFTER, near: NEAR_AFTER, note: "같은 나눗셈이 빠른 차원에도 적용됩니다. 이웃 token의 각도 차가 57.3÷8≈7.2°로 좁아져 두 바늘이 가까워집니다. 근거리 해상도가 줄어든다는 말이 이 그림입니다." },
] as const;

export default function PiTradeoffViz() {
  return (
    <SceneShell
      eyebrow="Position Interpolation의 교환"
      title="같은 8분의 1이 먼 위치는 되돌리고 이웃 token은 좁힙니다"
      description="L=4096을 L′=32768(s=8)로 늘리는 예시입니다. 왼쪽 파란 영역은 느린 차원이 학습 때 본 각도, 빨간 점선 영역은 그 범위를 넘어 지나간 각도이고, 오른쪽 두 바늘은 이웃한 두 token입니다. 점선은 PI 적용 전 바늘입니다."
      ariaLabel="위치를 8로 나눌 때 느린 차원의 마지막 각도와 빠른 차원의 이웃 각도 차"
      scenes={SCENES}
      render={(active) => {
        const { slow, near } = SCENES[active];
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <PhaseDial
              cx={92}
              cy={96}
              radius={60}
              seen={SLOW_AFTER}
              needle={slow}
              ghost={slow === SLOW_AFTER ? SLOW_BEFORE : undefined}
              unseenTo={slow > SLOW_AFTER ? slow : undefined}
              title="i=63, 위치 32768"
              value={`${slow.toFixed(1)}°`}
            />
            <PhaseDial cx={268} cy={96} radius={60} seen={null} needle={0} needleTwo={near} ghost={near === NEAR_AFTER ? NEAR_BEFORE : undefined} title="i=0, 이웃 두 token" value={`차이 ${near === NEAR_AFTER ? "약 7.2" : "57.3"}°`} />
          </svg>
        );
      }}
    />
  );
}
