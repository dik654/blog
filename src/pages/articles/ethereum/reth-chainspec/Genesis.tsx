import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import GenesisViz from "./viz/GenesisViz";
import { codeRefs } from "./codeRefs";
import { RethChainSpecMapReturn } from "./RethChainSpecLocator";

export default function Genesis({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="genesis" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        초기 계정 하나가 첫 블록의 해시까지 바꿉니다
      </h2>
      <GenesisViz onOpenCode={open} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          체인이 시작할 때 사용할 초기 계정과 헤더 값을 적은 입력을 <strong>제네시스(Genesis)</strong>라고 합니다. Alice의 잔액 100은
          계정 형식으로 바뀌고 상태 트리에 들어갑니다. 전체 트리에서 얻은 상태 루트 <code>R₁₀₀</code>은 첫 블록 헤더의 한 필드가 되고,
          헤더 전체에서 첫 블록 해시 <code>G₁₀₀</code>을 얻습니다.
        </p>
        <p>
          잔액을 101로 바꾸면 계정 인코딩과 트리 경로가 달라져 <code>R₁₀₁</code>이 만들어집니다. 상태 루트가 달라진 헤더는 같은 해시를
          낼 수 없으므로 <code>G₁₀₁</code>도 달라집니다. 체인 번호 777이 같아도 두 설정은 같은 첫 블록을 가리키지 않습니다.
        </p>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>첫 블록도 시작 시점의 규칙을 따릅니다</h3>
        <p>
          Reth v2.8.1의 <code>make_genesis_header</code>는 초기 계정에서 상태 루트를 계산할 뿐 아니라, 시작 시점에 London·Shanghai·Cancun·
          Prague·Amsterdam이 활성인지 확인해 조건부 헤더 필드를 채웁니다. 최신 헤더 필드를 무조건 넣거나 메인넷의 필드 목록을 사용자
          체인에 그대로 복사하면 다른 첫 블록이 만들어질 수 있습니다.
          <CodeViewButton onClick={() => open("make-genesis")} />
        </p>
        <p>
          기본 제공 메인넷 설정은 계산한 헤더와 알려진 <code>MAINNET_GENESIS_HASH</code>를 묶습니다. 사용자 정의 설정을 만드는 빌더는
          <code>make_genesis_header</code>의 결과를 해시가 아직 계산되지 않은 봉인 헤더에 넣습니다. 따라서 JSON을 읽는 데 성공했다는
          사실과 첫 블록의 정체성이 맞는다는 판정은 구분해야 합니다.
          <CodeViewButton onClick={() => open("mainnet-spec")} />
          <CodeViewButton onClick={() => open("custom-spec-build")} />
        </p>

        <h3>잘못된 설정은 어디에서 드러날까요?</h3>
        <p>
          초기 잔액이 다르면 상태 루트와 제네시스 해시가 달라집니다. 규칙 변경 시각이 다르면 경계 블록부터 실행 결과가 달라집니다.
          네트워크의 Fork ID 검사는 이런 불일치를 피어 연결 초기에 일부 발견하지만, 개별 블록 검증을 대신하지는 않습니다.
        </p>
        <p>
          개념을 확인하는 최소 테스트는 같은 입력을 다시 계산했을 때 같은 상태 루트와 첫 블록 해시가 나오는지, 초기 잔액 100을 101로
          바꿨을 때 두 값이 달라지는지, 시각 999·1,000·1,001에서 모든 소비자가 이전·새·새 규칙을 고르는지 확인하는 것입니다. 이 테스트는
          성능 비교나 운영 배포 계획이 아니라 규칙 선택 자체의 정확성을 확인합니다.
        </p>
      </div>

      <div
        id="paper-reth-chainspec-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">[O] 공식 구현 · 2026-10-27 확인</p>
        <p className="mt-2 text-sm font-semibold">Reth v2.8.1 제네시스 헤더 생성</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공식 태그의 함수는 초기 계정에서 상태 루트를 계산하고 시작 시점에 활성인 규칙에 따라 조건부 헤더 필드를 채웁니다. 이 구현을
          읽었다고 사용자 정의 체인의 경제적 안전성이나 다른 클라이언트와의 상호운용성이 자동으로 증명되는 것은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/chainspec/src/spec.rs#L45-L108"
          target="_blank"
          rel="noreferrer"
        >
          make_genesis_header 소스 보기
        </a>
      </div>

      <aside className="not-prose my-8 border-y border-border py-5" aria-label="읽고 바로 확인할 질문">
        <p className="text-[10px] font-bold text-primary">읽고 바로 확인하기</p>
        <ol className="mt-3 space-y-3 text-sm leading-6">
          <li><strong>1.</strong> 체인 번호 777이 같아도 Alice의 초기 잔액이 다르면 왜 같은 체인이 아닐까요? <span className="text-muted-foreground">(답: 1절·3절)</span></li>
          <li><strong>2.</strong> 변경 시각 1,000에서 후보 헤더 시각 999와 1,000은 각각 어느 규칙을 고를까요? <span className="text-muted-foreground">(답: 2절)</span></li>
          <li><strong>3.</strong> Fork ID가 통과하면 개별 블록 검증을 생략해도 될까요? <span className="text-muted-foreground">(답: 2절)</span></li>
        </ol>
      </aside>

      <RethChainSpecMapReturn />
    </section>
  );
}
