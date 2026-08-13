import MisdeliveryViz from "./viz/MisdeliveryViz";

const deliveryStates = [
  {
    title: "Sent",
    body: "transport에 bytes를 기록했지만 worker 수신은 아직 확인하지 못했습니다.",
  },
  {
    title: "Received",
    body: "worker가 같은 message ID를 수신했다고 acknowledgement를 보냈습니다.",
  },
  {
    title: "Started",
    body: "해당 task generation으로 실행을 시작했습니다.",
  },
  {
    title: "Terminal",
    body: "completed·failed·cancelled 중 하나와 artifact를 남겼습니다.",
  },
] as const;

export default function Misdelivery() {
  return (
    <section id="misdelivery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        작업 전달은 message identity와 acknowledgement로 확인한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          worker channel에 prompt를 썼다는 사실은 올바른 worker가 올바른 시점에
          작업을 받았다는 뜻이 아닙니다. 이전 process의 늦은 event, 준비되지
          않은 terminal, partial write와 재시도 때문에 같은 작업이 누락되거나
          중복될 수 있습니다. 이 글에서는 이런 전달 실패를 misdelivery로 묶어
          다룹니다.
        </p>
        <p className="leading-7">
          화면에 prompt 문자열이 다시 나타나는 echo-back은 terminal이 bytes를
          표시했다는 보조 신호일 뿐, worker가 request를 parse하고 소유했다는
          acknowledgement가 아닙니다. 가능하면 message ID, worker generation과
          task attempt를 포함한 structured protocol로 전달 상태를 구분해야
          합니다.
        </p>

        <div className="not-prose my-8">
          <MisdeliveryViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {deliveryStates.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          현재 세대가 아닌 늦은 메시지는 상태에 반영하지 않는다
        </h3>
        <p className="leading-7">
          worker가 재시작되면 같은 logical worker name을 쓰더라도 새로운
          generation을 발급합니다. request와 event에는 <code>worker_id</code>,
          generation,
          <code>task_id</code>, attempt를 함께 넣고, registry의 현재
          generation과 다른 message는 state에 반영하지 않습니다.
        </p>
        <p className="leading-7">
          acknowledgement도 같은 identity tuple을 되돌려줘야 합니다. 그래야 다른
          task의 화면 출력이나 이전 실행의 늦은 result를 현재 prompt의 수신
          확인으로 잘못 해석하지 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          retry 전에 idempotency를 설계한다
        </h3>
        <p className="leading-7">
          acknowledgement가 timeout됐다고 같은 prompt를 바로 다시 보내면 첫
          요청이 늦게 처리되어 side effect가 두 번 발생할 수 있습니다. worker는
          task ID별 실행 기록을 두고 같은 attempt를 중복 실행하지 않거나,
          coordinator가 새 attempt를 발급하기 전에 이전 실행을 조회·취소해야
          합니다.
        </p>
        <p className="leading-7">
          backoff는 transport 과부하를 줄일 뿐 exactly-once delivery를 보장하지
          않습니다. read-only 조사와 write 작업의 retry policy를 나누고, write는
          commit·transaction·deduplication key 같은 복구 경계를 먼저 마련합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          임의의 Enter 입력은 자동 복구로 사용하지 않는다
        </h3>
        <p className="leading-7">
          대화형 prompt에서 Enter는 기본 선택을 실행할 수 있으므로, 상태를 모른
          채 보내면 삭제나 설치를 승인할 위험이 있습니다. 예상한 prompt type과
          안전한 response가 protocol로 확인되지 않으면 worker를{" "}
          <code>WaitingInput</code>으로 두고 사용자나 coordinator에
          escalation합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          restart는 새 attempt이며 진행 상태를 자동 승계하지 않는다
        </h3>
        <p className="leading-7">
          worker를 재시작할 때는 먼저 graceful cancellation을 보내고 정해진
          시간이 지나면 process group을 강제 종료합니다. terminal과 credential을
          회수한 뒤 새 generation으로 boot·trust·ready 검증을 다시 수행합니다.
        </p>
        <p className="leading-7">
          이전 worker가 남긴 partial artifact는 검증한 뒤에만 새 attempt
          입력으로 사용합니다. 재시작 자체를 성공 복구로 기록하지 않고, 새
          worker가 완료 contract를 통과했을 때 비로소 recovered로 집계합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          telemetry는 rate보다 원인 분포를 보여 준다
        </h3>
        <p className="leading-7">
          전체 send 수와 timeout 수만 보면 transport 지연, stale generation,
          duplicate execution과 worker crash를 구분할 수 없습니다. delivery
          단계별 latency, retry reason, generation mismatch와 terminal state를
          나눠 기록하고, prompt나 화면 dump에는 secret redaction과 짧은
          retention을 적용합니다.
        </p>
      </div>
    </section>
  );
}
