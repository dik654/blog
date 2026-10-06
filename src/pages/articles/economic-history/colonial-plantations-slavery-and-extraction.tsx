import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function ColonialPlantationsSlaveryAndExtractionArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 수출액이 늘었다는 말과 주민이 더 잘 살았다는 말은 다릅니다" bridge="교역량과 생활의 개선을 나눴습니다. 상품 한 단위 뒤의 토지·노동·권력을 연결합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">설탕과 면화 수출이 늘면 항구의 장부와 제국의 세수는 커집니다. 그러나 생산지가 강제로 빼앗긴 땅이고 노동자가 소유물로 취급됐다면, 높은 수출액은 그 사회 구성원의 번영을 뜻하지 않습니다.</p>
          <p className="leading-8">16세기 이후 대서양 상품망은 유럽의 금융과 제조, 아프리카의 강제 이주, 아메리카의 토지와 플랜테이션을 연결했습니다. 이 글은 설명용 설탕 매출 100단위를 따라가며 시장 장부에 들어간 비용과 장부 밖으로 밀려난 권리·생명 손실을 함께 봅니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 토지·노동·상품·금융·권력의 흐름을 한 장부에 놓습니다" bridge="한 시장 가격이 서로 다른 다섯 관계를 숨길 수 있음을 확인했습니다. 100단위 매출을 나눠 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">식민 국가는 토지 권리와 무역 규칙을 바꾸고 군사·사법 권력으로 이를 집행합니다. 상인과 금융업자는 배·보험·신용을 제공합니다. 플랜테이션은 강제 노동으로 상품을 만들고 제국 시장에 판매합니다.</p>
          <p className="leading-8">흐름을 돈만으로 그리면 폭력이 생산 조건이었다는 사실이 지워집니다. 누가 이동할 자유, 가족 관계, 몸의 안전, 생산물에 대한 권리를 잃었는지 별도 칸에 적어야 수익의 재원이 보입니다.</p>
        </div>
        <FlowRail title="식민 상품 한 단위가 만들어지는 경로" steps={[
          { actor: "식민 권력과 토지", movement: "토지·무역·노동 규칙을 정하고 강제합니다.", receives: "세금과 통제" },
          { actor: "플랜테이션과 강제 노동", movement: "설탕·면화 같은 상품을 생산합니다.", receives: "생존 배급과 폭력적 통제" },
          { actor: "상인·금융·제조", movement: "운송·보험·가공·판매로 시장을 연결합니다.", receives: "수수료·이자·이윤" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 사탕 100단위의 판매액을 네 몫으로 나눕니다" bridge="시장 장부에 보이는 100과 보이지 않는 손실을 분리했습니다. 가격이 비용을 모두 담는다는 가정을 깨 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">설탕 판매액이 100이라고 합시다. 운송·정제·보험에 35, 도구와 최소한의 식량에 10, 제국 세금에 10이 들고 소유주의 잔여가 45라고 놓습니다. 실제 역사 평균이 아니라 장부 경계를 보기 위한 가정입니다.</p>
          <p className="leading-8">이 장부에서 노예로 만든 사람의 임금 청구는 0입니다. 이동의 자유, 가족 분리, 폭력, 조기 사망도 비용 항목으로 잡히지 않습니다. 소유주의 45는 생산성이 높아서만 생긴 잔여가 아니라 어떤 청구권을 인정하지 않았는지에 따라 커졌습니다.</p>
        </div>
        <NumericPath title="판매액 100에 잡히지 않은 비용" steps={[
          { label: "설탕 판매", value: "100", detail: "시장에 기록된 금액" },
          { label: "기록된 비용·세금", value: "55", detail: "운송 35 + 도구·식량 10 + 세금 10" },
          { label: "소유주 잔여", value: "45", detail: "무임금 강제 노동과 권리 손실은 별도" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 시장 가격에 잡힌 비용과 강제로 떠넘긴 손실을 구분합니다" bridge="높은 이윤이 누구의 비용을 빼고 계산됐는지 드러냈습니다. 강제력이 생산 방식의 일부였던 이유를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">회계는 약속된 지급을 잘 기록하지만 법이 사람을 재산으로 취급하면 그 사람의 권리 손실은 소유주의 채무로 나타나지 않습니다. 그래서 역사적 이윤율을 읽을 때 당시 장부의 정확성과 장부가 인정한 권리의 범위를 함께 봐야 합니다.</p>
          <p className="leading-8">시장에 가격이 있다는 사실은 거래가 자발적이었다는 증거가 아닙니다. 토지 몰수, 인두세, 통행 제한, 폭력은 사람들이 특정 작물과 노동에 들어가게 만들 수 있습니다. 가격과 강제력은 서로 반대되는 설명이 아니라 같은 생산 체제 안에서 함께 작동합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 강제력은 싼 원료와 높은 이윤을 가능하게 한 생산 조건이었습니다" bridge="강제를 시장 바깥의 사건이 아니라 비용 구조 안의 힘으로 봤습니다. 각 제도에 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">노동자가 떠날 수 있고 임금을 협상할 수 있다면 소유주는 더 높은 비용과 안전 조건을 감당해야 합니다. 떠날 자유를 막으면 장부의 임금은 낮아지고 소유주의 잔여는 커집니다. 폭력의 위협이 비용표를 바꾼 것입니다.</p>
          <p className="leading-8">제국의 독점 무역과 보호 관세도 판매처와 가격을 정했습니다. 금융과 보험은 먼 거래의 위험을 나눴지만 노예로 만든 사람에게는 위험을 줄이는 계약 당사자의 지위를 주지 않았습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 플랜테이션·노예제·수탈·상품망에 이름을 붙입니다" bridge="생산 조직, 법적 지위, 가치 이전, 연결망을 분리했습니다. 100단위가 대서양 양쪽에 남긴 결과를 추적합니다.">
        <TermBreakdown title="식민 상품망을 읽는 네 이름" items={[
          { term: "플랜테이션", description: "넓은 토지에서 수출용 작물을 대규모로 생산하는 농업 조직입니다.", example: "설탕·면화·커피를 제국 시장에 보냅니다.", boundary: "모든 대규모 농장이 같은 노동 제도와 정치 구조를 가진 것은 아닙니다." },
          { term: "노예제", description: "사람을 타인의 재산과 강제 노동 대상으로 법적·사회적으로 지배하는 제도입니다.", example: "이동·가족·노동 거부의 권리를 빼앗습니다.", boundary: "낮은 임금 일반과 같지 않으며 시대·지역별 법적 형태가 다릅니다." },
          { term: "식민 수탈", description: "정치적 지배를 이용해 토지·노동·세금·교역 이익을 지배 중심으로 옮기는 과정입니다.", example: "현지 생산물을 독점 가격과 세금으로 이전합니다.", boundary: "모든 식민 지출과 기반 시설을 같은 방식의 이전으로 셀 수는 없습니다." },
          { term: "세계 상품망", description: "원료 생산부터 운송·가공·금융·판매까지 여러 지역의 조직을 잇는 관계입니다.", example: "사탕 한 봉지가 플랜테이션·배·정제소·상점을 잇습니다.", boundary: "연결됐다는 사실만으로 가치와 권력이 공평하게 나뉘지 않습니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 100단위 매출이 대서양 양쪽에 다르게 남는 길을 추적합니다" bridge="판매액이 금융·산업 투자와 강제 노동의 손실로 동시에 이어지는 경로를 봤습니다. 항해 기록의 자료 범위를 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">판매액 100 가운데 35는 운송과 보험, 정제를 맡은 조직의 수입이 됩니다. 제국 재정은 세금 10을 받고 소유주는 잔여 45를 다시 투자할 수 있습니다. 같은 거래가 여러 지역의 자본 축적을 연결합니다.</p>
          <p className="leading-8">반대편에는 무임금 노동, 인구 손실, 토지 집중, 한두 수출품 의존이 남습니다. 이 결과는 판매액 합계에서 자동으로 빠지지 않습니다. 누가 어떤 자산과 기술을 쌓았고 누가 위험과 단일 작물 의존을 떠안았는지 따로 추적해야 합니다.</p>
          <p className="leading-8">한 상품의 이익이 산업화 전체를 혼자 일으켰다고 말하려면 규모와 대체 경로를 계산해야 합니다. 다만 강제 노동에서 나온 부가 특정 지역의 제조·부동산·금융으로 들어간 경로를 지운 채 산업화를 순수한 국내 혁신으로만 설명할 수도 없습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 항해 기록이 보여 주는 수와 보여 주지 못하는 삶을 나눕니다" bridge="선박 단위 기록과 전체 추정치의 차이를 확인했습니다. 장기 영향 연구와 대조합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">SlaveVoyages는 선박이 출발하고 도착한 항구, 항해 연도, 배에 태워진 사람과 도착한 사람의 수를 모아 대서양 노예 무역을 복원합니다. 기록이 없는 항해와 불완전한 위치는 별도의 추정 자료와 방법 문서로 다룹니다.</p>
          <p className="leading-8">이 자료는 무역의 규모와 이동 경로, 항해 중 사망을 세는 데 강합니다. 그러나 노예로 만든 사람 각자의 삶은 모두 담지 못합니다. 항구 장부가 거래 주체의 기록인 만큼 당사자의 구술과 재판 기록, 편지, 발굴 자료를 함께 읽어야 합니다.</p>
        </div>
        <SourceApplication source="SlaveVoyages · Database methodology" excerpt="inferring information about both places of trade and numbers" application="기록된 항해와 추정한 전체 규모를 구분하면 누락을 숨기지 않으면서 경로와 수량을 비교할 수 있습니다." />
        <CitationBlock source="SlaveVoyages, Trans-Atlantic Slave Trade Database" citeKey={1} href="https://www.slavevoyages.org/blog/the-transatlantic-slave-trade-database/163">자료 파일과 코드북, 전체 규모를 추정하는 보완 자료의 역할을 설명합니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 노예 무역과 식민 상품 특화의 긴 흔적을 대조합니다" bridge="현재의 차이를 과거 하나로 자동 설명하지 않으면서 장기 경로를 검토했습니다. 지역 일반화의 한계를 정리합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">Nunn과 Wantchekon은 노예 습격 노출과 오늘날의 낮은 신뢰 사이 관계를 개인 조사와 역사 자료로 분석합니다. 여러 식별 방법을 쓰지만, 긴 시간의 결과에는 식민 통치·국경·전쟁·정책이 함께 들어가므로 단일 운명으로 읽어서는 안 됩니다.</p>
          <p className="leading-8">Frankema·Williamson·Woltjer는 19세기 아프리카의 상품 가격 상승과 수출 확대가 식민 쟁탈의 경제적 조건을 바꾸고, 식민 통치 뒤 1차 상품 특화가 깊어졌다고 분석합니다. 수출 성장과 생산 구조의 취약성이 동시에 생길 수 있음을 보여 줍니다.</p>
        </div>
        <CitationBlock source="Nathan Nunn & Leonard Wantchekon, AER 2011" citeKey={2} href="https://www.aeaweb.org/articles?id=10.1257/aer.101.7.3221">노예 무역 노출과 신뢰의 장기 관계를 자료와 식별 전략으로 검토합니다.</CitationBlock>
        <CitationBlock source="Frankema, Williamson & Woltjer, NBER 21213" citeKey={3} href="https://www.nber.org/papers/w21213">19세기 아프리카 상품 교역과 식민 통치 전후의 수출 특화를 수량 자료로 분석합니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 대서양 한 모형을 모든 제국과 강제 노동에 그대로 씌우지 않습니다" bridge="시장 장부와 권리 장부를 함께 읽는 기준을 세웠습니다. 아래 질문으로 100단위 매출을 다시 해석합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">스페인·포르투갈·영국·프랑스·네덜란드 제국의 법과 상품, 시기, 현지 정치가 달랐습니다. 인도양 노예 무역, 아시아의 강제 재배, 아프리카의 조세 노동도 대서양 플랜테이션과 같은 도식으로만 설명할 수 없습니다.</p>
          <p className="leading-8">노예로 만든 사람과 식민지 주민은 수동적인 숫자가 아니었습니다. 도주·반란·협상·자급 생산·지식 보존으로 체제를 바꿨습니다. 경제사는 지배자가 남긴 장부의 계산을 복원하면서 그 장부가 지운 행위자와 권리를 다시 넣어야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "설탕 매출 100에서 소유주 잔여 45가 커진 이유를 생산성만으로 설명할 수 없는 이유는 무엇인가요? (답: 3·4절)",
          "항해 데이터의 기록값과 전체 무역 추정치를 구분해야 하는 이유는 무엇인가요? (답: 8절)",
          "수출 증가와 생산지 주민의 생활 개선이 서로 다른 주장이 되는 경로는 무엇인가요? (답: 7·9절)",
        ]} />
      </LessonSection>
    </div>
  );
}
