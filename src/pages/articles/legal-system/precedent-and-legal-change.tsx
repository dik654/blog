import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import JurisdictionForceViz from "./precedent-and-legal-change/viz/JurisdictionForceViz";
import OverrulingThresholdViz from "./precedent-and-legal-change/viz/OverrulingThresholdViz";
import PrecedentChainViz from "./precedent-and-legal-change/viz/PrecedentChainViz";

/** 앞 사건의 이유가 다음 사건에서 어떤 힘을 갖고, 어떻게 바뀌는지 설명합니다. */
export default function PrecedentAndLegalChangeArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          판례는 지난 답을 복사하는 장치가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            판례는 앞 사건의 결론을 새 사건에 그대로 붙이는 장치가 아닙니다. 앞
            결론에 꼭 필요했던 법적 이유를 꺼내고, 새 사건의 중요한 사실이 그
            이유의 사정거리 안에 들어오는지 확인하는 장치입니다.
          </p>
          <p className="leading-7">
            공원에 차량 출입을 금지한 조항이 있다고 해 보겠습니다. 첫 사건에서는
            전동 킥보드가 금지 대상이라는 판단이 나왔습니다. 다음 사건에 환자를
            태운 구급차가 들어오면 &ldquo;둘 다 동력으로 움직인다&rdquo;는 공통점만
            보고 같은 답을 낼 수 있을까요?
          </p>
          <p className="leading-7">
            여기서 자연스럽게 세 갈래가 생깁니다. 중요한 사실이 같으면 앞 이유를
            따릅니다. 목적과 직접 연결된 사실이 다르면 앞 판례를 부정하지 않고
            구별할 수 있습니다. 앞 이유 자체를 더는 유지하지 않겠다면 판례를
            뒤집는 별도의 문턱을 넘어야 합니다.
          </p>
        </div>

        <PrecedentChainViz />
        <ContentBoundary article="precedent-and-legal-change" />
      </section>

      <section id="what-binds" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음 사건으로 넘어가는 것은 결론에 필요했던 이유입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            &ldquo;원고 승소&rdquo;나 &ldquo;킥보드 출입 금지&rdquo;라는 주문만으로는 다음
            사건의 범위를 알 수 없습니다. 어떤 법적 질문에 답했고, 어떤 사실이 그
            답에 꼭 필요했는지를 함께 읽어야 합니다.
          </p>
          <p className="leading-7">
            영미법 설명에서는 결론을 지탱하는 핵심 이유를 보통{" "}
            <strong>판결 이유</strong> 또는 <strong>ratio decidendi</strong>라고
            부르고, 결론에 필요하지 않았던 설명은 <strong>방론</strong> 또는
            <strong>obiter dictum</strong>이라고 부릅니다. 하지만 실제 판결문에는
            두 부분이 이름표를 달고 나오지 않습니다. 무엇이 꼭 필요했는지 자체가
            뒤 사건의 쟁점이 될 수 있습니다.
          </p>
          <p className="leading-7">
            그러므로 &ldquo;그 문장을 빼도 같은 결론이 가능한가&rdquo;는 좋은 첫 질문이지만
            자동 판별식은 아닙니다. 판결이 답한 법적 질문, 중요한 사실, 법원이
            제시한 규칙을 함께 좁혀 읽어야 합니다. 넓은 한 문장을 떼어 내면 판례가
            실제 사건보다 멀리 뻗는 오류가 생깁니다.
          </p>
        </div>

        <TermBreakdown
          title="판결문에서 세 층을 갈라 읽기"
          items={[
            {
              term: "결론",
              description: "그 사건에서 누가 무엇을 얻거나 잃었는지입니다.",
              example: "전동 킥보드 운전자에 대한 출입 제한 처분이 적법하다고 판단했습니다.",
              boundary: "당사자와 사실이 다른 다음 사건에 결론만 그대로 붙일 수는 없습니다.",
            },
            {
              term: "결론에 필요한 이유",
              description: "법적 질문에 답하고 결론을 지탱한 규칙과 중요한 사실입니다.",
              example: "개인 이동용 동력 장치가 보행자 충돌 위험을 만든다는 점이 금지 목적과 연결됐습니다.",
              boundary: "필요한 이유의 정확한 넓이는 뒤 사건에서 다시 다투어질 수 있습니다.",
            },
            {
              term: "곁들인 설명",
              description: "결론을 이해시키지만 그 결론에 없어도 되었던 말입니다.",
              example: "공원에는 어떤 동력 장치도 절대 들어와서는 안 된다는 넓은 언급이 붙었습니다.",
              boundary: "구속력과 설득력은 다릅니다. 방론도 뒤 법원을 설득할 수는 있습니다.",
            },
          ]}
        />

        <CitationBlock
          source="Stanford Encyclopedia of Philosophy · Precedent and Analogy in Legal Reasoning"
          citeKey={1}
          href="https://plato.stanford.edu/entries/legal-reas-prec/"
        >
          판례의 구속 부분, 방론, 구별의 구조를 정리한 철학 백과 항목입니다. 이
          구분은 영미법의 전형적인 설명에 가깝고, 모든 나라의 판례 효력을 같은
          방식으로 정한다는 뜻은 아닙니다.
        </CitationBlock>
      </section>

      <section id="why-follow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          판례의 힘은 나라·법원 위계·같은 사건인지에 따라 달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            &ldquo;판례는 법원을 구속합니다&rdquo;라는 문장은 너무 넓습니다. 한국의 파기환송
            사건, 미국 연방법원의 수직적 선례구속, 영국 대법원이 자기 종전 결정을
            다루는 방식은 서로 다른 규칙입니다.
          </p>
          <p className="leading-7">
            한국 법원조직법 제8조는 상급법원 판단이 <strong>해당 사건</strong>의
            하급심을 기속한다고 정합니다. 대법원은 별도 판결에서 대법원 판례가
            유사 사건의 하급심에 법령 해석·적용의 일반적 기준을 제시한다고
            설명했습니다. 같은 사건의 환송 기속력과 다른 유사 사건에서 판례가
            갖는 기능을 한 문장으로 합치면 안 됩니다.
          </p>
          <p className="leading-7">
            미국 연방법원에서는 하급법원이 같은 관할의 상급법원 판례를 따르는
            수직 관계와, 법원이 자기 판례를 존중하는 수평 관계를 구분합니다.
            영국 대법원은 종전 최고법원 결정을 보통 구속적인 것으로 취급하면서도
            옳다고 보일 때 이탈할 수 있고, 확실성과 일관성 때문에 그 권한을 매우
            신중하게 사용한다고 밝힙니다.
          </p>
        </div>

        <JurisdictionForceViz />

        <CitationBlock
          source="대한민국 법원조직법 제7조·제8조와 대법원 2022. 5. 12. 선고 2018다248626 전원합의체 판결"
          citeKey={2}
          href="https://www.law.go.kr/LSW/precInfoP.do?mode=0&precSeq=234931"
        >
          제8조는 해당 사건의 하급심 기속력을 정하고, 제7조 제1항 제3호는 기존
          대법원 해석 의견을 바꿀 필요가 있을 때 전원합의체가 심판하도록 합니다.
          대법원은 이 판결에서 대법원 판례가 유사 사건에 일반적인 해석 기준을
          제시한다고 설명했습니다.
        </CitationBlock>

        <CitationBlock
          source="Congressional Research Service · The Supreme Court’s Overruling of Constitutional Precedent"
          citeKey={3}
          href="https://www.congress.gov/crs_external_products/R/PDF/R45319/R45319.4.pdf"
        >
          미국 연방법원의 수직·수평 선례구속을 구분하고, 연방대법원이 헌법 판례를
          바꿀 때 쓰는 비배타적 요소를 정리한 공식 의회조사국 보고서입니다.
        </CitationBlock>

        <CitationBlock
          source="UK Supreme Court Practice Directions 4.7 · Practice Statement (Judicial Precedent)"
          citeKey={4}
          href="https://www.supremecourt.uk/how-to-appeal/practice-directions"
        >
          영국 대법원은 1966년 Practice Statement가 현재 대법원에서도 효력을
          갖는 확립된 법리라고 설명합니다. 종전 결정을 떠날 수 있지만 확실성과
          일관성 때문에 매우 신중해야 한다는 최근 판결의 설명도 함께 확인됩니다.
        </CitationBlock>
      </section>

      <section id="distinguishing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          중요한 사실이 다르면 판례를 뒤집지 않고도 구별할 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            구별은 &ldquo;이번에는 마음에 들지 않으니 예외&rdquo;라고 말하는 기술이
            아닙니다. 새 사건의 차이가 앞 판례의 이유와 왜 직접 관련되는지를
            보여 주는 작업입니다.
          </p>
          <p className="leading-7">
            킥보드 사건의 필요한 이유가 개인 이동과 보행자 위험이었다면, 환자를
            옮기는 구급차는 목적부터 다릅니다. 그 차이 때문에 앞 이유가 구급차까지
            닿지 않는다고 설명하면 앞 판례를 유지하면서 적용 범위를 좁힐 수
            있습니다.
          </p>
          <p className="leading-7">
            반대로 색상이나 제조사처럼 판결 이유와 무관한 차이를 내세우면 사실상
            판례를 피하면서도 구별이라고 부르는 셈입니다. 구별이 반복되어 예외가
            원칙보다 길어지면 현재 규칙을 예측하기 어려워지고, 그때는 판례 자체를
            정리할 필요가 커집니다.
          </p>
          <p className="leading-7">
            미국 의회조사국 보고서도 법원은 앞 사건의 법이나 사실을 구별하거나
            판시 범위를 제한해, 판례를 뒤집을지 결정하지 않고 현재 사건을 해결할
            수 있다고 설명합니다. 핵심은 이름이 아니라 앞 이유를 여전히
            인정하는지입니다.
          </p>
        </div>
      </section>

      <section id="when-to-overrule" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          판례를 바꾸려면 틀렸다는 생각보다 더 많은 질문이 필요합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            판례 변경은 앞 판례의 이유 자체를 더는 유지하지 않는 일입니다. 그래서
            구별보다 파장이 큽니다. 새 재판부가 다른 답을 선호한다는 이유만으로
            바꾸면 재판부가 바뀔 때마다 법도 흔들립니다.
          </p>
          <p className="leading-7">
            미국 연방대법원의 헌법 판례를 정리한 의회조사국 보고서는 이유의 질,
            실제 적용 가능성, 관련 판결들과의 일관성, 판결 뒤의 사실 이해 변화,
            기존 판단에 대한 신뢰를 비배타적 요소로 듭니다. 동시에 요소의 완전한
            목록이나 고정된 가중치는 없어서 결과 예측이 어렵다고 경고합니다.
          </p>
          <p className="leading-7">
            영국은 종전 결정을 떠날 권한을 인정하지만 신중함을 강조합니다. 한국은
            기존 대법원 해석 의견을 바꾸려면 전원합의체 심판 사항이 됩니다. 미국의
            다섯 요소를 한국과 영국에 그대로 넣어 점수를 계산하는 식은 실제 법이
            아닙니다.
          </p>
        </div>

        <OverrulingThresholdViz />

        <div id="retroactivity" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            바뀐 판단이 과거의 모든 사건을 자동으로 다시 여는 것은 아닙니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              판례를 바꾼 사건, 아직 재판 중인 비슷한 사건, 이미 확정된 사건은
              서로 다른 시간대에 있습니다. &ldquo;판례가 바뀌었다&rdquo;는 한 문장만으로 세
              묶음의 결과를 모두 말할 수 없습니다.
            </p>
            <p className="leading-7">
              새 판단은 우선 그 판단을 만든 현재 사건을 해결합니다. 진행 중인 다른
              사건에 얼마나 적용되는지는 해당 국가와 법 분야의 소급효 규칙을
              확인해야 합니다. 미국 연방법만 보아도 직접심이 끝나지 않은 사건과
              이미 확정된 사건을 구분합니다.
            </p>
            <p className="leading-7">
              이미 확정된 판결은 판례 변경만으로 자동 취소되지 않습니다. 한국
              민사소송에서도 확정판결의 효력을 없애려면 법이 정한 재심 사유가
              필요하다는 것이 원칙입니다. 형사·헌법·조세처럼 분야가 달라지면
              구제와 소급효 규칙도 달라지므로, &ldquo;유리하면 전부 소급, 불리하면 전부
              장래&rdquo; 같은 한 줄 공식으로 정리하면 안 됩니다.
            </p>
          </div>

          <CitationBlock
            source="대법원 2012. 12. 13. 선고 2011다103809 판결 · 확정판결과 재심"
            citeKey={5}
            href="https://www.law.go.kr/LSW/precInfoP.do?precSeq=171783"
          >
            민사 확정판결에는 기판력이 생기며, 그 효력을 배제하려면 재심 사유가
            있는 경우 재심으로 취소를 구하는 것이 원칙이라고 설명합니다. 판례
            변경과 확정 사건의 자동 재개를 구분하는 근거입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음 사건에서는 네 질문만 순서대로 확인하면 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 앞 판결이 답한 법적 질문과 결론에 필요했던 이유를 찾습니다. 그다음
            새 사건의 중요한 사실이 같은지 봅니다. 같다면 해당 법체계와 법원
            위계가 요구하는 힘에 따라 따르고, 다르면 그 차이가 이유와 어떻게
            연결되는지 설명해 구별합니다.
          </p>
          <p className="leading-7">
            앞 이유 자체를 버리려 한다면 누가 어떤 절차로 바꿀 수 있는지, 유지할
            비용과 바꿀 비용은 무엇인지 확인합니다. 마지막으로 새 판단이 현재
            사건, 진행 중인 사건, 확정된 사건 가운데 어디까지 닿는지 따로 봅니다.
          </p>
          <p className="leading-7">
            이 흐름을 알면 판례를 &ldquo;외워야 할 결론 모음&rdquo;으로 보지 않게 됩니다.
            판례는 이유의 범위를 다음 사건에서 시험하고, 필요하면 좁히거나 정식
            절차로 바꾸는 누적 시스템입니다. 다음 글부터는 이 장치가 실제 권리와
            의무를 어떻게 만드는지{" "}
            <Link to="/law/private-law/contract-and-enforceable-promise">계약</Link>
            에서 확인합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
