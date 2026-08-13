import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import RethRuntimeViz from "../reth-runtime-viz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function EngineApi({ onCodeRef }: Props) {
  return (
    <section id="engine-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API에서 build job까지</h2>
      <RethRuntimeViz mode="engine-handoff" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">
          forkchoiceUpdated 입력
        </h3>
        <p className="leading-7">
          head·safe·finalized hash는 chain 선택 문맥이고 payload attributes는 새
          후보를 만들라는 조건부 요청이다. attributes가 없으면 forkchoice를
          갱신해도 build job을 만들 필요가 없다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Payload id의 역할</h3>
        <p className="leading-7">
          payload id는 CL이 이후 job 결과를 찾는 opaque handle이다. 구현이 어떤
          입력으로 id를 만드는지는 collision과 재사용 요구를 만족해야 하지만,
          호출자는 특정 hash 조합이나 “같은 attributes면 항상 같은 id”에
          의존하지 않는다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Job lifecycle</h3>
        <ol>
          <li>포크별 attributes와 parent 문맥을 검증한다.</li>
          <li>
            job generator가 builder configuration과 cancellation·deadline 문맥을
            만든다.
          </li>
          <li>service가 payload id와 active job을 연결한다.</li>
          <li>
            builder는 새 txpool 상태나 정책에 따라 후보를 만들거나 개선할 수
            있다.
          </li>
          <li>
            <code>getPayloadVn</code>은 현재 가용한 최선 결과를 resolve한다.
          </li>
        </ol>

        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("forkchoice-updated", codeRefs["forkchoice-updated"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            Bundled builder snapshot
          </span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          외부 builder와의 경계
        </h3>
        <p className="leading-7">
          Reth의 local payload builder는 Engine API job을 수행한다.
          relay·builder API를 통한 외부 bid 수집과 proposer의 선택은 별도
          protocol·policy 경계다. local <code>block_value</code>를 제공할 수
          있어도 이것만으로 외부 bid의 유효성 검증과 선택 로직 전체가 대체되지는
          않는다.
        </p>
      </div>
    </section>
  );
}
