import RewardPipelineViz from './viz/RewardPipelineViz';
import { rewardRegistry, domainRewards } from './rewardData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function RewardSystem({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="reward-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보상 함수 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>왜 다중 보상인가</strong> — 정확도만 보상하면 "답만 맞추고 추론 생략" 지름길 학습 발생<br />
          format + tag_count 보상으로 <code>&lt;think&gt;</code> 추론 과정을 강제
        </p>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('r1-rewards-accuracy', codeRefs['r1-rewards-accuracy'])} />
          <span className="text-[10px] text-muted-foreground self-center">rewards.py — accuracy</span>
          <CodeViewButton onClick={() => onCodeRef('r1-rewards-format', codeRefs['r1-rewards-format'])} />
          <span className="text-[10px] text-muted-foreground self-center">rewards.py — format</span>
        </div>
      )}

      <RewardPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-2 mb-3">보상 함수 레지스트리</h3>
        <div className="overflow-x-auto not-prose mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">함수</th>
                <th className="text-left py-2 px-3">설명</th>
                <th className="text-right py-2 px-3">가중치</th>
              </tr>
            </thead>
            <tbody>
              {rewardRegistry.map(r => (
                <tr key={r.name} className="border-b border-border/40">
                  <td className="py-2 px-3 font-mono text-xs" style={{ color: r.color }}>{r.name}</td>
                  <td className="py-2 px-3 text-muted-foreground">{r.desc}</td>
                  <td className="py-2 px-3 text-right font-mono">{r.weight > 0 ? r.weight : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-2 mb-3">도메인별 보상 조합</h3>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">도메인</th>
                <th className="text-left py-2 px-3">보상 함수 조합</th>
              </tr>
            </thead>
            <tbody>
              {domainRewards.map(d => (
                <tr key={d.domain} className="border-b border-border/40">
                  <td className="py-2 px-3 font-medium">{d.domain}</td>
                  <td className="py-2 px-3 font-mono text-xs">{d.funcs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
