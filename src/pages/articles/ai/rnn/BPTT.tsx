import BPTTViz from './viz/BPTTViz';
import BPTTDetailViz from './viz/BPTTDetailViz';
import M from '@/components/ui/math';

export default function BPTT() {
  return (
    <section id="bptt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시간 역전파 (BPTT)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        BPTT — 순환 구조를 시간축으로 펼쳐 일반 역전파를 적용하는 학습 알고리즘.
      </p>
      <BPTTViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BPTT 상세</h3>
        <BPTTDetailViz />
        <p className="leading-7">
          BPTT: 순환 구조를 T 타임스텝으로 펼쳐(unroll) 일반 역전파를 적용.
        </p>
        <M display>{'\\frac{\\partial L}{\\partial W} = \\sum_t \\sum_{k=1}^{t} \\underbrace{\\frac{\\partial L_t}{\\partial h_t}}_{\\text{출력 오차}} \\cdot \\underbrace{\\frac{\\partial h_t}{\\partial h_k}}_{\\text{시간 전파}} \\cdot \\underbrace{\\frac{\\partial h_k}{\\partial W}}_{\\text{지역 기울기}}'}</M>
        <p className="leading-7">
          <M>{'\\partial L_t / \\partial h_t'}</M>: 시점 t의 손실이 은닉 상태에 얼마나 민감한가 (출력층에서 오는 오차 신호)<br />
          <M>{'\\partial h_t / \\partial h_k'}</M>: 과거 시점 k의 은닉 상태가 현재 t까지 얼마나 영향을 미치는가 (시간 거리 t−k만큼의 Jacobian 곱)<br />
          <M>{'\\partial h_k / \\partial W'}</M>: 시점 k에서 가중치 W가 <M>{'h_k'}</M> 계산에 어떻게 관여했는가
        </p>
        <p className="leading-7">
          핵심 문제:
        </p>
        <M display>{'\\frac{\\partial h_t}{\\partial h_k} = \\prod_{j=k+1}^{t} \\underbrace{W_{hh}^\\top}_{\\text{순환 가중치}} \\cdot \\underbrace{\\text{diag}(1 - h_j^2)}_{\\text{tanh 미분}}'}</M>
        <p className="leading-7">
          <M>{'W_{hh}'}</M>의 최대 특이값 {'<'} 1이면 지수적 감쇠(vanishing), {'>'} 1이면 폭발(exploding).<br />
          실무 해법: Truncated BPTT (K=20~35 스텝만 역전파) + Gradient clipping (<M>{'\\|\\nabla\\| > \\theta'}</M>이면 축소).<br />
          근본 해결: LSTM/GRU의 게이트가 기울기를 선택적으로 보존 → 수백 스텝 장기 의존성 학습.
        </p>
      </div>
    </section>
  );
}
