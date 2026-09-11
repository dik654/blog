import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation";
import ConnectorViz from "./viz/ConnectorViz";

export default function OutboundConnector() {
  return (
    <section id="outbound-connector" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">안쪽이 먼저 나가면 밖에서 두드릴 문이 없습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          첫 번째 구현은 안쪽에 작은 프로그램을 두는 것입니다. 이 프로그램은 시작하자마자 바깥의 중계망으로 연결을 겁니다. 방화벽 입장에서는 평범한 나가는 연결이라 대부분 기본 설정으로
          허용되고 들어오는 규칙은 하나도 추가되지 않습니다.
        </p>

        <p className="leading-7">
          연결이 맺어지고 나면 그 통로로 양방향 통신이 흐릅니다. 사용자가 중계망에 요청을 보내면 중계망이 이미
          맺어 둔 통로로 그 요청을 안쪽에 밀어 넣고, 응답이 같은 통로로 돌아옵니다. 안쪽 서버는 여전히 받는
          포트를 하나도 열지 않은 상태입니다.
        </p>

        <p className="leading-7">
          이것이 앞 글에서 오리진을 숨기는 수단으로 나왔던 구조와 같습니다. 다른 점은 대상입니다. 거기서는 웹
          사이트의 원 서버였고, 여기서는 사내 도구나 데이터베이스처럼 애초에 공개할 생각이 없던 자원입니다.
        </p>

        <p className="leading-7">
          한 통로에 하나의 프로그램만 두는 것은 아닙니다. 같은 통로에 여러 개를 띄워 각각 가까운 중계 지점에
          붙이면, 한 프로그램이 죽거나 한 지점이 문제를 겪어도 나머지가 트래픽을 받습니다. 이 중복이 없으면
          통로 자체가 단일 장애 지점이 됩니다.
        </p>
      </div>

      <ConnectorViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          대가로 신뢰 지점이 하나 늘어납니다. 이 프로그램은 안쪽 네트워크에서 실행되면서 바깥으로 나가는 통로를 유지하므로 프로그램 자체나 그 자격 증명이 탈취되면 그 통로가 공격자의 것이
          됩니다. 방화벽 규칙을 없앤 대신 관리해야 할 비밀이 생긴 셈입니다.
        </p>

        <p className="leading-7">
          그래서 실무 점검 항목도 방화벽에서 옮겨 갑니다. 이 프로그램이 어떤 계정으로 도는지, 자격 증명이 어디에
          저장되고 언제 교체되는지, 그 통로로 닿을 수 있는 안쪽 대상이 무엇으로 제한되는지가 확인 대상이
          됩니다. 특히 마지막 항목이 빠지면 앞 절의 "네트워크를 주는" 방식과 같아집니다.
        </p>

        <p className="leading-7">
          통로가 닿는 범위를 서비스 하나로 못 박으면 이 구조는 서비스 단위 접근이 되고 안쪽 대역 전체로 열어 두면 사설망과 다를 바 없어집니다. 같은 기술이 설정에 따라 양쪽 끝을
          오간다는 점이 이 방식의 실제 위험입니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="나가는 연결만 쓰면 방화벽 관리가 정말 없어집니까"
          preview="들어오는 규칙은 없어지지만 나가는 규칙이 새 통제 지점이 됩니다. 아무 데나 나갈 수 있는 네트워크에서는 이 구조가 통제를 오히려 약하게 만들 수 있습니다."
        >
          <p className="leading-7">
            나가는 연결을 전부 허용하는 환경이라면 이 프로그램은 아무 설정 없이 동작합니다. 편하지만, 같은 느슨함을 다른 프로그램도 쓸 수 있다는 뜻이기도 합니다. 나가는 방향을
            통제하지 않는다는 사실은 이 구조가 만든 문제가 아니라 이 구조가 드러낸 문제입니다.
          </p>
          <p className="leading-7">
            반대로 나가는 연결이 목적지별로 통제되는 환경에서는 이 프로그램이 붙을 목적지를 명시적으로 허용해야 합니다. 이때는 허용 목록이 곧 통제 지점이 되고 들어오는 규칙을 관리하던
            것과 성격만 다를 뿐 관리 부담은 남습니다.
          </p>
          <p className="leading-7">
            정리하면 이 방식이 없애는 것은 "인터넷에서 직접 두드릴 수 있는 표면"이지 "방화벽 관리" 전체가
            아닙니다. 앞의 것이 사라지는 효과가 크기 때문에 쓰이는 것입니다.
          </p>
        </ProgressiveDetail>
      </div>

      <CitationBlock
        source="Cloudflare — Tunnel 커넥터 공식 문서 (2026-09-11 확인)"
        citeKey={1}
        href="https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/"
      >
        커넥터 데몬이 방화벽을 통해 원본에서 바깥 네트워크로 나가는 연결을 먼저 맺고, 그 덕분에 들어오는
        트래픽을 전부 막아 둘 수 있으며, 한 통로에 여러 커넥터를 띄워 각자 가까운 데이터센터에 붙일 수 있다는
        설명은 해당 사업자의 공식 문서입니다. 구체적인 포트와 프로토콜, 재연결 동작은 제품 구현에 따라
        달라지므로 이 글은 연결 방향과 중복 구성의 성질만 다룹니다.
      </CitationBlock>
    </section>
  );
}
