import GPSMapViz from './viz/GPSMapViz';
import BackpropEfficiencyViz from './viz/BackpropEfficiencyViz';
import TrainingLoopViz from './viz/TrainingLoopViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 역전파인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GPT-4 — 약 <strong>수천억 개의 파라미터</strong>(가중치)<br />
          이 파라미터를 각각 어떤 방향으로, 얼마나 업데이트할지 계산하는 알고리즘 = <strong>역전파(Backpropagation)</strong>
        </p>
        <p>
          추상적 수식 대신, <strong>가장 작은 모델 하나를 처음부터 끝까지</strong> 학습시켜 본다
        </p>

        <h3>예제: 경도 → 도시 분류</h3>
        <p>
          상황 — 유럽 여행 중 GPS가 <strong>경도(longitude) 숫자 하나</strong>만 알려줌<br />
          이 숫자만으로 지금 <strong>마드리드(-3.7°) / 파리(2.4°) / 베를린(13.4°)</strong> 중 어디인지 맞추는 모델<br />
          뉴런 3개, 가중치 6개뿐인 최소 신경망 — 역전파의 모든 단계를 손으로 따라갈 수 있는 크기
        </p>
        <p>
          처음엔 <strong>랜덤 가중치</strong>로 엉터리 확률을 내놓음<br />
          역전파를 반복할수록 <strong>경도 -3.7 입력 → 마드리드 확률 상승</strong>하도록 가중치가 조정되는 과정을 따라간다
        </p>
      </div>
      <div className="not-prose mt-8">
        <GPSMapViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Backpropagation 개념 정리</h3>
        <p>
          Backprop = <strong>Chain Rule + Dynamic Programming</strong><br />
          효율성이 핵심 — naive 방법 대비 수조 배 빠름
        </p>
      </div>
      <BackpropEfficiencyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">학습 전체 루프</h3>
        <p>
          초기화 → 순전파 → 손실 → 역전파 → 업데이트 → 반복 — 수렴까지 loop
        </p>
      </div>
      <TrainingLoopViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Backprop은 <strong>chain rule + dynamic programming</strong> — 효율성의 핵심.<br />
          요약 2: <strong>Reverse mode autodiff</strong>가 신경망에 최적.<br />
          요약 3: <strong>Forward → Loss → Backward → Update</strong> 4단계가 학습의 본질.
        </p>
      </div>
    </section>
  );
}
