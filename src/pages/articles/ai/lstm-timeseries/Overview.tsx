import GradientProblemViz from './viz/GradientProblemViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RNN의 한계와 LSTM의 등장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RNN(Recurrent Neural Network) — 시퀀스 데이터를 처리하는 가장 기본적인 구조<br />
          시퀀스가 길어지면 <strong>기울기 소실(Vanishing Gradient)</strong> 문제 발생<br />
          장기 의존성을 학습하지 못함
        </p>
      </div>
      <div className="not-prose my-6"><GradientProblemViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          1997년 <strong>Hochreiter & Schmidhuber</strong>가 제안한 LSTM — <strong>게이트 메커니즘</strong>과 <strong>셀 상태(Cell State)</strong>로 해결<br />
          셀 상태는 컨베이어 벨트처럼 정보를 거의 손실 없이 전달<br />
          세 개의 게이트(Forget, Input, Output)가 정보의 흐름을 제어
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">RNN vs LSTM 핵심 차이</h3>
        <div className="grid grid-cols-2 gap-4 not-prose text-sm">
          {[
            ['RNN', 'h_t = tanh(W · [h_{t-1}, x_t])', '단일 tanh — 기울기 소실', '#ef4444'],
            ['LSTM', 'C_t + 3 Gates → h_t', '셀 상태 + 게이트 — 장기 기억 보존', '#10b981'],
          ].map(([name, eq, desc, color]) => (
            <div key={name} className="rounded-lg border p-3"
              style={{ borderColor: color + '40', background: color + '08' }}>
              <p className="font-mono font-bold text-xs" style={{ color: color as string }}>{name}</p>
              <p className="text-[11px] text-foreground/60 mt-1 font-mono">{eq}</p>
              <p className="text-[11px] text-foreground/50 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">기울기 소실 수학적 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RNN 역전파 과정에서의 기울기 계산
// ∂L/∂h_0 = ∂L/∂h_T × ∏(t=1 to T) ∂h_t/∂h_{t-1}
//
// 각 시점의 야코비안(Jacobian):
// ∂h_t/∂h_{t-1} = diag(tanh'(z_t)) · W_hh
//
// 여기서 tanh'(x) = 1 - tanh²(x) ≤ 1
// 그리고 가중치 행렬 W_hh의 스펙트럼 반경을 ρ(W)라 하면:
//
// 기울기 크기 ≤ ρ(W)^T × (tanh' 최대값)^T
//
// T가 커질수록 두 경우 발생:
// 1) ρ(W) × tanh_max < 1  →  기울기 소실 (0으로 수렴)
// 2) ρ(W) × tanh_max > 1  →  기울기 폭발 (무한대로 발산)
//
// 실무에서는:
// - 일반적인 초기화(Xavier, He)에서 ρ(W) ≈ 1 근처
// - sigmoid/tanh의 포화 영역에서 미분값 << 1
// - 시퀀스 길이 T=100 이상이면 50스텝 이전의 영향력이 10^-10 수준으로 소멸
//
// LSTM의 해결 방식:
// - 셀 상태 경로: ∂C_t/∂C_{t-1} = f_t (forget gate 값)
// - forget gate가 1에 가까우면 기울기가 거의 감쇠 없이 전달
// - additive update 구조 (C_t = f_t·C_{t-1} + i_t·C̃_t)가 핵심`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM 설계의 핵심 통찰</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. 게이트 메커니즘 (Gating Mechanism)
//    - sigmoid로 0~1 범위의 "밸브" 역할
//    - 정보를 선택적으로 통과 / 차단
//    - 학습 가능한 동적 제어 (정적 필터가 아님)
//
// 2. 셀 상태 (Cell State, C_t)
//    - hidden state와 분리된 별도 "메모리 라인"
//    - 컨베이어 벨트처럼 시간축 방향으로 흐름
//    - 게이트로만 수정 가능 (직접 변환 없음)
//
// 3. Additive Update
//    - C_t = f_t * C_{t-1} + i_t * C̃_t
//    - 곱셈이 아닌 덧셈 기반 업데이트
//    - 기울기 흐름이 훨씬 안정적
//
// 4. Identity Shortcut
//    - forget gate f_t ≈ 1일 때 C_t ≈ C_{t-1}
//    - 정보를 손실 없이 장기간 보존
//    - ResNet의 skip connection과 유사한 발상
//
// 역사적 배경:
// - 1991년 Hochreiter 석사 논문에서 vanishing gradient 문제 제기
// - 1997년 LSTM 논문 (Hochreiter & Schmidhuber, Neural Computation)
// - 1999년 Gers et al.이 forget gate 추가 (원조 LSTM은 없었음)
// - 2000년대 초 음성 인식(Alex Graves)에서 대성공
// - 2014년 seq2seq로 기계 번역 혁명 (Sutskever et al.)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>기울기 소실</strong>은 RNN의 구조적 한계 — 곱셈 기반 재귀가 T 스텝 동안 ρ(W)^T로 붕괴.<br />
          요약 2: LSTM의 <strong>additive update</strong>와 forget gate가 기울기 고속도로를 만들어 장기 의존성 학습 가능.<br />
          요약 3: 현재도 <strong>소규모 데이터·실시간 스트리밍·저자원 환경</strong>에서 LSTM은 Transformer보다 실용적.
        </p>
      </div>
    </section>
  );
}
