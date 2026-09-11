import { CitationBlock } from "@/components/ui/citation";
import EndpointViz from "./viz/EndpointViz";

export default function PrivateEndpoint() {
  return (
    <section id="private-endpoint" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">받는 쪽 주소를 소비자 네트워크 안에 만들어 둡니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          두 번째 구현은 방향을 뒤집는 대신 주소를 옮깁니다. 서비스를 쓰려는 쪽의 네트워크 안에 그 서비스를 대신하는 인터페이스를 만들고 그 인터페이스에 소비자 자신의 주소 대역에서 뽑은
          사설 주소를 붙입니다. 소비자 입장에서는 자기 네트워크 안의 주소 하나로 보입니다.
        </p>

        <p className="leading-7">
          이 구조의 첫 번째 이점은 인터넷을 거치지 않는다는 것입니다. 인터넷 게이트웨이도, 주소 변환 장치도,
          공인 주소도 필요 없고 트래픽은 제공자의 내부망 안에 머뭅니다. 나가는 경로를 아예 만들지 않은 사설
          구간에서도 그 서비스에는 닿습니다.
        </p>

        <p className="leading-7">
          두 번째 이점은 주소 겹침이 문제가 되지 않는다는 것입니다. 두 네트워크를 서로 연결하는 방식이라면 양쪽 대역이 겹치는 순간 붙일 수 없지만 여기서는 연결되는 것이 네트워크가
          아니라 인터페이스 하나뿐이라 상대 네트워크의 주소 체계를 알 필요가 없습니다.
        </p>

        <p className="leading-7">
          세 번째가 이 절의 핵심입니다. 이 방식은 단방향입니다. 소비자가 제공자의 서비스에 닿을 수 있을 뿐,
          제공자가 소비자 네트워크 안을 볼 수 있게 되지는 않습니다. 두 네트워크를 붙이는 방식과 가장 크게
          갈리는 지점입니다.
        </p>
      </div>

      <EndpointViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          접근 허용은 두 단계로 걸립니다. 제공자가 어떤 주체에게 이 서비스를 쓸 자격을 줄지 먼저 정하고, 소비자가
          연결을 요청하면 제공자가 그 요청을 받아들이거나 거절합니다. 요청은 소비자가 걸지만 승인은 제공자가
          한다는 비대칭이 이 구조의 통제 지점입니다.
        </p>

        <p className="leading-7">
          그 위에 정책을 하나 더 얹을 수 있습니다. 만들어진 인터페이스에 정책을 붙여 어떤 주체가 그것을 통해
          무엇을 할 수 있는지 제한하는 것입니다. 앞의 승인이 "이 네트워크가 이 서비스에 붙어도 되는가"를
          정한다면, 이 정책은 "붙은 뒤에 무엇이 허용되는가"를 정합니다.
        </p>

        <p className="leading-7">
          이름 조회 쪽도 함께 손봐야 쓸 만해집니다. 같은 도메인 이름이 사설 구간 안에서는 이 인터페이스의 사설
          주소로, 바깥에서는 원래의 공개 주소로 풀리도록 구성하면 애플리케이션 설정을 바꾸지 않고도 경로만
          바뀝니다. 이름 해석이 위치에 따라 달라진다는 점은 장애를 조사할 때 반드시 기억해야 할 성질입니다.
        </p>
      </div>

      <CitationBlock
        source="AWS — PrivateLink 개념 문서 (2026-09-11 확인)"
        citeKey={2}
        href="https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html"
      >
        소비자가 자기 서브넷마다 엔드포인트 네트워크 인터페이스를 만들어 사설 주소로 서비스에 닿고, 트래픽이
        공개 인터넷을 거치지 않으며, 연결은 소비자가 요청하고 제공자가 수락·거절하고, 인터페이스에 정책을 붙여
        어떤 주체가 쓸 수 있는지 제한하며, 같은 도메인 이름을 위치에 따라 다르게 풀 수 있다는 설명은 해당
        제공자의 공식 문서입니다. 다른 클라우드에도 비슷한 기능이 있지만 승인 절차와 정책 모델의 세부는
        다르므로 이 글은 구조의 성질만 다룹니다.
      </CitationBlock>
    </section>
  );
}
