import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function DutyAssignment({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="duty-assignment" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        Slot clock은 저장된 duty를 마감이 있는 작업으로 바꿉니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Validator는 매 slot마다 proposer·attester·aggregator를 모두 수행하지
          않습니다. Beacon node에서 받은 epoch duty를 store에 보관해 두고,
          <code>RolesAt</code>이 현재 slot과 일치하는 역할만 꺼냅니다. V37의
          attester slot이 100이라면 slot 99에는 아무 attestation도 만들지 않고,
          slot 100에만 <code>SubmitAttestation</code>을 실행합니다.
        </p>
        <p>
          Prysm runner는 새 slot을 받을 때 next-slot start를 deadline으로 둔
          context를 만듭니다. Epoch 첫 slot이면 duty를 갱신하고, 저장된 역할을
          계산한 뒤 역할별 goroutine을 시작합니다. 이 context가 끝나면 오래된
          network call도 취소될 수 있으므로 slot 100 작업이 slot 101까지 끝없이
          남는 것을 막습니다.
        </p>
      </div>

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("slot-runner", codeRefs["slot-runner"])}
        />
        <CodeViewButton
          onClick={() => onCodeRef("roles-at", codeRefs["roles-at"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          Slot deadline과 저장된 duty의 역할 선택 원문
        </span>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Attester는 왜 slot 시작 즉시 head를 고정하지 않을까요?</h3>
        <p>
          너무 빨리 head를 고르면 이번 slot의 정상 block이 도착하기 전에 이전
          head에 투표할 수 있습니다. 반대로 block을 무한정 기다리면 attestation
          전파 시기를 놓칩니다. 그래서 규격은 “현재 slot의 유효한 block을
          관찰한 때”와 “attestation due time” 중 먼저 온 시점에 진행하게 합니다.
        </p>

        <ExplainedFormula
          question="Pre-Gloas mainnet 설정에서 3333 BPS는 slot 시작 몇 초 뒤일까요?"
          idea={<>Basis point는 10,000분의 1입니다. Prysm은 slot 길이를 millisecond로 바꾼 뒤 3333을 곱하고 정수 나눗셈을 합니다.</>}
          formula={String.raw`t_{due}=12{,}000\,\mathrm{ms}\times\frac{3333}{10{,}000}=3999\,\mathrm{ms}`}
          annotatedFormula={String.raw`t_{due}=\underbrace{12{,}000\,\mathrm{ms}}_{\text{slot 길이}}\times\frac{\underbrace{3333}_{\text{due BPS}}}{\underbrace{10{,}000}_{\text{1 slot}}}=\underbrace{3999\,\mathrm{ms}}_{\text{정수 ms 계산 결과}}`}
          operations={[
            {
              expression: String.raw`12{,}000\times3333=39{,}996{,}000`,
              annotation: [
                "12초를 12,000ms로 바꿉니다.",
                "Due 비율 3333을 곱합니다.",
              ],
            },
            {
              expression: String.raw`39{,}996{,}000/10{,}000=3999`,
              annotation: [
                "Prysm 구현은 uint64 정수 나눗셈을 사용합니다.",
                "그래서 실수식 3999.6ms가 아니라 3999ms duration이 됩니다.",
              ],
            },
          ]}
          terms={[
            { symbol: String.raw`12{,}000\,\mathrm{ms}`, name: "slot duration", description: "이 fixture에서 사용한 mainnet slot 길이입니다." },
            { symbol: "3333", name: "attestation due BPS", description: "Pre-Gloas mainnet 설정의 slot 내 due 비율입니다." },
            { symbol: "10{,}000", name: "basis-point denominator", description: "한 slot 전체를 나타내는 10,000 basis points입니다." },
            { symbol: String.raw`3999\,\mathrm{ms}`, name: "due duration", description: "Prysm의 millisecond 정수 계산으로 얻은 slot 시작 뒤 대기 상한입니다." },
          ]}
          assumptions={[
            "Pre-Gloas mainnet의 12초 slot과 AttestationDueBPS=3333을 사용합니다.",
            "Gloas에서는 이 pinned 설정의 due BPS가 2500으로 바뀌므로 같은 3999ms를 쓰지 않습니다.",
            "Slot 100의 유효한 block을 더 일찍 관찰하면 3999ms를 채우지 않고 즉시 진행할 수 있습니다.",
          ]}
          interpretation="이 값은 ‘항상 3.999초를 쉰다’는 뜻이 아닙니다. 유효한 현재-slot block 관찰과 3999ms timer 가운데 먼저 발생한 사건이 대기를 끝냅니다."
        />

        <div className="not-prose my-5 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef("attestation-wait", codeRefs["attestation-wait"])
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            Valid block 또는 due time 중 먼저 온 사건을 기다리는 원문
          </span>
        </div>

        <h3>Duty receipt는 “왜 놓쳤는지”를 분리해 줍니다</h3>
        <p>
          관측에는 epoch와 dependent root, validator index·public key, role, slot,
          committee, duty revision을 남깁니다.
        </p>
        <p>
          실행에는 slot tick 시각, 유효 block 관찰 시각, attestation data 수신,
          signer 응답, DB 저장, submit 결과를 이어 붙입니다. 그래야 duty 자체가
          없었던 경우와 stale duty, beacon-node 지연, signer timeout, DB 오류,
          submit 실패를 서로 다른 원인으로 셀 수 있습니다.
        </p>
        <aside className="not-prose mt-5 border-l-2 border-amber-500/60 bg-amber-500/5 p-4 text-sm leading-6">
          <strong>여기까지 확정된 것:</strong> V37이 slot 100에 실행할 attester
          역할과 그 작업의 시간 경계가 정해졌습니다. Head root, signing root,
          signature와 DB 허용 여부는 아직 정해지지 않았습니다.
        </aside>
      </div>
    </section>
  );
}
