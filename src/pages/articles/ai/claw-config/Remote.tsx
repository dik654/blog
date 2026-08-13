import RemoteViz from "./viz/RemoteViz";
import WsProtocolViz from "./viz/WsProtocolViz";

const permissionBinding = [
  ["tool", "정확한 tool 이름과 canonical arguments"],
  ["resource", "대상 path·URL·digest와 workspace identity"],
  ["attempt", "session·request·attempt ID와 만료 시각"],
  ["decision", "한 번만 소비되는 allow 또는 deny"],
] as const;

export default function Remote() {
  return (
    <section id="remote" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        원격 세션은 입력·권한·출력을 authenticated channel로 묶는다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          원격 실행에서는 로컬 CLI가 화면과 사용자 입력을 담당하고, remote
          runtime이 workspace·provider·tool을 실제로 다룹니다. 화면이 같아도
          신뢰 경계는 달라집니다. remote는 파일과 command에 접근할 수 있고,
          local은 remote가 보낸 permission prompt가 지금 보고 있는 세션의
          요청인지 확인해야 합니다.
        </p>
        <p className="leading-7">
          그래서 WebSocket 연결 하나를 열었다는 사실만으로는 충분하지 않습니다.
          TLS/WSS로 server identity를 확인하고, 짧게 살아 있는 credential을
          session에 묶으며, protocol version·request ID·sequence를 포함한
          구조화된 message로 양쪽 상태를 맞춰야 합니다.
        </p>

        <div className="not-prose my-8">
          <RemoteViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          protocol envelope가 재연결의 기준점이다
        </h3>
        <p className="leading-7">
          message type만 보내면 duplicate와 순서 뒤바뀜을 구분하기 어렵습니다.
          모든 message에 protocol version, session ID, request ID, monotonic
          sequence와 payload type을 넣고, receiver는 마지막으로 처리한
          sequence를 acknowledge합니다. 재연결할 때 client가 마지막 ack를 보내면
          server는 보존된 범위만 replay하거나 snapshot을 다시 전송할 수
          있습니다.
        </p>
        <p className="leading-7">
          stream이 producer보다 느리면 queue를 무한히 늘리지 말고 backpressure와
          size limit를 적용합니다. text delta는 합칠 수 있어도 permission, tool
          result와 terminal state는 유실하면 안 되므로 message 종류별 보존
          정책도 달라야 합니다.
        </p>

        <div className="not-prose my-8">
          <WsProtocolViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {permissionBinding.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          permission 응답은 정확한 action에만 쓸 수 있다
        </h3>
        <p className="leading-7">
          remote가 “Bash를 허용할까요?”처럼 모호한 prompt를 보내면 local
          사용자는 무엇을 승인하는지 알 수 없습니다. prompt에는 canonical
          command, working directory, affected resource와 risk summary가
          포함돼야 하며, 응답은 session·request·attempt에 암호학적으로 또는
          server-side state로 결합해야 합니다.
        </p>
        <p className="leading-7">
          허용 결정은 한 번 소비하고 짧은 시간 뒤 만료합니다. remote가
          argument를 바꾸거나 retry attempt가 달라지면 새 결정을 받아야 하므로,
          과거의 allow를 비슷한 command에 재사용할 수 없습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          연결이 끊기면 새 privileged action을 멈춘다
        </h3>
        <p className="leading-7">
          연결이 사라졌다고 이미 승인된 원자적 작업을 무조건 kill하면 더 큰
          손상이 생길 수 있습니다. 실행 중 action은 정의된 cancellation policy에
          따라 완료하거나 중단하되, 새 privileged action과 새 permission
          prompt는 기본적으로 pause합니다. reconnect timeout이 끝나면 child
          process와 lease를 정리하고 결과를 durable log에 남깁니다.
        </p>
        <p className="leading-7">
          resume은 session token만 확인하지 않고 마지막 ack와 runtime
          generation도 확인합니다. server가 재시작돼 generation이 바뀌었다면
          이전 stream을 이어 붙이지 말고 현재 state snapshot부터 다시 동기화해야
          합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          upstream proxy는 provider credential의 경계를 정한다
        </h3>
        <p className="leading-7">
          remote runtime이 provider API를 호출한다면 credential을 어느 쪽이
          보관하는지 먼저 정해야 합니다. local secret을 WebSocket payload로
          그대로 전달하기보다 remote 전용 credential이나 짧은 delegated token을
          사용하는 편이 낫습니다. proxy log에는 Authorization header, prompt의
          secret과 provider response의 민감 정보를 redaction합니다.
        </p>
        <p className="leading-7">
          local과 remote의 결과가 같아 보여도 network failure, credential
          scope와 audit owner는 달라집니다. mode 차이를 추상화하되, 사용자가
          보안과 장애 책임의 차이를 확인할 수 있는 진단 정보는 숨기지 않아야
          합니다.
        </p>
      </div>
    </section>
  );
}
