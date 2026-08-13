import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function CheckpointManagement({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="checkpoint-management" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Justification은 2/3 effective balance가 같은 checkpoint link를 지지했다는 기록이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Validator attestation의 FFG vote는 source와 target checkpoint를 연결합니다. Node는 같은 source→target link를
          지지한 active·unslashed validator의 effective balance를 한 번씩 합하고, 기준 epoch state의 total active balance와
          비교합니다. Signature 수나 validator 수가 아니라 balance를 세므로 10명의 vote와 20명의 vote만 비교해서는
          threshold를 판단할 수 없습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Checkpoint link가 supermajority를 얻었다고 언제 판정할까요?"
        idea="부동소수점 2/3를 사용하지 않고 정수 balance 양쪽을 곱해 비교합니다. 이렇게 하면 모든 client가 rounding 차이 없이 같은 판정을 냅니다."
        formula={String.raw`3W_{s\rightarrow t}\;\ge\;2W_{active}`}
        terms={[
          { symbol: "s, t", name: "출발·도착 체크포인트", description: "vote의 source·target checkpoint" },
          { symbol: "W_{s\\rightarrow t}", name: "링크 지지 잔액", description: "같은 link를 지지한 eligible validator effective balance 합(Gwei)" },
          { symbol: "W_{active}", name: "전체 활성 잔액", description: "기준 state의 total active effective balance(Gwei)" },
        ]}
        assumptions={[
          "Attestation signature와 source·target consistency가 검증됐고 validator는 같은 link에 한 번만 집계됩니다.",
          "Balance와 active/slashed status는 규격이 지정한 기준 state·epoch에서 읽습니다.",
          "이 threshold는 target justification의 필요 계산이며 finalization pattern 전체를 대체하지 않습니다.",
        ]}
        interpretation="Active balance가 96 ETH이면 64 ETH가 정확한 경계입니다. 63 ETH는 3×63=189가 2×96=192보다 작아 부족하고, 68 ETH는 통과합니다. 통과했다고 target이 곧바로 finalized되는 것은 아닙니다."
      />

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("epoch-processing", codeRefs["epoch-processing"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 epoch processing 확인</span>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Current와 previous checkpoint를 옮기는 순서가 중요합니다</h3>
        <p>
          Epoch processing은 기존 current justified checkpoint를 previous로 옮기고, 최근 epoch의 target vote가 threshold를
          넘으면 새 current justified checkpoint를 기록합니다. 동시에 justification bits가 최근 epoch들의 justification
          history를 짧은 bit window로 보존합니다. Finalization 판정은 업데이트 전 checkpoint와 업데이트된 bit pattern을 함께
          사용하므로 assignment 순서를 바꾸면 다른 checkpoint를 finalize할 수 있습니다.
        </p>
        <p>
          예를 들어 epoch 2의 C2가 이미 justified이고 epoch 3에서 C2→C3 link가 68/96 ETH를 얻었다면 C3를 justify합니다.
          다음 epoch에 연속된 link가 충분한 balance를 얻으면 규격의 인접 또는 한 epoch 건너뛴 pattern에 따라 C2나 C3보다
          이전 checkpoint가 finalized될 수 있습니다. “두 번 2/3가 나왔다”만으로 대상 root를 정하지 않고 source·target epoch와
          justification bit positions를 대조해야 합니다.
        </p>

        <h3>Partial participation과 duplicate를 구분합니다</h3>
        <p>
          Aggregated attestation 여러 개에 같은 validator가 포함될 수 있으므로 raw object를 단순 합산하면 balance를 중복으로
          셉니다. Participation flag 또는 validator index 집합으로 한 번만 세어야 하며, slashed·inactive status와 target root가
          다른 vote도 분리합니다. 64/96 ETH라는 결과를 재현하려면 source/target roots, included indices, effective-balance
          snapshot과 spec fork를 receipt에 남깁니다.
        </p>
      </div>
    </section>
  );
}
