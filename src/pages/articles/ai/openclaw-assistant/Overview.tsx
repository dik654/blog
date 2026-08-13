import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import GatewayViz from "./viz/GatewayViz";
import ComparisonTable from "./ComparisonTable";
import type { CodeRef } from "@/components/code/types";

const GLOSSARY = [
  [
    "Channel",
    "Telegram·Slack처럼 메시지가 들어오고 답장이 나가는 접점입니다. 모델이나 실행 엔진을 뜻하지 않습니다.",
  ],
  [
    "Gateway",
    "채널 연결, 인증, binding, session key, 실행 요청, 답장 목적지를 한 control plane에서 관리하는 호스트 프로세스입니다.",
  ],
  [
    "Agent",
    "workspace·model·tool policy 같은 실행 설정을 묶는 논리적 단위입니다. 사용자를 곧바로 뜻하지 않습니다.",
  ],
  [
    "Session",
    "대화 이력과 수명주기를 묶는 상태 단위입니다. session key는 어느 상태를 읽을지 고르는 주소이지 인증 수단은 아닙니다.",
  ],
  [
    "Provider · model",
    "provider는 인증과 모델 카탈로그를, model은 이번 turn에 사용할 구체적 모델을 가리킵니다.",
  ],
  [
    "Runtime · harness",
    "runtime은 준비된 model turn을 실제로 돌리는 loop이고, harness는 그 runtime을 구현한 코드입니다.",
  ],
] as const;

