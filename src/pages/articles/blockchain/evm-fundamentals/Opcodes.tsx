import OpcodeViz from './viz/OpcodeViz';
import EVMComponentsViz from './viz/EVMComponentsViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Opcodes({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="opcodes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EVM 구성요소 & 오피코드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM은 PC, Stack, Memory(휘발성)와 Storage(영구) 네 영역에서 동작
          <br />
          오피코드 1바이트(0x00~0xFF) — 가스 비용은 자원 사용량에 비례
          <br />
          <span className="text-xs text-muted-foreground">각 구성요소를 클릭하면 geth 소스 코드를 볼 수 있습니다</span>
        </p>
      </div>
      <div className="not-prose mb-8">
        <EVMComponentsViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="not-prose mb-8">
        <OpcodeViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          산술(ADD) — pop+peek 패턴으로 메모리 할당 0회, in-place 연산
          <br />
          스토리지(SLOAD/SSTORE) — StateDB 접근, cold 2100 / warm 100 gas (EIP-2929)
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('op-add', codeRefs['op-add'])} />
          <span className="text-[10px] text-muted-foreground self-center">opAdd() 산술</span>
          <CodeViewButton onClick={() => onCodeRef('op-sload', codeRefs['op-sload'])} />
          <span className="text-[10px] text-muted-foreground self-center">opSload/Sstore 저장소</span>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">EIP-2929 — Gas Cost 재편</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// EIP-2929 (Berlin hard fork, 2021)
// 목적: storage access DoS 방어

// 이전 가격
// SLOAD: 800 gas
// BALANCE: 700 gas
// EXTCODESIZE: 700 gas
// CALL: 700 gas

// 공격: low-gas로 많은 account 접근
// 2016 DoS: 1 tx에 수천 SLOAD → 체인 정지

// EIP-2929 해결
// Cold access (처음 접근): 2100 gas (SLOAD)
// Warm access (이미 접근): 100 gas (SLOAD)

// Access List tracking
// accessList = {
//   accounts: Set<Address>,
//   storageKeys: Set<(Address, StorageKey)>
// }

// Warm 조건
// - Account가 tx 내에서 이미 touched
// - Storage slot이 이미 accessed
// - EIP-2930 access list에 미리 선언

// 추가 opcodes
// - EXTCODESIZE, EXTCODECOPY, EXTCODEHASH: cold 2600, warm 100
// - BALANCE: cold 2600, warm 100
// - CALL family: base cost + cold/warm
// - SELFDESTRUCT: cold 5000 추가

// 영향
// - Gas 비용 예측 가능
// - DoS 공격 비용 대폭 증가
// - Access list tx (EIP-2930)로 pre-warm 가능`}</pre>

      </div>
    </section>
  );
}
