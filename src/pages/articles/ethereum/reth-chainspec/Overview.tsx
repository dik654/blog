import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import ChainSpecViz from "./viz/ChainSpecViz";
import { codeRefs } from "./codeRefs";
import { CHAINSPEC_FIELDS } from "./OverviewData";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ChainSpec: 실행 규칙의 단일 입력
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          같은 EVM이라도 chain ID, genesis state, hardfork schedule과 fee·blob
          parameters가 다르면 다른 체인이다. Network, validation, EVM, payload
          builder와 RPC가 모두 이 규칙을 알아야 한다.
        </p>
        <h3>문제</h3>
        <p>
          포크 활성 조건은 block number, terminal total difficulty와
          timestamp처럼 하나의 축이 아니다. 컴포넌트마다 자체 상수와 조건문을
          두면 경계 block에서 서로 다른 규칙을 선택해 consensus failure가 생길
          수 있다.
        </p>
        <h3>아이디어</h3>
        <p>
          체인 identity, genesis, ordered hardfork conditions와 protocol
          parameters를 하나의 typed
          <code>ChainSpec</code>에 묶는다. 소비자는 “Prague 시각은 얼마인가”를
          복사하지 않고 현재 block context에서 해당 fork가 활성인지 spec에
          묻는다.
        </p>
        <h3>구현</h3>
        <p>
          Reth의 <code>ChainSpec</code>은 genesis와 sealed header, hardfork
          schedule, fee·blob parameters와 chain metadata를 보유한다. built-in
          mainnet·testnet spec뿐 아니라 parser/builder로 만든 custom spec도 같은
          trait 경계로 주입된다.{" "}
          <CodeViewButton onClick={() => open("chainspec-struct")} />
        </p>
      </div>

      <div className="not-prose mb-8">
        <ChainSpecViz onOpenCode={open} />
      </div>

      <h3 className="mb-3 text-lg font-semibold">한곳에서 관리할 값</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CHAINSPEC_FIELDS.map((field) => (
          <article
            key={field.id}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p
              className="font-mono text-xs font-bold"
              style={{ color: field.color }}
            >
              {field.label}
            </p>
            <p className="mt-1 text-[11px] text-foreground/45">{field.type}</p>
            <p className="mt-2 text-sm font-medium text-foreground/70">
              {field.role}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/55">
              {field.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
