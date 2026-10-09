import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function AgrarianSurplusAndStateArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 남은 곡물보다 누가 세고 나누는지가 중요합니다" bridge="잉여의 양만 세지 않고 저장·기록·배분 권한을 함께 볼 질문을 세웠습니다. 전체 고리를 먼저 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">수확 뒤 곡물이 남았다고 곧바로 국가가 생기지는 않습니다. 남은 곡물을 한곳에 모을 수 있어야 하고, 썩기 전에 보관해야 하며, 누가 얼마를 냈고 받을지를 기록하고, 그 기록을 따르게 할 권한이 있어야 합니다.</p>
          <p className="leading-8">이 글은 기원전 3100~2900년 무렵 남부 메소포타미아의 곡물 장부를 출발점으로 삼습니다. 다만 한 점의 점토판에서 국가 전체를 복원하지 않습니다. 1200자루라는 가정 사례로 물건과 장부와 권력이 만나는 조건을 본 뒤, 원 사료가 실제로 허용하는 주장까지 돌아옵니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 수확·저장·기록·배분이 하나의 고리를 이룹니다" bridge="곡물이 창고로 들어와 권리와 의무로 나가는 큰 흐름을 그렸습니다. 작은 마을 장부에 숫자를 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">밭에서 난 곡물 일부를 여러 가구가 냅니다. 창고 관리자는 종류와 양을 확인해 보관합니다. 기록하는 사람은 들어온 양과 나간 양을 표시에 연결합니다. 배분 권한을 가진 조직은 종자, 일하는 사람의 몫, 비상식량, 제의나 교역 몫을 정합니다.</p>
          <p className="leading-8">이 중 하나가 빠지면 다른 것도 흔들립니다. 저장이 불가능하면 긴 시간의 약속을 만들기 어렵고, 측정 단위가 다르면 장부의 합계를 믿기 어렵습니다. 기록이 있어도 그것을 고치거나 집행하는 권한이 누구에게 있는지 모르면 청구권이 안정되지 않습니다.</p>
        </div>
        <FlowRail title="곡물이 장부와 권한을 거쳐 다시 나가는 길" steps={[
          { actor: "생산한 가구", movement: "수확 일부를 정한 단위로 냅니다.", receives: "미래 배분에 대한 기대" },
          { actor: "창고와 기록자", movement: "종류·양·들어온 곳·나갈 곳을 맞춥니다.", receives: "재고와 장부" },
          { actor: "배분 조직", movement: "종자·급여·비상 몫과 받을 사람을 정합니다.", receives: "사람과 자원을 움직일 권한" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 1200자루를 모아 다음 해까지 나눠 봅니다" bridge="1200자루의 물리 재고와 각 사람의 몫을 고정했습니다. 창고와 장부를 다른 대상으로 놓습니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">100가구가 각각 곡물 12자루를 공동 창고에 냈다고 가정하면 들어온 양은 1200자루입니다. 다음 철의 종자로 100자루, 가뭄 대비 몫으로 50자루, 건축·운송·경비에 참여한 사람의 식량으로 1000자루를 배정합니다. 장부상 남는 양은 50자루입니다.</p>
          <p className="leading-8">실제 창고를 세어 1180자루뿐이라면 20자루 차이가 납니다. 썩었는지, 측정 단위가 달랐는지, 기록을 잘못 썼는지, 누군가 가져갔는지 알 수 없습니다. 장부는 차이를 보여 주지만 원인을 혼자 말해 주지 않습니다.</p>
        </div>
        <NumericPath title="1200자루를 약속별로 나눈 가정 장부" steps={[
          { label: "들어온 곡물", value: "1200", detail: "100가구 × 12자루" },
          { label: "배정", value: "1150", detail: "종자 100 + 비상 50 + 지급 1000" },
          { label: "장부 잔량", value: "50", detail: "실물 30이면 차이 20" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 창고 안의 양과 장부 위의 청구권을 나눕니다" bridge="실물 재고, 기록된 몫, 그것을 바꿀 권한을 세 층으로 나눴습니다. 규모가 커질 때 왜 장치가 필요한지 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">창고에 있는 1180자루는 물리적인 재고입니다. 장부의 1200자루는 과거 거래를 기록한 숫자입니다. 종자 100자루를 받을 권리와 노동 대가 1000자루를 받을 권리는 미래 배분에 대한 사회적 약속입니다. 세 숫자가 같아야 하지만 같은 종류의 대상은 아닙니다.</p>
          <p className="leading-8">누가 장부를 읽을 수 있고, 누가 새 항목을 쓰며, 차이가 생겼을 때 누구의 몫부터 줄이는지도 권력의 문제입니다. 곡물이 남았다는 자연 조건만으로 이 결정 규칙은 나오지 않습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 시간이 길어지고 사람이 많아지면 기억만으로 버티지 못합니다" bridge="기록이 필요한 규모와 시간 조건을 확인했습니다. 경제사에서 쓸 네 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">열 가구가 오늘 모아 저녁에 나누는 일은 서로의 기억으로 처리할 수 있습니다. 100가구가 수확기에 낸 것을 몇 달 뒤 여러 직무에 지급하면 기여자와 수령자가 다르고 시점도 벌어집니다. 같은 사람이 계속 자리에 있지 않아도 약속을 이어 줄 표시가 필요합니다.</p>
          <p className="leading-8">기록은 거래 비용을 줄이는 동시에 감시 범위를 넓힙니다. 누가 미납했는지, 어떤 노동에 얼마를 줄지, 창고 차이를 누구 책임으로 돌릴지 비교할 수 있기 때문입니다. 편리한 계산 장치가 곧 통제 장치가 되는 지점입니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 잉여·공납·회계·배분 권한에 이름을 붙입니다" bridge="남은 생산물, 강제 가능성이 있는 이전, 장부, 최종 결정 권한을 구분했습니다. 1200자루가 권리와 의무로 바뀌는 길을 따라갑니다.">
        <TermBreakdown title="곡물 장부를 읽는 네 이름" items={[
          { term: "잉여", description: "현재 소비와 다음 생산에 필요한 몫을 뺀 뒤 다른 목적에 돌릴 수 있는 생산물입니다.", example: "가정한 배정 뒤 남는 50자루입니다.", boundary: "무엇을 필요량으로 볼지에 따라 크기가 달라집니다." },
          { term: "공납", description: "가구나 지역이 지배 조직·사원·궁정 등에 정기적으로 내는 생산물이나 노동입니다.", example: "100가구가 각각 12자루를 내는 규칙입니다.", boundary: "자발적 공동 적립과 강제로 걷는 몫을 같은 말로 뭉개지 않습니다." },
          { term: "회계", description: "들어오고 나간 물건과 채권·의무를 일정한 분류와 수로 기록하는 절차입니다.", example: "1200에서 1150을 빼 장부 잔량 50을 냅니다.", boundary: "장부가 실제 물건과 맞는지는 실사로 확인해야 합니다." },
          { term: "배분 권한", description: "누가 어떤 기준으로 저장물을 받을지 정하고 그 결정을 집행하는 힘입니다.", example: "종자 100과 노동 대가 1000의 우선순위를 정합니다.", boundary: "효율적인 배분과 정당한 배분은 별도의 판단입니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 같은 1200자루가 권리와 의무로 바뀌는 길을 추적합니다" bridge="한 번의 수확이 측정·기록·배분·감사로 이어지는 경로를 끝까지 돌렸습니다. 실제 점토판의 허용 범위를 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">수확일에 각 가구의 12자루를 같은 용기로 잽니다. 기록자는 가구별 납부와 창고 총량 1200을 연결합니다. 배분 결정 뒤에는 종자 100, 비상 50, 지급 1000이라는 항목이 생깁니다. 이 숫자가 있어야 다음 관리자가 몇 달 뒤에도 약속을 이어 받을 수 있습니다.</p>
          <p className="leading-8">실사 결과가 1180이면 장부 잔량 50이 아니라 실물 잔량 30입니다. 20의 차이를 조사하면서 보관 손실, 측정 오차, 기록 오류, 승인되지 않은 반출이라는 서로 다른 원인을 가릅니다. 각 원인은 고칠 장치도 다릅니다.</p>
          <p className="leading-8">이 절차가 반복되면 곡물을 낼 사람, 받을 사람, 측정 단위, 책임자의 역할이 표준화될 수 있습니다. 그러나 표준화가 언제 강제력 있는 국가 제도로 바뀌는지는 군사·종교·토지·친족 관계와 다른 사료를 함께 봐야 합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 기원전 3100~2900년 무렵의 곡물 장부를 읽습니다" bridge="실제 유물에서 곡물·수 표시는 확인했지만 동사와 제도 전체는 읽히지 않는다는 경계를 잡았습니다. 여러 장부의 형식과 대조합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">메트로폴리탄 미술관의 젬데트 나스르기 점토판은 원형의 수 표시와 곡물 그림 문자를 담고 있습니다. 미술관은 보리와 에머밀의 인도와 배분을 기록했을 가능성이 높다고 설명하면서, 초기 문서에 동사가 없어 확실한 해석이 어렵다고 밝힙니다.</p>
          <p className="leading-8">따라서 이 유물은 초기 문자가 경제 정보를 저장하는 데 쓰였다는 강한 증거지만, 100가구가 12자루씩 냈다거나 특정 왕이 세금을 걷었다는 증거는 아닙니다. 이 글의 1200자루 사례는 유물의 실제 번역이 아니라 장부가 맡는 기능을 보여 주는 가정입니다.</p>
        </div>
        <SourceApplication source="The Met · proto-cuneiform grain account" excerpt="deliveries and distributions of grain" application="들어온 곡물과 나간 곡물을 구분하는 장부라는 해석은 가능하지만, 동사가 없으므로 정확한 거래와 행위자를 확정할 수는 없습니다." />
        <CitationBlock source="The Metropolitan Museum of Art, accession 1988.433.2" citeKey={1} href="https://www.metmuseum.org/art/collection/search/327384">기원전 3100~2900년 무렵으로 분류된 행정 장부의 사진, 재료, 수 표시와 해석 경계를 확인했습니다. 접근번호는 Met Collection API(objectID 327384)의 accessionNumber로 대조했습니다(확인일 2026-10-09).</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 장부는 국가의 존재를 혼자 증명하지 못합니다" bridge="여러 점토판의 계산 형식은 행정 능력을 보여 주지만 권력의 정당성과 범위는 별도 증거가 필요함을 확인했습니다. 단선적인 인과를 정리합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">Cuneiform Digital Library Initiative가 분석한 여러 원시 설형문자 장부는 앞면에 거래별 곡물 양을 적고 뒷면에 합계를 두는 관행을 보여 줍니다. 같은 논문이 다루는 에머밀 배급 장부(MSVO 3, 75)에서는 뒷면 한 칸이 1과 2/5 '바리그'(곡물 부피 단위)를 기준값으로 줍니다. 저자는 이 기준값으로 가중평균을 내면 장부에 적힌 다른 값들이 설명된다고 보고, 이 칸을 장부를 푸는 열쇠라고 부릅니다. 다만 같은 방식을 쓴 장부가 달리 확인되지 않아, 이 점토판은 정규 행정 문서가 아니라 비정규 서기 연습으로 분류됩니다.</p>
          <p className="leading-8">이 자료들은 측정 단위, 합계, 항목 분류, 기록자의 훈련이 있었다는 증거입니다. 그러나 기록 조직이 마을 공동체인지, 사원인지, 궁정인지, 얼마나 강제할 수 있었는지는 출토 맥락과 건축·인장·묘지·토지 자료를 함께 보아야 합니다. 출처를 알 수 없는 점토판은 비교 가치가 있어도 공간과 조직을 복원하는 힘이 약합니다.</p>
        </div>
        <SourceApplication source="CDLI · Unusual Accounting Practices" excerpt="listing ... a number of transactions" application="1200자루 총계만 있는 장부보다 가구별 12자루와 배분 항목을 함께 적은 장부가 차이 20의 위치를 더 잘 좁힙니다." />
        <CitationBlock source="Salvatore F. Monaco, Cuneiform Digital Library Journal 2005:1" citeKey={2} href="https://cdli.earth/articles/cdlj/2005-1">원시 설형문자의 곡물 거래·수 체계·합계 관행과 출처 불명 자료의 한계를 함께 확인했습니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 잉여가 자동으로 국가를 만든다는 한 줄 인과를 피합니다" bridge="잉여·저장·기록·권력의 관계를 필요조건과 충분조건으로 오해하지 않을 경계를 세웠습니다. 아래 질문으로 같은 장부를 다시 읽습니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">잉여는 전문 노동과 장기 사업을 먹여 살릴 여지를 줍니다. 동시에 이동이 어렵고 세기 쉬운 곡물은 걷고 저장하기 좋은 대상이 될 수 있습니다. 그러나 농업 잉여가 있는 모든 사회가 같은 국가를 만들지 않았고, 이동식 재산·목축·교역을 중심으로 다른 조직을 만든 곳도 있습니다.</p>
          <p className="leading-8">시간 순서는 인과를 자동으로 증명하지 않습니다. 농업, 도시화, 문자, 관료 조직이 가까운 시기에 함께 커졌더라도 어느 하나가 혼자 나머지를 만들었다고 결론내리려면 비교 사례와 더 세밀한 연대가 필요합니다. 이 글이 확정하는 것은 물건을 오래 모아 나누는 문제에서 측정·기록·권한이 함께 필요하다는 구조입니다.</p>
        </div>
        <ReviewPrompts questions={[
          "장부상 50자루인데 실물은 30자루일 때 장부만으로 확정할 수 없는 원인은 무엇인가요? (답: 7절)",
          "메트 점토판에서 확인할 수 있는 것과 확인할 수 없는 제도는 각각 무엇인가요? (답: 8절)",
          "곡물 잉여가 국가의 충분조건이라고 말할 수 없는 이유는 무엇인가요? (답: 10절)",
        ]} />
      </LessonSection>
    </div>
  );
}
