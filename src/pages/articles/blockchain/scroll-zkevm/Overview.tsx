import ScrollCircuitViz from '../components/ScrollCircuitViz';
import SubCircuitViz from './viz/SubCircuitViz';
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

        <h3 className="text-lg font-semibold mt-6 mb-3">크레이트 구조 (zkevm-circuits/src/)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-4">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-2">서브회로</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">evm_circuit.rs</code> — EVM 실행 흐름 메인 회로</li>
              <li><code className="text-xs">execution/</code> — 오퍼코드별 <code className="text-xs">ExecutionGadget</code> (ADD, CALL, SLOAD 등)</li>
              <li><code className="text-xs">bytecode_circuit.rs</code> — 바이트코드 무결성 검증</li>
              <li><code className="text-xs">keccak_circuit.rs</code> — Keccak256 해시 회로</li>
              <li><code className="text-xs">mpt_circuit.rs</code> — Merkle Patricia Trie 상태 검증</li>
              <li><code className="text-xs">copy_circuit.rs</code> — 메모리/calldata 복사 추적</li>
              <li><code className="text-xs">sig_circuit.rs</code> — ECDSA 서명 검증</li>
              <li><code className="text-xs">ecc_circuit.rs</code> — 점 곱셈 등 타원곡선 연산</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">공유 테이블 (table.rs)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">RwTable</code> — 모든 읽기/쓰기 연산 순서 기록</li>
              <li><code className="text-xs">BytecodeTable</code> — 바이트코드 바이트 → 인덱스 매핑</li>
              <li><code className="text-xs">TxTable</code> — 트랜잭션 메타데이터</li>
              <li><code className="text-xs">KeccakTable</code> — Keccak 입출력 쌍</li>
              <li><code className="text-xs">CopyTable</code> — 복사 이벤트 기록</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">EvmCircuitConfig — 회로 설정</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-3">
            <code className="text-xs">EvmCircuitConfig&lt;F&gt;</code>
            <span className="text-muted-foreground font-normal ml-2">evm_circuit.rs</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3">
              <p className="font-semibold text-sky-700 dark:text-sky-300 mb-1">고정 테이블</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">fixed_table: [Column&lt;Fixed&gt;; 4]</code> — 오퍼코드 상수 룩업</li>
                <li><code className="text-xs">byte_table: [Column&lt;Fixed&gt;; 1]</code> — 바이트 범위 검사</li>
              </ul>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">서브회로 테이블</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">tx_table</code>, <code className="text-xs">rw_table</code></li>
                <li><code className="text-xs">bytecode_table</code>, <code className="text-xs">block_table</code></li>
                <li><code className="text-xs">copy_table</code>, <code className="text-xs">keccak_table</code></li>
                <li><code className="text-xs">exp_table</code>, <code className="text-xs">sig_table</code>, <code className="text-xs">ecc_table</code></li>
              </ul>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">ExecutionConfig::configure()</p>
              <ul className="space-y-1 text-foreground/80">
                <li>스텝 상태, 오퍼코드, 가스 카운터 열 설정</li>
                <li><code className="text-xs">configure_gadget!</code> 매크로로 각 가젯 초기화</li>
                <li>모든 가젯에서 공유 테이블로의 룩업 제약 등록</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
