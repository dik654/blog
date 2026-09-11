import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import OriginViz from "./viz/OriginViz";

export default function OriginProtection() {
  return (
    <section id="origin-protection" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">앞단을 세워도 뒷문이 열려 있으면 소용없습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          모든 층을 잘 쌓아도 공격자가 원 서버의 주소를 알아내 직접 연결하면 방어가 통째로 우회됩니다. 그래서
          엣지 방어의 마지막 조각은 원 서버가 인터넷에서 직접 보이지 않게 만드는 일입니다.
        </p>

        <p className="leading-7">
          주소가 새는 경로는 생각보다 많습니다. 과거 공개 기록에 남은 주소, 메일 발송 서버, 같은 호스트에서
          돌던 다른 서비스, 인증서 투명성 로그의 도메인 목록 같은 것들입니다. 앞단에 붙이기 전의 흔적이 그대로
          남아 있는 경우가 흔합니다.
        </p>

        <p className="leading-7">
          그래서 주소를 바꾸는 것만으로는 부족하고 원 서버가 앞단에서 온 연결만 받도록 만드는 편이 확실합니다. 방법은 둘입니다. 방화벽에서 앞단 대역만 허용하거나, 원 서버가 바깥으로
          연결을 만들어 앞단과 터널을 맺고 인바운드 포트를 아예 열지 않는 것입니다.
        </p>

        <p className="leading-7">
          두 번째 방식은 연결 방향을 뒤집습니다. 원 서버가 먼저 나가서 붙기 때문에 방화벽에 들어오는 구멍을 만들 필요가 없고 주소가 알려져도 직접 연결할 대상이 없습니다. 대신 터널을
          유지하는 구성요소가 새 장애 지점이 되므로 이중화가 필요합니다.
        </p>
      </div>

      <OriginViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          앞단 대역만 허용하는 방식에는 함정이 하나 있습니다. 같은 앞단 서비스를 쓰는 다른 사용자도 그 대역을 쓴다는 점입니다. 대역 허용만으로는 "우리 앞단을 거친 요청"과 "같은
          서비스를 쓰는 제3자의 요청"을 구분하지 못하므로 앞단과 원 서버 사이에 상호 인증을 추가로 걸어야 합니다.
        </p>

        <p className="leading-7">
          연결 방향을 뒤집어 안쪽에서 바깥으로 붙는 구조는 사설 접근 전반에서 쓰이는 패턴이기도 합니다. 같은
          아이디어가 원격 접근과 내부 서비스 공개에 어떻게 적용되는지는 이 섹션의 다음 글에서 다룹니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="주소가 이미 알려진 경우의 순서"
          preview="주소를 바꾸는 것이 먼저가 아니라, 바꾼 주소가 다시 새지 않도록 유출 경로를 먼저 막는 것이 먼저입니다."
        >
          <p className="leading-7">
            새 주소를 받아도 같은 경로로 다시 노출되면 반복됩니다. 그래서 메일 발송을 별도 서비스로 분리하고,
            같은 호스트에서 돌던 관리 도구를 옮기고, 과거 기록에 남은 항목을 정리하는 일이 먼저입니다.
          </p>
          <p className="leading-7">
            그다음에 인바운드를 닫습니다. 앞단 대역만 허용하거나 터널로 전환하는 것인데, 후자가 더 확실한
            대신 운영 구성요소가 하나 늘어납니다. 어느 쪽이든 예외로 열어 둔 관리 포트가 남아 있는지 확인해야
            합니다.
          </p>
          <p className="leading-7">
            브라우저에 실제로 전달되는 코드가 무엇인지의 무결성 문제는 또 다른 층입니다. 앞단이 중간에서
            내용을 다룰 수 있다는 점과 그 검증 방법은{" "}
            <Link to="/blockchain/webcat-frontend-integrity">프런트엔드 무결성</Link>에서 다룹니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
