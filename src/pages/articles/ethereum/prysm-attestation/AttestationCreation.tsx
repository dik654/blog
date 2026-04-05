import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function AttestationCreation({ onCodeRef }: Props) {
  return (
    <section id="attestation-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">생성 & 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('submit-attestation', codeRefs['submit-attestation'])} />
          <span className="text-[10px] text-muted-foreground self-center">SubmitAttestation()</span>
        </div>

        {/* ── validator attestation 생성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator 측 — attestation 생성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// validator/client/attest.go
func (v *validator) SubmitAttestation(
    ctx context.Context,
    slot Slot,
    pubKey [48]byte,
) error {
    // 1. Committee 정보 조회 (beacon-chain RPC)
    duty, err := v.duties.AttesterDuty(pubKey, slot)
    if err != nil { return err }

    // 2. AttestationData 조회
    //    head + source/target checkpoint 결정
    data, err := v.validatorClient.GetAttestationData(ctx, &GetAttestationDataRequest{
        Slot: slot,
        CommitteeIndex: duty.CommitteeIndex,
    })
    if err != nil { return err }

    // 3. Slashing protection 체크
    signingRoot := computeSigningRoot(data, domain)
    if err := v.slashingDB.CheckAttestationSafety(pubKey, signingRoot, data); err != nil {
        return err  // ⚠ slashing 위험 → 거부
    }

    // 4. BLS 서명 생성
    signature, err := v.keyManager.Sign(pubKey, signingRoot)
    if err != nil { return err }

    // 5. Aggregation bits 설정
    //    자기 committee 내 위치의 bit만 true
    aggregationBits := bitfield.NewBitlist(duty.CommitteeLength)
    aggregationBits.SetBitAt(duty.CommitteePosition, true)

    // 6. Attestation 구성
    attestation := &Attestation{
        AggregationBits: aggregationBits,
        Data: data,
        Signature: signature,
    }

    // 7. Slashing DB에 저장 (재서명 방지)
    v.slashingDB.SaveAttestation(pubKey, data)

    // 8. beacon-chain에 제출
    return v.validatorClient.ProposeAttestation(ctx, attestation)
}

// 타이밍:
// - slot 시작 + 4초 시점 수행
// - 4초는 block propagation 대기
// - 늦어도 slot 종료 전 (12초) 필수`}
        </pre>
        <p className="leading-7">
          Validator가 매 slot <strong>committee 내 자기 bit만 set</strong> → attestation 생성.<br />
          Slashing DB 체크 → BLS 서명 → beacon-chain 제출.<br />
          4초 타이밍으로 block propagation 대기 후 head 결정.
        </p>

        {/* ── Slashing protection DB ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slashing Protection — EIP-3076</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Slashing conditions (attestation):
// 1. Double vote: 같은 target epoch에 두 번 서명
// 2. Surround vote: source_a < source_b AND target_b < target_a

// Prysm의 slashing protection DB:
type SlashingProtectionDB struct {
    db *bolt.DB  // 독립 DB (validator 전용)
}

func (db *SlashingProtectionDB) CheckAttestationSafety(
    pubKey [48]byte,
    signingRoot [32]byte,
    data *AttestationData,
) error {
    // 1. DB에서 historical attestations 조회
    history := db.getAttestationHistory(pubKey)

    // 2. Double-vote 체크
    for _, past := range history {
        if past.TargetEpoch == data.Target.Epoch {
            if past.SigningRoot != signingRoot {
                return ErrDoubleVote  // ❌ slashable
            }
            return ErrAlreadySigned  // ✓ 동일 attestation 재서명
        }
    }

    // 3. Surrounded vote 체크
    for _, past := range history {
        // Past가 현재 attestation을 감쌈
        if past.SourceEpoch < data.Source.Epoch &&
           past.TargetEpoch > data.Target.Epoch {
            return ErrSurroundingVote  // ❌ slashable
        }
        // 현재가 past를 감쌈
        if data.Source.Epoch < past.SourceEpoch &&
           data.Target.Epoch > past.TargetEpoch {
            return ErrSurroundedVote  // ❌ slashable
        }
    }

    return nil  // 안전
}

// Import/Export 표준 (EIP-3076):
// - JSON 포맷으로 다른 클라이언트와 migration 가능
// - pubkey별 min_source_epoch, max_target_epoch 저장
// - client 교체 시 이 DB만 옮기면 안전

// 중요성:
// - slashing 당하면 최소 1 ETH 손실 + strike out
// - Protection DB 손실 시 validator 재시작 위험
// - 항상 백업 유지 필수`}
        </pre>
        <p className="leading-7">
          <strong>Slashing protection DB</strong>가 validator 안전의 핵심.<br />
          double-vote, surround-vote 2가지 slash 조건 사전 검증.<br />
          EIP-3076 포맷으로 client 간 이식 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 3중 투표 구조</strong> — Source(이전 justified), Target(현재 에폭), Head(헤드 블록).<br />
          슬래싱 방지 DB를 먼저 조회하여 이중 투표/서라운드 투표 차단.<br />
          서명 도메인은 DOMAIN_BEACON_ATTESTER 사용.
        </p>
      </div>
    </section>
  );
}
