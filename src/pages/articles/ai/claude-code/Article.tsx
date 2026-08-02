import type { ReactNode } from 'react';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import ClaudeCodeBoundaryLab from './ClaudeCodeBoundaryLab';

const sourceRevision = '7ef6eec9d9ba84ea6f233f26c45f1df5c5991843';

const permissionModes = [
  ['Manual · default', '읽기 전용 기본 동작을 제외하고 필요한 action을 사람에게 묻는다.', '사람이 매번 effect 경계를 확인해야 하는 일반 작업.'],
  ['acceptEdits', '작업 범위 안의 파일 편집과 제한된 파일 명령을 자동 승인한다.', 'diff를 사후 검토하면서 편집 흐름을 끊지 않을 때.'],
  ['plan', '조사와 계획을 우선하고 편집을 막는다. 승인 뒤 실행 mode로 전환한다.', '무엇을 바꿀지 먼저 합의해야 할 때.'],
  ['auto', '지원되는 계정·모델에서 별도 classifier가 action을 검토한다.', '반복 prompt를 줄이되 민감한 effect에는 여전히 검토가 필요할 때.'],
  ['dontAsk', '원래 질문해야 할 호출을 자동 거부하고 미리 허용한 action만 실행한다.', '사람 응답을 기다릴 수 없는 제한된 CI 환경.'],
  ['bypassPermissions', '대부분의 permission check를 건너뛴다. 격리 환경 전용이다.', 'host와 network가 따로 격리된 container·VM 같은 환경.'],
] as const;

const contextSurfaces = [
  ['CLAUDE.md', 'session 시작과 이후 요청', '프로젝트 규칙과 지속 context', '내용이 길수록 매 turn 비용이 커진다.'],
  ['Skill', '설명은 시작 시, 본문은 호출 시', '필요할 때만 전문 지식과 workflow를 연다.', '설명만 보고 잘못 선택할 수 있으므로 trigger를 구체화한다.'],
  ['MCP', 'tool 이름은 연결 시, schema는 필요할 때', '외부 서비스의 typed tool surface를 더한다.', '도구 발견이 실행 허가나 성공을 뜻하지 않는다.'],
  ['Subagent', 'task를 분리할 때', '별도 context에서 탐색·검증을 수행한다.', 'main conversation 전체를 자동 상속하지 않는다.'],
  ['Hook', 'lifecycle event가 발생할 때', '검사·기록·자동화를 conversation 밖에서 실행한다.', 'hook의 side effect와 실패 정책을 별도로 관리한다.'],
] as const;

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
          <p className="text-[10px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function CodeExcerpt({ label, children }: { label: string; children: string }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-md border border-border bg-muted/15">
      <div className="border-b border-border px-4 py-2 font-mono text-[10px] font-bold text-muted-foreground">
        {label}
      </div>
      <pre className="m-0 overflow-x-auto p-4 text-[11px] leading-6 sm:text-xs"><code>{children}</code></pre>
    </div>
  );
}

