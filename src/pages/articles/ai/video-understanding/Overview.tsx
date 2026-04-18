import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비디오 vs 이미지 차이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이미지 — H x W x C, 한 장의 정지된 장면<br />
          비디오 — <strong>T x H x W x C</strong>, 시간 축 T가 추가된 4D 텐서<br />
          16프레임 기준으로도 데이터 볼륨이 16배 증가, 64프레임이면 64배
        </p>
        <p>
          이 차이가 모델 설계 전체를 바꿈 — 메모리 관리, 샘플링 전략, 어텐션 구조 모두 새로 설계해야 한다
        </p>
      </div>
      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">시공간(Spatiotemporal) 피처</h3>
        <p>
          <strong>공간(Spatial)</strong> — 한 프레임 안에서 물체의 위치, 형태, 질감을 인식<br />
          <strong>시간(Temporal)</strong> — 프레임 간 움직임, 변화 속도, 인과관계를 포착<br />
          비디오 이해의 핵심: 두 축을 동시에 모델링하는 <strong>시공간 피처 추출</strong>
        </p>
        <p>
          예: "사람이 공을 찬다" — 공간 피처(사람, 공)만으로는 부족, 시간 피처("차는 동작")가 있어야 행동 인식 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 과제와 실전 응용</h3>
        <p>
          <strong>행동 인식</strong>(Action Recognition) — 영상 전체를 하나의 레이블로 분류. Kinetics-400이 대표 벤치마크<br />
          <strong>시간 위치화</strong>(Temporal Localization) — 긴 영상에서 특정 이벤트의 시작/끝 시점을 탐지<br />
          <strong>비디오 캡셔닝</strong>(Video Captioning) — 영상 내용을 자연어 문장으로 생성
        </p>
        <p>
          구조물 안정성 분석: 10초 시뮬레이션 영상에서 균열 진행 패턴을 시간 축으로 추적<br />
          딥페이크 탐지: 프레임 간 미세 불일치(깜빡임 비율, 입술 비동기)를 시간 축에서 감지<br />
          의료 영상: 초음파/내시경 동영상에서 병변의 크기 변화를 시계열로 분석
        </p>
        <p>
          공통점 — 모두 <strong>"시간 축 패턴 분석"</strong>이 핵심 능력. 이미지 모델로는 불가능한 영역
        </p>
      </div>
    </section>
  );
}
