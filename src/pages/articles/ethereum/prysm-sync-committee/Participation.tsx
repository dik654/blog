import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Participation({ onCodeRef }: Props) {
  return (
    <section id="participation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">위원회 참여 & 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('submit-sync-msg', codeRefs['submit-sync-msg'])} />
          <span className="text-[10px] text-muted-foreground self-center">SubmitSyncCommitteeMessage()</span>
        </div>

        {/* ── Committee 선정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Sync Committee 선정 알고리즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sync committee 선정 (매 256 epochs)

func getNextSyncCommittee(state *BeaconState) *SyncCommittee {
    // 1. 현재 epoch + 256 epoch 후의 committee 계산
    //    (미리 알려짐 → validator 준비 가능)
    epoch := getCurrentEpoch(state) + EPOCHS_PER_SYNC_COMMITTEE_PERIOD  // 256

    // 2. Seed 생성 (RANDAO 기반)
    seed := getSeed(state, epoch, DOMAIN_SYNC_COMMITTEE)

    // 3. 512명 무작위 선정 (effective_balance 가중)
    indices := []ValidatorIndex{}
    i := 0
    activeIndices := getActiveValidatorIndices(state, epoch)

    for len(indices) < SYNC_COMMITTEE_SIZE {  // 512
        // 효율 가중 선정
        randomByte := hash(seed || (i/32).toBytes())[i%32]
        candidate := activeIndices[i * len(activeIndices) / 2^24 % len(activeIndices)]
        effectiveBalance := state.Validators[candidate].EffectiveBalance

        if effectiveBalance * 255 >= MAX_EFFECTIVE_BALANCE * randomByte {
            indices = append(indices, candidate)
        }
        i++
    }

    // 4. Committee 구성
    pubkeys := []BLSPubkey{}
    for _, idx := range indices {
        pubkeys = append(pubkeys, state.Validators[idx].Pubkey)
    }
    aggregatePubkey := bls.Aggregate(pubkeys)

    return &SyncCommittee{
        Pubkeys: pubkeys,
        AggregatePubkey: aggregatePubkey,
    }
}

// 특성:
// - effective_balance 32 ETH = 100% selection probability
// - 낮은 balance = 낮은 probability
// - 중복 선정 허용 (같은 validator가 여러 slot에 선정 가능)
// - 메인넷 1M validator → 개별 validator 선정 확률 ~0.05% per period`}
        </pre>
        <p className="leading-7">
          Sync committee는 <strong>effective_balance 가중 무작위 선정</strong>.<br />
          512명 중복 허용 → 같은 validator 여러 번 선정 가능.<br />
          validator당 ~0.05% 확률 per 27시간.
        </p>

        {/* ── SyncCommitteeMessage ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">매 slot SyncCommitteeMessage 서명</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 선정된 validator는 매 slot에 block_root에 서명

func (v *validator) SubmitSyncCommitteeMessage(
    ctx context.Context,
    slot Slot,
) error {
    // 1. committee 멤버인지 확인
    subnets, err := v.getSyncCommitteeSubnets(slot)
    if err != nil { return err }
    if len(subnets) == 0 { return nil }  // 이번 period에 참여 안 함

    // 2. 현재 head block_root 조회
    head, err := v.validatorClient.GetHead(ctx)
    if err != nil { return err }

    // 3. 서명 (domain=DOMAIN_SYNC_COMMITTEE)
    signingRoot := computeSigningRoot(head.Root, getDomain(DOMAIN_SYNC_COMMITTEE, epoch))
    signature, err := v.keyManager.Sign(v.pubkey, signingRoot)
    if err != nil { return err }

    // 4. SyncCommitteeMessage 생성 (각 subnet별로)
    for _, subnet := range subnets {
        msg := &SyncCommitteeMessage{
            Slot: slot,
            BeaconBlockRoot: head.Root,
            ValidatorIndex: v.validatorIndex,
            Signature: signature,
        }

        // 5. subnet topic에 방송
        topic := fmt.Sprintf("sync_committee_%d", subnet)
        v.pubsub.Publish(topic, msg)
    }

    return nil
}

// Domain 분리:
// DOMAIN_SYNC_COMMITTEE 사용 (DOMAIN_BEACON_ATTESTER와 다름)
// → 같은 block_root에 대해 validator가
//   attestation + sync committee 서명 2개 생성 (독립적)
// → 서로 간섭 없음

// 보상:
// - 올바른 서명: base_reward_per_increment × validator effective_balance
// - 미참여: 동일 금액 패널티
// - 참여 인센티브로 높은 참여율 유지`}
        </pre>
        <p className="leading-7">
          Committee 멤버는 <strong>매 slot head block에 서명</strong>.<br />
          DOMAIN_SYNC_COMMITTEE로 attestation과 구분.<br />
          4개 subnet에 방송 → aggregator가 수집 → block에 포함.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 서명 도메인 분리</strong> — DomainSyncCommittee는 어테스테이션(DOMAIN_BEACON_ATTESTER)과 다른 도메인.<br />
          같은 블록 루트에 대해 두 가지 서명이 생성되지만 도메인이 달라 충돌하지 않음.<br />
          256에폭(~27시간) 주기로 위원회 교체 — 중복 선정 허용.
        </p>
      </div>
    </section>
  );
}
