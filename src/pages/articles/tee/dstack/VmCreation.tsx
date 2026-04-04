import VmFlowViz from './viz/VmFlowViz';
import TDXProvisionFlowViz from './viz/TDXProvisionFlowViz';
import VmCreationStepViz from './viz/VmCreationStepViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function VmCreation({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="vm-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'VM 생성 & 프로비저닝'}</h2>
      <div className="not-prose mb-8"><VmFlowViz /></div>
      <div className="not-prose mb-8">
        <h3 className="text-lg font-semibold mb-3">TDX VM 프로비저닝 시퀀스</h3>
        <TDXProvisionFlowViz />
      </div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('td-create', codeRefs['td-create'])} />
          <span className="text-[10px] text-muted-foreground self-center">TdVm::new()</span>
          <CodeViewButton onClick={() => onCodeRef('manifest-flow', codeRefs['manifest-flow'])} />
          <span className="text-[10px] text-muted-foreground self-center">create_vm() 흐름</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          기밀 VM 생성은 사용자의 Docker Compose 파일 하나로 시작됩니다.<br />
          VMM이 이를 받아 TDX 활성화, 포트 매핑, 키 발급까지 자동화합니다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <VmCreationStepViz />
      </div>
    </section>
  );
}
