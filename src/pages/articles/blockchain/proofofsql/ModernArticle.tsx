import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProofSQLFlowViz from "./ProofSQLFlowViz";
import { codeRefs } from "./codeRefs";
import { proofOfSqlTree } from "./fileTrees";

const COMMIT = "f28544df71c1afd04e4675ee4e798fa2a5f82551";
const SOURCE = `https://github.com/spaceandtimefdn/sxt-proof-of-sql/tree/${COMMIT}`;
const SQL_SPEC = `https://github.com/spaceandtimefdn/sxt-proof-of-sql/blob/${COMMIT}/docs/SQLSyntaxSpecification.md`;
const DORY = "https://eprint.iacr.org/2020/1274.pdf";

const ROWS = [
  [1, 99, 101, 1, 101],
  [2, 99, 102, 1, 102],
  [2, 99, 103, 1, 103],
  [1, 99, 104, 1, 104],
  [2, 0, 105, 0, 0],
] as const;

export default function ModernProofSQLArticle() {
  const sidebar = useCodeSidebar();
  const openSource = (key: string) => sidebar.open(key, codeRefs[key]);

  return (
    <>
      <article className="space-y-14 [overflow-wrap:anywhere]">
        <section id="overview" className="space-y-6 scroll-mt-20">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">한 문장으로 먼저 답하기</p>
            <h2 className="max-w-4xl break-keep text-3xl font-bold tracking-tight">
              Proof of SQL은 plan·결과·열 commitment가 한 임의점에서 맞는지 확인합니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            “SQL 문자열이 참이다”를 통째로 증명하는 마법이 아닙니다. 현재 구현은 직렬화된
            proof plan, 반환 결과, 표 길이, query가 참조한 열들의 commitments, proof
            messages를 transcript에 묶습니다. 그 뒤 SQL 계산 관계를 sumcheck로 임의점
            하나까지 줄이고, 마지막 평가값이 committed columns에 속하는지 확인합니다.
          </p>
          <p>
            따라서 proof가 통과했다는 말의 정확한 뜻은 “검증자가 제공한 같은 plan·결과·길이·
            commitments·setup 아래에서 이 계산 관계가 맞다”입니다. 어느 snapshot이 최신인지,
            commitments를 누가 정직하게 배포했는지, 원본 데이터가 가용한지는 별도 정책입니다.
          </p>

          <ProofSQLFlowViz />
          <ContentBoundary article="proofofsql" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["사례", "5 rows → 410 · 4", "공식 aggregate test 한 건을 모든 절에서 그대로 씁니다."],
              ["압축", "3-round sumcheck", "5행을 8꼭짓점 공간에 놓고 한 임의점의 주장으로 줄입니다."],
              ["마감", "generic evaluation proof", "Dory 하나에 고정하지 않고 선택한 commitment scheme으로 엽니다."],
            ].map(([eyebrow, title, body]) => (
              <article key={eyebrow} className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{eyebrow}</p>
                <h3 className="mt-2 break-keep text-sm font-black">{title}</h3>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="black-box" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">01 · 이름보다 입출력을 먼저 보기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Prover는 데이터까지 받고 verifier는 commitments와 proof를 받습니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">주체</th><th className="p-3">받는 것</th><th className="p-3">하는 일</th></tr>
              </thead>
              <tbody>
                {[
                  ["Prover", "proof plan·원본 columns·setup·params", "query를 실행하고 result와 QueryProof 생성"],
                  ["Verifier", "같은 plan·result·column commitments·setup·params", "transcript 재생, result·sumcheck·opening 대조"],
                  ["Application", "snapshot·schema·source/version 정책", "어떤 commitments와 plan을 신뢰할지 선택"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            외부 API인 <code>VerifiableQueryResult&lt;CP&gt;</code>도 결과 table과 proof를 따로
            보관합니다. 검증 호출에는 proof만 넣지 않습니다. 같은 <code>expr</code>,
            commitment accessor, verifier setup, literal params를 다시 전달합니다.
          </p>
          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="반환 result·proof API 원문" onClick={() => openSource("posql-result-api")} />
          </div>
        </section>

        <section id="case" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">02 · 같은 작은 사례를 끝까지 유지하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              공식 test는 b가 99인 네 행의 c를 더해 410과 4를 반환합니다
            </h2>
          </header>

          <p>
            Query는 <code>SELECT SUM(c) AS sum_c, COUNT(*) AS __count__ FROM sxt.t WHERE b=99</code>
            입니다. 다섯 번째 행의 <code>c=105</code>는 값이 크지만 <code>b=0</code>이므로
            집계에서 빠집니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-center text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-2">row</th><th className="p-2">a</th><th className="p-2">b</th><th className="p-2">c</th><th className="p-2">s</th><th className="p-2">s·c</th></tr>
              </thead>
              <tbody>
                {ROWS.map(([a, b, c, selector, selected], index) => (
                  <tr key={index} className="border-t border-border font-mono">
                    <td className="p-2 text-muted-foreground">{index}</td><td className="p-2">{a}</td><td className="p-2">{b}</td><td className="p-2">{c}</td><td className="p-2">{selector}</td><td className="p-2 font-bold">{selected}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-border bg-muted/20 font-bold">
                <tr><td className="p-2" colSpan={4}>합계</td><td className="p-2">4</td><td className="p-2">410</td></tr>
              </tfoot>
            </table>
          </div>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="공식 5행 aggregate fixture" onClick={() => openSource("posql-aggregate-fixture")} />
          </div>
        </section>

        <section id="query-relation" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">03 · SQL 의미를 행별 장부로 바꾸기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Selector 하나가 WHERE·SUM·COUNT를 같은 행에 연결합니다
            </h2>
          </header>

          <ExplainedFormula
            question="다섯 행의 결과 410과 4를 먼저 어떤 장부로 이해하면 될까요?"
            idea="b가 99인 행만 selector s를 1로 둡니다. s와 c를 곱해 더하면 SUM이고, s 자체를 더하면 COUNT입니다."
            formula={String.raw`s=(1,1,1,1,0),\qquad \sum_i s_i c_i=410,\qquad \sum_i s_i=4`}
            annotatedFormula={String.raw`\begin{aligned}
              \underbrace{s}_{\text{b=99인 행만 1}}&=(1,1,1,1,0) \\
              \sum_i s_i c_i&=101+102+103 \\
              &\quad+104+0 \\
              &=\underbrace{410}_{\text{선택된 c의 합}} \\
              \sum_i s_i&=1+1+1+1+0 \\
              &=\underbrace{4}_{\text{선택된 행의 수}}
            \end{aligned}`}
            operations={[
              { expression: String.raw`s_i=[b_i=99]`, annotation: ["rows 0..3은 1", "row 4는 0", "predicate의 양방향 의미가 필요"] },
              { expression: String.raw`\sum_i s_i c_i`, annotation: ["선택되지 않은 105는 0으로 지워짐", "101+102+103+104=410"] },
              { expression: String.raw`\sum_i s_i`, annotation: ["같은 selector를 다시 사용", "선택 행 수 4"] },
            ]}
            terms={[
              { symbol: "s_i", name: "filter selector", description: "i번째 행이 WHERE b=99를 만족하면 1인 값입니다." },
              { symbol: "c_i", name: "aggregate value", description: "i번째 행에서 SUM에 넣을 c 값입니다." },
              { symbol: "410,4", name: "returned result", description: "Verifier가 proof와 함께 받는 결과 table의 두 값입니다." },
            ]}
            assumptions={[
              "설명용 selector 장부는 SQL 의미를 보여 줍니다. 실제 구현은 equality gadget과 folded aggregate relation을 사용합니다.",
              "Typed encoding, NULL, overflow와 비교 의미는 지원 SQL profile과 같아야 합니다.",
              "Selector는 0 또는 1이고 predicate와 양방향으로 연결되어야 합니다.",
            ]}
            interpretation="마지막 행의 105를 더하면 515가 되므로 틀립니다. 반대로 반환 SUM만 409로 바꾸면 이 장부에는 1의 차이가 남습니다."
          />

          <p>
            실제 <code>AggregateExec</code>는 이 식을 그대로 한 줄 쓰지 않습니다. 입력과 출력의
            SUM·COUNT 열을 challenge <code>beta</code>로 접고, 입력 쪽과 출력 쪽의 차이가 전체
            합 0이 되도록 <code>ZeroSum</code> subpolynomial을 등록합니다. 작은 장부와 실제
            wire-level 관계를 구별해야 합니다.
          </p>
          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="실제 aggregate ZeroSum 관계" onClick={() => openSource("posql-aggregate-relation")} />
          </div>
        </section>

        <section id="row-space" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">04 · 다섯 행을 sumcheck 공간에 놓기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              5를 표현하려면 세 변수가 필요하므로 8칸 중 뒤 3칸은 padding입니다
            </h2>
          </header>

          <ExplainedFormula
            question="행은 5개인데 왜 sumcheck를 세 라운드 실행하나요?"
            idea="두 bits는 네 위치밖에 구별하지 못합니다. 세 bits로 여덟 꼭짓점을 만들고, 길이 5를 나타내는 indicator가 padding 세 칸을 실제 행에서 제외합니다."
            formula={String.raw`n=5,\qquad v=\max(\lceil\log_2 5\rceil,1)=3,\qquad \{0,1\}^3\text{ has }8\text{ points}`}
            annotatedFormula={String.raw`\begin{aligned}
              \underbrace{n}_{\text{실제 행 수}}&=5 \\
              \underbrace{v}_{\text{sumcheck 변수 수}}&=\max(\lceil\log_2 5\rceil,1)=3 \\
              \underbrace{2^v}_{\text{Boolean 꼭짓점 수}}&=8=\underbrace{5}_{\text{rows}}+\underbrace{3}_{\text{padding}}
            \end{aligned}`}
            operations={[
              { expression: String.raw`2^2=4<5`, annotation: ["두 변수로는 다섯 행을 주소화할 수 없음"] },
              { expression: String.raw`2^3=8\ge5`, annotation: ["세 변수가 필요", "sumcheck도 세 rounds"] },
              { expression: String.raw`\chi_5(u)`, annotation: ["첫 다섯 위치만 실제 row", "padding 세 위치를 구분"] },
            ]}
            terms={[
              { symbol: "v", name: "sumcheck variables", description: "Boolean row address의 bit 수이자 sumcheck round 수입니다." },
              { symbol: "χ₅", name: "length indicator", description: "임의점에서 table length 5를 나타내는 MLE 평가입니다." },
              { symbol: "padding", name: "unused vertices", description: "공간을 2의 거듭제곱으로 맞추기 위해 추가된 실제 행이 아닌 위치입니다." },
            ]}
            assumptions={[
              "Verifier transcript에는 table length가 들어갑니다.",
              "Length indicator와 row range가 proof plan의 실제 평가에 일관되게 사용됩니다.",
              "다른 table length로 같은 proof를 재사용하면 transcript와 chi evaluation이 달라집니다.",
            ]}
            interpretation="다섯 번째 행이 있다고 주장하면서 길이를 4로 바꾸거나, padding에 값을 숨겨 집계하려 하면 길이와 임의점 평가가 맞지 않아야 합니다."
          />
        </section>

        <section id="statement" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">05 · 임의수를 뽑기 전에 검증 문장 고정하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              현재 transcript에는 table root 하나가 없습니다
            </h2>
          </header>

          <p>
            기존 설명처럼 “schema·row order·version이 들어간 table root 하나”를 현재
            라이브러리의 기본 wire format으로 보면 안 됩니다.
          </p>
          <p>
            <code>QueryProof::new</code>와 <code>verify</code>는 setup hash, 직렬화된 proof plan,
            반환 result, 각 참조 table의 length와 column commitments를 같은 순서로 넣습니다.
            이어서 <code>min_row_num</code>, 두 round messages, evaluation values도 transcript에
            넣습니다.
          </p>

          <ExplainedFormula
            question="Challenge가 다른 query나 다른 결과에 재사용되지 않게 무엇을 먼저 흡수하나요?"
            idea="Prover와 verifier가 같은 순서로 공개 문장과 이전 proof message를 직렬화합니다. 어느 항목이 바뀌어도 뒤의 challenge가 달라집니다."
            formula={String.raw`T=H(\text{setup}\Vert\text{plan}\Vert\text{result}\Vert\text{lengths}\Vert\text{column commitments}\Vert\text{messages})`}
            annotatedFormula={String.raw`\begin{aligned}
              T=H(&\underbrace{\text{setup}\Vert\text{plan}}_{\text{검증 규칙}} \\
                  &\Vert\underbrace{\text{result}\Vert\text{lengths}}_{\text{410·4와 5행}} \\
                  &\Vert\underbrace{\text{column commitments}}_{\text{참조한 b·c 등}} \\
                  &\Vert\underbrace{\text{round messages}}_{\text{challenge 전에 고정}})
            \end{aligned}`}
            operations={[
              { expression: String.raw`\mathrm{serialize}(plan,result)`, annotation: ["SQL text가 아니라 실제 typed proof plan", "반환 table도 먼저 고정"] },
              { expression: String.raw`\mathrm{serialize}(lengths,commitments)`, annotation: ["각 table length", "참조 열별 commitment"] },
              { expression: String.raw`r_j\leftarrow T.challenge()`, annotation: ["이전 message를 흡수한 뒤 challenge", "prover와 verifier가 같은 순서 재생"] },
            ]}
            terms={[
              { symbol: "plan", name: "serialized proof plan", description: "검증 가능한 operator tree와 typed expressions입니다." },
              { symbol: "result", name: "owned table result", description: "이 사례에서는 sum_c=410, __count__=4입니다." },
              { symbol: "commitments", name: "referenced columns", description: "Commitment accessor가 제공하는 query 참조 열의 commitments입니다." },
            ]}
            assumptions={[
              "직렬화 형식과 SETUP_HASH를 포함한 protocol profile이 고정되어 있습니다.",
              "Verifier가 신뢰하는 commitments를 올바른 snapshot에서 가져오는 책임은 애플리케이션에 있습니다.",
              "Source commit이 바뀌면 transcript·proof 호환성을 별도로 확인합니다.",
            ]}
            interpretation="결과 410을 409로, 길이 5를 4로, b 열 commitment를 다른 snapshot의 값으로 바꾸면 같은 challenge 흐름을 재생할 수 없어야 합니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Prover transcript 원문" onClick={() => openSource("posql-prover-transcript")} />
            <CodeViewButton label="Verifier transcript 원문" onClick={() => openSource("posql-verifier-transcript")} />
          </div>
        </section>

        <section id="prove-path" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">06 · 같은 query의 prover 경로</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              결과를 먼저 고정하고 sumcheck가 정한 한 점에서 모든 MLE를 접어 엽니다
            </h2>
          </header>

          <AlgorithmBlock
            title="공식 QueryProof::new와 같은 순서의 의사코드"
            input={["proof plan: SUM(c), COUNT(*) WHERE b=99", "columns a·b·c, 5 rows", "commitment prover setup", "params=[]"]}
            steps={[
              { code: "result ← execute(plan, columns) = {sum_c:410, count:4}", note: "먼저 query를 실행하고 반환 table을 transcript에 넣습니다." },
              { code: "T.absorb(setup, plan, result, lengths, column_commitments, first_message)", note: "임의 challenge보다 먼저 검증 문장과 first-round witness commitments를 고정합니다." },
              { code: "final_message ← evaluate_plan_with_post_result_challenges(plan)", note: "Filter·aggregate gadget이 필요한 intermediate MLE와 ZeroSum 관계를 만듭니다." },
              { code: "r ← sumcheck.create(T, three_variable_state)", note: "3 rounds 뒤 Boolean cube 전체 합 주장을 임의점 r 하나로 줄입니다." },
              { code: "evals ← evaluate(first_round, columns, final_round, at=r)", note: "같은 r에서 proof에 필요한 모든 MLE의 값을 계산해 transcript에 넣습니다." },
              { code: "folded_mle ← random_linear_combination(all_mles); opening ← CP.new(folded_mle,r)", note: "많은 evaluations를 한 generic commitment evaluation proof로 묶습니다." },
            ]}
            output="result table {410,4} + QueryProof<CP>"
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Sumcheck→임의점→opening 원문" onClick={() => openSource("posql-prover-sumcheck")} />
          </div>
        </section>

        <section id="proof-shape" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">07 · proof 구조체와 opening 방식을 구별하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Dory는 가능한 CP 구현 중 하나이며 현재 구조는 HyperKZG에도 열려 있습니다
            </h2>
          </header>

          <p>
            실제 <code>QueryProof&lt;CP&gt;</code>에는 first/final round message, sumcheck proof,
            first-round·참조 열·final-round MLE 평가값, <code>evaluation_proof: CP</code>가 있습니다.
            이 마지막 <code>CP</code>가 commitment evaluation을 담당합니다.
          </p>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
            <article className="min-w-0 bg-background p-4">
              <p className="text-[10px] font-black text-primary">Proof 안</p>
              <ul className="mt-3 space-y-2 text-xs leading-5">
                <li>· first/final round messages와 intermediate commitments</li>
                <li>· 3-round sumcheck proof</li>
                <li>· 임의점의 first/column/final MLE evaluations</li>
                <li>· 선택한 CP의 evaluation proof</li>
              </ul>
            </article>
            <article className="min-w-0 bg-background p-4">
              <p className="text-[10px] font-black text-amber-700 dark:text-amber-300">호출자가 따로 제공</p>
              <ul className="mt-3 space-y-2 text-xs leading-5">
                <li>· 같은 proof plan과 literal params</li>
                <li>· 참조 열 commitments와 table lengths</li>
                <li>· verifier public setup</li>
                <li>· snapshot freshness·source/version 정책</li>
              </ul>
            </article>
          </div>

          <p>
            Dory는 generalized inner product를 짧게 여는 방법을 제공합니다. 그러나 현재
            repository의 README 성능 그래프는 HyperKZG를 사용하고, trait 아래에는 Dory·
            HyperKZG·inner-product·test용 naive 경로가 존재합니다. 그래서 글 제목과 설명을
            “Proof of SQL = Dory”로 고정하면 현재 코드의 선택 지점을 가립니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="QueryProof 필드 원문" onClick={() => openSource("posql-proof-shape")} />
            <CodeViewButton label="Generic commitment trait 원문" onClick={() => openSource("posql-commitment-trait")} />
          </div>
        </section>

        <section id="verify-path" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">08 · 같은 query의 verifier 경로</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Transcript 재생 뒤 result·sumcheck·opening을 서로 다른 단계에서 거절합니다
            </h2>
          </header>

          <AlgorithmBlock
            title="공식 QueryProof::verify와 같은 순서의 의사코드"
            input={["QueryProof<CP>", "claimed result {410,4}", "같은 proof plan·params", "table lengths·column commitments·verifier setup"]}
            steps={[
              { code: "T ← replay(setup, plan, result, lengths, commitments, round_messages)", note: "Prover와 같은 challenge를 얻지 못하면 뒤의 proof가 맞을 수 없습니다." },
              { code: "subclaim ← sumcheck.verify_without_evaluation(T, vars=3, claimed_sum=0)", note: "먼저 round consistency를 확인하고 마지막 임의점 r과 expected evaluation을 얻습니다." },
              { code: "plan_eval ← plan.verifier_evaluate(builder, column_evals, length_chi, params)", note: "같은 SQL operator tree를 r에서 다시 계산합니다." },
              { code: "require plan_eval.columns = result.mle_evaluations(r)", note: "반환 table 410·4가 proof plan이 계산한 결과와 일치해야 합니다." },
              { code: "require builder.sumcheck_evaluation = subclaim.expected_evaluation", note: "재구성한 ZeroSum 관계가 sumcheck의 마지막 주장과 같아야 합니다." },
              { code: "CP.verify_batched_proof(commitments, evals, r)", note: "마지막으로 제출된 evaluations가 실제 commitments에 속하는지 확인합니다." },
            ]}
            output="verified result table + verification_hash"
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Result·sumcheck·opening 최종 검사" onClick={() => openSource("posql-verifier-checks")} />
          </div>

          <p>
            현재 마지막 오류 문자열은 generic <code>CP</code>를 쓰면서도 “Inner product proof”라고
            표현합니다. 오류 문구만 보고 사용한 commitment scheme을 단정하지 말고 type과 setup
            profile을 함께 기록해야 합니다.
          </p>
        </section>

        <section id="failure-boundaries" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">09 · 확인한 것과 실행하지 못한 것을 분리하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              CPU test 3개만 통과했고 전체 SQL 경로는 남았습니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">검증 항목</th><th className="p-3">결과</th><th className="p-3">말할 수 있는 범위</th></tr>
              </thead>
              <tbody>
                {[
                  ["공식 aggregate fixture 산술", "101+102+103+104=410, count=4", "글의 작은 사례와 expected table이 일치"],
                  ["make_sumcheck_prover_state test", "통과", "공식 CPU 경로에서 sumcheck state 구성 확인"],
                  ["simple sumcheck proof test", "통과", "공식 sumcheck create·verify 경로 확인"],
                  ["naive evaluation proof, length 5", "통과", "5행 임의점 evaluation opening의 test 경로 확인"],
                  ["aggregate_exec integration test", "로컬 미실행", "module이 blitzar feature로 gated"],
                  ["blitzar feature build", "Mac ARM에서 실패", "blitzar-sys가 Linux만 지원한다고 중단"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            따라서 “공식 aggregate end-to-end test를 이 환경에서 통과했다”고 쓰지 않습니다.
            고정 commit의 test source는 읽었고, 그 하부 CPU 단계 세 개는 실행했지만 전체 SQL
            integration 경로는 Linux+blitzar 환경에서 다시 닫아야 합니다.
          </p>
        </section>

        <section id="release" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">10 · 운영에 넣기 전에 의미와 비용 고정하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              지원 SQL·snapshot 정책·commitment profile을 잠근 뒤 단계별 비용을 잽니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">Release gate</th><th className="p-3">고정할 것</th><th className="p-3">거절 fixture</th></tr>
              </thead>
              <tbody>
                {[
                  ["Query semantics", "지원 operator·type·NULL·overflow·params", "wrong filter·aggregate·type·unsupported syntax"],
                  ["Statement", "source SHA·SETUP_HASH·plan serialization·result schema", "plan/result/length substitution"],
                  ["Dataset identity", "table refs·column commitments·row range·freshness source", "old or mismatched commitments"],
                  ["Proof profile", "CP scheme·prover/verifier setup·security parameters", "wrong setup·opening·malformed proof"],
                  ["Cost", "ingest·commit·execute·sumcheck·opening·verify·proof bytes·RSS/VRAM", "같은 workload·hardware에서 이전 profile과 비교"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            현재 commit은 tag <code>v0.131.2</code>에 해당합니다. Repository는 활발히 개발
            중이며 README도 robust security audit가 진행 중이라고 밝힙니다. Moving main의
            benchmark나 지원 문법을 고정 배포의 보장으로 복사하지 말고 commit·Cargo.lock·
            toolchain·features·setup과 serialization fixture를 함께 보관해야 합니다.
          </p>

          <div id="paper-proof-of-sql-source">
            <CitationBlock source="Space and Time · sxt-proof-of-sql commit f28544df" citeKey={1} type="code" href={SOURCE}>
              <p><strong>문제:</strong> Committed columns에 대한 SQL query result를 짧은 proof로 검증합니다.</p>
              <p><strong>고정한 버전:</strong> 2026-10-28 commit <code>f28544df</code>, local tag <code>v0.131.2</code>입니다.</p>
              <p><strong>직접 확인:</strong> Aggregate fixture, prover/verifier transcript, sumcheck·result·opening checks, generic commitment trait를 읽고 CPU-available focused tests 세 개를 실행했습니다.</p>
              <p><strong>지원 범위:</strong> <a href={SQL_SPEC}>고정 commit의 SQL syntax specification</a>에 명시된 SELECT·WHERE·일부 aggregate·join·type 범위에 한정합니다.</p>
              <p><strong>말하지 않는 것:</strong> 모든 SQL, 자동 privacy·freshness·data availability, 로컬 Mac의 aggregate end-to-end 통과, production audit 완료를 주장하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-dory">
            <CitationBlock source="Lee · Dory" citeKey={2} href={DORY}>
              <p><strong>문제:</strong> Structured vector 관계를 transparent setup에서 짧게 엽니다.</p>
              <p><strong>기여:</strong> Pairing commitments와 recursive generalized inner-product argument를 제시합니다.</p>
              <p><strong>이 글에서의 역할:</strong> Proof of SQL이 선택할 수 있는 commitment evaluation proof 구현 하나의 이론 배경입니다.</p>
              <p><strong>말하지 않는 것:</strong> Dory 자체가 SQL semantics·snapshot freshness·데이터 가용성·자동 zero knowledge를 제공한다고 말하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "sxt-proof-of-sql": proofOfSqlTree }}
        projectMetas={{
          "sxt-proof-of-sql": {
            id: "sxt-proof-of-sql",
            label: "sxt-proof-of-sql · Rust · v0.131.2",
            badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700",
          },
        }}
      />
    </>
  );
}
