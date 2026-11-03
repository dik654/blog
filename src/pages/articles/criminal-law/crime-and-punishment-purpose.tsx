import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import WhyStateProsecutesViz from "./crime-and-punishment-purpose/viz/WhyStateProsecutesViz";
import DeterrenceViz from "./crime-and-punishment-purpose/viz/DeterrenceViz";

/** 하나의 가상 절도 사건을 법의 사전 정의, 유죄 판단, 형벌 목적, 억제 계산에 차례로 통과시킨다. */
export default function CrimeAndPunishmentPurposeArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          물건을 돌려받아도 국가의 일이 끝나지 않는 경우가 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            가상 사건 하나로 시작하겠습니다. H는 문 닫은 가게의 경보기를 끄고,
            자신에게 8이라는 이익이 되는 물건을 가져가려 합니다. 숫자는 계산을
            따라가기 위한 임의의 효용 단위이고, 실제 사건의 죄명이나 형량을
            판정하려는 예가 아닙니다.
          </p>
          <p className="leading-7">
            H가 물건값을 돌려주면 가게 주인의 재산 손실은 메울 수 있습니다.
            그렇다고 사건 전체가 없던 일이 되지는 않습니다. 누가 규칙을 어겼는지
            조사하고, 같은 규칙을 누구에게나 적용하며, 강제 수사와 신체의 자유
            제한을 사인이 마음대로 행사하지 못하게 할 공적 절차가 필요하기
            때문입니다. 민사상 배상과 형사 절차는 서로를 자동으로 대신하지 않고
            함께 존재할 수 있습니다.
          </p>
          <p className="leading-7">
            <strong>
              형벌은 이미 생긴 손해의 가격표가 아니라, 유죄가 확인된 뒤
              비난·예방·재범 방지 가운데 무엇을 얼마나 추구할지 정하는 공적
              반응입니다.
            </strong>{" "}
            이 한 문장이 이 글의 결론입니다.
          </p>
        </div>

        <WhyStateProsecutesViz />
        <ContentBoundary article="crime-and-punishment-purpose" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            여기서 바로 꼬리 질문이 생깁니다. 국가가 나선다는 이유만으로 H가
            유죄가 되는가? 아닙니다. 법은 행위보다 먼저 금지 내용을 정해야 하고,
            수사와 재판은 H가 그 요건을 충족했는지 별도로 증명해야 합니다. 형벌의
            목적은 그 문턱을 넘은 다음에야 형의 종류와 정도를 정하는 이유가
            됩니다.
          </p>
          <p className="leading-7">
            따라서 이 글은 세 질문을 섞지 않습니다. 무엇을 범죄로 정할 것인가,
            이 사람이 유죄인가, 유죄라면 왜 어떻게 벌할 것인가입니다. 두 번째
            질문의 증명 문턱은 다음 글{" "}
            <Link to="/law/criminal-law/procedure-and-proof">절차와 증명</Link>이
            맡습니다.
          </p>
        </div>
      </section>

      <section id="four-reasons" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          유죄 뒤에도 형벌의 목적은 하나가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            H가 유죄라고 확정되었다고 가정하겠습니다. 이제 “왜 벌하는가”에 대한
            답이 형을 어디에 맞출지 가릅니다. 아래 넷은 여러 법제와 교재에서
            반복되는 대표적인 목적 묶음이지, 모든 나라가 똑같이 채택한 완결된
            목록은 아닙니다. 비난의 표현이나 회복적 사법을 별도 목적으로 두는
            체계도 있습니다.
          </p>
          <p className="leading-7">
            미국 연방법의 실제 양형 조항도 범죄의 중대성을 반영한 정당한 처벌,
            충분한 억제, 피고인의 추가 범죄로부터 대중 보호, 필요한 교육·의료·교정
            처우를 나란히 둡니다. 이는 네 목적이 단순한 철학 용어가 아니라 실제
            양형 법규에서도 함께 작동하는 한 사례입니다. 다른 나라의 양형법이
            동일하다는 뜻은 아닙니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 H 사건을 네 목적이 어떻게 다르게 보는가"
          items={[
            {
              term: "응보 · 한 일에 맞는 비난",
              description: "형을 H의 책임과 행위의 중대성에 맞춥니다. 미래 효과만 좋다고 해서 책임보다 더 벌하지 못하게 상한을 세웁니다.",
              example: "가져간 물건, 계획성, 침입 방식, 피해와 H의 책임 정도를 물어 비례하는 반응을 찾습니다.",
              boundary: "무엇이 같은 무게인지 판단 기준이 필요하며, 사회와 법제에 따라 구체적인 형이 달라집니다.",
            },
            {
              term: "억제 · 앞으로 덜 일어나게",
              description: "H 자신과 다른 사람이 같은 선택을 덜 하도록 적발 가능성과 제재의 부담을 봅니다.",
              example: "경보와 순찰로 적발 가능성을 높이는 방안과 제재를 무겁게 하는 방안을 비교합니다.",
              boundary: "사람이 위험을 어떻게 인식하는지, 충동적 행위인지에 따라 효과가 달라집니다. 효과만 앞세우면 본보기 처벌의 위험도 생깁니다.",
            },
            {
              term: "무해화 · 다시 할 기회를 제한",
              description: "구금이나 감독 기간에는 H가 같은 방식으로 재범할 기회가 줄어든다는 데 초점을 둡니다.",
              example: "반복 위험과 감독 가능성을 따져 자유 제한의 기간과 방식을 검토합니다.",
              boundary: "미래 행동 예측이 틀릴 수 있고, 구금이 끝난 뒤의 위험을 스스로 해결하지는 않습니다.",
            },
            {
              term: "재활 · 다시 하지 않을 조건 만들기",
              description: "H의 행동을 바꾸는 교육·치료·직업 지원 등 처우의 내용에 초점을 둡니다.",
              example: "같은 기간이라도 어떤 프로그램과 사회 복귀 지원을 제공하는지가 핵심이 됩니다.",
              boundary: "효과가 사람마다 다르고 강제 치료의 한계도 있어, 좋은 의도만으로 비례성과 권리 제한을 건너뛸 수 없습니다.",
            },
          ]}
        />

        <CitationBlock source="United States Code, Title 18 §3553(a)(2) · 미국 하원 법률개정실" citeKey={1} href="https://uscode.house.gov/us/usc/119-124/t18/s3553/">
          미국 연방법원이 형을 정할 때 고려할 목적으로 정당한 처벌, 억제, 대중
          보호, 교육·직업 훈련·의료·교정 처우를 명시한 공식 법전입니다. 이 글은
          이 조항을 네 목적이 실제 제도 안에서 함께 쓰이는 비교 사례로만
          인용합니다.
        </CitationBlock>
      </section>

      <section id="deterrence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          억제 모형은 형량이 아니라 선택의 기대값을 계산합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 목적 모두 자료와 기준을 이용해 평가할 수 있습니다. 다만 억제는
            “H가 할지 말지 고른다”는 단순 모형을 만들기 쉬워 계산 구조가 특히
            선명합니다. 핵심은 법전에 적힌 징역 연수를 이익 8과 바로 비교하지
            않는 것입니다. 돈·연수·효용은 단위가 다르기 때문입니다.
          </p>
          <p className="leading-7">
            먼저 제재 S가 H에게 주는 부담을 같은 효용 단위의 D(S)로 바꿉니다.
            그리고 적발, 신원 확인, 유죄 판단, 실제 집행을 모두 통과할 확률을
            곱합니다. 어느 한 단계가 낮아도 최종 확률은 낮아집니다.
          </p>
        </div>

        <ExplainedFormula
          question="H의 선택을 바꾸는 기대 제재는 어떻게 계산하는가?"
          idea="행위로 얻는 이익 G에서 실제로 제재받을 확률 p와 그 제재가 주는 부담 D(S)의 곱을 뺍니다. 결과가 0보다 작으면 이 단순 모형에서는 하지 않는 쪽의 기대효용이 큽니다. p는 한 숫자가 아니라 적발부터 집행까지 이어지는 조건부 확률의 곱입니다."
          formula={String.raw`U_{\mathrm{act}} = G - pD(S), \qquad p=p_d p_i p_c p_e`}
          annotatedFormula={String.raw`\underbrace{U_{\mathrm{act}}}_{\text{행동의 기대효용}}=\underbrace{G}_{\text{얻는 효용}}-\underbrace{(p_d p_i p_c p_e)}_{\text{제재까지 갈 확률}}\underbrace{D(S)}_{\text{제재의 효용 부담}}`}
          operations={[
            {
              expression: String.raw`p=0.50\times0.80\times0.75\times1.00=0.30`,
              annotation: ["적발 50%, 신원 확인 80%, 그 조건에서 유죄 판단 75%, 확정 뒤 집행 100%라는 가상값을 차례로 곱합니다.", "0.50+0.80+0.75처럼 더하지 않습니다. 앞 단계를 통과해야 다음 단계로 가기 때문입니다."],
            },
            {
              expression: String.raw`pD(S)=0.30\times30=9`,
              annotation: ["제재 S의 법정 명칭이나 연수를 그대로 30이라고 둔 것이 아닙니다. H가 느끼는 부담을 이익과 같은 효용 단위로 바꾼 값 D(S)=30을 썼습니다.", "기대 제재는 9효용 단위입니다."],
            },
            {
              expression: String.raw`U_{\mathrm{act}}=8-9=-1`,
              annotation: ["가상 이익 8에서 기대 제재 9를 빼면 -1입니다.", "정확한 확률을 알고 위험에 중립적인 H라는 가정 아래에서는 하지 않는 쪽이 낫습니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`G`, name: "행위로 얻는 효용", description: "돈뿐 아니라 시간, 지위, 감정 등 H가 얻는다고 느끼는 것을 같은 효용 단위로 나타낸 값입니다." },
            { symbol: String.raw`p_d,p_i,p_c,p_e`, name: "적발·신원 확인·유죄·집행의 조건부 확률", description: "각 단계가 앞 단계까지 진행되었다는 조건에서 다음 단계로 갈 확률입니다. 이 글의 숫자는 실측치가 아닙니다." },
            { symbol: String.raw`D(S)`, name: "제재 S가 주는 주관적 부담", description: "징역 연수 그 자체가 아니라 자유 제한, 벌금, 시간 지연과 부수 효과를 H의 효용 단위로 바꾼 함수입니다." },
          ]}
          assumptions={["H가 실제 제재 확률을 알고 그에 가깝게 인식한다고 둡니다.", "H가 위험에 중립적이고 기대효용을 비교한다고 둡니다.", "제재의 부담 D(S)를 같은 효용 단위로 바꿀 수 있다고 둡니다.", "충동, 규범, 수치심, 또래 영향과 적발되지 않아도 생기는 비공식 비용은 생략합니다."]}
          interpretation="이 계산은 실제 절도 사건의 형을 정하는 공식이 아닙니다. 네 개의 가상 확률을 곱해 0.30을 얻고, 제재의 부담 30과 곱해 기대 제재 9를 만든 뒤, 가상 이익 8과 같은 단위에서 비교하는 학습용 모형입니다. 결론은 '징역을 늘리면 언제나 범죄가 준다'가 아니라, 어느 단계의 확률과 어떤 사람이 느끼는 부담을 가정했는지 드러내야 억제 주장을 검증할 수 있다는 것입니다."
        />

        <DeterrenceViz />

        <CitationBlock source="Gary S. Becker · Crime and Punishment: An Economic Approach (1968, NBER 공개 사본)" citeKey={2} href="https://www.nber.org/system/files/chapters/c3625/c3625.pdf">
          범행을 기대효용 선택으로 놓고 유죄 확률과 제재를 함께 다룬 이론
          모형입니다. 확률과 제재가 같은 곱을 만든다고 해서 행동 효과가 언제나
          같지는 않으며, 위험 태도에 따라 반응이 달라질 수 있음을 보입니다. 위의
          H 사건과 숫자는 논문 사례가 아니라 이 글이 만든 학습용 예입니다.
        </CitationBlock>
      </section>

      <section id="why-severity-fails" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 곱이라도 적발 가능성과 엄벌은 같은 정책이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            H 사례에서 최종 확률이 5%로 떨어지면 D(S)=30인 기대 제재는 1.5가
            됩니다. 장부만 보면 D(S)를 200으로 올려 기대 제재를 10으로 만들 수
            있습니다. 그러나 이 숫자는 “법정형을 200으로 쓰면 해결된다”는 정책
            결론이 아닙니다.
          </p>
          <p className="leading-7">
            첫째, 사람은 실제 확률이 아니라 자신이 믿는 확률에 반응합니다. 둘째,
            D(S)는 형량에 선형으로 늘지 않을 수 있고 먼 미래의 제재는 작게
            평가될 수 있습니다. 셋째, 긴 구금은 비용과 오판 피해를 키우며 응보의
            비례 상한과 충돌할 수 있습니다. 넷째, 제재 체계가 바뀌면 수사·기소·협상·
            재판의 행동도 바뀔 수 있어 p를 고정한 비교가 현실에서 유지된다고
            보장할 수 없습니다.
          </p>
          <p className="leading-7">
            실증 연구를 종합한 Nagin의 검토도 제재의 중함보다 붙잡힐 가능성의
            억제 근거가 더 일관되며, 그 근거는 주로 <em>검거 가능성</em>에 관한
            것이라고 범위를 좁힙니다. 그러므로 “확률은 언제나 형량보다 강하다”가
            아니라, 긴 형의 억제 효과를 당연하게 두지 말고 실제 인식과 검거
            변화를 측정해야 한다는 결론이 맞습니다.
          </p>
        </div>

        <CitationBlock source="Daniel S. Nagin · Deterrence in the Twenty-First Century (Crime and Justice 42, 2013)" citeKey={3} href="https://www.journals.uchicago.edu/doi/10.1086/670398">
          억제 연구를 검토해 제재의 중함보다 확실성의 효과를 지지하는 근거가 더
          일관된다고 정리하면서도, 그 확실성 근거가 거의 모두 검거 가능성에
          집중되어 있다고 한정합니다. 이 글은 그 범위를 따라 긴 형의 효과를
          일반 법칙으로 단정하지 않습니다.
        </CitationBlock>

        <div id="marginal-deterrence" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            H가 이미 훔치기로 했다면 무엇이 다음 행동을 막습니까
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              가상 사례를 한 단계 더 진행하겠습니다. H가 물건을 든 순간 경비원을
              만났습니다. 재산 침해와 경비원에게 위해를 가하는 행위의 제재가
              똑같다면, 형벌 체계는 H에게 더 큰 위해를 피할 추가 이유를 주지
              못합니다.
            </p>
            <p className="leading-7">
              그래서 억제는 “처음부터 할 것인가”만 보지 않습니다. 이미 덜 무거운
              행위를 한 사람이 더 무거운 행위로 넘어가지 않게 할 제재의 차이도
              남겨야 합니다. 이를 한계 억제라고 부릅니다. 다만 이 가상 예가 실제
              법정형을 자동으로 정하지는 않습니다. 행위의 중대성, 책임, 증거와
              각 법제의 비례 원칙이 함께 경계를 정합니다.
            </p>
          </div>
        </div>

        <AlgorithmBlock
          title="형벌 정책 주장을 검토하는 순서"
          input={["미리 정의된 금지와 유죄 판단을 통과한 가상 H 사건", "형벌이 추구한다는 목적", "적발부터 집행까지의 단계별 자료", "제재의 비용·오판·비례성 자료"]}
          steps={[
            { code: "먼저 형사책임의 성립과 형벌 목적을 분리한다.", note: "예방에 도움이 된다는 이유가 H의 유죄를 증명하지 않습니다. 유죄 판단이 먼저입니다." },
            { code: "응보·억제·무해화·재활 가운데 어떤 목적을 말하는지 밝힌다.", note: "목적마다 필요한 자료와 형에 거는 조건이 다릅니다." },
            { code: "억제 주장이라면 p를 적발·신원 확인·유죄·집행 단계로 나눈다.", note: "최종 확률 하나만 보면 실제 병목이 어느 단계인지 알 수 없습니다." },
            { code: "법정형 S와 효용 부담 D(S)를 구분하고 단위를 맞춘다.", note: "징역 연수와 금전 이익을 그대로 빼는 계산은 단위가 맞지 않습니다." },
            { code: "효과와 함께 오판·비용·비례·한계 억제를 비교한다.", note: "같은 기대 제재를 만드는 조합도 사회적 비용과 권리 침해가 다릅니다." },
            { code: "실제 제도 변화 뒤에는 인식과 행동이 바뀌었는지 다시 측정한다.", note: "가상 계산은 가설을 만들 뿐, 정책 효과를 실증한 결과가 아닙니다." },
          ]}
          output="어떤 목적을 어떤 자료로 검증하며, 어디까지가 계산이고 어디부터가 규범 판단인지 표시한 형벌 정책 설명"
        />
      </section>

      <section id="legality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          H가 행동한 뒤 금지를 만들어 거꾸로 적용할 수는 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            억제 모형만 보아도 무엇이 금지되고 어떤 결과가 따르는지 미리 알 수
            있어야 선택이 바뀝니다. 그러나 죄형법정주의의 이유는 억제보다 넓습니다.
            국가는 행동 뒤에 규칙을 만들거나 예측하기 어려운 해석으로 처벌 범위를
            넓혀 사람을 임의로 벌해서는 안 됩니다.
          </p>
          <p className="leading-7">
            대한민국 형법 제1조는 행위의 범죄성과 처벌을 행위 당시의 법률로
            정한다고 규정합니다. 유럽인권협약 제7조도 행위 당시 국내법 또는
            국제법상 범죄가 아니었던 행위로 유죄가 될 수 없다고 정합니다. 유럽
            인권재판소는 여기서 법의 접근 가능성과 예측 가능성을 함께 봅니다.
            다만 성문법과 판례의 관계, 허용되는 해석 범위는 법체계마다 다르므로
            “모든 범죄는 한 문장으로 적혀 있어야 한다”로 단순화할 수 없습니다.
          </p>
        </div>

        <ProgressiveDetail title="징역 30년을 D(S)=30이라고 넣으면 왜 안 됩니까?" preview="연수와 효용은 다른 단위이고, 같은 1년도 사람과 시점에 따라 같은 부담이 아닙니다.">
          <p className="leading-7">
            S는 법이 정한 제재이고 D(S)는 그 제재가 행동 선택에 주는 부담입니다.
            벌금 1천만 원, 징역 1년, 자격 제한 1년은 서로 다른 단위라 그대로 더할
            수 없습니다. 모두를 H가 느끼는 효용 변화로 바꾸는 함수가 D입니다.
          </p>
          <p className="leading-7">
            이 변환은 관측하기 어렵습니다. 먼 미래의 제재는 할인될 수 있고,
            자유 제한의 첫 1년과 열 번째 1년의 추가 부담이 같지 않을 수 있으며,
            가족·직업·건강에 따라 부수 효과도 달라집니다. 그래서 D(S)=30은
            측정값이 아니라 이 글의 계산을 보이기 위한 가정입니다.
          </p>
          <p className="leading-7">
            계산을 읽을 때는 숫자보다 먼저 단위를 확인해야 합니다. “30년 × 30% =
            9년”은 평균 집행기간을 말할 수는 있어도, H가 이익 8과 비교하는 기대
            효용 9를 자동으로 뜻하지 않습니다.
          </p>
        </ProgressiveDetail>

        <CitationBlock source="대한민국 형법 제1조 · 국가법령정보센터" citeKey={4} href="https://law.go.kr/lsInfoP.do?chrClsCd=010203&lsiSeq=253323&urlMode=engLsInfoR&viewCls=engLsInfoR">
          행위의 범죄성과 처벌 가능성은 행위 당시 시행 중인 법률에 따른다는 공식
          법령입니다. 이 글에서는 대한민국법의 소급 처벌 금지 근거로만
          인용합니다.
        </CitationBlock>

        <CitationBlock source="European Court of Human Rights · Guide on Article 7 (2026-02-28 갱신)" citeKey={5} href="https://ks.echr.coe.int/documents/d/echr-ks/guide_art_7_eng-pdf">
          유럽인권협약 제7조의 소급 처벌 금지와 법의 접근 가능성·예측 가능성에
          관한 판례 기준을 정리한 재판소 공식 가이드입니다. 대한민국 형법의 해석
          자료가 아니라 비교 법제의 기준으로 사용했습니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          형벌 목적을 정해도 H가 유죄라는 결론은 아직 나오지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            같은 H 사건을 따라오면 순서가 보입니다. 법이 금지를 미리 정하고,
            절차가 H의 행위와 책임을 증명하며, 유죄 뒤에야 형벌 목적이 형의 종류와
            정도를 이끕니다. 억제 계산은 그 마지막 단계에서 정책 가설 하나를
            검사할 뿐입니다.
          </p>
          <p className="leading-7">
            이제 남은 질문은 “어느 정도로 확실해야 H를 유죄라고 할 수 있는가”입니다.
            무고한 사람을 벌하는 오류와 유죄인 사람을 놓치는 오류를 어떻게
            다룰지에 따라 증명 문턱이 달라집니다. 다음 글{" "}
            <Link to="/law/criminal-law/procedure-and-proof">절차와 증명</Link>에서
            같은 사건을 그 문턱까지 이어서 보겠습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
