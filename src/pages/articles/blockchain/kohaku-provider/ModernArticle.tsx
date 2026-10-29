import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import KohakuProviderLocator, { KohakuProviderMapReturn } from "./KohakuProviderLocator";
import { kohakuProviderCodeRefs } from "./codeRefsReal";
import { KohakuProviderTraceViz, KohakuSignerBoundaryViz } from "./viz/ModernKohakuProviderViz";

const KOHAKU_SHA = "b4ad096ef738a06f3f7025aa2870875527f9e6c7";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ModernKohakuProviderArticle({ onCodeRef }: Props) {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6 scroll-mt-20">
        <KohakuProviderLocator current="kohaku-provider" />
        <header className="space-y-3">
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="break-keep text-3xl font-bold tracking-tight">
            같은 getLogs 호출은 왜 backend에 따라 다른 신뢰 경로를 지날까요?
          </h2>
        </header>
        <p className="max-w-3xl break-keep text-lg leading-8">
          Kohaku Provider는 Ethers·Viem·Helios·Colibri 같은 backend를 하나의 <code>EthereumProvider&lt;T&gt;</code>로 감쌉니다. 애플리케이션은 같은 메서드와 반환 타입을 쓰지만, 그 답을 만든 검증 경로까지 같아지지는 않습니다.
        </p>
        <KohakuProviderTraceViz />
        <p>
          그림은 block 17의 log를 읽는 설명용 요청 하나를 추적합니다. 이 요청을 <code>logs-17</code>이라고 부르지만 실제 프로토콜 필드는 아닙니다. 읽는 순서는 애플리케이션→공통 interface→Helios adapter→선택한 backend→결과 정규화입니다. 우회 설정이 바뀌는 순간 데이터 출처가 갈라지는 지점을 먼저 보시면 됩니다.
        </p>
        <p>
          결론은 간단합니다. 공통 interface는 호출 모양과 값의 표현을 통일합니다. 어떤 backend가 답했고 무엇을 검증했는지는 별도 구성과 실행 증거로 확인해야 합니다. 이 글은 현재 구현 메커니즘만 설명하며, 실제 bundle 채택과 rollback은 <Link to="/cs/blockchain/kohaku-provider-validation#overview">Kohaku Provider 변경 검증</Link>에서 다룹니다.
        </p>
        <ContentBoundary article="kohaku-provider" />
      </section>

      <section id="provider-interface" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공통 interface는 메서드와 반환 타입을 고정합니다</h2>
        <p>
          Kohaku 0.1.0-alpha.13의 <code>EthereumProvider&lt;T&gt;</code>에는 chain ID, block number, logs, balance, code, receipt, call, gas, nonce와 raw request가 있습니다. 각 adapter는 이 계약에 맞춰 backend 호출을 바꾸고 결과를 공통 타입으로 돌려줍니다.
        </p>
        <p>
          이 interface에 메서드가 있다는 사실은 모든 backend가 같은 범위와 속도로 지원한다는 뜻이 아닙니다. API에 메서드가 보이는 것과 실제로 쓸 수 있는 범위는 분리해서 봐야 합니다.
        </p>
        <p>
          예를 들어 Helios adapter의 소스 주석은 일반 <code>getLogs</code>가 최신 8,191개 block 범위에 한정되고 느릴 수 있다고 적습니다.{" "}
          <CodeViewButton
            label="EthereumProvider와 TxSigner 소스"
            onClick={() => onCodeRef("kohaku-provider-interface", kohakuProviderCodeRefs["kohaku-provider-interface"])}
          />
        </p>
        <KohakuSignerBoundaryViz />
        <p>
          읽기 계약과 서명 계약도 나뉩니다. <code>signMessage</code>, <code>sendTransaction</code>, <code>getAddress</code>는 별도 <code>TxSigner</code>에 있습니다. 다만 TypeScript interface 분리는 설계 경계일 뿐입니다. 키 보관, 사용자 승인, signer 수명과 재시도 정책은 애플리케이션이 구현해야 합니다.
        </p>
      </section>

      <section id="getlogs-route" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Helios adapter는 준비 단계와 요청 경로를 따로 결정합니다</h2>
        <p>
          Adapter를 만들 때는 먼저 <code>executionRpc</code>가 있는지 확인합니다. Helios client를 만든 다음 <code>waitSynced()</code>가 끝나야 공통 Provider를 반환합니다. 그래서 애플리케이션이 Provider를 받은 시점에는 이 초기 동기화 조건을 통과한 상태입니다.
        </p>
        <p>
          그다음 <code>bypassLogs</code>가 <code>getLogs</code>의 실제 경로를 고릅니다. 기본값은 <code>false</code>이므로 Helios client가 요청을 처리합니다. <code>true</code>이면 <code>eth_getLogs</code>만 설정된 execution RPC로 직접 보내고, 다른 메서드는 계속 Helios client를 사용합니다.{" "}
          <CodeViewButton
            label="Helios adapter의 두 경로"
            onClick={() => onCodeRef("kohaku-helios-route", kohakuProviderCodeRefs["kohaku-helios-route"])}
          />
        </p>
        <p>
          우회는 adapter 전체를 다른 backend로 바꾸는 선택이 아닙니다. 메서드 하나의 데이터 경로만 바꿉니다. 따라서 “Helios Provider를 쓴다”는 한 줄만으로 모든 응답이 light-client 경로를 지났다고 판단하면 안 됩니다.
        </p>
      </section>

      <section id="normalization" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정규화는 값의 모양을 맞추지만 출처를 보존하지 않습니다</h2>
        <p>
          선택된 backend가 RPC log를 돌려주면 raw adapter가 <code>blockNumber</code>를 bigint로 바꾸고 선택적 <code>logIndex</code>를 number로 바꿉니다. Receipt도 status·gasUsed·logs를 공통 타입으로 정리합니다.
        </p>
        <p>
          애플리케이션은 backend별 hex 변환과 null 규칙을 반복하지 않아도 됩니다.{" "}
          <CodeViewButton
            label="raw adapter의 TxLog 변환"
            onClick={() => onCodeRef("kohaku-raw-normalize", kohakuProviderCodeRefs["kohaku-raw-normalize"])}
          />
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Provider가 통일하는 세 단계와 남는 경계">
          <div className="bg-background p-4">
            <strong className="text-sm">호출 모양</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground"><code>getLogs(filter)</code>처럼 application이 쓰는 method를 맞춥니다.</p>
          </div>
          <div className="bg-background p-4">
            <strong className="text-sm">값 표현</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Hex 숫자와 선택 필드를 공통 <code>TxLog[]</code>로 바꿉니다.</p>
          </div>
          <div className="bg-background p-4">
            <strong className="text-sm">남는 경계</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Backend·verification·지원 범위·오류 의미는 반환 타입만으로 알 수 없습니다.</p>
          </div>
        </div>
        <p>
          그래서 type parity와 trust parity를 구분해야 합니다. 두 결과가 모두 <code>TxLog[]</code>인 것은 type parity입니다. 두 결과가 같은 chain과 block을 가리키는지는 semantic parity이고, 같은 검증 절차를 거쳤는지는 trust parity입니다. 현재 <code>TxLog</code> 반환값 자체에는 이 provenance가 들어 있지 않습니다.
        </p>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">설계된 실패는 자동 downgrade가 아니라 오류입니다</h2>
        <p>
          고정한 Helios adapter는 <code>executionRpc</code>가 없으면 초기화를 거부합니다. Helios client 생성이나 <code>waitSynced()</code>가 실패해도 Provider를 반환하지 않습니다. 우회 경로의 fetch·JSON decode·RPC error도 호출 오류로 전파됩니다. 이 소스에는 실패한 Helios 요청을 다른 backend로 조용히 바꾸는 fallback이 없습니다.
        </p>
        <p>
          이 동작은 중요한 경계를 만듭니다. 가용성을 높이려고 fallback을 추가하는 순간, 어떤 오류에 어떤 backend로 바꾸며 그 사실을 누가 기록하는지 새 정책이 필요합니다. 그것은 Provider의 현재 메커니즘이 아니라 환경별 운영 결정입니다.
        </p>
        <div className="not-prose border-y border-border py-4 text-sm leading-6">
          <p><strong>[O] 현재 구현:</strong> alpha.13의 interface, Helios 경로, raw 정규화와 오류 전파입니다.</p>
          <p className="mt-2"><strong>[A] 운영 제안:</strong> method별 provenance 기록, verified-only 차단과 signer 승인 정책입니다.</p>
          <p className="mt-2"><strong>[M] 대상 환경:</strong> 정확성·latency·timeout·가용성은 아직 측정하지 않았습니다.</p>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">고정한 소스가 말하는 범위까지만 결론을 냅니다</h2>
        <div id="paper-kohaku-provider" className="scroll-mt-24">
          <CitationBlock
            source="ethereum/kohaku · @kohaku-eth/provider 0.1.0-alpha.13"
            citeKey={1}
            type="code"
            href={"https://github.com/ethereum/kohaku/tree/" + KOHAKU_SHA + "/packages/provider"}
          >
            <p><strong>문제:</strong> 여러 Ethereum backend를 같은 application API로 호출하면서 method별 검증 경계를 잃지 않아야 합니다.</p>
            <p><strong>기여:</strong> EthereumProvider·TxSigner interface, Helios adapter, raw 정규화와 receipt waiting을 구현합니다.</p>
            <p><strong>전제:</strong> 0.1.0-alpha.13, commit {KOHAKU_SHA.slice(0, 8)}와 실제 peer dependency·configuration을 함께 고정합니다.</p>
            <p><strong>근거 범위:</strong> 이 릴리스의 공개 package source와 README·CHANGELOG입니다.</p>
            <p><strong>말하지 않는 것:</strong> 모든 backend의 동일한 semantics·availability·privacy, production readiness 또는 audit 완료를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-kohaku-helios" className="scroll-mt-24">
          <CitationBlock
            source="Kohaku Helios adapter · alpha.13"
            citeKey={2}
            type="code"
            href={"https://github.com/ethereum/kohaku/blob/" + KOHAKU_SHA + "/packages/provider/src/helios/index.ts"}
          >
            <p><strong>문제:</strong> Helios-backed Provider를 만들면서 sync 조건과 getLogs 우회 경로를 처리합니다.</p>
            <p><strong>기여:</strong> executionRpc 필수 검사, waitSynced, bypassLogs 분기와 공통 raw adapter 연결을 보여 줍니다.</p>
            <p><strong>근거 범위:</strong> 초기화와 getLogs 요청 경로입니다.</p>
            <p><strong>말하지 않는 것:</strong> execution RPC 우회 결과가 light-client verified라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>EthereumProvider가 통일하는 것과 통일하지 않는 것은 무엇입니까? <strong>(답: 공통 interface)</strong></li>
          <li>bypassLogs=true일 때 getLogs와 다른 method의 경로는 어떻게 달라집니까? <strong>(답: getLogs 경로)</strong></li>
          <li>두 backend가 같은 TxLog[]를 돌려줘도 verified-only 정책을 통과했다고 말할 수 없는 이유는 무엇입니까? <strong>(답: 정규화)</strong></li>
        </ol>
      </section>

      <KohakuProviderMapReturn current="kohaku-provider" />
    </article>
  );
}
