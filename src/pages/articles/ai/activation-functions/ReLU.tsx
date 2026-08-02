import M from '@/components/ui/math';
import ReLUViz from './viz/ReLUViz';
import ReLUDetailViz from './viz/ReLUDetailViz';
import DyingReLUViz from './viz/DyingReLUViz';

export default function ReLU() {
  return (
    <section id="relu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReLU (Rectified Linear Unit)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        가장 단순한 비선형 함수 — <M>{'f(x) = \\max(0, x)'}</M>. 양수 영역에서 기울기 1 이 고정 (포화 없음) 이라 Vanishing Gradient 해결.<br />
        대신 새 문제 — 음수 입력 영역의 기울기 0 → 한 번 음수 영역에 갇힌 뉴런은 영구 비활성 (Dying ReLU).
      </p>
      <ReLUViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">ReLU 정의 &amp; 역사</h3>
        <p>
          ReLU 는 piecewise linear 함수로 정의 한 줄:
        </p>
        <M display>{'f(x) = \\max(0, x) = \\begin{cases} \\overbrace{x}^{\\text{선형 통과}} & x \\ge 0 \\\\ \\underbrace{0}_{\\text{음수 차단}} & x < 0 \\end{cases}'}</M>
        <p>
          여기서 <M>{'x \\in \\mathbb{R}'}</M> 는 pre-activation,
          <M>{'f(x) \\in [0, +\\infty)'}</M> 는 출력 (음수가 0 으로 잘림 — "rectified" 의 어원).
          상한이 없어 sigmoid/tanh 와 달리 큰 입력에서도 포화하지 않는다.
          도함수는:
        </p>
        <M display>{"f'(x) = \\begin{cases} \\overbrace{1}^{\\text{gradient 그대로 전달}} & x > 0 \\\\ \\underbrace{0}_{\\text{학습 신호 차단 (dying ReLU)}} & x < 0 \\\\ \\text{undefined} & x = 0 \\end{cases}"}</M>
        <p>
          <M>{"f'(x) = 1"}</M> for <M>{'x > 0'}</M> 가 핵심 — 양수 영역에서 chain rule 곱이 <strong>감쇠 없이 그대로 전달</strong>.
          N 층 ReLU 망의 gradient norm 은 활성된 경로의 weight 만의 곱이라 sigmoid (<M>{'0.25^N'}</M>) 같은 지수적 붕괴가 없다.
          <M>{'x = 0'}</M> 에서 미분 불가지만 sub-gradient 0 또는 1 중 어느 쪽을 잡아도 학습이 무리없이 진행되어 실무에서는 무시.
          AlexNet (Krizhevsky et al. 2012) 이 sigmoid 대신 ReLU 를 써서 ImageNet 학습을 6 배 가속한 것이 딥러닝 부흥의 직접 도화선.
        </p>
      </div>
      <ReLUDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Dying ReLU 문제</h3>
        <p>
          음수 영역의 <M>{"f'(x) = 0"}</M> 가 만드는 5 단계 죽음의 사이클:
        </p>
        <M display>{'\\underbrace{w \\text{ 큰 음수 update}}_{\\text{① 폭주 step}} \\;\\to\\; \\underbrace{z = w x + b < 0}_{\\text{② pre-activation 음수}} \\;\\to\\; \\underbrace{f(z) = 0}_{\\text{③ 출력 0}} \\;\\to\\; \\underbrace{\\partial L / \\partial w = 0}_{\\text{④ gradient 0}} \\;\\to\\; \\underbrace{w \\text{ 영구 정지}}_{\\text{⑤ dead}}'}</M>
        <p>
          여기서 <M>{'w'}</M> 는 가중치, <M>{'z = wx + b'}</M> 는 pre-activation, <M>{'f(z) = \\mathrm{ReLU}(z)'}</M> 는 출력.
          한 step 에서 <M>{'\\eta \\nabla L'}</M> 이 너무 커서 <M>{'w'}</M> 가 큰 음수가 되면 거의 모든 입력에서 <M>{'z < 0'}</M> →
          출력 0 → gradient 0 (chain rule 의 <M>{"f'(z) = 0"}</M> 곱) → <M>{'w'}</M> 갱신 0 → 자기 자신을 깨우지 못하고 영원히 dead.
          전체 뉴런의 10–40% 가 dead 가 되는 사례도 보고됨.
        </p>
        <p>
          <strong>방지책</strong> — 모두 <M>{'z'}</M> 가 음수 영역에 갇히지 않도록 만드는 시도:
        </p>
        <ul>
          <li><strong>He init</strong> — <M>{'W \\sim \\mathcal{N}(0, 2/n_{\\text{in}})'}</M>. ReLU 의 절반이 죽는 걸 보정한 분산 (Xavier 의 2 배).</li>
          <li><strong>LeakyReLU</strong> — 음수에 작은 기울기 <M>{'\\alpha'}</M>: <M>{'f(x) = \\max(\\alpha x, x)'}</M>, <M>{'\\alpha = 0.01'}</M> 표준.</li>
          <li><strong>낮은 learning rate</strong> — <M>{'\\eta'}</M> 줄여 한 step 의 큰 음수 update 자체를 회피.</li>
          <li><strong>BatchNorm</strong> — 매 층 입력을 평균 0, 분산 1 로 정규화해 <M>{'z'}</M> 분포가 한 쪽으로 치우치지 않도록.</li>
          <li><strong>Gradient clipping</strong> — <M>{'\\|\\nabla L\\| > c'}</M> 이면 <M>{'\\nabla L \\cdot c / \\|\\nabla L\\|'}</M> 로 잘라 폭주 step 차단.</li>
        </ul>
      </div>
      <DyingReLUViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">


        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: ReLU가 딥러닝을 가능하게 한 이유</p>
          <p>
            <strong>2012 ImageNet의 비밀</strong>:<br />
            - AlexNet이 16.4% → 15.3% error<br />
            - 주된 변경: sigmoid → ReLU<br />
            - 학습 6x 빠름, 깊이 증가 가능<br />
            - Deep learning 혁명의 기폭제
          </p>
          <p className="mt-2">
            <strong>수학적 우아함</strong>:<br />
            - Non-linearity 의 가장 단순한 형태 — <M>{'\\max(0, x)'}</M> 한 줄<br />
            - Piecewise linear → universal approximator (Cybenko, Hornik 정리에 부합)<br />
            - Gradient 가 0/1 의 binary mask <M>{'\\mathbb{1}[x > 0]'}</M> 라 분석·구현 쉬움<br />
            - Extensions 풍부 (Leaky, PReLU, ELU, GELU, SwiGLU 등)
          </p>
          <p className="mt-2">
            <strong>한계 인식</strong>:<br />
            - Dying ReLU 여전히 이슈 (음수 영역 <M>{"f'(x) = 0"}</M>)<br />
            - 음수 정보 손실 (영구 0 으로 잘림)<br />
            - <M>{'x = 0'}</M> 에서 비미분 (sub-gradient 로 우회하지만 이론적 흠)<br />
            → 대안들 (GELU, Swish 등) 이 등장한 이유
          </p>
        </div>

      </div>
    </section>
  );
}
