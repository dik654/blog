import RNNUnrollViz from './viz/RNNUnrollViz';
import RNNArchDetailViz from './viz/RNNArchDetailViz';
import M from '@/components/ui/math';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RNN 구조</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        은닉 상태(<M>{'h_t'}</M>)가 시간축으로 순환 — 이전 출력이 현재 입력과 합쳐진다.<br />
        모든 시간 단계에서 동일한 가중치를 공유하여 가변 길이 시퀀스 처리 가능.
      </p>
      <RNNUnrollViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">RNN 구조 상세</h3>
        <RNNArchDetailViz />
        <p className="leading-7">
          순전파 수식:
        </p>
        <M display>{'h_t = \\tanh(\\underbrace{W_{hh} \\cdot h_{t-1}}_{\\text{기억 전달}} + \\underbrace{W_{xh} \\cdot x_t}_{\\text{새 입력 인코딩}} + \\underbrace{b_h}_{\\text{편향}})'}</M>
        <M display>{'\\underbrace{y_t}_{\\text{출력}} = \\underbrace{W_{hy}}_{\\text{hidden→출력}} \\cdot h_t + b_y'}</M>
        <p className="leading-7">
          <M>{'W_{hh}'}</M>(H×H)는 시간축 순환 가중치, <M>{'W_{xh}'}</M>(H×D)는 입력→은닉 매핑. 모든 타임스텝에서 동일 가중치 공유.<br />
          H=256, D=100이면 <M>{'W_{hh}'}</M>=65,536 + <M>{'W_{xh}'}</M>=25,600 + <M>{'b_h'}</M>=256 ≈ 91K 파라미터. 시간 복잡도 <M>{'O(T \\cdot H^2)'}</M>.<br />
          실효 문맥 약 10~20스텝 — tanh 기울기 최대 1이므로 <M>{'W_{hh}'}</M>를 반복 곱하면 지수적 감쇠(vanishing gradient).<br />
          Deep RNN: 층을 쌓아 표현력 증가. Bidirectional: 양방향 <M>{'h_t'}</M>를 결합해 전후 문맥 모두 활용.
        </p>
      </div>
    </section>
  );
}
