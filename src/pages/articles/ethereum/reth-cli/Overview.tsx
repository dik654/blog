import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import NodeBuilderViz from "./viz/NodeBuilderViz";
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
        Reth CLI의 핵심은 옵션을 많이 받는 것이 아니라 재현 가능한 node assembly
        입력을 만드는 것이다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          <code>reth node</code>는 문자열 인자를 읽고 곧바로 서비스를 켜지
          않습니다. CLI·config file·default에서 온 값을 하나의 typed{" "}
          <code>NodeConfig</code>로 정규화하고, chain spec·data
          directory·network·RPC·Engine API·storage 설정이 서로 모순되지 않는지
          확인한 뒤 node builder에 넘깁니다. 이 경계를 분명히 해야 같은 명령을
          다시 실행했을 때 어떤 설정으로 어느 node가 시작됐는지 재현할 수
          있습니다.
        </p>
        <p>
          이 글은{" "}
          <strong>
            입력 provenance→config 검증→typestate assembly→component
            lifecycle→release gate
          </strong>{" "}
          순서로 진행합니다. <Link to="/blockchain/reth">Reth 구조</Link>가
          execution client 전체의 block lifecycle을 소유하므로, 여기서는 그
          정의를 복제하지 않고 “그 lifecycle을 안전하게 시작하는 방법”에
          집중합니다.
        </p>
      </div>

      <ContentBoundary article="reth-cli" />
      <ContextViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 알아둘 최소 개념</h3>
        <p>
          <strong>Config precedence</strong>는 같은 설정이 여러 source에 있을 때
          어느 값을 채택할지 정한 우선순위이고,
          <strong>typestate</strong>는 현재 조립 단계를 Rust type으로 표현해
          아직 허용되지 않은 method를 호출하지 못하게 하는 패턴입니다.{" "}
          <strong>Component</strong>는 pool·network·executor처럼 core node가
          동작하는 데 필요한 서비스이고,
          <strong>add-on</strong>은 RPC·ExEx·hook처럼 core lifecycle에 붙는
          확장입니다.
        </p>

        <h3>같은 값의 source와 최종값을 모두 기록합니다</h3>
        <p>
          예를 들어 default HTTP port가 8545이고 config file이 9545를 지정했으며
          CLI가 10545를 지정했다면, 문서화된 precedence가{" "}
          <code>CLI &gt; file &gt; default</code>일 때 최종값은 10545입니다.
          하지만 receipt에는 숫자 하나만 남기지 않고{" "}
          <code>http.port=10545, source=cli</code>와 가려진 후보까지 남겨야
          잘못된 flag·환경 주입을 추적할 수 있습니다. 실제 precedence와 지원
          flag는 실행한 Reth release의 <code>reth node --help</code>와 config
          schema가 기준입니다.
        </p>
        <p>
          Chain path를 못 읽거나 JWT secret이 없고, 서로 같은 address에 두
          server가 bind하려 하거나, 선택한 chain과 기존 database identity가
          다르면 일부 service만 켜지기 전에 fail-closed해야 합니다. Parse 성공은
          유효한 deployment라는 뜻이 아니며 filesystem permission·socket
          bind·storage schema compatibility는 launch 단계에서 별도로 확인됩니다.
          <CodeViewButton onClick={() => open("cli-main")} />
        </p>

        <h3>Run manifest가 moving docs와 production binary를 분리합니다</h3>
        <p>
          최소 receipt에는 Reth semver와 git SHA, Cargo feature, command line의 민감정보 제거본, config digest, chain spec
          digest, storage schema·pruning profile, data directory identity, RPC·P2P bind address, Engine API
          version과 OS·hardware를 넣습니다. 이 글은 2026-08-14에 Reth 2.x 공식 문서와 source를 확인했지만 current docs의
          type·default를 이전 binary에 소급하지 않습니다. 예를 들어 v2.2.0 release에서 Discv5 default가 바뀌었다는 사실은 해당 release
          line의 migration 판단에만 사용합니다.
        </p>
      </div>

      <NodeBuilderViz onOpenCode={open} />

      <div
        id="paper-reth-node-cli"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 문서 읽기 · CLI contract
        </p>
        <p className="mt-2 text-sm font-semibold">Reth Book — reth node</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 operator input이 어떤 node configuration으로 해석되는지
          확인하는 것입니다. 공식 command reference는
          <code>--chain</code>·config path와 현재 flag surface를 제공하지만,
          특정 release의 hidden default·filesystem 상태·운영 안전성을 자동으로
          증명하지는 않으므로 binary version과 실제 <code>--help</code>를 함께
          고정합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://reth.rs/cli/reth/node.html"
          target="_blank"
          rel="noreferrer"
        >
          공식 CLI 문서 보기
        </a>
      </div>
    </section>
  );
}
