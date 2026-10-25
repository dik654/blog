import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OpenClawPathLocator, OpenClawPathReturn } from "./OpenClawPathLocator";
import OpenClawRequestTraceViz from "./viz/OpenClawRequestTraceViz";
import OpenClawSessionViz from "./viz/OpenClawSessionViz";
import OpenClawRuntimeViz from "./viz/OpenClawRuntimeViz";
import OpenClawToolDeliveryViz from "./viz/OpenClawToolDeliveryViz";

function Evidence({
  id,
  citeKey,
  title,
  href,
  scope,
  boundary,
}: {
  id: string;
  citeKey: number;
  title: string;
  href: string;
  scope: string;
  boundary: string;
}) {
  return (
    <div id={id} className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">공식 근거 · {title}</p>
      <CitationBlock source={`OpenClaw Docs — ${title}`} citeKey={citeKey} type="paper" href={href}>
        <div className="space-y-2 font-sans">
          <p><strong>확인한 범위:</strong> {scope}</p>
          <p><strong>해석 경계:</strong> {boundary}</p>
        </div>
      </CitationBlock>
    </div>
  );
}

const FAILURE_ROWS = [
  ["채널에서 거부", "pairing·allowlist·mention 정책", "binding과 model 실행 전 종료", "채널 정책 로그"],
  ["Agent를 못 고름", "binding과 기본 owner가 없음", "AGENT_SELECTION_REQUIRED", "binding 결과"],
  ["대기 시간 초과", "agent.wait deadline", "실행은 계속될 수 있음", "같은 runId로 다시 조회"],
  ["Tool 거부", "allow/deny policy", "side effect 없음", "tool-policy audit"],
  ["답장 결과가 모호", "전송 뒤 응답 유실", "무조건 재전송하지 않음", "receipt·대화 조회·제한된 복구"],
] as const;

