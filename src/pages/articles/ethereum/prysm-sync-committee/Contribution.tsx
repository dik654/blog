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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sync committee 512명 → 4 subnets (각 128명)
// 각 subnet에서 Contribution 집계 → SyncAggregate

// 용어:
// SyncCommitteeMessage: 개별 validator 서명
// SyncCommitteeContribution: subnet 내 집계
// SyncAggregate: 4 subnets 최종 집계 (block 포함)

struct SyncCommitteeContribution {
    slot: Slot,
    beacon_block_root: Root,
    subcommittee_index: uint64,          // 0~3
    aggregation_bits: Bitvector[128],    // subnet 내 참여 표시
    signature: BLSSignature,             // 집계 서명
}

struct SyncAggregate {
    sync_committee_bits: Bitvector[512],  // 전체 참여 표시
    sync_committee_signature: BLSSignature,
}

// Aggregation 흐름:
// 1. Subnet aggregator 선정 (committee처럼)
// 2. 각 subnet에서 128명의 서명 수집
// 3. BLS aggregate → Contribution
// 4. Block proposer가 4 Contributions 수신
// 5. 4 Contributions를 합쳐 SyncAggregate 생성
// 6. Block body에 포함

// Aggregation 계산:
func aggregateContributions(contributions []*Contribution) *SyncAggregate {
    bits := bitfield.NewBitvector(512)
    sigs := []BLSSignature{}

    for _, c := range contributions {
        subnetOffset := c.SubcommitteeIndex * 128
        for i := 0; i < 128; i++ {
            if c.AggregationBits.BitAt(i) {
                bits.SetBitAt(subnetOffset + i, true)
            }
        }
        sigs = append(sigs, c.Signature)
    }

    return &SyncAggregate{
        SyncCommitteeBits: bits,
        SyncCommitteeSignature: bls.Aggregate(sigs),
    }
}`}
        </pre>
        <p className="leading-7">
          512명 sync committee를 <strong>4 subnets × 128명</strong>으로 분할.<br />
          subnet 집계 → block proposer가 4 Contributions 통합.<br />
          최종 SyncAggregate (512 bits + 1 signature)가 block에 포함.
        </p>

        {/* ── Light Client 활용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Light Client — SyncAggregate로 head 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Light client의 verification flow

// 1. Bootstrapping (최초 1회)
bootstrap := httpGet("/eth/v1/beacon/light_client/bootstrap/{trusted_block_root}")
// bootstrap contains:
// - header
// - current_sync_committee (512 pubkeys)
// - current_sync_committee_branch (merkle proof)

// verify bootstrap:
assert bootstrap.header.state_root contains current_sync_committee
// state_root에서 current_sync_committee merkle proof 검증

// 2. Update 수신 (주기적)
update := httpGet("/eth/v1/beacon/light_client/updates")
// update contains:
// - attested_header (new block to trust)
// - next_sync_committee (다음 committee)
// - finalized_header
// - sync_aggregate (현재 committee 서명)
// - signature_slot

// 3. SyncAggregate 검증
activeBits := popcount(update.sync_aggregate.sync_committee_bits)
if activeBits * 3 < 512 * 2 { return INVALID }  // 2/3+ 필요

// 4. BLS 서명 검증
activePubkeys := []BLSPubkey{}
for i := 0; i < 512; i++ {
    if update.sync_aggregate.sync_committee_bits.BitAt(i) {
        activePubkeys = append(activePubkeys, currentCommittee.Pubkeys[i])
    }
}
signingRoot := computeSigningRoot(
    update.attested_header.root,
    getDomain(DOMAIN_SYNC_COMMITTEE, ...)
)
if !bls.FastAggregateVerify(activePubkeys, signingRoot, update.signature) {
    return INVALID
}

// 5. Update 채택
trustedHeader := update.attested_header
currentCommittee = update.next_sync_committee

// 효과:
// - 전체 1M validator 관리 불필요
// - 512명만 추적 → ~25 KB per committee update
// - 모바일/브라우저 노드 가능 (Helios 등)`}
        </pre>
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
