import LSTMArchViz from './viz/LSTMArchViz';
import WindowSliding from './WindowSliding';
import TrainingCode from './TrainingCode';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 시계열 데이터 학습 표준 파이프라인
//
// [1] 데이터 전처리
//     raw_data  →  정규화 (StandardScaler / MinMaxScaler)
//                → 결측치 처리 (forward fill / interpolation)
//                → 계절성 분해 (선택적)
//
// [2] 윈도우 슬라이딩
//     window_size = 30  (look-back)
//     horizon = 1       (몇 스텝 앞을 예측할지)
//
//     X[i] = data[i : i+window_size]       # 입력 시퀀스
//     y[i] = data[i+window_size : i+w+h]   # 타겟
//
// [3] Train/Val/Test 분할
//     CRITICAL: 시계열은 "시간 순서대로" 분할
//     - 무작위 셔플 금지 (미래 데이터 누출)
//     - 예: 처음 70% train, 다음 15% val, 마지막 15% test
//
// [4] 배치 구성
//     batch_size = 32 ~ 128
//     shape: (batch, window_size, features)
//
// [5] 모델 학습
//     - loss: MSE (회귀) / MAE (이상치 robust)
//     - optimizer: Adam (lr=1e-3)
//     - scheduler: ReduceLROnPlateau / CosineAnnealing
//     - gradient clipping: max_norm=1.0 (필수)
//     - early stopping: validation loss 기준
//
// [6] 평가
//     - RMSE, MAE, MAPE (평균 절대 백분율 오차)
//     - Rolling forecast origin 방식 권장`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">아키텍처 설계 고려사항</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 하이퍼파라미터 가이드
//
// hidden_size: 32, 64, 128, 256
//   - 데이터 크기에 비례
//   - 작은 데이터셋: 32~64 (과적합 방지)
//   - 대형 데이터셋: 128~256
//
// num_layers: 1, 2, 3
//   - 1층: 간단한 패턴, 빠른 학습
//   - 2층: 일반적인 선택 (성능/속도 균형)
//   - 3층+: 복잡한 패턴, 과적합 위험 증가
//
// dropout: 0.1 ~ 0.3
//   - 레이어 간에만 적용 (시간축 dropout 아님)
//   - variational dropout 사용 시 시간축 적용 가능
//
// window_size: 데이터 주기성에 맞춤
//   - 일별 데이터: 30 (한 달) or 365 (1년)
//   - 시간별: 24, 168 (일주일)
//   - 분 단위: 60, 1440 (하루)
//
// Bidirectional LSTM (Bi-LSTM):
//   forward_LSTM + backward_LSTM을 concat
//   - NLP: 유리 (양쪽 문맥)
//   - 실시간 예측: 사용 불가 (미래 정보 필요)
//   - 오프라인 분석·이상 탐지에만 활용
//
// Stacked LSTM 주의:
//   return_sequences=True가 중간 레이어에 필수
//   마지막 레이어만 return_sequences=False`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>시간 순서 분할</strong>은 시계열의 최우선 원칙 — 셔플은 데이터 누출 유발.<br />
          요약 2: <strong>gradient clipping (max_norm=1.0)</strong>은 LSTM 학습 안정성의 필수 조건.<br />
          요약 3: Bi-LSTM은 오프라인 분석 전용, 실시간 예측에는 부적합.
        </p>
      </div>
    </section>
  );
}
