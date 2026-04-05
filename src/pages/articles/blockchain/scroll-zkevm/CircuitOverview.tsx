import CircuitMapViz from './viz/CircuitMapViz';
import CodePanel from '@/components/ui/code-panel';
import {
  SUBCIRCUIT_MAP_CODE, subcircuitAnnotations,
  SUPER_CIRCUIT_CODE, superCircuitAnnotations,
} from './CircuitOverviewData';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 단일 거대 회로의 문제
// 1) 회로 크기 폭발
//    - EVM: 140+ opcode × 복잡 로직
//    - 단일 회로로 표현 시 rows 1B+ 필요
//    - Prover memory 수백 GB
//
// 2) 변경 어려움
//    - 하나 수정 시 전체 재검증
//    - 디버깅 극히 어려움
//
// 3) 검증 비용
//    - Proof 크기 선형 증가
//    - Verifier gas 폭주

// 서브회로 분할 장점
// 1) 관심사 분리
//    - EVM: opcode execution
//    - Bytecode: code 저장 검증
//    - Keccak: hash 계산
//    - MPT: 상태 트리 접근
//
// 2) 병렬 증명 가능
//    - 독립 서브회로 동시 prove
//    - Multi-core/multi-GPU 활용
//
// 3) Lookup으로 연결
//    - 서브회로 간 일관성은 lookup table
//    - EVM → Bytecode: "이 bytecode가 실제 존재하는가"
//    - EVM → Keccak: "이 hash가 올바른가"
//    - 작은 proof, 빠른 verify

// SuperCircuit
// = 11개 서브회로의 공통 contraint 묶음
// = 단일 proof로 전체 EVM 실행 증명`}</pre>

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

        <CodePanel title="서브회로 구성" code={SUBCIRCUIT_MAP_CODE}
          annotations={subcircuitAnnotations} />
        <CodePanel title="SuperCircuit — 통합 회로" code={SUPER_CIRCUIT_CODE}
          annotations={superCircuitAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">zkTrie — Binary MPT</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 이더리움 표준 MPT
// - Hexary (branch: 16 children)
// - Keccak hash (EVM-friendly)
// - 문제: SNARK 회로에서 매우 비효율

// Scroll zkTrie
// - Binary MPT (branch: 2 children)
// - Poseidon hash (SNARK-friendly)
// - 2^248 key space

// 왜 binary + Poseidon?
// Poseidon vs Keccak SNARK cost
// - Keccak: ~150K constraints per hash
// - Poseidon: ~200 constraints per hash
// → 750x 효율

// Hexary vs Binary trie
// - Hexary: log_16(N) depth, 16 hash per node
// - Binary: log_2(N) depth, 2 hash per node
// - Binary가 총 hash 수 적음 (~4x)

// Trade-off
// - 이더리움과 다른 trie → state root 다름
// - L1 bridge에서 별도 매핑 필요
// - Scroll node가 양쪽 state 유지

// 성능 영향
// - Proof 생성: 30-50x 빠름 (Poseidon 덕분)
// - State sync: 비슷함 (hash는 cache 가능)
// - 호환성: L1과 별도 commitment layer`}</pre>

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
