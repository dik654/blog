import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function CheckpointManagement({ onCodeRef }: Props) {
  return (
    <section id="checkpoint-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("update-justified", codeRefs["update-justified"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            UpdateJustifiedCheckpoint()
          </span>
        </div>

        {/* ── Checkpoint 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Checkpoint — epoch boundary block
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Checkpoint 구조체
            </div>
            <div className="text-sm space-y-1">
              <div>
                <code>Checkpoint.Epoch</code> — epoch 번호
              </div>
              <div>
                <code>Checkpoint.Root</code> — epoch 시작 slot의{" "}
                <code>block_root</code>
              </div>
              <div className="text-muted-foreground mt-1">
                slot이 비어있으면 가장 최근 블록의 root 사용
              </div>
              <div className="text-muted-foreground">
                <code>epoch = slot / SLOTS_PER_EPOCH (32)</code>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              주요 Checkpoint 종류
            </div>
            <ul className="text-sm space-y-1">
              <li>
                <code>genesis_checkpoint</code> — Epoch=0, Root=genesis
              </li>
              <li>
                <code>previous_justified_checkpoint</code> — 이전 justified
              </li>
              <li>
                <code>current_justified_checkpoint</code> — 현재 justified
              </li>
              <li>
                <code>finalized_checkpoint</code> — finalized (가장 중요)
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              AttestationData — 2-round voting
            </div>
            <div className="text-sm space-y-1">
              <div>
                <code>source: Checkpoint</code> — 출발 (이미 justified)
              </div>
              <div>
                <code>target: Checkpoint</code> — 목표 (이번 epoch justify 대상)
              </div>
              <div className="text-muted-foreground mt-1">
                validator가 (source, target) 쌍에 서명
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 mb-2">
              슬래싱 조건
            </div>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Surrounded vote</strong> — 한 attestation이 다른 것을
                "감쌈" (
                <code>source_a &lt;= source_b AND target_b &lt; target_a</code>)
              </li>
              <li>
                <strong>Double vote</strong> — 같은 target epoch에 두 번 서명
              </li>
            </ul>
          </div>
        </div>
        <p>
          Checkpoint는 <code>(epoch, root)</code> pair로 epoch boundary의 canonical block root를 가리킵니다. Boundary slot이 skipped되었다면 root는 그 시점의 latest block을 가리키며, Casper FFG attestation은 source와 target을 모두 checkpoint로 표현합니다.
        </p>

        {/* ── UpdateJustifiedCheckpoint ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          UpdateJustifiedCheckpoint — 안전 조건 체크
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              UpdateJustifiedCheckpoint 처리 흐름
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                <code>s.lock.Lock()</code> — 동시성 보호
              </li>
              <li>
                퇴행 방지: <code>newJustified.Epoch &lt; current.Epoch</code> →{" "}
                <code>ErrInvalidJustifiedCheckpoint</code>
              </li>
              <li>
                충돌 방지: 같은 epoch인데 다른 root →{" "}
                <code>ErrConflictingCheckpoint</code>
              </li>
              <li>
                <code>prevJustified = current</code> →{" "}
                <code>current = newJustified</code>
              </li>
              <li>
                <code>forkChoice.UpdateJustifiedCheckpoint()</code> — store 전달
              </li>
              <li>
                <code>beaconDB.SaveJustifiedCheckpoint()</code> — DB 영구 저장
              </li>
              <li>
                <code>eventFeed.Send(&amp;JustifiedEvent)</code> — RPC
                subscribers 알림
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="text-xs font-semibold text-amber-400 mb-2">
              안전 불변식
            </div>
            <ul className="text-sm space-y-1">
              <li>
                <code>justified_epoch</code>은 단조 증가만 허용
              </li>
              <li>같은 epoch에는 같은 root만 허용</li>
              <li>모든 노드가 동일 sequence를 봄 (consensus)</li>
            </ul>
          </div>
        </div>
        <p>
          <code>UpdateJustifiedCheckpoint</code> 계열 경계는 checkpoint epoch가 뒤로 가지 않게 하고 같은 epoch의 conflicting root를 함부로 덮어쓰지 않도록 합니다. Accepted update는 fork-choice viability, database record와 event feed에 전달되므로 이 세 consumer가 같은 root를 보도록 atomicity와 ordering이 중요합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 Checkpoint = Epoch + Root</strong> — 에폭 경계의 첫 슬롯
          block root를 가리킵니다. Total active balance의 3분의 2를 넘는 source-target link가 justification 근거가 되며, validator가 같은 target epoch에 서로 다른 vote를 내면 double-vote slashing condition에 해당합니다.
        </p>
      </div>
    </section>
  );
}
