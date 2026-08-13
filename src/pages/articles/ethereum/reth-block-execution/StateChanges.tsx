import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import StateChangesViz from "./viz/StateChangesViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function StateChanges({ onCodeRef }: Props) {
  return (
    <section id="state-changes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BundleState와 변경 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          EVM 결과는 “새 state 전체”가 아니라 실행 중 읽은 원본과 바뀐
          계정·storage·code의 집합이다. Reth는 이 차이를 overlay 계층에 누적해
          검증, 영속화와 unwind가 같은 변경 의미를 공유하게 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          계정별로 보존할 정보
        </h3>
        <ul>
          <li>
            <strong>Account info</strong> — nonce, balance, code hash의 원본과
            현재 값
          </li>
          <li>
            <strong>Storage</strong> — 접근·변경된 slot의 original과 present 값
          </li>
          <li>
            <strong>Bytecode</strong> — 새 code hash와 해당 bytecode
          </li>
          <li>
            <strong>Status</strong> — created, changed, destroyed 등 영속화
            판단에 필요한 상태
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          왜 original value가 필요한가
        </h3>
        <p className="leading-7">
          현재 값만 있으면 forward commit은 가능해 보여도 reorg 때 이전
          canonical state를 복원할 수 없다. original과 transition 경계를 함께
          보존하면 block 순서의 반대로 changeset을 적용해 unwind할 수 있다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("block-executor", codeRefs["block-executor"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            Bundled executor snapshot
          </span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          영속화는 provider 계층의 책임
        </h3>
        <p className="leading-7">
          execution output은 계정·storage·code·receipt·revert 관련 데이터를
          운반하지만, 어느 table에 어떤 batch 크기로 commit할지는 pipeline과
          provider 구현이 결정한다. 특정 함수 이름이나 “항상 여섯 table, 한
          transaction”을 BundleState 자체의 보장으로 일반화하지 않는다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          overlay는 DB를 대체하지 않는다. cache miss와 원본 조회는 provider로
          내려가고, validated output만 storage 정책에 따라 commit된다.
        </p>
      </div>
      <div className="not-prose mb-6">
        <StateChangesViz />
      </div>
    </section>
  );
}
