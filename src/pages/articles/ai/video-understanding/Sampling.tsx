import SamplingViz from './viz/SamplingViz';

export default function Sampling() {
  return (
    <section id="sampling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프레임 샘플링 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          비디오를 모델에 넣기 전 <strong>어떤 프레임을 선택할 것인가</strong> — 이것이 샘플링 전략<br />
          모든 프레임을 쓸 수 없는 이유: 30fps x 10초 = 300프레임, GPU 메모리가 부족<br />
          실전에서 8~32프레임을 선택하는 것이 일반적
        </p>
        <p>
          <strong>Uniform Sampling</strong> — 전체 T프레임에서 N개를 균등 간격으로 추출<br />
          간격 = T / N. 전체 시간 범위를 빠짐없이 커버하지만, 빠른 동작이 간격 사이에서 누락될 수 있음
        </p>
        <p>
          <strong>Temporal Stride</strong> — 시작점부터 고정 보폭(stride)으로 연속 추출<br />
          지역적 시간 연속성을 잘 보존. 단점: stride가 작으면 영상 후반부를 아예 보지 못함
        </p>
        <p>
          <strong>Key Frame Selection</strong> — 프레임 간 변화량(히스토그램 차이, optical flow 크기)을 측정해 급변 지점을 선택<br />
          장면 전환이나 급격한 움직임을 확실히 포착하지만, 정적 구간의 정보가 부족할 수 있음
        </p>
      </div>
      <div className="not-prose my-8">
        <SamplingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">프레임 수 vs 정확도 vs 메모리</h3>
        <p>
          프레임 수를 늘리면 정확도가 올라가지만, 일정 수준 이후로는 포화(diminishing returns)<br />
          GPU 메모리는 프레임 수에 비례해 선형 증가 — 64프레임이면 16프레임 대비 4배 메모리<br />
          <strong>Sweet Spot</strong>: 8~32 프레임이 정확도/메모리 균형점
        </p>
        <p>
          짧은 클립(2~5초) — 전체 프레임을 쓰거나 적은 stride로 밀집 샘플링<br />
          긴 영상(수 분 이상) — 클립 단위로 분할 후 각 클립의 예측을 집계(평균, 투표)<br />
          실전 팁: Uniform + Key Frame 혼합이 가장 robust한 전략
        </p>
      </div>
    </section>
  );
}
