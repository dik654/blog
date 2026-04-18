import OverviewViz from './viz/OverviewViz';
import OverviewDetailViz from './viz/OverviewDetailViz';
import M from '@/components/ui/math';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RNN의 한계와 LSTM</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        바닐라 RNN — 긴 시퀀스에서 기울기 소실(vanishing gradient) 발생.<br />
        LSTM(1997)은 게이트 메커니즘으로 이 문제를 해결한다.
      </p>
      <OverviewViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM 등장 배경</h3>
        <OverviewDetailViz />
        <p className="leading-7">
          Vanilla RNN의 기울기 전파 — 시간 역방향으로 <M>{'W_{hh}'}</M>를 반복 곱셈하여 기울기가 지수적으로 변화.
        </p>
        <M display>{'\\frac{\\partial h_t}{\\partial h_k} = \\prod_{i=k+1}^{t} \\underbrace{W_{hh} \\cdot \\text{diag}(\\tanh\'(\\cdots))}_{\\text{각 단계마다 곱해지는 행렬}}'}</M>
        <p className="leading-7">
          <M>{'|\\lambda_{\\max}(W_{hh})| < 1'}</M>이면 기울기 소실, <M>{'> 1'}</M>이면 폭발.<br />
          LSTM의 해결: 곱셈(×W) 대신 <strong>덧셈(+) 경로</strong>로 정보 전달 — 셀 상태를 통한 "gradient highway".
        </p>
        <M display>{'\\underbrace{C_t}_{\\text{새 셀 상태}} = \\underbrace{f_t \\odot C_{t-1}}_{\\text{선택적 보존}} + \\underbrace{i_t \\odot \\tilde{C}_t}_{\\text{새 정보 추가}}'}</M>
        <p className="leading-7">
          3개의 게이트 — forget(버릴 정보), input(추가할 정보), output(출력할 정보)으로 정보를 선택적으로 기억·망각.<br />
          Transformer(2017)에 대부분 대체되었으나, 시계열 예측·임베디드 환경에서 여전히 유효.<br />
          Mamba(2023), RWKV 등 현대 아키텍처도 LSTM의 게이트 아이디어를 계승.
        </p>
      </div>
    </section>
  );
}
