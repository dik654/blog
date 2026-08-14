import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { MeasuredBootViz } from "../tee-foundations-viz";

export default function ModernTcbArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">TCB를 목록이 아니라 closure로</p><h2 className="text-3xl font-bold tracking-tight">검증 결과를 바꿀 수 있는 모든 component가 Trusted Computing Base에 들어간다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">
          Payroll confidential VM의 image hash가 맞더라도, 그 hash를 만든 boot firmware나 attestation key를 다루는 module이 공격자에게 바뀔 수 있다면 결과를 믿을 수 없습니다. <strong>Trusted Computing Base(TCB)</strong>는 “보안 제품 목록”이 아니라 보안 property를 깨뜨릴 수 있어 정확히 동작해야 하는 hardware·firmware·software의 closure입니다.
        </p>
        <MeasuredBootViz />
        <ContentBoundary article="tee-tcb" />
      </section>

      <section id="tcb-closure" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · TCB closure</p><h2 className="mt-2 text-2xl font-bold">작게 만든다는 말보다 property와 dependency를 먼저 쓴다</h2></header>
        <p>
          “TCB가 작다”는 line count만의 주장이 아닙니다. Payroll key의 confidentiality를 기준으로 CPU package, memory-encryption key manager, TEE firmware/module, attestation key path, verifier와 reference manifest가 어떤 식으로 결과에 영향을 주는지 그립니다. Host VMM을 confidentiality TCB 밖에 둘 수 있어도 shared I/O parsing이나 availability에는 여전히 영향을 줍니다. Property가 바뀌면 TCB도 바뀝니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Inside", "CPU security logic · TEE module · attestation key · verifier policy"],
            ["Outside for confidentiality", "Host OS·VMM이 private plaintext를 직접 읽지 못한다는 목표"],
            ["Still influential", "Host scheduling·I/O·page supply는 availability와 input integrity에 영향"],
            ["Version receipt", "Firmware SVN·microcode·module·image·policy·endorsement revision"],
          ].map(([title, body]) => <div key={title} className="rounded-lg border border-border p-4"><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></div>)}
        </div>
      </section>

      <section id="secure-measured-boot" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Secure vs measured boot</p><h2 className="mt-2 text-2xl font-bold">실행을 막는 것과 실행한 것을 기록하는 것은 다른 동작이다</h2></header>
        <p>
          Secure Boot는 signature와 allow/revoke policy를 검사해 다음 image의 실행 여부를 결정합니다. Measured Boot는 선택된 firmware·configuration·bootloader·kernel event의 digest를 순서대로 PCR에 extend하고 event log에 설명을 남깁니다. 허용된 image가 둘이면 Secure Boot는 둘 다 실행할 수 있지만, Measured Boot는 실제로 어느 image와 순서를 택했는지 구분합니다.
        </p>
        <ExplainedFormula
          question="왜 같은 event 둘을 다른 순서로 측정하면 PCR 결과가 달라지는가?"
          idea={<>PCR extend는 기존 값과 새 event digest를 이어 붙여 다시 hash합니다. 따라서 단순 집합이 아니라 순서 있는 history를 접습니다.</>}
          formula={String.raw`\mathrm{PCR}_{i}=H\!\left(\mathrm{PCR}_{i-1}\,\|\,H(e_i)\right)`}
          terms={[
            { symbol: "e_i", name: "i번째 event", description: "Firmware image·configuration·bootloader처럼 이번에 측정한 bytes 또는 정의된 event입니다." },
            { symbol: "H", name: "Cryptographic hash", description: "선택한 PCR bank의 hash algorithm입니다." },
            { symbol: String.raw`\|`, name: "Concatenation", description: "이전 PCR digest와 새 event digest를 규격의 순서로 결합합니다." },
            { symbol: String.raw`\mathrm{PCR}_i`, name: "Extended PCR value", description: "i번째 event까지의 순서에 의존하는 aggregate measurement입니다." },
          ]}
          assumptions={["Verifier가 같은 hash bank·initial PCR·event serialization을 사용합니다.", "Event log의 순서가 실제 extend 순서와 같습니다.", "Hash collision resistance는 event 의미나 reference policy의 정확성을 대신하지 않습니다."]}
          interpretation="Firmware→bootloader와 bootloader→firmware는 같은 두 digest를 써도 보통 다른 PCR을 냅니다. 다만 PCR만으로 어떤 event가 있었는지는 복원할 수 없어 event log가 함께 필요합니다."
        />
        <div id="paper-tcg-pc-client-pfp"><CitationBlock source="TCG PC Client Platform Firmware Profile 1.06" citeKey={1} href="https://trustedcomputinggroup.org/resource/pc-client-specific-platform-firmware-profile-specification/">
          <p><strong>문제:</strong> PC firmware가 TPM PCR과 event log에 boot measurement를 어떤 순서와 형식으로 남길지 정해야 합니다.</p>
          <p><strong>기여:</strong> Event digest 생성, PCR extend, log append와 PCR별 사용 규칙을 정의합니다.</p>
          <p><strong>전제:</strong> TPM 2.0 PC Client Platform Firmware Profile 1.06 계열을 적용합니다.</p>
          <p><strong>근거 범위:</strong> Boot event 측정의 format·PCR bank·순서 규칙을 뒷받침합니다.</p>
          <p><strong>하지 않는 주장:</strong> Event가 안전하거나 reference value가 승인됐다는 정책 판정까지 제공하지 않습니다.</p>
        </CitationBlock></div>
      </section>

      <section id="pcr-log-appraisal" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · PCR·log·reference</p><h2 className="mt-2 text-2xl font-bold">Quote 서명, log replay, reference appraisal을 모두 통과해야 한다</h2></header>
        <ol className="space-y-3 text-sm leading-6">
          <li><strong>1. Authenticity:</strong> TPM quote 또는 TEE evidence의 signature와 certificate·endorsement chain을 검증합니다.</li>
          <li><strong>2. Freshness:</strong> 이번 요청의 nonce·epoch가 evidence에 결속됐는지 확인합니다.</li>
          <li><strong>3. Replay:</strong> Event log를 같은 PCR 초기값부터 순서대로 replay해 signed PCR과 일치하는지 봅니다.</li>
          <li><strong>4. Meaning:</strong> 각 digest·configuration을 versioned reference manifest와 비교하고 revoke·minimum TCB 정책을 적용합니다.</li>
        </ol>
        <p>
          Log와 PCR이 서로 맞는다는 것은 “일관되게 기록됐다”는 뜻이지 “좋은 software였다”는 뜻이 아닙니다. 공격자가 악성 image를 측정해 정직하게 보고할 수도 있습니다. 반대로 reference manifest가 최신 정상 update를 포함하지 않으면 false reject가 생깁니다. 그래서 reference value의 서명·owner·validity window·rollback 절차도 TCB 운영에 포함됩니다.
        </p>
        <div id="paper-tcg-rim"><CitationBlock source="TCG PC Client Reference Integrity Manifest Specification" citeKey={2} href="https://trustedcomputinggroup.org/resource/tcg-pc-client-reference-integrity-manifest-specification/">
          <p><strong>문제:</strong> Verifier가 event log와 TPM quote를 평가하려면 expected integrity reference가 필요합니다.</p>
          <p><strong>기여:</strong> PC boot measurement 검증에 쓰는 Reference Integrity Manifest의 정보와 배포 경계를 정의합니다.</p>
          <p><strong>전제:</strong> PC client의 boot-cycle measurement와 TPM quote validation을 대상으로 합니다.</p>
          <p><strong>근거 범위:</strong> Reference value의 표현·서명·검증 input 역할을 뒷받침합니다.</p>
          <p><strong>하지 않는 주장:</strong> 모든 runtime state나 application correctness를 포괄하지 않습니다.</p>
        </CitationBlock></div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">정상 boot 하나보다 순서·누락·update 실패를 먼저 주입한다</h2></header>
        <p>
          기초 여섯 문제는 property별 TCB, Secure/Measured Boot, PCR extend, event log, quote, reference manifest를 구분합니다. 심화 네 문제는 event reorder·log omission·stale manifest·revoked firmware에서 false accept와 false reject를 분석하고 TCB update rollback을 설계합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Paired gate:</strong> 같은 initial PCR·hash bank·firmware corpus에서 valid sequence, reordered log, missing event, altered PCR, newly approved update, revoked old image를 재생합니다. Quote signature·nonce·replayed PCR·reference decision·reason code가 완전해야 하며, unknown을 trusted로 올리거나 valid update를 설명 없이 거부하면 배포하지 않습니다.</aside>
      </section>
    </article>
  );
}
