import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import NodeBuilderViz from "./viz/NodeBuilderViz";
import { codeRefs } from "./codeRefs";
import RethCliLocator from "./RethCliLocator";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <RethCliLocator />
      <ContextViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>실무에서 확정할 질문</h2>
        <p className="text-lg leading-8">
          <code>reth node</code>를 실행했다고 해서 곧바로 요청을 받을 수 있는 노드가 된 것은 아닙니다. 명령행과 설정 파일을
          <code>NodeConfig</code>로 정리하고, 체인·데이터 경로·JWT·포트를 확인하며, 호환되는 핵심 부품을 조립한 뒤 실제
          저장소와 네트워크 서비스를 시작해야 합니다. 이 글은 <strong>누가 어떤 상태를 만들고, 어느 실패부터 런타임의 책임인지</strong>를
          한 번의 시작 과정으로 추적합니다.
        </p>
        <p>
          실행 클라이언트가 블록을 검증·실행·저장하는 원리는 <Link to="/cs/blockchain/reth#overview">Reth 전체 구조</Link>에서
          가져옵니다. 여기서는 그 기능을 다시 설명하지 않고, 같은 구조를 재현 가능한 설정과 실패 원인이 남는 시작 절차로 만드는 데
          집중합니다. 공식 기능은 <strong>[O]</strong>, 아직 이 저장소에서 실행하지 않은 설계 판단은 <strong>[A]</strong>로 구분합니다.
        </p>
      </div>

      <ContentBoundary article="reth-cli" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>상태 소유자를 먼저 나눕니다</h2>
        <p>
          CLI는 명령행·설정 파일·기본값을 읽어 최종 설정과 값의 출처를 정합니다. NodeBuilder는 노드 형식과 핵심 부품의 호환 관계를
          Rust 형식으로 제한합니다.
        </p>
        <p>
          그다음 런타임이 데이터베이스·소켓·P2P·Engine API·RPC 작업을 실제로 시작합니다. 프로세스 생존이나
          <code>NodeHandle</code> 반환은 이 가운데 일부 상태일 뿐입니다. 동기화와 요청 처리까지 정상이라는 뜻은 아닙니다.
        </p>

        <h2>최종값만 남기지 말고 값이 선택된 이유를 남깁니다</h2>
        <p>
          설명용으로 기본 포트가 8545이고, 설정 파일이 9545, 명령행이 10545를 지정했다고 하겠습니다. 사용 중인 릴리스에서
          명령행 값이 우선한다면 결과에는 <code>http.port=10545</code>뿐 아니라 <code>source=cli</code>와 가려진 후보도 남겨야 합니다.
          그래야 잘못된 플래그나 설정 주입을 추적할 수 있습니다. 실제 우선순위·지원 플래그·기본값은 실행할 바이너리의
          <code>reth node --help</code>와 설정 스키마가 기준입니다.
        </p>
        <p>
          체인 파일을 읽지 못하거나 JWT 비밀값이 없고, 두 서버가 같은 주소에 연결하려 하거나, 선택한 체인과 기존 데이터베이스의
          정체성이 다르면 일부 공개 서비스만 열린 채 남지 않도록 시작을 중단해야 합니다. 문자열 해석 성공은 유효한 배포라는 뜻이
          아니며 파일 권한·소켓 연결·저장 형식 호환성은 시작 단계에서 따로 확인됩니다.
          <CodeViewButton onClick={() => open("cli-main")} />
        </p>

        <h2>실행 기록이 현재 문서와 실제 바이너리를 구분합니다</h2>
        <p>
          최소 실행 기록에는 Reth 버전과 Git 커밋, 빌드 기능, 민감정보를 지운 명령행, 설정·ChainSpec 요약값, 저장 형식과 가지치기
          정책, 데이터 경로의 정체성, RPC·P2P 연결 주소, Engine API 버전, 운영체제와 하드웨어를 넣습니다. 이 글은 2026-10-27에
          v2.8.1 릴리스와 공식 문서를 확인했지만, 현재 문서의 형식 이름과 기본값을 이전 바이너리에 소급하지 않습니다.
        </p>
      </div>

      <NodeBuilderViz onOpenCode={open} />

      <div
        id="paper-reth-node-cli"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">[O] 공식 CLI · 2026-10-27 확인</p>
        <p className="mt-2 text-sm font-semibold">Reth Book — reth node</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공식 명령 참고서는 <code>--config</code>·<code>--chain</code>·<code>--instance</code> 등 현재 입력 표면을 보여줍니다.
          다만 특정 릴리스의 모든 기본값, 파일 시스템 상태, 운영 준비까지 증명하지는 않으므로 바이너리 버전과 실제
          <code>--help</code> 출력을 함께 보관합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://reth.rs/cli/reth/node/"
          target="_blank"
          rel="noreferrer"
        >
          공식 CLI 문서
        </a>
      </div>
    </section>
  );
}
