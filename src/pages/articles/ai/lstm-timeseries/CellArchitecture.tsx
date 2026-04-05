import LSTMCellFlowViz from './viz/LSTMCellFlowViz';
import GateFlowViz from './viz/GateFlowViz';
import GateEquations from './GateEquations';

export default function CellArchitecture() {
  return (
    <section id="cell-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LSTM 셀 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LSTM 셀 — <strong>세 개의 게이트</strong>와 <strong>셀 상태(Cell State)</strong>로 구성<br />
          셀 상태는 시간축을 따라 정보를 전달하는 "고속도로"<br />
          게이트들이 이 고속도로에 정보를 추가하거나 제거
        </p>
      </div>

      <div className="not-prose my-6"><LSTMCellFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">게이트 연산 상세</h3>
        <p>
          각 게이트는 <strong>sigmoid(σ)</strong> 함수를 사용하여 0~1 사이의 값 출력<br />
          이 값이 정보의 "통과 비율" 결정 — 0이면 완전 차단, 1이면 완전 통과
        </p>
      </div>

      <div className="not-prose my-6"><GateFlowViz /></div>

      <GateEquations />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">셀 상태 업데이트 흐름 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LSTM 셀 한 스텝의 완전한 연산 순서
//
// 입력: x_t (현재 입력), h_{t-1} (이전 히든), C_{t-1} (이전 셀 상태)
// 출력: h_t (현재 히든), C_t (현재 셀 상태)
//
// Step 1: 연결된 벡터 생성
//   concat = [h_{t-1}, x_t]   shape: (hidden + input_dim,)
//
// Step 2: 세 게이트 + 후보값 동시 계산 (보통 한 번에)
//   f_t = sigmoid(W_f @ concat + b_f)   # forget gate
//   i_t = sigmoid(W_i @ concat + b_i)   # input gate
//   o_t = sigmoid(W_o @ concat + b_o)   # output gate
//   C̃_t = tanh(W_C @ concat + b_C)     # candidate
//
// Step 3: 셀 상태 업데이트 (핵심)
//   C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t
//        └──────┬──────┘   └────┬────┘
//         이전 기억 보존/삭제   새 정보 추가
//
// Step 4: 히든 상태 계산
//   h_t = o_t ⊙ tanh(C_t)
//
// 여기서 ⊙는 element-wise 곱 (Hadamard product)
// @는 행렬 곱
//
// 파라미터 개수 (입력 차원 d, 히든 차원 h):
//   각 게이트: (d + h) × h + h  (weight + bias)
//   4개 게이트 총합: 4 × ((d + h) × h + h)
//   예: d=100, h=128이면 약 117K 파라미터`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">각 게이트의 의미와 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Forget Gate (f_t) — "무엇을 잊을까?"
// - 이전 셀 상태 C_{t-1}의 각 차원에 대해 유지 비율 결정
// - f_t = 1  →  완전히 보존 (장기 기억)
// - f_t = 0  →  완전히 삭제
// - 예: 새 문장이 시작되면 이전 주어 정보를 잊음
//
// Input Gate (i_t) — "무엇을 기록할까?"
// - 새로 들어온 후보값 C̃_t 중 저장할 부분 선택
// - i_t = 1  →  전부 저장
// - i_t = 0  →  전부 무시
// - 예: "중요한" 키워드가 나올 때 활성화
//
// Candidate (C̃_t) — "새 후보 기억"
// - tanh로 -1 ~ 1 범위 정규화된 새 정보
// - input gate와 곱해져 실제 저장량 결정
// - 셀 상태가 너무 커지지 않도록 범위 제한
//
// Output Gate (o_t) — "무엇을 내보낼까?"
// - 현재 셀 상태 중 히든으로 노출할 부분 선택
// - h_t는 다음 레이어/시점에서만 보임
// - C_t는 내부 "long-term" 메모리, h_t는 "working" 메모리
//
// 초기화 팁:
// - forget bias를 +1 근처로 초기화 (Jozefowicz 2015)
// - 기본값 0이면 초기 f_t ≈ 0.5라 기억이 빠르게 소실`}
        </pre>
        <p className="leading-7">
          요약 1: LSTM 셀은 <strong>3 게이트 + 1 후보 + 1 셀 상태 + 1 히든</strong>으로 6개 변수가 상호작용.<br />
          요약 2: <strong>셀 상태 C_t</strong>는 장기 기억 라인, <strong>히든 h_t</strong>는 외부 노출용.<br />
          요약 3: forget gate bias를 +1로 초기화하면 초기 학습 안정성이 눈에 띄게 개선.
        </p>
      </div>
    </section>
  );
}
