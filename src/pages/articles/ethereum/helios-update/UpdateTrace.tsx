import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function UpdateTrace({
  title,
  onCodeRef,
}: Props & { title: string }) {
  return (
    <section id="store-transition" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>

      <div
        id="candidate-state"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>먼저 후보와 참여 최댓값을 기록합니다</h3>
        <p>
          <code>best_valid_update</code>가 비어 있으면 <code>u-8193</code>을
          저장합니다. 기존 후보가 있다면 <code>is_better_update</code>의
          순서로 비교합니다. 같은 함수에서 현재 period의 최대 참여 수를
          <code>max(기존값, 이번 참여 수)</code>로 갱신합니다.
        </p>
        <p>
          이 두 변경은 full finality 적용보다 먼저 일어납니다. 2/3에 못 미친
          update라도 검증을 통과했다면 더 나은 후보로 남을 수 있고, 이후
          optimistic threshold나 장기 정체 시의 force update가 이 누적 상태를
          읽습니다.
        </p>
      </div>

      <div id="optimistic-transition" className="scroll-mt-24">
        <ExplainedFormula
          question="왜 342개 참여로 optimistic header가 먼저 전진할까요?"
          idea="Helios는 이전·현재 period에서 관측한 최대 참여 수의 절반을 safety threshold로 사용합니다. 이번 참여가 그 값보다 크고 attested slot이 더 새로워야 합니다."
          formula={String.raw`q_{safe}=\left\lfloor\frac{\max(p_{prev},p_{cur})}{2}\right\rfloor,\qquad p_u>q_{safe}\;\land\;s_a>s_o`}
          annotatedFormula={String.raw`q_{safe}=\left\lfloor\frac{\max(380,400)}{2}\right\rfloor=200,\qquad \underbrace{342>200}_{\text{참여 조건}}\;\land\;\underbrace{8192>8191}_{\text{새 header}}`}
          operations={[
            {
              expression: String.raw`\max(380,400)/2=200`,
              annotation: [
                "이전·현재 period의 최대 참여 중 큰 값을 고릅니다",
                "정수 나눗셈으로 절반인 200을 만듭니다",
                "2/3 finality 기준과 다른 문턱입니다",
              ],
            },
            {
              expression: String.raw`342>200\;\land\;8192>8191`,
              annotation: [
                "이번 참여가 safety threshold를 넘고",
                "attested slot도 현재 optimistic보다 새롭습니다",
                "두 조건이 모두 참이므로 8,192로 전진합니다",
              ],
            },
          ]}
          terms={[
            { symbol: "p_{prev}", name: "이전 period 최대 참여", description: "직전 sync-committee period에서 관측한 가장 큰 active-position 수" },
            { symbol: "p_{cur}", name: "현재 period 최대 참여", description: "현재 period에서 지금까지 관측한 가장 큰 active-position 수" },
            { symbol: "p_u", name: "이번 update 참여", description: "u-8193의 sync_committee_bits에서 1인 position 수, 예시는 342" },
            { symbol: "s_a", name: "Attested slot", description: "이번 update가 제시한 빠른 head의 slot, 예시는 8,192" },
            { symbol: "s_o", name: "현재 optimistic slot", description: "적용 전 Store의 빠른 head slot, 예시는 8,191" },
          ]}
          assumptions={[
            "u-8193은 부모 글의 context·branch·signature 검증을 이미 통과했습니다.",
            "380·400은 상태 전이를 설명하기 위한 Store fixture이며 mainnet 측정값이 아닙니다.",
            "Optimistic 전진은 finalized 전진이나 execution validity 전체를 뜻하지 않습니다.",
          ]}
          interpretation="342는 safety threshold 200보다 크고 attested slot 8,192도 더 새롭습니다. 따라서 optimistic header는 전진할 수 있습니다. 같은 update가 finalized header까지 바꿀지는 다음 2/3 판정에서 따로 결정합니다."
        />
      </div>

      <div id="finality-transition" className="scroll-mt-24">
        <ExplainedFormula
          question="같은 update가 finalized header까지 바꾸려면 무엇이 더 필요할까요?"
          idea="Full apply는 sync-committee 2/3 이상과 더 새로운 finalized header를 함께 요구합니다. Store에 next committee가 비어 있는 특수한 경우에는 같은 period의 finalized committee proof가 두 번째 조건을 대신할 수 있습니다."
          formula={String.raw`apply=(3p_u\ge2N)\;\land\;(s_f>s_F\;\lor\;hasFinalizedNextCommittee)`}
          annotatedFormula={String.raw`apply=\underbrace{(3\cdot342=1026\ge1024=2\cdot512)}_{\text{2/3 참여}}\;\land\;\underbrace{(8192>8191)}_{\text{더 새로운 finality}}`}
          operations={[
            {
              expression: String.raw`3\cdot342=1026\ge2\cdot512=1024`,
              annotation: [
                "342 positions는 512 positions의 2/3 경계를 넘습니다",
                "341이면 1,023<1,024라 full apply가 아닙니다",
                "BLS 유효성은 앞 단계에서 이미 확인했습니다",
              ],
            },
            {
              expression: String.raw`8192>8191`,
              annotation: [
                "Update의 finalized slot이 Store보다 새롭습니다",
                "두 Boolean이 모두 참이므로 full apply를 호출합니다",
                "낮거나 같은 finalized slot이면 header는 전진하지 않습니다",
              ],
            },
          ]}
          terms={[
            { symbol: "N", name: "Committee position 수", description: "예시 network preset의 sync committee size 512" },
            { symbol: "p_u", name: "이번 update 참여", description: "u-8193의 참여 position 342개" },
            { symbol: "s_f", name: "Update finalized slot", description: "u-8193이 proof와 함께 제시한 finalized slot 8,192" },
            { symbol: "s_F", name: "Store finalized slot", description: "적용 전 T0의 finalized slot 8,191" },
          ]}
          assumptions={[
            "Finality header와 next committee branch는 attested state root에 이미 검증됐습니다.",
            "2/3 조건은 position 수를 정수로 비교하며 distinct validator 수로 바꾸지 않습니다.",
            "이 판정은 light-client Store transition이며 full BeaconState 실행이 아닙니다.",
          ]}
          interpretation="u-8193은 2/3 참여와 더 새로운 finality를 모두 갖췄으므로 full apply 경로로 들어갑니다. Optimistic 전진과 달리 두 조건 중 하나라도 빠지면 finalized header는 T0에 남습니다."
        />
      </div>

      <div
        id="committee-handoff"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Period가 바뀌면 next를 current로 옮깁니다</h3>
        <p>
          Store의 finalized slot 8,191은 period 0, update의 finalized slot
          8,192는 period 1입니다. Helios는 이미 저장한 next committee
          <code>K1</code>을 current로 옮기고, <code>u-8193</code>이 증명한
          <code>K2</code>를 새 next로 넣습니다. 현재 period의 최대 참여 수 400은
          previous로 넘어가고 current 값은 0에서 다시 쌓입니다.
        </p>
        <p>
          Wall clock이 경계를 넘었다는 이유만으로 committee를 바꾸지 않습니다.
          Finalized period가 정확히 한 칸 전진하고 검증된 next committee가 있어야
          signer set이 이어집니다. Store에 next committee가 없는데 finalized
          period부터 달라지면 이 함수는 변경을 적용하지 않고 끝납니다.
        </p>
      </div>

      <div
        id="checkpoint-output"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Epoch 경계에서는 새 checkpoint root도 반환합니다</h3>
        <p>
          Finalized slot 8,192는 <code>32</code>로 나누어떨어지는 epoch
          경계입니다. 적용 함수는 finalized header의 tree hash root를 반환하고,
          상위 consensus client가 이를 <code>last_checkpoint</code>로 저장해
          channel 소비자에게 알립니다. Full apply가 끝나면
          <code>best_valid_update</code>는 비워집니다.
        </p>
        <p>
          확인한 commit의 이 경로는 메모리 Store를 바꿉니다. Checkpoint root가
          반환됐다는 사실을 disk의 원자적 저장이나 process restart 뒤 복구로
          확대해서는 안 됩니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="실제 Store 전이 코드 보기"
          onClick={() =>
            onCodeRef("hl-apply-update", codeRefs["hl-apply-update"])
          }
        />
      </div>
    </section>
  );
}
