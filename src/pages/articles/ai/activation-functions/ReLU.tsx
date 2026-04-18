import ReLUViz from './viz/ReLUViz';
import ReLUDetailViz from './viz/ReLUDetailViz';
import DyingReLUViz from './viz/DyingReLUViz';

export default function ReLU() {
  return (
    <section id="relu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReLU (Rectified Linear Unit)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        f(x) = max(0, x) — 양수 기울기 1 고정으로 Vanishing Gradient 해결.<br />
        문제: 음수 입력 → 기울기 0 → 영구 비활성(Dying ReLU).
      </p>
      <ReLUViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">ReLU 정의 & 역사</h3>
      </div>
      <ReLUDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Dying ReLU 문제</h3>
        <p>
          5단계 죽음의 사이클: weight 음수 → 입력 항상 음수 → 출력 0 → gradient 0 → 영구 dead<br />
          방지책: He init, LeakyReLU, 낮은 lr, BatchNorm, gradient clipping
        </p>
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
            - Non-linearity 가장 단순한 형태<br />
            - Piecewise linear → universal approximator<br />
            - Gradient 분석 쉬움<br />
            - Extensions 풍부 (Leaky, PReLU, ELU 등)
          </p>
          <p className="mt-2">
            <strong>한계 인식</strong>:<br />
            - Dying ReLU 여전히 이슈<br />
            - 음수 정보 손실<br />
            - x=0에서 비미분<br />
            → 대안들(GELU, Swish)이 등장한 이유
          </p>
        </div>

      </div>
    </section>
  );
}
