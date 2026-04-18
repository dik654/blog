import ReLUVariantsViz from './viz/ReLUVariantsViz';
import ReLUFamilyViz from './viz/ReLUFamilyViz';
import ReLUVariantsDetailViz from './viz/ReLUVariantsDetailViz';

export default function ReLUVariants() {
  return (
    <section id="relu-variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReLU 변형들</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Dying ReLU 해결 — 음수 영역에 작은 기울기 또는 부드러운 곡선 부여.<br />
        Leaky ReLU, GELU(Transformer), SwiGLU(LLaMA) 등.
      </p>
      <ReLUVariantsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">ReLU 가족 전체 지도</h3>
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
