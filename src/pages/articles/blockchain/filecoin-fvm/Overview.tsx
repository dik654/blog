import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FVM 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fvm-machine', codeRefs['fvm-machine'])} />
          <span className="text-[10px] text-muted-foreground self-center">fvm.rs — FVM Machine</span>
        </div>
        <p>
          FVM은 WASM 기반 가상 머신. wasmtime 런타임 위에서 Actor를 실행.<br />
          EVM 호환(FEVM)으로 Solidity 컨트랙트를 배포하고 스토리지 딜을 프로그래밍 가능
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 EVM 위에 Solidity로 스토리지 딜 프로그래밍</strong> — FEVM 덕분에<br />
          이더리움 개발자가 Filecoin 위에서 DeFi + 스토리지를 결합한 dApp을 만들 수 있음
        </p>
      </div>
    </section>
  );
}
