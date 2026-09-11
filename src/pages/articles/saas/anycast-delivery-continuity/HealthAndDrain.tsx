import TermBreakdown from "@/components/articles/term-breakdown";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import DrainViz from "./viz/DrainViz";

export default function HealthAndDrain() {
  return (
    <section id="health-and-drain" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">무엇을 고장으로 볼지가 장애 조치의 절반입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          트래픽을 옮기는 장치가 아무리 빨라도, 옮겨야 한다는 판단이 늦으면 소용없습니다. 그 판단을 만드는
          것이 건강 검사입니다. 그런데 무엇을 물어보느냐에 따라 같은 서버가 건강하다고도 아프다고도 나옵니다.
        </p>

        <p className="leading-7">
          가장 얕은 검사는 포트가 열려 있는지 보는 것입니다. 프로세스가 살아 있으면 통과하므로, 데이터베이스
          연결이 모두 끊긴 서버도 건강하다고 답합니다. 반대로 가장 깊은 검사는 실제 종속성까지 확인하는
          것인데, 이번에는 공용 데이터베이스가 느려지면 모든 서버가 동시에 아프다고 답합니다.
        </p>

        <p className="leading-7">
          두 극단이 각각 다른 방식으로 틀립니다. 얕으면 고장 난 서버에 계속 트래픽이 가고, 깊으면 공용 문제
          하나가 전체를 한꺼번에 제외시켜 남는 용량이 없어집니다. 그래서 실무에서는 그 서버 자신이 책임질 수
          있는 범위까지만 검사하고, 공용 종속성의 문제는 별도 신호로 다룹니다.
        </p>
      </div>

      <DrainViz />

      <TermBreakdown
        title="건강 신호를 고르는 세 가지 층"
        description="같은 서버에 대해 서로 다른 답을 주며, 답이 틀리는 방식도 다릅니다."
        items={[
          {
            term: "생존 확인",
            description: "포트가 열려 있고 프로세스가 응답하는지만 봅니다.",
            example: "프로세스가 죽거나 멈춘 경우를 빠르게 잡습니다.",
            boundary: "내부적으로 아무 일도 못 하는 상태도 통과합니다. 이것만으로는 부족합니다.",
          },
          {
            term: "처리 준비 확인",
            description: "지금 새 요청을 받아 처리할 수 있는 상태인지 그 서버 스스로 판단해 답합니다.",
            example: "초기화 중이거나 큐가 가득 찬 동안 스스로 빠져 있을 수 있습니다.",
            boundary: "판단 기준을 서버가 정하므로 기준이 느슨하면 아픈 서버가 계속 남습니다.",
          },
          {
            term: "종속성 확인",
            description: "데이터베이스나 외부 서비스까지 실제로 닿는지 확인합니다.",
            example: "그 서버만 특정 종속성에 못 닿는 상황을 잡아냅니다.",
            boundary: "공용 종속성이 흔들리면 모든 서버가 동시에 제외돼 용량이 사라집니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          계획된 작업에서는 검사를 기다릴 이유가 없습니다. 서버를 내리기 전에 먼저 새 연결만 끊고 기존 연결은
          끝날 때까지 두는 절차를 씁니다. 이것이 빼기입니다. 검사로 감지되는 고장과 달리 시점을 우리가 정하기
          때문에 끊김이 아예 생기지 않습니다.
        </p>

        <p className="leading-7">
          빼기가 성립하려면 두 가지가 필요합니다. 분배기가 "새 연결은 주지 말고 기존 연결은 유지"라는 중간
          상태를 표현할 수 있어야 하고, 남은 연결이 실제로 끝날 때까지 기다릴 최대 시간이 정해져 있어야
          합니다. 그 시간이 지나면 남은 연결은 끊고 진행합니다.
        </p>

        <p className="leading-7">
          한 대를 뺄 때 남은 서버가 그 몫을 받을 수 있어야 한다는 조건도 같이 따라옵니다. 평소 사용률이 높으면
          한 대를 빼는 순간 남은 서버가 한계에 닿아 연쇄적으로 아파집니다. 그래서 빼기는 용량 여유가 있을 때만
          안전한 절차입니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="검사 주기와 실패 판정 횟수는 어떻게 정합니까"
          preview="감지 시간은 대략 주기와 연속 실패 허용 횟수의 곱입니다. 짧게 잡으면 빨리 감지하는 대신 일시적 지연을 고장으로 오해합니다."
        >
          <p className="leading-7">
            주기 2초에 연속 3회 실패를 조건으로 두면 감지에 최대 6초가 걸립니다. 이 6초 동안 그 서버로 가는
            요청은 계속 실패하므로, 감지 시간은 그대로 장애 시간의 하한이 됩니다.
          </p>
          <p className="leading-7">
            그렇다고 주기 200밀리초에 1회 실패로 잡으면 순간적인 지연이나 검사 패킷 유실만으로 멀쩡한 서버가
            빠집니다. 빠진 서버의 몫이 남은 서버로 가면서 그쪽이 느려지고, 다시 빠지는 흔들림이 생깁니다.
          </p>
          <p className="leading-7">
            그래서 실무에서는 빼는 조건과 되돌리는 조건을 다르게 둡니다. 빼는 것은 비교적 빠르게, 되돌리는
            것은 더 오래 관찰한 뒤에 합니다. 흔들림을 줄이는 가장 단순한 방법입니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