const FIXED_SCENARIO = [
  ["Telegram", "사용자 A", "월말 보고서 초안을 만들어 줘"],
  ["Slack", "사용자 B", "첨부한 월말 보고서를 고객용으로 요약해 줘"],
] as const;

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        OpenClaw는 모델이 아니라, 메시지와 에이전트 실행을 연결하는 Gateway입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Telegram 사용자 A와 Slack 사용자 B가 거의 동시에 요청을 보냈다고
          해보겠습니다. 이때 가장 먼저 필요한 일은 “어느 LLM을 부를까”가
          아닙니다. 누가 보냈는지 확인하고, 허용된 사용자인지 판정하고, 어느
          agent와 어느 대화 상태에 연결할지 정한 뒤에야 model turn을 시작할 수
          있습니다. OpenClaw에서 이 앞뒤 경로를 소유하는 구성요소가
          <strong> Gateway</strong>입니다.
        </p>
        <p>
          여기서는 한 조직이 신뢰 경계를 함께 관리하는 두 endpoint를 예로 들되,
          A와 B의 대화 상태는 분리해야 한다고 가정합니다. 서로 적대적인 사용자를
          같은 개인 assistant에 넣어도 안전하다는 예가 아닙니다. 그런 환경은
          뒤에서 살펴보듯 OS 계정과 Gateway부터 분리해야 합니다.
        </p>
        <p>
          글 전체는 같은 두 요청을 따라갑니다. Telegram 사용자 A의 이력과 Slack
          사용자 B의 이력이 섞이지 않아야 하고, model이 tool을 호출하더라도
          policy와 sandbox 경계를 넘어서는 안 됩니다. 실행이 끝난 뒤에는 model이
          “Slack으로 보낼지 Telegram으로 보낼지” 고르는 것이 아니라, Gateway가
          원래 inbound route를 보존해 각 사용자에게 결과를 돌려보냅니다.
        </p>
      </div>

      <ContentBoundary article="openclaw-assistant" />

      <div className="not-prose my-8 min-w-0">
        <GatewayViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 이름이 비슷한 네 층을 분리합니다</h3>
        <p>
          “OpenClaw가 Claude를 쓴다”라는 한 문장에는 channel, provider, model,
          runtime이 뒤섞이기 쉽습니다. 아래 정의를 분리해 두면 model 교체가
          session 격리를 바꾸지 않고, runtime 교체가 답장 route를 가져가지 않는
          이유를 이해할 수 있습니다.
        </p>
      </div>

      <dl className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GLOSSARY.map(([term, description]) => (
          <div
            key={term}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <dt className="break-words text-sm font-semibold">{term}</dt>
            <dd className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {description}
            </dd>
          </div>
        ))}
      </dl>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>두 요청이 지나가는 고정 경로</h3>
        <p>
          두 사용자의 자연어는 달라도 처리 순서는 같습니다. 채널 adapter가 원시
          event를 정규화하면 Gateway가 인증과 allowlist를 적용하고, deterministic
          binding으로 agent를 고릅니다. 이어 session key로 서로 다른 상태를
          불러온 다음 provider·model과 runtime을 해석하고, skills와 tools를 붙인
          loop를 policy 아래에서 실행합니다. 마지막 결과는 typed result로
          Gateway에 돌아오며, Gateway가 보존해 둔 reply route로 전달합니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {FIXED_SCENARIO.map(([channel, user, request]) => (
          <article
            key={`${channel}-${user}`}
            className="min-w-0 rounded-lg border border-border/70 bg-muted/20 p-4"
          >
            <p className="text-xs font-semibold text-primary">
              {channel} · {user}
            </p>
            <p className="mt-2 break-words text-sm font-medium">“{request}”</p>
            <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">
              auth/allowlist → binding → isolated session key → model/runtime →
              tools/policy → typed result → 원래 {channel} route
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>이 글에서 재사용하는 기반 지식</h3>
        <p>
          agent loop의 일반 원리, context를 고르는 법, skill의 progressive
          disclosure, 임의 코드 실행 격리는 각각 정본 글에서 설명합니다. 이
          글에서는 그 개념을 다시 증명하기보다 OpenClaw에서 누가 어느 책임을
          갖는지에 집중합니다.
        </p>
      </div>

      <nav
        aria-label="OpenClaw 선행 개념"
        className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2"
      >
        {[
          ["Agent framework", "/ai/agent-frameworks", "tool loop와 stateful workflow의 일반 구조"],
          ["Context engineering", "/ai/context-engineering", "대화 이력·compaction·memory의 선택 경계"],
          ["Skills anatomy", "/ai/skills-anatomy", "SKILL.md와 progressive disclosure"],
          ["Agent sandbox security", "/ai/agent-sandbox-security", "policy·sandbox·egress를 겹쳐 쓰는 이유"],
        ].map(([label, href, description]) => (
          <Link
            key={href}
            to={href}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4 transition-colors hover:border-primary/50"
          >
            <span className="text-sm font-semibold text-foreground">{label}</span>
            <span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">
              {description}
            </span>
          </Link>
        ))}
      </nav>

      <div
        id="paper-openclaw-gateway-architecture"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · OpenClaw Architecture
        </p>
        <CitationBlock
          source="OpenClaw Docs — Architecture"
          citeKey={1}
          type="paper"
          href="https://docs.openclaw.ai/concepts/architecture"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 여러 channel과 client가 같은 assistant를 사용할 때 연결·인증·session·event 책임이 흩어지기 쉽습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> 하나의 장기 실행 Gateway가 messaging surface와 typed WebSocket API를 소유하고 operator·node client를 연결합니다.</p>
            <p><strong>전제·조건:</strong> Gateway에 연결되는 client는 connect handshake와 역할·scope·인증 조건을 만족해야 하며, deployment의 trust boundary를 먼저 정해야 합니다.</p>
            <p><strong>근거 범위:</strong> Gateway 중심 control plane과 client 연결의 공식 구조를 설명하는 근거입니다.</p>
            <p><strong>비주장:</strong> 특정 channel, provider, model이 다른 선택지보다 항상 빠르거나 안전하다는 비교 근거는 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div
        id="paper-openclaw-gateway-protocol"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Gateway protocol
        </p>
        <CitationBlock
          source="OpenClaw Docs — Gateway Protocol"
          citeKey={2}
          type="paper"
          href="https://docs.openclaw.ai/gateway/protocol"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 요청, 응답, event와 side effect가 같은 연결을 지날 때 형식과 재시도 의미가 모호하면 중복 실행과 상태 불일치가 생깁니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> req·res·event frame을 schema로 구분하고 side-effecting method에는 idempotency key를 요구합니다.</p>
            <p><strong>전제·조건:</strong> handshake에서 protocol version, role, scope, auth, device 정보를 검증하며 event gap이 생기면 client가 state를 새로 조회해야 합니다.</p>
            <p><strong>근거 범위:</strong> Gateway와 client/node 사이의 typed transport 계약을 뒷받침합니다.</p>
            <p><strong>비주장:</strong> model의 자연어 응답이 자동으로 사실이 되거나 tool side effect 자체가 되돌릴 수 있다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div
        id="paper-openclaw-security"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Security model
        </p>
        <CitationBlock
          source="OpenClaw Docs — Security"
          citeKey={3}
          type="paper"
          href="https://docs.openclaw.ai/gateway/security"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 자연어 prompt만으로 신원, session 격리, tool 권한을 통제하면 prompt injection이나 잘못된 routing을 보안 경계로 착각하게 됩니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> identity를 먼저 확인하고 scope·policy를 적용한 뒤 model을 실행하며, channel allowlist와 tool policy 같은 hard control을 prompt와 분리합니다.</p>
            <p><strong>전제·조건:</strong> OpenClaw는 기본적으로 한 trusted operator의 personal assistant trust model을 가정합니다. 서로 적대적인 사용자는 OS·Gateway 자체를 분리해야 합니다.</p>
            <p><strong>근거 범위:</strong> session key가 인증이 아니라는 점과 multi-user deployment의 경계를 정하는 근거입니다.</p>
            <p><strong>비주장:</strong> sandbox 하나만 켜면 plugin, network, secret, channel 권한까지 자동으로 안전해진다는 주장은 하지 않습니다.</p>
          </div>
        </CitationBlock>
      </div>

      <ComparisonTable />
    </section>
  );
}
