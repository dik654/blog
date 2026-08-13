import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";

const SESSION_CASES = [
  {
    scope: "main (기본 DM 동작)",
    a: "agent:assistant:main",
    b: "agent:assistant:main",
    result: "A와 B가 같은 history를 볼 수 있어 multi-user 환경에서 위험",
  },
  {
    scope: "per-channel-peer",
    a: "agent:assistant:telegram:dm:user-a",
    b: "agent:assistant:slack:dm:user-b",
    result: "channel과 peer별로 history가 갈라짐",
  },
] as const;

export default function EmbeddedAgent({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold">
        binding과 session key는 서로 다른 질문에 답합니다
      </h3>
      <p>
        <strong>binding</strong>은 이 inbound message를 어느 agent가 처리할지
        고릅니다. 반면 <strong>session key</strong>는 그 agent 안에서 어느 대화
        상태를 불러올지 고릅니다. 둘 다 deterministic routing 정보이며, 사용자가
        권한을 얻었다는 증명은 아닙니다. 인증과 allowlist를 먼저 통과해야 하는
        이유입니다.
      </p>
      <p>
        여기서 놓치기 쉬운 기본값이 있습니다. OpenClaw는 기본적으로 direct
        message를 main session에 모을 수 있습니다. 한 사람만 쓰는 personal
        assistant라면 연속성이 편하지만, Telegram 사용자 A와 Slack 사용자 B가
        같은 Gateway를 함께 쓰면 이전 대화가 섞일 수 있습니다. 여러 사용자를
        받을 때는 <code>session.dmScope: &quot;per-channel-peer&quot;</code>처럼 channel과
        peer를 key에 포함시켜야 합니다.
      </p>

      <div className="not-prose my-6 min-w-0 rounded-lg border border-border/70 bg-muted/20 p-4">
        <h4 className="text-sm font-semibold">DM scope를 고르는 기준</h4>
        <dl className="mt-3 grid min-w-0 gap-3 text-xs leading-5 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="font-semibold">main</dt>
            <dd className="mt-1 break-words text-muted-foreground">모든 DM이 같은 main history를 이어 씁니다. 신뢰하는 단일 사용자에게 맞습니다.</dd>
          </div>
          <div className="min-w-0">
            <dt className="font-semibold">per-peer</dt>
            <dd className="mt-1 break-words text-muted-foreground">peer별로 나누되 같은 canonical peer가 여러 channel에서 이어질 수 있습니다.</dd>
          </div>
          <div className="min-w-0">
            <dt className="font-semibold">per-channel-peer</dt>
            <dd className="mt-1 break-words text-muted-foreground">channel과 peer 조합별로 나눠 Telegram A와 Slack B를 분리합니다.</dd>
          </div>
          <div className="min-w-0">
            <dt className="font-semibold">per-account-channel-peer</dt>
            <dd className="mt-1 break-words text-muted-foreground">같은 channel의 여러 bot account까지 분리해야 할 때 account를 key에 추가합니다.</dd>
          </div>
        </dl>
        <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">
          같은 사람의 Slack·Telegram identity를 이어 붙이려면 검증된
          <code> identityLinks</code>로 canonical peer를 연결해야 합니다. display
          name이 같다는 이유로 합치면 안 됩니다. group과 room은 별도 session을
          사용하고 scheduled/cron run은 대화 DM과 다른 fresh session lifecycle로
          다룹니다.
        </p>
      </div>

      <div className="not-prose my-6 grid min-w-0 gap-3 lg:grid-cols-2">
        {SESSION_CASES.map((item) => (
          <article
            key={item.scope}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h4 className="break-words text-sm font-semibold">{item.scope}</h4>
            <dl className="mt-3 space-y-2 text-xs leading-5">
              <div className="min-w-0">
                <dt className="font-semibold">Telegram A</dt>
                <dd className="break-all text-muted-foreground">{item.a}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-semibold">Slack B</dt>
                <dd className="break-all text-muted-foreground">{item.b}</dd>
              </div>
              <div className="min-w-0 border-t border-border/70 pt-2">
                <dt className="font-semibold">결과</dt>
                <dd className="break-words text-muted-foreground">{item.result}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        위 문자열은 scope 차이를 보여 주기 위한 설명용 key입니다. 실제 저장 key의
        직렬화 형식은 설치 version의 resolved session state에서 확인해야 하며,
        이 예시를 public API로 사용해서는 안 됩니다.
      </p>

      <p>
        현재 active session row는 agent별 SQLite database인
        <code>~/.openclaw/agents/&lt;agentId&gt;/agent/openclaw-agent.sqlite</code>에
        저장됩니다. <code>sessions/</code>는 archived transcript 파일을 두는
        위치이고, <code>sessions.json</code>과 과거 JSONL은 이전 설치를
        migration하기 위한 legacy source입니다. 따라서 active state를
        <code>sessions.json</code>이 계속 소유한다고 설명하면 현재 구조와 다릅니다.
      </p>

      <div
        id="paper-openclaw-session-management"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Session management
        </p>
        <CitationBlock
          source="OpenClaw Docs — Session Management"
          citeKey={5}
          type="paper"
          href="https://docs.openclaw.ai/concepts/session"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> channel과 사용자가 늘어나면 같은 agent의 history가 어느 대화에 속하는지, 언제 reset되는지, 어디에 저장되는지 명확해야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Gateway가 session state를 소유하고 dmScope로 direct-message key 범위를 선택하며, active row를 agent별 SQLite에 보관합니다.</p>
            <p><strong>전제·조건:</strong> 기본 main DM은 trusted single-user 연속성에 맞으며, multi-user inbound라면 per-channel-peer 또는 더 강한 격리를 명시해야 합니다.</p>
            <p><strong>근거 범위:</strong> session key 생성, reset/lifecycle, 현재 SQLite 위치와 legacy migration source를 설명하는 공식 근거입니다.</p>
            <p><strong>비주장:</strong> session key가 발신자 인증을 대신하거나 서로 적대적인 사용자를 하나의 OS/Gateway 안에서 안전하게 격리한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>
    </>
  );
}
