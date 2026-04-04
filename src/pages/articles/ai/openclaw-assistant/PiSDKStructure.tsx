import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';
import { piSDKCode, piSDKAnnotations } from './PiSDKStructureData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function PiSDKStructure({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Pi SDK 패키지 구조</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-embedded-runner', codeRefs['oc-embedded-runner'])} />
          <span className="text-[10px] text-muted-foreground self-center">pi-embedded-runner.ts</span>
        </div>
      )}
      <CodePanel title="Pi SDK 패키지 의존성" code={piSDKCode} annotations={piSDKAnnotations} />

      <CitationBlock source="OpenClaw — pi-tool-definition-adapter.ts" citeKey={2} type="code"
        href="https://github.com/openclaw/openclaw">
        <CodePanel title="도구 어댑터 브릿지" code={`// pi-tool-definition-adapter.ts
// pi-agent-core의 AgentTool ≠ pi-coding-agent의 ToolDefinition
// → toToolDefinitions()로 브릿지

export function toToolDefinitions(
  agentTools: AgentTool[]
): ToolDefinition[] {
  return agentTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.parameters,
    execute: async (input) => tool.run(input),
  }));
}

// OpenClaw 정책 필터링, 샌드박스 통합 유지`} annotations={[
          { lines: [5, 13], color: 'sky', note: 'AgentTool → ToolDefinition 변환' },
        ]} />
        <p className="mt-2 text-xs">
          Pi SDK의 두 레이어(pi-agent-core / pi-coding-agent)는 서로 다른 도구 인터페이스 사용 —
          toToolDefinitions() 어댑터가 이 차이를 브릿지하면서 OpenClaw 채널별 정책 필터링과
          샌드박스 경로 정책 유지
        </p>
      </CitationBlock>
    </>
  );
}
