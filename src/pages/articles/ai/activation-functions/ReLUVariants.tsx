import M from '@/components/ui/math';
import ReLUVariantsViz from './viz/ReLUVariantsViz';
import ReLUFamilyViz from './viz/ReLUFamilyViz';
import ReLUVariantsDetailViz from './viz/ReLUVariantsDetailViz';

export default function ReLUVariants() {
  return (
    <section id="relu-variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReLU 변형들</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Dying ReLU 해결 — 음수 영역에 작은 기울기 또는 부드러운 곡선을 부여하는 게 공통 아이디어.<br />
        Leaky ReLU · PReLU · ELU · GELU (Transformer) · SwiGLU (LLaMA) 등으로 확장.
      </p>
      <ReLUVariantsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">ReLU 가족 전체 지도</h3>
        <p>
          모든 변형은 <M>{'\\max(0, x)'}</M> 의 음수 영역 하나만 다르게 정의한다 — 큰 그림은 동일.
        </p>
        <M display>{'\\mathrm{LeakyReLU}(x) = \\max(\\underbrace{\\alpha x}_{\\text{음수 영역 작은 기울기}},\\; \\underbrace{x}_{\\text{양수 영역 그대로}}), \\quad \\alpha = 0.01'}</M>
        <p>
          <M>{'\\alpha'}</M> 는 음수 영역 기울기 (고정). <M>{'x < 0'}</M> 에서 작은 음수 출력 → gradient 가 <M>{'\\alpha'}</M> 로 살아 있어 dying ReLU 차단.
        </p>
        <M display>{'\\mathrm{PReLU}(x) = \\max(\\underbrace{\\alpha}_{\\text{학습 파라미터}} x,\\; x)'}</M>
        <p>
          LeakyReLU 의 <M>{'\\alpha'}</M> 를 <strong>학습 가능</strong> 하게 만든 버전 (He et al. 2015). 채널마다 별도 <M>{'\\alpha_c'}</M> 둘 수도 있다.
        </p>
        <M display>{'\\mathrm{ELU}(x) = \\begin{cases} \\overbrace{x}^{\\text{ReLU 와 동일}} & x \\ge 0 \\\\ \\underbrace{\\alpha (e^x - 1)}_{\\text{부드럽게 } -\\alpha \\text{ 로 수렴}} & x < 0 \\end{cases}'}</M>
        <p>
          <M>{'\\alpha > 0'}</M> 는 saturation 점 (보통 1).
          음수 영역이 부드럽게 <M>{'-\\alpha'}</M> 로 수렴 → output mean 이 0 에 가까워져 (zero-mean) batchnorm 과 비슷한 효과.
          <M>{'x = 0'}</M> 에서 1차 미분 연속.
        </p>
        <M display>{'\\mathrm{GELU}(x) = \\underbrace{x}_{\\text{입력}} \\cdot \\underbrace{\\Phi(x)}_{\\text{가중치, } \\in [0,1]}, \\quad \\Phi(x) = P[Z \\le x],\\; Z \\sim \\mathcal{N}(0, 1)'}</M>
        <p>
          <M>{'\\Phi(x)'}</M> 는 표준정규 누적분포함수.
          확률적으로 "이 입력을 얼마나 살릴지" 를 결정 — <M>{'x \\to +\\infty'}</M> 면 <M>{'\\Phi \\to 1'}</M> (그대로 통과), <M>{'x \\to -\\infty'}</M> 면 <M>{'\\Phi \\to 0'}</M> (소거).
          BERT · GPT 의 표준 활성화. 실무에선 빠른 근사 <M>{'0.5x(1 + \\tanh[\\sqrt{2/\\pi}(x + 0.044715 x^3)])'}</M> 사용.
        </p>
        <M display>{'\\mathrm{Swish}(x) = \\underbrace{x}_{\\text{입력}} \\cdot \\underbrace{\\sigma(\\beta x)}_{\\text{soft gate, } \\beta = 1 \\text{ 표준}}'}</M>
        <p>
          <M>{'\\beta'}</M> 는 보통 1 (Swish-1, SiLU 와 동치). GELU 와 거의 같은 모양 — non-monotonic (작은 음수에서 살짝 음수 출력 후 0 수렴).
        </p>
        <M display>{'\\mathrm{SwiGLU}(x) = \\underbrace{\\mathrm{Swish}(x W_1)}_{\\text{밸브 (gate)}} \\odot \\underbrace{(x W_2)}_{\\text{값 (value)}}'}</M>
        <p>
          <M>{'W_1, W_2'}</M> 는 두 개의 별도 학습 가중치, <M>{'\\odot'}</M> 는 element-wise 곱.
          gating mechanism 도입 — Swish 출력이 "밸브", <M>{'x W_2'}</M> 가 "값" 역할. LLaMA · PaLM 등 modern LLM 의 FFN 표준.
        </p>
      </div>
      <ReLUFamilyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">변형별 상세 비교</h3>
      </div>
      <ReLUVariantsDetailViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">선택 가이드 (2024)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">아키텍처</th>
                <th className="border border-border px-3 py-2 text-left">권장 Activation</th>
                <th className="border border-border px-3 py-2 text-left">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">CNN (일반)</td>
                <td className="border border-border px-3 py-2">ReLU</td>
                <td className="border border-border px-3 py-2">빠름, 검증됨</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">CNN (mobile)</td>
                <td className="border border-border px-3 py-2">Hard Swish</td>
                <td className="border border-border px-3 py-2">ReLU보다 성능↑, 여전히 빠름</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Transformer (NLP)</td>
                <td className="border border-border px-3 py-2">GELU</td>
                <td className="border border-border px-3 py-2">BERT, GPT 표준</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">LLM (decoder)</td>
                <td className="border border-border px-3 py-2">SwiGLU</td>
                <td className="border border-border px-3 py-2">LLaMA 이후 표준</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">RNN/LSTM</td>
                <td className="border border-border px-3 py-2">Tanh (gate), Sigmoid</td>
                <td className="border border-border px-3 py-2">Gating 메커니즘</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Regression</td>
                <td className="border border-border px-3 py-2">ReLU / ELU</td>
                <td className="border border-border px-3 py-2">Output 앞에는 identity</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Activation 진화의 패턴</p>
          <p>
            <strong>Empirical 발견</strong>:<br />
            - ReLU: 단순성 + 속도<br />
            - GELU: 부드러움 + probabilistic<br />
            - SwiGLU: gating + modern LLM
          </p>
          <p className="mt-2">
            <strong>공통 속성</strong>:<br />
            ✓ Non-linearity (universal approximation)<br />
            ✓ Unbounded above (no saturation for large x)<br />
            ✓ Differentiable (또는 거의)<br />
            ✓ Gradient가 0에 가깝지 않음 (non-zero mostly)
          </p>
          <p className="mt-2">
            <strong>2024 트렌드</strong>:<br />
            - Gating mechanism 중요 (SwiGLU, GLU)<br />
            - Non-monotonic 허용 (Swish)<br />
            - Simple is often better (ReLU 여전히 경쟁력)<br />
            - Architecture-specific optimization
          </p>
        </div>

      </div>
    </section>
  );
}
