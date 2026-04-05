import DelegateCallViz from './viz/DelegateCallViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function DelegateStaticCall({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="delegate-static" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">파생 호출: DelegateCall · StaticCall · Selfdestruct</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Call()의 변형 — 컨텍스트 유지(Delegate), 읽기 전용(Static), 계정 파괴(Selfdestruct)
          <br />
          모두 Call()과 동일한 Snapshot → Run() → Revert 구조를 공유
        </p>
      </div>
      <div className="not-prose">
        <DelegateCallViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">SELFDESTRUCT의 변화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// SELFDESTRUCT (opcode 0xFF)
// 원래: 컨트랙트 삭제 + ETH를 지정된 주소로 전송

// Original behavior (pre-Cancun)
function selfdestruct(address payable recipient) external {
    // 1) this contract의 모든 ETH를 recipient로 전송
    // 2) this contract의 code 삭제
    // 3) this contract의 storage 삭제
    // 4) CREATE2로 재배포 가능
}

// 보상 (gas refund, pre-London)
// SELFDESTRUCT → 24,000 gas refund
// SSTORE zero set → 15,000 refund

// EIP-3529 (London, 2021): refund 축소
// SELFDESTRUCT refund 제거
// SSTORE refund 절반

// EIP-6780 (Cancun, 2024): SELFDESTRUCT 변경
// 1) 같은 tx에서 create된 contract만 full selfdestruct
// 2) 그 외에는 ETH만 전송 (코드 유지)
// 3) Storage 보존

// 영향
// ✗ 기존 proxy upgrade 패턴 (CREATE2 + SELFDESTRUCT) 깨짐
// ✓ 새 주소 deployment 보호 (기존 컨트랙트 code 불변)
// ✓ "Contract killability" 문제 해결

// 현대 대안
// - Proxy + implementation upgrade (SSTORE of impl slot)
// - Diamond standard (EIP-2535)
// - UUPS/Transparent proxy (OpenZeppelin)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">STATICCALL 제약사항</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// STATICCALL 내부에서 금지된 ops
// 모두 state 변경 opcode

// 1) SSTORE (0x55)
// 2) LOG0-LOG4 (0xA0-0xA4)
// 3) CREATE, CREATE2 (0xF0, 0xF5)
// 4) SELFDESTRUCT (0xFF)
// 5) CALL with value > 0

// 호출 시 실패 조건
// - 위 중 하나라도 실행 시 → REVERT
// - State 변경 시도 자체가 금지

// Use case
// - view/pure function 호출 강제
// - External contract read 안전
// - Re-entrancy 방어 (state 변경 불가)

// Solidity 자동 사용
// function fetchData() external view returns (uint) {
//     return IOtherContract(addr).getValue();
// }
// → 컴파일러가 자동으로 STATICCALL 생성

// 장점
// - Strong guarantees (state immutability)
// - Security audit 단순화
// - Composable (외부 call이 안전)`}</pre>

      </div>
    </section>
  );
}
