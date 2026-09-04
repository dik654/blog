import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { KohakuMethodTrustViz, KohakuProviderSurfaceViz } from "./viz/ModernKohakuProviderViz";

export default function ModernKohakuProviderArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Kohaku Provider · adapter and trust boundary</p><h2 className="text-3xl font-bold tracking-tight">Kohaku Provider는 여러 Ethereum backend를 같은 method 모양으로 호출하게 하지만, backend의 신뢰 수준까지 같게 만들지는 않는다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Alice의 wallet이 Bob의 balance를 읽고 transaction을 보내는 흐름을 생각해 보겠습니다. Application은 <code>EthereumProvider&lt;T&gt;</code>에 balance·code·receipt·call 같은 공통 method를 요청하고, adapter는 Ethers, Viem, Helios 또는 Colibri 호출로 바꾼 뒤 결과 type을 정규화합니다. 서명과 전송 권한은 별도 <code>TxSigner</code> interface가 가집니다.</p>
      <p>이 구조의 핵심은 “한 API”와 “한 trust model”을 구분하는 데 있습니다. Ethers와 Viem이 configured RPC를 신뢰하는 방식, Helios가 light-client verification을 거치는 방식, 특정 method를 execution RPC로 bypass하는 방식은 결과 type이 같아도 provenance가 다릅니다. 이 글은 pinned provider package의 adapter 경계만 다루며 Kohaku 전체 privacy roadmap이나 wallet 기능을 provider의 현재 구현으로 확대하지 않습니다.</p>
      <KohakuProviderSurfaceViz />
      <ContentBoundary article="kohaku-provider" />
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>먼저 기억할 경계:</strong> Type parity는 값의 표현이 같다는 뜻이고, semantic parity는 같은 질문에 같은 의미로 답했다는 뜻이며, trust parity는 그 답을 뒷받침하는 검증 경로까지 같다는 뜻입니다.</aside>
    </section>

    <section id="provider-capabilities" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · common surface and normalization</p><h2 className="mt-2 text-2xl font-bold">공통 method 집합을 정의하고 backend별 반환값을 application이 비교할 수 있는 형태로 바꾼다</h2></header>
      <p>Pinned interface에는 chain ID, logs, block number, transaction wait, balance, code, receipt, raw request, call, gas estimate·price와 transaction count가 포함됩니다. Adapter는 예를 들어 receipt status를 공통 bigint 표현으로 맞추거나 code가 없을 때 일관된 hex 결과를 돌려줍니다. 이런 정규화가 없으면 application은 backend마다 다른 library type과 null convention을 직접 처리해야 합니다.</p>
      <p>하지만 method 이름이 같다고 block tag semantics, unsupported method, finality interpretation과 error behavior가 자동으로 같아지는 것은 아닙니다. Adapter contract에는 input·output뿐 아니라 unsupported state, timeout, backend identity와 provenance를 넣어야 합니다. Transaction hash는 submission receipt이고, mined receipt 또는 finalized inclusion과 같은 완료 상태가 아닙니다.</p>
      <div id="paper-kohaku-provider"><CitationBlock source="ethereum/kohaku provider interface · commit 8d5a29e" citeKey={1} type="code" href="https://github.com/ethereum/kohaku/blob/8d5a29e3fba806431c881f72c0bc9accb0066ace/packages/provider/src/provider.ts"><p><strong>문제:</strong> Ethers·Viem·Helios·Colibri를 사용하는 code가 서로 다른 provider APIs와 result types에 직접 결합되지 않아야 합니다.</p><p><strong>기여:</strong> Common <code>EthereumProvider&lt;T&gt;</code> method surface, normalized Ethereum types와 별도 <code>TxSigner</code> interface를 정의합니다.</p><p><strong>전제:</strong> Commit 8d5a29e와 package version 0.1.0-alpha.8, matching dependencies와 adapter configuration을 고정합니다.</p><p><strong>근거 범위:</strong> Pinned provider interface와 repository adapters가 선언한 현재 capability surface에 한정합니다.</p><p><strong>말하지 않는 것:</strong> 모든 backend가 모든 method를 같은 semantics·availability·trust로 제공하거나 package가 production-ready·audited라는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="trust-signing" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · method provenance and signer authority</p><h2 className="mt-2 text-2xl font-bold">검증 경로가 바뀌는 method를 표시하고 read capability와 signing authority를 분리한다</h2></header>
      <p>Pinned Helios adapter는 client가 sync될 때까지 기다린 다음 read methods를 제공합니다. 그러나 <code>getLogs</code>의 bypass option을 켜면 해당 호출을 execution RPC에 직접 보냅니다. 이는 성능을 위한 선택일 수 있지만, light-client verification을 거친 결과와 같은 provenance라고 표시하면 안 됩니다. Verified-only application이라면 bypass 결과를 조용히 받아들이지 말고 정책 오류로 거부해야 합니다.</p>
      <KohakuMethodTrustViz />
      <p>Provider가 balance와 code를 읽을 수 있다는 사실은 transaction을 서명할 권한을 뜻하지 않습니다. Pinned source는 <code>signMessage</code>, <code>sendTransaction</code>, <code>getAddress</code>를 <code>TxSigner</code>로 분리합니다. Application은 read-only provider를 기본으로 주입하고, 사용자 승인 뒤 필요한 signer scope만 짧게 전달해야 합니다. Backend fallback도 signer나 privacy policy를 자동 승격시키는 수단으로 쓰지 않습니다.</p>
      <ExplainedFormula
        question="Adapter를 교체해도 critical methods의 의미와 최소 신뢰 수준이 유지되었는가?"
        idea={<>각 method의 결과 parity와 provenance policy를 함께 검사합니다. 신뢰 수준은 우주의 절대 순서가 아니라 application이 미리 정한 ordered policy labels입니다.</>}
        formula={String.raw`\begin{aligned}A=\bigwedge_{m\in M_{crit}}\big(&[r_a(m)=r_o(m)]\\&\land[T_a(m)\ge T_{req}(m)]\big)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}A=\bigwedge_{m\in M_{crit}}\big(&[r_a(m)=r_o(m)]\\&\land[T_a(m)\ge \underbrace{T_{req}(m)]\big)}_{\text{판정 조건 결합}}\end{aligned}`}
        operations={[
          { expression: String.raw`T_{req}(m)]\big)`, annotation: ["observed trust label이(가) 식의 결과에","기여하는 방식을 계산합니다.","각 method의 결과 parity와 provenance","policy를 함께 검사합니다."] },
        ]}
        terms={[
          { symbol: "M_crit", name: "critical methods", description: "Balance·code·receipt·logs처럼 release에서 비교하기로 정한 method 집합입니다." },
          { symbol: "r_a,r_o", name: "candidate와 oracle 결과", description: "같은 chain·block tag·request fixture에서 정규화한 결과입니다." },
          { symbol: "T_a", name: "observed trust label", description: "해당 호출이 실제로 거친 verified·trusted RPC 같은 provenance입니다." },
          { symbol: "T_req", name: "required trust label", description: "Method별 application policy가 요구하는 최소 provenance입니다." },
        ]}
        assumptions={[
          "Chain ID, exact block hash/tag, provider commit와 backend endpoints를 고정합니다.",
          "Trust labels의 순서는 deployment policy에 명시하며 서로 다른 threat model을 임의로 한 숫자에 합치지 않습니다.",
          "Result equality는 canonical normalization 뒤 비교하고 unsupported와 timeout을 성공값으로 바꾸지 않습니다.",
          "A=true는 wallet privacy, endpoint availability나 signer key safety 전체를 증명하지 않습니다.",
        ]}
        interpretation="Balance와 code가 verified provenance를 요구하는 정책에서 Helios의 검증 경로는 통과할 수 있습니다. getLogs bypass가 trusted-RPC label만 가진다면 값이 oracle과 같아도 verified-only 요구에는 실패합니다."
      />
      <div id="paper-kohaku-helios"><CitationBlock source="Kohaku Helios adapter · commit 8d5a29e" citeKey={2} type="code" href="https://github.com/ethereum/kohaku/blob/8d5a29e3fba806431c881f72c0bc9accb0066ace/packages/provider/src/helios/index.ts"><p><strong>문제:</strong> Helios-backed provider를 공통 API로 노출하면서 synchronization과 method별 우회 경로를 처리해야 합니다.</p><p><strong>기여:</strong> Helios client initialization·sync wait, common methods와 optional <code>getLogs</code> execution-RPC bypass를 구현합니다.</p><p><strong>전제:</strong> Commit 8d5a29e, exact Helios dependency, consensus/execution RPC endpoints와 bypass configuration을 고정합니다.</p><p><strong>근거 범위:</strong> Pinned adapter의 initialization, read method와 explicit logs bypass behavior에 한정합니다.</p><p><strong>말하지 않는 것:</strong> Bypass 결과가 light-client verified라는 뜻도, Helios가 모든 provider method와 operational failure를 동일하게 처리한다는 뜻도 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · failure, retry and release</p><h2 className="mt-2 text-2xl font-bold">Alpha package는 exact commit으로 고정하고 silent downgrade가 없는지 method별로 검증한다</h2></header>
      <p>
            Parity fixture는 같은 block hash에서 balance·code·logs·receipt·gas estimate를 각 adapter로 호출합니다. Null,
            missing code, receipt status와 bigint conversion을 canonical form으로 맞춘 뒤 값과 error class를 비교하고
            timeout·unsupported·stale backend·reorg를 별도 negative cases로 남깁니다. Verified backend가 실패했을 때 trusted
            fallback으로 바뀌면 반드시 provenance를 노출하고 policy 승인을 다시 받아야 합니다.
          </p>
      <p>Release bundle에는 Kohaku commit, provider package version, Ethers·Viem·Helios·Colibri dependency versions, endpoint roles, bypass flags와 signer wiring을 담습니다. Canary에서 method parity, latency, failure rate, endpoint exposure와 signer prompts를 관찰하고 mismatch가 나면 이전 bundle로 rollback합니다. 이미 broadcast한 transaction은 다시 서명해 보내지 말고 hash·nonce로 receipt를 조회해 duplicate external effect를 막습니다.</p>
      <div id="paper-kohaku-repo"><CitationBlock source="ethereum/kohaku repository · commit 8d5a29e" citeKey={3} type="code" href="https://github.com/ethereum/kohaku/tree/8d5a29e3fba806431c881f72c0bc9accb0066ace"><p><strong>문제:</strong> Ethereum wallet privacy와 security tooling을 여러 packages와 research tracks로 개발하면서 현재 maturity를 분명히 표시해야 합니다.</p><p><strong>기여:</strong> Provider를 포함한 monorepo package layout, current versioned source와 project-level readiness notices를 제공합니다.</p><p><strong>전제:</strong> 2026-08-14에 확인한 commit 8d5a29e와 각 package의 own README·manifest를 함께 읽습니다.</p><p><strong>근거 범위:</strong> 해당 snapshot의 repository structure, code와 명시된 WIP·unaudited status에 한정합니다.</p><p><strong>말하지 않는 것:</strong> Roadmap의 privacy 기능이 provider package에 이미 구현되었거나 코드가 production-ready·audited라는 뜻은 아닙니다.</p></CitationBlock></div>
      <h3 className="text-xl font-semibold">이 글만으로 확인할 10가지</h3>
      <p>기초 6문제는 provider의 보장 범위, common methods, normalization, Helios bypass, signer 분리와 alpha 완료 상태를 묻습니다. 심화 4문제는 method trust matrix, cross-adapter parity, silent downgrade 차단과 canary·rollback plan을 설계하게 합니다.</p>
    </section>
  </article>;
}
