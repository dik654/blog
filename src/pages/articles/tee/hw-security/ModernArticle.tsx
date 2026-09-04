import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { HardwareBoundaryViz } from "../tee-foundations-viz";

const propertyRows = [
  ["기밀성", "Host가 payroll key와 평문을 읽지 못하는가", "Memory encryption·access control", "Workload가 스스로 log에 key를 쓰는 경우"],
  ["무결성", "Host가 code·page·translation을 몰래 바꾸지 못하는가", "Signature·measurement·integrity metadata", "검증한 code 안의 논리 버그"],
  ["Freshness", "과거의 정상 evidence를 다시 내밀지 못하는가", "Nonce·epoch·secure counter", "예측 가능한 nonce 재사용"],
  ["가용성", "Host가 실행을 멈추거나 지연시키지 못하는가", "복제·timeout·failover", "TEE만으로 host의 전원 차단 방어"],
] as const;

export default function ModernHardwareSecurityArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">하드웨어 보안을 위협 모델부터</p>
          <h2 className="text-3xl font-bold tracking-tight">하드웨어는 모든 것을 믿게 만드는 장치가 아니라 신뢰할 부분을 줄이는 경계다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          한 회사가 cloud의 confidential VM에서 급여 파일을 처리한다고 하겠습니다. 운영자는 host OS와 hypervisor가 침해돼도 payroll key가 노출되지 않기를 바라지만, 회사가 올린 application의 버그와 잘못된 접근 정책까지 CPU가 고쳐 주는 것은 아닙니다. 따라서 첫 질문은 “어떤 TEE가 더 안전한가?”가 아니라 <strong>누구를 불신하고, 어떤 자산의 어떤 property를 지킬 것인가?</strong>입니다.
        </p>
        <HardwareBoundaryViz />
        <ContentBoundary article="hw-security" />
      </section>

      <section id="threat-properties" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Threat model</p><h2 className="mt-2 text-2xl font-bold">공격자·자산·보안 property를 한 문장에 넣는다</h2></header>
        <p>
          이 글의 고정 사례에서 자산은 payroll key와 급여 평문이며, 공격자는 host 관리자 권한과 DRAM·I/O 관찰 능력을 갖지만 CPU package를 파괴해 probe하지는 않는다고 두겠습니다. Side channel, denial of service, workload bug는 “없다”고 가정하는 것이 아니라 별도 risk로 기록합니다. 이처럼 threat model은 방어 목록이 아니라 <strong>보장과 비보장의 경계</strong>입니다.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[760px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Property</th><th className="p-3">검증 질문</th><th className="p-3">가능한 control</th><th className="p-3">반례</th></tr></thead><tbody className="divide-y divide-border">{propertyRows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="p-3 align-top text-muted-foreground">{cell}</td>)}</tr>)}</tbody></table></div>
        <ExplainedFormula
          question="Payroll key를 자동 지급하려면 어떤 조건을 동시에 만족해야 하는가?"
          idea={<>기밀성 하나만 보지 않고 measurement 무결성, freshness, 업무 policy를 Boolean gate로 결합합니다. 하나라도 0이면 자동 지급은 0입니다.</>}
          formula={String.raw`A=C\land I\land F\land P`}
          annotatedFormula={String.raw`A=\underbrace{C\land I\land F\land P}_{\text{판정 조건 결합}}`}
          operations={[
            { expression: String.raw`C\land I\land F\land P`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","기밀성 하나만 보지 않고 measurement 무결성,","freshness, 업무 policy를 Boolean","gate로 결합합니다."] },
          ]}
          terms={[
            { symbol: "C", name: "Confidentiality control", description: "선택한 배포에서 host가 private memory를 직접 읽지 못한다는 조건입니다." },
            { symbol: "I", name: "Integrity appraisal", description: "Image·TCB·configuration이 허용 reference와 맞는다는 조건입니다." },
            { symbol: "F", name: "Freshness", description: "Evidence가 이번 challenge의 nonce 또는 허용 epoch에 묶였다는 조건입니다." },
            { symbol: "P", name: "Business policy", description: "Tenant·region·debug 상태·patch 최소선 등 업무상 지급 조건입니다." },
            { symbol: "A", name: "Automatic release", description: "1이면 key 지급, 0이면 deny 또는 사람 검토로 보내는 최종 결과입니다." },
          ]}
          assumptions={["각 input은 같은 attestation attempt와 policy revision에서 계산합니다.", "Unknown·parse error·expired collateral은 1로 올리지 않습니다.", "가용성·side channel·application correctness는 이 Boolean 하나가 보증하지 않습니다."]}
          interpretation="C=1이어도 F=0이면 replay일 수 있으므로 A=0입니다. ‘암호화된 VM’이라는 제품 이름만으로 secret을 지급하지 않는 이유입니다."
        />
      </section>

      <section id="roots-resilience" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Root와 resilience</p><h2 className="mt-2 text-2xl font-bold">Root of Trust는 작고 고정된 시작점이며 보호·탐지·복구가 함께 있어야 한다</h2></header>
        <p>
          Root of Trust(RoT)는 모든 software를 무조건 신뢰한다는 뜻이 아니라 첫 검증이나 첫 측정을 수행하는 최소 시작점입니다. Boot ROM이나 CPU의
          hardware-backed key가 다음 firmware를 검증하고 그 firmware가 다시 다음 단계를 검증하거나 측정합니다. 그러나 서명 확인만 성공해도 runtime이
          계속 정상인 것은 아니므로 firmware protection과 함께 변경 탐지와 known-good 복구 경로가 필요합니다.
        </p>
        <ul className="grid gap-3 md:grid-cols-3">
          <li className="rounded-lg border border-border p-4"><strong>Protect</strong><p className="mt-2 text-sm text-muted-foreground">승인된 update만 허용하고 rollback·write 경로를 제한합니다.</p></li>
          <li className="rounded-lg border border-border p-4"><strong>Detect</strong><p className="mt-2 text-sm text-muted-foreground">Boot measurement·runtime health·failed validation을 관측합니다.</p></li>
          <li className="rounded-lg border border-border p-4"><strong>Recover</strong><p className="mt-2 text-sm text-muted-foreground">독립 recovery image와 실패 receipt로 정상 상태를 되찾습니다.</p></li>
        </ul>
        <div id="paper-nist-sp800-193"><CitationBlock source="NIST SP 800-193 · Platform Firmware Resiliency Guidelines" citeKey={1} href="https://csrc.nist.gov/pubs/sp/800/193/final">
          <p><strong>문제:</strong> Platform firmware가 원격 공격으로 변조되면 boot와 복구 자체가 무너질 수 있습니다.</p>
          <p><strong>기여:</strong> Firmware와 critical data의 protection·detection·recovery라는 세 원칙을 제시합니다.</p>
          <p><strong>전제:</strong> 2018년 final publication의 platform firmware·critical data 범위를 적용합니다.</p>
          <p><strong>근거 범위:</strong> Firmware resilience control과 운영자 procurement 판단을 뒷받침합니다.</p>
          <p><strong>하지 않는 주장:</strong> 특정 TEE가 workload confidentiality·side-channel resistance를 만족한다고 인증하지 않습니다.</p>
        </CitationBlock></div>
      </section>

      <section id="memory-boot-attestation" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 세 control의 역할</p><h2 className="mt-2 text-2xl font-bold">Memory protection·Secure Boot·attestation은 서로 대체하지 않는다</h2></header>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border p-5"><h3 className="font-semibold">Memory protection</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">실행 중 private memory의 confidentiality·integrity·ownership을 다룹니다. I/O용 shared page는 다시 untrusted입니다.</p></div>
          <div className="rounded-lg border border-border p-5"><h3 className="font-semibold">Secure Boot</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">다음 component의 서명과 policy를 확인해 실행을 허용하거나 거부합니다. 실제 선택된 sequence의 설명서는 아닙니다.</p></div>
          <div className="rounded-lg border border-border p-5"><h3 className="font-semibold">Attestation</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">측정된 상태와 freshness evidence를 원격 verifier에게 전달합니다. 최종 authorization은 relying party policy가 합니다.</p></div>
        </div>
        <p>
          Payroll 사례의 안전한 순서는 image와 TCB reference를 version으로 고정하고 fresh attestation을 검증한 뒤에만 session key를 해당
          channel에 묶어 지급하는 것입니다. Debug가 켜졌거나 patch minimum보다 낮거나 reference manifest가 없으면 fail closed합니다. 반대로
          host가 실행을 멈추면 secret 미지급에는 성공해도 서비스 가용성에는 실패한 것이니 별도 상태로 기록합니다.
        </p>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">제품 이름이 아니라 failure matrix와 evidence receipt로 채택한다</h2></header>
        <p>
          기초 여섯 문제에서는 이 글만으로 threat model 네 요소, confidentiality·integrity·freshness·availability, RoT와 chain,
          protect·detect·recover, 세 control의 역할, Boolean release를 설명할 수 있어야 합니다. 심화 네 문제에서는 replay, stale
          firmware, malicious shared buffer, denial of service를 넣어 deny·review·recover를 구분합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Paired gate:</strong> 같은 workload image·host firmware·policy manifest에서 base/candidate를 실행하고 valid, altered image, old TCB, reused nonce, debug, malformed evidence, host pause를 주입합니다. Secret release count, false accept·false reject, appraisal p95, recovery time, evidence digest를 기록하며 unauthorized release가 한 건이라도 있으면 rollback합니다.</aside>
      </section>
    </article>
  );
}
