import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function FinalizeCommit({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="finalize-commit" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Finalize는 S41을 계산하고 Commit은 S41을 영속화합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Consensus가 결정한 B41을 넘기면 application은 S40에서 transaction을 결정적으로 실행해 S41, transaction results,
          validator·consensus parameter updates, AppHash A41을 만듭니다.
        </p>
        <p>
          CometBFT는 이 response를 먼저 저장하지만 application의 durable state는 여전히 h40입니다. FinalizeBlock은 state를 계산하는
          경계이고, Commit은 계산한 state를 디스크에 남기는 경계입니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton
          label="ApplyBlock · FinalizeBlock 호출"
          onClick={() => onCodeRef("apply-block", codeRefs["apply-block"])}
        />
      </div>
      <ExplainedFormula
        question="모든 correct node가 같은 다음 state와 AppHash를 만들기 위한 최소 식은 무엇일까요?"
        idea={<>결정된 block과 이전 committed state만 deterministic transition에 넣고, 결과 state의 commitment를 계산합니다. Node-local 입력과 external effect는 함수 밖으로 분리합니다.</>}
        formula={String.raw`\begin{aligned}S_h&=F(S_{h-1},B_h),\\ A_h&=C(S_h)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\underbrace{S_h}_{\text{높이 h 결과 state}}&=\underbrace{F(S_{h-1},B_h)}_{\text{결정 block을 결정적으로 실행}},\\ \underbrace{A_h}_{B_{h+1}\text{ header의 AppHash}}&=\underbrace{C(S_h)}_{\text{결과 state commitment}}\end{aligned}`}
        operations={[
          { expression: String.raw`F(S_{h-1},B_h)`, annotation: ["높이 h-1 committed state에","높이 h의 decided block만 실행","clock·randomness 같은 local 입력 금지"] },
          { expression: String.raw`C(S_h)`, annotation: ["높이 h 결과 state를 commitment로 요약","FinalizeBlock이 반환한 A_h가","높이 h+1 header의 AppHash가 됨"] },
        ]}
        terms={[
          { symbol: "S_{h-1}", name: "Previous state", description: "FinalizeBlock 전에 durable하게 commit된 application state입니다." },
          { symbol: "B_h", name: "Decided block", description: "Consensus가 height h에서 결정한 block과 protocol context입니다." },
          { symbol: "F", name: "State transition", description: "Application의 deterministic state-transition function입니다." },
          { symbol: "A_h", name: "AppHash", description: "높이 h의 결과 state를 식별하며 다음 block header에 연결되는 commitment입니다." },
        ]}
        assumptions={["모든 correct node가 같은 ordered input과 application version/configuration을 사용합니다.", "Map iteration·floating behavior·clock·randomness·remote API처럼 결과가 갈리는 입력을 제거하거나 consensus input에 포함합니다.", "Commitment collision resistance를 가정하며 AppHash가 비어 있거나 application-specific일 수 있는 protocol 범위를 따릅니다."]}
        interpretation="같은 S_{h-1}와 B_h인데 A_h가 다르면 consensus order는 같아도 replicated application state가 갈라진 것입니다. AppHash 일치는 external notification이 exactly once 실행됐다는 뜻은 아닙니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>A41은 B41이 아니라 다음 block header에 들어갑니다</h3>
        <p>
          B41을 실행해 얻은 A41은 B42 header의 AppHash field에 들어갑니다. 장애 로그에는 decided block height, FinalizeBlock
          response A41, application committed height, 다음 header의 AppHash를 각각 분리해 남겨야 합니다. AppHash를 B41 payload hash나
          CometBFT database root로 읽으면 한 높이 어긋난 상태를 정상으로 오해할 수 있습니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton
          label="Commit과 State 저장 순서"
          onClick={() => onCodeRef("commit-order", codeRefs["commit-order"])}
        />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>마지막으로 남은 receipt가 replay 시작점을 정합니다</h3>
        <p>
          CometBFT와 application의 저장은 하나의 atomic transaction이 아닙니다. 재시작 때 application <code>Info</code>가 보고한 마지막
          committed height와 block store·Finalize response·node State를 비교합니다. Application이 CometBFT보다 더 높은 height를 보고하거나
          저장 순서가 맞지 않으면 계속 진행하지 않고 recovery invariant를 실패시킵니다.
        </p>
      </div>
      <div className="not-prose my-6 overflow-x-auto border-y border-border" aria-label="Crash 지점별 남은 기록과 재시작 동작">
        <div className="min-w-[42rem]">
          <div className="grid grid-cols-[9rem_9rem_9rem_minmax(0,1fr)] bg-muted/50 text-[10px] font-black text-muted-foreground">
            <div className="p-3">BLOCK STORE</div>
            <div className="p-3">FINALIZE RESPONSE</div>
            <div className="p-3">APP DURABLE</div>
            <div className="p-3">재시작 동작</div>
          </div>
          {[
            ["h41", "없음", "h40", "FinalizeBlock부터 이후 단계를 다시 실행합니다."],
            ["h41", "h41", "h40", "FinalizeBlock을 다시 실행해 저장된 response와 대조한 뒤 Commit합니다."],
            ["h41", "h41", "h41", "저장 순서가 맞으므로 다음 height로 진행합니다."],
          ].map((row) => (
            <div key={row.join("-")} className="grid grid-cols-[9rem_9rem_9rem_minmax(0,1fr)] border-t border-border text-xs leading-5">
              {row.map((cell, index) => <div key={`${index}-${cell}`} className={`p-3 ${index === 3 ? "font-bold" : "font-mono"}`}>{cell}</div>)}
            </div>
          ))}
        </div>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>외부 side effect는 application state와 별도 receipt가 필요합니다</h3>
        <p>
          FinalizeBlock이나 Commit이 replay될 수 있으므로 payment·webhook을 호출 성공 여부만으로 완료 처리하면 중복 효과가 생깁니다. Deterministic
          state에는 실행 의도와 고유 key를 기록하고, 별도 worker가 외부 결과 receipt를 대조해 재시도하도록 설계해야 합니다. ABCI의 AppHash는 이
          외부 시스템이 exactly once로 처리됐다는 증거가 아닙니다.
        </p>
      </div>
      <div id="paper-cometbft-app-requirements-v040" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · application requirements</p>
        <p className="mt-2 text-sm font-semibold">Requirements for the ABCI Application</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            규격이 application 의무로 명시하는 항목은 proposal coherence·determinism·candidate state·connection
            ordering·crash recovery입니다. 올바른 integration 조건은 설명해 주지만 특정 database의 atomicity나 외부 시스템 side
            effect까지 자동으로 보장해 주지는 않습니다.
          </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/0880b4d378f347ab16e54ec677ff50d803f37d62/spec/abci/abci%2B%2B_app_requirements.md" target="_blank" rel="noreferrer">고정 commit의 application requirements 보기</a>
      </div>
    </section>
  );
}
