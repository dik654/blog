import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Contribution({ onCodeRef }: Props) {
  return (
    <section id="contribution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기여 집계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-sync-aggregate', codeRefs['process-sync-aggregate'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessSyncAggregate()</span>
        </div>

        {/* ── 4 subnet 집계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">4 Subnet 집계 — SyncAggregate 구성</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">용어 정리</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-foreground/80">
              <div><span className="font-semibold">SyncCommitteeMessage</span> — 개별 validator 서명</div>
              <div><span className="font-semibold">SyncCommitteeContribution</span> — subnet 내 집계</div>
              <div><span className="font-semibold">SyncAggregate</span> — 4 subnets 최종 집계</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">SyncCommitteeContribution</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p><code>slot: Slot</code></p>
                <p><code>beacon_block_root: Root</code></p>
                <p><code>subcommittee_index: uint64</code> (0~3)</p>
                <p><code>aggregation_bits: Bitvector[128]</code></p>
                <p><code>signature: BLSSignature</code></p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">SyncAggregate</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p><code>sync_committee_bits: Bitvector[512]</code></p>
                <p><code>sync_committee_signature: BLSSignature</code></p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">aggregateContributions 흐름</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. Subnet aggregator 선정 (committee처럼)</p>
              <p>2. 각 subnet에서 128명의 서명 수집 &rarr; BLS aggregate &rarr; Contribution</p>
              <p>3. Block proposer가 4 Contributions 수신</p>
              <p>4. <code>subnetOffset = SubcommitteeIndex * 128</code>로 512-bit 벡터에 bit 매핑</p>
              <p>5. <code>bls.Aggregate(sigs)</code>로 4 서명 합침 &rarr; SyncAggregate 생성</p>
              <p>6. Block body에 포함</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          512명 sync committee를 <strong>4 subnets × 128명</strong>으로 분할.<br />
          subnet 집계 → block proposer가 4 Contributions 통합.<br />
          최종 SyncAggregate (512 bits + 1 signature)가 block에 포함.
        </p>

        {/* ── Light Client 활용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Light Client — SyncAggregate로 head 검증</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">1. Bootstrapping (최초 1회)</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p><code>GET /eth/v1/beacon/light_client/bootstrap/&#123;trusted_block_root&#125;</code></p>
              <p>header + <code>current_sync_committee</code> (512 pubkeys) + merkle proof 수신</p>
              <p><code>state_root</code>에서 <code>current_sync_committee</code> merkle proof 검증</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">2. Update 수신 (주기적)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>attested_header</code> — 신뢰할 새 block</span>
              <span><code>next_sync_committee</code> — 다음 committee</span>
              <span><code>finalized_header</code></span>
              <span><code>sync_aggregate</code> — 현재 committee 서명</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">3-4. SyncAggregate 검증</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p><code>popcount(sync_committee_bits) * 3 &gt;= 512 * 2</code> — 2/3+ 필요 (341명 이상)</p>
              <p>bit가 set된 512명 중 active pubkey 수집</p>
              <p><code>FastAggregateVerify(activePubkeys, signingRoot, signature)</code> — BLS 검증</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">5. Update 채택 효과</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">1M validator 불필요</p><p className="text-foreground/50">512명만 추적</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">~25 KB</p><p className="text-foreground/50">per committee update</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">모바일/브라우저</p><p className="text-foreground/50">Helios 등 가능</p></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Light client가 <strong>SyncAggregate로 head 검증</strong>.<br />
          512 validator만 추적 → 25KB per update.<br />
          모바일/브라우저 full consensus verification 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 4개 서브넷 집계</strong> — 512명을 4개 서브넷(각 128명)으로 분할.<br />
          각 서브넷에서 BLS aggregate → Contribution → SyncAggregate.<br />
          512비트 참여 비트필드 + 1개 집계 BLS 서명으로 블록에 포함.
        </p>

        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 보상 & 패널티</strong> — 참여 보상 = totalActiveBalance / 512 / 32 per slot.<br />
          불참 시 동일 금액 차감 — 참여 인센티브로 높은 참여율 유지.<br />
          라이트 클라이언트는 SyncAggregate 검증만으로 헤드 확인.
        </p>
      </div>
    </section>
  );
}
