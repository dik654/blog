import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';
import {
  subAgentCode, subAgentAnnotations,
  sandboxCode, sandboxAnnotations,
} from './SubAgentSandboxData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function SubAgentSandbox({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">서브에이전트 & 샌드박스</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-sandbox', codeRefs['oc-sandbox'])} />
          <span className="text-[10px] text-muted-foreground self-center">sandbox-manager.ts</span>
        </div>
      )}
      <CodePanel title="서브에이전트 시스템" code={subAgentCode} annotations={subAgentAnnotations} />
      <CodePanel title="샌드박스 아키텍처" code={sandboxCode} annotations={sandboxAnnotations} />

      <CitationBlock source="Docker Blog — Run OpenClaw Securely in Docker Sandboxes" citeKey={5} type="paper"
        href="https://docker.com/blog/run-openclaw-securely-in-docker-sandboxes">
        <p className="italic">
          "Fail-closed design: sandbox 설정인데 Docker 런타임이 없으면 호스트에서 실행하는 대신 에러를 발생시킨다.<br />
          컨테이너는 network:none 기본값으로 생성되며, non-root 사용자로 실행된다."
        </p>
        <p className="mt-2 text-xs">
          OpenClaw 샌드박스 — fail-closed 원칙. Docker 런타임 부재 시 호스트 폴백 없이
          명시적 에러 발생. 컨테이너는 24시간 유휴 또는 7일 경과 시 자동 제거,
          tools.elevated로 특정 도구만 호스트 실행을 허용하는 escape hatch 제공
        </p>
      </CitationBlock>
    </>
  );
}
