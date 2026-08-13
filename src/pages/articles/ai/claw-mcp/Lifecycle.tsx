import McpLifecycleViz from "./viz/McpLifecycleViz";

export default function Lifecycle() {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Legacy MCP lifecycle과 현재 specification 구분하기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          분석한 Claw Code snapshot의 <code>McpLifecycleValidator</code>는
          process spawn, handshake, capability 조회, ready, shutdown과 failure를
          11개 내부 상태로 나눕니다. 이 숫자는 MCP가 요구하는 표준 상태 수가
          아니라, 비동기 작업의 중간 상태와 복구 경로를 관측하기 위한 이
          클라이언트의 구현 선택입니다.
        </p>
        <p className="leading-7">
          또한 이 구현은 <code>initialize</code> 요청과
          <code>notifications/initialized</code> 알림을 사용하는 2025 계열
          lifecycle을 전제로 합니다. 2026-07-28 MCP revision은 handshake와
          session ID를 제거한 stateless core를 도입했으므로, 새 client를 설계할
          때 이 상태 기계를 그대로 복사해서는 안 됩니다. 아래 구조는 legacy
          server와의 호환과 migration을 이해하는 자료입니다.
        </p>

        <div className="not-prose my-8">
          <McpLifecycleViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          내부 상태와 wire protocol 상태는 다르다
        </h3>
        <p className="leading-7">
          <code>Spawning</code>, <code>CapabilityListing</code>,
          <code>Degraded</code> 같은 이름은 client 내부의 operation state입니다.
          wire protocol은 JSON-RPC request·response·notification을 정의하지만,
          process가 시작되는 중인지 또는 일부 기능만 사용할지까지 같은 enum으로
          강제하지 않습니다. 내부 상태는 timeout, UI 표시, retry와 resource
          cleanup을 일관되게 만들기 위해 존재합니다.
        </p>
        <p className="leading-7">
          상태를 많이 나눈다고 자동으로 안전해지는 것은 아닙니다. 각 상태에
          진입할 수 있는 event, 허용하는 operation, 빠져나가는 조건과 cleanup
          책임이 명확해야 합니다. 전이 규칙이 코드 곳곳에 흩어지면 enum은 많지만
          실제 lifecycle은 검증하기 어려워집니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          legacy handshake에서는 순서가 protocol invariant다
        </h3>
        <p className="leading-7">
          2025 lifecycle에서 client는 먼저 <code>initialize</code>로 protocol
          version, client 정보와 capability를 보내고 server의 응답을 받은 다음
          <code>notifications/initialized</code>를 전송합니다. 그 전에는 ping을
          제외한 일반 request를 보내지 않는 것이 protocol 규칙입니다. snapshot의
          lifecycle validator는 이 순서를 내부 상태 전이로 강제합니다.
        </p>
        <ol className="leading-7">
          <li>stdio server process를 시작하고 stream을 확보합니다.</li>
          <li>
            initialize request와 response로 version·capability를 확인합니다.
          </li>
          <li>initialized notification 이후 지원되는 기능만 조회합니다.</li>
          <li>tool catalog를 내부 registry에 연결한 뒤 호출을 허용합니다.</li>
        </ol>
        <p className="leading-7">
          server가 광고하지 않은 capability의 method를 추측해서 호출하면 안
          됩니다. 반대로 tools는 정상인데 resources를 지원하지 않는 server를
          전체 실패로 처리할 필요도 없습니다. 필수 capability와 선택
          capability를 구분해야 graceful degradation이 의미를 가집니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Degraded는 실패를 숨기는 상태가 아니다
        </h3>
        <p className="leading-7">
          일부 기능만 실패했을 때 <code>Degraded</code>로 계속 운영하려면 사용
          가능한 capability와 실패한 capability가 명시적으로 분리돼야 합니다.
          tool list를 가져오지 못했는데 ready처럼 보이게 하거나, required
          capability 협상에 실패했는데 연결을 유지하면 이후 오류가 더 멀리서
          발생합니다.
        </p>
        <p className="leading-7">
          상태 event에는 server 이름, protocol revision, 실패 phase, retry
          횟수와 root cause를 남깁니다. UI에는 “연결됨” 하나만 보여 주지 않고
          어떤 기능을 사용할 수 없는지 알려야 모델과 사용자가 잘못된 tool을 계속
          선택하지 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          timeout과 shutdown도 전이의 일부다
        </h3>
        <p className="leading-7">
          MCP는 request마다 timeout을 두고, 기다리기를 중단할 때 cancellation을
          알리도록 권장합니다. 고정된 5초·10초를 보편값으로 쓰기보다 spawn,
          initialize, tool call처럼 operation별로 설정하고 progress
          notification이 와도 전체 최대 시간은 제한합니다.
        </p>
        <p className="leading-7">
          legacy stdio shutdown에서는 stdin을 먼저 닫고 process 종료를 기다린
          뒤, 필요할 때 SIGTERM과 SIGKILL 순으로 escalation합니다. reader task와
          pending request도 함께 종료해 기다리는 caller가 영원히 남지 않게 해야
          합니다. 최신 stateless revision으로 옮길 때는 이 process lifecycle은
          유지하되 protocol handshake state를 분리하거나 제거하는 migration이
          필요합니다.
        </p>
      </div>
    </section>
  );
}
