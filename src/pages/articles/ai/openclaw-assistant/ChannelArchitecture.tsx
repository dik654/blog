import { CodeViewButton } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const ROUTE_STAGES = [
  {
    stage: "1 · Inbound normalize",
    a: "Telegram event + user A + chat A",
    b: "Slack event + user B + thread B",
  },
  {
    stage: "2 · Authenticate / allowlist",
    a: "Telegram identity가 허용 목록에 있는지 검사",
    b: "Slack identity와 workspace/channel policy 검사",
  },
  {
    stage: "3 · Deterministic binding",
    a: "binding 규칙으로 agent-report 선택",
    b: "binding 규칙으로 agent-customer 선택",
  },
  {
    stage: "4 · Session scope",
    a: "telegram + user-a session key",
    b: "slack + user-b session key",
  },
  {
    stage: "5 · Execute / return",
    a: "typed result → 보존된 Telegram reply route",
    b: "typed result → 보존된 Slack reply route",
  },
] as const;

export default function ChannelArchitecture({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold">
        channel adapter는 차이를 흡수하지만 identity를 지우지 않습니다
      </h3>
      <p>
        Telegram과 Slack의 event payload는 서로 다르므로 adapter가 공통 inbound shape로 정규화합니다. 다만 공통 형식으로 바꾸더라도 channel,
        account, peer, thread 같은 identity와 reply metadata는 그대로 남깁니다. 이 정보가 allowlist, binding, session scope,
        최종 delivery를 결정하기 때문입니다.
      </p>
      <p>
        channel의 pairing·DM/group policy·allowlist가 message를 받아들인 다음에
        binding을 평가합니다. 구체적인 peer나 group-space match가 account
        fallback보다 우선하고, 같은 specificity tier에서는 config에 먼저 적힌
        binding이 이깁니다. <code>accountId</code>를 생략하면 default account만
        match하므로 channel 전체 fallback은 <code>accountId: &quot;*&quot;</code>로 명시해야
        합니다. 어떤 binding도 맞지 않으면 <code>default: true</code> agent가
        처리하며, 변경 후에는 Gateway를 다시 시작하고 agent roster와 channel
        probe로 실제 선택 결과를 확인합니다.
      </p>

      <div className="not-prose my-6 min-w-0 space-y-3">
        {ROUTE_STAGES.map((item) => (
          <article
            key={item.stage}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h4 className="break-words text-sm font-semibold">{item.stage}</h4>
            <div className="mt-3 grid min-w-0 gap-3 text-xs leading-5 sm:grid-cols-2">
              <p className="min-w-0 break-words">
                <strong>Telegram A:</strong>{" "}
                <span className="text-muted-foreground">{item.a}</span>
              </p>
              <p className="min-w-0 break-words">
                <strong>Slack B:</strong>{" "}
                <span className="text-muted-foreground">{item.b}</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      <p>
        model이 작성하는 것은 reply content입니다. delivery target은 Gateway가
        inbound event에서 보존한 route와 policy로 정합니다. model output에
        <code>channel: &quot;slack&quot;</code> 같은 문자열이 들어 있다는 이유로 Telegram
        A의 응답을 Slack B에게 보내면, 자연어가 control plane을 덮어쓴 셈이
        됩니다. channel 전환이 필요한 tool은 별도의 schema, 권한, 승인 경계를
        가져야 합니다.
      </p>

      <div
        id="paper-openclaw-agent-bindings"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Agent bindings
        </p>
        <CitationBlock
          source="OpenClaw Docs — Agent Bindings"
          citeKey={6}
          type="paper"
          href="https://docs.openclaw.ai/concepts/agent-bindings"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 한 Gateway가 여러 channel account와 conversation을 받을 때 어느 agent가 답할지 재현 가능한 규칙이 필요합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> binding이 channel, account, peer, guild, team, role 같은 사실을 match해 agentId를 선택하고 specificity와 config order로 precedence를 정합니다.</p>
            <p><strong>전제·조건:</strong> channel이 pairing, allowlist, account rule로 message를 이미 받아들인 뒤에 binding을 평가하며, 참조하는 agent와 account가 실제로 구성돼 있어야 합니다.</p>
            <p><strong>근거 범위:</strong> default agent와 특정 traffic slice의 deterministic routing, binding precedence를 설명하는 공식 근거입니다.</p>
            <p><strong>비주장:</strong> binding이 channel account를 생성하거나 사용자 접근 권한을 부여하고, session isolation까지 자동으로 보장한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      {onCodeRef && (
        <aside className="not-prose my-6 rounded-lg border border-border/70 bg-muted/20 p-4">
          <p className="text-sm font-semibold">분석용 channel-router 스냅샷</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            아래 코드는 이 저장소에 함께 보관된 설명용 스냅샷입니다. 현재 OpenClaw의 public API나 파일 경로가 그대로 유지된다는 증거는 아닙니다. 위의 공식 문서 계약을
            이해하기 위한 보조 자료로만 씁니다.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <CodeViewButton
              onClick={() =>
                onCodeRef("oc-channel-router", codeRefs["oc-channel-router"])
              }
            />
          </div>
        </aside>
      )}
    </>
  );
}
