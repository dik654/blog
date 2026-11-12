import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TwoErrorsViz from "./procedure-and-proof/viz/TwoErrorsViz";
import ProofThresholdViz from "./procedure-and-proof/viz/ProofThresholdViz";
import EvidenceGatesViz from "./procedure-and-proof/viz/EvidenceGatesViz";

/** 같은 H 사건으로 두 오류, 장난감 문턱 모형, 법적 증명 기준, 증거 규칙을 분리한다. */
export default function ProcedureAndProofArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          H를 의심할 이유와 H를 벌할 수 있다는 결론은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글의 가상 사건을 이어가겠습니다. 문 닫은 가게에서 물건이
            사라졌고, H의 출입 카드 기록·얼굴이 선명하지 않은 영상·H가 쓰는
            보관함에서 발견된 물건이 제출되었습니다. H는 카드를 다른 사람이
            썼고 보관함도 함께 쓴다고 말합니다. 이 증거는 모두 가상입니다.
          </p>
          <p className="leading-7">
            수사기관은 H를 가장 유력한 사람으로 볼 수 있습니다. 그러나 형사재판의
            질문은 “H가 제일 의심스러운가”가 아니라, 허용되는 증거 전체로 범죄
            사실이 법이 요구하는 정도까지 증명되었는가입니다.
          </p>
          <p className="leading-7">
            <strong>
              형사 증명 기준은 유죄 확률을 재는 온도계가 아니라, 확신이 부족할 때
              발생하는 오류 위험을 누구에게 지울지 정하는 법적 규칙입니다.
            </strong>{" "}
            그래서 “합리적 의심 없음”을 90%나 99%라는 숫자로 바꾸면 안 됩니다.
          </p>
        </div>

        <TwoErrorsViz />
        <ContentBoundary article="procedure-and-proof" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            여기서 꼬리 질문이 생깁니다. 왜 형사사건은 그렇게 높은 확신을
            요구하는가? 유죄 판정과 무죄 판정은 각각 다른 오류를 만들고, 법은
            무고한 사람을 벌할 위험을 특히 경계합니다. 다만 그 무게를 계산해 실제
            법정 문턱을 자동 산출하는 공식은 없습니다.
          </p>
          <p className="leading-7">
            이 글은 두 층을 분리합니다. 먼저 비용의 비가 문턱을 움직이는 모습을
            장난감 모형으로 봅니다. 그다음 대한민국법과 비교 법제에서 실제로
            작동하는 무죄 추정, 검사의 증명 책임, 합리적 의심 없는 증명과 증거
            배제 규칙을 봅니다.
          </p>
        </div>
      </section>

      <section id="two-errors" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 H 사건에서도 판정 오류는 두 방향으로 생깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            실제로 H가 했는지와 재판이 유죄로 판단했는지를 교차하면 네 칸이
            생깁니다. H가 했고 유죄, 하지 않았고 무죄인 두 칸은 맞은 판정입니다.
            H가 하지 않았는데 유죄인 오유죄와, 했는데 무죄인 오무죄가 두
            오류입니다.
          </p>
          <p className="leading-7">
            오유죄는 무고한 사람의 자유·명예·생활을 국가가 직접 침해하고 형사
            절차의 신뢰도 해칩니다. 오무죄도 가볍지 않습니다. 피해 회복과 책임
            추궁이 좌절되고, 재범·억제·공공 안전의 비용이 남을 수 있습니다. 기존
            글처럼 “없던 불이익을 만들지 않는다”는 한 문장으로 작게 볼 수 없습니다.
          </p>
          <p className="leading-7">
            중요한 점은 어느 오류가 더 무거운지가 자연법칙으로 정해지지 않는다는
            것입니다. 헌법과 절차법은 인간의 존엄, 국가 강제력의 한계, 방어권과
            사회의 안전을 함께 고려해 위험을 배분합니다. 장난감 모형은 그 선택의
            모양을 보여 줄 뿐 선택을 대신하지 않습니다.
          </p>
        </div>
      </section>

      <section id="threshold" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          숫자 문턱은 법이 아니라 오류 배분을 보는 사고실험입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            가상적으로 증거를 본 뒤 H가 했을 확률을 π라고 쓰고, 오유죄 비용을
            C<sub>오유죄</sub>, 오무죄 비용을 C<sub>오무죄</sub>라고 쓰겠습니다.
            법관이 실제로 이 세 숫자를 적는다는 뜻이 아닙니다. 두 방향의 오류를
            동시에 0으로 만들 수 없을 때 문턱이 왜 움직이는지 보기 위한 결정이론
            모형입니다.
          </p>
        </div>

        <ExplainedFormula
          question="장난감 모형에서 유죄 쪽의 기대손실이 더 작아지는 지점은 어디인가?"
          idea="유죄로 판정하면 H가 하지 않았을 확률만큼 오유죄 비용을 질 수 있고, 무죄로 판정하면 H가 했을 확률만큼 오무죄 비용을 질 수 있습니다. 유죄의 기대손실이 더 작을 때를 정리하면 비용의 비 r이 문턱을 움직입니다. 이 값은 법정의 실제 합리적 의심 기준이 아닙니다."
          formula={String.raw`(1-\pi)C_{\mathrm{오유죄}} < \pi C_{\mathrm{오무죄}} \quad\Longleftrightarrow\quad \pi > \frac{r}{1+r},\qquad r=\frac{C_{\mathrm{오유죄}}}{C_{\mathrm{오무죄}}}`}
          annotatedFormula={String.raw`\underbrace{(1-\pi)C_{\mathrm{오유죄}}}_{\text{유죄 판정의 기대손실}} < \underbrace{\pi C_{\mathrm{오무죄}}}_{\text{무죄 판정의 기대손실}} \quad\Longleftrightarrow\quad \pi > \underbrace{\frac{r}{1+r}}_{\text{장난감 문턱}}`}
          operations={[
            {
              expression: String.raw`(1-\pi)C_{\mathrm{오유죄}}`,
              annotation: ["유죄 판정이 틀릴 경우는 H가 실제로 하지 않은 경우이므로 확률은 1-π입니다.", "그 확률에 오유죄의 가상 비용을 곱합니다."],
            },
            {
              expression: String.raw`\pi C_{\mathrm{오무죄}}`,
              annotation: ["무죄 판정이 틀릴 경우는 H가 실제로 한 경우이므로 확률은 π입니다.", "피해·책임·재범·신뢰 등 무엇을 비용에 넣을지는 계산 밖의 규범 선택입니다."],
            },
            {
              expression: String.raw`\pi>\frac{r}{1+r}`,
              annotation: ["오유죄 비용을 오무죄 비용의 r배라고 두고 부등식을 π에 대해 풀면 나옵니다.", "r=10이면 약 90.9%, r=100이면 약 99.0%지만, 어느 법도 이 예의 r을 채택했다는 뜻은 아닙니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`\pi`, name: "가상 사후확률", description: "허용되는 증거를 본 뒤 H가 했다고 믿는 정도를 숫자로 표현할 수 있다고 가정한 값입니다." },
            { symbol: String.raw`C_{\mathrm{오유죄}}`, name: "오유죄의 가상 비용", description: "하지 않은 H를 유죄로 했을 때의 권리 침해와 사회적 손실을 같은 단위로 환산했다고 둡니다." },
            { symbol: String.raw`C_{\mathrm{오무죄}}`, name: "오무죄의 가상 비용", description: "실제로 한 H를 무죄로 했을 때 남는 피해·책임·안전·억제 손실을 같은 단위로 환산했다고 둡니다." },
          ]}
          assumptions={["법적 확신을 하나의 확률 π로 표현할 수 있다고 둡니다.", "두 오류의 서로 다른 피해를 같은 비용 단위로 환산할 수 있다고 둡니다.", "판정자가 기대손실이 작은 선택을 한다고 둡니다.", "무죄 추정·방어권·국가의 증명 책임을 비용 계산에서 독립된 권리로 넣지 않습니다."]}
          interpretation="가상적으로 π=0.92라고 해 보겠습니다. r=1이면 장난감 문턱은 50%라 유죄 쪽 기대손실이 작고, r=10이면 문턱 약 90.9%라 같은 판정이 나옵니다. r=100이면 문턱 약 99.0%이므로 무죄 쪽 기대손실이 작습니다. 여기서 읽을 것은 오류 비용을 더 크게 볼수록 숫자 문턱이 오른다는 구조뿐입니다. 읽으면 안 되는 것은 실제 증거가 92%이거나 합리적 의심 없음이 90.9%·99%라는 결론입니다. 법은 이런 수치를 정하지 않았고, 실제 사실 인정은 증거 전체와 대안 설명을 이유에 따라 평가합니다."
        />

        <ProofThresholdViz />

        <CitationBlock source="대한민국 형사소송법 제307조·제308조 · 국가법령정보센터" citeKey={1} href="https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1009267611">
          제307조는 사실 인정은 증거에 의해야 하고 범죄사실은 합리적인 의심이
          없는 정도로 증명되어야 한다고 정합니다. 제308조는 증거의 증명력을
          법관의 자유판단에 맡깁니다. 어느 조항도 합리적 의심을 특정 백분율로
          바꾸지 않습니다.
        </CitationBlock>

        <CitationBlock source="In re Winship, 397 U.S. 358 (1970) · U.S. Government Publishing Office" citeKey={2} href="https://www.govinfo.gov/content/pkg/USREPORTS-397/pdf/USREPORTS-397-358.pdf">
          미국 연방대법원은 자유를 잃을 수 있고 낙인이 따르는 형사적 사실
          판단에서 합리적 의심 없는 증명이 필요하다고 판시했습니다. 미국 헌법상
          기준의 비교 사례이며 대한민국 형사소송법의 해석 근거로 인용한 것은
          아닙니다.
        </CitationBlock>
      </section>

      <section id="burden" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          무죄 추정, 증명 책임, 증명 기준은 서로 다른 역할입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            대한민국헌법 제27조 제4항은 유죄 판결이 확정될 때까지 형사피고인을
            무죄로 추정합니다. 이 원칙과 형사소송법의 합리적 의심 없는 증명은
            “H가 실제로 하지 않았다”는 사실 선언과 다릅니다. 국가가 유죄의 법적
            효과를 부과하기 전에 져야 하는 절차상 부담을 정합니다.
          </p>
        </div>

        <TermBreakdown
          title="세 규칙을 같은 말처럼 쓰지 않기"
          items={[
            {
              term: "무죄 추정",
              description: "유죄 판결이 확정되기 전 H를 유죄인 사람처럼 취급하지 않게 하는 출발 규칙입니다.",
              example: "의심받거나 기소되었다는 사실만으로 유죄의 법적 효과를 미리 부과하지 않습니다.",
              boundary: "무죄 추정은 모든 임시 조치를 금지한다는 뜻이 아니며, 각 조치에는 별도의 법적 요건과 비례성이 필요합니다.",
            },
            {
              term: "증명 책임",
              description: "유죄를 주장하는 국가가 H에게 알리고 유죄를 뒷받침할 충분한 증거를 내야 한다는 배치입니다.",
              example: "H가 자신이 하지 않았음을 먼저 완벽하게 증명해야 유죄를 피하는 구조가 아닙니다.",
              boundary: "법률상·사실상 추정이나 피고인의 설명 요구가 전혀 허용되지 않는다는 뜻은 아니며, 방어권을 지키는 합리적 한계가 필요합니다.",
            },
            {
              term: "증명 기준",
              description: "제출된 증거가 범죄사실을 합리적 의심 없이 증명했는지 판단하는 문턱입니다.",
              example: "출입 카드·영상·발견 물건을 따로 세는 데 그치지 않고 H의 대안 설명까지 포함해 전체 증거를 봅니다.",
              boundary: "합리적 의심은 상상 가능한 모든 의심이나 특정 백분율이 아닙니다. 구체적 법체계의 판례와 이유 제시를 확인해야 합니다.",
            },
          ]}
        />

        <CitationBlock source="대한민국헌법 제27조 제4항 · 국가법령정보센터" citeKey={3} href="https://law.go.kr/lsInfoP.do?lsiSeq=61603&urlMode=engLsInfoR&viewCls=engLsInfoR">
          형사피고인은 유죄 판결이 확정될 때까지 무죄로 추정된다는 공식 헌법
          조항입니다. 이 글은 이를 확률식의 산출물이 아니라 독립된 헌법상
          출발점으로 다룹니다.
        </CitationBlock>

        <CitationBlock source="European Court of Human Rights · Guide on Article 6, criminal limb (2026-02-28 갱신)" citeKey={4} href="https://ks.echr.coe.int/documents/d/echr-ks/guide_art_6_criminal_eng-pdf">
          유럽인권재판소 공식 가이드는 검사가 혐의를 알리고 유죄에 충분한 증거를
          내야 하며, 증명 책임을 피고인에게 뒤집으면 무죄 추정 문제가 생긴다고
          정리합니다. 동시에 사실·법률상 추정이 언제나 금지되는 것은 아니고
          방어권을 지키는 합리적 범위가 필요하다고 한정합니다.
        </CitationBlock>
      </section>

      <section id="how-evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          증거의 힘과 증거를 쓸 수 있는지는 별도 문턱입니다
        </h2>
        <EvidenceGatesViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            H의 보관함에서 물건이 나왔다는 정보가 강해 보여도, 어떻게 찾았는지를
            먼저 확인해야 합니다. 대한민국 형사소송법 제308조의2는 적법한 절차를
            따르지 않고 수집한 증거를 사용할 수 없게 합니다. 내용이 믿을 만한지와
            별개로 적법 절차가 독립된 문턱인 것입니다.
          </p>
          <p className="leading-7">
            강요된 자백은 다시 갈라 봐야 합니다. 강요 때문에 거짓 자백이 생길 수
            있다는 신뢰성 문제도 있고, 국가가 고문·폭행·협박 등으로 진술을
            만들어서는 안 된다는 권리와 절차의 문제도 있습니다. “어차피 확률을
            올리지 못해서 버린다” 하나로 설명하면 두 이유를 놓칩니다.
          </p>
          <p className="leading-7">
            자백이 유일한 증거인 경우도 별도 규칙입니다. 대한민국 형사소송법
            제310조는 피고인의 자백이 유일한 불리한 증거이면 그것을 유죄 증거로
            삼지 못하게 합니다. 이는 모든 증거가 통계적으로 독립이어야 한다는
            일반 공식이 아니라, 자백 하나에 유죄 전체를 거는 것을 막는 한국법의
            보강 규칙입니다.
          </p>
          <p className="leading-7">
            다만 증거의 공통 출처는 추론에서도 중요합니다. 같은 CCTV를 본 두
            보고서를 독립된 증거 두 개처럼 곱하면 확신을 부풀릴 수 있습니다.
            이것은 제310조 자체의 뜻이 아니라, 증거의 힘을 평가할 때 중복 정보를
            세지 말아야 한다는 별도의 추론 원칙입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="H 사건에서 판결 이유를 만드는 순서"
          input={["적용 법제와 공소사실의 각 요건", "증거와 수집 경위", "H의 대안 설명", "해당 법제의 증거능력·증명 책임·증명 기준"]}
          steps={[
            { code: "적용 법제와 증명해야 할 범죄 요건을 먼저 고정한다.", note: "죄명과 법제에 따라 요건·추정·증거 규칙이 달라집니다." },
            { code: "각 자료가 법정에서 증거로 사용될 수 있는지 수집 절차부터 확인한다.", note: "강해 보이는 정보라도 적법 절차를 위반했다면 대한민국법 제308조의2의 문턱을 따로 넘지 못할 수 있습니다." },
            { code: "허용된 각 증거가 어떤 요건을 얼마나 뒷받침하는지 본다.", note: "관련성·신뢰성·대안 설명을 살피되 억지 백분율을 붙이지 않습니다." },
            { code: "여러 증거가 같은 출처를 되풀이하는지 확인한다.", note: "같은 CCTV에서 나온 두 보고서는 새로운 관측 두 개가 아닐 수 있습니다." },
            { code: "자백이 유일한 불리한 증거인지와 강요 여부를 별도로 확인한다.", note: "신뢰성, 적법 절차, 한국법의 자백 보강 규칙은 서로 다른 문턱입니다." },
            { code: "전체 증거와 H의 설명을 함께 놓고 합리적 의심 없는 증명인지 이유를 적는다.", note: "판정은 숫자 문턱을 대입하는 일이 아니라 남은 합리적 대안과 증거의 연결을 공개적으로 설명하는 일입니다." },
          ]}
          output="사용한 증거와 제외한 증거, 각 요건에 대한 판단, 남은 합리적 의심을 구분해 적은 판결 이유"
        />

        <ProgressiveDetail title="증거를 버리면 정확성이 떨어지지 않습니까?" preview="어떤 증거는 신뢰성이 약하고, 어떤 증거는 믿을 만해도 적법 절차 때문에 배제됩니다.">
          <p className="leading-7">
            배제되는 증거를 한 종류로 보면 답이 꼬입니다. 강요된 진술처럼 내용의
            신뢰성 자체가 흔들리는 경우에는 빼는 일이 정확성을 지킬 수 있습니다.
            반면 영장이나 적법 절차를 위반해 얻은 물건처럼 내용은 강해 보여도
            별도의 법적 이유로 배제되는 경우에는 개별 사건의 정보 손실이 생길 수
            있습니다.
          </p>
          <p className="leading-7">
            후자의 정당화는 법체계마다 다릅니다. 권리 구제, 위법 수사의 억제,
            사법의 완전성, 절차의 정당성이 서로 다른 비중을 가집니다. 따라서
            “미래 수사를 막기 위해서만 버린다”도 보편적인 한 문장 답이 아닙니다.
          </p>
          <p className="leading-7">
            이 구분 덕분에 정확한 질문을 할 수 있습니다. 이 자료는 사실을 얼마나
            잘 가리키는가, 그리고 그와 별개로 이 법제에서 법정에 들어올 자격이
            있는가입니다.
          </p>
        </ProgressiveDetail>

        <CitationBlock source="대한민국 형사소송법 제308조의2·제309조·제310조 · 국가법령정보센터" citeKey={5} href="https://law.go.kr/LSW/lsInfoP.do?lsiSeq=183537&urlMode=engLsInfoR&viewCls=engLsInfoR">
          적법 절차를 위반해 수집한 증거의 배제, 고문·폭행·협박·부당하게 긴
          구속·기망 등으로 임의성이 의심되는 자백의 배제, 자백이 유일한 불리한
          증거일 때의 제한을 각각 정한 공식 법령입니다. 세 조항을 하나의
          “독립성 공식”으로 합치지 않았습니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          합리적 의심 없음은 숫자가 아니라 공개해야 할 판단 이유입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            H 사건을 끝까지 따라가면 순서가 보입니다. 먼저 법정에 들어올 수 있는
            증거를 가르고, 각 증거의 힘과 중복을 살피고, H의 대안 설명을 검토한
            뒤, 국가가 범죄사실을 합리적 의심 없이 증명했는지 판단합니다. 장난감
            문턱 식은 이 순서를 대체하지 않습니다.
          </p>
          <p className="leading-7">
            무죄 판결은 “H가 하지 않았다는 확률이 100%”라는 인증도 아닙니다.
            국가가 유죄의 법적 효과를 부과하는 데 필요한 기준을 넘지 못했다는
            판정입니다. 반대로 유죄도 수학적 무오류를 뜻하지 않기에 항소·재심과
            이유 제시가 중요합니다.
          </p>
          <p className="leading-7">
            다음 글{" "}
            <Link to="/law/dispute-resolution/settlement-and-access">합의와 재판</Link>
            은 이렇게 정교한 재판 규칙이 실제로는 합의와 불기소·절차 종료의
            바깥에서도 어떻게 당사자의 선택을 움직이는지 이어서 봅니다.
          </p>
        </div>
      </section>
    </div>
  );
}
