import ContextViz from "./viz/ContextViz";
import BlockExecViz from "./viz/BlockExecViz";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reth는 block을 transaction 실행과 state commit 단계로 나눈다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          실행 클라이언트는 block body의 트랜잭션을 순서대로 실행해 state
          change와 receipt를 만들고, header가 약속한 결과와 일치하는지 검증해야
          한다. EVM 호출만으로는 블록 실행 전체가 완성되지 않는다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          문제 — 실행 전후의 system change도 protocol 일부다
        </h3>
        <p className="leading-7">
          포크에 따라 block 전 system call, withdrawal·reward 같은 후처리,
          receipt와 gas 검증이 달라진다. 이 로직을 transaction loop 안에 흩으면
          chain variant와 hardfork 변경을 추적하기 어렵다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          아이디어 — BlockExecutor 수명주기
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Pre-execution</strong>
            <p className="text-xs text-muted-foreground mt-1">
              block·fork 문맥과 실행 전 system change 처리
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Transactions</strong>
            <p className="text-xs text-muted-foreground mt-1">
              복구된 sender와 transaction을 EVM에 순서대로 적용
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Post-execution</strong>
            <p className="text-xs text-muted-foreground mt-1">
              withdrawal·request·receipt 등 포크별 마무리와 output 생성
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          상태는 DB 위의 overlay로 실행된다
        </h3>
        <p className="leading-7">
          필요한 계정·storage 원본은 provider에서 읽고, 실행 중 변경은 cache와
          transition state에 누적한다. 최종 <code>BundleState</code>는 현재 값뿐
          아니라 unwind에 필요한 원본·revert 정보도 운반한다. 따라서 “DB 접근
          없이 실행”이 아니라 <strong>DB 읽기와 변경 누적·영속화를 분리</strong>
          한 구조다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          output의 소비자는 하나가 아니다
        </h3>
        <ul>
          <li>
            consensus validation은 gas, receipt root와 포크별 결과를 확인한다.
          </li>
          <li>pipeline·provider 계층은 상태와 changeset을 영속화한다.</li>
          <li>reorg·unwind 경로는 원본 값을 역순으로 적용한다.</li>
          <li>
            payload builder는 아직 canonical DB에 commit하지 않은 후보 실행에도
            같은 실행 abstraction을 재사용한다.
          </li>
        </ul>
        <CitationBlock
          {...OFFICIAL_SOURCES.reth.blockExecutor}
          citeKey={1}
          type="code"
        >
          현재 Reth API의 BlockExecutor는 pre-execution, transaction execution,
          post-execution 수명주기를 노출한다. 예전 BatchExecutor 중심 설명을
          현재 abstraction 전체로 일반화하지 않는다.
        </CitationBlock>
      </div>
      <div className="not-prose mt-4">
        <BlockExecViz />
      </div>
    </section>
  );
}
