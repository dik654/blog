import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import GenesisViz from "./viz/GenesisViz";
import { codeRefs } from "./codeRefs";
import { GENESIS_STEPS } from "./GenesisData";

export default function Genesis({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="genesis" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Genesis: 선언 파일에서 검증 가능한 block 0으로
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          genesis는 chain config, 초기 계정·code·storage와 block 0 header
          fields를 함께 정의한다. built-in network는 이 값을 배포물과 함께
          제공하고, custom chain은 사용자가 전달한 genesis를 같은 내부 타입으로
          파싱한다.
        </p>
        <h3>문제</h3>
        <p>
          JSON을 읽었다는 것만으로 chain identity가 확정되지는 않는다. alloc을
          state trie로 변환하는 방식, genesis 시점에 이미 활성인 fork와 조건부
          header fields가 모두 같아야 동일한 genesis hash가 나온다.
        </p>
        <h3>아이디어</h3>
        <p>
          입력을 canonical internal types로 정규화하고, alloc에서 state root를
          계산한 뒤, genesis 시점의 active rules로 header를 만든다. 마지막
          sealed header hash가 network compatibility의 안정적인 fingerprint가
          된다.
        </p>
        <h3>구현</h3>
        <p>
          account address와 storage key를 secure-trie key로 바꾸고 account RLP를
          leaf에 넣어 root를 만든다. header의 base fee, withdrawals root, blob
          fields 같은 조건부 값은 현재 chain spec의 genesis context로 결정한다.
          알려진 network는 기대 hash와 비교하고 custom chain은 계산된 hash를
          이후 모든 컴포넌트가 공유한다.{" "}
          <CodeViewButton onClick={() => open("make-genesis")} />
        </p>
      </div>

      <div className="not-prose mb-8">
        <GenesisViz onOpenCode={open} />
      </div>

      <h3 className="mb-3 text-lg font-semibold">초기화 단계</h3>
      <ol className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {GENESIS_STEPS.map((step, index) => (
          <li
            key={step.title}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
              {index + 1}
            </span>
            <p className="mt-2 text-sm font-semibold text-foreground/75">
              {step.title}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/55">
              {step.desc}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
