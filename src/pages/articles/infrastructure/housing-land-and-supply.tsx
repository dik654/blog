import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 집값은 건축비만이 아니라 토지 권리와 지을 수 있는 양에 좌우된다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function HousingLandAndSupplyArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 집을 지어도 땅의 권리가 다르면 가격이 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">새 집의 판매가가 10억이고 공사·금융·허가 및 정상 이익에 7억이 필요하다면 땅에 남길 수 있는 금액은 3억입니다. 허용 세대 수를 늘리면 땅의 활용 가치가 올라갈 수 있지만 도로·학교·상하수도 비용도 늘 수 있습니다.</p>
          <p className="leading-7">집이 부족한 도시에서 가격만 보면 수요 급증과 공급의 긴 시간을 구별하기 어렵습니다.</p>
        </div>
        <FlowRail
          title="(가정) 새 집 판매가 10억, 공사·금융·허가 7억, 토지 잔여 3억"
          steps={[
            { actor: "가구", movement: "주거비를 내고 위치와 공간을 선택합니다.", receives: "주거 서비스와 통근 조건" },
            { actor: "개발자·건설사", movement: "공사·금융·허가 비용 7억을 부담합니다.", receives: "판매가 10억의 청구권" },
            { actor: "토지 소유자·지자체", movement: "토지 권리와 허가·기반 시설을 제공합니다.", receives: "잔여 땅값과 세입" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">판매가 10억 원에서 7억 원을 뺀 토지 잔여 3억 원을 얻었습니다. 이 숫자가 달라지는 허가 시간을 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">허가부터 입주까지의 시간과 권리 사슬을 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">토지 권리를 모으고 용도를 확인한 뒤 인허가, 기반 시설 연결, 금융 조달, 시공과 분양 또는 임대가 이어집니다. 어느 단계가 막히는지에 따라 새 주택이 시장에 나오는 시점이 달라집니다.</p>
          <p className="leading-7">임차인의 월세는 주택 서비스 가격이고 소유자의 매매가는 미래 임대료와 비용·위험에 대한 평가입니다. 두 가격은 연결되지만 금리나 세금 때문에 단기에 다르게 움직일 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">허가와 기반 시설의 시간이 수요 변화보다 느릴 수 있습니다. 도시마다 다른 토지권리의 규칙을 대조합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">나라별 소유권과 계획 제도가 공급을 다르게 묶습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">UN-Habitat는 적정 가격 주택에 토지 접근과 토지 제도의 역할을 강조합니다. 한국의 용도지역, 영국의 계획 허가, 미국의 지방 조닝, 비공식 거주지가 큰 도시의 권리 문서는 서로 다릅니다.</p>
          <p className="leading-7">국가 평균 집값 대신 도시의 일자리 위치, 신규 허가와 완공, 공실, 임대 보호, 교통 접근, 소득 대비 월세를 같이 비교합니다.</p>
        </div>
        <SourceApplication source="UN-Habitat · The Role of Land in Achieving Adequate and Affordable Housing" excerpt="legal and institutional frameworks by which land and housing are managed" application="판매가 10억에서 공사·금융·허가·정상 이익 7억을 빼면 토지 잔여는 3억입니다. 법이 허용하는 세대 수와 권리가 바뀌면 이 잔여도 다시 계산합니다." />
        <CitationBlock source="UN-Habitat The Role of Land in Achieving Adequate and Affordable Housing" citeKey={1} href="https://unhabitat.org/the-role-of-land-in-achieving-adequate-and-affordable-housing">토지 접근과 제도가 적정 가격 주택 공급에 미치는 역할을 다룹니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">UN-Habitat의 토지 제도 설명에 같은 3억 원 사례를 대입했습니다. 새 집이 실제 필요한 가구에 닿는지는 남습니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공급 증가 한 가지로 모든 주거 문제를 설명할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">당장 이사할 돈이 없는 가구나 소득이 낮은 가구에는 새 고가 주택이 바로 대안이 아닐 수 있습니다. 반대로 가격 통제만으로 빈 땅의 기반 시설과 건설 자금을 만들 수는 없습니다.</p>
          <p className="leading-7">정책의 효과는 공급량뿐 아니라 누가 입주하고 누가 땅값 상승을 얻으며 기존 세입자가 어디로 가는지 확인해야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "판매가 10억, 공사·금융·허가와 이익 7억이면 토지에 남는 금액은 얼마일까요? (답: 2절)",
          "같은 새 집 수가 늘어도 저소득층의 주거 문제가 그대로일 수 있는 이유는 무엇일까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
