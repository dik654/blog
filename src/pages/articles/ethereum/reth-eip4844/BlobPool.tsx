import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import BlobPoolDetailViz from "./viz/BlobPoolDetailViz";
import type { CodeRef } from "@/components/code/types";

export default function BlobPool({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="blob-pool" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlobPool 관리</h2>
      <div className="not-prose mb-8">
        <BlobPoolDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("blob-validate", codeRefs["blob-validate"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            validate_blob_sidecar()
          </span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "tx-validate-stateless",
                codeRefs["tx-validate-stateless"],
              )
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            stateless 검증 — 포크, 크기, blob 개수
          </span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("tx-validate-eip4844", codeRefs["tx-validate-eip4844"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            stateful 검증 — KZG + re-org 처리
          </span>
        </div>

        {/* ── stateless 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          2단계 검증 — stateless vs stateful
        </h3>
        <div className="not-prose rounded-lg border border-border/60 p-4 my-4">
          <p className="text-xs font-semibold text-indigo-400 mb-3">
            Stage 1: 상태 조회 없는 구조 검증
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">
                1. Blob fork 활성 확인
              </p>
              <p className="text-xs text-foreground/60">
                현재 block timestamp의 chain spec 사용
              </p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">
                2. Blob 개수
              </p>
              <p className="text-xs text-foreground/60">
                0 &lt; blobs &le; 현재 fork의{" "}
                <code className="text-xs">max_blob_count</code>
              </p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">
                3. Blob 크기
              </p>
              <p className="text-xs text-foreground/60">
                각 blob == 131,072 bytes (128KB 고정)
              </p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">
                4. Hash-Blob 개수 일치
              </p>
              <p className="text-xs text-foreground/60">
                <code className="text-xs">
                  versioned_hashes.len() == blobs.len()
                </code>
              </p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">
                5. Version prefix
              </p>
              <p className="text-xs text-foreground/60">
                <code className="text-xs">hash[0] == 0x01</code>
              </p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">
                6. Commitment/Proof 개수
              </p>
              <p className="text-xs text-foreground/60">
                <code className="text-xs">
                  commitments.len() == proofs.len() == blobs.len()
                </code>
              </p>
            </div>
          </div>
        </div>
        <p>
          Stateless validation은 database를 읽기 전에 transaction과 sidecar 자체에서 확인할 수 있는 type, field count, versioned hash와 size limit을 검사합니다. 비용은 hash와 sidecar element 수에 따라 늘지만 chain-state I/O가 없으므로, 명백히 잘못된 input을 nonce·balance 조회나 KZG verification보다 앞에서 저렴하게 거를 수 있습니다.
        </p>

        {/* ── KZG 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Sidecar 암호 검증과 계정 상태 검증
        </h3>
        <div className="not-prose rounded-lg border border-border/60 p-4 my-4">
          <p className="text-xs font-semibold text-emerald-400 mb-3">
            Stage 2: KZG + transaction state
          </p>
          <div className="space-y-2">
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">
                1. Versioned Hash 일치 확인
              </p>
              <p className="text-xs text-foreground/60">
                각 commitment를{" "}
                <code className="text-xs">kzg_to_versioned_hash()</code>로 변환
                → TX의 <code className="text-xs">blob_versioned_hashes[i]</code>
                와 비교
              </p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">
                2. KZG 증명 검증 (비싼 연산)
              </p>
              <p className="text-xs leading-5 text-foreground/60">
                구현은 single 또는 batch KZG verification API로 blob·commitment·proof가 서로 결속되어 있는지 확인합니다. 비용은 blob 수, c-kzg backend, batching strategy와 hardware에 따라 측정해야 합니다.
              </p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">
                3. 기본 TX 검증
              </p>
              <p className="text-xs text-foreground/60">
                nonce, balance, gas 확인 — stateless와 동일한 기본 검증
              </p>
            </div>
          </div>
        </div>
        <p>
          KZG verification은 account database 없이 수행할 수 있는 cryptographic check이지만 단순한 format check보다 비쌉니다. Nonce, balance와 fee affordability는 별도 provider lookup이 필요하므로 validation pipeline은 값싼 structural rule을 먼저 적용하고 crypto·state-dependent work를 뒤로 미룹니다.
        </p>

        {/* ── Blob TX 풀 특성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BlobPool 특성 — 일반 Pool과 차이
        </h3>
        <div className="not-prose grid grid-cols-1 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              BlobPool 구조체
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code className="text-xs">
                  pool: HashMap&lt;TxHash, Arc&lt;ValidPoolTransaction&gt;&gt;
                </code>{" "}
                — blob TX 관리
              </li>
              <li>
                <code className="text-xs">
                  sender_nonces: HashMap&lt;Address, u64&gt;
                </code>{" "}
                — sender별 현재 nonce
              </li>
              <li>
                <code className="text-xs">total_blob_gas: u64</code> — 전체 blob
                gas 추적 (메모리 제한)
              </li>
              <li>
                <code className="text-xs">
                  blob_store: Arc&lt;dyn BlobStore&gt;
                </code>{" "}
                — sidecar 저장소
              </li>
            </ul>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left p-3 font-semibold text-xs">항목</th>
                  <th className="text-left p-3 font-semibold text-xs">
                    일반 Pool
                  </th>
                  <th className="text-left p-3 font-semibold text-xs">
                    BlobPool
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr className="border-t border-border/40">
                  <td className="p-3 text-xs font-medium">크기 제한</td>
                  <td className="p-3 text-xs">config의 count/bytes 제한</td>
                  <td className="p-3 text-xs">sidecar bytes·disk quota 제한</td>
                </tr>
                <tr className="border-t border-border/40">
                  <td className="p-3 text-xs font-medium">Replacement bump</td>
                  <td className="p-3 text-xs">pool price-bump config</td>
                  <td className="p-3 text-xs">
                    blob fee cap까지 별도 replacement 규칙
                  </td>
                </tr>
                <tr className="border-t border-border/40">
                  <td className="p-3 text-xs font-medium">데이터 구조</td>
                  <td className="p-3 text-xs">TX 안에 모든 데이터</td>
                  <td className="p-3 text-xs">
                    TX는 hash만, sidecar 별도 store
                  </td>
                </tr>
                <tr className="border-t border-border/40">
                  <td className="p-3 text-xs font-medium">전파</td>
                  <td className="p-3 text-xs">전체 TX broadcast</td>
                  <td className="p-3 text-xs">
                    hash announce, 요청 시 sidecar
                  </td>
                </tr>
                <tr className="border-t border-border/40">
                  <td className="p-3 text-xs font-medium">Subpool</td>
                  <td className="p-3 text-xs">Pending / BaseFee / Queued</td>
                  <td className="p-3 text-xs">별도 BlobPool (독립 관리)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p>
          Blob transaction은 sidecar storage와 blob-fee cap 때문에 별도의 subpool rule이 필요하지만 sender와 nonce ordering까지 일반 pool과 완전히 독립된 것은 아닙니다. Reth는 blob-specific size·replacement·propagation condition을 추적하면서도 전체 txpool의 sender sequence와 memory budget 안에서 함께 scheduling합니다.
        </p>
      </div>
    </section>
  );
}
