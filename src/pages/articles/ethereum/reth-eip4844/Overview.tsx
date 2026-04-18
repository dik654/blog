import ContextViz from './viz/ContextViz';
import BlobTxViz from './viz/BlobTxViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob TX 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          EIP-4844는 롤업의 데이터 비용을 줄이기 위한 Blob TX를 도입한다 (Cancun 포크, 2024-03).<br />
          이 아티클에서는 reth 코드베이스의 blob 저장소, TX 검증, 가스 가격을 추적한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blobstore-trait', codeRefs['blobstore-trait'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlobStore 트레이트 — 저장소 인터페이스</span>
        </div>

        {/* ── Blob TX 동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-4844 동기 — 롤업 DA 비용 절감</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-red-400 mb-2">EIP-4844 이전</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              롤업(Optimism, Arbitrum, Base)은 calldata로 DA 제공.<br />
              calldata 바이트당 ~16 gas (zero는 4 gas).<br />
              4MB rollup batch = ~64M gas — 거의 2개 블록 소모.<br />
              롤업 TX 수수료의 <strong>80%</strong>가 DA 비용.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">EIP-4844 (Proto-Danksharding)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Blob = 128KB 데이터 청크, 블록당 최대 6개(768KB).<br />
              별도 gas market(<code className="text-xs">blob_gas</code>) 운영.<br />
              임시 저장 ~18일(4096 epoch) 후 폐기.<br />
              EVM 직접 읽기 불가 — point evaluation precompile만 접근.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-blue-400 mb-2">실제 효과 (2024~2025)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              L2 TX 수수료: $0.05 → $0.005 (<strong>10배 하락</strong>).<br />
              Base, Arbitrum, Optimism 사용량 급증.<br />
              L2 TPS: 수십 → 수천.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">경제적 영향</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              메인넷 <code className="text-xs">base_fee</code> 유지 (calldata 사용 감소).<br />
              <code className="text-xs">blob_gas</code> market 별도 형성.<br />
              validator 수익 중 ~1~5%가 blob_gas fee.
            </p>
          </div>
        </div>
        <p className="leading-7">
          EIP-4844는 <strong>Proto-Danksharding</strong> — 전체 Danksharding의 예비 단계.<br />
          Blob을 임시 저장(~18일)하고 그 이후 폐기 → 상태 영구 팽창 방지.<br />
          롤업 DA 비용 10~100배 감소 → L2 생태계 폭발적 성장의 직접 원인.
        </p>

        {/* ── BlobTransaction 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Blob TX 구조 — EIP-4844 Type 3</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">TxEip4844 (type = 0x03)</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">chain_id</code> / <code className="text-xs">nonce</code> / <code className="text-xs">gas_limit</code> — 기본 필드</li>
              <li><code className="text-xs">max_fee_per_gas</code>, <code className="text-xs">max_priority_fee_per_gas</code> — EIP-1559 가스</li>
              <li><code className="text-xs">to: Address</code> — Call만 허용 (Create 불가)</li>
              <li><code className="text-xs">max_fee_per_blob_gas: u128</code> — blob gas 상한</li>
              <li><code className="text-xs">blob_versioned_hashes: Vec&lt;B256&gt;</code> — 각 blob의 VersionedHash</li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">VersionedHash: <code className="text-xs">0x01</code> + <code className="text-xs">SHA-256(commitment)[1..32]</code></p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">BlobTransactionSidecar</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">blobs: Vec&lt;Blob&gt;</code> — 실제 데이터 (각 128KB)</li>
              <li><code className="text-xs">commitments: Vec&lt;KzgCommitment&gt;</code> — 각 blob의 KZG commitment</li>
              <li><code className="text-xs">proofs: Vec&lt;KzgProof&gt;</code> — 각 blob의 증명</li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2"><code className="text-xs">Blob.data: [u8; 131072]</code> — 4096 BLS12-381 field elements</p>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">네트워크 전송 분리</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              노드 간 TX 전달 시: TX + sidecar 함께 전송.<br />
              블록에는 <code className="text-xs">blob_versioned_hashes</code>만 포함 — blob 본체 없음.<br />
              sidecar는 <code className="text-xs">BlobStore</code>에 별도 저장.
            </p>
          </div>
        </div>
        <p className="leading-7">
          Blob TX는 <strong>2개 부분 분리</strong> — on-chain TX (hashes만) + off-chain sidecar (blobs).<br />
          블록에 blob 본체 포함하지 않음 → consensus 부담 감소.<br />
          Sidecar는 임시 저장 후 폐기 → 영구 상태 팽창 방지.
        </p>

        {/* ── 블록 헤더 확장 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 헤더 확장 — Cancun 필드</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">Header 추가 필드</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">blob_gas_used: Option&lt;u64&gt;</code> — 블록에서 사용한 blob gas</li>
              <li><code className="text-xs">excess_blob_gas: Option&lt;u64&gt;</code> — 누적 초과분 (blob_fee 계산용)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">Blob Gas 상수</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">GAS_PER_BLOB</code> = 131,072 (1 blob = 128KB)</li>
              <li><code className="text-xs">TARGET_BLOBS_PER_BLOCK</code> = 3</li>
              <li><code className="text-xs">MAX_BLOBS_PER_BLOCK</code> = 6</li>
              <li><code className="text-xs">MAX_BLOB_GAS_PER_BLOCK</code> = 786,432</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">검증 규칙</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code className="text-xs">blob_gas_used</code> &le; 786,432 (MAX)<br />
              <code className="text-xs">blob_gas_used</code> % 131,072 == 0 (정수 blob만 허용)
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-rose-400 mb-2">blob_base_fee 계산</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code className="text-xs">fake_exponential(1, excess_blob_gas, 3_338_477)</code><br />
              이전 excess 기반 지수 함수 — EIP-1559와 동일 피드백 루프
            </p>
          </div>
        </div>
        <p className="leading-7">
          <strong>2개 새 헤더 필드</strong>로 blob 경제 모델 관리.<br />
          <code>blob_gas_used</code>: 이 블록 사용량, <code>excess_blob_gas</code>: 누적 초과.<br />
          일반 gas와 독립된 별도 market — blob 수요가 일반 TX에 영향 없음.
        </p>
      </div>
      <div className="not-prose mt-6"><BlobTxViz /></div>
    </section>
  );
}
