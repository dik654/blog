import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function AttestationCreation({ onCodeRef }: Props) {
  return (
    <section id="attestation-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">생성 & 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("submit-attestation", codeRefs["submit-attestation"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            SubmitAttestation()
          </span>
        </div>

        {/* ── validator attestation 생성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Validator 측 — attestation 생성
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              SubmitAttestation 흐름 (attest.go)
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                1. <code>duties.AttesterDuty(pubKey, slot)</code> — committee
                정보 조회 (beacon-chain RPC)
              </p>
              <p>
                2. <code>GetAttestationData(slot, committeeIndex)</code> — head
                + source/target checkpoint 결정
              </p>
              <p>
                3.{" "}
                <code>
                  slashingDB.CheckAttestationSafety(pubKey, signingRoot, data)
                </code>{" "}
                — slashing 위험 시 거부
              </p>
              <p>
                4. <code>keyManager.Sign(pubKey, signingRoot)</code> — BLS 서명
                생성
              </p>
              <p>
                5. <code>bitfield.NewBitlist(committeeLength)</code> — 자기
                committee 내 위치의 bit만 true
              </p>
              <p>
                6.{" "}
                <code>
                  Attestation&#123;AggregationBits, Data, Signature&#125;
                </code>{" "}
                구성
              </p>
              <p>
                7. <code>slashingDB.SaveAttestation(pubKey, data)</code> —
                재서명 방지 기록
              </p>
              <p>
                8. <code>ProposeAttestation(ctx, attestation)</code> —
                beacon-chain에 제출
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">slot clock</p>
              <p className="text-foreground/50">genesis 기준 계산</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">
                attest interval
              </p>
              <p className="text-foreground/50">block 전파 대기</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">deadline</p>
              <p className="text-foreground/50">preset·클라이언트 설정</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Validator는 배정된 duty slot에{" "}
          <strong>committee 내 자기 bit만 set</strong>해 attestation을 만든다.
          먼저 slashing protection DB에서 서명 안전성을 확인하고 BLS 서명을
          만든 뒤 beacon node에 제출하며, 실행 시점은 slot duration과
          intervals-per-slot 설정을 기준으로 계산한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">고정 사례: reorg와 늦은 block이 겹친 slot</h3>
        <p className="leading-7">
          Root A에서 validator 9가 slot 35, committee 2, position 17 duty를
          받았다고 합시다. 서명 전에 dependent root가 B로 바뀌면 A의 duty와
          bit position을 폐기하고 B에서 assignment와 head·source·target을 다시
          구합니다. 같은 epoch라는 이유로 A의 cache를 재사용하면 안 됩니다.
        </p>
        <p className="leading-7">
          Expected block이 protocol due time 전에 도착하면 그때의 head를
          관찰하고, 그렇지 않으면 due time의 현재 view로 slashing check와
          signing intent 저장을 거쳐 한 번 서명합니다. 뒤늦게 더 좋은 head를
          받았더라도 같은 target epoch의 conflicting attestation을 다시
          서명하지 않습니다.
        </p>

        {/* ── Slashing protection DB ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Slashing Protection — EIP-3076
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              Slashing 조건 (attestation)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground/80">
              <div>
                <span className="font-semibold">Double vote</span> — 같은 target
                epoch에 두 번 서명
              </div>
              <div>
                <span className="font-semibold">Surround vote</span> —{" "}
                <code>source_a &lt; source_b AND target_b &lt; target_a</code>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              CheckAttestationSafety 흐름
            </p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>SlashingProtectionDB</code> — <code>db: *bolt.DB</code>{" "}
              (validator 전용 독립 DB)
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                1. <code>getAttestationHistory(pubKey)</code> — 과거 attestation
                조회
              </p>
              <p>
                2. <span className="font-semibold">Double-vote 체크</span> —
                같은 <code>TargetEpoch</code>에 다른 <code>SigningRoot</code>{" "}
                &rarr; <code>ErrDoubleVote</code>
              </p>
              <p>
                3. <span className="font-semibold">Surrounded vote 체크</span> —
                past가 현재를 감쌈 &rarr; <code>ErrSurroundingVote</code> /
                현재가 past를 감쌈 &rarr; <code>ErrSurroundedVote</code>
              </p>
              <p>
                4. 모두 통과 &rarr; <code>nil</code> (안전)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                EIP-3076 Import/Export
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>JSON 포맷으로 다른 클라이언트와 migration</p>
                <p>
                  pubkey별 <code>min_source_epoch</code>,{" "}
                  <code>max_target_epoch</code> 저장
                </p>
                <p>client 교체 시 이 DB만 옮기면 안전</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                중요성
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>
                  slashing은 초기 penalty, 상관 패널티, 강제 exit를 포함하며
                  금액은 상태·fork 규칙에 따라 달라짐
                </p>
                <p>Protection DB 손실 &rarr; validator 재시작 위험</p>
                <p>항상 백업 유지 필수</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Slashing protection DB</strong>는 double vote와 surround
          vote를 서명 전에 차단하는 validator의 핵심 안전장치다. EIP-3076
          형식으로 내보내고 가져올 수 있으므로 client를 교체할 때도 기존 서명
          이력을 이어갈 수 있다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 3중 투표 구조</strong> — Source(이전 justified),
          Target(현재 epoch), Head(선택한 head block)를 함께 담는다. 서명
          도메인은 <code>DOMAIN_BEACON_ATTESTER</code>를 사용하며, DB를 먼저
          조회해 이중 투표와 서라운드 투표를 막는다.
        </p>
      </div>
    </section>
  );
}
