import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import ScopeViz from "./viz/ScopeViz";

export default function ReachScope() {
  return (
    <section id="reach-scope" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">네트워크를 주는 것과 자원을 주는 것은 다른 결정입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사설망에 접속하면 보통 내부 주소 대역으로 가는 경로가 생깁니다. 필요한 것이 데이터베이스 하나였더라도
          받은 것은 그 대역 전체입니다. 접속한 기기가 감염되면 공격자도 같은 경로를 씁니다.
        </p>

        <p className="leading-7">
          반대편에는 자원 하나씩 주는 방식이 있습니다. 접속 결과로 생기는 것이 경로가 아니라 특정 서비스로 가는
          입구 하나뿐이라면, 그 입구로 갈 수 있는 곳이 정확히 그 서비스입니다. 옆으로 퍼질 길이 없습니다.
        </p>

        <p className="leading-7">
          두 방식의 차이는 평소가 아니라 사고 이후에 드러납니다. 평소에는 둘 다 잘 동작하고 사용자 경험도 비슷해
          보입니다. 계정 하나가 털렸을 때 공격자가 다음으로 시도할 수 있는 대상의 수가 다를 뿐입니다.
        </p>
      </div>

      <ScopeViz />

      <ExplainedFormula
        question="접근 범위가 넓을 때 피해가 얼마나 더 커집니까"
        idea="한 계정이 뚫렸을 때 노출되는 대상의 수는 그 계정이 받은 접근 범위에 비례하고, 범위가 네트워크 대역이면 그 대역 안 서비스 수만큼, 자원 단위면 명시적으로 준 것만큼입니다."
        formula={String.raw`R_{\text{net}} = |H| \cdot p \qquad R_{\text{res}} = |G_u|`}
        annotatedFormula={String.raw`\underbrace{R_{\text{net}} = |H| \cdot p}_{\text{네트워크를 준 경우}} \qquad \underbrace{R_{\text{res}} = |G_u|}_{\text{자원만 준 경우}}`}
        operations={[
          {
            expression: String.raw`|H|`,
            annotation: [
              "접속으로 경로가 생긴 대역 안에서 실제로 응답하는 호스트의 수입니다",
              "대역을 나눠 두지 않았다면 사내 서버 전부가 들어갑니다",
            ],
          },
          {
            expression: "p",
            annotation: "그중 내부 접속이면 추가 인증 없이 통과시키는 비율이며, 내부를 신뢰하는 설계일수록 1에 가깝습니다",
          },
          {
            expression: String.raw`|G_u|`,
            annotation: "사용자 u에게 명시적으로 부여된 자원의 수이며 부여 목록에 없는 것은 닿지 않습니다",
          },
        ]}
        terms={[
          { symbol: "H", name: "도달 가능 호스트 집합", description: "경로가 생긴 대역에서 실제로 응답하는 대상입니다." },
          { symbol: "p", name: "내부 통과 비율", description: "내부에서 왔다는 이유로 추가 확인 없이 통과하는 비율입니다." },
          { symbol: String.raw`G_u`, name: "부여 집합", description: "그 사용자에게 명시적으로 준 자원의 목록입니다." },
        ]}
        assumptions={[
          "공격자가 이미 그 계정의 접속 수단을 가졌다고 가정합니다. 이 식은 예방이 아니라 사후 피해 범위를 비교합니다.",
          "두 방식 모두 인증 자체는 통과했다고 봅니다. 인증 강도의 차이는 여기에 포함되지 않습니다.",
        ]}
        interpretation="식이 말하는 것은 자원 단위 부여가 인증을 더 강하게 만들어 주지는 않는다는 점입니다. 줄어드는 것은 뚫린 뒤에 닿을 수 있는 대상의 수이고, 그래서 이 선택은 인증 설계가 아니라 피해 범위 설계에 속합니다."
      />

      <TermBreakdown
        title="접근을 주는 세 가지 단위"
        description="같은 요구를 다른 크기로 만족시키며, 사고 이후의 범위가 달라집니다."
        items={[
          {
            term: "네트워크 단위",
            description: "내부 대역으로 가는 경로를 통째로 줍니다.",
            example: "주소를 모르는 내부 도구까지 찾아서 쓸 수 있어 편리합니다.",
            boundary: "감염된 기기가 접속하면 그 대역 전체가 탐색 대상이 됩니다.",
          },
          {
            term: "서비스 단위",
            description: "특정 서비스로 가는 입구 하나만 만듭니다.",
            example: "데이터베이스 하나만 필요한 배치 작업에 맞습니다.",
            boundary: "필요한 서비스가 늘어날 때마다 입구를 추가로 만들고 관리해야 합니다.",
          },
          {
            term: "요청 단위",
            description: "경로를 주지 않고 요청마다 신원과 상태를 보고 판정합니다.",
            example: "같은 사용자라도 기기 상태가 나쁘면 그 요청만 거절할 수 있습니다.",
            boundary: "판정에 쓸 신호를 모으고 유지해야 하며, 판정 지점이 새 단일 지점이 됩니다.",
          },
        ]}
      />

      <h3 id="lateral-reach" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        내부를 신뢰하면 한 번의 통과가 전부를 엽니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          문제를 키우는 것은 경로 자체가 아니라 그 경로를 통과한 요청을 다르게 대우하는 관행입니다. 많은 내부
          서비스가 "내부에서 온 요청이면 인증을 생략"하는 설정을 갖고 있습니다. 외부에서 직접 닿지 못한다는
          전제 아래 만들어진 편의입니다.
        </p>

        <p className="leading-7">
          그 전제가 깨지는 순간 편의는 그대로 취약점이 됩니다. 사설망 계정 하나가 뚫리면 공격자는 내부에서 온
          요청이 되고, 인증을 생략하도록 설정된 서비스들을 차례로 지납니다. 뚫린 것은 계정 하나인데 열린 것은
          그 대역 전체입니다.
        </p>

        <p className="leading-7">
          그래서 대응은 두 갈래입니다. 범위를 좁혀 애초에 닿을 수 있는 대상을 줄이거나, 내부에서 왔다는 사실을
          권한 근거로 쓰지 않는 것입니다. 앞의 절반은 다음 두 절이, 뒤의 절반은 그다음 절이 다룹니다.
        </p>

        <p className="leading-7">
          피해 범위를 미리 제한하는 설계 일반론은{" "}
          <Link to="/ai/agent-control-boundaries#blast-radius">피해 반경과 최소 권한</Link>이 소유합니다. 이
          절은 그 원칙이 네트워크 접근에서 어떤 모양이 되는지만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
