import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { ReactNode } from "react";

type VendorKey = "intel-sgx" | "amd-sev" | "intel-tdx" | "arm-cca";

type Evidence = {
  anchor: ReactNode;
  title: string;
  href: string;
  problem: string;
  contribution: string;
  assumptions: string;
  scope: string;
  notClaim: string;
};

type VendorConfig = {
  key: VendorKey;
  label: string;
  title: string;
  lead: string;
  protectedUnit: string;
  actors: readonly (readonly [string, string, string])[];
  lifecycle: readonly (readonly [string, string, string])[];
  identity: string;
  identityBoundary: string;
  claims: readonly string[];
  failures: readonly (readonly [string, string])[];
  evidence: readonly Evidence[];
};

const CONFIG: Record<VendorKey, VendorConfig> = {
  "intel-sgx": {
    key: "intel-sgx",
    label: "Intel SGX",
    title: "Intel SGX는 process 전체가 아니라 enclave의 page·entry·identity 경계를 보호한다",
    lead: "Payroll process에서 급여 계산과 key handling만 enclave로 옮기는 고정 사례를 따라갑니다. Host process와 OS는 scheduling·I/O·EPC 관리를 계속 맡지만 enclave plaintext와 register state를 읽어도 되는 신뢰 주체가 아닙니다.",
    protectedUnit: "Enclave code·data와 EPC page",
    actors: [
      ["UNTRUSTED APP", "Host process", "Request를 받고 ECALL parameter를 만들며 OCALL 결과를 전달합니다. Pointer와 length는 enclave 밖에서 왔으므로 신뢰하지 않습니다."],
      ["ENCLAVE", "Trusted code", "EDL로 공개한 entry만 받고 private state를 갱신합니다. System call과 device I/O는 직접 신뢰 경계 안으로 들어오지 않습니다."],
      ["CPU + EPCM", "Page ownership", "EPC page의 enclave identity·type·permission을 검사합니다. OS가 page를 관리한다는 사실과 page 내용을 읽을 권한은 다릅니다."],
      ["VERIFIER", "DCAP appraisal", "Quote·collateral·TCB·measurement·report data를 평가한 뒤 payroll key 지급 여부를 결정합니다."],
    ],
    lifecycle: [
      ["BUILD", "ECREATE → EADD → EEXTEND", "Page 내용과 위치가 enclave measurement에 들어가며 initialization 전·후 변경 규칙을 구분합니다."],
      ["ENTER", "ECALL", "Host가 EDL entry와 copied input을 제시합니다. Enclave는 size·range·alias·integer overflow를 다시 검사합니다."],
      ["LEAVE", "OCALL / exit", "I/O request는 최소 message로 복사하고 enclave pointer·secret·오류 세부를 host-visible buffer에 노출하지 않습니다."],
      ["PROVE", "Report → quote", "MRENCLAVE·attribute·TCB·fresh report data를 reference policy와 비교한 뒤 channel-bound secret을 지급합니다."],
    ],
    identity: "MRENCLAVE 중심의 초기 page measurement",
    identityBoundary: "MRENCLAVE는 초기 enclave identity의 핵심 입력이지 runtime input·OCALL result·side-channel 안전·업무 정답을 측정하지 않습니다.",
    claims: ["enclave measurement와 signer/attribute policy", "DCAP quote signature와 collateral status", "TCB security version과 debug 여부", "nonce·workload public key를 담은 report data"],
    failures: [["Oversized ECALL length", "복사 전 거부하고 enclave state commit은 0회"], ["Host가 OCALL response 변조", "Response schema·operation ID 검증 실패로 rollback"], ["Old valid quote replay", "Fresh nonce 불일치로 key release 0회"], ["EPC pressure", "성능·availability 저하로 기록하되 confidentiality 성공과 분리"]],
    evidence: [
      { anchor: <span id="paper-intel-sgx-developer-guide" />, title: "Intel SGX Developer Guide", href: "https://download.01.org/intel-sgx/latest/linux-latest/docs/Intel_SGX_Developer_Guide.pdf", problem: "Enclave page·entry·SDK lifecycle을 같은 programming model로 설명해야 합니다.", contribution: "EPC에 적재되는 enclave, trusted/untrusted 분리와 개발 절차를 정의합니다.", assumptions: "링크한 current Linux SGX guide와 실제 CPU·SDK·driver revision을 고정합니다.", scope: "SGX enclave 생성·memory·application boundary의 vendor 설명입니다.", notClaim: "Application의 memory-safety, side-channel resistance, 모든 OS 경로의 안전을 인증하지 않습니다." },
      { anchor: <span id="paper-intel-sgx-dcap" />, title: "Intel SGX Attestation Services", href: "https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/attestation-services.html", problem: "원격 당사자가 enclave identity와 현재 TCB를 확인해야 합니다.", contribution: "ECDSA 기반 SGX DCAP quote 생성·검증과 collateral service의 current 진입점을 제공합니다.", assumptions: "DCAP·PCS collateral·TCB policy revision과 verifier clock을 고정합니다.", scope: "SGX ECDSA attestation service와 quote appraisal surface를 뒷받침합니다.", notClaim: "Quote signature 하나가 workload correctness나 secret authorization을 자동 보장하지 않습니다." },
    ],
  },
  "amd-sev": {
    key: "amd-sev",
    label: "AMD SEV-SNP",
    title: "SEV-SNP는 VM key만이 아니라 RMP의 page ownership과 guest-visible validation을 함께 본다",
    lead: "Payroll VM 전체를 confidential guest로 실행합니다. Hypervisor는 CPU·memory·I/O 자원을 배치하지만 guest private page를 임의로 다른 GPA나 VM에 다시 매핑해도 되는 권한은 갖지 않습니다. SEV→SEV-ES→SNP의 차이는 memory encryption, register protection, integrity·ownership을 구분해서 읽어야 선명해집니다.",
    protectedUnit: "Confidential VM의 private page와 CPU state",
    actors: [
      ["GUEST", "SNP-aware VM", "Private/shared page를 선택하고 PVALIDATE·guest message·attestation report를 사용합니다."],
      ["HYPERVISOR", "Resource manager", "Nested page table과 scheduling을 관리하지만 RMP가 허용하지 않는 owner·GPA mapping을 성립시킬 수 없습니다."],
      ["CPU + RMP", "Reverse map check", "System physical page의 owner·GPA·validation state를 nested translation과 함께 검사합니다."],
      ["AMD SP", "Firmware root", "Guest lifecycle command, attestation report와 signing-key chain에 참여합니다."],
    ],
    lifecycle: [
      ["LAUNCH", "Guest context + pages", "Firmware command·RMP state·launch digest를 같은 guest identity에 연결합니다."],
      ["VALIDATE", "PVALIDATE", "Guest가 private page의 현재 mapping을 수락합니다. Hypervisor mapping과 guest validation을 한 동작으로 뭉개지 않습니다."],
      ["SHARE", "C-bit / GHCB boundary", "Host-visible I/O bytes와 guest private bytes를 분리하고 exit protocol field를 untrusted input으로 검사합니다."],
      ["REPORT", "SNP guest request", "REPORT_DATA·measurement·policy·reported TCB를 VCEK/VLEK collateral과 함께 평가합니다."],
    ],
    identity: "Launch measurement와 RMP-backed guest page state",
    identityBoundary: "Report measurement는 launch identity를 뒷받침하지만 이후 application data, device path, availability와 모든 firmware mitigation 적용 여부를 대신하지 않습니다.",
    claims: ["launch measurement와 guest policy", "reported/committed TCB 및 mitigation state", "REPORT_DATA challenge·recipient binding", "VCEK/VLEK certificate·revocation·firmware compatibility"],
    failures: [["Wrong-owner RMP mapping", "Access 또는 validation 실패, guest commit 0회"], ["Shared/private confusion", "I/O buffer class mismatch를 fail closed"], ["Old reported TCB", "Minimum policy 아래면 quote signature가 맞아도 deny"], ["RMP transition crash", "Page state receipt로 reconcile하고 추측으로 재사용하지 않음"]],
    evidence: [
      { anchor: <span id="paper-amd-sev-overview" />, title: "AMD Secure Encrypted Virtualization", href: "https://www.amd.com/en/developer/sev.html", problem: "SEV·ES·SNP·TIO의 보호 추가분을 세대별로 구분해야 합니다.", contribution: "VM별 key, encrypted register state, SNP integrity와 current official specifications를 연결합니다.", assumptions: "CPU generation·firmware·guest·hypervisor enablement를 배포 manifest에 고정합니다.", scope: "AMD SEV family의 공식 capability·documentation surface입니다.", notClaim: "모든 세대가 같은 cipher·key count·SNP feature를 제공하거나 side channel·DoS를 제거한다고 주장하지 않습니다." },
      { anchor: <span id="paper-amd-sev-snp-abi-vendor" />, title: "AMD SEV-SNP Firmware ABI 1.58", href: "https://docs.amd.com/v/u/en-US/56860_PUB_1.58_SEV_SNP", problem: "Host·guest·firmware의 page state와 report command를 재현 가능하게 해석해야 합니다.", contribution: "SNP command, page state, guest message, attestation report와 status code를 versioned ABI로 정의합니다.", assumptions: "Revision 1.58, 해당 firmware feature bits와 CPU family를 고정합니다.", scope: "SNP firmware ABI와 report/page lifecycle을 뒷받침합니다.", notClaim: "OS·VMM implementation correctness, workload code, relying-party policy를 인증하지 않습니다." },
    ],
  },
  "intel-tdx": {
    key: "intel-tdx",
    label: "Intel TDX",
    title: "Intel TDX는 TD와 host VMM 사이에 CPU-attested TDX module을 둔다",
    lead: "Payroll OS와 application을 Trust Domain VM으로 실행합니다. VMM은 TD를 생성·schedule하고 shared I/O를 제공하지만 private memory와 saved CPU state는 TDX module과 hardware policy가 중재합니다. 그래서 ‘VM memory encryption’보다 module ABI·SEPT/PAMT·private/shared GPA·TD report를 하나의 lifecycle로 읽어야 합니다.",
    protectedUnit: "Trust Domain VM의 private memory와 CPU state",
    actors: [
      ["TD GUEST", "Confidential VM", "Private GPA와 shared GPA를 구분하고 TDCALL로 module/host service를 요청합니다."],
      ["HOST VMM", "Resource manager", "SEAMCALL로 TD lifecycle을 요청하고 scheduling·I/O를 담당하지만 TD private state는 신뢰 경계 밖입니다."],
      ["TDX MODULE", "Policy mediator", "SEAM root에서 TD construction·entry/exit·metadata·measurement policy를 집행합니다."],
      ["CPU TABLES", "SEPT + PAMT + key", "Private translation과 physical page assignment·key selection을 결합해 cross-domain mapping을 제한합니다."],
    ],
    lifecycle: [
      ["BUILD", "TDH.MNG / MEM", "Module ABI로 TD control structure와 private pages를 추가하고 measurement를 extend합니다."],
      ["FINALIZE", "MR.FINALIZE", "Construction measurement를 닫아 실행 identity를 고정합니다. 이후 mutable runtime state와 혼동하지 않습니다."],
      ["RUN", "TD entry / exit", "Module이 TD state를 save·restore하고 host-visible exit information을 최소화합니다."],
      ["ATTEST", "TDREPORT → quote", "TD measurement·TCB·REPORTDATA를 DCAP collateral과 relying-party policy로 평가합니다."],
    ],
    identity: "MRTD·RTMR 계열 measurement와 TDX module/TCB identity",
    identityBoundary: "MRTD와 runtime extend register는 목적과 갱신 시점이 다르며, report가 guest application의 논리적 정답이나 device confidentiality를 자동 증명하지 않습니다.",
    claims: ["TD build/runtime measurement와 attribute", "TDX module·CPU TCB security version", "REPORTDATA nonce·workload key binding", "Quote collateral·revocation·platform ownership policy"],
    failures: [["Shared GPA code fetch", "Private execution policy와 page type 검사로 거부"], ["PAMT owner mismatch", "TD lifecycle operation 실패와 typed reason"], ["Stale TDX module/TCB", "Minimum policy 아래면 key release 0회"], ["TD exit storm", "Availability·p99 저하로 별도 기록, secret exposure 성공으로 오판하지 않음"]],
    evidence: [
      { anchor: <span id="paper-intel-tdx-module" />, title: "Intel TDX Documentation", href: "https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/documentation.html", problem: "Module architecture·ABI·migration·attestation 문서가 release마다 변하므로 정본 surface가 필요합니다.", contribution: "2026년 current baselined module architecture/ABI, source, security guidance와 attestation 문서를 연결합니다.", assumptions: "선택한 module·SEAM loader·CPU·firmware·guest revision을 manifest에 고정합니다.", scope: "Intel TDX의 current official architecture와 versioned document surface입니다.", notClaim: "Moving latest 문서가 배포 중인 module과 같거나 모든 공격을 막는다고 주장하지 않습니다." },
      { anchor: <span id="paper-intel-tdx-attestation" />, title: "Intel TDX Module and DCAP surface", href: "https://www.intel.com/content/www/us/en/download/738875/intel-trust-domain-extension-intel-tdx-module.html", problem: "Host와 TD 사이 policy mediator와 evidence path를 식별해야 합니다.", contribution: "SEAM-hosted module, shared GPA, secure translation metadata와 TD report/quote 역할을 설명하고 source 진입점을 제공합니다.", assumptions: "해당 release source·reproducible build·DCAP libraries와 collateral을 고정합니다.", scope: "TDX module이 중재하는 architecture와 attestation primitive의 vendor 설명입니다.", notClaim: "Application correctness, side-channel resistance, deployment attestation policy를 대신하지 않습니다." },
    ],
  },
  "arm-cca": {
    key: "arm-cca",
    label: "Arm CCA",
    title: "Arm CCA는 Realm world와 granule state를 RME·RMM·GPT로 분리한다",
    lead: "Payroll VM을 Realm으로 실행합니다. Normal world host는 Realm의 자원을 관리하지만 Realm memory를 읽을 수 있는 주체는 아닙니다. EL3의 root firmware, Realm Management Monitor, Granule Protection Table, Realm guest의 RMI/RSI를 나눠 봐야 ‘새 world’라는 설명을 실제 page·call·attestation 경계로 바꿀 수 있습니다.",
    protectedUnit: "Realm과 Realm-owned granule",
    actors: [
      ["NORMAL WORLD", "Host/VMM", "Realm 생성과 resource 요청을 RMI로 전달하지만 Realm private memory의 신뢰 주체는 아닙니다."],
      ["REALM", "Confidential guest", "RSI를 통해 Realm-visible service와 attestation token을 요청합니다."],
      ["RMM", "Realm monitor", "Realm lifecycle·stage-2 translation·measurement와 Realm/host 전환을 중재합니다."],
      ["EL3 + GPT", "Granule owner", "Granule의 world assignment와 transition을 관리하고 access마다 GPC가 현재 state를 확인합니다."],
    ],
    lifecycle: [
      ["DELEGATE", "NS → Realm granule", "Host mapping·cache·device access를 정리한 뒤 granule을 Realm ownership으로 전환합니다."],
      ["CREATE", "RMI lifecycle", "Realm descriptor·translation·REC를 구성하고 measured content를 고정합니다."],
      ["RUN", "REC entry / RSI", "Realm execution과 host service request를 구분하고 shared buffer를 untrusted protocol로 검증합니다."],
      ["TOKEN", "CCA attestation", "Realm token과 platform token의 challenge·public-key binding을 함께 appraisal합니다."],
    ],
    identity: "Realm Initial Measurement와 extensible measurement·CCA token",
    identityBoundary: "Realm token과 platform token은 서로 다른 signer·claim을 가지며, challenge binding이 없거나 reference policy가 낡으면 서명이 맞아도 key를 지급할 수 없습니다.",
    claims: ["Realm initial/extensible measurement와 personalization", "RMM·platform TCB claim", "client challenge와 Realm attestation public key binding", "CCA platform token·Realm token의 issuer와 algorithm"],
    failures: [["Undelegated granule reuse", "Realm create/map 전에 state transition 실패"], ["Stale host mapping or DMA", "Delegate precondition과 SMMU/device policy 실패로 deny"], ["Token challenge mismatch", "Freshness 실패로 key release 0회"], ["RMM update drift", "Reference manifest·RMM version mismatch로 canary 중단"]],
    evidence: [
      { anchor: <span id="paper-arm-cca-rme" />, title: "Arm Realm Management Extension overview", href: "https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-blog/posts/introducing-arms-dynamic-trustzone-technology", problem: "Memory page를 여러 security world 사이에서 동적으로 소유시키는 hardware boundary가 필요합니다.", contribution: "RME, GPT와 granule protection check가 world assignment를 집행하는 구조를 설명합니다.", assumptions: "해당 Armv9-A/RME 설명과 실제 platform firmware·SMMU implementation을 구분합니다.", scope: "RME의 world·granule·GPT access-control 직관을 뒷받침합니다.", notClaim: "Blog가 RMM ABI·token format·device isolation 구현을 완전히 규정하거나 제품을 인증하지 않습니다." },
      { anchor: <span id="paper-arm-rmm-architecture" />, title: "Arm Realm Management Monitor Architecture", href: "https://developer.arm.com/-/cdn-downloads/permalink/Architectures/Armv9/DEN0137_1.0-rel0-rc1_rmm-arch_external.pdf", problem: "Realm lifecycle·RMI/RSI·measurement·attestation semantics를 interoperable하게 정의해야 합니다.", contribution: "RMM architecture, Realm state와 CCA platform/Realm token binding을 규정합니다.", assumptions: "DEN0137 1.0-rel0-rc1과 대응 RME/RMM/CCA token revisions를 고정합니다.", scope: "RMM lifecycle·measurement·attestation token 구조의 vendor architecture입니다.", notClaim: "특정 firmware build의 correctness, side-channel·availability·application policy를 인증하지 않습니다." },
    ],
  },
};

