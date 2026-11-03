import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import LibiopOracleViz from "./LibiopOracleViz";
import { codeRefs } from "./codeRefs";
import { libiopTree } from "./fileTree";

const AURORA = "https://eprint.iacr.org/2018/828.pdf";
const BCS = "https://eprint.iacr.org/2016/116.pdf";
const SOURCE =
  "https://github.com/scipr-lab/libiop/tree/a2ed2ec2f3e85f29b6035951553b02cb737c817a";

const GOOD_CODEWORD = [1, 3, 4, 12, 1, 13, 5, 2];
const WRONG_RELATION_CODEWORD = [1, 3, 4, 11, 14, 3, 2, 1];

function CodewordRow({
  label,
  values,
  tone,
}: {
  label: string;
  values: number[];
  tone: "good" | "bad";
}) {
  return (
    <article className="min-w-0 bg-background p-4">
      <p
        className={`break-keep text-[10px] font-black ${
          tone === "good"
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-rose-700 dark:text-rose-300"
        }`}
      >
        {label}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-1 sm:grid-cols-8">
        {values.map((value, index) => (
          <div
            key={`${label}-${index}`}
            className={`min-w-0 border p-2 text-center font-mono text-xs font-black ${
              index < 4 ? "border-primary/50 bg-primary/5" : "border-border"
            }`}
          >
            {value}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[9px] text-muted-foreground">
        앞 네 칸은 원래 값 · 뒤 네 칸은 같은 3차 이하 다항식의 추가 평가값
      </p>
    </article>
  );
}

export default function ModernLibiopArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article className="space-y-14 [overflow-wrap:anywhere]">
        <section id="overview" className="space-y-6 scroll-mt-20">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              한 문장으로 먼저 답하기
            </p>
            <h2 className="max-w-4xl break-keep text-3xl font-bold tracking-tight">
              libiop는 표의 모양과 표가 뜻하는 계산을 따로 검사합니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            비공개 값 3과 4를 곱해 공개 결과 12가 나왔음을 확인한다고 하겠습니다.
            Prover는 이 값들을 여분의 칸이 있는 표로 늘려 먼저 고정합니다. Verifier는
            표 전체를 받지 않고 임의로 고른 몇 칸만 엽니다.
          </p>
          <p>
            여기서 검사는 두 가지입니다. 첫째, 열린 칸들이 하나의 낮은 차수 표에서
            왔는지 확인합니다. 둘째, 그 표가 정말 <code>3×4=12</code>라는 계산 관계를
            만족하는지 확인합니다. 첫 검사만으로는 정답을 보장할 수 없습니다.
          </p>

          <LibiopOracleViz />
          <ContentBoundary article="libiop" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["관계", "3×4=12", "세 선형식의 곱셈 관계가 맞는지 확인합니다."],
              ["표", "4 values → 8 evaluations", "값들이 한 낮은 차수 다항식의 평가인지 확인합니다."],
              ["순서", "root first → query later", "질문을 본 뒤 표를 고치는 일을 막습니다."],
            ].map(([eyebrow, title, body]) => (
              <article key={eyebrow} className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{eyebrow}</p>
                <h3 className="mt-2 break-keep text-sm font-black">{title}</h3>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="black-box" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              01 · 이름보다 입출력을 먼저 보기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Prover는 긴 표를 보내고 verifier는 짧은 질문과 열린 칸만 확인합니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3">주체</th>
                  <th className="p-3">알고 있는 것</th>
                  <th className="p-3">보내거나 확인하는 것</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Prover", "비공개 3·4와 계산표 전체", "표의 root·round message·선택된 값과 경로"],
                  ["Verifier", "공개 결과 12와 protocol profile", "root에서 질문을 만들고 관계·경로를 확인"],
                  ["Output", "accept 또는 reject", "표의 출처와 계산 관계가 모두 맞을 때만 accept"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`} className="break-keep p-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            “몇 칸만 본다”는 말은 운에 맡긴다는 뜻이 아닙니다. 먼저 표 전체를 하나의
            root에 묶고, 그 뒤에 예측하기 어려운 질문을 만듭니다. 또 낮은 차수 검사와
            계산 관계 검사를 함께 설계해 거짓 표가 숨을 공간을 줄입니다.
          </p>
        </section>

        <section id="case" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · 3×4=12를 한 행으로 쓰기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              세 선형식의 값 3·4·12를 만든 뒤 첫째와 둘째의 곱을 확인합니다
            </h2>
          </header>

          <p>
            상수 1을 앞에 붙인 벡터를 <code>z=(1,3,4,12)</code>라고 하겠습니다. 행렬
            A는 3이 있는 칸을, B는 4가 있는 칸을, C는 12가 있는 칸을 고릅니다. 한
            행에서는 <code>Az=3</code>, <code>Bz=4</code>, <code>Cz=12</code>입니다.
          </p>

          <ExplainedFormula
            question="R1CS 한 행이 실제로 확인하는 값은 무엇인가요?"
            idea="A·z와 B·z라는 두 선형식의 값을 곱한 결과가 C·z와 같은지 확인합니다."
            formula={String.raw`(Az)_0(Bz)_0-(Cz)_0=3\cdot4-12=0`}
            annotatedFormula={String.raw`\underbrace{(Az)_0}_{\text{첫 선형식}=3}\underbrace{(Bz)_0}_{\text{둘째 선형식}=4}-\underbrace{(Cz)_0}_{\text{기대 결과}=12}=0`}
            operations={[
              {
                expression: String.raw`z=(1,3,4,12)`,
                annotation: ["상수 1과 세 값", "3·4는 비공개 witness로 둘 수 있음", "12는 공개 statement에 둘 수 있음"],
              },
              {
                expression: String.raw`Az=3,\quad Bz=4,\quad Cz=12`,
                annotation: ["각 행렬이 필요한 칸을 선택", "세 결과는 field element", "아직 곱셈 검사는 하지 않음"],
              },
              {
                expression: String.raw`3\cdot4-12=0`,
                annotation: ["0이면 이 행은 만족", "c=11이면 오차 1", "모든 R1CS 행에서 반복"],
              },
            ]}
            terms={[
              { symbol: "z", name: "Variable assignment", description: "상수 1, 공개 입력, 비공개 보조 입력을 이은 벡터입니다." },
              { symbol: "A,B,C", name: "R1CS matrices", description: "각 행에서 어떤 변수들을 어떤 계수로 더할지 정합니다." },
              { symbol: "(Az)_0", name: "First row value", description: "A의 0번 행과 z의 내적입니다." },
            ]}
            assumptions={[
              "모든 계산은 선택한 유한체 안에서 이뤄집니다.",
              "Public input과 auxiliary input의 순서가 constraint system과 같습니다.",
              "한 행의 만족은 전체 constraint system의 만족과 같지 않습니다.",
            ]}
            interpretation="c=12이면 오차가 0입니다. c=11이면 같은 a·b에 대해 오차 1이 남아 관계 검사가 거절해야 합니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="R1CS is_satisfied 원문" onClick={() => sidebar.open("r1cs-check", codeRefs["r1cs-check"])} />
          </div>
        </section>

        <section id="encoding" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · 네 값을 여덟 칸으로 늘리기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              같은 낮은 차수 식에서 나온 여분의 값이 표의 공통 구조가 됩니다
            </h2>
          </header>

          <p>
            역할만 보기 위해 17로 나눈 나머지를 쓰는 작은 예를 만들겠습니다. 점
            <code>0·1·2·3</code>에서 값이 <code>1·3·4·12</code>인 3차 이하 다항식은
            하나로 정해집니다. 이 식을 점 <code>4·5·6·7</code>에서도 계산하면 네 칸이
            더 생깁니다.
          </p>

          <ExplainedFormula
            question="z=(1,3,4,12)를 F17의 여덟 칸 평가표로 어떻게 늘리나요?"
            idea="앞 네 점을 지나는 3차 이하 다항식을 구한 뒤 같은 식을 뒤 네 점에서도 평가합니다."
            formula={String.raw`p(t)=1+8t+4t^2+7t^3\pmod{17}`}
            annotatedFormula={String.raw`p(t)=\underbrace{1+8t+4t^2+7t^3}_{\text{앞 네 값을 지나는 유일한 3차 이하 식}}\pmod{17}`}
            operations={[
              {
                expression: String.raw`(p(0),p(1),p(2),p(3))=(1,3,4,12)`,
                annotation: ["원래 네 값", "각 계산은 mod 17", "systematic toy layout"],
              },
              {
                expression: String.raw`p(4)=1+32+64+448=545\equiv1\pmod{17}`,
                annotation: ["같은 식을 새 점에 평가", "545=17·32+1", "첫 여분 칸은 1"],
              },
              {
                expression: String.raw`(p(0),\ldots,p(7))=(1,3,4,12,1,13,5,2)`,
                annotation: ["4개 원래 값과 4개 추가 값", "rate 1/2 교육용 예", "실제 Aurora domain과 동일하다는 뜻은 아님"],
              },
            ]}
            terms={[
              { symbol: "p(t)", name: "Low-degree polynomial", description: "원래 네 값을 하나의 식으로 묶는 3차 이하 다항식입니다." },
              { symbol: "F_{17}", name: "Toy field", description: "숫자를 17로 나눈 나머지로 계산하는 교육용 유한체입니다." },
              { symbol: "4/8", name: "Toy code rate", description: "네 정보 값을 여덟 평가값으로 보낸다는 뜻입니다." },
            ]}
            assumptions={[
              "평가점 0부터 7까지는 F17에서 서로 다릅니다.",
              "원래 값 네 개는 degree<4 식을 정합니다.",
              "실제 libiop parameter는 smooth field·domain·masking·FRI profile을 따릅니다.",
            ]}
            interpretation="여분의 네 칸은 별도 정답이 아니라 같은 낮은 차수 식의 추가 평가입니다. 그래서 임의 위치를 고쳤을 때 낮은 차수 구조가 깨질 수 있습니다."
          />

          <div className="not-prose grid gap-px bg-border p-px lg:grid-cols-2">
            <CodewordRow label="정상 관계 · p(t)=1+8t+4t²+7t³" values={GOOD_CODEWORD} tone="good" />
            <CodewordRow label="c=11인 다른 유효 코드 · p′(t)=1+2t+13t²+4t³" values={WRONG_RELATION_CODEWORD} tone="bad" />
          </div>
        </section>

        <section id="two-checks" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · 두 종류의 거짓을 나누기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              유효한 코드워드라는 사실만으로 3×4=12가 되지는 않습니다
            </h2>
          </header>

          <p>
            정상 표에서 한 칸만 몰래 바꾸면 더는 3차 이하 평가표가 아닐 수 있습니다.
            이것은 표의 모양이 틀린 경우입니다. 반면 c를 11로 바꾸고 표 전체를 다시
            인코딩하면 여전히 올바른 3차 코드워드입니다. 하지만 계산은
            <code>3×4−11=1</code>이므로 틀립니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">거짓의 종류</th><th className="p-3">예</th><th className="p-3">잡는 검사</th></tr>
              </thead>
              <tbody>
                {[
                  ["코드 구조가 깨짐", "정상 8칸 중 한 parity만 변경", "Low-degree·proximity test"],
                  ["계산 관계가 깨짐", "c=11을 포함한 다른 유효 코드워드", "Lincheck·rowcheck"],
                  ["열린 값의 출처가 깨짐", "root와 맞지 않는 value·path", "Merkle membership"],
                  ["메시지 순서가 깨짐", "query를 보고 나서 root 선택", "Commit-first transcript"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            이 역할을 알고 나서 이름을 붙이면 덜 헷갈립니다. 길게 제공되는 평가표가
            <strong> oracle</strong>이고, R1CS에서 <code>Az·Bz=Cz</code>가 맞는지
            연결하는 부분이 <strong>lincheck와 rowcheck</strong>입니다. 표가 낮은 차수
            코드에 가까운지는 <strong>FRI 같은 proximity test</strong>가 맡습니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Aurora oracle 등록 원문" onClick={() => sidebar.open("oracle-registration", codeRefs["oracle-registration"])} />
            <CodeViewButton label="Az·Bz·Cz 확장·제출 원문" onClick={() => sidebar.open("oracle-submission", codeRefs["oracle-submission"])} />
          </div>
        </section>

        <section id="bcs" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              05 · 표를 먼저 고정한 뒤 질문하기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              BCS는 공개 동전을 root와 메시지에서 다시 만들어 비대화식 proof로 바꿉니다
            </h2>
          </header>

          <p>
            대화식 IOP에서는 verifier가 각 round 뒤에 공개 난수를 보냅니다. BCS에서는
            prover가 oracle의 Merkle root와 명시적 메시지를 hashchain에 넣은 다음 그
            상태에서 challenge를 꺼냅니다. 마지막 query 위치도 이 transcript에서
            정해집니다.
          </p>

          <AlgorithmBlock
            title="3×4=12의 oracle proof를 만드는 순서"
            input={[
              "statement = public c=12",
              "witness = private a=3, b=4",
              "profile = field + code/domain + FRI + hash + query/repetition + ZK/PoW flags",
            ]}
            steps={[
              { code: "z ← (1, public input, auxiliary input)", note: "상수 1과 공개·비공개 값을 정해진 순서로 잇습니다." },
              { code: "compute Az, Bz, Cz; extend fw, fAz, fBz, fCz over codeword domain", note: "계산 관계를 확인할 표들과 낮은 차수 표를 만듭니다." },
              { code: "root_r ← MerkleCommit(round_r oracle values)", note: "질문을 만들기 전에 round의 표 전체를 한 root에 고정합니다." },
              { code: "transcript.absorb(root_r, prover_messages_r); squeeze challenges", note: "Root와 메시지가 달라지면 뒤의 challenge도 달라집니다." },
              { code: "query positions ← transcript; open values + pruned Merkle paths", note: "Verifier가 실제로 필요한 위치만 proof에 넣습니다." },
              { code: "check transcript paths; run low-degree and R1CS predicates", note: "열린 값의 출처와 그 값들이 뜻하는 계산을 따로 확인합니다." },
              { code: "accept ← transcriptValid && protocolAccepts", note: "둘 중 하나라도 실패하면 전체 proof를 거절합니다." },
            ]}
            output="proof = round roots + prover messages + opened values + Merkle multiproofs + optional PoW"
          />

          <p>
            반대 순서를 생각해 보면 이유가 선명합니다. Prover가 query 위치를 먼저 안다면
            그 주변만 정상인 표를 고른 뒤 root를 만들 수 있습니다. 그래서
            <code>root → challenge → query → opening</code> 순서가 proof 의미의 일부입니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="BCS round commit 원문" onClick={() => sidebar.open("bcs-round", codeRefs["bcs-round"])} />
            <CodeViewButton label="Root→message→randomness 순서" onClick={() => sidebar.open("bcs-hashchain", codeRefs["bcs-hashchain"])} />
            <CodeViewButton label="Verifier Merkle·PoW 검사" onClick={() => sidebar.open("bcs-verify", codeRefs["bcs-verify"])} />
          </div>
        </section>

        <section id="proof-size" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              06 · 공식 one-round test의 82바이트 장부
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              64칸 전체가 아니라 네 값과 잘라낸 Merkle 경로를 proof에 넣습니다
            </h2>
          </header>

          <p>
            공식 BCS test의 한 profile은 <code>dim=6</code>인 64칸 oracle 하나에서 위치
            <code>0·1·2·3</code>을 엽니다. Test는 40이라는 작은 보안 parameter를 써서
            hash 하나를 10바이트로 세고, gf64 값 하나를 8바이트로 셉니다.
          </p>

          <ExplainedFormula
            question="공식 test가 non-ZK proof의 expected size를 82바이트로 잡는 이유는 무엇인가요?"
            idea="Test가 장부에 넣은 5개 hash-sized field와 열린 네 field value의 바이트를 그대로 더합니다."
            formula={String.raw`5\cdot10+4\cdot1\cdot8=82\ \text{bytes}`}
            annotatedFormula={String.raw`\underbrace{5\cdot10}_{\text{root·pruned membership material}}+\underbrace{4\cdot1\cdot8}_{\text{4 queries·1 oracle·gf64 value}}=82\ \text{bytes}`}
            operations={[
              { expression: String.raw`\text{hash bytes}=2\cdot40/8=10`, annotation: ["test security_parameter=40", "코드의 hash_size 계산", "실서비스 권장값이 아님"] },
              { expression: String.raw`\text{opened values}=4\cdot1\cdot8=32`, annotation: ["query 네 위치", "oracle 하나", "gf64 한 값 8바이트"] },
              { expression: String.raw`50+32=82,\qquad \text{ZK salt 추가}=4\cdot10=40`, annotation: ["non-ZK expected 82", "ZK expected 122", "이 test fixture의 exact accounting"] },
            ]}
            terms={[
              { symbol: "5", name: "Hash-sized fields in test accounting", description: "Root와 잘라낸 membership proof가 차지하는 hash 단위 수입니다." },
              { symbol: "4", name: "Query positions", description: "공식 test가 여는 0·1·2·3 네 위치입니다." },
              { symbol: "8", name: "sizeof(gf64)", description: "이 test build에서 field value 하나를 세는 바이트 수입니다." },
            ]}
            assumptions={[
              "이 식은 test_bcs_transformation.cpp의 특정 one-round fixture에만 해당합니다.",
              "실제 proof size는 round·oracle·query·coset·hash·ZK·PoW profile에 따라 달라집니다.",
              "코드의 sizeof(FieldT) 장부는 canonical wire serialization과 별도 검토가 필요합니다.",
            ]}
            interpretation="82바이트는 libiop 전체나 Aurora proof의 고정 크기가 아닙니다. 한 source test가 selective opening의 크기를 검사하는 구체적인 장부입니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="64칸·4 query 크기 test" onClick={() => sidebar.open("bcs-test", codeRefs["bcs-test"])} />
          </div>
        </section>

        <section id="source" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              07 · 실제 wrapper에서 두 판정을 합치기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Transcript가 멀쩡해도 계산 predicate가 틀리면 최종 결과는 false입니다
            </h2>
          </header>

          <p>
            실제 <code>aurora_snark_verifier</code>는 BCS transcript를 읽어 Merkle opening과
            message order를 확인한 결과를 먼저 얻습니다. 별도로 Aurora IOP의
            <code>verifier_predicate</code>를 실행합니다. 마지막 반환값은 두 결과의
            논리곱입니다.
          </p>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
            {[
              ["transcript_is_valid", "Root·query response·Merkle path·PoW가 transcript와 맞는가?"],
              ["full_protocol_accepts", "낮은 차수·lincheck·rowcheck 등 Aurora 관계가 맞는가?"],
              ["true && false", "표의 출처는 맞지만 c=11이면 reject"],
              ["false && true", "계산값처럼 보여도 잘못된 path면 reject"],
            ].map(([name, body]) => (
              <article key={name} className="min-w-0 bg-background p-4">
                <p className="break-words font-mono text-xs font-black text-primary">{name}</p>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Aurora prove·verify wrapper" onClick={() => sidebar.open("aurora-pipeline", codeRefs["aurora-pipeline"])} />
          </div>
        </section>

        <section id="release" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              08 · 실행한 것과 읽은 것을 구별하기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              최신 source commit은 고정했지만 이 환경에서 C++ test를 실행하지는 못했습니다
            </h2>
          </header>

          <aside className="not-prose rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-200">재현 범위</p>
            <p className="mt-2 text-sm leading-6">
              2026-11-01에 공식 master가 commit <code>a2ed2ec</code>임을 다시 확인하고
              submodule까지 내려받았습니다. F17의 두 codeword와 82·122바이트 장부는
              독립 계산으로 확인했습니다. 원문 여덟 구간도 같은 commit과 byte 단위로
              대조했습니다.
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              이 머신에는 CMake·libsodium·Boost가 준비되어 있지 않아 configure 단계가
              <code>cmake: command not found</code>에서 멈췄습니다. 따라서 공식
              <code>test_bcs_transformation</code>과 <code>test_aurora_snark</code>는 소스와
              기대식을 읽었을 뿐 실행 통과로 기록하지 않습니다. 현재 commit의 GitHub
              status와 check-runs도 0개입니다.
            </p>
          </aside>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40"><tr><th className="p-3">Release fixture</th><th className="p-3">기대 결과</th><th className="p-3">이번 확인 상태</th></tr></thead>
              <tbody>
                {[
                  ["z=(1,3,4,12)", "R1CS row error 0", "독립 계산·source 확인"],
                  ["c=11", "유효 codeword여도 rowcheck reject", "독립 계산·source 확인"],
                  ["한 parity만 변조", "proximity 또는 opening reject", "필수 negative fixture로 명시"],
                  ["잘못된 Merkle path", "transcript_is_valid=false", "verifier source 확인"],
                  ["root와 query 순서 변경", "다른 transcript challenge", "hashchain source 확인"],
                  ["공식 C++ test", "BCS·Aurora test pass", "로컬 미실행"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            성능을 비교할 때는 protocol 이름만 같게 두면 안 됩니다. Source SHA, field,
            constraint 수, codeword domain과 rate, FRI soundness 방식, localization, query와
            repetition, hash, ZK·PoW, single-thread 여부를 함께 고정해야 합니다. 그 뒤
            encode·prove·verify 시간, proof bytes, peak RSS를 단계별로 잽니다.
          </p>
          <p>
            공식 README는 이 저장소를 세심한 code review를 받지 않은 학술용
            proof-of-concept라고 밝히며 production에 사용할 준비가 되지 않았다고
            경고합니다. 그러므로 이 글의 source 확인은 protocol 이해의 근거이지 보안
            감사나 배포 승인서가 아닙니다.
          </p>

          <div id="paper-aurora">
            <CitationBlock source="Ben-Sasson et al. · Aurora" citeKey={1} href={AURORA}>
              <p><strong>문제:</strong> Trusted setup 없이 R1CS 계산을 짧게 검증합니다.</p>
              <p><strong>기여:</strong> R1CS를 RS-encoded IOP와 FRI 기반 proximity 검사로 낮추는 Aurora를 제시합니다.</p>
              <p><strong>전제:</strong> 논문의 field·code·hash·random-oracle·soundness parameter를 사용합니다.</p>
              <p><strong>근거 범위:</strong> Aurora의 reduction, security analysis와 libiop 구조 설명입니다.</p>
              <p><strong>말하지 않는 것:</strong> 작은 F17 모형이나 모든 현재 구현의 고정 성능을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-bcs">
            <CitationBlock source="Ben-Sasson, Chiesa, Spooner · IOPs and BCS transformation" citeKey={2} href={BCS}>
              <p><strong>문제:</strong> Public-coin IOP의 긴 oracle과 대화를 짧은 비대화식 argument로 바꿉니다.</p>
              <p><strong>기여:</strong> Merkle commitment와 Fiat–Shamir transcript를 결합한 BCS compiler를 제시합니다.</p>
              <p><strong>전제:</strong> Round-by-round soundness와 random-oracle·commitment 가정을 사용합니다.</p>
              <p><strong>근거 범위:</strong> Root를 먼저 고정하고 query opening을 제공하는 구조입니다.</p>
              <p><strong>말하지 않는 것:</strong> Merkle path 하나가 oracle 전체의 계산 의미나 hiding을 자동으로 보장하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-libiop-source">
            <CitationBlock source="scipr-lab/libiop · commit a2ed2ec" citeKey={3} type="code" href={SOURCE}>
              <p><strong>문제:</strong> R1CS reduction·IOP·BCS가 실제 C++ API에서 어떻게 이어지는지 확인합니다.</p>
              <p><strong>기여:</strong> Ligero·Aurora·Fractal과 standalone BCS components를 제공하는 연구용 구현입니다.</p>
              <p><strong>고정한 버전:</strong> 2021-05-12 commit <code>a2ed2ec</code>이며 2026-11-01에도 공식 master HEAD입니다.</p>
              <p><strong>근거 범위:</strong> 여덟 원문 구간, submodule commit, source test의 parameter·expected size입니다.</p>
              <p><strong>말하지 않는 것:</strong> 로컬 native test 통과, 외부 감사, production readiness를 주장하지 않습니다.</p>
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
        fileTrees={{ libiop: libiopTree }}
        projectMetas={{
          libiop: {
            id: "libiop",
            label: "scipr-lab/libiop · C++ · Aurora/BCS",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </>
  );
}
