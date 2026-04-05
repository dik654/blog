import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PoolInclusion({ onCodeRef }: Props) {
  return (
    <section id="pool-inclusion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">풀 관리 & 블록 포함</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('attestation-pool', codeRefs['attestation-pool'])} />
          <span className="text-[10px] text-muted-foreground self-center">Pool + SaveAggregated</span>
        </div>

        {/* ── Attestation pool 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">AttestationPool — 집계 후보 관리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 attestation pool
// 유입된 attestations를 정리/집계/관리

type Pool struct {
    aggregatedLock sync.RWMutex
    unaggregatedLock sync.RWMutex

    aggregatedAttestations map[[32]byte]*Attestation  // 집계 완료
    unaggregatedAttestations map[[32]byte]*Attestation  // 단일 validator

    blockAttestations []*Attestation  // 블록 포함 대기
}

// 주요 연산:
// SaveAggregatedAttestation: 집계된 것 저장 (같은 data key로 병합)
// SaveUnaggregatedAttestation: 단일 저장
// AggregateUnaggregatedAttestations: 주기적 집계 (같은 data 묶기)
// AttestationsForInclusion: 블록 포함용 최적 선택

// 집계 알고리즘 (Boyer-Moore 기반):
// 같은 AttestationData끼리 묶되
// aggregation_bits가 "disjoint"인 것만 병합
// (동일 bit 있으면 병합 불가, 정당한 집계가 아님)

func (p *Pool) tryMerge(a, b *Attestation) (*Attestation, bool) {
    if a.Data.HashTreeRoot() != b.Data.HashTreeRoot() {
        return nil, false  // 다른 data
    }

    // bit overlap 체크
    if !a.AggregationBits.Disjoint(b.AggregationBits) {
        return nil, false  // 겹치는 validator
    }

    // 병합
    mergedBits := a.AggregationBits.Or(b.AggregationBits)
    mergedSig := bls.AggregatePublicKeys([]Signature{a.Signature, b.Signature})

    return &Attestation{
        AggregationBits: mergedBits,
        Data: a.Data,
        Signature: mergedSig,
    }, true
}`}
        </pre>
        <p className="leading-7">
          AttestationPool이 <strong>집계 후보 수집 & 병합</strong>.<br />
          aggregated/unaggregated 분리 관리 → efficient 선택.<br />
          disjoint bits check로 안전한 병합만 수행.
        </p>

        {/* ── 블록 포함 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Block Inclusion — 최대 128 aggregates</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 블록 proposer가 attestations 선택 (최대 128 per block)

// MAX_ATTESTATIONS = 128

func (p *Pool) AttestationsForInclusion(
    ctx context.Context,
    slot Slot,
) ([]*Attestation, error) {
    // 1. pool에서 후보 수집
    candidates := p.GetAllAttestations()

    // 2. 유효 필터링
    valid := []*Attestation{}
    for _, att := range candidates {
        // 슬롯 범위: slot - 32 <= att.slot < slot - 1
        if att.Data.Slot >= slot - SLOTS_PER_EPOCH &&
           att.Data.Slot < slot - 1 {
            valid = append(valid, att)
        }
    }

    // 3. Attestation score 계산
    //    - 집계된 validator 수 (bit count)
    //    - inclusion distance (낮을수록 좋음)
    //    - head/source/target vote 정확도
    type scored struct {
        att *Attestation
        score uint64
    }
    scores := []scored{}
    for _, att := range valid {
        s := att.AggregationBits.Count() * 1000  // validator 수 가중치
        s -= (slot - att.Data.Slot) * 100         // distance 감점
        scores = append(scores, scored{att, s})
    }

    // 4. Greedy 선택 (중복 bit 제외)
    sort.SliceStable(scores, func(i, j int) bool {
        return scores[i].score > scores[j].score
    })

    selected := []*Attestation{}
    coveredBits := bitfield.Bitlist{}
    for _, sc := range scores {
        // 이미 포함된 validator 제외
        newBits := sc.att.AggregationBits.Xor(coveredBits)
        if newBits.Count() == 0 { continue }

        selected = append(selected, sc.att)
        coveredBits = coveredBits.Or(sc.att.AggregationBits)

        if len(selected) >= 128 { break }
    }

    return selected, nil
}

// 보상 계산:
// - Proposer reward: 포함된 validator 수에 비례
// - Attester reward: head/source/target 정확도 × (1/inclusion_distance)
// - inclusion_distance 1: 최대 reward
// - inclusion_distance 32: 최소 reward (거의 제로)`}
        </pre>
        <p className="leading-7">
          Block proposer가 <strong>최대 128 aggregate 선택</strong>.<br />
          validator count + inclusion distance 점수화 → greedy 선택.<br />
          최신 + 많은 validator 집계된 attestation 우선 포함.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 포함 보상 구조</strong> — 제안자는 풀에서 최대 128개의 집계 어테스테이션을 선택.<br />
          inclusion distance가 1이면 최대 보상 — 최신 어테스테이션 우선 선택.<br />
          투표자는 head/source/target 정확도, 제안자는 포함 수에 비례 보상.
        </p>
      </div>
    </section>
  );
}