function VendorFlow({ config }: { config: VendorConfig }) {
  return (
    <figure data-viz={`${config.key}-boundary`} data-viz-canvas className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 p-4 sm:p-6">
        <p className="text-sm font-semibold">{config.label} payroll workload의 네 책임 주체</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">누가 resource를 관리하는지와 누가 plaintext를 볼 수 있는지를 분리합니다.</p>
      </figcaption>
      <div className="grid min-w-0 gap-px bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
        {config.actors.map(([tag, title, body]) => (
          <div key={tag} className="min-w-0 bg-background p-4 sm:p-5">
            <p className="text-[11px] font-bold tracking-[0.12em] text-primary">{tag}</p>
            <p className="mt-2 break-keep text-sm font-semibold">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export default function VendorTeeArticle({ vendor }: { vendor: VendorKey }) {
  const config = CONFIG[vendor];
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">{config.label} · 보호 단위부터</p><h2 className="text-3xl font-bold tracking-tight">{config.title}</h2></header>
        <p className="text-lg leading-8 text-foreground/90">{config.lead}</p>
        <aside className="rounded-lg border border-border p-4 text-sm leading-6"><strong>이 글의 보호 단위:</strong> {config.protectedUnit}. 공통 threat model·TCB·memory property·RATS 역할은 위 정본을 재사용하고, 여기서는 이 제품의 page·call·measurement·release 계약만 확장합니다.</aside>
        <VendorFlow config={config} />
        <ContentBoundary article={config.key} />
      </section>

      <section id="architecture" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Architecture</p><h2 className="mt-2 text-2xl font-bold">Control plane과 protected execution을 한 주체로 뭉개지 않는다</h2></header>
        <p>관리 software가 page를 할당하고 vCPU를 schedule한다는 사실은 보호 대상을 읽거나 임의의 identity로 다시 연결할 권한을 뜻하지 않습니다. 각 access와 transition은 현재 owner·address·state·version을 다시 검사해야 하며, 실패를 “일시 오류”로 바꿔 무조건 재시도하면 stale operation이 다른 page나 workload에 적용될 수 있습니다.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {config.actors.map(([tag, title, body]) => <div key={tag} className="rounded-lg border border-border p-4"><p className="text-xs font-bold tracking-wide text-primary">{tag}</p><p className="mt-2 font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></div>)}
        </div>
      </section>

      <section id="memory-lifecycle" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Memory와 call lifecycle</p><h2 className="mt-2 text-2xl font-bold">Page state와 외부 I/O를 commit 순서로 추적한다</h2></header>
        <ol className="grid gap-3 md:grid-cols-2">
          {config.lifecycle.map(([tag, title, body], index) => <li key={tag} className="rounded-lg border border-border p-4"><p className="text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")} · {tag}</p><p className="mt-2 font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></li>)}
        </ol>
        <p>안전한 구현은 <strong>input copy → bounds/schema 검증 → protected computation → private commit → 최소 output copy</strong> 순서를 지킵니다. Timeout이나 crash가 어느 단계에서 발생했는지 operation ID·page identity·generation·result digest로 남겨야 재시작 뒤 중복 commit과 잘못된 page 재사용을 막을 수 있습니다.</p>
      </section>

      <section id="measurement-attestation" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Measurement와 attestation</p><h2 className="mt-2 text-2xl font-bold">{config.identity}를 업무 authorization으로 확대하지 않는다</h2></header>
        <p>{config.identityBoundary}</p>
        <ExplainedFormula
          question="같은 page bytes라도 주소·순서·type이 달라진 build를 왜 다른 identity로 볼 수 있는가?"
          idea={<>측정 ledger는 직전 digest에 event type·주소·page digest를 순서대로 접어 넣습니다. 아래 식은 네 제품의 실제 encoding이 아니라 measurement의 순서·주소 binding을 이해하기 위한 공통 모형입니다.</>}
          formula={String.raw`D_i=H\!\left(D_{i-1}\,\|\,t_i\,\|\,a_i\,\|\,H(P_i)\right)`}
          annotatedFormula={String.raw`D_i=\underbrace{H\!\left(D_{i-1}\,\|\,t_i\,\|\,a_i\,\|\,H(P_i)\right)}_{\text{허용 경계 판정}}`}
          operations={[
            { expression: String.raw`H\!\left(D_{i-1}\,\|\,t_i\,\|\,a_i\,\|\,H(P_i)\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","측정 ledger는 직전 digest에 event","type·주소·page digest를 순서대로 접어 넣습니다."] },
          ]}
          terms={[
            { symbol: "D_i", name: "누적 measurement", description: "i번째 measured event까지 순서대로 접은 identity digest입니다." },
            { symbol: "t_i", name: "Event type", description: "Code·data·configuration처럼 vendor가 정의한 측정 종류입니다." },
            { symbol: "a_i", name: "Measured address", description: "Page 위치나 index처럼 layout을 identity에 묶는 값입니다." },
            { symbol: "P_i", name: "Measured bytes", description: "해당 event가 measurement에 반영하는 page 또는 configuration bytes입니다." },
            { symbol: "H", name: "Hash", description: "Specification이 정한 cryptographic hash와 serialization입니다." },
          ]}
          assumptions={["Vendor specification의 실제 extend order·zero padding·field encoding을 구현 정본으로 사용합니다.", "Build manifest와 verifier가 같은 binary·layout·algorithm revision을 사용합니다.", "Collision resistance는 runtime correctness·freshness·TCB status를 대신하지 않습니다."]}
          interpretation="Page bytes가 같아도 t_i, a_i, 순서가 바뀌면 입력 ledger가 달라집니다. 반대로 같은 초기 measurement가 나와도 runtime input·external effect·side channel은 별도 evidence가 필요합니다."
        />
        <div className="grid gap-3 md:grid-cols-2">{config.claims.map((claim, index) => <div key={claim} className="rounded-lg border border-border p-4 text-sm"><span className="font-semibold text-primary">CHECK {index + 1}</span><p className="mt-2 leading-6 text-muted-foreground">{claim}</p></div>)}</div>
        {config.evidence.map((item, index) => <div key={item.title}>{item.anchor}<CitationBlock source={item.title} citeKey={index + 1} href={item.href}><p><strong>문제:</strong> {item.problem}</p><p><strong>기여:</strong> {item.contribution}</p><p><strong>전제:</strong> {item.assumptions}</p><p><strong>근거 범위:</strong> {item.scope}</p><p><strong>하지 않는 주장:</strong> {item.notClaim}</p></CitationBlock></div>)}
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · Failure와 release gate</p><h2 className="mt-2 text-2xl font-bold">정상 부팅보다 잘못된 page·오래된 evidence·중간 crash에서 secret이 안 나가는지 본다</h2></header>
        <div className="overflow-hidden rounded-lg border border-border"><div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] bg-muted/40 px-4 py-3 text-xs font-semibold"><span>주입할 실패</span><span>관측할 판정</span></div>{config.failures.map(([fault, oracle]) => <div key={fault} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 border-t border-border px-4 py-3 text-sm"><span className="font-medium">{fault}</span><span className="text-muted-foreground">{oracle}</span></div>)}</div>
        <p>Base와 candidate에 같은 workload image·firmware/module/RMM·host kernel·verifier·collateral·reference manifest·nonce corpus를 사용합니다. Valid와 invalid fixture를 모두 replay하고 unauthorized release 0, state/measurement parity, reason-code stability, p50/p99, recovery time을 비교합니다. Security hard gate가 깨지면 성능이 좋아도 prior binary·firmware·policy manifest로 되돌립니다.</p>
      </section>
    </article>
  );
}
