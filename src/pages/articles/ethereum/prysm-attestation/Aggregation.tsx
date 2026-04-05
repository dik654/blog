import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Aggregation({ onCodeRef }: Props) {
  return (
    <section id="aggregation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">집계 & 서브넷</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('compute-subnet', codeRefs['compute-subnet'])} />
          <span className="text-[10px] text-muted-foreground self-center">서브넷 + 풀 조회</span>
        </div>

        {/* ── Subnet 매핑 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation Subnet — 64 subnet 분산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 64 attestation subnets로 attestation 전파 분산
// 각 committee는 하나의 subnet에 매핑

// subnet 계산:
func computeSubnetForAttestation(
    slot Slot,
    committeeIndex CommitteeIndex,
    committeesPerSlot uint64,
) uint64 {
    slotsSinceEpochStart := slot % SLOTS_PER_EPOCH
    committeesSinceEpochStart := committeesPerSlot * slotsSinceEpochStart
    return (committeesSinceEpochStart + committeeIndex) % ATTESTATION_SUBNET_COUNT
    // ATTESTATION_SUBNET_COUNT = 64
}

// 네트워크 부하 분산:
// - 전체 attestation: ~30,000/slot
// - subnet별: ~500/slot
// - 각 노드는 자기 committee subnet만 구독

// Subnet 구독 규칙:
// 1. 기본: 자기 committee의 subnet
// 2. Aggregator: 여러 subnets (blanket coverage)
// 3. Fork choice 위해 보통 1~3 subnets 구독

// ATTESTATION_SUBNET_PREFIX_BITS = 6
// 2^6 = 64 subnets
// → ENR attnets bitfield 8 bytes (64 bits)

// ENR 구독 정보:
// attnets: 0b0000_0010_...  (특정 subnet만 1)
// discv5 lookup 시 이 bitfield로 peer 필터링`}
        </pre>
        <p className="leading-7">
          64 attestation subnets로 <strong>네트워크 부하 분산</strong>.<br />
          각 noode는 자기 committee subnet만 구독 → bandwidth 절약.<br />
          ENR attnets bitfield로 peer discovery 시 효율적 필터링.
        </p>

        {/* ── BLS 집계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BLS Aggregation — Aggregator 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 같은 AttestationData에 대한 여러 validator 서명을 1개로 집계

// Aggregator 선정:
// 매 slot & committee마다 "aggregator" role 무작위 선정
// selection_proof: slot에 대한 BLS 서명의 hash로 결정
// 평균 16 aggregator per committee

func isAggregator(
    pubkey [48]byte,
    slot Slot,
    committeeLength uint64,
) (bool, BLSSignature) {
    // 1. selection_proof 서명 생성
    domain := getDomain(DOMAIN_SELECTION_PROOF, epoch)
    signingRoot := computeSigningRoot(slot, domain)
    selectionProof := keyManager.Sign(pubkey, signingRoot)

    // 2. Aggregator 선정 임계값 확인
    modulo := committeeLength / TARGET_AGGREGATORS_PER_COMMITTEE  // 16
    if modulo == 0 { modulo = 1 }

    hash := sha256(selectionProof.Marshal())
    isAggregator := uint64(binary.LittleEndian.Uint64(hash[:8])) % modulo == 0

    return isAggregator, selectionProof
}

// Aggregation 수행:
func (v *validator) AggregateAndProof(slot Slot, committeeIdx uint64) {
    // 1. Aggregator 자격 확인
    if !isAggregator { return }

    // 2. Subnet에서 attestations 수집
    attestations := v.attestationsPool.GetAttestations(slot, committeeIdx)

    // 3. BLS signature aggregation
    bits := bitfield.NewBitlist(committeeLength)
    sigs := []BLSSignature{}
    for _, att := range attestations {
        for i := 0; i < committeeLength; i++ {
            if att.AggregationBits.BitAt(i) {
                bits.SetBitAt(i, true)
                sigs = append(sigs, att.Signature)
            }
        }
    }
    aggregateSig := bls.Aggregate(sigs)  // G2 point addition

    // 4. AggregateAndProof 메시지 생성
    aggregate := &Attestation{
        AggregationBits: bits,
        Data: attestations[0].Data,
        Signature: aggregateSig,
    }
    proof := &SignedAggregateAndProof{
        Message: &AggregateAndProof{
            AggregatorIndex: v.validatorIndex,
            Aggregate: aggregate,
            SelectionProof: selectionProof,
        },
        Signature: v.sign(message, DOMAIN_AGGREGATE_AND_PROOF),
    }

    // 5. 글로벌 토픽에 방송
    v.pubsub.Publish("beacon_aggregate_and_proof", proof)
}`}
        </pre>
        <p className="leading-7">
          <strong>Aggregator</strong>가 committee 내 attestations 집계.<br />
          평균 16 aggregator per committee → 중복 확보.<br />
          BLS aggregation으로 N 서명 → 1 서명 (크기 N배 절약).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 BLS 집계</strong> — 같은 AttestationData를 가진 서명들의 BLS 서명을 합침.<br />
          N개 서명 → 1개 집계 서명 — 블록 크기 대폭 감소.<br />
          무작위 선정된 Aggregator가 서브넷 내 어테스테이션 수집 후 SubmitAggregateAndProof.
        </p>
      </div>
    </section>
  );
}
