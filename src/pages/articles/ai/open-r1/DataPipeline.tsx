import DataFlowViz from './viz/DataFlowViz';
import { distilabelParams } from './pipelineData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function DataPipeline({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="data-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 생성 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Open R1의 데이터 생성 파이프라인 — 고품질 추론 트레이스(reasoning trace, 단계별 사고 과정)를 <strong>대규모로 생성</strong><br />
          DeepSeek-R1 등 강력한 모델로 수학, 코딩, 추론 문제의 단계별 해결 과정 생성<br />
          <strong>Distilabel</strong> + <strong>vLLM</strong> + <strong>Ray</strong>를 결합한 분산 파이프라인
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">파이프라인 흐름</h3>
      </div>

      <DataFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('r1-generate-pipeline', codeRefs['r1-generate-pipeline'])} />
            <span className="text-[10px] text-muted-foreground self-center">generate.py — Distilabel 파이프라인</span>
          </div>
        )}
        <p>
          <strong>Pipeline().ray()</strong> — Ray 분산 처리로 여러 워커에서 병렬 생성<br />
          <strong>OpenAILLM</strong> — vLLM 서버에 OpenAI-compatible API 호출<br />
          <strong>group_generations=True</strong> — 동일 프롬프트의 N개 응답을 하나의 행으로 그룹화 → GRPO 학습에 직접 사용 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 매개변수</h3>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">매개변수</th>
                <th className="text-left py-2 px-3">기본값</th>
                <th className="text-left py-2 px-3">설명</th>
              </tr>
            </thead>
            <tbody>
              {distilabelParams.map(p => (
                <tr key={p.param} className="border-b border-border/40">
                  <td className="py-2 px-3 font-mono text-xs">{p.param}</td>
                  <td className="py-2 px-3 font-mono text-xs">{p.default ?? '-'}</td>
                  <td className="py-2 px-3 text-muted-foreground">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
