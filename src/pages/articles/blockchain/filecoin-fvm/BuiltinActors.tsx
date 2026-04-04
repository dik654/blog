import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function BuiltinActors({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="builtin-actors" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Built-in Actors</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fvm-machine', codeRefs['fvm-machine'])} />
          <span className="text-[10px] text-muted-foreground self-center">BuiltinActor enum</span>
        </div>
        <p>
          StorageMiner: 섹터 관리, PoSt 제출, 보상 청구. SP의 핵심 인터페이스.<br />
          StorageMarket: 스토리지 딜 생성, 검증, 정산. 클라이언트-SP 간 계약 관리
        </p>
        <p>
          StoragePower: SP 파워(저장 용량)를 추적. 블록 보상 분배 기준.<br />
          EAM: EVM Actor Manager — Solidity 컨트랙트를 FEVM으로 배포/실행
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Actor 업그레이드</strong> — 네트워크 업그레이드 시 Built-in Actor를 교체 가능.<br />
          WASM 코드 CID만 변경하면 되므로 하드포크 없이도 로직 업데이트가 가능
        </p>
      </div>
    </section>
  );
}
