import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SlashingProtection({ onCodeRef }: Props) {
  return (
    <section id="slashing-protection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">슬래싱 방지 DB</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validator-loop', codeRefs['validator-loop'])} />
          <span className="text-[10px] text-muted-foreground self-center">Run() — 슬래싱 체크 포함</span>
        </div>

        {/* ── Slashing 조건 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slashing 조건 — 2가지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Slashing 조건 (consensus spec):
// 1. Proposer Slashing: 같은 slot에 2개 다른 block 서명
// 2. Attester Slashing:
//    a. Double Vote: 같은 target epoch에 2개 다른 attestation
//    b. Surround Vote: 범위가 이전 투표를 감싸거나 감싸임

// Surround Vote 예시:
// Past: source=3, target=7 (range [3,7])
// Curr: source=5, target=9 (range [5,9])
// → past가 curr을 감쌈 (3<5 && 9<7 = FALSE, no surround)
//
// Past: source=3, target=10 (range [3,10])
// Curr: source=5, target=8 (range [5,8])
// → past가 curr을 감쌈 (3<5 && 8<10 = TRUE, surround!)

// 양방향 체크:
// - New attestation이 old를 감쌈
// - Old attestation이 new를 감쌈

// 슬래싱 페널티:
// - 초기: effective_balance / 64 (즉시, ~0.5 ETH from 32 ETH)
// - epoch offset 후: proportional multiplier 적용
// - 최소 1 ETH 손실 + exit 강제 + 1년 withdrawal 대기

// slashable validator의 stats (메인넷 이력):
// - ~400 slashing 발생 (2020-2025)
// - 대부분 validator 운영 실수 (dual setup, key migration)
// - 악의적 공격은 거의 없음`}
        </pre>
        <p className="leading-7">
          Slashing은 <strong>double-vote + surround-vote</strong> 2가지.<br />
          Surround vote: attestation range가 이전/이후와 겹치는 경우.<br />
          메인넷 실제 슬래싱 대부분 운영 실수 (dual setup).
        </p>

        {/* ── Slashing DB 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slashing Protection DB — 구현 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EIP-3076 compatible slashing protection DB
type SlashingProtectionDB struct {
    db *bolt.DB  // 독립 DB file
}

// 버킷 구조:
// pubkeys_bucket:
//   pubkey → ValidatorHistory
// ValidatorHistory:
//   - latest_signed_block_slot
//   - min_source_epoch
//   - max_target_epoch
//   - attestations (최근 ~1000개)

// 서명 전 체크:
func (db *SlashingDB) CheckAttestation(
    pubKey [48]byte,
    data *AttestationData,
) error {
    history := db.getHistory(pubKey)

    // 1. Min source check
    if data.Source.Epoch < history.min_source_epoch {
        return ErrSlashable  // source가 최소치보다 낮음
    }

    // 2. Max target check (double vote + old target)
    if data.Target.Epoch <= history.max_target_epoch {
        // 같은 target epoch인 경우 double vote 확인
        past := history.getAttestationAt(data.Target.Epoch)
        if past != nil && past.signingRoot != currentRoot {
            return ErrDoubleVote
        }
    }

    // 3. Surround check (pairwise)
    for _, past := range history.attestations {
        if past.source.epoch < data.Source.Epoch &&
           past.target.epoch > data.Target.Epoch {
            return ErrSurroundingVote  // past가 현재를 감쌈
        }
        if data.Source.Epoch < past.source.epoch &&
           data.Target.Epoch > past.target.epoch {
            return ErrSurroundedVote  // 현재가 past를 감쌈
        }
    }

    return nil  // safe
}

// 서명 후 저장:
func (db *SlashingDB) RecordAttestation(
    pubKey [48]byte,
    data *AttestationData,
    signingRoot [32]byte,
) error {
    return db.db.Update(func(tx *bolt.Tx) error {
        history := db.getHistory(pubKey)
        history.Add(data, signingRoot)

        // min/max 업데이트
        history.min_source_epoch = max(history.min_source_epoch, data.Source.Epoch)
        history.max_target_epoch = max(history.max_target_epoch, data.Target.Epoch)

        return history.Save(tx, pubKey)
    })
}

// 백업 중요성:
// - DB 손실 → 새 validator처럼 시작 → double-signing 위험
// - DB 항상 백업 필수 (클라우드 스토리지, RAID 등)
// - migration 시 EIP-3076 JSON export 먼저`}
        </pre>
        <p className="leading-7">
          <strong>Slashing Protection DB</strong>가 validator 안전의 핵심.<br />
          매 서명 전 surround-vote 양방향 체크 + double-vote 확인.<br />
          DB 손실 = 재서명 위험 → 백업 필수.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 서라운드 투표 방지</strong> — source/target 범위가 이전 투표를 감싸거나 감싸이면 슬래싱 대상.<br />
          서명 전에 SlashingProtectionDB 조회로 이중 투표 + 범위 교차 확인.<br />
          EIP-3076 교환 형식으로 검증자 이전 시 슬래싱 이력 JSON 이동.
        </p>
      </div>
    </section>
  );
}
