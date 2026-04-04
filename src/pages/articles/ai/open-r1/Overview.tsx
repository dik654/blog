import { CitationBlock } from '@/components/ui/citation';
import E2EPipelineViz from './viz/E2EPipelineViz';
import RoadmapViz from './viz/RoadmapViz';
import { benchmarks } from './overviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Open-R1 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>왜 Open-R1인가</strong> — DeepSeek-R1은 추론 성능이 뛰어나지만 학습 코드 비공개<br />
          Open-R1 = 아이디어부터 배포까지 전체 파이프라인을 오픈소스로 재현
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">End-to-End 파이프라인</h3>
      <E2EPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('r1-sft-main', codeRefs['r1-sft-main'])} />
            <span className="text-[10px] text-muted-foreground self-center">sft.py</span>
            <CodeViewButton onClick={() => onCodeRef('r1-grpo-main', codeRefs['r1-grpo-main'])} />
            <span className="text-[10px] text-muted-foreground self-center">grpo.py</span>
            <CodeViewButton onClick={() => onCodeRef('r1-rewards-accuracy', codeRefs['r1-rewards-accuracy'])} />
            <span className="text-[10px] text-muted-foreground self-center">rewards.py</span>
            <CodeViewButton onClick={() => onCodeRef('r1-generate-pipeline', codeRefs['r1-generate-pipeline'])} />
            <span className="text-[10px] text-muted-foreground self-center">generate.py</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-3">로드맵</h3>
      </div>
      <RoadmapViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Open-R1 GitHub" citeKey={1} type="code"
          href="https://github.com/huggingface/open-r1">
          <p className="italic text-sm">
            "A fully open reproduction of DeepSeek-R1. Step 1 delivers Mixture-of-Thoughts
            and OpenR1-Distill-7B matching DeepSeek-R1-Distill-Qwen-7B."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">벤치마크 결과</h3>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">벤치마크</th>
                <th className="text-right py-2 px-3">OpenR1-7B</th>
                <th className="text-right py-2 px-3">DeepSeek-R1-7B</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map(b => (
                <tr key={b.name} className="border-b border-border/40">
                  <td className="py-2 px-3 font-medium">{b.name}</td>
                  <td className="py-2 px-3 text-right font-mono">{b.openr1}</td>
                  <td className="py-2 px-3 text-right font-mono text-muted-foreground">{b.deepseek}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
