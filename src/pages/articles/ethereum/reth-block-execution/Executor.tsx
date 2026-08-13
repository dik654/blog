import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import ExecutorDetailViz from "./viz/ExecutorDetailViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Executor({ onCodeRef }: Props) {
  return (
    <section id="executor" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlockExecutor 경계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Executor는 EVM을 한 번 호출하는 helper가 아니라 한 블록의 protocol
          순서를 소유하는 객체다. factory는 chain spec, EVM factory와 state
          provider를 결합해 이 문맥에 맞는 executor를 만든다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">한 블록을 실행할 때</h3>
        <ol>
          <li>
            header와 활성 fork에서 block environment와 system-call 조건을
            준비한다.
          </li>
          <li>sender가 복구된 transaction을 block 순서대로 실행한다.</li>
          <li>각 결과의 state transition, gas와 receipt 정보를 누적한다.</li>
          <li>
            withdrawal·request 등 활성 fork의 post-execution change를 반영한다.
          </li>
          <li>상위 검증 계층이 사용할 execution output을 반환한다.</li>
        </ol>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("block-executor", codeRefs["block-executor"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            현재 executor 구현 확인
          </span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          여러 블록을 처리할 때도 commit 정책은 상위 책임
        </h3>
        <p className="leading-7">
          동기화 pipeline은 여러 실행 결과를 묶어 처리할 수 있지만 “임의 개수의
          블록을 실행하면 DB write가 정확히 한 번”이라고 보장되지는 않는다.
          commit threshold, transaction 크기, checkpoint와 crash recovery 정책이
          실제 영속화 경계를 결정한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          검증과 저장을 구분하는 이유
        </h3>
        <ul>
          <li>잘못된 block의 변경을 canonical storage에 먼저 쓰지 않는다.</li>
          <li>
            payload 후보처럼 아직 canonical이 아닌 실행에도 같은 output 형식을
            재사용한다.
          </li>
          <li>
            reorg 때 필요한 revert 정보를 state 변화와 같은 수명주기로 유지한다.
          </li>
          <li>batch 크기를 데이터베이스와 복구 요구에 맞게 조정할 수 있다.</li>
        </ul>
      </div>
      <div className="not-prose mb-6">
        <ExecutorDetailViz />
      </div>
    </section>
  );
}
