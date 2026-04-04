import SFTFlowViz from './viz/SFTFlowViz';
import { sftHyperparams } from './sftData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function SFTProcess({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sft-process" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SFT 프로세스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>왜 SFT가 먼저인가</strong> — 기본 모델은 <code>&lt;think&gt;</code> 형식을 모름<br />
          SFT 없이 GRPO 적용 시 초기 보상 ≈ 0 → 학습 불안정 (R1-Zero 문제)
        </p>
      </div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('r1-sft-main', codeRefs['r1-sft-main'])} />
          <span className="text-[10px] text-muted-foreground self-center">sft.py</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mb-3">SFT 학습 흐름</h3>
      </div>

      <SFTFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">학습 하이퍼파라미터</h3>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">파라미터</th>
                <th className="text-left py-2 px-3">값</th>
                <th className="text-left py-2 px-3">설명</th>
              </tr>
            </thead>
            <tbody>
              {sftHyperparams.map(h => (
                <tr key={h.param} className="border-b border-border/40">
                  <td className="py-2 px-3 font-mono text-xs">{h.param}</td>
                  <td className="py-2 px-3 font-mono text-xs">{h.value}</td>
                  <td className="py-2 px-3 text-muted-foreground">{h.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4">
          <strong>메모리 최적화</strong>: DeepSpeed ZeRO-3(옵티마이저 상태/그래디언트/파라미터를 GPU 간 분할하는 기법)로 분산 학습<br />
          <strong>Liger Kernel</strong> — 최적화된 CUDA 커널로 표준 구현 대비 <strong>20-30% 메모리 절약</strong>
        </p>
      </div>
    </section>
  );
}
