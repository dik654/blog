import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import BuildJobDetailViz from "./viz/BuildJobDetailViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function BuildJob({ onCodeRef }: Props) {
  return (
    <section id="build-job" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Build job 내부</h2>
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
      <div className="not-prose mb-6">
        <BuildJobDetailViz />
      </div>
    </section>
  );
}
