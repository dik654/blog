import M from '@/components/ui/math';
import { TABLE_DATA } from './ComparisonData';
import ActivationDecisionViz from './viz/ActivationDecisionViz';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어떤 상황에서 어떤 함수를</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <ul>
          <li><strong>이진 분류 출력층</strong> → Sigmoid <M>{'\\sigma(z) \\in (0, 1)'}</M> (확률 해석)</li>
          <li><strong>히든 레이어 기본</strong> → ReLU <M>{'\\max(0, x)'}</M> (속도 + 단순)</li>
          <li><strong>Transformer</strong> → GELU <M>{'x \\Phi(x)'}</M> 또는 SwiGLU <M>{'\\mathrm{Swish}(xW_1) \\odot xW_2'}</M> (최신 LLM 표준)</li>
          <li><strong>RNN / LSTM</strong> → Tanh <M>{'\\tanh(x) \\in (-1, 1)'}</M> (게이트 candidate 에 적합)</li>
          <li><strong>GAN</strong> → Leaky ReLU <M>{'\\max(\\alpha x, x)'}</M> (안정적 학습, dying ReLU 회피)</li>
        </ul>
      </div>
      <div className="not-prose overflow-x-auto rounded-xl border mb-6">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-muted/30">
              {['함수', '범위', '기울기', '장점', '단점', '사용처'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA.map((r, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2 font-mono">{r.range}</td>
                <td className="px-3 py-2">{r.gradient}</td>
                <td className="px-3 py-2">{r.pro}</td>
                <td className="px-3 py-2">{r.con}</td>
                <td className="px-3 py-2">{r.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">실무 선택 + 초기화 매칭</h3>
        <p>
          아키텍처·task 기준 선택 + 초기화와의 매칭. 초기화 분산은 활성화 함수의 기울기 특성에 맞춰 정해진다 — 잘못 짝지으면 forward/backward 신호가 지수적으로 폭발하거나 소멸한다.
        </p>
        <M display>{'\\text{He init (ReLU)}: \\quad W \\sim \\mathcal{N}\\!\\left(\\underbrace{0}_{\\text{평균}},\\; \\underbrace{\\tfrac{2}{n_{\\text{in}}}}_{\\text{ReLU 가 절반 죽이는 걸 보정}}\\right)'}</M>
        <p>
          <M>{'n_{\\text{in}}'}</M> 은 입력 차원. 분산 <M>{'2/n_{\\text{in}}'}</M> 의 기원: ReLU 가 입력의 절반을 0 으로 잘라 분산이 절반이 되므로 미리 2 배 부풀려 보정 — forward 분산이 층마다 일정하게 유지된다 (He et al. 2015).
        </p>
        <M display>{'\\text{Xavier init (Sigmoid/Tanh)}: \\quad W \\sim \\mathcal{N}\\!\\left(0,\\; \\underbrace{\\tfrac{1}{n_{\\text{in}}}}_{\\text{forward 분산 보존}}\\right) \\;\\text{또는}\\; \\mathcal{N}\\!\\left(0,\\; \\underbrace{\\tfrac{2}{n_{\\text{in}} + n_{\\text{out}}}}_{\\text{forward+backward 평균}}\\right)'}</M>
        <p>
          <M>{'n_{\\text{out}}'}</M> 은 출력 차원. tanh/sigmoid 는 0 근처에서 기울기 1 또는 0.25 로 거의 선형 → 입력 분산만 보존하면 신호가 안정적으로 흐른다 (Glorot &amp; Bengio 2010). ReLU 에 Xavier 를 쓰면 신호가 절반씩 죽으면서 깊은 망에서 vanishing 발생.
        </p>
      </div>
      <ActivationDecisionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 아키텍처별 <strong>표준 활성화</strong>가 확립 — 실험적 검증됨.<br />
          요약 2: <strong>초기화와 활성화는 짝</strong> — He init + ReLU, Xavier + Sigmoid.<br />
          요약 3: 문제 발생 시 <strong>activation 변경</strong>이 첫 번째 디버깅 수단.
        </p>
      </div>
    </section>
  );
}
