import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import PolynomialCommitmentViz from "./PolynomialCommitmentViz";

export default function ModernPolycommitArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">하나의 evaluation claim에서 시작하는 PCS</p>
          <h2 className="text-3xl font-bold tracking-tight">다항식은 숨겨 둔 채 f(4)=10만 검증한다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
            유한체 F₁₇에서 f(X)=X²+2X+3이라고 합시다. f(4)=16+8+3=27≡10입니다. Polynomial commitment scheme(PCS)은 prover가 f
            전체를 먼저 짧은 값 C에 결속한 뒤 verifier가 요청한 점 z=4에서 값 y=10이 맞다는 opening proof π만 전달하게 합니다.
          </p>
        <p>이 인터페이스는 STARK·SNARK·rollup에서 긴 polynomial table을 매번 보내지 않기 위해 쓰입니다. 다만 <strong>binding</strong>, <strong>hiding</strong>, <strong>degree bound</strong>, <strong>setup trust</strong>는 별도 속성입니다. “Commitment를 썼다”는 사실만으로 네 조건이 한꺼번에 따라오지는 않습니다.</p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> 먼저 C를 고정한 뒤 z를 받는 순서가 중요합니다. KZG는 factor theorem을 pairing equation으로, IPA는 evaluation을 inner product로 바꿉니다. 두 방식은 같은 API를 제공하지만 전제와 비용 곡선이 다릅니다.</aside>
        <ContentBoundary article="polycommit" />
        <PolynomialCommitmentViz />
      </section>

      <section id="commit-open" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Commit / Open</p><h2 className="mt-2 text-2xl font-bold">KZG는 나머지가 0이라는 사실을 pairing으로 검사한다</h2></header>
        <p>
            Commit은 polynomial과 scheme profile을 받아 C를 만들고 Open은 (f,z)에 대해 y=f(z)와 π를 만듭니다. Verify는 (C,z,y,π)만
            보고 accept 또는 reject합니다. API가 짧더라도 degree 제한, key 식별자, field와 subgroup 검사는 외부에서 암묵적으로 생기지 않으므로
            profile에 고정해야 합니다.
          </p>
        <ExplainedFormula
          question="f(z)=y라는 주장을 왜 quotient polynomial 하나로 바꿀 수 있는가?"
          idea={<>나머지 정리에 따라 f(X)−y가 X−z로 나누어떨어질 때와 f(z)=y일 때가 같습니다. KZG는 hidden setup point τ에서 이 항등식을 평가하고 pairing으로 양쪽의 곱을 비교합니다.</>}
          formula={String.raw`q(X)=\frac{f(X)-y}{X-z},\quad C=[f(\tau)]_1,\quad \pi=[q(\tau)]_1,\quad e(C-[y]_1,[1]_2)=e(\pi,[\tau-z]_2)`}
          annotatedFormula={String.raw`q(X)=\underbrace{\frac{f(X)-y}{X-z},\quad C=[f(\tau)]_1,\quad \pi=[q(\tau)]_1,\quad e(C-[y]_1,[1]_2)=e(\pi,[\tau-z]_2)}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\frac{f(X)-y}{X-z},\quad C=[f(\tau)]_1,\quad \pi=[q(\tau)]_1,\quad e(C-[y]_1,[1]_2)=e(\pi,[\tau-z]_2)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","나머지 정리에 따라 f(X)−y가 X−z로 나누어떨어질 때와","f(z)=y일 때가 같습니다."] },
          ]}
          terms={[
            { symbol: "q(X)", name: "Quotient polynomial", description: "Evaluation이 맞을 때 remainder 없이 존재합니다." },
            { symbol: "\\tau", name: "Toxic-waste point", description: "SRS가 powers를 제공하지만 값 자체는 누구도 알아서는 안 됩니다." },
            { symbol: "C", name: "Commitment", description: "SRS의 G1 powers로 f(τ)를 exponent에 표현한 group element입니다." },
            { symbol: "\\pi", name: "Opening proof", description: "q(τ)를 담은 상수 크기 group element입니다." },
            { symbol: "e", name: "Bilinear pairing", description: "Exponent의 곱 관계를 target group equality로 옮깁니다." },
          ]}
          assumptions={["f의 degree가 SRS가 지원하는 d 이하이고 τ의 powers·group parameters가 올바릅니다.", "G1·G2 point는 올바른 subgroup에 있으며 τ는 ceremony 뒤 복구되지 않습니다.", "Commitment와 opening은 같은 field·SRS·domain separation profile을 사용합니다."]}
          interpretation="F₁₇의 예에서는 f−10=X²+2X−7=(X−4)(X+6)이므로 q=X+6입니다. y=11로 바꾸면 f(4)−11=−1이 남아 q가 polynomial이 아니며 pairing equality가 성립해서는 안 됩니다. 이것이 작은 계산으로 보는 binding 경계입니다."
        />
        <p><strong>증명 아이디어:</strong> bilinearity 때문에 오른쪽 exponent는 q(τ)(τ−z)=f(τ)−y가 됩니다. 왼쪽도 같은 exponent이므로 honest opening은 통과합니다. 반대로 degree-bounded polynomial 두 개가 너무 많은 점에서 같을 수 없다는 root bound와 pairing assumption이 위조를 제한합니다.</p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-6"><strong>실패 반례:</strong> SRS가 degree 8까지만 제공하는데 degree 9 polynomial을 임의 방식으로 잘라 commit하면 원래 f에 대한 binding을 말할 수 없습니다. τ가 노출되면 공격자는 hidden evaluation 관계를 직접 맞출 수 있으므로 key를 폐기하고 다시 setup해야 합니다.</div>
      </section>

      <section id="schemes" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · KZG와 IPA</p><h2 className="mt-2 text-2xl font-bold">같은 evaluation을 증명하지만 비용을 지불하는 위치가 다르다</h2></header>
        <ExplainedFormula
          question="IPA는 polynomial evaluation을 어떤 vector 관계로 표현하는가?"
          idea={<>Coefficient vector와 z의 거듭제곱 vector의 dot product가 바로 f(z)입니다. Prover와 verifier는 두 vector를 challenge마다 절반으로 접으며 이 inner product claim을 더 작은 claim으로 줄입니다.</>}
          formula={String.raw`\mathbf a=(a_0,\ldots,a_d),\quad \mathbf b(z)=(1,z,\ldots,z^d),\quad y=f(z)=\langle\mathbf a,\mathbf b(z)\rangle`}
          annotatedFormula={String.raw`\mathbf a=\underbrace{(a_0,\ldots,a_d),\quad \mathbf b(z)=(1,z,\ldots,z^d),\quad y=f(z)=\langle\mathbf a,\mathbf b(z)\rangle}_{\text{Power vector 계산}}`}
          operations={[
            { expression: String.raw`(a_0,\ldots,a_d),\quad \mathbf b(z)=(1,z,\ldots,z^d),\quad y=f(z)=\langle\mathbf a,\mathbf b(z)\rangle`, annotation: ["Power vector이(가) 식의 결과에 기여하는 방식을","계산합니다.","Coefficient vector와 z의 거듭제곱","vector의 dot product가 바로 f(z)입니다."] },
          ]}
          terms={[
            { symbol: "\\mathbf a", name: "Coefficient vector", description: "Polynomial f의 coefficient를 낮은 차수부터 담습니다." },
            { symbol: "\\mathbf b(z)", name: "Power vector", description: "Evaluation point z의 0승부터 d승까지입니다." },
            { symbol: "\\langle\\cdot,\\cdot\\rangle", name: "Inner product", description: "같은 위치 성분을 곱해 더한 field 값입니다." },
            { symbol: "d", name: "Degree bound", description: "Vector와 generator profile의 길이를 결정합니다." },
          ]}
          assumptions={["Generator vector는 관계를 아는 discrete-log trapdoor 없이 domain-separated 방식으로 생성합니다.", "모든 challenge는 commitment와 statement를 포함한 transcript에서 나옵니다.", "Folding round 수·proof 크기·verifier MSM 비용은 구체 IPA variant와 batching 방법에 따라 다릅니다."]}
          interpretation="예에서 a=(3,2,1), b=(1,4,16)이므로 inner product는 3+8+16=27≡10입니다. 이 식은 evaluation을 설명하지만 그 자체가 proof는 아닙니다. Commitment binding, round challenges와 final relation을 함께 검사해야 합니다."
        />
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[760px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">축</th><th className="p-3">KZG</th><th className="p-3">IPA</th><th className="p-3">해석 경계</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3 font-medium text-foreground">Setup</td><td className="p-3">degree-bounded structured powers</td><td className="p-3">transparent generator derivation</td><td className="p-3">Transparent도 assumption-free가 아님</td></tr><tr><td className="p-3 font-medium text-foreground">가정</td><td className="p-3">pairing·SRS 보안</td><td className="p-3">prime-order group DLP</td><td className="p-3">둘 다 양자내성 아님</td></tr><tr><td className="p-3 font-medium text-foreground">Opening</td><td className="p-3">상수 개 group elements</td><td className="p-3">logarithmic folding transcript</td><td className="p-3">Batch·aggregation 포함 실측 필요</td></tr><tr><td className="p-3 font-medium text-foreground">Hiding</td><td className="p-3">별도 blinding variant 필요</td><td className="p-3">randomness 설계 필요</td><td className="p-3">기본 binding과 분리</td></tr></tbody></table></div>
      </section>

      <section id="selection" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 선택과 release gate</p><h2 className="mt-2 text-2xl font-bold">정상 proof보다 실패가 같은 이유로 거절되는지 먼저 본다</h2></header>
        <p>
            같은 field·degree·opening 수로 KZG·IPA·FRI-style candidate를 비교합니다. Setup bytes/time,
            commit·open·verify time, proof bytes, peak RSS, batch throughput을 모두 기록하되 먼저
            y·z·degree·SRS·subgroup·transcript를 하나씩 틀린 negative corpus가 모두 거절되는지 확인합니다.
          </p>
        <p>작은 on-chain proof가 최우선이고 ceremony를 운영할 수 있다면 KZG가 유리할 수 있습니다. Transparent setup이 중요하면 IPA가 후보가 되지만 DLP와 verifier work가 남습니다. Hash·code 기반 post-quantum 방향이 중요하면 FRI 계열을 검토하되 proof와 query/hash 비용이 커질 수 있습니다. 단일 “최고 PCS”는 deployment 조건을 지운 표현입니다.</p>
        <div id="paper-kzg"><CitationBlock source="Kate·Zaverucha·Goldberg · Polynomial Commitments (ASIACRYPT 2010)" citeKey={1} href="https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf"><p><strong>문제:</strong> 큰 polynomial을 짧게 commit하고 특정 evaluation을 짧게 증명해야 합니다.</p><p><strong>기여:</strong> Pairing 기반 constant-size commitment와 evaluation witness construction을 제시합니다.</p><p><strong>전제:</strong> Degree-bounded SRS, bilinear groups와 논문의 binding assumptions를 사용합니다.</p><p><strong>근거 범위:</strong> KZG construction과 원 논문 application 범위에 한정합니다.</p><p><strong>말하지 않는 것:</strong> Transparent setup, post-quantum security, 기본 construction의 자동 hiding을 보장하지 않습니다.</p></CitationBlock></div>
        <div id="paper-halo-ipa"><CitationBlock source="Bowe·Grigg·Hopwood · Halo (2019)" citeKey={2} href="https://eprint.iacr.org/2019/1021.pdf"><p><strong>문제:</strong> Trusted setup 없이 recursive proof composition과 polynomial opening을 구성해야 합니다.</p><p><strong>기여:</strong> Inner-product 기반 polynomial commitment와 amortized verification 전략을 결합합니다.</p><p><strong>전제:</strong> Prime-order curve cycle, DLP, random-oracle과 논문의 amortization model을 사용합니다.</p><p><strong>근거 범위:</strong> Halo의 IPA PCS와 recursive construction 범위입니다.</p><p><strong>말하지 않는 것:</strong> 모든 IPA verifier의 동일 비용이나 post-quantum security를 뜻하지 않습니다.</p></CitationBlock></div>
        <p>이 글만으로 풀어야 하는 10문항은 F₁₇ 계산, API, KZG quotient·pairing, IPA inner product, 네 보안 축, 잘못된 y, degree/τ failure, 공정 benchmark, deployment 선택을 묻습니다. 각 답의 계산·전제·반례는 위 절에 있습니다.</p>
      </section>
    </article>
  );
}
