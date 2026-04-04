import ScrollCircuitViz from '../components/ScrollCircuitViz';
import SubCircuitViz from './viz/SubCircuitViz';
import CodePanel from '@/components/ui/code-panel';
import { CRATE_CODE, EVM_CONFIG_CODE } from './OverviewData';
import { crateAnnotations, evmConfigAnnotations } from './OverviewAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 서브회로 구조'}</h2>
      <div className="not-prose mb-8"><ScrollCircuitViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">서브회로 아키텍처</h3>
      <div className="not-prose mb-8"><SubCircuitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Scroll zkEVM</strong> — EVM 실행을 Halo2 회로로 증명<br />
          각 EVM 오퍼코드를 <code>ExecutionGadget</code>으로 구현,
          공유 테이블(RwTable, BytecodeTable 등)로 서브회로 간 일관성 유지
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('evm-config', codeRefs['evm-config'])} />
            <span className="text-[10px] text-muted-foreground self-center">evm_circuit.rs</span>
            <CodeViewButton onClick={() => onCodeRef('execution-trait', codeRefs['execution-trait'])} />
            <span className="text-[10px] text-muted-foreground self-center">execution.rs</span>
          </div>
        )}
        <CodePanel title="크레이트 구조 (zkevm-circuits/src/)" code={CRATE_CODE} annotations={crateAnnotations} />
        <CodePanel title="EvmCircuitConfig — 회로 설정 (evm_circuit.rs)" code={EVM_CONFIG_CODE} annotations={evmConfigAnnotations} />
      </div>
    </section>
  );
}
