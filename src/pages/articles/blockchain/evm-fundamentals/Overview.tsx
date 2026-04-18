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

        <h4 className="text-lg font-semibold mt-4 mb-2">설계 원칙</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Deterministic</p>
            <p className="text-sm text-muted-foreground">같은 입력 &rarr; 같은 출력 (모든 노드)</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Sandbox</p>
            <p className="text-sm text-muted-foreground">외부 상태 접근 제한</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Gas Metering</p>
            <p className="text-sm text-muted-foreground">무한 루프 방지</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Turing-complete</p>
            <p className="text-sm text-muted-foreground">모든 계산 표현 가능</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">EVM 상태 구성</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">World State</p>
            <p className="text-sm text-muted-foreground">모든 account의 mapping</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Account State</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">nonce</code>, <code className="text-xs bg-background/50 px-1 py-0.5 rounded">balance</code>, <code className="text-xs bg-background/50 px-1 py-0.5 rounded">storageRoot</code>, <code className="text-xs bg-background/50 px-1 py-0.5 rounded">codeHash</code></p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Machine State</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">stack</code>, <code className="text-xs bg-background/50 px-1 py-0.5 rounded">memory</code>, <code className="text-xs bg-background/50 px-1 py-0.5 rounded">pc</code>, <code className="text-xs bg-background/50 px-1 py-0.5 rounded">gas</code>, ...</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Transaction State</p>
            <p className="text-sm text-muted-foreground">tx fields + intermediate state</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">256-bit Word</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Address</p>
            <p className="text-sm text-muted-foreground">160 bits (20 bytes)</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Hash</p>
            <p className="text-sm text-muted-foreground">256 bits (32 bytes)</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Big int</p>
            <p className="text-sm text-muted-foreground">네이티브 256-bit 산술 지원</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">근거</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">secp256k1</code> + <code className="text-xs bg-background/50 px-1 py-0.5 rounded">Keccak-256</code> 기반</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">Stack vs Register</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Stack-based (EVM 선택)</p>
            <p className="text-sm text-muted-foreground">단순 해석, 간결한 bytecode &mdash; 검증 단순성 우선</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Register-based</p>
            <p className="text-sm text-muted-foreground">더 효율적 execution, but 구조 복잡</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">Memory Model</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Volatile</p>
            <p className="text-sm text-muted-foreground">transaction 끝나면 사라짐</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Byte-addressable</p>
            <p className="text-sm text-muted-foreground">1 byte 단위 접근</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">자동 확장</p>
            <p className="text-sm text-muted-foreground">word 단위로 확장</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">확장 비용</p>
            <p className="text-sm text-muted-foreground">quadratic (<code className="text-xs bg-background/50 px-1 py-0.5 rounded">MEMORY_EXPAND</code>)</p>
          </div>
        </div>

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
