import LSTMArchViz from './viz/LSTMArchViz';
import WindowSliding from './WindowSliding';
import TrainingCode from './TrainingCode';
import TrainingPipelineDetailViz from './viz/TrainingPipelineDetailViz';
import ArchDesignDetailViz from './viz/ArchDesignDetailViz';

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시계열 학습 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          시계열 데이터를 LSTM에 학습시키려면:<br />
          <strong>윈도우 슬라이딩</strong>(sliding window, 고정 길이로 시퀀스를 분할하는 기법)으로 시퀀스 분할 + 적절한 아키텍처 설계
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">다층 LSTM 아키텍처</h3>
      </div>

      <div className="not-prose my-6"><LSTMArchViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">윈도우 슬라이딩</h3>
        <p>
          연속된 시계열을 <strong>고정 길이 윈도우</strong>로 잘라서 입력-타겟 쌍 생성<br />
          윈도우 크기(look-back)는 주요 하이퍼파라미터
        </p>
      </div>

      <div className="not-prose my-6"><WindowSliding /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">양방향 LSTM (Bi-LSTM)</h3>
        <p>
          양방향 LSTM — 시퀀스를 <strong>정방향과 역방향</strong> 두 방향으로 처리하여 과거와 미래 문맥을 모두 활용<br />
          NLP에서는 매우 효과적<br />
          실시간 시계열 예측에서는 미래 정보를 사용할 수 없어 주의 필요
        </p>
      </div>

      <TrainingCode />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">학습 파이프라인 전체 흐름</h3>
        <div className="not-prose"><TrainingPipelineDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">아키텍처 설계 고려사항</h3>
        <div className="not-prose"><ArchDesignDetailViz /></div>
        <p className="leading-7">
          요약 1: <strong>시간 순서 분할</strong>은 시계열의 최우선 원칙 — 셔플은 데이터 누출 유발.<br />
          요약 2: <strong>gradient clipping (max_norm=1.0)</strong>은 LSTM 학습 안정성의 필수 조건.<br />
          요약 3: Bi-LSTM은 오프라인 분석 전용, 실시간 예측에는 부적합.
        </p>
      </div>
    </section>
  );
}
