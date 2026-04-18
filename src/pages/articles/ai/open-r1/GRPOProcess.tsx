import { CitationBlock } from '@/components/ui/citation';
import GRPOFlowViz from './viz/GRPOFlowViz';
import { ppoVsGrpo, grpoHyperparams } from './grpoData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import M from '@/components/ui/math';

export default function GRPOProcess({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="grpo-process" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GRPO 프로세스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>왜 PPO가 아닌 GRPO인가</strong> — PPO는 Critic 모델이 필요 (7B 기준 +14GB)<br />
          GRPO는 Critic 없이 그룹 내 상대적 보상 순위로 Advantage 계산
        </p>
        <h4>GRPO Advantage 계산</h4>
        <M display>{'\\hat{A}_i = \\frac{\\overbrace{r_i}^{\\text{개별 보상}} - \\underbrace{\\text{mean}(r_1, \\ldots, r_G)}_{\\text{그룹 평균}}}{\\underbrace{\\text{std}(r_1, \\ldots, r_G)}_{\\text{그룹 표준편차}}}'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          같은 프롬프트에 G개 응답을 샘플링 → 그룹 내 상대 순위로 Advantage 계산. Critic 모델 불필요
        </p>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('r1-grpo-main', codeRefs['r1-grpo-main'])} />
          <span className="text-[10px] text-muted-foreground self-center">grpo.py</span>
        </div>
      )}

      <GRPOFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="DeepSeek-R1 Technical Report — GRPO" citeKey={3} type="paper">
          <p className="italic text-sm">
            "GRPO replaces the value function with group-relative advantages,
            reducing memory by removing the critic model entirely."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">PPO vs GRPO</h3>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">특징</th>
                <th className="text-left py-2 px-3">PPO</th>
                <th className="text-left py-2 px-3">GRPO</th>
              </tr>
            </thead>
            <tbody>
              {ppoVsGrpo.map(r => (
                <tr key={r.feature} className="border-b border-border/40">
                  <td className="py-2 px-3 font-medium">{r.feature}</td>
                  <td className="py-2 px-3 text-muted-foreground">{r.ppo}</td>
                  <td className="py-2 px-3">{r.grpo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">하이퍼파라미터</h3>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">파라미터</th>
                <th className="text-left py-2 px-3">값</th>
              </tr>
            </thead>
            <tbody>
              {grpoHyperparams.map(h => (
                <tr key={h.param} className="border-b border-border/40">
                  <td className="py-2 px-3 font-mono text-xs">{h.param}</td>
                  <td className="py-2 px-3 font-mono text-xs">{h.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
