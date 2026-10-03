import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 정보는 사실이 전달되는 길과 주목을 파는 시장을 동시에 지난다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function MediaAttentionAndPublicBeliefArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정보가 많아도 사람은 화면에 뜬 일부만 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">게시물 100개가 있어도 추천 화면에 10개만 반복 등장하면 사람의 체감 여론은 그 10개에 치우칠 수 있습니다. 광고주가 1천 회의 노출을 산다면 플랫폼은 시선을 붙잡을 유인을 갖습니다. 이 숫자는 설명용이며 실제 추천 알고리즘의 작동을 뜻하지 않습니다.</p>
          <p className="leading-7">시장 대세와 정치적 인식은 정보의 진위뿐 아니라 누가 무엇을 얼마나 자주 보게 되는지와 연결됩니다.</p>
        </div>
        <FlowRail
          title="(가정) 게시물 100개 중 추천 10개, 광고 노출 1천 회"
          steps={[
            { actor: "제작자·언론", movement: "게시물 100개를 만들고 취재·검증비를 냅니다.", receives: "독자·광고·구독 수입" },
            { actor: "플랫폼·광고주", movement: "추천 10개와 광고 1천 회의 배치를 정합니다.", receives: "주목·노출과 판매 기회" },
            { actor: "시민·투자자", movement: "보이는 정보를 읽고 판단·주문·투표합니다.", receives: "인식 변화와 선택 결과" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">100개 게시물 중 10개가 반복 보인다는 가정을 놓았습니다. 누가 그 10개를 고르는지 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">취재 비용·추천 규칙·광고 수입을 따로 추적합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">언론사는 취재·검증에 돈을 쓰고 구독 또는 광고로 회수합니다. 플랫폼은 이용자 행동을 바탕으로 게시물을 정렬하고 광고주에게 노출을 팝니다. 제작자는 조회수와 구독을 얻으려는 유인을 갖습니다.</p>
          <p className="leading-7">많이 보인 주장과 사실로 확인된 주장을 분리해야 합니다. 출처의 원문, 발표 시점, 반대 자료와 실제 행동 변화를 확인하면 말의 흐름이 자금과 정책으로 이어졌는지 추적할 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">추천과 광고의 수입 경로를 알았다면 노출과 믿음을 분리할 수 있습니다. 나라별 공개 규칙을 살핍니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">나라의 언론 자유와 플랫폼 규칙이 정보 경로를 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">EU 디지털서비스법 안내는 대형 플랫폼의 추천·광고 투명성 의무를 설명합니다. 그러나 EU의 규칙을 한국·미국·인도·나이지리아의 플랫폼 운영에 그대로 적용할 수는 없습니다.</p>
          <p className="leading-7">같은 주장을 비교할 때 현지 언어, 언론 소유, 정부 발표 경로, 플랫폼 점유, 검열과 공시 제도를 함께 봅니다.</p>
        </div>
        <SourceApplication source="European Commission · DSA impact on platforms" excerpt="greater transparency and control on what we see in our feeds" application="게시물 100개 중 추천된 10개의 배치 기준을 이용자가 확인할 수 있는지 묻습니다. EU의 공개 의무가 곧 게시물의 사실성이나 이용자의 믿음을 보증하지는 않습니다." />
        <CitationBlock source="European Commission: DSA impact on platforms" citeKey={1} href="https://digital-strategy.ec.europa.eu/en/policies/dsa-impact-platforms">EU 플랫폼의 추천·광고 투명성 규칙의 관할 범위를 설명합니다.</CitationBlock>
        <CitationBlock source="European Commission: DSA transparency" citeKey={2} href="https://digital-strategy.ec.europa.eu/en/policies/dsa-brings-transparency">EU 디지털서비스법의 이용자 정보와 광고 투명성 설명입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">EU의 투명성 의무는 노출 경로를 알려 줍니다. 실제 사람의 선택이 바뀌었는지는 별도 자료가 필요합니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">화면 노출이 생각과 행동을 바꿨다고 바로 단정할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">원래 같은 생각을 가진 사람이 그 콘텐츠를 더 눌렀을 수도 있습니다. 추천이 결과인지 원인인지 구별하려면 노출 전 상태와 비교 집단이 필요합니다.</p>
          <p className="leading-7">시장에서는 게시물 수보다 실제 주문, 자금 유입, 기업의 매출과 정책 집행을 별도 지표로 확인합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "게시물 100개 중 10개가 반복 추천되면 사람들이 느끼는 여론과 실제 전체 게시물은 어떻게 달라질까요? (답: 2절)",
          "조회수가 높아진 뒤 주가가 올랐다는 순서만으로 영상이 원인이라고 판단할 수 있을까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
