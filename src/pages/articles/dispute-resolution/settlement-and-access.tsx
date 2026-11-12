import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SettlementRangeViz from "./settlement-and-access/viz/SettlementRangeViz";
import ShadowOfJudgmentViz from "./settlement-and-access/viz/ShadowOfJudgmentViz";
import NoOverlapViz from "./settlement-and-access/viz/NoOverlapViz";
import AccessCostViz from "./settlement-and-access/viz/AccessCostViz";

/** 경보기 분쟁 하나로 합의 범위, 재판 선택, 법의 그림자와 접근 격차를 추적한다. */
export default function SettlementAndAccessArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          가게 주인 M은 1,200만원을 청구했지만 그 금액이 곧 합의금은 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글의 가상 사건을 민사 분쟁으로 이어가겠습니다. H가 물건을 훔친 뒤,
            가게 주인 M은 경보기 업체 V가 계약대로 알람을 보내지 않아 손해가
            커졌다고 주장합니다. M은 V에게 1,200만원을 요구하고, V는 자기 책임이
            확실하지 않다며 거절합니다. 이 사건과 숫자는 설명을 위한 가상 사례입니다.
          </p>
          <p className="leading-7">
            둘은 세 선택지를 가집니다. M이 포기할 수 있고, 중간 금액에 합의할 수
            있고, 법원에서 책임과 금액을 다툴 수 있습니다. 어느 선택이 나오는지는
            청구액 하나가 아니라 승소 전망, 걸리는 시간, 각자의 비용, 증거와
            판결을 실제로 집행할 수 있는지가 함께 정합니다.
          </p>
          <p className="leading-7">
            <strong>
              법은 합의금을 직접 찍어 내는 가격표가 아니라, 재판까지 갔을 때 각
              당사자가 기대할 수 있는 대안값을 바꾸어 협상 범위를 움직입니다.
            </strong>{" "}
            그리고 법원에 갈 수 있는 능력이 약하면 그 대안값도 약해집니다.
          </p>
        </div>

        <SettlementRangeViz />
        <ContentBoundary article="settlement-and-access" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 한 문장은 곧 두 꼬리 질문을 만듭니다. 왜 재판하지 않아도 법이
            작동하는가? 같은 권리가 있어도 왜 자금과 정보가 부족한 쪽은 더 낮은
            금액에 합의하거나 아예 청구하지 못하는가?
          </p>
          <p className="leading-7">
            먼저 M과 V의 대안값을 한 줄씩 계산합니다. 그다음 합의 범위가 사라지는
            이유, 재판 기록이 전체 분쟁의 무작위 표본이 아닌 이유, 법 규칙이
            협상에 들어오는 경로, 접근 장치가 실제로 무엇을 바꾸는지 순서대로
            추적합니다.
          </p>
        </div>
      </section>

      <section id="settlement-range" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          합의 범위는 두 사람이 가진 재판 대안값 사이에서 열립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            M은 “재판하면 얼마를 받을까?”를 생각합니다. V는 “재판하면 얼마까지
            부담할까?”를 생각합니다. 여기서 V의 승소 확률이 아니라, V가 보기에
            <em>M의 청구가 받아들여질 확률</em>을 써야 같은 방향으로 비교할 수
            있습니다.
          </p>
          <p className="leading-7">
            M은 자기 대안값보다 많은 금액이면 합의를 받아들일 수 있습니다. V는
            자기 대안값보다 적은 금액이면 합의하는 편이 낫습니다. M의 최저선이
            V의 최고선보다 낮을 때만 두 사람이 동시에 받아들일 수 있는 금액이
            생깁니다.
          </p>
        </div>

        <ExplainedFormula
          question="M이 받을 최소 합의금과 V가 낼 최대 합의금은 어떻게 계산하는가?"
          idea="판결로 받을 금액 J에 각자가 보는 M의 승소 가능성 p와 시간 할인 d를 곱합니다. M은 자기 소송부담을 빼고, V는 재판을 피하면 아낄 자기 소송부담을 더합니다. 두 결과는 공정한 가격이 아니라 각자가 협상을 깨고 재판으로 갈 때의 단순 대안값입니다."
          formula={String.raw`R_M=d\,p_MJ-C_M,\qquad R_V=d\,p_VJ+C_V,\qquad R_M\le R_V`}
          annotatedFormula={String.raw`\underbrace{R_M=d\,p_MJ-C_M}_{\text{M의 최소 수락액}},\qquad \underbrace{R_V=d\,p_VJ+C_V}_{\text{V의 최대 지급액}},\qquad \underbrace{R_M\le R_V}_{\text{겹치는 합의 범위가 있음}}`}
          operations={[
            {
              expression: String.raw`d\,p_MJ`,
              annotation: ["M이 보는 승소 가능성으로 판결액을 가중하고", "나중에 받는 돈의 현재가치로 할인합니다."],
            },
            {
              expression: String.raw`d\,p_MJ-C_M`,
              annotation: ["재판으로 기대하는 금액에서 M의 부담을 빼면", "그보다 낮은 제안을 거절할 이유가 생깁니다."],
            },
            {
              expression: String.raw`d\,p_VJ+C_V`,
              annotation: ["V가 예상하는 지급액에 재판을 피하면 아낄 부담을 더하면", "그보다 높은 제안을 거절할 이유가 생깁니다."],
            },
            {
              expression: String.raw`R_M\le R_V`,
              annotation: ["M의 최저선이 V의 최고선을 넘지 않아야", "두 사람이 함께 받아들일 수 있는 금액이 존재합니다."],
            },
          ]}
          terms={[
            {
              symbol: String.raw`J`,
              name: "인정될 수 있는 판결액",
              description: "청구서에 적은 1,200만원이 자동으로 인정된다는 뜻이 아니라, 이 단순 사례에서 책임이 인정되면 오가는 금액을 1,200만원으로 고정한 값입니다.",
            },
            {
              symbol: String.raw`p_M,\,p_V`,
              name: "각자가 보는 M의 승소 가능성",
              description: "같은 증거를 보고도 M과 V가 다르게 평가할 수 있습니다. 법원이 실제로 백분율을 판결문에 넣는다는 뜻은 아닙니다.",
            },
            {
              symbol: String.raw`d`,
              name: "시간 할인계수",
              description: "판결금이 나중에 지급된다는 점을 현재가치로 줄인 가상 계수입니다. 0.90이면 미래의 1원을 지금 0.9원으로 본다는 뜻입니다.",
            },
            {
              symbol: String.raw`C_M,\,C_V`,
              name: "각자의 소송부담",
              description: "이 예에서는 직접비용과 시간 부담을 같은 백만원 단위로 환산했다고 둡니다. 법원이 상대에게 돌려주라고 명하는 소송비용과 같은 말이 아닙니다.",
            },
          ]}
          assumptions={[
            "M과 V가 위험을 중립적으로 대하고 돈의 기대값만 비교한다고 둡니다.",
            "책임이 인정되면 판결액은 1,200만원으로 같고, 전부 또는 전무인 한 번의 재판이라고 둡니다.",
            "합의 협상 자체의 비용, 변호사 보수의 전가 규칙, 세금, 이자와 항소는 생략합니다.",
            "V가 지급 능력이 있고 판결을 집행할 수 있다고 둡니다. 회수 가능성이 낮으면 M의 대안값은 더 내려갑니다.",
            "평판, 선례, 비밀유지, 사과와 같은 비금전 목적은 넣지 않습니다.",
          ]}
          interpretation="모든 금액을 백만원으로 두겠습니다. J=12, d=0.90, M은 승소 가능성을 0.70으로 보고 C_M=3을 부담한다고 보면 R_M=0.90×0.70×12−3=4.56입니다. M은 456만원보다 적은 제안이면 단순 모형상 재판을 택합니다. V는 M의 승소 가능성을 0.60으로 보고 C_V=2를 부담한다고 보면 R_V=0.90×0.60×12+2=8.48입니다. V는 848만원보다 많은 제안이면 재판을 택합니다. 따라서 456만~848만원이 겹칩니다. 이 범위 안의 어느 금액이 선택될지는 협상력, 정보, 위험 회피와 절차 규칙이 정합니다. 가운데가 법적으로 공정한 정답이라는 뜻은 아닙니다."
        />

        <TermBreakdown
          title="비슷해 보이지만 다른 네 값"
          items={[
            { term: "청구액", description: "M이 요구서나 소장에 적은 금액입니다.", example: "M은 1,200만원 전액을 요구합니다.", boundary: "청구액이 곧 승소액·기대값·합의금은 아닙니다." },
            { term: "예상 판결액", description: "책임과 손해가 인정될 가능성을 반영해 재판 결과를 가중한 값입니다.", example: "M의 단순 기대 판결액은 0.70×1,200만원입니다.", boundary: "실제 법원은 이 예처럼 하나의 확률만 곱해 판결하지 않습니다." },
            { term: "재판 대안값", description: "시간과 자기 부담까지 반영해 협상을 깨고 재판할 때 남는 값입니다.", example: "M의 가상 대안값은 456만원입니다.", boundary: "비금전 목적이나 지급불능 위험을 넣으면 값이 달라집니다." },
            { term: "합의금", description: "겹치는 범위 안에서 실제로 양쪽이 선택한 금액입니다.", example: "600만원은 둘의 범위 안이므로 가능한 합의지만 유일한 답은 아닙니다.", boundary: "합의됐다는 사실만으로 진실·공정성·자발성이 모두 확인되는 것은 아닙니다." },
          ]}
        />
      </section>

      <section id="no-overlap" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          합의가 깨지는 이유는 고집보다 대안값이 겹치지 않기 때문일 수 있습니다
        </h2>
        <NoOverlapViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            M이 새 증거를 보고 승소 가능성을 90%로 올려 보는데 V는 여전히 30%로
            본다고 해 보겠습니다. M의 최저선은 올라가고 V의 최고선은 내려갑니다.
            두 선이 교차하면 같은 금액을 동시에 받아들일 수 없습니다.
          </p>
          <p className="leading-7">
            서로 다른 전망은 단순한 낙관만으로 생기지 않습니다. 한쪽만 경보기
            로그를 갖고 있거나, 어느 계약조항이 적용되는지 다르게 이해하거나,
            상대가 무엇을 알고 있는지 모를 수 있습니다. 정보 비대칭은 제안 자체를
            신호로 읽게 만들어, 양쪽이 아낄 소송비용이 있어도 합의를 막을 수
            있습니다.
          </p>
          <p className="leading-7">
            그래서 증거 공개, 중립 평가, 조정은 단지 “사이를 좋게 만드는 절차”가
            아닙니다. 서로 다른 입력을 좁혀 겹치는 범위를 다시 찾는 장치가 될 수
            있습니다. 반대로 공익적 판결이나 긴급한 금지명령이 필요하면 돈의
            겹침만으로 사건을 끝내는 것이 바람직하지 않을 수도 있습니다.
          </p>
        </div>
        <CitationBlock source="Lucian A. Bebchuk · Litigation and Settlement under Imperfect Information (RAND Journal of Economics 15, 1984)" citeKey={1} href="https://hls.harvard.edu/bibliography/litigation-and-settlement-under-imperfect-information/">
          이 논문은 불완전한 정보가 소송과 합의 결정을 어떻게 바꾸고, 합의가
          실패할 수 있게 하는지 모형화합니다. 이 글의 숫자 사례는 논문의 실증값을
          옮긴 것이 아니라, 정보 차이가 대안값의 겹침을 없앨 수 있다는 구조를
          보여 주려고 만든 예입니다.
        </CitationBlock>
      </section>

      <section id="selection" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          재판 기록은 전체 분쟁을 그대로 축소한 표본이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            M과 V처럼 대안값이 겹치는 사건은 판결 전에 끝날 수 있습니다. 포기된
            청구는 소장에도 남지 않습니다. 결국 재판이나 항소 기록에 남는 사건은
            비용, 정보 차이, 법적 불확실성, 전략적 목적을 통과한 선택된 사건입니다.
          </p>
          <p className="leading-7">
            여기서 안전하게 말할 수 있는 결론은 “재판 사건은 전체 분쟁의 무작위
            표본이 아니다”까지입니다. 원래 글처럼 재판 승률이 언제나 50% 근처로
            간다거나, 오직 애매한 사건만 남는다고 단정하면 안 됩니다. 이해관계의
            비대칭, 정보 구조, 비용 분담과 판정 기준이 달라지면 선택 방향도 달라집니다.
          </p>
          <p className="leading-7">
            따라서 판례집만 읽고 “현실의 분쟁은 모두 이만큼 애매하다”거나, 소송
            승률만 보고 특정 권리가 강하다고 판단하면 선택효과를 놓칩니다. 시작되지
            않은 청구, 중간에 합의된 사건, 조정과 집행 실패까지 함께 봐야 합니다.
          </p>
        </div>
        <CitationBlock source="George L. Priest · Benjamin Klein · The Selection of Disputes for Litigation (Journal of Legal Studies 13, 1984)" citeKey={2} href="https://www.journals.uchicago.edu/doi/10.1086/467732">
          이 논문은 재판된 분쟁과 그 전에 합의된 분쟁의 관계를 분석하며, 재판
          사건으로 사회 전체의 분쟁을 곧장 추론할 수 없다는 선택 문제를 제기합니다.
          널리 알려진 50% 승률 예측은 대칭적 이해관계와 오차 등 제한된 조건에서
          나오는 결과이므로 이 글은 일반 법칙으로 사용하지 않습니다.
        </CitationBlock>
      </section>

      <section id="shadow" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          법 규칙은 재판의 예상 결과를 거쳐 협상 테이블에 들어옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            경보기 계약의 면책조항을 제한하는 새 판결이 나왔다고 해 보겠습니다.
            M과 V가 그 판결을 자기 사건과 비슷하다고 받아들이면 M의 승소 전망이나
            인정될 손해액이 올라갑니다. 그러면 M의 최저선과 V의 최고선이 함께
            움직이고, 실제 재판을 열지 않아도 합의 범위가 달라집니다.
          </p>
          <p className="leading-7">
            이것이 “법의 그림자 아래에서 협상한다”는 말의 핵심입니다. 법이 합의
            결과를 단독으로 결정한다는 뜻은 아닙니다. 법은 각자가 협상을 깨고
            법원에 갈 때 얻을 수 있는 선택지를 만들고, 그 선택지가 협상력의 한
            부분이 됩니다.
          </p>
        </div>
        <ShadowOfJudgmentViz />
        <CitationBlock source="Robert H. Mnookin · Lewis A. Kornhauser · Bargaining in the Shadow of the Law: The Case of Divorce (Yale Law Journal 88, 1979)" citeKey={3} href="https://openyls.law.yale.edu/bitstream/handle/20.500.13051/15889/47_88YaleLJ950_April1979_.pdf?isAllowed=y&amp;sequence=2">
          원문은 법의 역할을 법정이 내리는 명령에서만 찾지 않고, 법정 밖 협상에
          제공하는 틀에서 보자고 제안합니다. 출발 사례는 이혼이므로 모든 민사
          분쟁에 같은 세부 결론을 옮길 수는 없습니다. 이 글은 “법적 대안이 협상
          범위를 움직인다”는 일반 구조만 경보기 분쟁에 적용했습니다.
        </CitationBlock>
      </section>

      <section id="access" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          권리가 있어도 법원에 갈 수 없다면 협상 대안은 약해집니다
        </h2>
        <AccessCostViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            M의 승소 전망과 청구액이 그대로인데, 자료 확보와 대리 비용 때문에
            M의 부담 C<sub>M</sub>이 300만원에서 800만원으로 늘었다고 해
            보겠습니다. M의 대안값은 456만원에서 −44만원으로 떨어집니다. 이
            단순 모형에서는 소송을 시작하지 않는 편이 낫습니다.
          </p>
          <p className="leading-7">
            흥미롭게도 비용 증가는 이미 시작된 협상에서는 M의 최저선을 낮춰 합의
            범위를 넓힐 수 있습니다. 그러나 시작 여부까지 보면 전혀 좋은 소식이
            아닙니다. V가 M이 소송할 수 없다는 사실을 알면 더 낮은 제안을 하거나
            아무것도 제안하지 않을 수 있습니다. “합의가 잘 됐다”는 지표만 보면 이
            접근 격차를 놓칩니다.
          </p>
          <p className="leading-7">
            접근은 변호사 비용 하나가 아닙니다. 증거를 보존하고 얻을 능력, 절차와
            언어를 이해할 수 있는지, 시간을 낼 수 있는지, 상대의 재산에서 실제로
            회수할 수 있는지, 디지털 절차를 이용할 수 있는지가 모두 대안값을
            바꿉니다.
          </p>
        </div>
        <TermBreakdown
          title="접근 장치는 대안값의 서로 다른 항을 바꿉니다"
          items={[
            { term: "소송구조·법률구조", description: "일부 비용이나 법률 지원의 장벽을 낮춰 C를 줄일 수 있습니다.", example: "대한민국 민사소송법 제128조는 자금 능력이 부족하고 패소가 명백하지 않은 경우의 소송구조를 정합니다.", boundary: "승소를 보장하거나 시간·증거·집행 문제를 전부 없애는 제도는 아닙니다." },
            { term: "소액·간이 절차와 조정", description: "절차 시간과 복잡성을 줄이거나 정보 차이를 좁혀 d와 C를 바꿀 수 있습니다.", example: "중립자가 쟁점과 자료를 정리하면 서로의 전망 차이가 줄어 합의 범위가 열릴 수 있습니다.", boundary: "권력 차이가 크거나 긴급한 보호·공익 판결이 필요하면 조정만으로 충분하지 않을 수 있습니다." },
            { term: "청구의 결합", description: "각각 너무 작아 제기하기 어려운 여러 청구를 모아 고정비용을 나눌 수 있습니다.", example: "반복되는 소액 피해를 함께 다루면 개별 청구의 음수 대안값이 달라질 수 있습니다.", boundary: "집단 절차의 허용 범위와 대표성·분배 방식은 법제마다 다릅니다." },
            { term: "집행 가능성", description: "승소 뒤 실제로 받을 수 있는지가 낮으면 기대 판결액 자체가 줄어듭니다.", example: "상대에게 재산이 없거나 해외 집행이 어려우면 높은 승소 전망만으로는 강한 대안이 되지 않습니다.", boundary: "판결을 얻는 단계와 판결을 집행하는 단계는 같은 문제가 아닙니다." },
          ]}
        />
        <CitationBlock source="대한민국 민사소송법 제1조·제128조 · 국가법령정보센터" citeKey={4} href="https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1009251225">
          제1조는 법원이 절차를 공정·신속·경제적으로 진행하도록 노력해야 한다고
          정합니다. 제128조는 소송비용을 지출할 자금능력이 부족한 사람에 대한
          소송구조를 두되, 패소할 것이 분명한 경우를 제외합니다. 따라서 비용 장벽을
          낮추는 제도는 존재하지만 모든 사건의 모든 접근 비용을 없애는 장치는 아닙니다.
        </CitationBlock>
        <CitationBlock source="European Court of Human Rights · Guide on Article 6, civil limb (2025-08-31 갱신)" citeKey={5} href="https://ks.echr.coe.int/documents/d/echr-ks/guide_art_6_eng-pdf">
          유럽인권재판소 공식 가이드는 법원에 접근할 권리를 공정한 재판의 한
          요소로 다룹니다. 동시에 그 권리가 절대적이지 않고, 제한은 정당한 목적과
          비례성을 가져야 한다고 정리합니다. 유럽인권협약 체계의 비교 자료이며
          대한민국 민사소송법의 직접 해석 근거로 제시한 것은 아닙니다.
        </CitationBlock>
      </section>

      <section id="procedure" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          사적 합의, 법원 조정, 판결은 끝나는 방식과 효력이 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            M과 V가 전화로 600만원을 주고받기로 한 사적 합의, 법원의 조정조서,
            법원이 책임과 금액을 정한 판결을 모두 “합의로 끝났다”라고 뭉개면 안
            됩니다. 누가 결론을 정했는지, 기록과 집행의 근거가 무엇인지가 다릅니다.
          </p>
        </div>
        <TermBreakdown
          title="분쟁이 끝나는 세 경로"
          items={[
            { term: "사적 합의", description: "M과 V가 스스로 조건을 정하는 계약입니다.", example: "600만원 지급, 비밀유지, 향후 청구 포기를 함께 약속할 수 있습니다.", boundary: "위반 시 바로 강제집행할 수 있는지는 문서 형식과 법제에 따라 달라 별도 확인이 필요합니다." },
            { term: "법원 조정", description: "중립적 절차 안에서 당사자가 합의하고 조서에 남기는 경로입니다.", example: "대한민국 민사조정법 제28조·제29조의 조정은 합의사항을 조서에 적어 성립하고 재판상 화해와 같은 효력을 가집니다.", boundary: "모든 민간 조정이나 온라인 합의가 자동으로 같은 효력을 갖는다는 뜻은 아닙니다." },
            { term: "판결", description: "합의가 없을 때 법원이 증거와 법을 적용해 결론을 정합니다.", example: "V의 계약 위반, 인과관계와 손해액을 법원이 판단합니다.", boundary: "판결의 선례 효과, 공개 범위, 항소와 집행 방식은 관할과 심급에 따라 다릅니다." },
          ]}
        />
        <CitationBlock source="대한민국 민사조정법 제28조·제29조 · 국가법령정보센터" citeKey={6} href="https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=91594">
          제28조는 당사자 사이에 합의된 사항을 조서에 적어 조정이 성립한다고 하고,
          제29조는 그 조정에 재판상 화해와 같은 효력을 부여합니다. 이 조문은 법원
          조정의 효과에 관한 것이므로 모든 사적 합의의 효력을 설명하는 조문으로
          넓혀 읽으면 안 됩니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          이제 합의율보다 대안값이 어떻게 만들어졌는지를 물어야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            M과 V가 600만원에 합의했다면 계산은 “범위 안이었다”까지만 설명합니다.
            왜 456만원이 아니라 600만원인지, M이 충분한 정보를 가졌는지, 포기한
            권리를 이해했는지, V가 반복 당사자로서 자료와 시간을 더 많이 가졌는지는
            따로 살펴야 합니다.
          </p>
          <p className="leading-7">
            반대로 판결이 나왔다고 해서 협상이 실패했다고만 볼 수도 없습니다.
            공익적 기준을 만들거나, 정보 차이를 해소하거나, 한쪽이 감당할 수 없는
            압박을 막으려면 판결이 필요할 수 있습니다. 좋은 제도는 합의를 최대화하는
            제도가 아니라, 당사자가 권리를 실제 대안으로 삼고 필요한 사건은 판단받을
            수 있게 하는 제도입니다.
          </p>
          <ProgressiveDetail title="이 글의 식으로 예측한 뒤 반드시 확인할 질문" preview="범위가 열렸다는 계산은 시작일 뿐입니다. 계산 밖의 권력과 절차를 확인해야 합니다.">
            <ul className="space-y-2 leading-7">
              <li>M과 V가 같은 증거에 접근했고 계약조항을 이해했습니까?</li>
              <li>소송부담 C에 넣지 못한 생계·언어·돌봄·평판 비용이 있습니까?</li>
              <li>판결을 받아도 실제로 회수할 수 있습니까?</li>
              <li>금지명령·사과·공개 기준처럼 돈으로 바꾸기 어려운 목적이 있습니까?</li>
              <li>V처럼 같은 유형을 반복해서 상대하는 쪽이 미래 사건까지 계산합니까?</li>
              <li>합의가 자유로운 선택인지, 법원 접근이 막혀 남은 유일한 선택인지 구별했습니까?</li>
            </ul>
          </ProgressiveDetail>
          <p className="leading-7">
            앞 글인{" "}
            <Link to="/law/criminal-law/procedure-and-proof">형사 절차와 증명</Link>
            이 재판 안에서 오류 위험을 어떻게 나누는지 물었다면, 이 글은 그 재판을
            실제 대안으로 사용할 수 있는지를 묻습니다. 법 시리즈를 처음부터 다시
            읽으려면{" "}
            <Link to="/law/legal-system/what-makes-law-law">무엇이 이 문장을 법으로 만듭니까</Link>
            로 돌아가면 됩니다.
          </p>
        </div>
      </section>
    </div>
  );
}
