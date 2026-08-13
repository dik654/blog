import ContextViz from "./viz/ContextViz";
import StateStructureViz from "./viz/StateStructureViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BeaconState는 consensus가 다음 slot을 계산하는 단일 상태다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>BeaconState</code>는 validator registry, balance, finality checkpoint와 execution payload header처럼 다음 slot을 계산하는 데 필요한 consensus state를 한 SSZ container에 모읍니다. 이 글에서는 먼저 protocol schema를 보고, Prysm이 큰 state를 매번 전부 복사하거나 다시 Merkleize하지 않기 위해 Copy-on-Write와 <code>FieldTrie</code>를 어디에 적용하는지 내려갑니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── BeaconState 필드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BeaconState — 포크별 SSZ 구조체
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">
                Versioning & History
              </p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>
                  <code>genesis_time</code>: <code>uint64</code>
                </li>
                <li>
                  <code>genesis_validators_root</code>: <code>Bytes32</code>
                </li>
                <li>
                  <code>slot</code>: <code>Slot</code>, <code>fork</code>:{" "}
                  <code>Fork</code>
                </li>
                <li>
                  <code>block_roots</code>:{" "}
                  <code>Vector[Bytes32, SLOTS_PER_HISTORICAL_ROOT]</code>
                </li>
                <li>
                  <code>state_roots</code>:{" "}
                  <code>Vector[Bytes32, SLOTS_PER_HISTORICAL_ROOT]</code>
                </li>
                <li>
                  <code>historical_roots / historical_summaries</code>: 포크별
                  이력 commitment
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">
                Registry (가장 큰 부분)
              </p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>
                  <code>validators</code>:{" "}
                  <code>{"List[Validator, 2^40]"}</code>
                </li>
                <li>
                  <code>balances</code>: <code>{"List[Gwei, 2^40]"}</code>
                </li>
                <li>
                  <code>previous/current_epoch_participation</code>
                </li>
                <li>
                  <code>inactivity_scores</code>:{" "}
                  <code>{"List[uint64, 2^40]"}</code>
                </li>
              </ul>
              <div className="mt-2 pt-2 border-t border-border/40">
                <p className="font-semibold text-xs text-foreground/70 mb-1">
                  기타 주요 필드
                </p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li>
                    <code>randao_mixes</code>:{" "}
                    <code>Vector[Bytes32, EPOCHS_PER_HISTORICAL_VECTOR]</code>
                  </li>
                  <li>
                    <code>current/next_sync_committee</code>:{" "}
                    <code>SyncCommittee</code>
                  </li>
                  <li>
                    <code>latest_execution_payload_header</code>
                  </li>
                  <li>
                    <code>finalized_checkpoint</code>: <code>Checkpoint</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              상태 크기를 결정하는 요소
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-sm text-center">
              <div>
                <p className="text-muted-foreground">registry</p>
                <p className="font-mono">validator 수</p>
              </div>
              <div>
                <p className="text-muted-foreground">balances</p>
                <p className="font-mono">entry 수</p>
              </div>
              <div>
                <p className="text-muted-foreground">participation</p>
                <p className="font-mono">fork 표현</p>
              </div>
              <div>
                <p className="text-muted-foreground">pending queues</p>
                <p className="font-mono">요청량</p>
              </div>
              <div>
                <p className="text-muted-foreground">history</p>
                <p className="font-mono">preset limits</p>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold">직렬화</p>
                <p className="font-mono font-semibold">현재 state 측정</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          BeaconState schema는 fork가 도입하는 consensus 기능에 맞춰 진화합니다. Registry와 balance 계열이 큰 비중을 차지하지만 실제 serialized size는 active validator 수와 fork별 pending queue에 따라 달라집니다. 어떤 schema를 쓰더라도 모든 client가 같은 transition 뒤 동일한 SSZ root를 계산해야 한다는 조건은 변하지 않습니다.
        </p>

        {/* ── Validator 구조체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Validator — registry entry 구조
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              Validator 구조체 (121 bytes, fixed-size)
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <ul className="space-y-0.5">
                <li>
                  <code>pubkey</code>: <code>BLSPubkey</code> (48B)
                </li>
                <li>
                  <code>withdrawal_credentials</code>: <code>Bytes32</code>{" "}
                  (32B)
                </li>
                <li>
                  <code>effective_balance</code>: <code>Gwei</code> (8B)
                </li>
                <li>
                  <code>slashed</code>: <code>bool</code> (1B)
                </li>
              </ul>
              <ul className="space-y-0.5">
                <li>
                  <code>activation_eligibility_epoch</code> (8B)
                </li>
                <li>
                  <code>activation_epoch</code> (8B)
                </li>
                <li>
                  <code>exit_epoch</code> (8B)
                </li>
                <li>
                  <code>withdrawable_epoch</code> (8B)
                </li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">
              Validator lifecycle (9단계)
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center text-muted-foreground">
              <div className="rounded bg-muted/50 p-1.5"><span className="block font-mono">PENDING_INITIALIZED</span><span className="mt-1 block">deposit 처리</span></div>
              <div className="rounded bg-muted/50 p-1.5"><span className="block font-mono">PENDING_QUEUED</span><span className="mt-1 block">activation queue</span></div>
              <div className="rounded bg-green-500/10 p-1.5"><span className="block font-mono">ACTIVE_ONGOING</span><span className="mt-1 block">정상 참여</span></div>
              <div className="rounded bg-amber-500/10 p-1.5"><span className="block font-mono">ACTIVE_EXITING</span><span className="mt-1 block">exit 대기</span></div>
              <div className="rounded bg-red-500/10 p-1.5"><span className="block font-mono">ACTIVE_SLASHED</span><span className="mt-1 block">slashing 후 exit</span></div>
              <div className="rounded bg-muted/50 p-1.5"><span className="block font-mono">EXITED_UNSLASHED</span><span className="mt-1 block">withdrawal 대기</span></div>
              <div className="rounded bg-red-500/10 p-1.5"><span className="block font-mono">EXITED_SLASHED</span><span className="mt-1 block">slashed exit</span></div>
              <div className="rounded bg-muted/50 p-1.5"><span className="block font-mono">WITHDRAWAL_POSSIBLE</span><span className="mt-1 block">출금 가능</span></div>
              <div className="rounded bg-muted/50 p-1.5"><span className="block font-mono">WITHDRAWAL_DONE</span><span className="mt-1 block">출금 완료</span></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              상태 결정:{" "}
              <code>{"epoch >= activation_epoch && epoch < exit_epoch"}</code>{" "}
              &rarr; ACTIVE
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              주요 필드 의미
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code>withdrawal_credentials</code>: BLS, execution address,
                compounding 등 prefix별 처리 규칙이 다름
              </li>
              <li>
                <code>effective_balance</code>: hysteresis와 balance increment,
                fork별 최대값을 적용해 실제 balance 변동을 완충
              </li>
            </ul>
          </div>
        </div>
        <p>
          Validator entry는 SSZ에서 121-byte fixed-size object이며 lifecycle은 별도의 enum을 저장하는 대신 activation·exit·withdrawable epoch와 <code>slashed</code> flag의 조합으로 계산합니다. <code>effective_balance</code>는 실제 balance가 조금 움직일 때마다 바뀌지 않도록 hysteresis를 적용하므로, committee weight와 state root가 불필요하게 흔들리는 일을 줄입니다.
        </p>

        {/* ── state 변경 패턴 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          State 변경 패턴 — 매 슬롯의 업데이트
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-blue-500/30 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">
                Slot transition (매 슬롯)
              </p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>
                  <code>slot</code> (+1)
                </li>
                <li>
                  <code>state_roots[slot % SLOTS_PER_HISTORICAL_ROOT]</code>
                </li>
                <li>
                  <code>block_roots[slot % SLOTS_PER_HISTORICAL_ROOT]</code>
                </li>
                <li>경계에서 포크별 historical commitment</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">
                Block processing
              </p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>
                  <code>latest_block_header</code>
                </li>
                <li>
                  <code>randao_mixes[epoch % 65536]</code>
                </li>
                <li>
                  <code>eth1_data_votes</code>
                </li>
                <li>
                  <code>validators</code>, <code>balances</code>
                </li>
                <li>
                  <code>participation</code>
                </li>
                <li>
                  <code>justification_bits</code>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">
                Epoch transition (매 32 슬롯)
              </p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>participation 교대</li>
                <li>validators 보상/페널티</li>
                <li>balances reward 지급</li>
                <li>slashings, randao_mixes</li>
                <li>inactivity_scores</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">
              Incremental hashing이 보는 범위
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div>
                <p className="text-muted-foreground">변경 필드</p>
                <p className="font-mono">transition별 dirty field</p>
              </div>
              <div>
                <p className="text-muted-foreground">변경 validator</p>
                <p className="font-mono">참여·registry update 범위</p>
              </div>
              <div>
                <p className="text-muted-foreground">전체 대비</p>
                <p className="font-mono font-semibold">fixture에서 측정</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              변경된 chunk에서 root까지의 branch만 다시 hash
            </p>
          </div>
        </div>
        <p>
          대부분의 slot transition은 BeaconState 전체가 아니라 일부 field와 collection entry만 바꿉니다. Prysm의 <code>FieldTrie</code>는 이 locality를 이용해 변경된 leaf에서 root까지의 Merkle branch만 다시 계산합니다. 비용은 엄밀히 O(1)이라고 단정하기보다 변경된 chunk 수와 tree depth에 비례하며, full re-merkleization보다 훨씬 작은 범위로 제한된다고 이해하는 편이 정확합니다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <StateStructureViz />
      </div>
    </section>
  );
}
