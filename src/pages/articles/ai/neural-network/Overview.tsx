import NetworkLayersViz from './viz/NetworkLayersViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">퍼셉트론에서 신경망으로</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          퍼셉트론(Perceptron) — 입력에 가중치를 곱해 임계값 함수로 0/1 출력<br />
          <strong>신경망</strong> — 임계값 함수 대신 매끄러운 활성화 함수(sigmoid 등)를 사용<br />
          이 차이가 "학습 가능한 모델"을 만드는 핵심
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3층 구조</h3>
        <p>
          <strong>입력층(0층)</strong> — 데이터를 그대로 받는 층. 연산 없음<br />
          <strong>은닉층(1층, 2층)</strong> — 중간에서 특징(Feature)을 추출하는 층<br />
          <strong>출력층(3층)</strong> — 최종 판단을 내리는 층. 분류/회귀 결과 출력
        </p>
        <p>
          핵심 차이: 은닉층이 여러 겹 쌓이면서 복잡한 패턴을 표현 가능<br />
          퍼셉트론은 선형 분리만 가능 → 신경망은 비선형 경계까지 학습
        </p>
      </div>
      <div className="not-prose mt-8">
        <NetworkLayersViz />
      </div>
    </section>
  );
}
