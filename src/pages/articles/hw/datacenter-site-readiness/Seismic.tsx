import { CitationBlock } from "@/components/ui/citation";
import TermBreakdown from "@/components/articles/term-breakdown";
import SeismicViz from "./viz/SeismicViz";

export default function Seismic() {
  return (
    <section id="seismic" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">고정하지 않은 랙은 흔들림에 먼저 쓰러집니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          무거운 장비를 높은 랙에 채우면 무게 중심이 올라갑니다. 바닥이 수평으로 흔들릴 때 이 무게 중심이
          만드는 회전력이 랙을 넘어뜨리는 방향으로 작용하고, 바퀴로만 서 있는 랙은 미끄러지거나 기울어집니다.
          그래서 지진 위험이 있는 지역에서는 고정이 선택이 아니라 요건입니다.
        </p>

        <p className="leading-7">
          기준은 가속도로 주어집니다. 통신 장비 규격에서 가장 높은 위험 등급은 수평 0.8 g, 수직 1.0 g 수준의
          가속도를 가한 시험에서 넘어지지 않고 뼈대가 변형되지 않으며 장비 연결이 끊기지 않을 것을 요구합니다.
          이 시험을 통과한 랙에는 해당 등급 표기가 붙습니다.
        </p>

        <p className="leading-7">
          중요한 점은 랙 등급만으로 끝나지 않는다는 것입니다. 그 등급은 정해진 방식으로 바닥에 고정했을 때의
          값이라, 앵커 볼트와 브래킷을 제조사가 지정한 대로 시공해야 성립합니다. 이중 바닥이면 패널이 아니라
          그 아래 구조체에 고정해야 하고, 이는 바닥 공사와 함께 계획해야 하는 일입니다.
        </p>

        <p className="leading-7">
          장비 쪽도 확인 대상입니다. 랙이 버텨도 안에서 섀시가 레일을 벗어나거나 케이블이 빠지면 결과는
          같습니다. 그래서 랙 등급, 고정 시공, 장비 고정과 케이블 여유를 함께 봐야 합니다.
        </p>
      </div>

      <SeismicViz />

      <TermBreakdown
        title="내진 대응에서 확인할 네 가지"
        description="하나만 갖춰도 성립하지 않고 네 항목이 함께 맞아야 합니다."
        items={[
          {
            term: "랙 등급 표기",
            description: "정해진 가속도 시험을 통과했는지와 그때의 적재 무게 한도입니다.",
            example: "적재 한도가 실제 장비 무게보다 작으면 등급이 의미를 잃습니다.",
            boundary: "등급은 지정된 고정 방식으로 시공했을 때의 값입니다.",
          },
          {
            term: "바닥 고정 방식",
            description: "앵커 볼트로 슬래브에 직접 고정할지, 이중 바닥 구조체에 연결할지입니다.",
            example: "이중 바닥에서는 패널이 아니라 그 아래 지지 구조에 고정합니다.",
            boundary: "바닥 공사와 함께 계획해야 하며 나중에 추가하기 어렵습니다.",
          },
          {
            term: "장비 고정",
            description: "섀시가 레일에서 이탈하지 않도록 전면과 후면을 모두 고정하는지입니다.",
            example: "무거운 섀시일수록 후면 지지가 중요합니다.",
            boundary: "고정이 정비 동선을 막지 않는지 함께 확인해야 합니다.",
          },
          {
            term: "케이블 여유",
            description: "랙이 조금 움직여도 케이블과 배관이 끊기지 않을 여유 길이입니다.",
            example: "액체 냉각 배관은 특히 유연 구간이 필요합니다.",
            boundary: "여유가 너무 많으면 기류를 막으므로 정리 방식과 함께 설계합니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          적용 여부와 수준은 지역 건축 기준이 정합니다. 어떤 등급이 요구되는지, 어떤 고정 방식이 인정되는지는
          해당 지역 규정과 건물 설계에 따르므로 구조 담당과 함께 확인해야 합니다. 이 글은 무엇을 물어봐야
          하는지를 정리한 것이지 규정 해석을 대신하지 않습니다.
        </p>

        <p className="leading-7">
          앞 절의 하중 계산과도 이어집니다. 고정 앵커는 평상시 무게가 아니라 흔들릴 때 생기는 추가 힘까지
          받아야 하므로, 무게가 클수록 요구되는 고정도 커집니다. 무게와 고정을 따로 검토하면 한쪽만 만족하는
          설계가 나옵니다.
        </p>
      </div>

      <CitationBlock
        source="Telcordia GR-63-CORE · NEBS 물리적 보호 요건 (제조사 공개 시험 조건 기준, 2026-09-11 확인)"
        citeKey={1}
        href="https://www.hammfg.com/dci/products/cabinet-systems/dcz4"
      >
        가장 높은 위험 등급의 랙이 수평 0.8 g·수직 1.0 g 수준의 가속도 시험에서 전도와 변형, 연결 이탈이 없어야
        한다는 조건은 제조사가 공개한 시험 사양에서 인용했습니다. 실제 요구 등급과 인정되는 고정 방식은 지역
        건축 기준과 건물 설계에 따르며 이 인용이 규정 해석을 대신하지 않습니다.
      </CitationBlock>
    </section>
  );
}
