import { InternalLink } from '@/components/learning/ArticleLearning';
import TelemetryArchViz from './viz/TelemetryArchViz';

const eventVariants = [
  ['HttpRequestStarted', 'attempt, method, path와 attributes를 담는다.'],
  ['HttpRequestSucceeded', 'status와 선택적 request_id를 추가한다.'],
  ['HttpRequestFailed', 'error와 retryable 판정을 추가한다.'],
  ['Analytics', 'namespace, action, properties를 담는다.'],
  ['SessionTrace', 'session_id, sequence, name, timestamp, attributes를 담는다.'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Telemetry는 자동으로 켜지는 관제망이 아니라 opt-in 동기 함수 호출이다</h2>
          <p>
            <code>ConversationRuntime::new</code>의 <code>session_tracer</code>는 <code>None</code>이다.
            호출자가 <code>with_session_tracer</code>를 사용해야 turn 시작·실패·완료와 tool 시작·완료
            record가 생긴다. 따라서 event type이 정의되어 있다는 사실만으로 모든 runtime이 추적된다고
            말할 수 없다.
          </p>
          <p>
            활성화된 뒤에도 중심 계약은 <code>TelemetrySink::record(event)</code> 한 메서드다.
            queue나 worker thread로 넘기지 않고 현재 call stack에서 sink를 호출한다. sink가 느리면
            producer도 기다리고, JSONL sink의 I/O가 실패하면 오류는 조용히 사라진다.
          </p>
        </div>
        <TelemetryArchViz />
      </section>

      <section id="event-topology" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>다섯 event variant와 한 논리 사건의 두 envelope를 구분한다</h2>
          <p>
            HTTP helper는 전용 typed event를 먼저 sink에 넣고, 같은 사실을 검색 가능한
            <code>SessionTrace</code>로 한 번 더 넣는다. Analytics helper도 같은 구조다. 따라서 “HTTP
            시작을 한 번 기록했다”는 호출은 sink 관점에서 두 번의 <code>record</code>다.
          </p>
        </div>
        <dl className="not-prose my-6 divide-y divide-border border-y border-border">
          {eventVariants.map(([variant, meaning]) => (
            <div key={variant} className="grid gap-1 py-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
              <dt className="font-mono text-xs font-bold">{variant}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">{meaning}</dd>
            </div>
          ))}
        </dl>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>sequence는 typed event 전체의 전역 번호가 아니다</h3>
          <p>
            counter는 <code>SessionTracer::record</code>가 <code>SessionTraceRecord</code>를 만들 때만
            증가한다. HTTP typed envelope에는 sequence field가 없다. 같은 tracer를 clone하면
            <code>Arc&lt;AtomicU64&gt;</code>를 공유하므로 trace 번호는 공유하지만, 다른 tracer·session과의
            전역 순서는 보장하지 않는다.
          </p>
          <p>
            counter는 0부터 시작하고 <code>fetch_add</code>가 증가 전 값을 반환한다. 따라서 첫 trace는
            sequence 0이다. “첫 event는 1”이라고 가정하면 replay나 test expectation이 한 칸 어긋난다.
          </p>
          <h3>세 helper 호출을 직접 세면 envelope와 sequence 차이가 보인다</h3>
          <p>
            sequence 0에서 HTTP-started helper를 부르면 typed HTTP event가 먼저 기록되고, 이어
            sequence 0인 SessionTrace가 기록된다. 그다음 direct trace는 sequence 1 한 건이다.
            마지막 analytics helper는 typed Analytics와 sequence 2인 SessionTrace 두 건을 남긴다.
            논리 호출은 세 번이지만 sink 호출은 다섯 번이며 sequence가 붙는 record는 세 개뿐이다.
          </p>
          <p>
            이 계산은 중복 제거에도 영향을 준다. typed envelope와 companion trace에 공통 event id가
            없으므로 둘을 서로 다른 두 사건으로 세어도, 반대로 무조건 한 사건으로 합쳐도 오류가 난다.
            한쪽 write가 유실된 경우를 표현할 방법도 없다. production schema에는 logical event id와
            envelope kind를 함께 넣어 partial delivery를 판정할 수 있어야 한다.
          </p>
        </div>
      </section>

      <section id="sink-contract" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Memory와 JSONL은 저장 방식이 다르지만 delivery receipt는 둘 다 없다</h2>
        </div>
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="min-w-0 bg-background p-5">
            <strong className="text-sm">MemoryTelemetrySink</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              <code>Mutex&lt;Vec&lt;TelemetryEvent&gt;&gt;</code>에 event를 push한다. test에서 전체 복제가
              편하지만 capacity, eviction, spill 정책이 없어 장기 process에서는 계속 커질 수 있다.
            </p>
          </div>
          <div className="min-w-0 bg-background p-5">
            <strong className="text-sm">JsonlTelemetrySink</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              event마다 serialize, <code>writeln</code>, <code>flush</code>를 수행한다. serialize와 I/O
              오류는 반환하지 않는다. 호출 지연은 생길 수 있지만 성공 여부는 producer가 알 수 없다.
            </p>
          </div>
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>침묵하는 실패는 격리이자 관측 공백이다</h3>
          <p>
            JSONL write failure가 agent의 <code>run_turn</code>을 실패시키지 않는 것은 장점이다.
            그러나 “record가 정상 반환했다”는 사실로 파일에 line이 존재한다고 증명할 수 없다. 운영
            시스템이 at-least-once 또는 durable delivery를 요구한다면 sink API가 receipt나 error를
            표현하고, queue·retry·dead-letter 정책까지 함께 가져야 한다.
          </p>
          <p>
            같은 iteration에서 같은 이름의 tool이 두 번 호출되는 경우도 현재 필드만으로는
            started와 completed를 정확히 짝지을 수 없다. 배열 순서에 기대면 concurrency나 유실이 생긴
            순간 잘못 연결된다. 각 시도에 <code>tool_call_id</code>를 부여하고 start·finish·effect
            receipt가 그 id를 공유해야 latency와 성공률도 의미 있는 값이 된다.
          </p>
        </div>
      </section>

      <section id="production-handoff" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Exporter를 붙이기 전에 여섯 계약을 먼저 정한다</h2>
          <p>
            remote exporter를 추가할 때는 queue capacity, overflow, retry, ordering, shutdown drain,
            redaction owner를 정해야 한다. 현재 enum에는 token/cost event도 없고
            <code>ConversationRuntime</code>의 <code>UsageTracker</code>는 별도 field이므로, usage
            추적과 이 telemetry crate를 자동으로 같은 subsystem이라고 합치면 안 된다.
          </p>
          <h3>순서가 보여도 인과가 자동으로 복원되지는 않는다</h3>
          <p>
            현재 <code>SessionTraceRecord</code>는 session id와 sequence를 가지지만 parent event,
            task·agent·lane, tool call, intent·action·recovery id를 갖지 않는다. tool 시작과 완료도
            iteration과 tool name만으로는 같은 iteration의 동일 이름 호출 두 개를 안전하게 짝지을 수
            없다. HTTP typed envelope와 뒤따르는 SessionTrace 사이에도 공통 event id가 없으므로 둘 중
            하나만 쓰인 partial record를 논리 사건 하나로 확정할 수 없다.
          </p>
          <p>
            production trace는 전파 가능한 trace id와 parent 또는 link, 각 호출의 고유 operation id,
            발생 시각을 가져야 한다. 한 envelope가 없거나 sink가 opt-out인 경우는 성공도 실패도 아닌
            <strong>UNKNOWN</strong>이다. “로그에 실패가 없음”을 “실패하지 않음”으로 바꾸지 않는 것이
            recovery와 release gate로 넘길 때의 핵심 계약이다.
          </p>
          <p>
            관측 completeness도 별도 evidence로 남겨야 한다. 예를 들어 turn-start는 있지만 turn-finish가
            없을 때 agent failure, process crash, sink loss 중 무엇인지 현재 event만으로 고를 수 없다.
            exporter health와 마지막 storage acknowledgement를 함께 보존하고, 증거 구간이 끊긴 실행은
            평가 대상에서 성공으로 집계하지 않아야 한다. telemetry는 실행의 진실 그 자체가 아니라
            진실을 추론할 수 있게 하는 불완전한 관찰 채널이다.
          </p>
          <p>
            trace를 평가 증거로 승격하는 방법은
            <InternalLink slug="agent-evaluation-trace">Agent Evaluation Trace</InternalLink>에서,
            관측한 실패를 제한된 다음 행동으로 닫는 방법은
            <InternalLink slug="claw-recovery">Bounded Recovery</InternalLink>에서 이어 읽는다.
          </p>
        </div>
      </section>
    </>
  );
}
