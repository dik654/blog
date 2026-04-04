import CodePanel from '@/components/ui/code-panel';
import { embeddedAgentCode, embeddedAgentAnnotations } from './EmbeddedAgentData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function EmbeddedAgent({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">임베디드 에이전트 실행</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-embedded-runner', codeRefs['oc-embedded-runner'])} />
          <span className="text-[10px] text-muted-foreground self-center">pi-embedded-runner.ts</span>
        </div>
      )}
      <CodePanel title="Pi 임베디드 에이전트 방식" code={embeddedAgentCode} annotations={embeddedAgentAnnotations} />
    </>
  );
}
