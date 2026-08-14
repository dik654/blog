import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { AttestationViz } from "../tee-foundations-viz";

export default function ModernTeeAttestationArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">원격 증명을 authorization까지</p><h2 className="text-3xl font-bold tracking-tight">Attestation은 “안전하다”는 인증서가 아니라 evidence를 policy로 평가하는 절차다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">
          Payroll service가 confidential VM에서 실행된다는 말만 듣고 key를 보내면, 오래된 정상 quote를 replay하거나 debug image에 secret을 줄 수 있습니다. Remote attestation은 <strong>Attester가 evidence를 만들고, Verifier가 endorsement·reference value·freshness로 평가하며, Relying Party가 업무 policy로 최종 행동을 결정</strong>하는 역할 분리입니다.
        </p>
        <AttestationViz />
        <ContentBoundary article="tee-attestation" />
      </section>

      <section id="roles-artifacts" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Roles와 artifacts</p><h2 className="mt-2 text-2xl font-bold">Evidence·endorsement·reference value·result를 서로 바꾸어 부르지 않는다</h2></header>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Evidence", "Attester가 target environment의 measurement·TCB·configuration·challenge binding을 주장하는 artifact입니다."],
            ["Endorsement", "Manufacturer·endorser가 attestation key나 platform property를 뒷받침하는 certificate·statement입니다."],
            ["Reference value", "허용 image digest·minimum SVN·configuration처럼 evidence를 비교할 expected value입니다."],
            ["Attestation result", "Verifier가 evidence appraisal policy를 적용한 결과이며 relying party가 다시 업무 policy를 적용합니다."],
          ].map(([title, body]) => <div key={title} className="rounded-lg border border-border p-4"><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></div>)}
        </div>
        <p>
          Signature가 맞다는 것은 evidence가 해당 attestation key로 보호됐다는 뜻입니다. 그 key chain을 신뢰할지, measurement가 허용 목록에 있는지, TCB가 revoke되지 않았는지, debug flag가 허용되는지는 별도 appraisal입니다. 최종 payroll key 지급에는 tenant·region·workload identity와 channel binding 같은 relying-party 조건도 들어갑니다.
        </p>
        <div id="paper-rfc9334"><CitationBlock source="RFC 9334 · RATS Architecture" citeKey={1} href="https://www.rfc-editor.org/rfc/rfc9334.html">
          <p><strong>문제:</strong> Processor·protocol마다 다른 attestation을 공통 역할과 artifact로 설명해야 합니다.</p>
          <p><strong>기여:</strong> Attester·Verifier·Relying Party와 Evidence·Endorsements·Reference Values·Attestation Results, appraisal policy, freshness를 구분합니다.</p>
          <p><strong>전제:</strong> 2023년의 vendor-neutral informational architecture를 공통 vocabulary로 사용합니다.</p>
          <p><strong>근거 범위:</strong> Role·artifact·trust·freshness model을 뒷받침합니다.</p>
          <p><strong>하지 않는 주장:</strong> 특정 quote encoding·wire protocol·TEE의 security strength를 표준화하거나 인증하지 않습니다.</p>
        </CitationBlock></div>
      </section>

      <section id="freshness-binding" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Freshness와 binding</p><h2 className="mt-2 text-2xl font-bold">Nonce는 quote 안에 들어가고 secret은 검증한 channel·workload에 묶여야 한다</h2></header>
        <p>
          Relying party는 충분히 예측하기 어려운 nonce를 발급하고 verifier가 evidence 안의 challenge binding을 확인합니다. Nonce를 request 밖의 unsigned field로 비교하거나 오래 재사용하면 공격자가 예전 evidence를 붙일 수 있습니다. 검증 뒤 key를 평문 HTTP response로 보내는 것도 잘못입니다. Evidence의 application data 또는 검증된 workload public key를 TLS/session에 결속해 “검증한 대상”과 “secret을 받는 대상”을 같게 만듭니다.
        </p>
        <ExplainedFormula
          question="Quote signature가 유효해도 key release가 거부될 수 있는 이유는 무엇인가?"
          idea={<>서명·freshness·measurement·TCB·channel binding을 모두 AND로 묶습니다. Signature는 필요한 조건 하나일 뿐입니다.</>}
          formula={String.raw`R=S\land N\land M\land T\land B`}
          terms={[
            { symbol: "S", name: "Signature chain", description: "Evidence signature와 endorsement·certificate chain이 허용 trust anchor까지 검증됐다는 조건입니다." },
            { symbol: "N", name: "Nonce freshness", description: "Evidence가 이번 미사용 challenge 또는 허용 epoch에 묶였다는 조건입니다." },
            { symbol: "M", name: "Measurement appraisal", description: "Image·configuration claim이 versioned reference policy에 맞는 조건입니다." },
            { symbol: "T", name: "TCB appraisal", description: "Security version·collateral·revocation·debug 상태가 최소선에 맞는 조건입니다." },
            { symbol: "B", name: "Channel/workload binding", description: "Secret recipient key와 attested workload identity가 같은 session에 결속된 조건입니다." },
            { symbol: "R", name: "Release decision", description: "모든 조건이 1일 때만 payroll key를 지급하는 결과입니다." },
          ]}
          assumptions={["모든 condition은 같은 evidence·nonce·policy revision을 사용합니다.", "Expired·missing·unknown claim은 자동 allow하지 않습니다.", "Availability와 application의 business correctness는 R=1이 보장하지 않습니다."]}
          interpretation="S=1이더라도 reused nonce면 N=0, debug image면 M 또는 T=0이므로 R=0입니다. 이유 code를 남겨 deny와 운영 오류를 구분합니다."
        />
      </section>

      <section id="vendor-appraisal" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Vendor evidence와 공통 policy</p><h2 className="mt-2 text-2xl font-bold">Quote field 이름보다 같은 appraisal 질문으로 정규화한다</h2></header>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[760px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">질문</th><th className="p-3">Intel 계열 예</th><th className="p-3">AMD SNP 예</th><th className="p-3">공통 결과</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3">무엇을 측정했나</td><td className="p-3">Enclave/TD measurement</td><td className="p-3">Launch measurement</td><td className="p-3">workload identity</td></tr><tr><td className="p-3">Platform 상태는</td><td className="p-3">TCB SVN·collateral status</td><td className="p-3">Reported/committed TCB</td><td className="p-3">minimum TCB·revocation</td></tr><tr><td className="p-3">요청과 묶였나</td><td className="p-3">report data·nonce protocol</td><td className="p-3">report data</td><td className="p-3">freshness·channel binding</td></tr></tbody></table></div>
        <p>
          Vendor adapter는 raw quote를 공통 claim으로 바꾸되 원문 evidence, parser version, collateral digest, policy revision을 함께 보존해야 합니다. 서로 없는 field를 0이나 “정상”으로 채우면 안 되며 <code>missing</code>, <code>unsupported</code>, <code>expired</code>, <code>revoked</code>를 별도 outcome으로 둡니다. Offline cache는 가용성을 높이지만 expiration과 revocation refresh를 무시할 이유가 되지 않습니다.
        </p>
        <div id="paper-amd-snp-attestation"><CitationBlock source="AMD SEV-SNP Firmware ABI Specification 1.58" citeKey={2} href="https://docs.amd.com/v/u/en-US/56860_PUB_1.58_SEV_SNP">
          <p><strong>문제:</strong> SNP guest가 report를 요청하고 verifier가 field와 signature chain을 해석할 정확한 ABI가 필요합니다.</p>
          <p><strong>기여:</strong> Attestation report request·response, report data와 TCB-related field의 vendor interface를 정의합니다.</p>
          <p><strong>전제:</strong> Revision 1.58의 SNP firmware ABI와 해당 platform version을 적용합니다.</p>
          <p><strong>근거 범위:</strong> SNP report field·request·signature interface를 뒷받침합니다.</p>
          <p><strong>하지 않는 주장:</strong> RATS의 relying-party authorization이나 Intel·Arm field semantics를 대신하지 않습니다.</p>
        </CitationBlock></div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Valid quote뿐 아니라 replay·collateral outage·policy drift를 고정한다</h2></header>
        <p>
          기초 여섯 문제는 세 역할, 네 artifact, signature와 appraisal, nonce, channel binding, vendor normalization을 다룹니다. 심화 네 문제는 replayed nonce, expired collateral, missing claim, policy rollback, verifier/relying-party 분리를 설계합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Paired gate:</strong> 같은 raw evidence corpus·trust anchors·clock·policy에서 valid, bad signature, reused nonce, altered measurement, old TCB, debug, expired collateral, unknown vendor field를 재생합니다. Decision·reason·raw digest·parser/policy version·latency를 비교하고 false accept 0을 hard gate로 둡니다. Candidate failure 시 prior verifier binary·reference manifest·collateral snapshot으로 rollback합니다.</aside>
      </section>
    </article>
  );
}
