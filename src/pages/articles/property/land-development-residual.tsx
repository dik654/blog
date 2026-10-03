import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 땅값은 허가 뒤 팔 수 있는 것에서 공사비와 시간을 거꾸로 뺀다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function LandDevelopmentResidualArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">100억 원짜리 건물을 짓는 땅이 100억 원일 수는 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">완공 뒤 팔 수 있는 금액이 100억 원이고 공사·금융·판매에 70억 원, 개발업자가 위험을 감수하며 요구하는 이익이 15억 원이라면 땅에 쓸 수 있는 최대 금액은 15억 원입니다. 이것은 현재의 확정 시세가 아니라 가정에 따른 잔여액입니다.</p>
          <p className="leading-7">공사비가 80억 원으로 오르면 그 상한은 5억 원이 됩니다. 분양가가 10억 원 내려도 같습니다. 개발 예정지의 땅값이 허가와 금리, 인프라 비용에 민감한 이유입니다.</p>
        </div>
        <FlowRail
          title="(가정) 완공 매각 100억 원, 공사·금융·판매 70억 원, 요구 이익 15억 원"
          steps={[
            { actor: "토지 소유자", movement: "땅을 매각하거나 개발권을 계약합니다.", receives: "토지대금" },
            { actor: "개발업자", movement: "허가·자금·공사를 조정하고 실패 위험을 집니다.", receives: "성공하면 잔여 이익" },
            { actor: "행정기관·시공사", movement: "허가 기준과 공사 계약을 집행합니다.", receives: "공공 기준 충족·공사대금" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">완공 뒤 100억 원을 받을 가능성에서 비용과 이익을 거꾸로 빼면 땅값의 상한이 보입니다. 허가와 시점의 영향을 넣습니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">소유권·허가·인프라·시간을 각각 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">땅을 소유해도 원하는 건물을 자동으로 지을 수 있는 것은 아닙니다. 먼저 등기와 경계, 도로에 닿는지와 건축할 수 있는 용도를 확인합니다. 그다음 상하수도 연결과 환경 제약을 봅니다.</p>
          <p className="leading-7">개발행위허가와 건축허가는 다른 결정입니다. 허가 전에 계약금을 낸다면 불허 또는 조건부 허가 때 계약을 어떻게 처리할지 적습니다.</p>
          <p className="leading-7">개발업자는 토지대금 외에 설계와 인허가, 기반시설과 공사 비용을 시간 순서대로 적습니다. 이자와 세금, 분양 비용과 하자 보수비도 빼야 합니다. 분양대금은 뒤에 들어오고 공사비는 먼저 나가므로 같은 100억 원 매각이라도 자금조달 시점이 가치를 바꿉니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공사·금융·판매 70억 원과 요구 이익 15억 원을 따로 둔 뒤에야 잔여 15억 원이 나옵니다. 다른 지역의 허가 조건을 살핍니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">나라별 계획권은 다르지만 먼저 허가와 현금의 순서를 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">한국 국토계획법의 개발행위허가와 건축법의 건축허가는 서로 다른 단계입니다. 지을 수 있는 연면적과 대지에서 건물이 차지할 면적은 지역 조례와 도시계획을 확인해야 합니다.</p>
          <p className="leading-7">영국, 호주와 미국에서도 현지 계획 허가와 전기·수도 같은 서비스 연결 비용을 분리해야 합니다. 같은 땅 넓이가 같은 분양 면적을 보장하지는 않습니다.</p>
          <p className="leading-7">RICS의 개발 부동산 평가 기준은 잔여법을 완공 가치에서 비용과 개발 이익을 차감하는 방식으로 설명합니다. 이 계산은 입력값에 크게 흔들리므로 비교 거래와 시간에 따른 현금흐름으로 대조해야 합니다.</p>
        </div>
        <SourceApplication source="RICS Valuation of development property · 6.1.1" excerpt="gross development value (GDV) - total development costs (including profit) = residual land value" application="완공 매각 100억 원에서 공사·금융·판매 70억 원과 요구 이익 15억 원을 빼면 땅에 지불할 수 있는 잔여는 15억 원입니다. 허가와 판매 시점이 바뀌면 다시 계산합니다." />
        <CitationBlock source="RICS Valuation of development property" citeKey={1} href="https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf">잔여법과 개발 부동산의 현금흐름·민감도를 설명하는 전문 기준입니다.</CitationBlock>
        <CitationBlock source="한국 국토의 계획 및 이용에 관한 법률" citeKey={2} href="https://www.law.go.kr/LSW/lsInfoP.do?efYd=20260701&lsiSeq=284013">2026-10-03 기준 개발행위허가·건폐율·용적률 조문의 출발점입니다.</CitationBlock>
        <CitationBlock source="한국 건축법 제11조" citeKey={3} href="https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1032199815">건축허가의 법적 출발점입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">RICS의 잔여식과 가정 수치를 맞췄다면 이 숫자가 확정 시세가 아니라는 점을 확인할 차례입니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">개발 호재라는 말에는 확률과 비용이 빠져 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">도로가 새로 나면 접근성이 좋아질 수 있지만 사업비 분담이나 토지 수용, 입지 경쟁도 바뀝니다. 허가 가능성이 높아도 공사비와 금융비가 오르면 땅에 남는 몫이 줄어듭니다.</p>
          <p className="leading-7">토지 등기와 경계가 맞는지 확인합니다. 오염과 기존 임차인의 권리, 설정된 담보권도 조사해야 합니다. 이를 빼먹은 잔여 계산은 숫자가 맞아도 실행할 수 없는 계획이 됩니다.</p>
          <p className="leading-7">계약 전에 허가와 금융 조달에 실패했을 때 계약을 해제하고 어느 돈을 돌려받을지 정합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "완공 가치가 같아도 도로 연결비나 인허가 지연이 커지면 땅에 줄 수 있는 돈은 어느 방향으로 바뀔까요? (답: 2절)",
          "개발 이익이 커 보이는데도 실제 사업을 못 하는 경우는 어떤 권리나 허가에서 생길까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
