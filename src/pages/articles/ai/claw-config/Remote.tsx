import RemoteViz from "./viz/RemoteViz";
import WsProtocolViz from "./viz/WsProtocolViz";
import { CitationBlock } from "@/components/ui/citation";

const sourceBoundary = [
  ["환경 해석", "remote flag·session ID·base URL과 proxy enable flag를 읽는다"],
  ["활성 조건", "remote·proxy·session ID·token이 모두 있을 때만 proxy state를 켠다"],
  ["연결 재료", "WebSocket URL, CA bundle과 subprocess proxy 환경 변수를 조립한다"],
  ["구현 밖", "socket transport·ack/replay·permission binding은 이 source에 없다"],
] as const;

export default function Remote() {
  return (
    <section id="remote" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Remote helper와 원격 세션 protocol은 서로 다른 계층이다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <strong>upstream proxy</strong>는 application의 외부 API 요청을 중간
          process로 보내는 연결 방식입니다. pinned <code>remote.rs</code>는 remote
          mode를 환경 변수에서 읽고, token file·CA bundle·proxy URL을 조립해
          subprocess 환경으로 전달합니다. 여기까지는 연결을 준비하는 bootstrap
          data이며 WebSocket session protocol 전체는 아닙니다.
        </p>
        <p className="leading-7">
          따라서 이 글은 먼저 현재 구현이 실제로 보장하는 활성 조건을 확인한 뒤,
          장시간 원격 session에 필요하지만 아직 이 파일에서 확인되지 않는
          sequence·ack·resume·permission 계약을 hardening 목표로 확장합니다. 이
          경계를 지우면 URL을 만들었다는 사실을 안전한 remote execution이
          완성됐다는 근거로 오해하게 됩니다.
        </p>

        <div id="paper-claw-remote-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code remote proxy bootstrap @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/remote.rs"
            citeKey={5}
            type="code"
          >
            <p>
              <strong>문제:</strong> remote upstream proxy에 필요한 환경, token,
              CA와 URL을 결정적으로 조립합니다. <strong>기여:</strong> pinned
              source는 <code>RemoteSessionContext</code>, 네 조건의
              <code>should_enable</code>, ws/wss URL 변환, NO_PROXY 목록과 subprocess
              환경 생성을 구현합니다. <strong>전제:</strong> commit, environment
              map, token·CA path와 base URL을 고정합니다. <strong>근거 범위:</strong>
              proxy bootstrap data와 unit test입니다. <strong>일반화 금지:</strong>
              WebSocket 연결·인증 handshake·message envelope·ack/replay,
              permission binding, redaction과 remote process lifecycle이 구현됐다는
              증거는 아닙니다.
            </p>
          </CitationBlock>
        </div>

        <div className="not-prose my-8">
          <RemoteViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          네 조건이 모두 참일 때만 proxy state를 활성화한다
        </h3>
        <p className="leading-7">
          현재 <code>should_enable</code>은 remote flag, upstream-proxy flag,
          non-empty session ID와 읽을 수 있는 token을 모두 요구합니다. 하나라도
          빠지면 disabled state를 반환하므로 subprocess proxy 환경도 만들지
          않습니다. 이 조건은 “준비 자료가 모두 있다”는 판정일 뿐 token의 서명,
          audience·expiry나 server identity까지 검증했다는 판정은 아닙니다.
        </p>
        <p className="leading-7">
          <code>https://</code> base URL은 <code>wss://</code>로,
          <code>http://</code>는 <code>ws://</code>로 바꾼 뒤 고정 path를 붙입니다.
          문자열 변환과 TLS 인증은 별개입니다. 실제 connector에서는 CA bundle을
          사용해 certificate와 hostname을 검증하고, production에서 평문
          <code>ws://</code>를 허용할지 명시적인 policy가 필요합니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sourceBoundary.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-lg border border-border/70 bg-card p-4"
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
          아래 protocol은 현재 근거가 아니라 다음 hardening 계약이다
        </h3>
        <p className="leading-7">
          장시간 연결에서는 network가 끊긴 뒤 같은 event가 다시 오거나 일부가
          빠질 수 있습니다. 이때 protocol version, session·request identity와
          monotonic sequence를 가진 envelope가 있어야 duplicate와 gap을 구분할 수
          있습니다. Receiver의 마지막 처리 sequence를 ack하고, 보존 범위 안에서
          replay하거나 현재 snapshot을 다시 보내는 규칙도 필요합니다.
        </p>

        <div className="not-prose my-8">
          <WsProtocolViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Permission은 사용자가 본 정확한 action에만 결합한다
        </h3>
        <p className="leading-7">
          원격 runtime이 privileged tool을 실행한다면 prompt에는 canonical
          arguments, resource, session·request·attempt와 만료 시각이 필요합니다.
          허용 결정은 한 번 소비하고, argument나 attempt가 달라지면 다시 승인을
          받아야 합니다. 그렇지 않으면 과거의 모호한 “허용”을 다른 command에
          재사용할 수 있습니다.
        </p>
        <p className="leading-7">
          연결이 끊기면 새 privileged action을 pause하고, 이미 시작한 action은
          명시된 cancellation policy에 따라 처리해야 합니다. 느린 client에는
          bounded queue와 backpressure를 적용하되, permission·tool result·terminal
          state를 text delta처럼 임의로 버려서는 안 됩니다. 이 요구사항은
          <code>remote.rs</code>의 현재 구현 설명이 아니라 release 전에 별도
          protocol test로 증명할 항목입니다.
        </p>
      </div>
    </section>
  );
}
