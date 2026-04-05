import EVMStackViz from './viz/EVMStackViz';
import GasModelViz from './viz/GasModelViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EVM: 스택 머신 & 가스 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움의 상태 전이 함수(σ' = Υ(σ, T))를 실행하는 스택 기반 가상 머신
          <br />
          모든 노드가 동일한 EVM 실행으로 같은 상태에 도달 — 결정론적 실행이 필수
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>스택 머신 (Stack Machine)</h3>
        <p className="leading-7">
          레지스터 대신 최대 깊이 1024의 스택 사용 — 각 원소는 256비트(32바이트) 워드
        </p>
      </div>
      <div className="not-prose mb-8"><EVMStackViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>가스 모델 (Gas Model)</h3>
        <p className="leading-7">
          모든 오피코드에 가스 비용 할당 — DoS 방지 + 실행 유한성 보장
        </p>
      </div>
      <div className="not-prose mb-8"><GasModelViz onOpenCode={open} /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">EVM 아키텍처 특성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// EVM 설계 원칙
// 1) Deterministic: 같은 입력 → 같은 출력 (모든 노드)
// 2) Sandbox: 외부 상태 접근 제한
// 3) Gas metering: 무한 루프 방지
// 4) Turing-complete: 모든 계산 표현 가능

// EVM 상태 구성
// - World State: 모든 account의 mapping
// - Account State: (nonce, balance, storageRoot, codeHash)
// - Machine State: (stack, memory, pc, gas, ...)
// - Transaction State: tx fields + intermediate state

// 256-bit Word
// - Address: 160 bits (20 bytes)
// - Hash: 256 bits (32 bytes)
// - Big int arithmetic: native support
// - 이유: secp256k1 + Keccak-256 기반

// Stack-based vs Register-based
// Stack: 단순 해석, 간결한 bytecode
// Register: 더 효율적 execution (but 복잡)
// EVM 선택: stack (검증 단순성)

// Memory model
// - Volatile: transaction 끝나면 사라짐
// - Byte-addressable: 1 byte 단위 접근
// - 자동 확장 (word 단위)
// - 확장 비용 quadratic (MEMORY_EXPAND)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">EVM 주요 Opcode 카테고리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">카테고리</th>
                <th className="border border-border px-3 py-2 text-left">Opcodes</th>
                <th className="border border-border px-3 py-2 text-left">예시 Gas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Stop & Arithmetic</td>
                <td className="border border-border px-3 py-2">STOP, ADD, MUL, SUB, DIV, MOD, EXP</td>
                <td className="border border-border px-3 py-2">3-10</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Comparison & Logic</td>
                <td className="border border-border px-3 py-2">LT, GT, EQ, AND, OR, XOR</td>
                <td className="border border-border px-3 py-2">3</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Hashing</td>
                <td className="border border-border px-3 py-2">KECCAK256</td>
                <td className="border border-border px-3 py-2">30 + 6/word</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Environmental</td>
                <td className="border border-border px-3 py-2">ADDRESS, BALANCE, CALLER</td>
                <td className="border border-border px-3 py-2">2-2600</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Block Info</td>
                <td className="border border-border px-3 py-2">BLOCKHASH, NUMBER, TIMESTAMP</td>
                <td className="border border-border px-3 py-2">2-20</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Stack/Memory</td>
                <td className="border border-border px-3 py-2">PUSH, POP, MLOAD, MSTORE</td>
                <td className="border border-border px-3 py-2">3</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Storage</td>
                <td className="border border-border px-3 py-2">SLOAD, SSTORE</td>
                <td className="border border-border px-3 py-2">100-20000</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Flow Control</td>
                <td className="border border-border px-3 py-2">JUMP, JUMPI, PC, JUMPDEST</td>
                <td className="border border-border px-3 py-2">2-10</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">System Ops</td>
                <td className="border border-border px-3 py-2">CREATE, CALL, RETURN, REVERT</td>
                <td className="border border-border px-3 py-2">100-32000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: EVM이 성공한 이유</p>
          <p>
            <strong>단순성</strong>: 140개 opcode, 간단한 execution model<br />
            <strong>결정론성</strong>: 모든 노드가 동일 결과 도달<br />
            <strong>Sandbox</strong>: 외부 의존성 차단 → 검증 용이<br />
            <strong>Gas system</strong>: DoS 방지 + economic security
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            ✗ 256-bit 연산 (over-specified)<br />
            ✗ Stack 깊이 제한 (1024)<br />
            ✗ Storage cost 비쌈<br />
            ✗ No native floating point
          </p>
        </div>

      </div>
    </section>
  );
}
