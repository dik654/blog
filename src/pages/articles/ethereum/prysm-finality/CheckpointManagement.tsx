import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function CheckpointManagement({ onCodeRef }: Props) {
  return (
    <section id="checkpoint-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('update-justified', codeRefs['update-justified'])} />
          <span className="text-[10px] text-muted-foreground self-center">UpdateJustifiedCheckpoint()</span>
        </div>

        {/* ── Checkpoint 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Checkpoint — epoch boundary block</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Checkpoint: (epoch, block_root) 쌍
type Checkpoint struct {
    Epoch Epoch    // epoch 번호
    Root Root       // epoch 시작 slot의 block_root
}

// Epoch boundary block:
// 각 epoch의 첫 slot의 block_root
// 또는 그 slot이 비어있으면 가장 최근 블록

// compute_epoch_at_slot 공식:
// epoch = slot / SLOTS_PER_EPOCH (32)
//
// epoch 0: slots 0~31
// epoch 1: slots 32~63
// epoch 2: slots 64~95

// 중요한 checkpoint들:
// - genesis_checkpoint: Epoch=0, Root=genesis
// - previous_justified_checkpoint: 이전 justified
// - current_justified_checkpoint: 현재 justified
// - finalized_checkpoint: finalized (가장 중요)

// Attestation의 checkpoint:
struct AttestationData {
    slot: Slot,
    index: CommitteeIndex,
    beacon_block_root: Root,
    source: Checkpoint,  // 출발 checkpoint (justified)
    target: Checkpoint,  // 목표 checkpoint (vote 대상)
}

// 2-round voting:
// validator가 (source, target) 쌍에 서명
// source는 이미 justified (또는 finalized)
// target은 이번 epoch justify 대상

// 슬래싱 조건:
// 1. Surrounded vote: 한 attestation이 다른 것을 "감쌈"
//    (source_a <= source_b AND target_b < target_a)
// 2. Double vote: 같은 target epoch에 두 번 서명`}
        </pre>
        <p className="leading-7">
          Checkpoint = <strong>epoch 경계 block의 reference</strong>.<br />
          (epoch, root) 쌍으로 specific block 식별.<br />
          Attestation의 source/target이 모두 checkpoint.
        </p>

        {/* ── UpdateJustifiedCheckpoint ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">UpdateJustifiedCheckpoint — 안전 조건 체크</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 justified checkpoint 갱신
// 모든 노드가 동일 시점에 업데이트되도록 careful

func (s *Service) UpdateJustifiedCheckpoint(
    ctx context.Context,
    newJustified Checkpoint,
) error {
    s.lock.Lock()
    defer s.lock.Unlock()

    // 1. 퇴행 방지: 새 값의 epoch이 기존보다 크거나 같아야
    if newJustified.Epoch < s.currentJustifiedCheckpoint.Epoch {
        return ErrInvalidJustifiedCheckpoint
    }

    // 2. 같은 epoch인데 root가 다르면 거부
    //    (불가능해야 함, 하지만 안전 체크)
    if newJustified.Epoch == s.currentJustifiedCheckpoint.Epoch &&
       newJustified.Root != s.currentJustifiedCheckpoint.Root {
        return ErrConflictingCheckpoint
    }

    // 3. 이전 justified를 previous로 이동
    s.prevJustifiedCheckpoint = s.currentJustifiedCheckpoint
    s.currentJustifiedCheckpoint = newJustified

    // 4. Fork choice store에 전달
    s.forkChoice.UpdateJustifiedCheckpoint(newJustified)

    // 5. DB에 영구 저장
    s.beaconDB.SaveJustifiedCheckpoint(newJustified)

    // 6. Event 발행 (RPC subscribers)
    s.eventFeed.Send(&JustifiedEvent{Checkpoint: newJustified})

    return nil
}

// 안전 불변식:
// - justified_epoch은 단조 증가
// - 같은 epoch의 같은 root만 허용
// - 모든 노드가 동일 sequence를 봄 (consensus)`}
        </pre>
        <p className="leading-7">
          <code>UpdateJustifiedCheckpoint</code>가 <strong>단조 증가 불변식 유지</strong>.<br />
          epoch 퇴행 금지 + 같은 epoch 다른 root 거부.<br />
          fork choice + DB + event feed 연쇄 업데이트.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Checkpoint = Epoch + Root</strong> — 에폭 경계의 첫 슬롯 블록을 가리킴.<br />
          전체 활성 밸런스의 2/3 이상이 같은 타겟에 투표하면 justified.<br />
          같은 에폭에서 두 번 투표하면 슬래싱 대상 — 이중 투표 방지.
        </p>
      </div>
    </section>
  );
}
