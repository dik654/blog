import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Operations({ onCodeRef }: Props) {
  return (
    <section id="operations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">오퍼레이션 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("process-operations", codeRefs["process-operations"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            ProcessOperations()
          </span>
        </div>

        {/* ── 5가지 operations ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          5가지 Operations — 고정 순서 처리
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-3">
              BeaconBlockBody Operations 필드
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <div>
                  <code className="text-sky-300">
                    proposer_slashings: List[ProposerSlashing, 16]
                  </code>
                </div>
                <div>
                  <code className="text-sky-300">
                    attester_slashings: List[AttesterSlashing, 2]
                  </code>
                </div>
                <div>
                  <code className="text-sky-300">
                    attestations: List[Attestation, 128]
                  </code>
                </div>
                <div>
                  <code className="text-sky-300">
                    deposits: List[Deposit, 16]
                  </code>
                </div>
                <div>
                  <code className="text-sky-300">
                    voluntary_exits: List[VoluntaryExit, 16]
                  </code>
                </div>
              </div>
              <div className="space-y-1 text-foreground/60">
                <div>
                  <code>bls_to_execution_changes: List[..., 16]</code>{" "}
                  <span>(Capella+)</span>
                </div>
                <div>
                  <code>sync_aggregate: SyncAggregate</code>{" "}
                  <span>(Altair+)</span>
                </div>
                <div>
                  <code>execution_payload: ExecutionPayload</code>{" "}
                  <span>(Bellatrix+)</span>
                </div>
                <div>
                  <code>blob_kzg_commitments: List[..., 6]</code>{" "}
                  <span>(Deneb+)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">
              <code>ProcessOperations(state, body)</code> — 고정 순서
            </p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                {
                  step: "1",
                  label: "Slashings 먼저",
                  detail:
                    "proposer/attester slashing 처리 → exit queue 결정에 영향",
                  color: "text-red-400",
                },
                {
                  step: "2",
                  label: "Attestations",
                  detail:
                    "processAttestation — participation flag 설정 (보상 계산 기반)",
                  color: "text-sky-400",
                },
                {
                  step: "3",
                  label: "Deposits",
                  detail:
                    "processDeposit — eth1_data.deposit_count 순서, 새 validator 등록",
                  color: "text-emerald-400",
                },
                {
                  step: "4",
                  label: "Voluntary exits",
                  detail: "processVoluntaryExit — validator 자발적 이탈",
                  color: "text-amber-400",
                },
                {
                  step: "5",
                  label: "BLS to execution changes",
                  detail: "processBlsToExecutionChange (Capella+)",
                  color: "text-violet-400",
                },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-muted shrink-0 ${s.color}`}
                  >
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">
                      {s.label}
                    </p>
                    <p className="text-foreground/60">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-1">
              순서가 중요한 이유
            </p>
            <p className="text-xs text-foreground/70">
              slashing이 먼저 → exit queue 결정에 반영 / attestation 먼저 →
              participation flag 설정 후 reward 계산 / deposit은 activation
              queue로 대기
            </p>
          </div>
        </div>
        <p>
          Beacon block operation은 specification이 정한 순서로 처리됩니다. Proposer slashing, attester slashing, attestation, deposit, voluntary exit와 BLS-to-execution change가 기본 흐름을 이루고, newer fork는 execution request 같은 operation을 추가합니다. 순서와 지원 목록은 fork별 state-transition function을 따라야 모든 client가 같은 post-state를 계산합니다.
        </p>

        {/* ── Attestation 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Attestation 처리 — 핵심 연산
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">
              <code>processAttestation(state, att)</code>
            </p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                {
                  step: "1",
                  label: "Slot 범위 검증",
                  detail: "data.Slot + SLOTS_PER_EPOCH 범위 내인지 확인",
                },
                {
                  step: "2",
                  label: "Target epoch 검증",
                  detail:
                    "target.Root == blockRootAtSlot(epochStart(target.Epoch))",
                },
                {
                  step: "3",
                  label: "Participating validators 조회",
                  detail:
                    "getBeaconCommittee → AggregationBits에서 참여자 index 추출",
                },
                {
                  step: "4",
                  label: "집계 서명 검증",
                  detail:
                    "bls.FastAggregateVerify(pubkeys, signing_root, att.Signature)",
                },
                {
                  step: "5",
                  label: "Participation flag 업데이트",
                  detail:
                    "TIMELY_SOURCE | TIMELY_TARGET | TIMELY_HEAD 비트 설정 (Altair+)",
                },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">
                      {s.label}
                    </p>
                    <p className="text-foreground/60">
                      <code>{s.detail}</code>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p>
          Attestation processing은 committee membership, target·source checkpoint, inclusion condition와 aggregate signature를 검증한 뒤 participation flag를 갱신합니다. Block별 비중은 included operation 수와 fork에 따라 달라지므로 항상 “대부분”이라고 단정하기보다 signature batch와 state update를 profile해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>Operation order는 fork-aware합니다.</strong> Slashing은 attestation보다 먼저 적용되며 deposit과 exit, key change와 fork별 request가 정해진 순서로 뒤따릅니다. 각 operation의 list limit과 validation rule도 active fork schema에서 읽어야 합니다.
        </p>
      </div>
    </section>
  );
}
