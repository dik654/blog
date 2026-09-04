import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import RethRuntimeViz from "../reth-runtime-viz";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob transaction은 execution payload와 sidecar를 분리한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          EIP-4844는 Cancun upgrade에서 rollup data를 위한 blob transaction과 별도의 fee market을 도입했습니다. execution
          block에는 blob을 식별하는 versioned hash만 남고 실제 data와 KZG proof는 sidecar로 전파됩니다. 이 글에서는 그 경계가 Reth의
          transaction validation과 blob store, fee 계산으로 어떻게 이어지는지 차례로 추적합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("blobstore-trait", codeRefs["blobstore-trait"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            BlobStore 트레이트 — 저장소 인터페이스
          </span>
        </div>
      </div>
      <ContentBoundary article="reth-eip4844" />
      <RethRuntimeViz mode="blob-boundary" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Blob TX 동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          EIP-4844 동기 — 롤업 DA 비용 절감
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-red-400 mb-2">
              EIP-4844 이전
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              Rollup은 batch data를 calldata로 게시했기 때문에 일반 execution gas를 썼고 다른 transaction과 같은 L1 block space에서
              경쟁했습니다. 비용은 batch 압축률과 당시 fee market에 따라 달랐지만 data availability traffic이 execution 수요와 같은 가격 신호를
              받는 구조였습니다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              EIP-4844 (Proto-Danksharding)
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              Blob은 고정 크기의 field-element 배열이며 공급량은 활성 fork의 blob schedule이 정합니다. 별도 <code className="text-xs">blob_gas</code> market이 가격을 매기고 consensus layer가 정해진 가용성 기간 동안 sidecar를 보관하지만, execution state에는 영구 저장하지 않습니다. EVM은 blob byte를 직접 읽지 않고 point-evaluation precompile로 commitment에 연결된 값만 검증합니다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-blue-400 mb-2">
              효과를 관측하는 지표
            </p>
            <ul className="space-y-1 text-sm leading-6 text-foreground/80"><li>blob base fee와 block별 blob 사용량</li><li>rollup별 압축 후 bytes/transaction과 L1 posting 비용</li><li>calldata fallback 비율과 batch 게시 지연</li></ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              경제적 영향
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              Execution gas와 <code className="text-xs">blob_gas</code>는 서로 다른 excess와 base fee 상태를 사용합니다. Blob base fee는 burn되며 priority fee처럼 proposer에게 직접 지급되지 않습니다. 다만 rollup의 총비용에는 execution, proving과 운영비도 포함되므로 blob fee만으로 전체 경제성을 판단할 수는 없습니다.
            </p>
          </div>
        </div>
        <p>
          그래서 Proto-Danksharding의 직접적인 변화는 “data를 없앤 것”이 아니라 blob data의 수명과 가격을 execution state에서 분리한 것입니다. 비용
          절감 효과는 고정 배수가 아닙니다. blob 수요와 fork별 공급 schedule, 각 rollup의 batching 효율을 함께 측정합니다.
        </p>

        {/* ── BlobTransaction 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Blob transaction은 execution payload와 sidecar를 분리한다 — EIP-4844 Type 3
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              TxEip4844 (type = 0x03)
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code className="text-xs">chain_id</code> /{" "}
                <code className="text-xs">nonce</code> /{" "}
                <code className="text-xs">gas_limit</code> — 기본 필드
              </li>
              <li>
                <code className="text-xs">max_fee_per_gas</code>,{" "}
                <code className="text-xs">max_priority_fee_per_gas</code> —
                EIP-1559 가스
              </li>
              <li>
                <code className="text-xs">to: Address</code> — Call만 허용
                (Create 불가)
              </li>
              <li>
                <code className="text-xs">max_fee_per_blob_gas: u128</code> —
                blob gas 상한
              </li>
              <li>
                <code className="text-xs">
                  blob_versioned_hashes: Vec&lt;B256&gt;
                </code>{" "}
                — 각 blob의 VersionedHash
              </li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">
              VersionedHash: <code className="text-xs">0x01</code> +{" "}
              <code className="text-xs">SHA-256(commitment)[1..32]</code>
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              BlobTransactionSidecar
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code className="text-xs">blobs: Vec&lt;Blob&gt;</code> — 실제
                데이터 (각 128KB)
              </li>
              <li>
                <code className="text-xs">
                  commitments: Vec&lt;KzgCommitment&gt;
                </code>{" "}
                — 각 blob의 KZG commitment
              </li>
              <li>
                <code className="text-xs">proofs: Vec&lt;KzgProof&gt;</code> —
                각 blob의 증명
              </li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">
              <code className="text-xs">Blob.data: [u8; 131072]</code> — 4096
              BLS12-381 field elements
            </p>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              네트워크 전송 분리
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              Pool 전파 encoding은 signed transaction과 blob·commitment·proof wrapper를 함께 운반할 수 있지만, execution block의 transaction에는 versioned hash만 들어갑니다. Reth txpool은 실제 sidecar를 <code className="text-xs">BlobStore</code> 경계에 따로 보관해 transaction lifecycle과 대용량 data lifecycle을 분리합니다.
            </p>
          </div>
        </div>
        <p>
          정리하면 type-3 transaction은 실행과 fee에 필요한 on-chain transaction과 가용성 검증에 필요한 sidecar로 나뉩니다. Blob 본체를
          execution state에 영구 보관하지 않으므로 state growth가 제한됩니다. 대신 가용성 기간에는 consensus client와 networking layer가
          sidecar를 정상적으로 전파하고 검증해야 합니다.
        </p>

        {/* ── 블록 헤더 확장 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          블록 헤더 확장 — Cancun 필드
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              Header 추가 필드
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code className="text-xs">
                  blob_gas_used: Option&lt;u64&gt;
                </code>{" "}
                — 블록에서 사용한 blob gas
              </li>
              <li>
                <code className="text-xs">
                  excess_blob_gas: Option&lt;u64&gt;
                </code>{" "}
                — 누적 초과분 (blob_fee 계산용)
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              Blob Gas 상수
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code className="text-xs">GAS_PER_BLOB</code> = 131,072 (1 blob
                = 128KB)
              </li>
              <li>
                <code className="text-xs">target_blobs_per_block</code> — 활성
                fork의 blob schedule
              </li>
              <li>
                <code className="text-xs">max_blobs_per_block</code> — 활성
                fork의 blob schedule
              </li>
              <li>
                <code className="text-xs">max_blob_gas_per_block</code> — max ×
                GAS_PER_BLOB
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              검증 규칙
            </p>
            <ul className="space-y-1 text-sm leading-6 text-foreground/80"><li><code className="text-xs">blob_gas_used</code>는 활성 schedule의 maximum 이하입니다.</li><li><code className="text-xs">blob_gas_used % 131,072 == 0</code>이어야 하므로 정수 개의 blob만 허용됩니다.</li></ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-rose-400 mb-2">
              blob_base_fee 계산
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              <code className="text-xs">
                fake_exponential(min_fee, excess_blob_gas, update_fraction)
              </code>
              을 사용하며, minimum fee와 update fraction도 활성 fork의 blob parameter에서 선택합니다.
            </p>
          </div>
        </div>
        <p>
          Header의 <code>blob_gas_used</code>는 현재 block의 사용량을 기록하고, <code>excess_blob_gas</code>는 이전 block에서 이어진 초과 수요를 기록합니다. 이 두 값으로 blob fee market은 execution gas와 독립된 가격 신호를 만들지만, blob transaction도 block 검증과 networking 자원을 사용하므로 두 시장의 운영 영향까지 완전히 분리되는 것은 아닙니다.
        </p>
      </div>
      <div id="paper-eip4844" className="scroll-mt-24">
        <CitationBlock source="EIP-4844 — Shard Blob Transactions" href="https://eips.ethereum.org/EIPS/eip-4844" citeKey={1}>
          이 규격은 type-3 transaction, versioned hash, blob gas와 point-evaluation precompile의 규범적 의미를 정의합니다. Reth의 pool·store 구조나 처리량을 정하는 문서는 아닙니다.
        </CitationBlock>
      </div>
      <div id="paper-reth-eip4844-source" className="scroll-mt-24">
        <CitationBlock source="paradigmxyz/reth — EIP-4844 implementation" href="https://github.com/paradigmxyz/reth" citeKey={2} type="code">
          Reth source는 transaction validation, blob store와 canonical tracker의 구현 근거입니다. 함수명·경로·성능은 고정한 release 또는 git SHA 범위로만 읽습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
