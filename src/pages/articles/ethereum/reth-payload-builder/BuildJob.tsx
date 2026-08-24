import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import ExplainedFormula from "@/components/ui/explained-formula";
import RethRuntimeViz from "../reth-runtime-viz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function BuildJob({ onCodeRef }: Props) {
  return (
    <section id="build-job" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Build job 내부</h2>
      <RethRuntimeViz mode="payload-job" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Build job은 txpool 목록을 단순히 fee 순으로 복사하지 않는다. parent
          state 위에서 transaction을 실제로 실행하고 block resource와 fork
          규칙을 지키는 완성 가능한 후보를 만든다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">후보 선택 루프</h3>
        <ol>
          <li>pool이 정책에 따라 정렬한 transaction iterator를 가져온다.</li>
          <li>
            base fee, nonce dependency, gas와 blob resource 같은 빠른 조건을
            확인한다.
          </li>
          <li>현재 overlay state에서 EVM 실행을 시도한다.</li>
          <li>성공 결과의 state·receipt·gas를 candidate에 누적한다.</li>
          <li>
            실패 종류에 따라 descendant 처리나 iterator 건너뛰기 정책을
            적용한다.
          </li>
        </ol>
        <p className="leading-7">
          큰 gas limit transaction이 현재 남은 공간에 들어가지 않는다고 즉시
          전체 탐색을 끝낼 수는 없다. 뒤의 더 작은 transaction은 포함 가능할 수
          있다. 반대로 임의의 “90% gas”에서 항상 멈추는 것도 protocol 규칙이
          아니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Best candidate의 기준
        </h3>
        <ExplainedFormula
          question="한 candidate가 block의 execution gas와 blob gas 예산 안에 들어오는지 어떻게 판정할까요?"
          idea="서로 단위가 다른 두 자원을 한 숫자로 더하지 않고 각각 독립된 상한으로 검사합니다. 유효성 검사를 통과한 후보끼리만 value를 비교합니다."
          formula={String.raw`G(C)=\sum_{t\in C}g_t\le G_{\max},\qquad B(C)=\sum_{t\in C}b_t\le B_{\max}`}
          annotatedFormula={String.raw`G(C)=\underbrace{\sum_{t\in C}g_t\le G_{\max},\qquad B(C)=\sum_{t\in C}b_t\le B_{\max}}_{\text{경계 후보 선택}}`}
          operations={[
            { expression: String.raw`\sum_{t\in C}g_t\le G_{\max},\qquad B(C)=\sum_{t\in C}b_t\le B_{\max}`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","서로 단위가 다른 두 자원을 한 숫자로 더하지 않고 각각","독립된 상한으로 검사합니다."] },
          ]}
          terms={[
            { symbol: "C", name: "candidate", description: "현재 snapshot에서 순서대로 실행해 성공한 transaction 집합" },
            { symbol: "g_t", name: "execution gas", description: "transaction t가 실제 사용한 execution gas" },
            { symbol: "b_t", name: "blob gas", description: "transaction t가 소비한 blob gas" },
            { symbol: "G_max, B_max", name: "fork budgets", description: "활성 fork와 parent context가 정한 독립 상한" },
          ]}
          assumptions={["모든 transaction은 같은 parent-state overlay에서 순서대로 실행합니다.", "Nonce·balance·fork rule·block size 같은 다른 validity 조건도 별도로 통과해야 합니다.", "Pool ordering은 탐색 순서이지 포함 보장이 아닙니다."]}
          interpretation="예를 들어 execution gas가 21k+50k이고 상한이 100k이면 첫 조건은 통과합니다. 그러나 blob gas가 상한을 넘으면 value가 커도 candidate에는 넣을 수 없습니다."
        />
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Validity</strong>
            <p className="text-xs text-muted-foreground mt-1">
              header, roots, requests와 fork constraints를 만족
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Resources</strong>
            <p className="text-xs text-muted-foreground mt-1">
              gas·blob·block size budget 안에 존재
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Policy / value</strong>
            <p className="text-xs text-muted-foreground mt-1">
              builder가 정한 비교 기준으로 기존 후보보다 나은지 평가
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          BuiltPayload로 넘길 산출물
        </h3>
        <p className="leading-7">
          선택한 transactions뿐 아니라 execution outcome, receipts, state root
          계산에 필요한 변화와 포크별 부가 데이터를 일관된 후보로 묶는다.
          <code>getPayload</code> 시점에는 job이 가진 최선의 가용 후보를
          반환하며, 정해진 ETH 금액이나 transaction 수를 가정하지 않는다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("build-payload", codeRefs["build-payload"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            Bundled build snapshot
          </span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          local block value, external builder bid와 validator 연간 수익은 서로
          다른 지표다. 시점에 따라 변하는 APR·MEV 수치를 build job의 동작 설명에
          넣지 않는다.
        </p>
      </div>
    </section>
  );
}
