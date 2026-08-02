import BestPracticesViz from './viz/BestPracticesViz';
import {
  CapabilityCheck,
  InternalLink,
  SourceNotes,
} from '@/components/learning/ArticleLearning';

const learningPathId = 'ai-agent-instruction-contract';

export default function BestPractices() {
  return (
    <section id="best-practices" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">형식 취향이 아니라 실패율로 선택한다</h2>
      <p className="mb-8 text-base leading-8 text-muted-foreground">
        좋은 템플릿은 태그가 많은 템플릿이 아니라, 같은 입력에서 안정적으로 파싱되고
        요구 필드를 채우며 권한 밖 행동을 애플리케이션이 차단할 수 있는 템플릿이다.
      </p>
      <div className="not-prose mb-8"><BestPracticesViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>한 번의 예시보다 실패 집합을 만든다</h3>
        <p className="leading-7">
          정상 문서뿐 아니라 빈 입력, 매우 긴 입력, 태그와 닮은 사용자 문자열,
          누락 필드, 잘린 출력, 중복 태그를 fixture로 둔다. 각 fixture에서 parse
          success, required-field success, semantic correctness와 policy violation을
          따로 기록한다.
        </p>
        <h3>비용은 tokenizer로 직접 잰다</h3>
        <p className="leading-7">
          태그가 더해지는 토큰 수는 태그 이름, tokenizer, 반복 횟수와 문서 길이에
          따라 달라진다. 고정된 오버헤드 비율을 가정하지 말고 실제 prompt를
          tokenization해 Markdown 구분자나 JSON schema 방식과 비교한다.
        </p>
        <h3>선택 기준을 한 문장으로 남긴다</h3>
        <p className="leading-7">
          사람이 읽는 긴 자연어의 역할 경계가 문제면 XML이 유력하다. 짧은 지시와
          목록이면 Markdown이 더 단순할 수 있다. 타입이 있는 기계 출력이 핵심이면
          JSON Schema 기반 structured output을 우선 검토한다. 어떤 형식이든
          authorization과 output validation은 별도 계층이다.
        </p>
        <p className="leading-7">
          같은 절차를 여러 작업에서 재사용하려면 다음 글인
          {' '}<InternalLink slug="skills-anatomy" learningPathId={learningPathId}>Agent Skills</InternalLink>에서
          metadata, SKILL.md와 resource의 지연 로딩으로 확장한다. 여러 source와 실행 state를 한 turn에
          선별하는 문제는 이어지는 <InternalLink slug="context-engineering" learningPathId={learningPathId}>Context Engineering</InternalLink>이
          맡는다.
        </p>
      </div>
      <CapabilityCheck items={[
        'Markdown, XML delimiter와 JSON Schema가 각각 해결하는 실패를 구분할 수 있다.',
        '외부 document 안의 tag 모양 문자열을 새 instruction으로 승격하지 않을 수 있다.',
        '닫히지 않은 tag, 중복 field와 잘린 출력을 parser fixture로 검증할 수 있다.',
        'Parse success, semantic correctness와 policy violation을 서로 다른 지표로 기록할 수 있다.',
        '반복 절차는 Agent Skill로, 여러 source의 선별은 Context Engineering으로 인계할 수 있다.',
      ]} />
      <SourceNotes sources={[
        { label: 'Anthropic · Prompting best practices', href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices', note: '긴 prompt의 역할 구역을 XML tag로 분리하는 공식 지침과 적용 범위.' },
        { label: 'Anthropic · Structured outputs', href: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs', note: '의미 delimiter와 schema-constrained output이 해결하는 문제를 구분할 공식 문서.' },
      ]} />
    </section>
  );
}
