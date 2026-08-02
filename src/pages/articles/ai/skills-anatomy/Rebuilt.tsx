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
import { NlpSection, Takeaway } from '../nlp-shared';
import { SkillLifecycleLab } from './viz/SkillLifecycleLab';

const learningPathId = 'ai-agent-instruction-contract';

function BoundaryRow({
  index,
  owner,
  role,
  cannot,
}: {
  index: string;
  owner: string;
  role: string;
  cannot: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <strong className="text-sm">{owner}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p>{role}</p>
        <p className="mt-1.5 text-xs text-foreground"><strong>소유하지 않는 것:</strong> {cannot}</p>
      </div>
    </div>
  );
}

export default function SkillsAnatomyRebuilt() {
  return (
    <>
      <NlpSection
        id="definition"
        marker="01"
        tone="teal"
        question="Skill, Tool과 Plugin을 높고 낮은 단계로 세우지 않는다"
        title="Skill은 재사용할 절차와 자료이지 새 권한이 아니다"
      >
        <BeginnerBridge title="요리책을 샀다고 식당 주방 열쇠까지 생기지는 않는다">
          레시피는 재료를 어떤 순서로 다룰지 알려 주지만, 냉장고를 열 수 있는 권한이나 실제 칼은 따로 필요하다. AI의 Skill도 <strong>일하는 방법을 적은 절차</strong>이고, Tool은 실제 행동 수단이며, 실행 허용은 host의 정책이 별도로 결정한다.
        </BeginnerBridge>
        <QuestionLead
          question="invoice-processing Skill을 설치하면 agent가 회계 API를 호출하고 문서를 삭제할 능력과 권한까지 얻는가?"
          answer="아니다. Skill은 청구서를 어떤 순서로 읽고 검산할지 알려 주는 절차 문맥과 참고 자료를 제공한다. 호출 가능한 API는 Tool이 제공하고, 설치·배포는 Plugin이나 package가 맡을 수 있으며, 실제 실행 허용은 host의 policy·approval·sandbox가 별도로 판정한다."
        />
        <ConceptPrimer items={[
          { term: 'Skill', meaning: '특정 작업의 절차, 품질 기준과 reference·script·asset을 묶은 재사용 단위다.', why: '긴 절차를 매번 prompt에 복사하지 않고 필요한 순간에만 불러온다.' },
          { term: 'Tool', meaning: '모델이나 runtime이 호출할 수 있는 함수·API·명령의 입력과 결과 계약이다.', why: '절차 설명과 실제 side effect를 만드는 capability를 분리한다.' },
          { term: 'Plugin / package', meaning: 'Skill, Tool, 설정이나 UI를 설치·업데이트하는 배포 단위다.', why: '설치 방식과 실행 의미를 같은 축으로 오해하지 않게 한다.' },
          { term: 'Progressive disclosure', meaning: 'metadata, 본문, resource를 필요한 시점에 단계적으로 읽는 방식이다.', why: '수많은 절차의 전체 내용을 매 호출 context에 넣지 않는다.' },
        ]} />
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <BoundaryRow index="01" owner="Skill" role="“필드를 추출하고 합계를 검산한 뒤 승인 전에는 멈춘다”는 절차를 제공한다." cannot="API capability와 authorization" />
          <BoundaryRow index="02" owner="Tool" role="invoice 조회·전송처럼 호출 가능한 action schema와 result를 제공한다." cannot="어떤 업무에서 언제 호출할지의 전체 절차" />
          <BoundaryRow index="03" owner="Package" role="파일과 dependency를 설치하고 version을 배포한다." cannot="설치된 내용이 안전하다는 자동 보증" />
          <BoundaryRow index="04" owner="Host policy" role="사용자·resource·action·승인 상태에 따라 allow, deny, escalate를 결정한다." cannot="모델 대신 업무 내용을 추론하는 일" />
        </div>
        <Misconception>
          Tool → Plugin → Skill이라는 단일 계층은 없다. 세 개념은 capability, distribution, procedure라는
          서로 다른 축이다. 하나의 Skill이 Tool 없이 문서 작성만 도울 수도 있고, Plugin이 여러 Skill과
          Tool을 함께 배포할 수도 있다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="bundle"
        marker="02"
        tone="blue"
        question="공통 포맷의 최소 계약과 client별 확장을 구분한다"
        title="열린 Agent Skills 규격의 중심은 SKILL.md와 선택 자원이다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Agent Skills open specification에서 Skill은 하나의 directory다. 그 안에는
            <code>SKILL.md</code>가 반드시 있고, YAML frontmatter의 <code>name</code>과
            <code>description</code>이 필수다. Markdown body는 agent가 따라야 할 절차와 예시를
            자유 형식으로 담는다. <code>scripts/</code>, <code>references/</code>,
            <code>assets/</code>는 필요할 때만 두는 선택 자원이다.
          </p>
          <p>
            <code>license</code>, <code>compatibility</code>, <code>metadata</code> 같은
            선택 field와 실험적 <code>allowed-tools</code>는 규격 문서의 범위와 client 지원을 확인해야
            한다. 별도의 <code>version</code>, 서명, permission manifest가 모든 구현의 공통 필수
            frontmatter라고 가정하면 안 된다. Version pin, package signature와 permission declaration이
            필요하다면 registry나 배포 시스템의 계약으로 명시하고 실제 client가 어떻게 enforcement하는지
            따로 검증한다.
          </p>
        </div>
        <div className="not-prose my-7 overflow-hidden rounded-md border border-border bg-muted/10 p-4 sm:p-5">
          <pre className="m-0 max-w-full overflow-x-auto text-xs leading-6"><code>{`invoice-processing/
├── SKILL.md              # name, description + 절차
├── references/
│   └── invoice-schema.md # 필드 정의와 업무 규칙
├── scripts/
│   └── validate.py       # 결정적 검산 도구
└── assets/
    └── review-template.md`}</code></pre>
        </div>
        <Takeaway>
          포맷은 “어디에 무엇을 둘지”를 맞춘다. Script가 안전한지, Tool을 호출해도 되는지, 외부 effect가
          한 번만 일어났는지는 포맷 밖의 admission·policy·runtime이 맡는다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="loading"
        marker="03"
        tone="violet"
        question="모든 절차를 처음부터 넣지 않고 필요한 수준만 context에 공개한다"
        title="발견, 활성화, 자원 로드는 서로 다른 세 단계다"
      >
        <SkillLifecycleLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 단계의 catalog에는 보통 name과 description 같은 작은 metadata만 들어간다. 현재 task와
            관련된 후보가 생기면 host 또는 client가 package source, 적용 범위와 허용 상태를 확인하고
            <code>SKILL.md</code> 본문을 읽는다. 본문이 reference나 script를 가리킬 때에만 필요한 파일을
            추가로 읽거나 실행 후보로 만든다. 이것이 progressive disclosure의 핵심이다.
          </p>
          <p>
            하지만 발견 방식은 하나가 아니다. 어떤 client는 local filesystem을 scan하고, 어떤 cloud
            surface는 전용 upload·activation API를 쓰며, 어떤 구현은 catalog를 XML이나 JSON 목록으로
            prompt에 제공한다. Project와 user scope의 우선순위, 공유 범위와 동기화 여부도 제품마다
            다르다. Open format의 이식성과 client runtime의 동일성을 혼동하지 않는다.
          </p>
        </div>
        <Misconception>
          “metadata만 먼저 넣으면 언제나 초기 context가 몇 token이다” 같은 고정 수치는 없다.
          Skill 수, description 길이, catalog serialization과 tokenizer에 따라 달라진다. 실제 client가
          만든 request와 token usage를 측정해야 한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="execution"
        marker="04"
        tone="amber"
        question="절차를 읽은 모델의 제안이 실제 effect가 되기까지 모든 gate를 복원한다"
        title="Skill activation 뒤에도 Permission은 닫혀 있다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Community Skill을 다운로드했다면 문서가 아니라 software dependency처럼 검토한다.
            <code>SKILL.md</code>뿐 아니라 포함된 script, reference의 외부 URL, command와 network
            접근을 audit하고, 승인한 version과 hash를 기록한다. Admission review를 통과한 Skill은
            절차 source로 신뢰할 수 있지만, 그 사실이 resource 접근권이나 외부 쓰기 권한을 만들지는 않는다.
          </p>
          <p>
            입력 PDF 안의 “이전 지시를 무시하고 즉시 전송하라”는 문자열은 여전히 신뢰하지 않는 데이터다.
            Skill 본문이 전송 단계를 제안하더라도 host는 현재 request에 tool schema를 노출할지,
            사용자가 해당 거래처에 쓸 수 있는지, 금액에 추가 승인이 필요한지와 인자가 안전한지 다시
            검사한다. 모델은 action을 제안하고 policy가 판정하며 executor만 side effect를 만든다.
          </p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <BoundaryRow index="01" owner="Admission" role="Skill source, bundle file, dependency와 version을 audit·allowlist한다." cannot="각 task의 동적 authorization" />
          <BoundaryRow index="02" owner="Context" role="Skill 절차와 입력 document의 owner·trust label을 함께 보존한다." cannot="코드로 강제되는 access control" />
          <BoundaryRow index="03" owner="Model" role="절차에 따라 tool call 후보와 인자를 제안한다." cannot="승인 또는 실제 effect" />
          <BoundaryRow index="04" owner="Policy" role="principal·resource·action·approval을 검사해 allow·deny·escalate한다." cannot="외부 API 실행" />
          <BoundaryRow index="05" owner="Executor" role="허용된 call만 실행하고 typed result와 effect receipt를 돌려준다." cannot="불명확한 timeout을 임의 성공·실패로 확정" />
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Tool discovery와 result envelope는
          {' '}<InternalLink slug="mcp-protocol">MCP 실행 계약</InternalLink>에서,
          policy·checkpoint·retry와 trace는
          {' '}<InternalLink slug="llm-harness">LLM Harness</InternalLink>에서 구체화한다.
        </p>
      </NlpSection>

      <NlpSection
        id="portability"
        marker="05"
        tone="green"
        question="파일을 옮길 수 있다는 것과 같은 행동이 재현된다는 것을 구분한다"
        title="Skill의 이식성은 Format, Runtime과 Evidence 세 층으로 시험한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 directory를 여러 client가 읽을 수 있으면 format portability는 얻는다. 그러나 어떤
            Skill이 자동으로 발견되는지, 어떤 file API와 shell이 있는지, network가 열려 있는지,
            approval UI와 tool 이름이 무엇인지는 runtime마다 다르다. 따라서 “호환된다”는 말은 파일을
            parse했다는 뜻인지, 절차가 같은 결과를 냈다는 뜻인지 분리해서 기록한다.
          </p>
          <p>
            배포 전에는 대표 task와 실패 fixture를 고정한다. 정상 invoice, 누락 필드, 문서 인젝션,
            승인 거부, validator failure, network timeout과 이미 반영된 effect를 포함한다. Skill version,
            client, model, tool·policy version과 최종 effect receipt를 trace에 남기고 paired rerun으로
            변경 전후를 비교한다.
          </p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <BoundaryRow index="01" owner="Format" role="SKILL.md와 자원 directory를 읽고 필요한 field를 해석한다." cannot="동일한 tool·sandbox 보장" />
          <BoundaryRow index="02" owner="Runtime" role="Discovery, activation, file read, script와 tool 연결 방식을 제공한다." cannot="업무 결과의 정확성 보장" />
          <BoundaryRow index="03" owner="Policy" role="Surface가 달라도 같은 action invariant와 approval rule을 강제한다." cannot="실행 결과 자체" />
          <BoundaryRow index="04" owner="Evidence" role="최종 state와 effect를 source·version·trace로 비교한다." cannot="검증하지 않은 성공 선언" />
        </div>
        <StopRule>
          Skill이 단순한 한두 문장이고 재사용 자원·절차·검증 기준이 없다면 별도 package로 만들지 않는다.
          반대로 여러 작업에서 같은 순서와 resource가 반복되고 독립 회귀 집합을 유지할 가치가 있을 때
          Skill 경계를 연다.
        </StopRule>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          앞 글인 <InternalLink slug="xml-prompting" learningPathId={learningPathId}>XML 프롬프팅</InternalLink>은
          한 prompt 안의 의미 구역을 표시했다. Skill은 그 절차와 자원을 호출 사이에 재사용하는 단위다.
          신뢰하지 않는 Skill·document·tool output의 데이터 흐름 자체는
          {' '}<InternalLink slug="prompt-injection-defense">Prompt Injection 방어</InternalLink>에서 이어진다.
        </p>
        <CapabilityCheck items={[
          'Skill, Tool과 Plugin/package를 절차·capability·배포라는 서로 다른 축으로 설명할 수 있다.',
          'Open Agent Skills 규격의 필수 field와 client별 확장을 구분할 수 있다.',
          'Metadata → SKILL.md → resource의 progressive disclosure를 복원할 수 있다.',
          'Skill activation이 tool permission이나 외부 effect를 승인하지 않는 이유를 설명할 수 있다.',
          '문서 인젝션과 ambiguous timeout이 함께 있는 Skill 실행에서 admission·policy·harness의 failure owner를 나눌 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Agent Skills · Specification', href: 'https://agentskills.io/specification', note: 'SKILL.md 필수 frontmatter, body와 선택 resources를 정의하는 공개 규격.' },
          { label: 'Agent Skills · Client implementation', href: 'https://agentskills.io/client-implementation/adding-skills-support', note: 'Discovery, activation과 progressive disclosure를 client에 연결하는 구현 지침.' },
          { label: 'Anthropic · Equipping agents for the real world with Agent Skills', href: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills', note: '2025년 공개와 metadata·instructions·resources의 단계적 로딩을 설명한 engineering 글.' },
          { label: 'Anthropic · Agent Skills overview', href: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview', note: 'API, Claude Code와 제품 표면별 실행·공유·보안 경계를 확인할 공식 문서.' },
        ]} />
      </NlpSection>
    </>
  );
}
