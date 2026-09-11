import { CitationBlock } from "@/components/ui/citation";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import PacketViz from "./viz/PacketViz";

export default function PacketLayer() {
  return (
    <section id="packet-layer" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">커널에 올리기 전에 버리는 층이 가장 쌉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          대량 트래픽 공격은 내용을 볼 필요가 없습니다. 목적이 대역폭과 처리 자원을 채우는 것이라 그냥 빨리
          버리기만 하면 됩니다. 그래서 이 층은 네트워크 카드에서 패킷을 받은 직후, 운영체제의 일반 네트워크
          처리에 들어가기 전에 끼어들어 버립니다.
        </p>

        <p className="leading-7">
          먼저 트래픽을 한곳에 모으지 않는 것이 전제입니다. 같은 주소를 여러 지점에서 광고하면 각 지점이 자기
          쪽으로 온 트래픽만 처리하므로, 한 지점에 감당 못할 양이 몰리는 상황 자체가 줄어듭니다. 도착한 지점
          안에서는 다시 여러 서버로 나눠 보냅니다.
        </p>

        <p className="leading-7">
          서버에 도착한 패킷은 커널 앞단 프로그램을 지납니다. 이 프로그램은 이미 만들어진 완화 규칙을 적용해
          해당하는 패킷을 그 자리에서 버리고, 동시에 표본을 분석기로 보냅니다. 공개된 설명에 따르면 이 방식은
          CPU 코어 하나로 초당 천만 패킷 이상을 버릴 수 있습니다.
        </p>

        <p className="leading-7">
          여기서 중요한 점은 규칙이 사람 손으로 만들어지지 않는다는 것입니다. 표본을 받은 분석기가 공격
          트래픽의 공통 특징을 찾아 규칙을 생성하고, 그 규칙을 앞단으로 내려보냅니다. 사람이 대시보드를 보고
          대응하기에는 공격이 너무 빠르게 시작되고 끝납니다.
        </p>
      </div>

      <PacketViz />

      <h3 id="fingerprint-rule" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        표본에서 지문을 만들어 규칙으로 내립니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          분석기가 하는 일은 표본 패킷들에서 공통되는 필드 조합을 찾는 것입니다. 출발지 포트, 패킷 길이,
          프로토콜 플래그처럼 여러 필드의 조합을 만들어 보고, 그중 공격 트래픽만 잘 걸러 내면서 정상 트래픽을
          적게 건드리는 조합을 고릅니다.
        </p>

        <p className="leading-7">
          이 선택이 핵심입니다. 지나치게 좁은 지문은 공격자가 필드 하나만 바꿔도 빠져나가고, 지나치게 넓은
          지문은 정상 트래픽까지 버립니다. 그래서 후보 지문을 여러 개 만들어 놓고 관측되는 트래픽 분포에서
          가장 효율적인 것을 고르는 방식이 쓰입니다.
        </p>

        <p className="leading-7">
          규칙이 어느 층에 놓이는지도 비용으로 결정됩니다. 양이 아주 많으면 더 앞단으로 내려 커널 이전에
          버리고, 그렇지 않으면 상위 층에서 차단이나 챌린지 같은 부드러운 조치를 씁니다. 같은 공격이라도 규모에
          따라 대응 위치가 바뀝니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="왜 방화벽 규칙만으로는 부족한가요"
          preview="일반 방화벽은 커널 네트워크 스택 안에서 동작하므로 패킷당 처리 비용이 이미 발생한 뒤입니다. 앞단에서 버리면 그 비용 자체가 사라집니다."
        >
          <p className="leading-7">
            패킷이 커널의 일반 처리 경로에 들어가면 자료구조 할당과 여러 계층 통과가 시작됩니다. 버릴 패킷에도
            이 비용이 들기 때문에, 공격 규모가 커지면 규칙이 맞아도 서버가 먼저 지칩니다.
          </p>
          <p className="leading-7">
            앞단 프로그램은 그 경로에 들어가기 전에 판단합니다. 대신 그 자리에서 쓸 수 있는 정보가 제한적이라
            복잡한 상태 추적이나 요청 내용 기반 판단은 못 합니다. 그래서 두 층이 함께 필요합니다.
          </p>
          <p className="leading-7">
            연결 상태를 추적해야 판단할 수 있는 공격도 있습니다. 이런 경우에는 흐름을 따라가는 별도 구성요소가
            상태를 보고 판정하며, 이 판정 결과도 결국 앞단 규칙으로 내려갑니다.
          </p>
        </ProgressiveDetail>
      </div>

      <CitationBlock
        source="Cloudflare — 자율 엣지 DDoS 방어 구조 설명과 L4Drop 공개 문서 (2026-09-11 확인)"
        citeKey={1}
        href="https://blog.cloudflare.com/deep-dive-cloudflare-autonomous-edge-ddos-protection/"
      >
        애니캐스트로 분산 수용한 뒤 커널 앞단 프로그램이 규칙을 적용하고 표본을 분석기로 보내며, 분석기가
        지문을 생성해 규칙을 내려보내는 구조는 해당 사업자의 공개 기술 설명입니다. 초당 천만 패킷 이상이라는
        수치도 같은 문서의 자기보고이며 모든 구성에서 재현되는 값이 아닙니다.
      </CitationBlock>
    </section>
  );
}
