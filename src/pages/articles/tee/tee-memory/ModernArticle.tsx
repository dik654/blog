import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { TeeMemoryViz } from "../tee-foundations-viz";

export default function ModernTeeMemoryArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">TEE memory를 page lifecycle부터</p><h2 className="text-3xl font-bold tracking-tight">Memory encryption은 DRAM bytes를 숨기지만 private/shared 경계와 무결성 정책까지 설명해야 한다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">
          Payroll confidential VM은 급여 파일을 private page에서 처리하지만 network packet을 받으려면 host가 볼 수 있는 shared buffer를 거칩니다. CPU package 밖의 DRAM이 암호문이라는 사실만으로 shared input의 길이·schema, page ownership, replay, side channel, availability가 해결되지는 않습니다. 그래서 memory 보안은 <strong>page가 들어오고, 실행되고, 공유되고, 제거되는 lifecycle</strong>로 읽어야 합니다.
        </p>
        <TeeMemoryViz />
        <ContentBoundary article="tee-memory" />
      </section>

      <section id="private-shared" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Private와 shared</p><h2 className="mt-2 text-2xl font-bold">I/O 경계에서는 host가 준 bytes를 다시 untrusted input으로 취급한다</h2></header>
        <p>
          Private page는 특정 enclave·VM·realm에 귀속되고 memory controller의 key selection과 CPU의 ownership·translation
          check를 거쳐 접근됩니다. Shared page는 host·device와 통신하기 위해 명시적으로 공개한 영역입니다. Payroll packet은 shared buffer에서
          length와 schema를 검증한 뒤 private buffer로 복사하고 결과도 private state를 직접 가리키지 않는 새 message로 내보냅니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Private → shared", "Secret·pointer·padding·error detail을 제거하고 protocol message만 복사합니다."],
            ["Shared → private", "Length·offset·integer overflow·schema·sequence counter를 검증한 뒤 복사합니다."],
            ["Page conversion", "Old mapping·TLB·DMA·owner 상태가 정리됐다는 platform-specific receipt가 필요합니다."],
            ["Failure", "Validation 전 private state를 갱신하지 않고 timeout·duplicate에는 operation ID를 사용합니다."],
          ].map(([title, body]) => <div key={title} className="rounded-lg border border-border p-4"><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></div>)}
        </div>
      </section>

      <section id="encryption-integrity" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Encryption과 integrity</p><h2 className="mt-2 text-2xl font-bold">주소에 따라 ciphertext를 바꾸는 것과 변조·재배치를 막는 것은 별도 property다</h2></header>
        <p>
          여러 memory-encryption 설계는 물리 주소나 key ID에서 만든 tweak를 사용해 같은 plaintext block이 다른 위치에서 같은 ciphertext가 되지 않게 합니다. 아래 식은 XEX 계열을 이해하기 위한 단순화된 모형이며 모든 SGX·SEV-SNP·TDX 구현의 정확한 wire format을 뜻하지 않습니다.
        </p>
        <ExplainedFormula
          question="같은 plaintext block이 주소 a와 b에서 왜 다른 ciphertext가 되는가?"
          idea={<>주소에서 만든 tweak를 block encryption 전후에 섞으면 key와 plaintext가 같아도 주소가 달라진 경우 다른 결과를 얻습니다.</>}
          formula={String.raw`C_a=E_K\!\left(P\oplus T(a)\right)\oplus T(a)`}
          annotatedFormula={String.raw`C_a=\underbrace{E_K\!\left(P\oplus T(a)\right)\oplus T(a)}_{\text{허용 경계 판정}}`}
          operations={[
            { expression: String.raw`E_K\!\left(P\oplus T(a)\right)\oplus T(a)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","주소에서 만든 tweak를 block encryption","전후에 섞으면 key와 plaintext가 같아도 주소가","달라진 경우 다른 결과를 얻습니다."] },
          ]}
          terms={[
            { symbol: "P", name: "Plaintext block", description: "CPU가 memory controller로 write-back하는 보호 대상 block입니다." },
            { symbol: "a", name: "Physical location", description: "Tweak를 만드는 주소 또는 platform이 정의한 위치 식별자입니다." },
            { symbol: "T(a)", name: "Address tweak", description: "같은 plaintext의 위치별 ciphertext를 분리하는 값입니다." },
            { symbol: "E_K", name: "Block encryption", description: "TEE 또는 memory domain에 선택된 비밀 key K의 block cipher 연산입니다." },
            { symbol: "C_a", name: "Ciphertext at a", description: "DRAM·외부 bus에서 관측되는 암호문 block입니다." },
          ]}
          assumptions={["XEX-like 직관을 위한 모형이며 실제 vendor algorithm·metadata layout은 해당 specification을 따릅니다.", "Key·tweak reuse와 address canonicalization이 platform 규칙대로 동작합니다.", "Encryption만으로 freshness·ownership·replay resistance를 결론내리지 않습니다."]}
          interpretation="a≠b이면 보통 T(a)≠T(b)이므로 같은 P도 다른 ciphertext가 됩니다. 그러나 공격자가 old ciphertext와 metadata를 함께 replay할 수 있는지는 별도의 integrity·version 구조가 결정합니다."
        />
        <p>
          Confidentiality는 plaintext 관찰을 어렵게 하고 integrity는 unauthorized modification을 탐지·차단합니다. 예전의 유효한 block을
          현재 상태로 되돌리는 replay는 freshness가 막습니다. 어떤 제품은 cryptographic integrity tree를 쓰고 어떤 제품은 page
          ownership·reverse map·address validation 같은 구조를 결합합니다. 따라서 “memory encryption 지원”이라는 한 줄에서 세
          property를 추론하면 안 됩니다.
        </p>
      </section>

      <section id="platform-boundaries" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Platform별 경계</p><h2 className="mt-2 text-2xl font-bold">Enclave·confidential VM·realm은 보호 단위와 TCB가 다르다</h2></header>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[760px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Family</th><th className="p-3">보호 단위</th><th className="p-3">Host와의 경계</th><th className="p-3">반드시 별도 확인할 것</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3">SGX 계열</td><td className="p-3">Process 안 enclave pages</td><td className="p-3">OS가 scheduling·page 관리에 관여</td><td className="p-3">EPC/page lifecycle·enclave ABI·side channel</td></tr><tr><td className="p-3">SEV-SNP 계열</td><td className="p-3">Confidential VM</td><td className="p-3">Guest private state와 host VMM 분리</td><td className="p-3">RMP ownership·shared page·device/I/O</td></tr><tr><td className="p-3">TDX 계열</td><td className="p-3">Trust Domain VM</td><td className="p-3">TDX module이 host VMM과 TD 사이를 중재</td><td className="p-3">TD module/firmware version·shared GPA·attestation</td></tr></tbody></table></div>
        <div id="paper-amd-sev-snp-abi"><CitationBlock source="AMD SEV-SNP Firmware ABI Specification 1.58" citeKey={1} href="https://docs.amd.com/v/u/en-US/56860_PUB_1.58_SEV_SNP">
          <p><strong>문제:</strong> Confidential VM의 page ownership·guest request·attestation·firmware interface를 정확히 정의해야 합니다.</p>
          <p><strong>기여:</strong> SEV-SNP firmware ABI, RMP 관련 상태와 report interface의 vendor 정본을 제공합니다.</p>
          <p><strong>전제:</strong> 문서 revision 1.58과 해당 CPU·firmware 조합을 배포 manifest에 고정합니다.</p>
          <p><strong>근거 범위:</strong> AMD SEV-SNP의 page·guest request·report interface를 뒷받침합니다.</p>
          <p><strong>하지 않는 주장:</strong> Intel·Arm의 memory property나 특정 cloud 배포의 안전성을 증명하지 않습니다.</p>
        </CitationBlock></div>
        <div id="paper-intel-tdx-docs"><CitationBlock source="Intel Trust Domain Extensions documentation" citeKey={2} href="https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/documentation.html">
          <p><strong>문제:</strong> TDX의 module·memory protection·measurement·attestation 문서는 revision별로 함께 읽어야 합니다.</p>
          <p><strong>기여:</strong> Intel의 current architecture, ABI, security guidance와 attestation 문서 진입점을 제공합니다.</p>
          <p><strong>전제:</strong> 선택한 TDX module·CPU·firmware revision을 배포 manifest에 고정합니다.</p>
          <p><strong>근거 범위:</strong> Intel TDX의 current official specification surface와 security guidance를 뒷받침합니다.</p>
          <p><strong>하지 않는 주장:</strong> 이 링크만으로 side-channel·availability·application correctness를 보장하지 않습니다.</p>
        </CitationBlock></div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">공유 page와 crash recovery를 포함해야 memory test가 된다</h2></header>
        <p>
          기초 여섯 문제는 private/shared, encryption·integrity·freshness, address tweak, cache 평문, 세 platform 보호 단위를 다룹니다. 심화 네 문제는 malicious length, page transition 중 crash, old ciphertext replay, I/O timeout 뒤 duplicate request를 넣어 state commit과 key release를 설계합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Paired gate:</strong> 같은 image·firmware·memory size에서 valid packet, oversized offset, private pointer leak, shared-page flip, conversion crash, replayed counter를 주입합니다. Unauthorized read/write 0, deterministic error, private-state commit count, page-state receipt, throughput·p95를 base/candidate로 비교하고 security property가 약해지면 즉시 rollback합니다.</aside>
      </section>
    </article>
  );
}
