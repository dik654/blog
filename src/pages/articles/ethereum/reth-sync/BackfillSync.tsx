import type { CodeRef } from "@/components/code/types";
import RethRuntimeViz from "../reth-runtime-viz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

const STEPS = [
  {
    title: "1. 동기화 gap 판단",
    body: "Engine handler가 consensus client의 forkchoice와 로컬 canonical tip을 비교해 실행해야 할 block 범위를 구한다.",
  },
  {
    title: "2. Backfill 또는 Live 선택",
    body: "큰 범위는 staged pipeline에 넘기고, head 근처의 작은 gap은 engine tree가 필요한 parent를 내려받아 처리한다.",
  },
  {
    title: "3. Pipeline target 설정",
    body: "BackfillSync가 target을 pipeline에 전달하면 headers·bodies·execution·trie·index stage가 각 checkpoint에서 전진한다.",
  },
  {
    title: "4. 검증·unwind",
    body: "잘못된 block이나 canonical 변경을 만나면 stage별 unwind 경계로 되돌리고 새 target에 맞춰 다시 실행한다.",
  },
  {
    title: "5. Live handoff",
    body: "pipeline이 target에 도달하면 backfill을 끝내고 engine tree가 newPayload·forkchoiceUpdated 기반의 live 처리로 복귀한다.",
  },
];

export default function BackfillSync({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="backfill-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Backfill Sync와 Live handoff</h2>
      <RethRuntimeViz mode="sync-handoff" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Reth의 실행 경로는 사용자에게{" "}
          <strong>Full·Snap·Live 세 가지 제품 모드</strong>를 고르게 하는 구조가
          아니다. 대신
          현재 engine tree는 처리할 범위가 크면 staged pipeline을 backfill
          driver로 사용하고, head 부근에서는 live sync로 필요한 block만
          처리한다.
        </p>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 my-5">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-lg border border-border/60 bg-muted/30 p-4"
            >
              <p className="text-sm font-semibold text-foreground/80 mb-1">
                {step.title}
              </p>
              <p className="text-sm text-foreground/65 leading-6">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Snapshot과 Snap protocol은 다른 개념이다
        </h3>
        <p className="leading-7">
          Reth가 배포하는 modular snapshot은 미리 만들어진 저장 데이터를 받아
          초기 부팅 시간을 줄이는 운영 도구다. 이것을 Geth의 <code>snap/1</code>{" "}
          peer protocol로 현재 state range를 동기화하는 “Reth Snap Sync”와
          혼동하면 안 된다. snapshot으로 시작하더라도 이후 canonical gap의
          검증·실행은 pipeline과 engine tree가 담당한다.
        </p>

        <div className="not-prose rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 my-4 text-sm text-foreground/70">
          Backfill과 Live는 동시에 canonical state를 전진시키지 않는다.
          orchestrator가 소유권을 넘겨 중복 실행과 서로 다른 persistence 경계가
          충돌하지 않게 한다.
        </div>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          현재 구현 경계는 Reth의{" "}
          <a
            href="https://reth.rs/docs/reth_engine_tree/backfill/index.html"
            target="_blank"
            rel="noreferrer"
          >
            engine-tree backfill 문서
          </a>
          와{" "}
          <a
            href="https://reth.rs/docs/reth_stages/index.html"
            target="_blank"
            rel="noreferrer"
          >
            staged pipeline 문서
          </a>
          에서 확인할 수 있다.
        </p>
      </div>
    </section>
  );
}
