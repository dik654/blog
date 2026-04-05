import ComparisonTable from './ComparisonTable';
import UseCases from './UseCases';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2020년 이후 시계열 Transformer 혁신
//
// 1. Informer (AAAI 2021)
//    - ProbSparse Attention: O(L log L) 복잡도
//    - 긴 시퀀스 (L > 1000) 예측 효율화
//    - Distilling: 중요 시점만 유지
//
// 2. Autoformer (NeurIPS 2021)
//    - Auto-Correlation 메커니즘
//    - FFT 기반 주기성 탐지
//    - 분해(decomposition) 내장
//
// 3. FEDformer (ICML 2022)
//    - Frequency Enhanced Decomposition
//    - 주파수 도메인 attention
//    - 시즌성 패턴에 강함
//
// 4. PatchTST (ICLR 2023)
//    - 시계열을 패치로 분할 (ViT 방식)
//    - Channel-independent 처리
//    - 단순 구조로 SOTA 달성 (2023년)
//
// 5. TimesNet (ICLR 2023)
//    - 1D → 2D 변환 (주기 기반)
//    - CNN으로 inter-period 패턴 포착
//
// 6. TimeMixer (ICLR 2024)
//    - Multi-scale MLP mixing
//    - Transformer 없이 단순 MLP로 SOTA
//
// 공통 트렌드:
// - Channel independence (변수별 독립 처리)가 대세
// - 시계열 분해(trend + seasonal) 내장
// - 단순한 구조가 복잡한 Attention보다 유리
//
// 놀라운 사실 (Zeng et al. 2022, "Are Transformers Effective?"):
// - 단순 Linear 모델(DLinear)이 다수 벤치마크에서 Transformer 압도
// - 시계열의 inductive bias를 무시한 Attention은 오히려 해로울 수 있음`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM의 현재 위치</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LSTM이 여전히 유효한 시나리오
//
// [1] 온라인 학습 (Online Learning)
//     - 새 데이터가 실시간 스트리밍으로 도착
//     - 모델이 incremental update 필요
//     - Transformer: 전체 window 재연산 비용 큼
//     - LSTM: hidden state만 업데이트, O(1)
//
// [2] 저자원 디바이스 (Edge/Mobile)
//     - IoT 센서, 스마트폰, 임베디드
//     - 메모리/연산 예산 제약
//     - LSTM: O(1) 상태, 고정 메모리
//     - Transformer: O(n²) attention, 제약 환경에 부적합
//
// [3] 소규모 데이터셋 (< 10만 샘플)
//     - Transformer는 pretraining 없이 과적합
//     - LSTM은 inductive bias가 시퀀스에 맞음
//     - 의료, 금융 niche 도메인에서 여전히 강세
//
// [4] 강화학습 에이전트의 memory
//     - RL 정책 네트워크의 recurrent 상태
//     - PPO, A3C 등에서 LSTM cell 사용
//     - 부분 관측(POMDP) 환경 표준
//
// [5] 스피치/오디오 스트리밍
//     - Real-time Automatic Speech Recognition
//     - Streaming TTS
//     - 지연(latency) 최소화 필수
//
// 실무 의사결정 트리:
//   데이터 > 100만? → Transformer 계열 우선
//   실시간 스트리밍? → LSTM / GRU
//   배치 오프라인 예측? → PatchTST / DLinear / LSTM 벤치마크
//   엣지 디바이스? → LSTM / GRU (양자화 포함)`}
        </pre>
        <p className="leading-7">
          요약 1: 2023년 이후 <strong>PatchTST, DLinear</strong> 등 단순 모델이 Transformer를 압도.<br />
          요약 2: LSTM은 <strong>온라인 학습·엣지·저자원·RL</strong> 영역에서 여전히 실용적 우위.<br />
          요약 3: "무조건 Transformer" 통념을 버리고 데이터 규모·지연·환경을 기준으로 선택.
        </p>
      </div>
    </section>
  );
}
