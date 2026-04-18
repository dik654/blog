import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BlobPoolDetailViz from './viz/BlobPoolDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function BlobPool({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blob-pool" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlobPool 관리</h2>
      <div className="not-prose mb-8"><BlobPoolDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blob-validate', codeRefs['blob-validate'])} />
          <span className="text-[10px] text-muted-foreground self-center">validate_blob_sidecar()</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('tx-validate-stateless', codeRefs['tx-validate-stateless'])} />
          <span className="text-[10px] text-muted-foreground self-center">stateless 검증 — 포크, 크기, blob 개수</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('tx-validate-eip4844', codeRefs['tx-validate-eip4844'])} />
          <span className="text-[10px] text-muted-foreground self-center">stateful 검증 — KZG + re-org 처리</span>
        </div>

        {/* ── stateless 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2단계 검증 — stateless vs stateful</h3>
        <div className="not-prose rounded-lg border border-border/60 p-4 my-4">
          <p className="text-xs font-semibold text-indigo-400 mb-3">Stage 1: Stateless Validation (O(1), 마이크로초)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">1. Cancun 포크 확인</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">is_cancun_active_at_timestamp()</code></p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">2. Blob 개수</p>
              <p className="text-xs text-foreground/60">0 &lt; blobs &le; <code className="text-xs">MAX_BLOBS_PER_TX</code> (6)</p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">3. Blob 크기</p>
              <p className="text-xs text-foreground/60">각 blob == 131,072 bytes (128KB 고정)</p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">4. Hash-Blob 개수 일치</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">versioned_hashes.len() == blobs.len()</code></p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">5. Version prefix</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">hash[0] == 0x01</code></p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">6. Commitment/Proof 개수</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">commitments.len() == proofs.len() == blobs.len()</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Stateless 검증은 <strong>DB 접근 없이 TX 자체만</strong> 검사.<br />
          크기/개수/포맷 검증 → O(1) 시간에 완료 → 빠른 필터링.<br />
          대부분의 잘못된 blob TX는 여기서 걸러짐.
        </p>

        {/* ── KZG 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Stateful 검증 — KZG proof 확인</h3>
        <div className="not-prose rounded-lg border border-border/60 p-4 my-4">
          <p className="text-xs font-semibold text-emerald-400 mb-3">Stage 2: Stateful Validation (blob당 ~5ms)</p>
          <div className="space-y-2">
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">1. Versioned Hash 일치 확인</p>
              <p className="text-xs text-foreground/60">
                각 commitment를 <code className="text-xs">kzg_to_versioned_hash()</code>로 변환 → TX의 <code className="text-xs">blob_versioned_hashes[i]</code>와 비교
              </p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">2. KZG 증명 검증 (비싼 연산)</p>
              <p className="text-xs text-foreground/60">
                각 blob에 대해 <code className="text-xs">verify_blob_kzg_proof(blob, commitment, proof)</code> 호출.<br />
                BLS12-381 pairing 연산 — blob당 ~5ms, 6 blob TX ~30ms. 병렬화 가능.
              </p>
            </div>
            <div className="rounded bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">3. 기본 TX 검증</p>
              <p className="text-xs text-foreground/60">nonce, balance, gas 확인 — stateless와 동일한 기본 검증</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Stateful 검증은 <strong>KZG 암호학 연산 포함</strong> — blob당 ~5ms.<br />
          BLS12-381 곡선의 pairing 연산 → 수학적으로 비쌈.<br />
          Stateless 먼저 수행하여 대부분 필터링 후 KZG 검증 → 효율적.
        </p>

        {/* ── Blob TX 풀 특성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlobPool 특성 — 일반 Pool과 차이</h3>
        <div className="not-prose grid grid-cols-1 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">BlobPool 구조체</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">pool: HashMap&lt;TxHash, Arc&lt;ValidPoolTransaction&gt;&gt;</code> — blob TX 관리</li>
              <li><code className="text-xs">sender_nonces: HashMap&lt;Address, u64&gt;</code> — sender별 현재 nonce</li>
              <li><code className="text-xs">total_blob_gas: u64</code> — 전체 blob gas 추적 (메모리 제한)</li>
              <li><code className="text-xs">blob_store: Arc&lt;dyn BlobStore&gt;</code> — sidecar 저장소</li>
            </ul>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left p-3 font-semibold text-xs">항목</th>
                  <th className="text-left p-3 font-semibold text-xs">일반 Pool</th>
                  <th className="text-left p-3 font-semibold text-xs">BlobPool</th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr className="border-t border-border/40">
                  <td className="p-3 text-xs font-medium">크기 제한</td>
                  <td className="p-3 text-xs">max 10K TX</td>
                  <td className="p-3 text-xs">max ~수천 (blob 크기)</td>
                </tr>
                <tr className="border-t border-border/40">
                  <td className="p-3 text-xs font-medium">Replacement bump</td>
                  <td className="p-3 text-xs">10% 증가</td>
                  <td className="p-3 text-xs">100% 증가</td>
                </tr>
                <tr className="border-t border-border/40">
                  <td className="p-3 text-xs font-medium">데이터 구조</td>
                  <td className="p-3 text-xs">TX 안에 모든 데이터</td>
                  <td className="p-3 text-xs">TX는 hash만, sidecar 별도 store</td>
                </tr>
                <tr className="border-t border-border/40">
                  <td className="p-3 text-xs font-medium">전파</td>
                  <td className="p-3 text-xs">전체 TX broadcast</td>
                  <td className="p-3 text-xs">hash announce, 요청 시 sidecar</td>
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
        <p className="leading-7">
          BlobPool은 <strong>일반 Pool과 독립적</strong>으로 관리.<br />
          크기 제한, replacement 규칙, 네트워크 전파 모두 다름.<br />
          blob_gas_limit 786KB 별도 관리 → 일반 TX 풀 공간 침범 없음.
        </p>
      </div>
    </section>
  );
}
