import SceneShell from "./SceneShell";
import { PhaseDial } from "./PhaseDial";

/**
 * 본문 대응: #long-context-scope — d=128, base=10000, L=4096→L′=32768.
 * i=63: θ=10000^(−126/128) rad → 4096에서 27.1°, 8192에서 54.2°, 32768에서 216.8°.
 * i=0: θ=1 rad → 4096/2π≈652바퀴, 32768/2π≈5,215바퀴. 바늘 각도는 위치(rad)를 한 바퀴로 나눈 나머지.
 */
const SLOW = 10000 ** (-126 / 128);
const toDegrees = (radians: number) => (radians * 180) / Math.PI;
const slowAt = (position: number) => toDegrees(SLOW * position);
const fastAt = (position: number) => toDegrees(position) % 360;
const SEEN_DEG = slowAt(4096);

const SCENES = [
  { label: "위치 4096까지", summary: "느린 27.1° · 빠른 약 652바퀴", position: 4096, fastTurns: "약 652바퀴", note: "학습 길이 끝에서 느린 차원의 바늘은 27.1°까지 왔습니다. 모델이 이 차원에서 본 각도는 파란 부채꼴뿐입니다. 빠른 차원은 이미 원 전체를 여러 번 돌았습니다." },
  { label: "위치 8192 (2배)", summary: "느린 54.2° · 파란 범위를 넘음", position: 8192, fastTurns: "약 1,304바퀴", note: "조정 없이 위치만 늘리면 느린 차원의 바늘은 위치에 비례해 계속 돕니다. 위치가 두 배이니 각도도 두 배인 54.2°이고, 벌써 학습 때 본 범위 밖입니다." },
  { label: "위치 32768 (8배)", summary: "느린 216.8° · 빠른 쪽은 본 각도 안", position: 32768, fastTurns: "약 5,215바퀴", note: "느린 차원은 216.8°로, 학습 때 본 적 없는 각도에 닿습니다. 빠른 차원의 바늘은 어디를 가리켜도 이미 본 각도입니다. 같은 8배 확장이 차원마다 다른 문제가 되는 이유입니다." },
] as const;

export default function ExtrapolationDialViz() {
  return (
    <SceneShell
      eyebrow="학습 범위 밖의 각도"
      title="조정 없이 늘리면 느린 차원의 바늘만 낯선 각도로 갑니다"
      description="바늘 하나가 RoPE의 한 차원이고, 바늘 각도가 그 위치의 위상입니다. 파란 영역은 학습 길이 L=4096 안에서 본 각도, 빨간 점선 영역은 그 범위를 넘어 지나간 각도이며, 숫자는 위 그림과 같은 d=128, base 10000 예시입니다."
      ariaLabel="위치가 늘어날 때 가장 느린 차원과 가장 빠른 차원의 각도"
      scenes={SCENES}
      render={(active) => {
        const { position, fastTurns } = SCENES[active];
        const angle = slowAt(position);
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <PhaseDial
              cx={92}
              cy={96}
              radius={60}
              seen={SEEN_DEG}
              needle={angle}
              unseenTo={angle > SEEN_DEG ? angle : undefined}
              title="i=63 (가장 느림)"
              value={`${angle.toFixed(1)}°`}
            />
            <PhaseDial cx={268} cy={96} radius={60} seen="all" needle={fastAt(position)} title="i=0 (가장 빠름)" value={fastTurns} />
          </svg>
        );
      }}
    />
  );
}
