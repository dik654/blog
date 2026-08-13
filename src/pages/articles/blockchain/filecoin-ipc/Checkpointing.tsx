import { CodeViewButton } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Checkpointing({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="checkpointing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Top-down finality와 bottom-up checkpoint
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("ipc-subnet", codeRefs["ipc-subnet"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            SubmitCheckpoint 개념 스냅샷
          </span>
        </div>
        <p className="leading-7">
          양방향 메시지는 같은 파이프를 거꾸로 쓰지 않는다. 부모에서 자식으로
          내려가는 흐름은 child validator가 <strong>parent finality</strong>에
          합의한 뒤 실행하고, 자식에서 부모로 올라가는 흐름은 child가{" "}
          <strong>bottom-up checkpoint</strong>에 quorum을 만든 뒤 relayer가
          제출한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Top-down: 부모 상태를 자식이 확정
        </h3>
        <div className="not-prose rounded-lg border bg-card p-4 my-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded bg-muted px-2 py-1">
              parent Gateway queue
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">
              validator observes parent
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">
              child consensus on parent finality
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">execute messages</span>
          </div>
        </div>
        <p className="leading-7">
          deposit과 validator-power 변경은 parent block을 보기만 했다고 즉시
          실행하지 않는다. child block 안에서 어느 parent height와 hash를
          final로 볼지 합의해 모든 validator가 같은 top-down prefix를 처리한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Bottom-up: 자식 quorum을 부모가 검증
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-4 gap-3 my-4">
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">1. Queue</div>
            <p className="text-[11px] text-muted-foreground">
              release와 cross-net call을 child Gateway에 누적
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">2. Checkpoint</div>
            <p className="text-[11px] text-muted-foreground">
              subnet id·height·block hash·message commitment·configuration을
              묶음
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">3. Quorum</div>
            <p className="text-[11px] text-muted-foreground">
              현재 power table의 충분한 서명으로 checkpoint를 확정
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">4. Relay</div>
            <p className="text-[11px] text-muted-foreground">
              누구나 제출 가능한 relayer가 parent contract로 전달
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Finality를 읽는 법</h3>
        <p className="leading-7">
          로컬 child block finality, bottom-up checkpoint quorum, parent
          transaction finality는 서로 다른 시점이다. sibling subnet으로 가는
          메시지는 공통 조상까지 올라간 뒤 다시 내려가므로 “항상 두 checkpoint
          주기” 같은 고정 지연으로 설명할 수 없다. 애플리케이션은 목적지에서
          실행된 단계까지 추적해야 한다.
        </p>

        <CitationBlock {...OFFICIAL_SOURCES.ipc.bottomUp} citeKey={3}>
          공식 사양은 checkpoint가 child의 진행, message commitment, validator
          configuration을 부모에 전달하고 현재 validator power의 quorum으로
          검증된다고 설명한다.
        </CitationBlock>
      </div>
    </section>
  );
}
