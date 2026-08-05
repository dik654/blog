import type { ReactNode } from 'react';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import OpenClawMessageLab from './OpenClawMessageLab';

const sourceRevision = '4e5bf66fb18a5f1b7767ad0e159e98d4fbde04b6';
const sourceRoot = `https://github.com/openclaw/openclaw/blob/${sourceRevision}`;

function Milestone({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-16 scroll-mt-20">
      <div className="not-prose mb-5 grid gap-2 border-b border-border pb-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
        <span className="font-mono text-3xl font-black text-muted-foreground/35">{number}</span>
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function ContractLine({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[9rem_minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-4">
      <strong className="text-sm">{label}</strong>
      <code className="min-w-0 break-words text-xs leading-6 [overflow-wrap:anywhere]">{value}</code>
      <p className="text-sm leading-6 text-muted-foreground">{note}</p>
    </div>
  );
}

const skillSources = [
  ['01', 'Workspace', '<workspace>/skills', '현재 agent workspace가 같은 이름을 가장 먼저 덮어쓴다.'],
  ['02', 'Project agent', '<workspace>/.agents/skills', '프로젝트의 agent 공통 절차를 둔다.'],
  ['03', 'Personal agent', '~/.agents/skills', '사용자 계정의 여러 workspace에서 재사용한다.'],
  ['04', 'Managed/local', '~/.openclaw/skills', 'OpenClaw 로컬 관리 범위에 둔다.'],
  ['05', 'Bundled·extra', 'install + extraDirs', '배포 기본값과 명시적으로 추가한 경로다.'],
] as const;

export default function OpenClawAssistantArticle() {
  return (
    <>
      <BeginnerBridge title="메신저 알림 한 건은 문 앞의 초인종일 뿐이다">
        초인종이 울렸다고 낯선 사람에게 집 열쇠와 서류함을 바로 내주지는 않는다. 개인용 AI assistant도 message를 받은 뒤 <strong>보낸 사람 확인, 대화방 선택, 허용된 작업 실행, 응답 전달 확인</strong>을 차례로 거쳐야 한다. 이 글은 그 전체 흐름을 맡는 OpenClaw의 Gateway부터 읽는다.
      </BeginnerBridge>
      <QuestionLead
        question="모델 API에 Telegram이나 Slack을 붙이면 개인용 AI assistant가 완성될까?"
        answer={<>아니다. 개인 assistant는 누가 들어올 수 있는지, 어느 대화 상태를 열지, 어떤 effect를 허용할지, 응답이 실제 채널에 전달됐는지를 오래 살아 있는 <strong>Gateway runtime</strong>이 책임해야 한다. OpenClaw의 핵심은 model보다 이 경계를 한 control plane으로 묶는 데 있다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'Gateway', meaning: 'Channel, client, session, runtime과 delivery를 연결하는 장기 실행 control plane.', why: 'Message 한 건이 여러 process와 network 경계를 지나도 같은 책임 흐름을 유지한다.' },
          { term: 'admission', meaning: 'Sender·device가 agent 경계 안으로 들어와도 되는지 먼저 판정하는 단계.', why: '허용되지 않은 message가 private history나 tool에 닿기 전에 끊는다.' },
          { term: 'route · session key', meaning: '이번 turn을 처리할 agent와 불러올 conversation state를 가리키는 식별자.', why: '같은 사람의 연속성은 보존하고 다른 사람·room의 context는 격리한다.' },
          { term: 'embedded runtime', meaning: 'OpenClaw가 소유하는 model discovery, prompt 조립, tool wiring과 agent loop.', why: 'Model text를 실제 tool observation과 다음 turn으로 연결한다.' },
          { term: 'delivery outcome', meaning: '응답 payload가 delivered, suppressed 또는 failed 중 어디까지 갔는지 나타내는 결과.', why: 'Timeout 뒤 중복 전송 없이 안전한 다음 행동을 고르게 한다.' },
        ]}
      />
      <Misconception>
        현재 공개 문서는 OpenClaw가 하나의 내장 agent runtime을 직접 소유한다고 정의한다.
        이전 글의 외부 Pi SDK 중심 설명, 존재하지 않는 <code>ChannelRouter</code> 원문 인용,
        <code>~/.openclaw/sessions/*.jsonl</code>을 활성 세션 저장소로 보는 설명은 현재 revision의
        product contract와 맞지 않는다.
      </Misconception>

      <Milestone number="01" eyebrow="Control plane" title="Gateway는 채팅 relay가 아니라 message 생애주기의 owner다">
        <div id="gateway-contract" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Channel마다 raw event의 모양과 전송 API가 다르다. Telegram update, Slack event와 WebChat
            frame을 model prompt로 바로 바꾸면 sender 검증, 중복 event, session 격리와 전달 실패를
            각 integration이 제각각 처리하게 된다. OpenClaw는 long-lived Gateway를 가운데 두고
            channel adapter가 transport 차이를 번역하도록 한다.
          </p>
          <p>
            중요한 흐름은 특정 함수 한 개가 아니다. 현재 소스도 inbound event, route/session record,
            embedded run, outbound normalization과 durable delivery를 kernel·adapter로 나눈다. 따라서
            “Gateway가 받았다”는 말은 업무 완료가 아니라 다음 owner에게 넘길 envelope를 확보했다는 뜻이다.
          </p>
        </div>
        <OpenClawMessageLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 다섯 단계는 구현 파일명이 바뀌어도 남는 제품 계약이다. 장애를 “OpenClaw가 안 된다”라고
            묶지 말고 admission drop, 잘못된 session key, tool denial, provider send failure 또는
            evidence 누락 중 어디에서 끊겼는지 찾아야 한다.
          </p>
        </div>
      </Milestone>

      <Milestone number="02" eyebrow="Identity before memory" title="Sender 승인, agent 선택, conversation 선택은 서로 다른 판정이다">
        <div id="identity-session" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            첫 질문은 “누구와 대화할까?”가 아니라 “이 sender를 안으로 들여도 될까?”다. DM policy가
            <code>pairing</code>이면 알 수 없는 sender의 원 message는 처리되지 않고 짧은 승인 code만
            발급된다. Pairing 승인은 DM 접근권일 뿐 owner 권한, group 접근권이나 tool 권한을 자동으로
            주지 않는다.
          </p>
          <p>
            Admission을 통과한 뒤에야 route가 <code>agentId</code>와 <code>sessionKey</code>를 만든다.
            기본 personal setup은 여러 DM이 main session을 공유해 편리하지만, 여러 사람이 접속하는
            Gateway에서는 한 사람의 private context가 다른 사람에게 보일 수 있다. 이때
            <code>per-channel-peer</code>는 channel과 sender별로 대화를 격리한다.
          </p>
        </div>
        <div className="not-prose my-7 border-y border-border">
          <ContractLine label="개인 단일 사용자" value='session.dmScope = "main"' note="여러 DM channel의 연속성을 한 main conversation으로 유지한다." />
          <ContractLine label="같은 사람, 여러 channel" value='dmScope = "per-peer" + identityLinks' note="검증한 외부 identity를 canonical peer로 연결할 때만 history를 합친다." />
          <ContractLine label="여러 사용자" value='session.dmScope = "per-channel-peer"' note="Channel과 안정된 sender ID를 함께 session key에 넣어 private context를 격리한다." />
          <ContractLine label="Group·room" value="group / channel conversation address" note="DM과 분리된 room 단위 state를 사용한다. DM pairing과 group authorization도 별도다." />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 사람이라는 추측만으로 session을 합치면 안 된다. Display name은 바뀌거나 충돌할 수 있다.
            Channel이 제공한 안정된 ID, account와 명시적 identity link가 있어야 한다. 반대로 channel만
            다르다는 이유로 무조건 분리하면 사용자가 WhatsApp에서 시작한 일을 Telegram에서 이어 갈 수
            없다. 이 trade-off를 config가 명시적으로 소유한다.
          </p>
        </div>
      </Milestone>

      <Milestone number="03" eyebrow="Decision and effect" title="Workspace·Skill은 판단 재료이고 Tool·Sandbox는 effect 경계다">
        <div id="runtime-effect" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Route가 정해지면 OpenClaw-owned embedded runtime이 session history와 workspace를 조립한다.
            새 session의 첫 turn에는 <code>AGENTS.md</code>, <code>SOUL.md</code>,
            <code>IDENTITY.md</code>, <code>USER.md</code> 같은 bootstrap file이 Project Context에
            들어간다. 이것은 agent가 어떻게 행동해야 하는지를 알려 주지만 capability 자체는 아니다.
          </p>
          <p>
            Skill도 마찬가지다. 같은 이름이 여러 source에 있으면 높은 precedence의 bundle이 선택된다.
            그러나 “파일을 백업하라”는 skill instruction이 선택됐다고 write tool이 생기거나 허용되는
            것은 아니다. Built-in tool은 tool policy를 통과해야 하고, sandbox가 켜진 session에서는
            실제 filesystem·network effect가 별도 runtime 경계 안에서 실행된다.
          </p>
        </div>
        <div className="not-prose my-7 border-y border-border">
          {skillSources.map(([number, source, path, meaning]) => (
            <div key={source} className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.5rem_8rem_12rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-xs font-black text-muted-foreground">{number}</span>
              <strong className="text-sm">{source}</strong>
              <code className="min-w-0 break-words text-xs leading-5 [overflow-wrap:anywhere]">{path}</code>
              <p className="text-sm leading-6 text-muted-foreground">{meaning}</p>
            </div>
          ))}
        </div>
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            ['Instruction', '무엇을 해야 하는가', 'Bootstrap file과 Skill이 판단 방향과 절차를 제공한다.'],
            ['Authorization', '이 action을 시도해도 되는가', 'Tool policy, sender·session 조건과 approval이 proposal을 판정한다.'],
            ['Enforcement', '실제로 어디까지 닿는가', 'Sandbox와 executor가 filesystem, network와 process effect를 제한한다.'],
          ].map(([title, question, detail]) => (
            <div key={title} className="min-w-0 bg-background px-4 py-4">
              <p className="text-xs font-bold uppercase text-muted-foreground">{title}</p>
              <p className="mt-1 text-sm font-bold">{question}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </Milestone>

      <Milestone number="04" eyebrow="Delivery is an effect" title="Model 답변과 사용자가 받은 message 사이에도 commit 경계가 있다">
        <div id="delivery-evidence" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Agent loop가 최종 text를 만들었다고 channel delivery가 끝난 것은 아니다. Outbound layer는
            text, media와 reply metadata를 정규화하고 목적 channel adapter에 넘긴다. Adapter는 provider
            제한에 맞춰 chunking하거나 media를 올리고, message ID와 명시적 outcome을 돌려준다.
          </p>
          <p>
            가장 위험한 경우는 “실패”보다 “모호함”이다. 두 chunk 중 첫 번째가 이미 보였는데 두 번째
            전송에서 timeout이 났다면 전체 payload를 다시 보내면 중복 effect가 생긴다. 현재 source의
            durable delivery 경계가 partial visibility를 결과에 남기는 이유도 caller가 blind fallback을
            하지 않게 하기 위해서다.
          </p>
        </div>
        <ol className="not-prose my-7 divide-y divide-border border-y border-border">
          {[
            ['01', 'Payload를 식별한다', 'Channel, destination, logical reply와 각 chunk·media의 identity를 남긴다.'],
            ['02', '전달 결과를 분류한다', 'Delivered, suppressed, failed와 이미 visible한 부분을 구분한다.'],
            ['03', '모호한 timeout을 멈춘다', '“응답 없음 = effect 없음”으로 추정하지 않고 provider receipt나 조회 근거를 찾는다.'],
            ['04', 'Retry 단위를 줄인다', '안전하다고 확인된 미전달 부분만 재개하거나 사용자 확인으로 escalation한다.'],
            ['05', '업무 상태와 연결한다', 'Agent text, tool effect와 channel delivery를 별도 trace로 보존해 end-to-end verdict를 낸다.'],
          ].map(([number, title, detail]) => (
            <li key={number} className="grid gap-2 py-4 sm:grid-cols-[3rem_12rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-xl font-black text-muted-foreground/45">{number}</span>
              <strong className="text-sm">{title}</strong>
              <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
            </li>
          ))}
        </ol>
      </Milestone>

      <Milestone number="05" eyebrow="Durability and exceptions" title="Session 저장, transcript 보관과 incognito의 범위를 분리한다">
        <div id="durable-verification" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            현재 OpenClaw에서 활성 session row와 model-visible history의 1차 저장소는 agent별
            <code>~/.openclaw/agents/&lt;agentId&gt;/agent/openclaw-agent.sqlite</code>다.
            <code>.../sessions/</code> 아래 transcript file은 migration input, archive, import·export와
            support artifact로 남을 수 있지만 활성 state의 source of truth로 보면 안 된다.
          </p>
          <p>
            Incognito thread는 session entry, transcript와 compaction state를 process memory에 두고
            Gateway restart 때 사라진다. 그러나 normal tool을 제한하지는 않는다. Incognito 안에서
            write tool로 workspace file을 만들었다면 그 file은 session store 밖의 effect이므로 남는다.
            Provider가 message를 처리하는 사실과 diagnostic logging도 별도 경계다.
          </p>
          <p>
            따라서 “기억하지 마”라는 UX를 검증할 때 SQLite row만 찾으면 부족하다. Session storage,
            workspace file, 외부 API effect, provider 처리와 audit metadata를 각각 확인해야 한다.
          </p>
        </div>
        <StopRule>
          모든 channel plugin과 과거 package 계보를 내려가지 않는다. Admission, route/session,
          runtime/effect, delivery, evidence 중 장애의 owner를 고르고, current source에서 그 계약을
          검증할 수 있으면 다음 보안·운영 글로 이동한다.
        </StopRule>
      </Milestone>

      <CapabilityCheck
        items={[
          'Gateway가 단순 relay가 아니라 session·runtime·delivery control plane인 이유를 설명한다.',
          'Sender admission, agent routing과 conversation session을 서로 다른 판정으로 분리한다.',
          'main, per-peer와 per-channel-peer DM scope의 격리 trade-off를 고른다.',
          'Bootstrap·Skill instruction과 Tool capability·Sandbox enforcement를 구분한다.',
          'Partial delivery timeout 뒤 blind retry가 중복 effect를 만드는 이유를 추적한다.',
          'SQLite session state, transcript archive와 incognito tool effect의 범위를 비교한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="claude-code" learningPathId="ai-agent-runtime-cases">Coding agent의 실행 경계</InternalLink></span>
        <span>보강: <InternalLink slug="prompt-injection-defense" learningPathId="ai-agent-system-core">신뢰하지 않는 content와 effect 차단</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'OpenClaw · Agent runtime', href: `${sourceRoot}/docs/concepts/agent.md`, note: 'OpenClaw-owned embedded runtime, workspace bootstrap, built-in tools와 skill source precedence.' },
          { label: 'OpenClaw · Session management', href: `${sourceRoot}/docs/concepts/session.md`, note: 'DM scope, identity links, SQLite session rows, transcript archive와 incognito의 현재 계약.' },
          { label: 'OpenClaw · Gateway architecture', href: `${sourceRoot}/docs/concepts/architecture.md`, note: 'Gateway, control-plane client, node와 WebSocket protocol의 책임.' },
          { label: 'OpenClaw · Pairing', href: `${sourceRoot}/docs/channels/pairing.md`, note: 'DM admission, pairing request와 DM·group·owner 권한의 분리.' },
          { label: 'OpenClaw · Skills', href: `${sourceRoot}/docs/tools/skills.md`, note: 'Skill discovery, 같은 이름의 precedence와 loading contract.' },
          { label: 'OpenClaw · Sandboxing', href: `${sourceRoot}/docs/gateway/sandboxing.md`, note: 'Tool policy와 별개인 runtime isolation 범위.' },
          { label: 'OpenClaw · Current inbound boundary', href: `${sourceRoot}/src/channels/message/inbound-reply-dispatch.ts`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 현재 turn kernel, session record와 delivery adapter의 source boundary.` },
        ]}
      />
    </>
  );
}
