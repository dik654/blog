import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function IndustrialRevolutionWagesAndEnergyArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 발명 목록보다 기계를 살 이유와 그 결과를 봅니다" bridge="기술 이름 대신 가격과 선택에서 출발했습니다. 기업의 결정이 생활로 이어지는 전체 고리를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">증기기관과 방적기를 나열하면 무엇이 새로 나왔는지는 알 수 있지만, 왜 어떤 지역과 시기에 그 기계를 실제로 샀는지는 알기 어렵습니다. 기계가 사람의 일을 줄여도 노동이 싸고 연료가 비싸면 기업에는 손해일 수 있습니다.</p>
          <p className="leading-8">이 글은 18세기 후반부터 19세기 전반 영국의 산업화를 임금과 에너지 가격, 투자, 생산성, 생활 수준의 순서로 읽습니다. 영국의 고임금·저에너지 가격 설명을 중요한 가설로 다루되, 제국과 교역, 기술 지식, 제도, 지역과 성별의 차이를 지우는 단일 원인으로 쓰지 않습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 가격·투자·생산성·생활 수준을 한 고리로 잇습니다" bridge="기업의 기계 선택과 노동자의 생활이 같은 속도로 움직이지 않는다는 큰 구조를 잡았습니다. 작은 비용표를 만듭니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">기업은 같은 양을 만들 때 노동비, 연료비, 기계 구입비와 고장 위험을 비교합니다. 기계를 선택하면 생산 방식과 필요한 기술이 바뀌고, 시간이 지나며 생산량과 생산성이 달라집니다. 그러나 늘어난 생산의 몫이 임금으로 가는지 이윤과 투자로 가는지는 별도 제도와 힘의 문제입니다.</p>
          <p className="leading-8">산업화는 공장 안의 기계만 바꾸지 않았습니다. 도시 주거, 노동 시간, 아동 노동, 식품 가격, 공기와 물의 질이 함께 바뀌었습니다. 평균 실질임금 하나는 이 경험을 전부 대신하지 못합니다.</p>
        </div>
        <FlowRail title="기계 선택에서 생활 변화까지" steps={[
          { actor: "가격과 시장", movement: "임금·석탄·자본·상품 수요가 기계의 절감액을 정합니다.", receives: "투자 유인" },
          { actor: "공장과 기술", movement: "사람·기계·에너지를 새 조합으로 바꿉니다.", receives: "생산량과 이윤" },
          { actor: "가구와 도시", movement: "임금·시간·물가·건강·가족 노동으로 결과를 겪습니다.", receives: "서로 다른 생활 수준" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 노동 10명과 석탄 기계 한 대의 비용을 비교합니다" bridge="같은 생산량을 만드는 두 방법의 문턱을 숫자로 고정했습니다. 기업 장부와 생활 장부를 따로 놓습니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">한 주의 생산을 노동자 10명이 맡고 1인당 주급이 10이면 노동비는 100이라고 합시다. 같은 생산을 기계 한 대와 노동자 4명이 만들 수 있고, 기계의 주당 상각·이자·수리비가 35, 석탄비가 15라면 총비용은 35+15+40=90입니다. 모두 설명용 가정입니다.</p>
          <p className="leading-8">임금이 6인 지역에서는 사람 10명의 비용이 60이고 기계 방식은 35+15+24=74입니다. 같은 기계도 첫 지역에서는 주당 10을 아끼지만 둘째 지역에서는 14가 더 듭니다. 발명 가능성과 채택 유인은 다른 질문입니다.</p>
        </div>
        <NumericPath title="같은 기계의 손익이 임금에 따라 뒤집힙니다" steps={[
          { label: "고임금 지역의 사람 방식", value: "100", detail: "10명 × 10" },
          { label: "고임금 지역의 기계 방식", value: "90", detail: "기계 35 + 석탄 15 + 노동 40" },
          { label: "저임금 지역의 기계 방식", value: "74", detail: "사람 방식 60보다 14 비쌈" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 기업의 선택과 노동자의 생활 장부를 분리합니다" bridge="기계가 수익성 있는가와 사람이 더 잘 사는가를 다른 장부로 두었습니다. 두 결과가 벌어지는 이유를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">기업 장부에는 주당 비용 100과 90의 차이가 보입니다. 노동자 장부에는 남은 4명의 임금, 일자리를 잃거나 다른 일을 찾은 6명의 소득, 노동 시간, 식품과 집세, 가족 구성원의 일, 사고와 오염이 들어갑니다.</p>
          <p className="leading-8">기계가 총생산을 늘려도 초기에는 이윤과 설비 투자가 먼저 늘 수 있습니다. 노동 수요가 새 직무에서 커지고 협상력이 바뀌어야 임금이 뒤따를 수 있습니다. 그래서 생산성 그래프와 생활 수준 그래프의 시점과 단위를 맞춰야 합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 생산이 늘어도 생활이 같은 속도로 좋아지지는 않습니다" bridge="평균 생산과 가구 경험 사이의 전달 장치를 확인했습니다. 가격·기술·임금의 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">노동자 한 명이 한 시간에 만드는 양이 늘면 장기적으로 더 많은 재화를 나눌 여지가 생깁니다. 그러나 누가 기계를 소유하고, 노동시장이 얼마나 팽팽하며, 노동자가 조직할 수 있는지, 식품과 주거비가 어떻게 움직이는지가 실제 몫을 정합니다.</p>
          <p className="leading-8">명목임금이 올라도 빵과 집세가 더 빨리 오르면 살 수 있는 양은 줄 수 있습니다. 남성 성인 한 명의 임금만 보면 여성과 아동의 노동으로 유지된 가구소득도 놓칩니다. 산업화의 생활 수준 논쟁이 한 숫자로 끝나지 않는 이유입니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 요소 가격·노동 절약 기술·실질임금에 이름을 붙입니다" bridge="기업이 마주한 상대 가격과 가구가 살 수 있는 양을 구분했습니다. 같은 기계가 두 지역에서 갈리는 문턱을 계산합니다.">
        <TermBreakdown title="산업화의 비용과 생활을 읽는 네 이름" items={[
          { term: "요소 가격", description: "생산에 쓰는 노동·에너지·자본·토지 한 단위의 값입니다.", example: "주급 10, 석탄 15, 기계 비용 35입니다.", boundary: "시장 가격은 이용 가능성·품질·권력까지 모두 말해 주지 않습니다." },
          { term: "노동 절약 기술", description: "같은 생산을 더 적은 노동 시간으로 하도록 바꾸는 방법입니다.", example: "10명 대신 기계와 4명이 생산합니다.", boundary: "전체 노동 수요가 반드시 줄어드는지는 상품 수요와 새 직무에 달려 있습니다." },
          { term: "생산성", description: "정해진 투입 한 단위가 만들어 내는 산출량입니다.", example: "노동자 한 명당 생산량이 늘어납니다.", boundary: "임금·복지·삶의 질과 같은 지표가 아닙니다." },
          { term: "실질임금", description: "받은 돈으로 실제 상품과 서비스를 얼마나 살 수 있는지 나타낸 임금입니다.", example: "명목임금을 생활비 지수로 나눠 비교합니다.", boundary: "가구 안의 분배, 노동 시간, 건강, 주거 환경은 따로 봐야 합니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 같은 기계가 두 지역에서 다른 선택이 되는 이유를 계산합니다" bridge="주급이 8.33을 넘을 때 기계가 유리해지는 손익 문턱을 구했습니다. 역사 연구의 가설과 대조합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">주급을 w라고 하면 사람 방식은 10w, 기계 방식은 35+15+4w=50+4w입니다. 기계가 더 싸려면 50+4w&lt;10w이므로 w&gt;50/6≈8.33입니다. 다른 조건이 같을 때 임금이 이 문턱을 넘으면 노동을 아끼는 투자의 유인이 생깁니다.</p>
          <p className="leading-8">석탄비가 15에서 35로 오르면 기계의 고정 비용은 70이 되고 문턱은 70/6≈11.67로 올라갑니다. 그래서 높은 임금만으로는 충분하지 않고 기계와 에너지가 상대적으로 싸야 합니다. 실제 기업은 생산량, 품질, 고장, 자금조달, 시장 확대도 함께 봅니다.</p>
          <p className="leading-8">기계가 주당 10을 아껴도 초기 구입비와 학습비가 크면 회수 기간이 길어집니다. 제도를 통한 특허 보호와 기술 인력, 신용, 넓은 시장은 이 계산의 시간과 위험을 바꿉니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 고임금·저에너지 가격 설명을 원 논문에서 확인합니다" bridge="영국의 상대 가격이 노동 절약 기술의 유인을 만들었다는 가설을 확인했습니다. 생산성과 임금이 실제로 같은 속도였는지 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">경제사가 로버트 앨런은 18세기 영국의 임금이 국제적으로 높고 에너지가 싸서, 자본과 에너지로 노동을 대신하는 기술이 수익성 있어졌다고 설명합니다. 그는 이 가격 구조 자체도 국제 교역의 성공, 중상주의와 제국의 결과였다고 연결합니다.</p>
          <p className="leading-8">우리 가정의 주급 8.33 문턱은 그 논문의 실측값이 아닙니다. 논문이 제시한 상대 가격의 작동 방식을 눈에 보이게 만든 작은 모델입니다. 실제 역사 주장은 도시별 임금, 연료 가격, 기계의 성능과 사용 범위를 자료로 확인해야 합니다.</p>
        </div>
        <SourceApplication source="Robert C. Allen · Economic History Review 64(2)" excerpt="wages were very high ... and energy was very cheap" application="주급 10과 석탄비 15인 가정에서는 기계 비용 90이 사람 비용 100보다 낮아지지만, 어느 값 하나만 바뀌어도 채택 문턱이 달라집니다." />
        <CitationBlock source="Robert C. Allen, Why the Industrial Revolution was British, 2011" citeKey={1} href="https://doi.org/10.1111/j.1468-0289.2010.00532.x">고임금·저에너지 가격, 노동 절약 발명, 교역·제국과 가격 구조의 연결을 제안하는 연구입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 1770~1840년 생산성과 임금의 다른 속도를 대조합니다" bridge="산업화 초기의 생산과 생활이 늦고 고르지 않게 변했다는 자료를 확인했습니다. 영국 경험을 일반화할 수 있는 범위를 정합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">앨런의 장기 자료에서는 1770을 100으로 놓았을 때 1840년 실질 국내총생산/노동자가 143.9, 실질 소비 임금이 127.1입니다. 70년 동안 생산성이 늘었지만 소비할 수 있는 임금은 더 느리게 움직였습니다. 같은 기간 안에서도 10년 단위 변화는 고르지 않았습니다.</p>
          <p className="leading-8">다른 생활 수준 연구는 1830~1840년대 농업 가구와 광업·제조 가구의 소득과 식단이 크게 달랐고, 산업 지역의 높은 가구소득 일부가 어린 자녀의 노동에서 왔음을 보여 줍니다. 평균 실질임금 상승을 모두의 같은 개선으로 읽을 수 없습니다.</p>
        </div>
        <SourceApplication source="Oxford Open Economics · Table 2" excerpt="1770 = 100" application="1840년 생산성 143.9와 소비 임금 127.1을 같은 기준년에서 비교하면 방향은 같아도 속도와 분배가 다름을 볼 수 있습니다." />
        <CitationBlock source="Robert C. Allen, Technical change, globalization, and the labour market, 2024" citeKey={2} href="https://academic.oup.com/ooec/article/3/Supplement_1/i178/7708096">1620년 이후 영국·미국의 생산성과 임금을 장기 구간으로 비교하며 1770~1840년의 느린 임금 성장을 다룹니다.</CitationBlock>
        <CitationBlock source="Sara Horrell & Jane Humphries, Past & Present 239, 2018" citeKey={3} href="https://academic.oup.com/past/article/239/1/71/4794719">19세기 가구 예산과 자서전을 함께 사용해 지역·성별·나이에 따른 식단과 생활 차이를 분석합니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 영국 한 사례를 산업화의 보편 법칙으로 만들지 않습니다" bridge="기술 채택의 가격 가설과 생활 결과의 지역 차이를 구분했습니다. 아래 질문으로 손익 문턱과 역사적 한계를 다시 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">산업화는 영국에서 한 번 완성되어 다른 곳으로 복사된 단일 과정이 아닙니다. 중국·인도·일본·유럽 대륙·아메리카의 에너지, 노동, 국가 재정, 제국 관계, 토지와 시장 조건이 달랐습니다. 어떤 지역은 기술을 바꾸어 채택했고 어떤 지역은 국가가 자본과 기반 시설을 집중했습니다.</p>
          <p className="leading-8">또한 값싼 면화와 원료, 노예제와 식민지 시장, 지식과 숙련, 특허와 신용을 가격표의 바깥으로 밀어내면 영국의 비용 우위가 어디서 왔는지 놓칩니다. 고임금·싼 에너지는 검증할 설명 축이지 모든 원인을 대신하는 결론이 아닙니다.</p>
        </div>
        <ReviewPrompts questions={[
          "주급 w일 때 기계 방식이 사람 10명보다 싸지는 문턱은 어떻게 구하나요? (답: 7절)",
          "1770~1840년의 생산성과 소비 임금 지수는 같은 방향 속에서도 무엇이 달랐나요? (답: 9절)",
          "고임금·싼 에너지 설명만으로 영국 산업화를 닫을 수 없는 이유는 무엇인가요? (답: 10절)",
        ]} />
      </LessonSection>
    </div>
  );
}
