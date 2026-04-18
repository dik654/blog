import CircuitMapViz from './viz/CircuitMapViz';
import M from '@/components/ui/math';

export default function CircuitOverview() {
  return (
    <section id="circuit-overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">서브회로 전체 구조</h2>
      <div className="not-prose mb-8"><CircuitMapViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Scroll zkEVM은 <strong>SuperCircuit</strong>으로 11개 서브회로를 통합합니다.<br />
          EVM Circuit이 오퍼코드를 실행하고, Bytecode/Copy/Keccak/MPT 등이
          각각 코드 무결성, 메모리 복사, 해시, 상태 트리를 병렬 검증합니다.
        </p>
        <p>
          zkTrie는 이더리움의 Hexary MPT 대신 <strong>Sparse Binary Merkle Patricia Trie</strong>를
          사용하며, Poseidon 해시로 SNARK-friendly한 상태 증명을 제공합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 서브회로로 분할하는가</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">단일 거대 회로의 문제</p>
            <ul className="text-sm space-y-2 text-foreground/80">
              <li><strong>회로 크기 폭발</strong> — 140+ opcode, 단일 회로 시 rows 1B+ 필요, Prover memory 수백 GB</li>
              <li><strong>변경 어려움</strong> — 하나 수정 시 전체 재검증, 디버깅 극히 어려움</li>
              <li><strong>검증 비용</strong> — Proof 크기 선형 증가, Verifier gas 폭주</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">서브회로 분할 장점</p>
            <ul className="text-sm space-y-2 text-foreground/80">
              <li><strong>관심사 분리</strong> — EVM(opcode), Bytecode(코드 검증), Keccak(해시), MPT(상태 트리)</li>
              <li><strong>병렬 증명</strong> — 독립 서브회로 동시 prove, Multi-core/GPU 활용</li>
              <li><strong>Lookup 연결</strong> — 서브회로 간 일관성은 lookup table로 보장</li>
            </ul>
          </div>
        </div>
        <div className="not-prose rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3 mb-6 text-sm text-center">
          <strong>SuperCircuit</strong> = 11개 서브회로의 공통 constraint 묶음 = 단일 proof로 전체 EVM 실행 증명
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">서브회로 역할 상세</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">서브회로</th>
                <th className="border border-border px-3 py-2 text-left">검증 대상</th>
                <th className="border border-border px-3 py-2 text-left">의존 관계</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>EVM Circuit</strong></td>
                <td className="border border-border px-3 py-2">Opcode 실행, gas 비용, stack/memory</td>
                <td className="border border-border px-3 py-2">모든 테이블 참조</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>State Circuit</strong></td>
                <td className="border border-border px-3 py-2">RWTable 순서·일관성</td>
                <td className="border border-border px-3 py-2">독립</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Bytecode Circuit</strong></td>
                <td className="border border-border px-3 py-2">Code hash, byte sequence</td>
                <td className="border border-border px-3 py-2">Keccak</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Copy Circuit</strong></td>
                <td className="border border-border px-3 py-2">Memory copy, calldata, logs</td>
                <td className="border border-border px-3 py-2">RWTable</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Keccak Circuit</strong></td>
                <td className="border border-border px-3 py-2">SHA3-256 hash 계산</td>
                <td className="border border-border px-3 py-2">독립</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>MPT Circuit</strong></td>
                <td className="border border-border px-3 py-2">zkTrie 상태 변경 증명</td>
                <td className="border border-border px-3 py-2">Poseidon</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Poseidon Circuit</strong></td>
                <td className="border border-border px-3 py-2">ZK-friendly hash</td>
                <td className="border border-border px-3 py-2">독립</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Tx Circuit</strong></td>
                <td className="border border-border px-3 py-2">Transaction 서명, nonce</td>
                <td className="border border-border px-3 py-2">Keccak, ECDSA</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>ECC Circuit</strong></td>
                <td className="border border-border px-3 py-2">ECDSA recover</td>
                <td className="border border-border px-3 py-2">독립</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>PI (Public Input)</strong></td>
                <td className="border border-border px-3 py-2">블록 header, L1 commitment</td>
                <td className="border border-border px-3 py-2">모든 테이블</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Sig Circuit</strong></td>
                <td className="border border-border px-3 py-2">Signature aggregation</td>
                <td className="border border-border px-3 py-2">ECC</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold mt-8 mb-3">서브회로 구성</h3>
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3">
            <p className="text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">EVM 메인</p>
            <p className="text-xs text-foreground/80"><code className="text-xs">evm_circuit.rs</code> — 140+ 오퍼코드 가젯</p>
          </div>
          <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">핵심 서브회로</p>
            <p className="text-xs text-foreground/80"><code className="text-xs">bytecode</code>, <code className="text-xs">copy</code>, <code className="text-xs">keccak</code>, <code className="text-xs">mpt</code></p>
          </div>
          <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">암호 서브회로</p>
            <p className="text-xs text-foreground/80"><code className="text-xs">sig_circuit</code>, <code className="text-xs">ecc_circuit</code></p>
          </div>
          <div className="rounded border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 p-3">
            <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-1">프리컴파일 & 유틸</p>
            <p className="text-xs text-foreground/80"><code className="text-xs">sha256</code>, <code className="text-xs">modexp</code>, <code className="text-xs">rlp</code>, <code className="text-xs">poseidon</code>, <code className="text-xs">exp</code></p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">SuperCircuit — 통합 회로</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-2">
            <code className="text-xs">SuperCircuitConfig&lt;F: Field&gt;</code>
            <span className="text-muted-foreground font-normal ml-2">super_circuit.rs</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-foreground/80 mb-3">
            <span><code>evm_circuit</code></span>
            <span><code>bytecode_circuit</code></span>
            <span><code>copy_circuit</code></span>
            <span><code>keccak_circuit</code></span>
            <span><code>mpt_circuit</code></span>
            <span><code>sig_circuit</code></span>
            <span><code>poseidon_circuit</code></span>
            <span className="text-muted-foreground">... 추가 서브회로</span>
          </div>
          <p className="text-sm text-foreground/80"><code className="text-xs">SuperCircuit::synthesize</code> → 모든 서브회로를 순차 합성, 공유 테이블(<code className="text-xs">RwTable</code>, <code className="text-xs">TxTable</code> 등)로 회로 간 일관성 유지</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">zkTrie — Binary MPT</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-semibold mb-2">이더리움 표준 MPT</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>Hexary (branch: 16 children)</li>
              <li>Keccak hash (EVM-friendly)</li>
              <li className="text-red-600 dark:text-red-400">SNARK 회로에서 매우 비효율</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Scroll zkTrie</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>Binary MPT (branch: 2 children)</li>
              <li>Poseidon hash (SNARK-friendly)</li>
              <li><M>{'2^{248}'}</M> key space</li>
            </ul>
          </div>
        </div>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-2">왜 Binary + Poseidon?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground/80">
            <div>
              <p className="font-medium mb-1">Poseidon vs Keccak SNARK cost</p>
              <ul className="space-y-1">
                <li>Keccak: ~150K constraints/hash</li>
                <li>Poseidon: ~200 constraints/hash</li>
                <li className="font-semibold text-emerald-600 dark:text-emerald-400">750x 효율</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Hexary vs Binary trie</p>
              <ul className="space-y-1">
                <li>Hexary: <M>{'\\log_{16}(N)'}</M> depth, 16 hash/node</li>
                <li>Binary: <M>{'\\log_2(N)'}</M> depth, 2 hash/node</li>
                <li className="font-semibold text-emerald-600 dark:text-emerald-400">총 hash 수 ~4x 적음</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border text-sm text-foreground/60">
            <strong>Trade-off:</strong> 이더리움과 다른 trie → state root 다름, L1 bridge 별도 매핑 필요, Scroll node 양쪽 state 유지
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Scroll zkEVM 설계 철학</p>
          <p>
            <strong>"Bytecode-level compatibility"</strong>:<br />
            - Solidity 재컴파일 없이 그대로 실행<br />
            - EVM opcode 100% 구현<br />
            - 기존 infrastructure (MetaMask, Hardhat) 호환
          </p>
          <p className="mt-2">
            <strong>vs zkSync Era (LLVM-based)</strong>:<br />
            - zkSync: custom zkVM, 재컴파일 필요<br />
            - Scroll: native EVM bytecode<br />
            - Scroll이 더 호환적, zkSync가 더 최적화
          </p>
          <p className="mt-2">
            <strong>vs Polygon zkEVM</strong>:<br />
            - 비슷한 approach (bytecode compat)<br />
            - 다른 proof system (STARK+SNARK stack)<br />
            - Scroll은 pure Halo2
          </p>
        </div>

      </div>
    </section>
  );
}
