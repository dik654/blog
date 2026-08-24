import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ProofSQLFlowViz from "./ProofSQLFlowViz";

export default function ModernProofSQLArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Committed table에서 검증 가능한 SELECT까지</p><h2 className="text-3xl font-bold tracking-tight">Proof of SQL은 결과가 특정 snapshot의 query에서 나왔음을 증명한다</h2></header>
      <p className="text-lg leading-8">표의 열 <code>a=[1,2,3,2]</code>, <code>b=[10,20,30,40]</code>에서 <code>SELECT SUM(b) WHERE a=2</code>의 결과는 60입니다. Proof system은 표 전체를 verifier에게 다시 보내지 않고도 이 filter와 aggregate relation이 committed snapshot에 대해 맞음을 보이려 합니다.</p>
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm"><strong>핵심 아이디어:</strong> SQL semantics를 field relation으로 바꾸고, 행 전체 합을 sumcheck로 한 random point까지 줄인 뒤 committed columns opening과 transcript binding으로 닫습니다.</aside>
      <ContentBoundary article="proofofsql"/><ProofSQLFlowViz/>
    </section>
    <section id="query-relation" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Query arithmetization</p><h2 className="mt-2 text-2xl font-bold">Filter selector와 aggregate를 polynomial identity로 만든다</h2></header>
      <ExplainedFormula question="네 행의 filter와 SUM 결과를 어떤 식으로 확인하는가?" idea={<>a_i=2인 행에서만 selector s_i가 1이 되도록 equality gadget을 만들고, 선택된 b_i의 합을 public result와 연결합니다.</>} formula={String.raw`s=(0,1,0,1),\qquad \sum_{i=0}^{3}s_i b_i=0+20+0+40=60`}
      annotatedFormula={String.raw`s=\underbrace{(0,1,0,1),\qquad \sum_{i=0}^{3}s_i b_i=0+20+0+40=60}_{\text{Filter selector 계산}}`}
      operations={[
        { expression: String.raw`(0,1,0,1),\qquad \sum_{i=0}^{3}s_i b_i=0+20+0+40=60`, annotation: ["Filter selector이(가) 식의 결과에 기여하는","방식을 계산합니다.","a_i=2인 행에서만 selector s_i가 1이 되도록","equality gadget을 만들고, 선택된 b_i의 합을"] },
      ]} terms={[{symbol:"s_i",name:"Filter selector",description:"행 i가 WHERE predicate를 만족하면 1인 constrained bit입니다."},{symbol:"b_i",name:"Aggregate column",description:"선택된 행에서 합산할 typed field value입니다."},{symbol:"60",name:"Public result",description:"Verifier가 query 결과로 받아들이는 값입니다."}]} assumptions={["Integer/decimal/string/NULL encoding과 overflow semantics가 SQL dialect와 일치합니다.","Selector는 boolean이며 predicate의 양방향 의미를 완전한 gadget으로 강제합니다.","Field modular sum이 application integer sum과 다르지 않도록 range/overflow bounds를 둡니다."]} interpretation="s_i(a_i−2)=0만 쓰면 s=(0,0,0,0)도 통과하므로 부족합니다. a=2인 행을 반드시 선택하는 equality gadget과 aggregate result identity가 모두 필요합니다."/>
      <ExplainedFormula question="4-row aggregate를 sumcheck 입력으로 어떻게 바꾸는가?" idea={<>Rows 0..3을 Boolean hypercube의 네 꼭짓점에 놓고 selector와 value table의 multilinear extensions를 만듭니다. Sumcheck는 전체 합을 round마다 한 변수씩 random challenge로 고정합니다.</>} formula={String.raw`\sum_{u\in\{0,1\}^2}\widetilde{s}(u)\widetilde{b}(u)=60`}
      annotatedFormula={String.raw`\sum_{u\in\{0,1\}^2}\widetilde{s}(u)\widetilde{b}(u)=\underbrace{60}_{\text{Row address 계산}}`}
      operations={[
        { expression: String.raw`60`, annotation: ["Row address이(가) 식의 결과에 기여하는 방식을","계산합니다.","Rows 0..3을 Boolean hypercube의 네","꼭짓점에 놓고 selector와 value table의"] },
      ]} terms={[{symbol:"u",name:"Row address",description:"두 bits로 표현한 네 행의 Boolean coordinate입니다."},{symbol:"s̃",name:"Selector MLE",description:"Boolean vertices에서 s table과 일치하는 multilinear polynomial입니다."},{symbol:"b̃",name:"Value MLE",description:"Boolean vertices에서 b column과 일치합니다."}]} assumptions={["Row order와 padding rows가 snapshot schema에 고정됩니다.","Product polynomial degree와 field size에 맞는 sumcheck soundness parameter를 사용합니다.","Final random-point evaluations는 committed columns opening으로 확인합니다."]} interpretation="4=2²이므로 두 sumcheck variables가 필요합니다. Sumcheck만 성공해도 evaluations가 실제 committed table에서 왔다는 뜻은 아니며 마지막 opening이 필요합니다."/>
      <p><strong>Failure 반례:</strong> NULL을 0으로 암묵 변환하거나 signed integer를 field residue로만 비교하면 SQL engine과 circuit 결과가 달라집니다. 지원하지 않는 semantics는 조용히 근사하지 말고 typed reject해야 합니다.</p>
    </section>
    <section id="table-commitment" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Snapshot과 Dory opening</p><h2 className="mt-2 text-2xl font-bold">Table root는 schema·row order·version까지 포함한다</h2></header>
      <p><code>table_id=T, schema=(a:int,b:int), row_order=0..3, version=7</code>과 column commitments를 한 snapshot identity에 묶습니다. Root만 있고 version/freshness policy가 없다면 과거의 올바른 proof를 현재 결과처럼 replay할 수 있습니다. Freshness는 verifier가 기대하는 version/root를 외부 합의로 얻는 별도 책임입니다.</p>
      <p>Dory 계열 opening은 committed vector의 random linear-combination evaluation을 recursive generalized inner-product argument로 확인합니다. 이는 column opening을 담당할 뿐 SQL filter 의미, data availability나 자동 zero knowledge를 제공하지 않습니다.</p>
    </section>
    <section id="verification" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Transcript verification</p><h2 className="mt-2 text-2xl font-bold">Query·snapshot·result를 challenge보다 먼저 묶는다</h2></header>
      <ExplainedFormula question="Fiat–Shamir transcript에 무엇을 어떤 순서로 넣는가?" idea={<>Protocol과 public statement를 canonical bytes로 흡수한 뒤 각 prover commitment를 흡수하고 그 다음 challenge를 뽑습니다.</>} formula={String.raw`r_j=H(\mathrm{domain}\Vert\mathrm{version}\Vert\mathrm{AST}\Vert\mathrm{schema}\Vert\mathrm{root}\Vert\mathrm{result}\Vert M_1\Vert\cdots\Vert M_j)`}
      annotatedFormula={String.raw`r_j=\underbrace{H(\mathrm{domain}\Vert\mathrm{version}\Vert\mathrm{AST}\Vert\mathrm{schema}\Vert\mathrm{root}\Vert\mathrm{result}\Vert M_1\Vert\cdots\Vert M_j)}_{\text{Snapshot root 계산}}`}
      operations={[
        { expression: String.raw`H(\mathrm{domain}\Vert\mathrm{version}\Vert\mathrm{AST}\Vert\mathrm{schema}\Vert\mathrm{root}\Vert\mathrm{result}\Vert M_1\Vert\cdots\Vert M_j)`, annotation: ["Snapshot root이(가) 식의 결과에 기여하는 방식을","계산합니다.","Protocol과 public statement를","canonical bytes로 흡수한 뒤 각 prover"] },
      ]} terms={[{symbol:"AST",name:"Canonical query AST",description:"Whitespace가 아니라 typed/normalized SQL semantics를 나타냅니다."},{symbol:"root",name:"Snapshot root",description:"Schema·rows·version에 결속된 commitment입니다."},{symbol:"M_j",name:"Round message",description:"Challenge r_j 전에 고정되는 prover commitment입니다."},{symbol:"r_j",name:"Challenge",description:"Current statement와 이전 messages에서 domain-separated로 생성합니다."}]} assumptions={["Hash를 random oracle로 모델링하는 Fiat–Shamir security 경계를 따릅니다.","모든 serialization은 canonical하고 length/type separated입니다.","Challenge field reduction과 retry rule을 versioned protocol로 고정합니다."]} interpretation="같은 proof messages라도 result 60을 40으로, snapshot v7을 v6으로 바꾸면 transcript challenge가 달라져야 합니다. Query AST나 root를 빼면 substitution/replay surface가 생깁니다."/>
    </section>
    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">지원 SQL과 privacy를 먼저 쓰고 성능은 단계별로 잰다</h2></header>
      <p>Pinned source SHA, dialect/operator/type/NULL policy, schema/snapshot/commitment/transcript profile을 receipt에 둡니다. Wrong row order·type·NULL·filter·aggregate·result·root·opening·old snapshot replay를 거절한 뒤 ingest/commit/query/prove/verify를 분리해 CPU/GPU, RSS/VRAM, proof bytes를 측정합니다. Proof가 있다는 사실만으로 private columns가 숨겨지거나 원본 data가 가용한 것은 아닙니다.</p>
      <div id="paper-proof-of-sql-source"><CitationBlock source="Space and Time · Proof of SQL pinned 8b0de6b" citeKey={1} href="https://github.com/spaceandtimefdn/sxt-proof-of-sql/tree/8b0de6b9b9c2e2ef6d20e5a9faf833c3ab1d0829"><p><strong>문제:</strong> 지원 SQL과 실제 prover/verifier seam을 확인해야 합니다.</p><p><strong>기여:</strong> Rust source·docs·tests·bench의 pinned snapshot입니다.</p><p><strong>전제:</strong> Commit과 features/GPU/schema profile을 고정합니다.</p><p><strong>근거 범위:</strong> 선택 commit이 구현한 query/protocol/API입니다.</p><p><strong>말하지 않는 것:</strong> 모든 SQL·완전한 privacy·모든 hardware SLA를 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-dory"><CitationBlock source="Lee · Dory: Efficient, Transparent Arguments for Generalised Inner Products" citeKey={2} href="https://eprint.iacr.org/2020/1274.pdf"><p><strong>문제:</strong> Structured vector relations를 transparent setup에서 짧게 열어야 합니다.</p><p><strong>기여:</strong> Pairing commitments와 recursive generalized IPA를 제시합니다.</p><p><strong>전제:</strong> 논문의 bilinear-group assumptions와 protocol model을 씁니다.</p><p><strong>근거 범위:</strong> Dory commitment/opening과 논문 분석입니다.</p><p><strong>말하지 않는 것:</strong> SQL semantics·freshness·data availability를 증명하지 않습니다.</p></CitationBlock></div>
    </section>
  </article>;
}
