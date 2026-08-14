import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import FRIFoldingViz from "./FRIFoldingViz";

export default function ModernFRIArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">Low-degree oracle를 검사하는 FRI</p><h2 className="text-3xl font-bold tracking-tight">긴 평가표가 낮은 차수 다항식에 가깝다는 것을 일부만 읽고 확인한다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">F₁₇의 f(X)=X²+2X+3을 16개의 서로 다른 domain point에서 계산하면 evaluation vector가 됩니다. Degree 2 이하 polynomial에서 나온 이런 vector들의 집합이 Reed–Solomon code입니다. FRI는 committed oracle가 이 집합의 한 codeword와 충분히 가깝다는 <strong>proximity</strong>를 검사합니다.</p>
        <p>모든 값을 읽는 대신 값을 반복해서 절반 크기로 접고, 각 중간 oracle를 Merkle root로 고정한 뒤 일부 위치만 엽니다. 따라서 FRI가 답하는 질문은 “이 실행이 맞는가?”가 아니라 “이 oracle가 합의한 degree bound를 만족하는 codeword에 가까운가?”입니다. 실행 의미는 STARK의 trace와 AIR가 담당합니다.</p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> polynomial의 짝수 차수 항과 홀수 차수 항을 분리하면 두 polynomial의 차수가 절반가량 됩니다. Commitment 뒤에 받은 random β로 둘을 섞으면 거짓 oracle가 모든 round를 일관되게 통과하기 어렵습니다.</aside>
        <ContentBoundary article="fri" />
        <FRIFoldingViz />
      </section>

      <section id="folding" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Even/odd folding</p><h2 className="mt-2 text-2xl font-bold">x와 −x 두 값을 다음 oracle의 한 값으로 접는다</h2></header>
        <ExplainedFormula
          question="Polynomial의 degree와 evaluation domain을 한 round에서 어떻게 절반으로 줄이는가?"
          idea={<>f의 짝수 지수 coefficient와 홀수 지수 coefficient를 각각 T=X²의 polynomial로 묶습니다. 그 뒤 commitment를 본 verifier가 β를 고르고 두 부분을 선형 결합합니다.</>}
          formula={String.raw`f(X)=f_{\mathrm{even}}(X^2)+Xf_{\mathrm{odd}}(X^2),\quad g(T)=f_{\mathrm{even}}(T)+\beta f_{\mathrm{odd}}(T)`}
          terms={[
            { symbol: "f_{\\mathrm{even}}", name: "Even polynomial", description: "a₀+a₂T+a₄T²처럼 짝수 차수 coefficient를 모읍니다." },
            { symbol: "f_{\\mathrm{odd}}", name: "Odd polynomial", description: "a₁+a₃T+a₅T²처럼 홀수 차수 coefficient를 모읍니다." },
            { symbol: "T=X^2", name: "Folded coordinate", description: "x와 −x가 같은 T에 대응하여 domain을 절반으로 줄입니다." },
            { symbol: "\\beta", name: "Round challenge", description: "현재 oracle commitment 뒤 transcript에서 얻는 예측 불가능한 field 값입니다." },
            { symbol: "g", name: "Folded polynomial", description: "대략 절반 degree를 갖는 다음 round polynomial입니다." },
          ]}
          assumptions={["Domain은 x와 −x를 pair할 수 있고 square mapping 뒤 다음 domain과 일치하도록 선택합니다.", "β는 현재 oracle root가 고정된 다음 생성되며 statement·round·root에 domain-separated 됩니다.", "Characteristic 2가 아닌 field에서 pair evaluation으로 even/odd 값을 복구할 때 2x의 inverse가 존재해야 합니다."]}
          interpretation="예에서 f_even(T)=T+3, f_odd(T)=2입니다. β=5이면 g(T)=T+13입니다. x=4일 때 f(4)=10, f(−4)=f(13)=11이고 even=(10+11)/2=2, odd=(10−11)/(2·4)=2입니다. T=16에서 g=2+5·2=12이며 16+13도 12가 됩니다."
        />
        <p><strong>증명 아이디어:</strong> parity 분해는 coefficient마다 유일합니다. 거짓 prover가 서로 양립하지 않는 even·odd 설명을 준비했다면, commitment 이후 무작위 β를 맞춰 한 낮은 차수 g로 계속 보이게 할 자유도가 줄어듭니다. β를 미리 알려주면 그 β에만 맞는 oracle를 만들 수 있으므로 commit-first 순서가 보안 전제입니다.</p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-6"><strong>실패 반례:</strong> x와 −x가 아닌 임의 두 index를 pair하거나 2x inverse를 잘못 적용하면 honest f도 folding 식을 통과하지 못합니다. 반대로 β를 root보다 먼저 고르면 malicious oracle가 그 선형 결합만 낮은 차수처럼 보이도록 조정할 수 있습니다.</div>
      </section>

      <section id="soundness" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Merkle query와 soundness</p><h2 className="mt-2 text-2xl font-bold">봉인은 값을 인증하고, folding과 sampling이 차수를 검사한다</h2></header>
        <p>각 round에서 prover는 oracle의 Merkle root를 보낸 뒤 β를 받습니다. 모든 round root가 정해진 다음 query index를 transcript에서 뽑고, 원래 oracle의 f(x), f(−x), 다음 oracle의 g(x²)와 각 Merkle authentication path를 엽니다. Merkle tree는 “root에 들어 있던 값”을 확인할 뿐 낮은 차수를 보장하지 않습니다.</p>
        <ExplainedFormula
          question="δ 비율의 잘못된 위치를 q번 독립 sampling이 모두 놓칠 단순 상한은 얼마인가?"
          idea={<>각 query가 bad set을 피할 확률이 1−δ이고, replacement가 있는 독립 query라면 조건부 확률을 q번 곱합니다. 이는 FRI 전체 theorem이 아니라 sampling intuition의 작은 구성요소입니다.</>}
          formula={String.raw`\Pr[\text{all }q\text{ queries miss the bad set}]\le(1-\delta)^q`}
          terms={[
            { symbol: "\\delta", name: "Bad-position fraction", description: "현재 oracle에서 inconsistent한 위치가 차지하는 비율입니다." },
            { symbol: "q", name: "Independent query count", description: "Transcript가 뽑은 독립적인 검사 횟수입니다." },
            { symbol: "(1-\\delta)^q", name: "Simple miss bound", description: "모든 query가 정상 위치에만 떨어질 확률입니다." },
          ]}
          assumptions={["Query index들은 bad set이 고정된 뒤 독립적이고 충분히 균일하게 뽑힙니다.", "각 query는 필요한 pair·folded value·Merkle path를 모두 검사합니다.", "실제 FRI soundness에는 code distance, round correlation, list decoding, field/domain과 final degree 검사가 추가됩니다."]}
          interpretation="δ=1/4, q=3이면 miss≤(3/4)³=27/64≈0.422입니다. 같은 index를 세 번 반복하면 독립성이 없어 실제 miss는 3/4이므로 이 식을 쓸 수 없습니다. 실제 parameter는 FRI 논문의 전체 proximity bound와 구현 profile로 산정해야 합니다."
        />
        <p>Release 전에는 wrong pair, wrong fold, altered root/path, final degree 초과, transcript round reorder를 각각 주입해야 합니다. 정상 proof뿐 아니라 이 실패들이 같은 reason code로 prover/verifier 구현에서 재현된 뒤 query 수·proof bytes·hash count·verification time을 비교합니다.</p>
      </section>

      <section id="stark-boundary" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · STARK에 넘기는 경계</p><h2 className="mt-2 text-2xl font-bold">FRI는 low degree만 맡고 실행의 의미는 AIR가 맡는다</h2></header>
        <p>STARK는 execution trace에서 transition·boundary constraints를 만들고, 이를 composition polynomial과 low-degree extension oracle로 바꾼 다음 FRI에 넘깁니다. FRI가 성공해도 AIR constraint가 누락됐거나 trace column 의미가 틀렸다면 원래 프로그램은 여전히 잘못될 수 있습니다.</p>
        <p>같은 F₁₇ 예를 STARK가 사용한다면 trace와 AIR가 “x=4에서 Horner 계산 결과가 10”이라는 관계를 만들고, FRI는 그 결과로 얻은 committed composition oracle의 degree proximity를 검사합니다. 두 소유 경계를 섞지 않아야 soundness bug를 어디서 찾아야 할지 알 수 있습니다.</p>
        <div id="paper-fri"><CitationBlock source="Ben-Sasson et al. · Fast Reed–Solomon IOP of Proximity (ICALP 2018)" citeKey={1} href="https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ICALP.2018.14"><p><strong>문제:</strong> 큰 evaluation oracle가 low-degree Reed–Solomon codeword에 가까운지 sublinear communication으로 검사해야 합니다.</p><p><strong>기여:</strong> Interactive oracle proof of proximity와 recursive folding construction·soundness 분석을 제시합니다.</p><p><strong>전제:</strong> 논문의 field, evaluation domain, distance, randomness, oracle-access model과 parameter 조건을 사용합니다.</p><p><strong>근거 범위:</strong> FRI proximity protocol과 논문 theorem·complexity 범위에 한정합니다.</p><p><strong>말하지 않는 것:</strong> AIR completeness, STARK 전체 zero knowledge, 단순 (1−δ)^q만으로의 전체 soundness를 보장하지 않습니다.</p></CitationBlock></div>
        <p>이 글의 10문항은 RS membership/proximity, 수치 folding, β 순서, Merkle 역할, 단순 miss bound, FRI 출력, malformed pair, correlated query 반례, parameter 비용, STARK 경계를 묻습니다. 답에 필요한 계산과 caveat를 모두 본문에 두었습니다.</p>
      </section>
    </article>
  );
}
