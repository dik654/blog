import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import SNARKInterfaceViz from "./viz/SNARKInterfaceViz";

export default function ModernSNARKOverviewArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">한 산술 관계에서 시작하는 SNARK</p><h2 className="text-3xl font-bold tracking-tight">w를 보여 주지 않고 x·w=y를 만족한다는 짧은 증거를 보낸다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">공개 입력 x=3, y=12와 비공개 witness w=4를 생각해 봅시다. 관계 R은 “x·w=y”이고 statement 또는 instance는 x̄=(3,12)입니다. Prover는 w를 사용해 proof π를 만들고 verifier는 x̄와 π만으로 accept/reject를 결정합니다.</p>
        <p><strong>SNARK</strong>는 Succinct Non-interactive Argument of Knowledge의 약자입니다. Succinct는 proof와 verification이 원 계산보다 작거나 빠르다는 계열별 비용 주장을, non-interactive는 setup 뒤 prover가 proof 하나를 보내면 된다는 메시지 구조를, argument는 무제한 공격자가 아니라 계산량이 제한된 공격자에 대한 soundness를, knowledge는 accept하는 prover에서 witness extractor를 논할 수 있다는 정의를 가리킵니다.</p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> 회로·R1CS·QAP 또는 PLONKish table이 “무엇이 참인가”를 정하고, PCS·pairing·transcript가 “그 사실을 얼마나 짧고 어떤 가정 아래 검사하는가”를 정합니다. 두 층을 합쳐 읽되 서로의 보장을 대신하게 해서는 안 됩니다.</aside>
        <ContentBoundary article="snark-overview" />
        <SNARKInterfaceViz />
      </section>

      <section id="interface" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · 인터페이스</p><h2 className="mt-2 text-2xl font-bold">Setup·Prove·Verify의 입력 소유권부터 고정한다</h2></header>
        <ExplainedFormula
          question="SNARK의 세 알고리즘은 무엇을 받고 무엇을 내놓는가?"
          idea={<>Setup은 relation 또는 size bound에 맞는 key를 만들고, prover는 public instance와 private witness를 결합해 proof를 만듭니다. Verifier는 witness를 받지 않습니다.</>}
          formula={String.raw`(pk,vk)\leftarrow\mathsf{Setup}(1^\lambda,R),\qquad \pi\leftarrow\mathsf{Prove}(pk,x,w),\qquad b\leftarrow\mathsf{Verify}(vk,x,\pi)`}
          terms={[
            { symbol: String.raw`\lambda`, name: "Security parameter", description: "공격 비용과 error 확률의 목표 크기를 정합니다." },
            { symbol: "R", name: "Relation", description: "Public instance x와 witness w가 만족해야 하는 조건입니다." },
            { symbol: "pk,vk", name: "Proving·verifying key", description: "Scheme에 따라 relation-specific 또는 universal setup에서 파생됩니다." },
            { symbol: "x,w", name: "Instance·witness", description: "x는 verifier에게 공개되고 w는 prover 내부에 남습니다." },
            { symbol: String.raw`\pi,b`, name: "Proof·decision", description: "전송되는 proof와 accept/reject bit입니다." },
          ]}
          assumptions={["Relation, field, public-input ordering, encoding과 key identifier가 양쪽에서 같습니다.", "Setup randomness·transcript challenge·prover blinding randomness는 scheme의 보안 요구를 충족합니다.", "Verify의 true는 해당 relation과 assumptions 아래의 cryptographic acceptance이지 외부 data provenance나 authorization이 아닙니다."]}
          interpretation="x=(3,12), w=4이면 completeness는 honest proof가 accept해야 한다고 말합니다. w=5인 거짓 relation을 accept시키기 어렵다는 것은 soundness이고, w=4라는 값에 관해 validity 이외를 드러내지 않는 성질은 zero knowledge입니다."
        />
        <p>Setup에는 세 가지를 구분해야 합니다. Groth16은 보통 회로별 CRS가 필요합니다. PLONK는 최대 degree를 위한 universal updatable SRS를 여러 회로에서 trim해 쓸 수 있지만, KZG 계열이라면 여전히 toxic waste 가정이 있습니다. STARK처럼 transparent public randomness를 쓰는 계열은 trusted setup이 없지만 proof size·hash·field·query 가정이 달라집니다.</p>
      </section>

      <section id="security" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · 보안 성질</p><h2 className="mt-2 text-2xl font-bold">Completeness·soundness·zero knowledge는 서로 다른 질문이다</h2></header>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[760px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">성질</th><th className="p-3">실패 질문</th><th className="p-3">필요한 검사</th><th className="p-3">자동 보장하지 않음</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3 font-medium text-foreground">Completeness</td><td className="p-3">참인데 reject하는가</td><td className="p-3">정상·boundary witness vector</td><td className="p-3">회로가 업무 의미를 완전히 표현함</td></tr><tr><td className="p-3 font-medium text-foreground">Soundness / knowledge soundness</td><td className="p-3">거짓 statement나 witness 없는 prover가 accept되는가</td><td className="p-3">Malformed proof·wrong input·subgroup·transcript fixture</td><td className="p-3">무제한 공격자에 대한 정보이론적 안전</td></tr><tr><td className="p-3 font-medium text-foreground">Zero knowledge</td><td className="p-3">Proof가 validity 밖의 witness 정보를 주는가</td><td className="p-3">Scheme proof·blinding·randomness·simulator 전제</td><td className="p-3">Public input·timing·application metadata 은닉</td></tr></tbody></table></div>
        <ExplainedFormula
          question="Random evaluation 한 번이 거짓 polynomial identity를 잡는다는 주장은 어느 정도인가?"
          idea={<>0이 아닌 차수 d 다항식은 field에서 root를 최대 d개만 가집니다. Challenge r을 균일하게 고르면 우연히 root에 걸릴 확률이 d/|F| 이하입니다.</>}
          formula={String.raw`P\ne 0,\ \deg P\le d,\ r\overset{\$}{\leftarrow}\mathbb F\quad\Longrightarrow\quad \Pr[P(r)=0]\le \frac{d}{|\mathbb F|}`}
          terms={[
            { symbol: "P", name: "Claim-difference polynomial", description: "참인 항등식이면 identically zero여야 하는 차이입니다." },
            { symbol: "d", name: "Degree bound", description: "Commitment·protocol이 실제로 강제해야 하는 최대 차수입니다." },
            { symbol: "r", name: "Challenge point", description: "Prover가 commitment를 고정한 뒤 예측하기 어렵게 정합니다." },
            { symbol: "|\mathbb F|", name: "Field size", description: "Challenge가 추출되는 유한체 원소 수입니다." },
          ]}
          assumptions={["P는 r을 보기 전에 고정되고 challenge는 요구된 분포와 domain separation을 따릅니다.", "Degree bound와 commitment binding이 지켜지며 malformed field/group encoding은 먼저 거절합니다.", "여러 check의 error를 합칠 때 union bound·repetition·batching 상관관계를 별도로 계산합니다."]}
          interpretation="예를 들어 |F|=101, d=2이면 한 check의 단순 상한은 2/101입니다. 실제 SNARK 보안은 이 한 줄뿐 아니라 PCS·pairing·knowledge assumption·Fiat–Shamir 모델과 reduction loss를 함께 봅니다."
        />
        <h3 className="text-xl font-semibold">Fiat–Shamir 경계</h3>
        <p>Interactive protocol의 verifier challenge를 hash로 바꿀 때는 protocol ID, curve/field, statement, public input, 이전 commitment를 canonical encoding과 순서로 transcript에 넣습니다. Challenge를 commitment 전에 고르거나 public input을 hash에서 빼면 prover가 challenge에 맞춰 proof를 조정하거나 같은 proof를 다른 statement에 재사용할 틈이 생깁니다. Fiat–Shamir는 보통 random-oracle model의 분석이며 모든 구현 transcript가 자동으로 그 proof를 상속하는 것은 아닙니다.</p>
      </section>

      <section id="selection" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 시스템 선택</p><h2 className="mt-2 text-2xl font-bold">Proof byte 하나보다 setup·prover·verifier·failure를 함께 잰다</h2></header>
        <p>Groth16은 회로별 setup과 pairing-friendly curve를 대가로 세 group element의 작은 proof와 빠른 검증을 제공합니다. PLONK 계열은 universal/updatable SRS와 표 형태의 arithmetization을 제공하지만 permutation·quotient·opening 구성과 transcript 비용이 있습니다. STARK 계열은 transparent setup과 hash 기반 검증을 택하는 대신 보통 proof가 더 큽니다. 계열 이름만으로 우열을 정할 수 없습니다.</p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-6"><strong>반례:</strong> verifier가 proof만 검증하고 public amount를 transcript와 input linear combination에 넣지 않았다면, cryptographic equation이 true여도 intended statement binding은 실패합니다. 또한 toxic waste가 노출된 CRS에서 나온 proof는 pairing check가 맞아도 soundness를 신뢰할 수 없습니다.</div>
        <div id="paper-snarks-for-c"><CitationBlock source="Ben-Sasson et al. · SNARKs for C (CRYPTO 2013)" citeKey={1} href="https://eprint.iacr.org/2013/507">
          <p><strong>문제:</strong> 일반 program execution을 짧고 공개 검증 가능한 zero-knowledge argument로 만들고 싶습니다.</p>
          <p><strong>기여:</strong> TinyRAM program과 QAP 기반 linear PCP를 잇는 공개 검증 SNARK 구현을 제시합니다.</p>
          <p><strong>전제:</strong> 논문의 setup·pairing/knowledge assumptions와 bounded TinyRAM execution·compiler를 사용합니다.</p>
          <p><strong>근거 범위:</strong> 해당 construction과 당시 prototype의 program/circuit 규모·평가에 한정합니다.</p>
          <p><strong>말하지 않는 것:</strong> 모든 SNARK가 같은 setup·proof size·post-quantum security를 갖거나 임의 application circuit이 안전하다는 뜻은 아닙니다.</p>
        </CitationBlock></div>
        <p>이 글의 10문항은 acronym, relation/instance/witness, 세 알고리즘, 세 보안 성질, setup 유형, random evaluation bound, Fiat–Shamir transcript, 잘못된 public binding, 비용 측정, 시스템 선택을 다룹니다. 따라서 아래의 Groth16·PLONK 글로 이동하기 전에 공통 언어와 실패 경계를 이 글 하나로 복원할 수 있습니다.</p>
      </section>
    </article>
  );
}
