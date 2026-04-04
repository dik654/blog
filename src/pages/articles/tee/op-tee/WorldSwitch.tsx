import WorldSwitchViz from '../../blockchain/components/WorldSwitchViz';
import WorldSwitchFlowViz from './viz/WorldSwitchFlowViz';
import SmFromNsecViz from './viz/SmFromNsecViz';
import SmcIdLayoutViz from './viz/SmcIdLayoutViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function WorldSwitch({
  title,
  onCodeRef,
}: {
  title?: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="world-switch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'SMC & 세계 전환 (sm.c)'}</h2>
      <div className="not-prose mb-8">
        <WorldSwitchViz />
      </div>
      <div className="not-prose mb-4 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('smc-fast-handler', codeRefs['smc-fast-handler'])} />
        <span className="text-[10px] text-muted-foreground self-center">Fast SMC 핸들러</span>
        <CodeViewButton onClick={() => onCodeRef('smc-std-handler', codeRefs['smc-std-handler'])} />
        <span className="text-[10px] text-muted-foreground self-center">Standard SMC 핸들러</span>
        <CodeViewButton onClick={() => onCodeRef('smc-vector-table', codeRefs['smc-vector-table'])} />
        <span className="text-[10px] text-muted-foreground self-center">벡터 테이블 (A64)</span>
        <CodeViewButton onClick={() => onCodeRef('smc-std-entry-asm', codeRefs['smc-std-entry-asm'])} />
        <span className="text-[10px] text-muted-foreground self-center">SMC 진입 어셈블리</span>
      </div>
      <div className="not-prose mb-8">
        <h3 className="text-lg font-semibold mb-3">세계 전환 시퀀스</h3>
        <WorldSwitchFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Normal World에서 <code>smc</code> 명령어가 실행되면
          Secure Monitor(EL3)가 레지스터 컨텍스트를 저장·복원하며 세계 전환을 수행합니다.<br />
          <strong>Fast Call</strong>(원자적, 인터럽트 금지)과{' '}
          <strong>Standard Call</strong>(선점 가능, TA 실행)을 구분합니다.
        </p>
        <h3>sm_from_nsec() — 세계 전환 핵심 (core/arch/arm/sm/sm.c)</h3>
      </div>
      <div className="not-prose mb-6"><SmFromNsecViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>SMC 함수 ID 구조 (OPTEE_SMC)</h3>
      </div>
      <div className="not-prose mb-6"><SmcIdLayoutViz /></div>
    </section>
  );
}
