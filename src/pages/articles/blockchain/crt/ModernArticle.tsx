import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ModernCRTViz from "./viz/ModernCRTViz";

export default function ModernCRTArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">정수 나머지에서 시작하는 CRT</p>
          <h2 className="text-3xl font-bold tracking-tight">
            여러 나머지를 만족하는 한 정수를 다시 조립한다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          큰 정수 하나를 직접 다루는 대신 서로 다른 작은 modulus의 나머지로
          나누어 계산한 뒤 다시 합칠 수 있을까요? <strong>중국인 나머지 정리</strong>
          (Chinese Remainder Theorem, CRT)는 modulus들이 서로소일 때 이 조립이
          가능하고, 그 결과가 전체 modulus의 곱을 기준으로 하나뿐임을 보장합니다.
          RSA 구현에서는 같은 private operation을 p와 q에서 따로 계산한 뒤
          재결합하는 데 이 원리를 사용합니다.
        </p>
        <p>
          먼저 표기를 바닥부터 잡겠습니다. 정수 a를 양의 정수 m으로 나누면
          a=qm+r, 0≤r&lt;m인 quotient q와 remainder r이 하나씩 정해집니다.
          a와 b의 나머지가 같다는 뜻을 <strong>a≡b (mod m)</strong>이라고 씁니다.
          예를 들어 23≡2 (mod 3)은 23−2=21이 3의 배수라는 말과 같습니다.
        </p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>핵심 아이디어:</strong> 각 나머지 조건만 통과시키는 selector를
          만들고, 원하는 나머지를 곱해 모두 더합니다. Lagrange interpolation이
          각 sample point에서 1 또는 0이 되는 basis를 만드는 것과 같은 구조지만,
          여기서는 정수의 congruence를 다룹니다.
        </aside>
        <ContentBoundary article="crt" />
        <ModernCRTViz />
      </section>

      <section id="numerical" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 구성적 계산</p>
          <h2 className="mt-2 text-2xl font-bold">각 조건에만 1인 selector를 만든다</h2>
        </header>
        <p>
          x≡aᵢ (mod mᵢ)인 조건 n개를 생각해 보겠습니다. modulus들이 두 개씩
          모두 서로소라면 M=∏mᵢ를 만들고, i번째 modulus만 제외한 Mᵢ=M/mᵢ를
          계산합니다. Mᵢ는 다른 모든 modulus의 배수이므로 그 조건들에서는
          0입니다. 이제 Mᵢyᵢ≡1 (mod mᵢ)이 되도록 modular inverse yᵢ를 고르면
          Mᵢyᵢ는 i번째 조건에서만 1인 selector가 됩니다.
        </p>
        <ExplainedFormula
          question="나머지 조건 n개를 동시에 만족하는 정수를 어떻게 직접 만들 수 있는가?"
          idea={<>i번째 selector Mᵢyᵢ에 원하는 나머지 aᵢ를 곱해 더합니다. 다른 modulus에서는 해당 항이 0으로 사라지고, 자기 modulus에서만 aᵢ가 남습니다.</>}
          formula={String.raw`M=\prod_{i=1}^{n}m_i,\quad M_i=\frac{M}{m_i},\quad y_i=M_i^{-1}\pmod{m_i},\quad x\equiv\sum_{i=1}^{n}a_iM_iy_i\pmod M`}
          terms={[
            { symbol: "m_i", name: "i번째 modulus", description: "나머지를 재는 기준이며 모든 쌍이 서로소여야 합니다." },
            { symbol: "a_i", name: "i번째 residue", description: "x가 mᵢ로 나뉠 때 남아야 하는 0 이상 mᵢ 미만 값입니다." },
            { symbol: "M", name: "전체 modulus", description: "모든 mᵢ의 곱이며 해의 반복 주기입니다." },
            { symbol: "M_i", name: "부분 곱", description: "mᵢ만 빼고 곱해 다른 모든 congruence에서 0이 됩니다." },
            { symbol: "y_i", name: "Modular inverse", description: "Mᵢyᵢ를 mᵢ에서 1로 만드는 값입니다." },
          ]}
          assumptions={["모든 mᵢ는 양수이고, i≠j이면 gcd(mᵢ,mⱼ)=1입니다.", "Inverse와 합은 exact integer arithmetic으로 계산한 뒤 canonical residue 0…M−1로 환원합니다.", "서로소가 아닌 일반화 CRT는 별도의 compatibility 검사와 lcm modulus를 사용합니다."]}
          interpretation="식을 mⱼ로 보았을 때 j번째 항만 aⱼ로 남으므로 모든 조건을 만족합니다. 이 식은 해를 구성하지만, 입력 residue의 신뢰성이나 secret-dependent 구현의 side-channel 안전성을 보장하지는 않습니다."
        />
        <h3 className="text-xl font-semibold">23을 직접 조립해 보기</h3>
        <p>
          조건을 x≡2 (mod 3), x≡3 (mod 5), x≡2 (mod 7)로 두면 M=105입니다.
          M₁=35의 mod 3 inverse는 2, M₂=21의 mod 5 inverse는 1,
          M₃=15의 mod 7 inverse는 1입니다. 따라서 합은
          2·35·2+3·21·1+2·15·1=233이고, 233 mod 105=23입니다. 23을
          3·5·7로 다시 나누면 각각 2·3·2가 나와 계산을 독립적으로 검산할 수
          있습니다.
        </p>
        <h3 className="text-xl font-semibold">왜 해가 M을 기준으로 하나뿐인가</h3>
        <p>
          위 식이 적어도 하나의 해를 만든다는 것은 각 modulus로 직접 환원하면
          확인할 수 있습니다. 이제 x와 x′가 모두 해라고 해 보겠습니다. 두 수의
          차 x−x′는 모든 mᵢ로 나누어떨어집니다. mᵢ들이 pairwise coprime이면
          그 곱 M도 x−x′를 나누므로 x≡x′ (mod M)입니다. 이것이 존재성과
          유일성을 나누어 보는 증명 아이디어입니다.
        </p>
        <div className="rounded-lg border border-border bg-card p-5 text-sm leading-6">
          <strong>반례와 일반화:</strong> x≡0 (mod 2), x≡1 (mod 4)는 양립할 수
          없습니다. 첫 조건은 x가 짝수라고 하고 둘째는 홀수 residue를 요구하기
          때문입니다. 서로소가 아닌 modulus에서는 aᵢ≡aⱼ
          (mod gcd(mᵢ,mⱼ))인지 먼저 확인해야 하며, 해가 있으면 반복 주기는 곱이
          아니라 lcm입니다.
        </div>
      </section>

      <section id="crypto-usage" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 암호 구현 경계</p>
          <h2 className="mt-2 text-2xl font-bold">RSA-CRT는 결과가 아니라 계산 경로를 바꾼다</h2>
        </header>
        <p>
          RSA modulus n=pq에서 private exponentiation m=cᵈ mod n을 바로 하는 대신,
          m₁=cᵈᴾ mod p와 m₂=cᵈQ mod q를 계산하고 CRT로 합칠 수 있습니다.
          여기서 dP=d mod (p−1), dQ=d mod (q−1), qInv=q⁻¹ mod p입니다.
          p와 q가 대략 절반 bit 길이라 두 exponentiation의 operand가 작아지지만,
          실제 speedup은 big-integer algorithm, window, hardware, blinding과
          memory traffic에 따라 달라집니다. “항상 정확히 네 배”라고 말해서는 안
          됩니다.
        </p>
        <ExplainedFormula
          question="두 RSA residue m₁과 m₂를 n=pq의 한 message representative로 어떻게 합치는가?"
          idea={<>m₂에서 시작해 p 방향의 차이만 h로 보정합니다. h는 q를 곱했을 때 mod p에서 m₁−m₂가 되도록 q의 inverse를 사용합니다.</>}
          formula={String.raw`h=((m_1-m_2)q_{\mathrm{inv}})\bmod p,\qquad m=m_2+qh`}
          terms={[
            { symbol: "m_1", name: "p-side result", description: "c^d를 p에서 계산한 residue입니다." },
            { symbol: "m_2", name: "q-side result", description: "c^d를 q에서 계산한 residue입니다." },
            { symbol: "q_{\mathrm{inv}}", name: "CRT coefficient", description: "q·qInv≡1 (mod p)을 만족합니다." },
            { symbol: "h", name: "Correction", description: "m₂에 q의 몇 배를 더할지 정하는 p-side 보정량입니다." },
            { symbol: "m", name: "Recombined result", description: "mod p에서는 m₁, mod q에서는 m₂와 같은 대표값입니다." },
          ]}
          assumptions={["p와 q는 서로 다른 홀수 소수이고 private-key CRT parameter가 같은 key에서 유도됐습니다.", "Ciphertext representative range와 RSA primitive의 error 조건은 PKCS #1 규칙을 따릅니다.", "Secret exponentiation·inverse·conditional correction은 target threat model에 맞게 constant-time과 blinding을 검토합니다."]}
          interpretation="q·h는 mod q에서 0이므로 m₂를 보존하고 mod p에서는 차이를 정확히 메웁니다. 한 residue가 fault로 틀리면 잘못된 결과가 key factor를 노출할 수 있으므로, 재결합 뒤 public operation으로 검산하거나 동등한 fault countermeasure가 필요합니다."
        />
        <div id="paper-rfc8017-crt">
          <CitationBlock source="RFC 8017 · PKCS #1 v2.2" citeKey={1} href="https://www.rfc-editor.org/rfc/rfc8017.html">
            <p><strong>문제:</strong> RSA public/private key와 encryption·signature primitive를 상호운용 가능한 integer·octet 계약으로 정의합니다.</p>
            <p><strong>기여:</strong> Two-prime RSA private key에 p, q, dP, dQ, qInv CRT parameter와 RSADP/RSASP1 입력 범위를 규정합니다.</p>
            <p><strong>전제와 범위:</strong> RFC 8017의 RSA key representation과 primitive 범위입니다. 특정 library의 constant-time·fault resistance나 고정 speedup을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <h3 className="text-xl font-semibold">구현과 benchmark를 분리해 판단한다</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-muted/50 text-left"><tr><th className="p-3">검사</th><th className="p-3">확인할 것</th><th className="p-3">단정하면 안 되는 것</th></tr></thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-3 font-medium text-foreground">정확성</td><td className="p-3">Boundary residue·negative normalization·non-coprime reject·direct mod parity</td><td className="p-3">몇 random vector의 성공이 모든 key를 대표함</td></tr>
              <tr><td className="p-3 font-medium text-foreground">보안</td><td className="p-3">Blinding·constant-time·fault injection·post verification</td><td className="p-3">수학식이 side channel과 fault를 자동 해결함</td></tr>
              <tr><td className="p-3 font-medium text-foreground">성능</td><td className="p-3">같은 key size·backend·batch·warmup에서 direct와 CRT p50/p95 비교</td><td className="p-3">부분 곱셈 수가 end-to-end speedup과 같음</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          이 글의 10문항 역검사는 congruence 읽기, 2·3·2 residue 검산, selector와
          inverse 계산, 존재·유일성 증명, 비서로소 반례, RSA 재결합을 기초로
          묻습니다. 심화에서는 일반화 CRT compatibility와 lcm 주기,
          RSA fault fixture, direct/CRT paired benchmark를 설계하게
          하며, 답에 필요한 전제와 경계는 모두 위에 두었습니다.
        </p>
      </section>
    </article>
  );
}
