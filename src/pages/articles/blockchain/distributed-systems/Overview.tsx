import { Link } from "react-router-dom";
import ContextViz from "./viz/ContextViz";
import ExecutionTraceViz from "./viz/ExecutionTraceViz";
import SystemModelViz from "./viz/SystemModelViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <header className="space-y-4">
        <p className="text-sm font-bold text-primary">01 · 실행</p>
        <h2 className="text-2xl font-bold">보장은 가정과 함께 읽습니다</h2>
        <p className="max-w-3xl text-lg leading-8 text-foreground/90">
          여러 컴퓨터가 같은 프로그램을 실행해도 메시지는 같은 시각과 순서로 도착하지 않습니다. 그래서 분산 시스템에서는 알고리즘 이름보다 먼저 <strong>어떤 실행을 허용했고 무엇을 보장하려는지</strong>를 확인합니다.
        </p>
      </header>

      <ContextViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          아래에서는 잔액 10에서 3을 빼는 요청 하나를 따라갑니다. 그림에서 먼저 확인할 것은 세 노드의 값이 다른 순간이 실제로 생긴다는 사실입니다. 그다음에야 이 차이가 허용된 지연인지, 충돌한 결정인지 판단할 수 있습니다.
        </p>
      </div>

      <ExecutionTraceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>장면에 이름을 붙이면 실행을 추적할 수 있습니다</h3>
        <p>
          각자 로컬 상태를 가진 계산 주체는 <strong>process</strong>입니다. 그 사이를 이동하는 값은 <strong>message</strong>입니다. 로컬 계산, 전송, 수신처럼 상태를 바꾸는 한 번의 사건은 <strong>event</strong>입니다. 초기 상태에서 시작해 event가 실제로 일어난 순서를 하나의 <strong>execution</strong>이라고 합니다.
        </p>
        <p>
          이론의 process가 물리 서버·컨테이너·스레드와 반드시 일대일로 대응하지는 않습니다. 중요한 것은 누가 어떤 로컬 상태를 갖고, 어느 메시지를 본 뒤, 어떤 상태로 바뀌었는지입니다. 위 장면에서는 A의 계산, A→B 전달, A→C 지연, C의 타임아웃이 execution을 이룹니다.
        </p>
      </div>

      <SystemModelViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>같은 타임아웃도 시간 가정에 따라 뜻이 달라집니다</h3>
        <p>
          모든 메시지가 알려진 상한 안에 도착하는 <strong>동기 모델</strong>에서는 상한을 넘긴 응답을 고장 신호로 사용할 수 있습니다. <strong>비동기 모델</strong>에는 고정된 전달 상한이 없으므로 200ms가 지나도 상대가 멈췄는지 메시지가 늦는지 구별할 수 없습니다. <strong>부분 동기 모델</strong>은 상한이 언젠가 성립하지만 값이나 시작 시각을 미리 모르는 경우를 다룹니다.
        </p>

        <h3>멈춤과 거짓말은 같은 고장이 아닙니다</h3>
        <p>
          <strong>Crash</strong>는 process가 더 이상 진행하지 않는 고장입니다. <strong>Omission</strong>은 일부 전송이나 수신이 빠지는 고장입니다. <strong>Byzantine fault</strong>는 수신자마다 다른 값을 보내거나 잘못된 상태를 제안하는 임의 행동까지 허용합니다. 인증된 채널은 누가 보냈고 내용이 변조됐는지는 알려주지만, 발신자가 정직한 값을 보냈는지는 알려주지 않습니다.
        </p>

        <h3>안전성과 진행성은 서로 다른 약속입니다</h3>
        <p>
          <strong>Safety</strong>는 일어나면 안 되는 일이 한 번도 생기지 않는 성질입니다. 합의에서는 정직한 두 process가 서로 다른 값을 최종 결정하지 않는다는 약속이 대표적입니다. <strong>Liveness</strong>는 필요한 조건이 갖춰지면 좋은 일이 결국 일어나는 성질입니다. 네트워크가 갈라졌을 때 결정을 멈추면 진행성은 잃을 수 있지만, 충돌한 결정을 만들지 않았다면 안전성은 지킬 수 있습니다.
        </p>
        <p>
          다음 절의 FLP와 CAP는 “분산 시스템은 어렵다”는 막연한 경고가 아닙니다. 어떤 시간·고장·채널 모델에서 어떤 약속을 동시에 보장할 수 없는지 정확히 경계를 긋는 결과입니다. 명령을 같은 순서로 실행하는 구조는 <Link to="/cs/blockchain/smr-theory">상태 머신 복제</Link>에서 이어집니다.
        </p>
      </div>
    </section>
  );
}
