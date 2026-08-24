import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import WebcatIntegrityViz from "./viz/WebcatIntegrityViz";

export default function ModernWebcatFrontendIntegrityArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">WEBCAT · frontend code transparency</p><h2 className="text-3xl font-bold tracking-tight">HTTPS는 전송한 서버를 인증하지만, 그 서버가 개발자가 의도한 frontend를 보냈는지까지 증명하지 않는다</h2></header>
      <p className="text-lg leading-8">먼저 <strong>frontend code</strong>는 브라우저가 실행하는 JavaScript·Wasm과 그 실행 경계를 만드는 HTML·CSS·CSP입니다. HTTPS는 이 bytes가 전송 중 바뀌지 않았고 인증서의 서버와 연결됐음을 보입니다. 그러나 서버나 CDN이 침해돼 악성 JS를 정상 TLS 연결로 내려주면, 브라우저는 그것이 개발자가 승인한 빌드인지 알 수 없습니다.</p>
      <div className="grid gap-3 md:grid-cols-3">{[["HTTPS","사용자 ↔ 서버 채널의 인증·암호화"],["서명 manifest","개발자가 승인한 경로별 resource hash 묶음"],["Transparency log","특정 사용자에게만 다른 manifest를 보냈는지 감사할 공개 이력"]].map(([term,desc]) => <div key={term} className="rounded-lg border border-border p-4"><p className="font-semibold">{term}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p></div>)}</div>
      <ContentBoundary article="webcat-frontend-integrity" />
      <WebcatIntegrityViz />
    </section>
    <section id="signed-manifest" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Signed manifest</p><h2 className="mt-2 text-2xl font-bold">Manifest는 “이 경로에는 이 bytes가 와야 한다”는 개발자 서명 목록이다</h2></header>
      <p><strong>Manifest</strong>는 추상적인 버전 이름이 아닙니다. URL path, cryptographic hash, CSP 같은 실행 조건과 signer identity를 묶은 검증 artifact입니다. 브라우저가 <code>/app.js</code>를 받으면 파일 이름이 아니라 bytes의 hash를 다시 계산해 manifest의 값과 대조합니다.</p>
      <ExplainedFormula question="브라우저가 app.js를 실행해도 되는 조건은 무엇인가요?" idea="전달된 bytes의 hash가 서명된 manifest 값과 같고, manifest signature와 transparency inclusion이 모두 유효해야 합니다." formula={String.raw`\begin{aligned}A&=\underbrace{[H(r)=h_m]}_{\text{resource bytes 일치}}\\B&=\underbrace{[V_{pk}(m,\sigma)=1]}_{\text{developer signature 유효}}\\C&=\underbrace{[I_{log}(m)=1]}_{\text{public log에 포함}}\\\mathrm{execute}&=\underbrace{A\land B\land C}_{\text{셋 모두 참일 때만 실행}}\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}A&=\underbrace{\underbrace{[H(r)=h_m]}_{\text{resource bytes 일치}}}_{\text{Manifest hash 계산}}\\B&=\underbrace{\underbrace{[V_{pk}(m,\sigma)=1]}_{\text{developer signature 유효}}}_{\text{오른쪽 항으로 결과 계산}}\\C&=\underbrace{\underbrace{[I_{log}(m)=1]}_{\text{public log에 포함}}}_{\text{오른쪽 항으로 결과 계산}}\\\mathrm{execute}&=\underbrace{A\land B\land C}_{\text{셋 모두 참일 때만 실행}}\end{aligned}`}
      operations={[
        { expression: String.raw`\underbrace{[H(r)=h_m]}_{\text{resource bytes 일치}}`, annotation: ["Manifest hash이(가) 식의 결과에 기여하는 방식을","계산합니다.","전달된 bytes의 hash가 서명된 manifest 값과","같고, manifest signature와"] },
        { expression: String.raw`\underbrace{[V_{pk}(m,\sigma)=1]}_{\text{developer signature 유효}}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","전달된 bytes의 hash가 서명된 manifest 값과","같고, manifest signature와","transparency inclusion이 모두 유효해야"] },
        { expression: String.raw`\underbrace{[I_{log}(m)=1]}_{\text{public log에 포함}}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","전달된 bytes의 hash가 서명된 manifest 값과","같고, manifest signature와","transparency inclusion이 모두 유효해야"] },
      ]} terms={[{symbol:"r",name:"Delivered resource",description:"브라우저가 HTTPS 응답으로 받은 실제 JS·Wasm bytes입니다."},{symbol:"h_m",name:"Manifest hash",description:"승인 manifest가 해당 path에 고정한 digest입니다."},{symbol:"V_pk",name:"Signature verifier",description:"등록된 developer public key로 manifest signature를 검사합니다."},{symbol:"I_log",name:"Log inclusion",description:"Manifest가 투명성 log의 공개 이력에 포함됐는지 나타냅니다."}]} assumptions={["Hash algorithm·manifest schema·signing key·log checkpoint가 고정돼 있습니다.","모든 executable resource가 manifest coverage에 들어갑니다.","검증 실패 시 resource를 실행하기 전에 fail closed합니다.","승인된 코드 자체의 취약점이나 악의적인 개발자를 탐지하는 장치는 아닙니다."]} interpretation="세 항 중 하나라도 0이면 render 전에 차단합니다. HTTPS 성공은 이 식의 별도 전제일 뿐 세 항을 자동으로 1로 만들지 않습니다." />
      <p><strong>Reproducible build</strong>는 같은 source·toolchain·dependency로 같은 bytes를 다시 만들 수 있는 성질입니다. <strong>Verifiable deployment</strong>는 그 bytes가 실제 사용자에게 전달됐는지 확인하는 성질입니다. 전자는 build provenance를 강화하고, 후자는 delivery를 검사하므로 둘은 조합해야 합니다.</p>
    </section>
    <section id="local-verification" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Local verification</p><h2 className="mt-2 text-2xl font-bold">검증은 서버가 “맞다”고 말하는 곳이 아니라 실행 직전 사용자 쪽에서 끝나야 한다</h2></header>
      <p>WEBCAT의 현재 모델에서는 Firefox extension이 <code>/.well-known/webcat/bundle.json</code>의 bundle과 manifest를 가져와 trust root·enrollment·signature·resource hashes·CSP를 검사합니다. 서버가 자기 응답을 자기 기준으로 승인하면 침해된 서버가 검사 결과도 위조할 수 있으므로, 최종 enforcement point는 브라우저 쪽입니다.</p>
      <div className="space-y-3">{[["SRI","HTML이 지정한 개별 resource hash를 검사하지만, HTML 자체를 바꾼 서버가 SRI 값도 바꿀 수 있습니다."],["CSP","어디서 어떤 종류의 code를 실행할지 제한하지만, 승인 origin이 악성 bytes를 보내는 문제를 홀로 해결하지 않습니다."],["WEBCAT","개발자 key·manifest·public log·local enforcement를 묶어 first-party deployment 변조를 드러냅니다."]].map(([term,desc]) => <div key={term} className="grid gap-1 rounded-lg border border-border p-4 sm:grid-cols-[8rem_1fr]"><p className="font-semibold">{term}</p><p className="text-sm leading-6 text-muted-foreground">{desc}</p></div>)}</div>
    </section>
    <section id="transparency-release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Transparency와 현재 경계</p><h2 className="mt-2 text-2xl font-bold">Alpha extension의 검증 범위와 장기 배포 주장을 분리한다</h2></header>
      <p>Transparency log는 동일 app/version에 서로 다른 manifest를 조용히 보여주는 <em>split view</em>를 감사할 공개 근거를 만듭니다. 하지만 log inclusion 하나가 code audit, key custody, dependency 안전성, 운영 availability를 보장하지는 않습니다.</p>
      <p>2026년 공개 상태는 <strong>Firefox extension 기반 alpha</strong>입니다. 따라서 “모든 browser가 native로 보호한다”거나 “dApp supply chain 공격이 해결됐다”고 쓰지 않습니다. Release gate는 known-good bundle, 한 byte 변조, 빠진 resource, wrong signer, expired enrollment, unavailable/inconsistent log와 rollback path를 검사합니다.</p>
      <div id="paper-webcat-concepts"><CitationBlock source="WEBCAT · Concepts and architecture" citeKey={1} href="https://docs.webcat.tech/concepts.html"><p><strong>문제:</strong> First-party web code의 개발자 승인 여부를 사용자 쪽에서 검증해야 합니다.</p><p><strong>기여:</strong> Signed manifest bundle, enrollment, transparency log와 browser verification 흐름을 설명합니다.</p><p><strong>전제:</strong> 현재 문서의 schema·trust root·extension architecture를 사용합니다.</p><p><strong>근거 범위:</strong> WEBCAT이 명시한 구성요소와 검증 순서입니다.</p><p><strong>말하지 않는 것:</strong> Code correctness·developer honesty·모든 browser 지원을 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-webcat-alpha"><CitationBlock source="SecureDrop · WEBCAT alpha release" citeKey={2} href="https://securedrop.org/news/webcat-alpha/"><p><strong>문제:</strong> 설계를 실제 사용자가 시험할 enforcement artifact가 필요합니다.</p><p><strong>기여:</strong> 2026년 Firefox extension alpha와 실행 전 차단 범위를 공개합니다.</p><p><strong>전제:</strong> Alpha maturity와 당시 지원 범위로 읽습니다.</p><p><strong>근거 범위:</strong> 공개 시점·브라우저·실험 단계입니다.</p><p><strong>말하지 않는 것:</strong> 표준 채택·production 완성·모든 dApp 적용을 뜻하지 않습니다.</p></CitationBlock></div>
    </section>
  </article>;
}
