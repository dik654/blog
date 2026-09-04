import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import ChainSpecViz from "./viz/ChainSpecViz";
import { codeRefs } from "./codeRefs";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        ChainSpec은 이름표가 아니라 모든 execution consumer가 공유하는 versioned
        rule bundle이다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          두 node가 모두 chain ID 1이라고 말해도 genesis state나 hardfork schedule이 다르면 같은 block을 다르게 검증할 수 있습니다. Reth의
          chain specification은 chain identity, genesis, ordered fork activation과 fee·blob parameter를 묶고
          validator·EVM·payload builder·network fork filter가 같은 context에서 같은 rule을 선택하게 합니다.
        </p>
        <p>
          이 글은{" "}
          <strong>
            identity bundle→activation predicate→consumer parity→genesis
            derivation→release gate
          </strong>{" "}
          순서로 진행합니다. <Link to="/blockchain/reth">Reth 구조</Link>의
          block lifecycle을 재사용하며, 여기서는 그 lifecycle에 주입되는
          ruleset의 정합성을 소유합니다.
        </p>
      </div>

      <ContentBoundary article="reth-chainspec" />
      <ContextViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 알아둘 최소 개념</h3>
        <p>
          <strong>Genesis</strong>는 block 0의 header와 초기
          account·code·storage를 정의하고,
          <strong>hardfork</strong>는 특정 조건부터 block validity와 EVM
          semantics를 바꾸는 protocol upgrade입니다.
          <strong>ForkCondition</strong>은 그 조건을 block
          number·timestamp·total terminal difficulty(TTD) 또는 Never로 표현하고,
          <strong>fork ID</strong>는 genesis hash와 fork history를 사용해 peer
          compatibility를 빠르게 거르는 식별자입니다.
        </p>

        <h3>Chain identity는 여러 값의 conjunction입니다</h3>
        <p>
          최소 identity receipt는 chain ID, sealed genesis hash, ordered fork
          schedule, protocol parameter digest와 Reth semver·SHA를 묶습니다. 같은
          chain ID에 genesis alloc 한 계정이 다르면 state root와 genesis hash가
          달라지고, 같은 genesis라도 future fork activation이 다르면 boundary
          이후 다른 chain이 됩니다. 따라서 chain ID 일치만으로 database를 열거나
          peer를 호환된다고 판단하지 않습니다.{" "}
          <CodeViewButton onClick={() => open("chainspec-struct")} />
        </p>
      </div>

      <ChainSpecViz onOpenCode={open} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 decision을 네 consumer가 반복 계산합니다</h3>
        <p>
          Boundary block에서 validator가 old rule을 쓰고 executor가 new EVM rule을 쓰면 header는 통과했는데 execution result가
          갈라질 수 있습니다. Payload builder가 아직 허용되지 않은 field를 넣거나 network가 잘못된 fork ID peer를 받아도 같은 문제가 생깁니다. 그래서
          validation, execution, header construction과 peer filtering이 같은 immutable ChainSpec reference와
          current block context를 사용하고 decision receipt에 spec digest·fork·condition·context를 남깁니다.
        </p>
        <h3>
          Version을 고정하지 않은 code example은 설명 자료일 뿐 계약이 아닙니다
        </h3>
        <p>
          2026-08-14에 확인한 Reth 2.x crate docs의 <code>ChainSpec</code>은
          chain, genesis, sealed genesis header, hardforks, base-fee와 blob
          parameters 등을 노출합니다. Field·module path는 release에서 바뀔 수
          있으므로 실제 배포는 semver·git SHA·Cargo feature·chain spec bytes와
          digest를 기록하고 moving main의 layout을 production binary에 소급하지
          않습니다.
        </p>
      </div>

      <div
        id="paper-reth-chainspec-docs"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 API 읽기 · ChainSpec
        </p>
        <p className="mt-2 text-sm font-semibold">
          Reth ChainSpec documentation
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          확인할 것은 chain identity·genesis·hardfork·fee/blob parameter를 current Reth type이 어떻게 묶는가입니다. 문서는 field와
          query surface를 보여 주지만 임의 custom genesis의 안전성이나 모든 consumer가 같은 instance를 사용한다는 운영 사실까지 보장하지는 않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://reth.rs/docs/reth/chainspec/struct.ChainSpec.html"
          target="_blank"
          rel="noreferrer"
        >
          ChainSpec 공식 문서 보기
        </a>
      </div>
    </section>
  );
}
