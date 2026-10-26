import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import ChainSpecViz from "./viz/ChainSpecViz";
import { codeRefs } from "./codeRefs";
import RethChainSpecLocator from "./RethChainSpecLocator";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <RethChainSpecLocator />

      <h2 className="mb-6 text-2xl font-bold">
        체인 번호만 같아서는 같은 체인이라고 할 수 없습니다
      </h2>
      <ContextViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          체인 번호가 777인 두 설정을 생각해 보겠습니다. 첫 설정에서 Alice의 초기 잔액은 100이고, 두 번째 설정은 101입니다. 나머지
          값이 모두 같아도 초기 계정에서 계산한 상태 루트가 달라지고, 그 값을 담은 첫 블록의 해시도 달라집니다. 두 노드는 같은 번호를
          말하지만 같은 장부에서 출발하지 않습니다.
        </p>
        <p>
          첫 상태가 같아도 규칙 변경 시각이 다르면 문제가 남습니다. 변경 시각을 1,000이라고 할 때 후보 헤더의 시각 999는 이전 규칙을,
          1,000은 새 규칙을 선택합니다. 따라서 노드가 같은 블록을 계산하려면 <strong>첫 상태와 규칙 변경 일정, 계산에 쓰는
          매개변수</strong>가 모두 같아야 합니다.
        </p>
        <p>
          Reth는 이 묶음을 <strong>체인 명세(ChainSpec)</strong>로 다룹니다. 이 글은
          <Link to="/cs/blockchain/reth#overview"> Reth 전체 구조</Link>에서 검증·실행·저장 경로를 가져오고, 그 경로가 어느
          규칙을 선택하는지만 확대합니다.
        </p>
      </div>

      <ContentBoundary article="reth-chainspec" />

      <h2 className="mb-6 mt-12 text-2xl font-bold">
        규칙 묶음과 현재 블록을 함께 읽습니다
      </h2>
      <ChainSpecViz onOpenCode={open} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Reth v2.8.1의 <code>ChainSpec</code>에는 체인 번호, 제네시스 입력과 봉인된 첫 헤더, 순서가 있는 하드포크 조건,
          기본 수수료와 블롭 매개변수가 들어 있습니다. 체인 번호는 이 묶음의 한 필드일 뿐입니다.
          <CodeViewButton onClick={() => open("chainspec-struct")} />
        </p>
        <p>
          블록 검증기는 헤더가 허용되는지 판단합니다. EVM은 어느 명령과 가스 규칙을 적용할지 고릅니다. 페이로드 빌더는 후보 블록에
          어떤 필드를 넣을지 정하고, 네트워크는 상대 피어의 변경 일정이 우리와 맞는지 먼저 거릅니다. 네 경로가 같은
          <code>ChainSpec</code>과 같은 후보 블록 문맥을 읽어야 결과가 일치합니다.
        </p>
        <p>
          형식 이름이 같다는 사실만으로 실행 중인 값까지 같다고 단정할 수는 없습니다. 확인할 때는 Reth 버전과 Git 커밋,
          <code>ChainSpec</code> 원본 또는 요약값, 제네시스 해시, 하드포크 일정을 함께 고정합니다. 이 글의 구현 설명은
          2026-10-27에 확인한 Reth v2.8.1 태그와 그 릴리스가 사용하는 <code>alloy-hardforks 0.4.11</code>에 한정됩니다.
        </p>
      </div>

      <div
        id="paper-reth-chainspec-docs"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">[O] 공식 소스 · Reth v2.8.1</p>
        <p className="mt-2 text-sm font-semibold">ChainSpec 구조와 조회 경계</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공식 태그의 <code>crates/chainspec/src/spec.rs</code>는 체인·제네시스·하드포크·수수료·블롭 설정을 묶는 실제 구조를
          보여줍니다. 이 구조체가 존재한다는 사실은 모든 소비자가 실행 중에 같은 인스턴스를 사용한다는 운영 증명은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/chainspec/src/spec.rs"
          target="_blank"
          rel="noreferrer"
        >
          v2.8.1 ChainSpec 소스 보기
        </a>
      </div>
    </section>
  );
}
