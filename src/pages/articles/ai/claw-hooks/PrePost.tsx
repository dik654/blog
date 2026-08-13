import PrePostFlowViz from "./viz/PrePostFlowViz";

const eventIdentity = [
  ["event", "event ID·type·causal parent"],
  ["action", "tool·canonical arguments·resource digest"],
  ["context", "session·workspace·actor·attempt"],
  ["budget", "deadline·hook depth·output limit"],
] as const;

export default function PrePost() {
  return (
    <section id="pre-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Pre hook은 실행을 제한하고 Post hook은 결과를 관찰한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <code>PreToolUse</code>는 side effect가 생기기 전에 policy를 더
          엄격하게 만들거나 사용자 확인을 요구할 수 있습니다. 반면
          <code>PostToolUse</code>는 이미 끝난 실행의 result를 기록·검사하는
          지점이므로, 실패를 발견해도 원래 작업을 없던 일로 만들 수는 없습니다.
        </p>
        <p className="leading-7">
          이 차이를 흐리면 post hook의 “deny”가 rollback처럼 보이거나 pre hook이
          기본 permission을 넓히는 우회 통로가 됩니다. event type별로 가능한
          outcome과 failure policy를 제한해야 합니다.
        </p>

        <div className="not-prose my-8">
          <PrePostFlowViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {eventIdentity.map(([title, body]) => (
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
          matcher는 canonical event를 대상으로 평가한다
        </h3>
        <p className="leading-7">
          raw command string에 정규식 하나만 적용하면 quoting과 path 표현에 따라
          같은 action이 다르게 매칭될 수 있습니다. dispatch가 tool input과
          resource를 정규화한 뒤 tool name, effect class, canonical path와 event
          type을 matcher에 전달하는 편이 안정적입니다.
        </p>
        <p className="leading-7">
          hook config를 읽는 시점에 matcher를 compile하고 잘못된 표현은
          fail-fast합니다. 실행 시점에는 matching hook의 stable order와 config
          version을 event에 남겨 같은 요청의 결정을 재현할 수 있게 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Pre hook 결과와 기본 policy는 가장 제한적인 쪽으로 합친다
        </h3>
        <p className="leading-7">
          기본 permission decision과 모든 pre hook 결과를 모은 뒤
          <code>Deny &gt; Prompt &gt; Allow</code> 순으로 결합합니다. 앞 hook이
          deny한 action을 뒤 hook이 allow로 되돌릴 수 없으며, permission
          prompt가 필요하다면 모든 제한 결과가 확정된 뒤 한 번만 사용자에게
          보여줍니다.
        </p>
        <p className="leading-7">
          hook이 arguments를 수정할 수 있게 설계했다면 수정된 action은 새로운
          identity를 가져야 합니다. schema·domain validation과 permission을
          처음부터 다시 통과시키지 않은 채 기존 approval을 재사용해서는 안
          됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Post hook의 실패는 원래 result와 분리한다
        </h3>
        <p className="leading-7">
          audit 전송 실패 때문에 이미 성공한 file write를 실패로 바꾸면 모델이
          같은 write를 다시 실행할 수 있습니다. 원래 tool result와 post hook
          result를 별도 field로 반환하고, 필수 compliance hook이 실패했다면 다음
          action을 block하거나 escalation하되 완료된 side effect는 그대로
          보고합니다.
        </p>
        <p className="leading-7">
          단순 telemetry hook은 명시적으로 fail-open할 수 있지만, secret
          scanner나 release gate처럼 보안·배포를 막는 hook은 fail-closed해야
          합니다. 이 선택은 hook code가 아니라 config의 criticality contract에
          둡니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          재귀 호출과 중첩 깊이를 제한한다
        </h3>
        <p className="leading-7">
          hook이 다시 tool을 호출하면 같은 hook이 재실행돼 무한 루프가 생길 수
          있습니다. causal chain과 hook depth를 event에 넣고, 기본적으로 hook
          process에서 시작된 내부 call은 동일 hook을 다시 호출하지 않게 합니다.
          필요한 중첩은 명시적 allowlist와 작은 depth limit로만 허용합니다.
        </p>
        <p className="leading-7">
          여러 hook은 config에 고정된 순서로 실행하되, 독립적인 read-only hook은
          deadline 안에서 병렬화할 수 있습니다. 결과 결합은 completion order가
          아니라 stable hook order를 사용합니다.
        </p>
      </div>
    </section>
  );
}
