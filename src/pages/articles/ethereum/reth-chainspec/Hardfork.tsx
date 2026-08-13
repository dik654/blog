import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import HardforkDetailViz from "./viz/HardforkDetailViz";
import { codeRefs } from "./codeRefs";
import { FORK_TYPES } from "./HardforkData";

export default function Hardfork({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="hardfork" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Hardfork: 이름이 아니라 activation condition
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          hardfork는 특정 지점부터 block validity와 EVM semantics를 바꾼다. 같은
          fork 이름이라도 mainnet, testnet과 custom chain의 활성 지점은 다를 수
          있다.
        </p>
        <h3>문제</h3>
        <p>
          block number만 인자로 받는 helper는 timestamp fork를 판정하지 못하고,
          timestamp만 받으면 Merge의 terminal difficulty를 표현하지 못한다. “PoS
          slot은 12초이므로 timestamp를 정확히 예측한다”는 설명도 missed slot과
          activation semantics를 혼동한다.
        </p>
        <h3>아이디어</h3>
        <p>
          fork를 <code>ForkCondition</code>과 함께 저장하고 number, timestamp,
          difficulty를 포함한 현재 context로 판정한다. 시간 기반 activation의
          장점은 일정한 블록 간격을 가정하는 것이 아니라, 합의 계층이 정한
          wall-clock 경계를 여러 네트워크에서 직접 표현한다는 점이다.
        </p>
        <h3>구현</h3>
        <p>
          ordered <code>ChainHardforks</code>가 활성화 history와 다음 fork를
          함께 제공한다. validation, EVM spec selection, header construction와
          EIP-2124 fork filtering이 이 schedule을 공유한다.
          <CodeViewButton onClick={() => open("fork-condition")} />
        </p>
      </div>

      <div className="not-prose mb-8">
        <HardforkDetailViz onOpenCode={open} />
      </div>

      <h3 className="mb-3 text-lg font-semibold">조건별 의미</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FORK_TYPES.map((fork) => (
          <article
            key={fork.id}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p
              className="font-mono text-xs font-bold"
              style={{ color: fork.color }}
            >
              {fork.condition}
            </p>
            <p className="mt-1 text-xs text-foreground/45">{fork.era}</p>
            <p className="mt-2 text-xs font-medium text-foreground/70">
              {fork.examples}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/55">
              {fork.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
