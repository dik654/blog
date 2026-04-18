import ComparisonTable from './ComparisonTable';
import UseCases from './UseCases';
import TransformerTSDetailViz from './viz/TransformerTSDetailViz';
import LSTMPositionDetailViz from './viz/LSTMPositionDetailViz';

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">응용 & Transformer 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LSTM — 시계열 분석의 다양한 영역에서 활용<br />
          최근 Transformer 기반 모델이 주목받고 있으나,<br />
          <strong>데이터가 적거나 실시간 처리가 필요한 경우</strong> LSTM이 여전히 강력
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 활용 분야</h3>
      </div>

      <div className="not-prose my-6"><UseCases /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM vs Transformer</h3>
        <p>
          Transformer — <strong>Self-Attention</strong>으로 모든 시점을 동시에 참조 가능, 병렬 처리와 장기 의존성에 유리<br />
          LSTM — <strong>순차적 구조</strong> 덕분에 온라인 학습과 스트리밍에 적합
        </p>
      </div>

      <div className="not-prose my-6"><ComparisonTable /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">실무 선택 가이드</h3>
        <p>
          데이터 10만 건 이하 / 실시간 스트리밍 필요 / 해석 가능성 중요 → LSTM 고려<br />
          대규모 데이터와 병렬 학습이 가능하다면 → Transformer 기반 모델(Informer, PatchTST 등)이 유리
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">시계열 Transformer 변형들</h3>
        <div className="not-prose"><TransformerTSDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM의 현재 위치</h3>
        <div className="not-prose"><LSTMPositionDetailViz /></div>
        <p className="leading-7">
          요약 1: 2023년 이후 <strong>PatchTST, DLinear</strong> 등 단순 모델이 Transformer를 압도.<br />
          요약 2: LSTM은 <strong>온라인 학습·엣지·저자원·RL</strong> 영역에서 여전히 실용적 우위.<br />
          요약 3: "무조건 Transformer" 통념을 버리고 데이터 규모·지연·환경을 기준으로 선택.
        </p>
      </div>
    </section>
  );
}
