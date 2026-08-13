import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";

const CONTROL_PLANES = [
  {
    name: "Tool policy",
    question: "무엇을 호출할 수 있는가?",
    example: "Slack B agent에서 shell을 deny하면 sandbox가 있어도 shell tool을 호출할 수 없음",
  },
  {
    name: "Sandbox",
    question: "허용된 tool이 어디서 실행되는가?",
    example: "host workspace 대신 격리 workspace에서 실행하고 mount access를 none/ro/rw로 정함",
  },
  {
    name: "Elevated",
    question: "exec를 예외적으로 host에서 실행할 것인가?",
    example: "sandbox 밖으로 나오는 명시적 escape hatch이며 승인과 audit가 필요",
  },
] as const;

export default function SubAgentSandbox({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold">
        tool policy가 먼저이고 sandbox는 실행 위치를 바꿉니다
      </h3>
      <p>
        sandbox를 “에이전트 전체가 별도 서버로 이동한다”고 생각하면 책임이
        뒤집힙니다. OpenClaw Gateway는 계속 host에서 channel connection,
        session, routing을 관리하고, 허용된 tool execution만 configured backend로
        옮깁니다. sandbox는 optional이며 기본적으로 꺼져 있을 수 있으므로, 켰다고
        가정하지 말고 실제 resolved configuration을 확인해야 합니다.
      </p>

      <div className="not-prose my-6 grid min-w-0 gap-3 lg:grid-cols-3">
        {CONTROL_PLANES.map((item) => (
          <article
            key={item.name}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h4 className="break-words text-sm font-semibold">{item.name}</h4>
            <p className="mt-2 break-words text-xs font-medium">{item.question}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {item.example}
            </p>
          </article>
        ))}
      </div>

      <div className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2">
        <article className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
          <h4 className="text-sm font-semibold">기본 설정을 읽는 세 축</h4>
          <dl className="mt-3 grid min-w-0 gap-3 text-xs leading-5 text-muted-foreground">
            <div><dt className="font-semibold text-foreground">mode</dt><dd className="mt-1"><code>off</code>는 host 실행, <code>non-main</code>은 main 이외 session, <code>all</code>은 모든 session의 tool을 sandbox 대상으로 삼습니다.</dd></div>
            <div><dt className="font-semibold text-foreground">scope</dt><dd className="mt-1"><code>session</code>은 session별, <code>agent</code>는 agent별, <code>shared</code>는 공유 container 수명을 정합니다.</dd></div>
            <div><dt className="font-semibold text-foreground">backend</dt><dd className="mt-1"><code>docker</code> 같은 실제 실행 backend를 고르며, 설정했는데 backend를 사용할 수 없으면 host로 조용히 넘어가지 않아야 합니다.</dd></div>
          </dl>
        </article>
        <article className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
          <h4 className="text-sm font-semibold">Gateway·node 예외 경로</h4>
          <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">
            Tool이 Gateway host나 연결된 node에서 실행될 수 있더라도 먼저 tool
            policy를 통과해야 합니다. <code>elevated</code> exec는 허용된 sender와
            approval·audit 조건을 만족할 때만 쓰는 host escape이며, deny된 tool을
            되살리는 규칙이 아닙니다.
          </p>
        </article>
      </div>

      <p>
        unsandboxed agent의 <strong>workspace</strong>는 기본 working directory이며
        agent의 파일 context와 project 지침이 놓이는 곳입니다. sandbox를 켜면
        tool이 보는 working directory는 sandbox workspace와
        <code>workspaceAccess</code> 설정에 따라 달라집니다. 이름이 같아 보여도
        host workspace와 sandbox filesystem은 같은 경계가 아닙니다.
      </p>
      <p>
        평가 순서는 “sandbox에서 실행해 본 뒤 policy로 막기”가 아닙니다. deny가
        우선하는 tool policy로 호출 가능성을 먼저 제한하고, 통과한 tool만
        sandbox 여부와 mount를 해석합니다. <strong>elevated</strong>는 exec를
        sandbox 밖 host에서 실행하는 예외 경로지만 tool allow/deny를 우회하지
        않습니다. 이 구조와 network·secret·RBAC까지의 확장은
        <Link to="/ai/agent-sandbox-security"> agent sandbox security</Link>에서
        다룹니다.
      </p>

      <div
        id="paper-openclaw-sandboxing"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Sandboxing
        </p>
        <CitationBlock
          source="OpenClaw Docs — Sandboxing"
          citeKey={7}
          type="paper"
          href="https://docs.openclaw.ai/gateway/sandboxing"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> file·shell·browser tool을 host에서 직접 실행하면 prompt injection이나 실수의 영향이 운영 계정과 filesystem으로 번질 수 있습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Gateway는 host에 남겨 두고 tool execution의 위치와 workspace access를 sandbox mode·scope·backend로 분리합니다.</p>
            <p><strong>전제·조건:</strong> sandbox는 optional이며 완전한 security boundary가 아닙니다. plugin·MCP 같은 Gateway-side tool도 policy로 제한하고 network·secret 경계를 별도로 설계해야 합니다.</p>
            <p><strong>근거 범위:</strong> sandbox가 적용되는 범위, workspace access, elevated escape의 공식 동작을 설명합니다.</p>
            <p><strong>비주장:</strong> sandbox가 channel 인증, session isolation, tool allow/deny, 외부 egress 통제를 자동으로 해결한다는 주장은 하지 않습니다.</p>
          </div>
        </CitationBlock>
      </div>
    </>
  );
}
