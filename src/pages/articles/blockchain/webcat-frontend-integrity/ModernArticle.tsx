import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import WebcatLocator, { WebcatMapReturn } from "./WebcatLocator";
import WebcatIntegrityViz from "./viz/WebcatIntegrityViz";

export default function ModernWebcatFrontendIntegrityArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6 scroll-mt-20">
        <WebcatLocator />
        <header className="space-y-3">
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="break-keep text-3xl font-bold tracking-tight">
            서버가 바꾼 app.js를 정상 HTTPS로 보내도 브라우저가 실행 전에 막을 수 있을까요?
          </h2>
        </header>
        <p className="max-w-3xl break-keep text-lg leading-8">
          HTTPS는 사용자가 인증서의 서버와 암호화된 채널로 통신했고, 전송 중 bytes가 바뀌지 않았음을 보입니다. 그러나 서버나 CDN이 침해된 뒤 악성 JavaScript를 직접 보내면 TLS는 그 응답도 정상적으로 보호합니다. 빠진 질문은 <strong>서버가 보낸 bytes가 개발자가 승인한 배포물과 같은가</strong>입니다.
        </p>
        <WebcatIntegrityViz />
        <p>
          그림은 사용자가 <code>/app.js</code> 하나를 받는 과정을 추적합니다. 배포 전에는 사이트 등록 정보, manifest 서명과 공개 증거를 고정합니다. 요청 시에는 브라우저 확장이 그 증거와 실제 <code>app.js</code>의 hash를 연결해 확인합니다. 서버 안에서 자체 검증하면 침해된 서버가 검사 결과까지 바꿀 수 있으므로 최종 차단 지점은 사용자 브라우저입니다.
        </p>
        <p>
          이 글은 이 검증 메커니즘만 설명합니다. 특정 서비스에 도입할지, 어떤 key custody와 release 절차를 쓸지는 별도의 실무 판단입니다.
        </p>
        <ContentBoundary article="webcat-frontend-integrity" />
      </section>

      <section id="enrollment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">브라우저가 먼저 믿는 것은 서버가 아니라 서명된 enrollment preload입니다</h2>
        <p>
          사이트 운영자는 <code>/.well-known/webcat/enrollment.json</code>에 manifest를 서명할 identity와 threshold, Sigsum 또는 Sigstore trust policy를 적습니다. WEBCAT enrollment infrastructure는 이 문서의 hash를 도메인의 canonical state에 연결합니다.
        </p>
        <p>
          현재 문서의 enrollment chain은 토큰이 없는 permissioned CometBFT ledger입니다. Validator 2/3가 합의한 canonical state에서 preload list를 만들고, block header와 Merkle proof를 함께 제공합니다. 브라우저 확장은 특정 validator 한 대의 응답을 믿지 않고 2/3 signature, 더 새로운 height·timestamp와 proof를 검사합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="사이트 등록 정보가 브라우저의 기준점이 되는 세 단계">
          <section className="bg-background p-4">
            <p className="font-mono text-[10px] font-bold text-primary">site operator</p>
            <strong className="mt-2 block text-sm">enrollment.json</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">허용한 signer와 trust policy를 선언합니다.</p>
          </section>
          <section className="bg-background p-4">
            <p className="font-mono text-[10px] font-bold text-primary">canonical state</p>
            <strong className="mt-2 block text-sm">domain → enrollment hash</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">2/3 validator 합의로 현재 등록 상태를 고정합니다.</p>
          </section>
          <section className="bg-background p-4">
            <p className="font-mono text-[10px] font-bold text-primary">browser extension</p>
            <strong className="mt-2 block text-sm">signed preload + proof</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">등록 문서가 canonical state와 같은지 사용자 쪽에서 확인합니다.</p>
          </section>
        </div>
        <p>
          등록 정책 변경에는 공개 대기 구간인 cooldown이 있습니다. 현재 alpha 문서는 1일, 이후에는 7일을 설명합니다. 이 값은 영구 규격으로 가정하지 않고 현재 공개 상태로만 읽어야 합니다.
        </p>
      </section>

      <section id="signed-manifest" className="space-y-6 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Manifest는 경로별 bytes와 CSP를 개발자 승인 상태로 고정합니다</h2>
        <p>
          Manifest는 추상적인 버전 이름이 아닙니다. <code>/index.html</code>과 <code>/app.js</code> 같은 path, 각 resource의 cryptographic hash, Content Security Policy와 metadata를 담은 JSON 문서입니다. 개발자는 enrollment의 trust policy에 맞게 manifest를 서명하고 transparency proof를 붙입니다.
        </p>
        <p>
          사이트가 제공하는 <code>/.well-known/webcat/bundle.json</code>은 enrollment 정보, 서명 manifest와 transparency proof를 묶은 파일입니다. 브라우저 확장은 이 bundle 하나를 가져온 뒤 자신이 가진 preload부터 실제 resource까지 검증 경로를 이어 갑니다.
        </p>
        <ExplainedFormula
          question="브라우저가 app.js를 실행해도 되는 조건은 무엇인가요?"
          idea="등록 상태, manifest 승인, 실제 resource와 CSP가 모두 같은 증거 사슬에 연결돼야 합니다."
          formula={String.raw`\begin{aligned}E&=\underbrace{V_{2/3}(P)\land[H(e)=P[d]]}_{\text{등록 상태 일치}}\\M&=\underbrace{V_{e}(m,\sigma,\pi)=1}_{\text{manifest 승인 증거}}\\R&=\underbrace{[H(r)=m[p]]\land[CSP_r=CSP_m]}_{\text{실제 응답 일치}}\\\mathrm{execute}&=\underbrace{E\land M\land R}_{\text{모두 참일 때만 실행}}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}E&=\underbrace{V_{2/3}(P)\land[H(e)=P[d]]}_{\text{등록 상태 일치}}\\M&=\underbrace{V_{e}(m,\sigma,\pi)=1}_{\text{manifest 승인 증거}}\\R&=\underbrace{[H(r)=m[p]]\land[CSP_r=CSP_m]}_{\text{실제 응답 일치}}\\\mathrm{execute}&=\underbrace{E\land M\land R}_{\text{모두 참일 때만 실행}}\end{aligned}`}
          operations={[
            { expression: String.raw`V_{2/3}(P)`, annotation: ["Preload P의 validator 2/3 signature와", "block·Merkle proof를 검증해", "브라우저의 등록 기준점을 만듭니다."] },
            { expression: String.raw`[H(e)=P[d]]`, annotation: ["사이트가 준 enrollment e의 hash가", "preload의 domain d 값과 같은지", "확인합니다."] },
            { expression: String.raw`V_e(m,\sigma,\pi)`, annotation: ["Enrollment trust policy로 manifest m의", "signature σ와 transparency proof π를", "검증합니다."] },
            { expression: String.raw`[H(r)=m[p]]`, annotation: ["실제로 받은 path p의 resource r을 hash해", "manifest가 승인한 값과 비교합니다.", "한 byte가 달라도 거짓입니다."] },
            { expression: String.raw`[CSP_r=CSP_m]`, annotation: ["응답의 CSP와 manifest의 CSP가", "같은지 확인해 서버가 실행 정책을", "느슨하게 바꾸지 못하게 합니다."] },
            { expression: String.raw`E\land M\land R`, annotation: ["세 묶음이 모두 참일 때만 page load를", "계속합니다. 하나라도 실패하면 content", "실행 전에 차단합니다."] },
          ]}
          terms={[
            { symbol: "P", name: "Enrollment preload", description: "Validator 2/3가 서명한 canonical state snapshot과 증명입니다." },
            { symbol: "e", name: "Enrollment information", description: "해당 도메인의 signer와 trust policy를 선언한 문서입니다." },
            { symbol: "m", name: "Manifest", description: "경로별 resource hash와 CSP를 담은 승인 배포물 목록입니다." },
            { symbol: "r", name: "Delivered resource", description: "브라우저가 서버에서 실제로 받은 app.js 같은 bytes입니다." },
          ]}
          assumptions={[
            "브라우저 확장이 가진 preload가 유효하고 rollback되지 않았습니다.",
            "실행 가능한 모든 resource와 CSP가 manifest coverage에 들어갑니다.",
            "Manifest의 signature와 transparency proof를 enrollment trust policy로 검증합니다.",
            "WEBCAT 자체 확장과 공급망은 신뢰 경계 밖의 별도 문제입니다.",
          ]}
          interpretation="HTTPS 성공은 이 식의 별도 전제일 뿐 E·M·R을 자동으로 참으로 만들지 않습니다. 실제 응답이 승인 배포물과 연결될 때만 실행합니다."
        />
      </section>

      <section id="local-verification" className="space-y-6 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">검증 결과는 app.js가 실행되기 전에 브라우저가 집행합니다</h2>
        <p>
          현재 WEBCAT은 Mozilla Add-ons로 배포되는 Firefox 확장입니다. 확장은 시작할 때와 주기적으로 preload를 갱신하고, 등록된 사이트를 열면 bundle을 가져와 enrollment, manifest, CSP와 모든 resource를 검사합니다. Chrome과 Brave는 Manifest V2 의존성 때문에 현재 호환되지 않으며, Firefox Android는 시험되지 않았고 Tor Browser에서는 동작하지 않는다고 사용자 문서가 밝힙니다.
        </p>
        <p>
          <code>/app.js</code>의 hash가 다르거나 manifest signature, threshold, timestamp, CSP, enrollment 검증 중 하나가 실패하면 전용 오류 화면으로 이동합니다. 오류 코드는 실패 단계를 구분합니다. 따라서 최종 결과는 “경고만 남기고 계속 실행”이 아니라 page load 차단입니다.
        </p>
        <div className="not-prose space-y-px bg-border p-px" aria-label="HTTPS, SRI, CSP와 WEBCAT이 확인하는 경계">
          {[
            ["HTTPS", "사용자와 서버 사이 채널", "서버가 개발자 승인 bytes를 보냈는지는 모릅니다."],
            ["SRI", "HTML이 가리킨 개별 resource hash", "침해된 first-party가 HTML의 hash도 함께 바꿀 수 있습니다."],
            ["CSP", "불러오고 실행할 resource의 origin·종류", "침해된 first-party가 header나 meta policy를 바꿀 수 있습니다."],
            ["WEBCAT", "등록된 signer가 승인한 manifest와 실제 응답", "승인된 코드의 취약점과 개발자의 악의는 판정하지 않습니다."],
          ].map(([term, checks, boundary]) => (
            <div key={term} className="grid min-w-0 gap-1 bg-background p-4 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4">
              <strong className="text-sm">{term}</strong>
              <p className="text-xs leading-5">{checks}</p>
              <p className="text-xs leading-5 text-muted-foreground">{boundary}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">차단 가능한 공격과 남는 실패를 분리해야 합니다</h2>
        <p>
          공개 threat model은 침해된 web server, 제한된 기간의 domain·TLS key 탈취, enrollment validator 1/3 이하 장악 같은 조건에서 승인되지 않은 client asset 실행을 막는 것을 목표로 둡니다. 반대로 application 자체의 취약점이나 악성 동작, WEBCAT repository와 확장의 공급망 공격은 명시적으로 범위 밖입니다.
        </p>
        <p>
          가용성도 무결성과 다릅니다. Bundle fetch 실패, 만료된 manifest, 잘못된 CSP나 resource mismatch는 안전하게 차단할 수 있지만 사용자는 페이지를 쓰지 못합니다. “악성 코드를 실행하지 않는다”와 “서비스가 계속 열린다”를 같은 보장으로 읽으면 안 됩니다.
        </p>
        <div className="not-prose border-y border-border py-4 text-sm leading-6">
          <p><strong>[O] 현재 공개 범위:</strong> Firefox extension alpha, enrollment preload, bundle·resource·CSP 검증과 오류별 page block입니다.</p>
          <p className="mt-2"><strong>[O] 명시된 한계:</strong> 아직 audit되지 않았고 불안정할 수 있으며 Chrome·Brave와 현재 호환되지 않습니다.</p>
          <p className="mt-2"><strong>[A] 여기서의 결론:</strong> WEBCAT은 HTTPS를 교체하지 않고 first-party delivery integrity를 추가로 확인합니다.</p>
          <p className="mt-2"><strong>[M] 대상 환경:</strong> 검증 지연·호환성·실제 차단률은 측정하지 않았습니다.</p>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">현재 공식 문서와 alpha 공개 범위까지만 결론을 냅니다</h2>
        <div id="paper-webcat-concepts" className="scroll-mt-24">
          <CitationBlock source="WEBCAT · Concepts and architecture" citeKey={1} href="https://docs.webcat.tech/concepts.html">
            <p><strong>문제:</strong> First-party server가 보낸 web code의 개발자 승인 여부를 사용자 쪽에서 검증해야 합니다.</p>
            <p><strong>기여:</strong> Enrollment information·2/3 합의 preload·signed manifest·bundle·transparency proof·browser extension의 역할을 정의합니다.</p>
            <p><strong>근거 범위:</strong> 2026년 10월 29일에 확인한 현재 공식 문서의 구성요소와 검증 경로입니다.</p>
            <p><strong>말하지 않는 것:</strong> Code correctness, 모든 browser 지원, audit 완료와 production 안정성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-webcat-threat" className="scroll-mt-24">
          <CitationBlock source="WEBCAT · Threat model and user errors" citeKey={2} href="https://docs.webcat.tech/threat-model.html">
            <p><strong>문제:</strong> 어떤 공격을 예방하고 어떤 실패를 탐지하는지 신뢰 경계를 분리해야 합니다.</p>
            <p><strong>기여:</strong> Server·domain·validator·transparency 구성요소별 가정과 application·WEBCAT supply-chain의 범위 밖 항목을 명시합니다.</p>
            <p><strong>근거 범위:</strong> 프로젝트가 문서화한 목표와 전제이며 독립 보안 audit 결과가 아닙니다.</p>
            <p><strong>말하지 않는 것:</strong> 모든 공격을 막거나 가용성을 보장한다는 뜻이 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-webcat-alpha" className="scroll-mt-24">
          <CitationBlock source="SecureDrop · Help us test WEBCAT alpha" citeKey={3} href="https://securedrop.org/news/webcat-alpha/">
            <p><strong>게시일:</strong> 2026년 3월 3일입니다.</p>
            <p><strong>기여:</strong> Firefox extension alpha, 실행 전 resource 검증과 실패 시 page block, 현재 browser 호환성과 시험 범위를 공개했습니다.</p>
            <p><strong>근거 범위:</strong> 해당 공개 시점의 alpha artifact와 프로젝트 주장입니다.</p>
            <p><strong>말하지 않는 것:</strong> Browser 표준 채택, production 완성, 모든 web app 적용을 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>HTTPS가 성공해도 WEBCAT이 별도로 확인해야 하는 것은 무엇입니까? <strong>(답: 개발자가 승인한 배포물과 실제 응답의 일치)</strong></li>
          <li>Enrollment preload와 site bundle은 각각 어떤 기준과 증거를 전달합니까? <strong>(답: 등록 기준점과 사이트별 승인 배포물)</strong></li>
          <li>서버가 app.js 한 byte를 바꾸면 어느 단계에서 어떤 결과가 발생합니까? <strong>(답: resource hash 검증에서 실행 전 차단)</strong></li>
          <li>WEBCAT이 막지 못한다고 공식 문서가 밝힌 범위는 무엇입니까? <strong>(답: application-level 문제와 WEBCAT 자체 공급망)</strong></li>
        </ol>
      </section>

      <WebcatMapReturn />
    </article>
  );
}
