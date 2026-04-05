import { TABLE_DATA } from './ComparisonData';
import ActivationDecisionViz from './viz/ActivationDecisionViz';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어떤 상황에서 어떤 함수를</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <ul>
          <li><strong>이진 분류 출력층</strong> → Sigmoid (확률 해석)</li>
          <li><strong>히든 레이어 기본</strong> → ReLU (속도 + 단순)</li>
          <li><strong>Transformer</strong> → GELU / SwiGLU (최신 LLM 표준)</li>
          <li><strong>RNN / LSTM</strong> → Tanh (게이트 구조에 적합)</li>
          <li><strong>GAN</strong> → Leaky ReLU (안정적 학습)</li>
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
          아키텍처·task 기준 선택 + 초기화와의 매칭(He↔ReLU, Xavier↔Sigmoid/Tanh)
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