export default function OpenClawAssistantArticle() {
  return (
    <article className="space-y-16">
      <OpenClawPathLocator />

      <section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-7">
        <h2 className="text-2xl font-bold">한 메시지가 같은 대화로 돌아오는 경로</h2>

        <OpenClawRequestTraceViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사용자가 Telegram에서 “월말 보고서 초안을 만들어 줘”라고 보냅니다. OpenClaw는 곧바로 모델부터 호출하지 않습니다. 채널이 메시지를 받아들인 뒤 담당 Agent와 대화 상태를 정하고, 그 결과로 준비한 turn을 runtime에 맡깁니다. 실행이 끝나면 OpenClaw가 보존한 원래 대화 경로로 답장을 보냅니다.
          </p>
          <p className="leading-8">
            이 흐름에서 <strong>Gateway는 모델의 다른 이름이 아닙니다.</strong> 장기 실행되는 Gateway가 메시징 접점과 typed API를 소유합니다. 반면 Agent runtime은 준비된 한 번의 model loop를 실행합니다. 같은 OpenAI 모델을 쓰더라도 runtime을 바꿀 수 있고, runtime을 바꿔도 Telegram 답장 경로가 runtime 소유로 넘어가지는 않습니다.
          </p>
        </div>

        <div className="not-prose grid gap-3 border-y border-border py-5 sm:grid-cols-3">
          <div className="border-l border-primary pl-3">
            <p className="text-xs font-bold">접수 완료</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground"><code>runId</code>와 <code>acceptedAt</code>이 생겼습니다. 답변 생성은 아직 끝나지 않았습니다.</p>
          </div>
          <div className="border-l border-border pl-3">
            <p className="text-xs font-bold">실행 완료</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">같은 <code>runId</code>의 terminal outcome이 생겼습니다. 채널 전달은 별도 결과입니다.</p>
          </div>
          <div className="border-l border-border pl-3">
            <p className="text-xs font-bold">외부 전달 완료</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground"><code>sourceReplyDelivered: true</code>가 원래 외부 대화 도착을 확인합니다.</p>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>그림을 본 뒤 답할 질문</h3>
          <ol>
            <li>Binding이 사용자의 접근을 허용합니까?</li>
            <li><code>agent.wait</code>가 timeout이면 실행도 취소됐습니까?</li>
            <li>Runtime이 끝났다면 Telegram 전달도 성공한 것입니까?</li>
          </ol>
          <p>
            세 답은 모두 <strong>아닙니다.</strong> Binding은 이미 허용된 메시지의 Agent만 고릅니다. 대기 timeout은 실행 취소가 아닙니다. Runtime 완료와 외부 채널 전달도 별도 상태입니다. 뒤에서 각 경계를 확대합니다.
          </p>
        </div>

        <ContentBoundary article="openclaw-assistant" />

        <aside className="not-prose border border-border bg-muted/20 p-4 text-xs leading-6 text-muted-foreground">
          <strong className="text-foreground">버전 경계</strong>
          <p className="mt-1">
            이 글은 2026-10-25에 공식 문서와 최신 안정 릴리스 <a href="https://github.com/openclaw/openclaw/releases/tag/v2026.10.7" target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">v2026.10.7</a>을 대조했습니다. 설치한 버전의 config·protocol·plugin 계약이 다르면 해당 릴리스 문서를 우선해야 합니다.
          </p>
        </aside>

        <Evidence
          id="paper-openclaw-gateway-architecture"
          citeKey={1}
          title="Gateway architecture"
          href="https://docs.openclaw.ai/concepts/architecture"
          scope="하나의 장기 실행 Gateway가 메시징 접점과 typed WebSocket request·response·event를 소유하는 구조를 확인했습니다."
          boundary="Gateway가 sender 권한, 모델 답변의 사실성, 외부 side effect의 정확성을 자동 보장한다는 뜻은 아닙니다."
        />
      </section>

      <section id="routing-sessions" data-teach-level="0" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Agent 선택과 대화 선택</h2>
          <p className="text-lg leading-8">
            채널 정책을 통과한 메시지에 binding을 적용하면 <code>agentId</code>가 정해집니다. 이 Agent가 workspace와 model policy, resulting session을 소유합니다. 그 다음 DM scope가 어느 transcript를 읽고 쓸지 정합니다.
          </p>
        </div>

        <OpenClawSessionViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Binding은 접근 제어가 아닙니다</h3>
          <p>
            Binding은 channel·account·peer·guild·team·role 같은 이미 확인된 사실을 비교해 Agent를 고릅니다. 더 구체적인 match가 우선하고, 같은 구체성에서는 config에 먼저 나온 binding이 이깁니다. 채널이 메시지를 받아들였는지는 pairing·allowlist·account 정책이 먼저 결정합니다.
          </p>
          <p>
            여러 Agent가 있는데 일치하는 binding이나 소유자 기본값이 없으면 <code>AGENT_SELECTION_REQUIRED</code>가 됩니다. 없는 Agent를 가리킨다고 다른 Agent로 조용히 우회하지 않습니다.
          </p>
          <h3>여러 사람이 DM할 수 있다면 기록부터 나눕니다</h3>
          <p>
            기본 <code>main</code>은 모든 DM을 하나의 session에 모읍니다. 개인용 비서에는 편리하지만 여러 사람이 접근하면 한 사람의 내용이 다른 사람의 문맥에 들어갈 수 있습니다. 공식 문서는 이 경우 <code>per-channel-peer</code>를 권장합니다.
          </p>
        </div>

        <pre className="not-prose min-w-0 overflow-x-auto border border-border bg-muted/20 p-4 text-xs leading-6"><code>{`{
  // 채널과 발신자 조합마다 대화 기록을 따로 선택합니다.
  session: {
    dmScope: "per-channel-peer"
  }
}`}</code></pre>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 사람의 Telegram과 Slack 대화를 합치고 싶다면 검증된 <code>identityLinks</code>로 두 신원을 하나의 peer에 연결합니다. 이 연결은 대화 연속성을 위한 명시적 설정입니다. session key를 bearer token처럼 취급하거나 서로 적대적인 tenant를 같은 Gateway에 넣는 보안 경계로 사용해서는 안 됩니다.
          </p>
        </div>

        <Evidence
          id="paper-openclaw-agent-bindings"
          citeKey={2}
          title="Agent bindings"
          href="https://docs.openclaw.ai/concepts/agent-bindings"
          scope="Binding이 채널 수락 뒤 Agent를 선택하고, specificity와 config order로 우선순위를 정하는 현재 규칙을 확인했습니다."
          boundary="Binding은 채널 계정을 만들거나 sender 접근을 승인하지 않습니다."
        />
        <Evidence
          id="paper-openclaw-session-management"
          citeKey={3}
          title="Session management"
          href="https://docs.openclaw.ai/concepts/session"
          scope="main·per-peer·per-channel-peer·per-account-channel-peer의 DM 상태 분리와 identityLinks 경계를 확인했습니다."
          boundary="대화 상태 분리는 host 관리자, credential, tool 권한을 서로 적대적인 tenant 사이에서 격리하지 않습니다."
        />
      </section>

      <section id="runtime-resources" data-teach-level="1" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>접수와 실행</h2>
          <p className="text-lg leading-8">
            Agent와 session을 찾은 뒤 Gateway의 <code>agent</code> RPC가 실행을 접수합니다. 이 호출은 완료될 때까지 연결을 붙잡는 대신 <code>runId</code>와 <code>acceptedAt</code>을 바로 돌려줍니다. 실행 결과는 event stream이나 같은 <code>runId</code>의 <code>agent.wait</code>로 확인합니다.
          </p>
        </div>

        <OpenClawRuntimeViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Provider, model, runtime을 차례로 읽습니다</h3>
          <p>
            Provider는 인증·모델 목록·요청 전송을 담당합니다. Model은 이번 turn이 사용할 구체적인 추론 대상입니다. Agent runtime은 준비된 prompt를 받아 모델 출력과 native tool call을 진행하는 loop이며, harness는 그 runtime을 구현한 코드입니다.
          </p>
        </div>

        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="border-y border-border"><th className="px-3 py-3">층</th><th className="px-3 py-3">소유하는 것</th><th className="px-3 py-3">소유하지 않는 것</th><th className="px-3 py-3">이번 요청에서 남는 값</th></tr></thead>
            <tbody>
              <tr className="border-b border-border"><td className="px-3 py-3 font-bold">Provider</td><td className="px-3 py-3">인증·catalog·transport</td><td className="px-3 py-3">Session routing</td><td className="px-3 py-3">선택된 provider</td></tr>
              <tr className="border-b border-border"><td className="px-3 py-3 font-bold">Model</td><td className="px-3 py-3">추론 대상과 request 설정</td><td className="px-3 py-3">Tool 권한</td><td className="px-3 py-3">선택된 model</td></tr>
              <tr className="border-b border-border"><td className="px-3 py-3 font-bold">Runtime</td><td className="px-3 py-3">준비된 model loop</td><td className="px-3 py-3">Channel delivery</td><td className="px-3 py-3">선택된 runtime</td></tr>
              <tr className="border-b border-border"><td className="px-3 py-3 font-bold">Gateway</td><td className="px-3 py-3">Run 추적·event·답장 경로</td><td className="px-3 py-3">Model 내부 계산</td><td className="px-3 py-3 font-mono">runId</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>같은 runId를 끝까지 유지합니다</h3>
          <p>아래는 공식 호출 순서를 축약한 의사코드입니다. 특정 SDK 함수명이나 wire frame을 복사한 코드는 아닙니다.</p>
        </div>

        <pre className="not-prose min-w-0 overflow-x-auto border border-border bg-muted/20 p-4 text-xs leading-6"><code>{`// 선택된 session의 실행을 Gateway에 접수합니다.
accepted = agent(sessionKey, message)

// 접수 응답에 포함된 실제 추적 키를 보관합니다.
runId = accepted.runId

// 같은 runId의 최종 상태와 답장 증거를 기다립니다.
terminal = agent.wait(runId)

// wait timeout은 실행 취소가 아니므로 같은 runId를 다시 조회합니다.
if terminal.status == "timeout":
    terminal = agent.wait(runId)`}</code></pre>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Runtime은 준비된 prompt와 허용된 tool 목록을 받아 실행합니다. 모델이 tool call을 만들더라도 실제 호출 가능 여부와 실행 위치는 다음 절의 policy가 따로 판단합니다.
          </p>
          <p>
            <code>agent.wait</code>의 기본 대기 시간 안에 결과가 없으면 <code>status: timeout</code>만 돌아올 수 있습니다. 이는 기다림만 끝난 것이므로 같은 <code>runId</code>를 다시 조회합니다. 반대로 runtime의 실행 예산 초과나 명시적 취소는 실제 실행을 끝내는 별도 상태입니다.
          </p>
        </div>

        <Evidence
          id="paper-openclaw-agent-loop"
          citeKey={4}
          title="Agent loop"
          href="https://docs.openclaw.ai/concepts/agent-loop"
          scope="agent RPC의 즉시 접수, runId event stream, agent.wait terminal outcome과 wait-only timeout을 확인했습니다."
          boundary="접수 성공은 모델 실행·tool effect·외부 채널 전달 성공을 뜻하지 않습니다."
        />
        <Evidence
          id="paper-openclaw-agent-runtimes"
          citeKey={5}
          title="Agent runtimes"
          href="https://docs.openclaw.ai/concepts/agent-runtimes"
          scope="Provider·model·runtime·channel의 분리와 OpenClaw embedded runtime·Codex app-server의 서로 다른 loop ownership을 확인했습니다."
          boundary="Runtime 선택만으로 모델 품질, tool 호환성, 외부 전달 성공이 보장되지는 않습니다."
        />
      </section>

      <section id="security-reply" data-teach-level="2" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>도구 효과와 답장 전달</h2>
          <p className="text-lg leading-8">
            모델이 <code>exec</code>를 제안해도 먼저 tool policy가 호출 가능 여부를 판단합니다. 허용된 뒤에야 sandbox policy가 실행 위치를 정합니다. 실행 결과가 생겨도 최종 답장이 원래 대화에 도착했는지는 다시 확인해야 합니다.
          </p>
        </div>

        <OpenClawToolDeliveryViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>세 제어가 답하는 질문은 다릅니다</h3>
          <ul>
            <li><strong>Tool policy:</strong> 어떤 tool이 보이고 호출될 수 있습니까?</li>
            <li><strong>Sandbox:</strong> 허용된 tool을 sandbox backend와 host 중 어디에서 실행합니까?</li>
            <li><strong>Elevated:</strong> 보통 sandbox에서 실행할 <code>exec</code>를 승인 조건 아래 host나 node에서 실행해도 됩니까?</li>
          </ul>
          <p>
            <code>deny</code>가 항상 우선합니다. Elevated는 <code>exec</code> 전용 실행 위치 예외이며 금지된 tool을 되살리지 않습니다. Sandbox를 사용해도 Gateway 프로세스는 host에 남습니다. 또한 기본 sandbox mode는 off이므로, “OpenClaw를 설치했다”는 사실만으로 tool이 container 안에서 실행된다고 가정할 수 없습니다.
          </p>
        </div>

        <pre className="not-prose min-w-0 overflow-x-auto border border-border bg-muted/20 p-4 text-xs leading-6"><code>{`# 현재 session에 실제로 적용된 실행 위치와 tool 정책을 확인합니다.
openclaw sandbox explain --session <session-key>

# 전체 결과를 자동 검사에 사용할 JSON으로 확인합니다.
openclaw sandbox explain --json`}</code></pre>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>실패 상태를 한 칸으로 합치지 않습니다</h3>
          <p>
            “응답 없음”만 기록하면 채널 거부, Agent 선택 실패, 아직 실행 중, tool 거부, 답장 전송 모호성을 구분할 수 없습니다. 같은 요청의 현재 상태와 다음 행동은 아래처럼 달라집니다.
          </p>
        </div>

        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="border-y border-border"><th className="px-3 py-3">관찰</th><th className="px-3 py-3">판정 주체</th><th className="px-3 py-3">현재 상태</th><th className="px-3 py-3">다음 확인</th></tr></thead>
            <tbody>{FAILURE_ROWS.map((row) => <tr key={row[0]} className="border-b border-border">{row.map((cell, index) => <td key={cell} className={`px-3 py-3 ${index === 0 ? "font-bold" : ""}`}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Telegram처럼 전송 뒤 응답이 사라지면 실제 메시지는 도착했을 수 있습니다. 현재 retry 정책은 이런 모호한 전송을 무조건 replay하지 않습니다. 대화와 delivery receipt를 먼저 확인하고, 안전하게 반복할 수 있는 동작만 제한적으로 재시도합니다.
          </p>
          <p>
            OpenClaw는 기본적으로 한 operator 또는 서로 신뢰하는 팀이 관리하는 하나의 Gateway 경계를 가정합니다. Session 분리와 sandbox는 피해 범위를 줄이지만 서로 신뢰하지 않는 조직을 위한 완전한 multi-tenant 경계가 아닙니다. 그런 경우에는 Gateway·credential을 나누고 가능하면 OS 사용자나 host도 분리합니다.
          </p>
        </div>

        <Evidence
          id="paper-openclaw-sandboxing"
          citeKey={6}
          title="Sandbox vs tool policy vs elevated"
          href="https://docs.openclaw.ai/gateway/sandbox-vs-tool-policy-vs-elevated"
          scope="Tool 허용, 실행 위치, exec 전용 elevated 예외가 서로 다른 판정이라는 현재 규칙을 확인했습니다."
          boundary="Sandbox는 Gateway 전체나 적대적 tenant를 자동으로 격리하지 않으며, shell 내부 side effect를 tool 이름만으로 분석하지 않습니다."
        />
        <Evidence
          id="paper-openclaw-channel-routing"
          citeKey={7}
          title="Channel routing"
          href="https://docs.openclaw.ai/channels/channel-routing"
          scope="답장은 메시지가 들어온 채널로 돌아가고 model이 channel을 선택하지 않는 고정 routing 규칙을 확인했습니다."
          boundary="Runtime 완료와 실제 외부 전달 성공은 같은 상태가 아니므로 terminal receipt를 따로 확인해야 합니다."
        />
        <Evidence
          id="paper-openclaw-retry"
          citeKey={8}
          title="Retry policy"
          href="https://docs.openclaw.ai/concepts/retry"
          scope="채널 send의 제한된 재시도와 전송 결과가 모호한 Telegram text send를 자동 replay하지 않는 현재 동작을 확인했습니다."
          boundary="이 정책이 모든 외부 tool side effect에 exactly-once를 보장하는 것은 아닙니다."
        />
      </section>

      <section id="boundary" data-teach-level="B" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>네 경로</h2>
          <ol>
            <li><strong>요청 경로:</strong> Channel policy → binding → session → run 접수</li>
            <li><strong>실행 경로:</strong> Provider/model 해석 → runtime loop → tool event</li>
            <li><strong>효과 경로:</strong> Tool policy → sandbox 위치 → tool result와 외부 효과 증거</li>
            <li><strong>전달 경로:</strong> Terminal outcome → 원래 source route → delivery receipt</li>
          </ol>
          <p>
            한 구성요소가 네 경로를 모두 소유한다고 생각하면 원인과 복구 행동이 뒤섞입니다. 반대로 <code>agentId</code>, session 상태, <code>runId</code>, tool result와 외부 효과 증거, delivery receipt를 구분하면 “어디까지 끝났는가”를 같은 요청에서 설명할 수 있습니다.
          </p>
          <p>
            실제 설치·업그레이드·canary·rollback은 이 개념 글의 범위를 넘습니다. 그런 판단은 설치 버전, 채널 구성, 신뢰 경계, 허용한 tool과 복구 목표를 입력으로 받는 별도 실무 글에서 다룹니다.
          </p>
          <p>
            일반적인 loop와 checkpoint를 먼저 보고 싶다면 <Link to="/cs/ai/agent-frameworks#overview">에이전트 실행 수명</Link>으로, OS·container 격리를 더 깊게 보려면 <Link to="/cs/ai/agent-sandbox-security#overview">에이전트 sandbox 보안</Link>으로 이동하면 됩니다.
          </p>
        </div>
        <OpenClawPathReturn />
      </section>
    </article>
  );
}