export default function ClaudeCodeArticle() {
  return (
    <>
      <QuestionLead
        question="Claude Code가 파일을 고치고 테스트까지 하는 이유는 model이 답을 길게 쓰기 때문일까?"
        answer={<>아니다. model은 다음 행동을 <strong>제안</strong>하고, 제품 runtime은 permission을 판정한 뒤 tool을 실행하고, 그 observation을 다시 model에 전달한다. 이 반복과 effect 경계가 일반 채팅을 coding agent로 바꾼다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'tool proposal', meaning: '모델이 출력한 도구 이름과 구조화된 인자.', why: '모델의 의도와 실제 실행을 분리한다.' },
          { term: 'permission decision', meaning: '이 session에서 어떤 tool·path·domain을 실행할지 정하는 정책 판정.', why: '행동을 실행하기 전에 사용자와 조직의 권한을 적용한다.' },
          { term: 'sandbox', meaning: 'Bash와 자식 process가 접근할 filesystem·network를 OS 수준에서 제한하는 경계.', why: '모델 판단이 틀려도 effect 범위를 줄인다.' },
          { term: 'observation', meaning: 'stdout, stderr, exit status와 파일 변화처럼 tool이 실제로 반환한 결과.', why: '다음 model turn이 추측 대신 실행 결과를 보게 한다.' },
          { term: 'session context', meaning: '현재 대화, project instructions, tool 정보와 필요한 코드 조각을 이어 가는 상태.', why: '여러 tool call이 같은 목표와 근거를 공유하게 한다.' },
        ]}
      />
      <Misconception>
        공개 <code>anthropics/claude-code</code> 저장소는 README, changelog와 plugin 예시를 제공하지만
        proprietary runtime 구현 전체를 공개하지 않는다. 이 글은 비공개 내부 파일을 추정하지 않고
        공식 문서가 보장하는 product contract만 설명한다.
      </Misconception>

      <Milestone number="01" eyebrow="Runtime contract" title="한 번의 coding turn을 제안, 허용, 실행, 관찰로 나눈다">
        <div id="execution-contract" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            사용자가 “validator를 고치고 관련 테스트를 실행해”라고 말하면 model은 곧바로 파일을
            바꾸는 주체가 아니다. 먼저 session이 목표와 context를 구성하고, model이 Read, Edit,
            Bash 같은 tool call을 제안한다. 제품은 현재 permission rule과 mode를 적용하고,
            Bash라면 sandbox boundary 안에서 명령을 실행한다. 결과가 observation으로 돌아와야
            model이 다음 행동 또는 최종 응답을 고를 수 있다.
          </p>
          <p>
            아래 네 단계에서 중요한 것은 화살표 수가 아니라 owner의 교대다. “Claude가 실행했다”라는
            한 문장을 model, policy, executor와 verifier로 풀어야 실패 지점을 찾을 수 있다.
          </p>
        </div>
        <ClaudeCodeBoundaryLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Loop 횟수나 subagent 수를 고정 사양처럼 외울 필요는 없다. 제품 버전, model, 설정과
            작업에 따라 달라진다. 더 오래 남는 지식은 각 turn에 tool proposal과 observation이 있고,
            effect 직전에 별도 permission·enforcement 경계가 있다는 사실이다.
          </p>
        </div>
      </Milestone>

      <Milestone number="02" eyebrow="Authorization and enforcement" title="Permission mode와 sandbox는 같은 안전장치가 아니다">
        <div id="permission-sandbox" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Permission rule은 “이 tool을 시도해도 되는가”를 판정한다. 현재 공식 문서의 rule은
            <code>deny</code>, <code>ask</code>, <code>allow</code> 순서로 평가되며 먼저 일치한
            강한 제약이 적용된다. 반면 sandbox는 허용된 Bash command와 그 자식 process가 실제로
            닿을 수 있는 filesystem과 network를 제한한다.
          </p>
          <p>
            예를 들어 <code>Bash(npm test)</code>가 allow rule에 맞더라도 test script가 sandbox
            밖의 파일을 쓰거나 허용되지 않은 domain에 연결하면 OS 경계에서 실패할 수 있다.
            반대로 built-in Edit는 Bash child process가 아니므로 sandbox가 아니라 Edit permission
            rule과 project write scope가 직접 통제한다.
          </p>
        </div>
        <CodeExcerpt label=".claude/settings.json · rule의 역할 예시">{`{
  "permissions": {
    "allow": ["Bash(npm test *)", "Edit(/src/**)"],
    "ask":  ["Bash(git push *)"],
    "deny": ["Read(./.env)", "Edit(/infra/prod/**)"]
  },
  "sandbox": {
    "enabled": true,
    "network": { "allowedDomains": ["registry.npmjs.org"] }
  }
}`}</CodeExcerpt>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {permissionModes.map(([mode, behavior, use]) => (
            <div key={mode} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)_minmax(0,0.9fr)] sm:gap-4">
              <strong className="break-words font-mono text-xs [overflow-wrap:anywhere]">{mode}</strong>
              <p className="text-sm leading-6 text-muted-foreground">{behavior}</p>
              <p className="text-sm leading-6"><span className="font-semibold">적합한 경계:</span> {use}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 mode들은 “안전 점수 1단계부터 6단계”가 아니다. <code>plan</code>은 실행 전에 설계를
            분리하고, <code>dontAsk</code>는 질문이 필요한 행동을 거절하며, <code>auto</code>는
            지원 환경에서 classifier 판정을 추가한다. <code>bypassPermissions</code>는 이름 그대로
            일반 permission check를 크게 건너뛰므로 host와 network가 이미 격리된 환경에서만 고려한다.
          </p>
        </div>
      </Milestone>

      <Milestone number="03" eyebrow="Context economy" title="확장 기능은 언제 context와 effect를 여는지로 구분한다">
        <div id="context-extensions" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            CLAUDE.md, Skill, MCP, subagent와 hook을 모두 “기능 추가”로 묶으면 context 비용과 side
            effect 위치를 놓친다. CLAUDE.md는 지속 instructions, Skill은 필요할 때 펼치는 지식,
            MCP는 외부 tool surface, subagent는 분리된 context, hook은 lifecycle 밖의 automation이다.
          </p>
        </div>
        <div className="not-prose my-7 border-y border-border">
          {contextSurfaces.map(([surface, load, role, risk], index) => (
            <div
              key={surface}
              className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.5rem_7rem_9rem_minmax(0,1fr)] sm:gap-4"
            >
              <span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <strong className="text-sm">{surface}</strong>
              <p className="text-xs leading-5 text-muted-foreground">{load}</p>
              <div className="min-w-0 text-sm leading-6">
                <p>{role}</p>
                <p className="mt-1 text-muted-foreground"><strong className="text-foreground">주의:</strong> {risk}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            특히 MCP tool 이름이 보인다는 사실은 server 연결과 discovery를 뜻할 뿐이다. 필요한 schema가
            context에 로드되고 permission을 통과해 tool이 실제 실행된 뒤 result가 돌아와야 effect가
            성립한다. Subagent도 main conversation 전체를 자동 상속하지 않으므로, lead가 필요한
            파일과 acceptance를 task prompt에 넣고 결과를 다시 검증해야 한다.
          </p>
        </div>
      </Milestone>

      <Milestone number="04" eyebrow="Verification" title="마지막 답변이 아니라 diff, test 의미와 부작용을 읽는다">
        <div id="verification" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Agent가 “수정했고 테스트가 통과했다”고 말하는 것은 유용한 보고지만 terminal receipt 전체는
            아니다. <code>exit 0</code>은 실행한 command가 성공 상태로 끝났음을 보여 준다. 그러나 관련
            test가 실제 acceptance를 덮는지, 잘못된 test를 삭제하지 않았는지, 예상하지 않은 파일과
            network에 effect를 만들지 않았는지는 별도 evidence가 필요하다.
          </p>
        </div>
        <ol className="not-prose my-7 divide-y divide-border border-y border-border">
          {[
            ['01', '범위를 고정한다', '요청한 파일, 금지된 경로와 성공 조건을 먼저 적는다.'],
            ['02', '제안을 effect와 분리한다', 'tool name과 arguments를 읽고 permission decision 전에는 실행됐다고 세지 않는다.'],
            ['03', '실행 결과를 확인한다', 'exit status, stdout·stderr, sandbox denial과 tool error를 observation으로 보존한다.'],
            ['04', 'artifact를 다시 읽는다', 'git diff와 변경 파일 목록으로 요청 밖 수정, test 약화와 설정 변경을 찾는다.'],
            ['05', 'acceptance를 독립 판정한다', '관련 test와 typecheck를 다시 실행하고 사용자 목표가 충족됐는지 별도 verdict를 낸다.'],
          ].map(([number, title, detail]) => (
            <li key={number} className="grid gap-2 py-4 sm:grid-cols-[3rem_11rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-xl font-black text-muted-foreground/45">{number}</span>
              <strong className="text-sm">{title}</strong>
              <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
            </li>
          ))}
        </ol>
        <StopRule>
          Claude Code의 proprietary loop를 추정하거나 release마다 바뀌는 평균 수치를 외우지 않는다.
          Proposal, permission, sandboxed effect, observation과 acceptance evidence의 owner를 구분할 수
          있으면 다음 제품 사례로 이동한다.
        </StopRule>
      </Milestone>

      <CapabilityCheck
        items={[
          '모델의 tool proposal과 실제 side effect를 구분한다.',
          'permission rule, permission mode와 Bash sandbox의 역할을 따로 설명한다.',
          'plan, acceptEdits, auto, dontAsk와 bypassPermissions를 공식 명칭으로 구분한다.',
          'CLAUDE.md, Skill, MCP, subagent와 hook의 loading 시점을 비교한다.',
          'tool result와 agent의 최종 문장이 서로 다른 evidence인 이유를 말한다.',
          '공개 product contract와 비공개 runtime 구현 추정을 구분한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="agent-frameworks" learningPathId="ai-agent-runtime-cases">Runtime 소유권으로 고르기</InternalLink></span>
        <span>다음: <InternalLink slug="openclaw-assistant" learningPathId="ai-agent-runtime-cases">Personal agent의 delivery 경계</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claude Code · Permissions', href: 'https://code.claude.com/docs/en/permissions', note: 'allow·ask·deny rule, path scope, managed policy와 sandbox 상호작용.' },
          { label: 'Claude Code · Permission modes', href: 'https://code.claude.com/docs/en/permission-modes', note: 'Manual/default, acceptEdits, plan, auto, dontAsk와 bypassPermissions의 현재 공식 의미.' },
          { label: 'Claude Code · Sandboxing', href: 'https://code.claude.com/docs/en/sandboxing', note: 'Bash child process의 filesystem·network 격리와 built-in file tool과의 경계.' },
          { label: 'Claude Code · Feature loading', href: 'https://code.claude.com/docs/en/features-overview', note: 'CLAUDE.md, Skill, MCP, subagent와 hook이 context에 들어오는 시점.' },
          { label: 'Anthropic Claude Code public repository', href: `https://github.com/anthropics/claude-code/tree/${sourceRevision}`, note: `검산 revision ${sourceRevision.slice(0, 10)}. README, changelog와 공식 plugin 예시의 공개 범위.` },
        ]}
      />
    </>
  );
}
