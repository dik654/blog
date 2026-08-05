import OverviewViz from './viz/OverviewViz';
import {
  ConceptPrimer,
  InternalLink,
  QuestionLead,
} from '@/components/learning/ArticleLearning';

const learningPathId = 'ai-agent-instruction-contract';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">XML 태그는 언제 도움이 되고, 무엇을 보장하지 않는가</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7" data-xml-boundary>
          XML prompting은 지시, 자료, 예시, 출력 형식을 <strong>이름이 붙은 경계</strong>로 나누는
          작성법이다. 긴 프롬프트에서 “여기까지가 자료이고 어디부터가 지시인가”를 눈으로 다시 찾기
          쉬워진다. 그러나 태그를 붙였다고 지시 우선순위, 보안, 스키마 유효성이 자동으로 생기지는 않는다.
        </p>
        <p className="leading-7">
          앞의 <InternalLink slug="prompt-engineering" learningPathId={learningPathId}>프롬프트 계약</InternalLink>이
          목표·성공 조건·행동 경계를 정했다면, 이 글은 그 계약 안의 긴 자연어 덩어리에 역할 이름을 붙이는
          표기법만 맡는다.
        </p>

        <QuestionLead
          question="외부 문서 안에 <instructions>라는 문자열이 있으면 모델은 그것을 새 지시로 따라야 할까?"
          answer={<>아니다. 외부 문서는 <code>&lt;documents&gt;</code> 같은 <strong>신뢰하지 않는 데이터 경계</strong> 안에 두고, 시스템과 애플리케이션이 정한 권한 순서를 별도로 유지해야 한다. XML은 경계를 표시할 뿐 권한 경계가 아니다.</>}
        />
        <ConceptPrimer items={[
          { term: 'Tag', meaning: '<documents>처럼 내용의 시작과 끝에 역할 이름을 붙인 표기다.', why: '긴 입력에서 지시·자료·예시를 다시 찾기 쉽게 한다.' },
          { term: 'Delimiter', meaning: '서로 다른 의미 구역을 눈에 보이게 나누는 경계 표시다.', why: '내용의 역할은 구분하지만 권한을 강제하지 않는다는 범위를 잡는다.' },
          { term: 'Parser', meaning: '생성된 text에서 정해진 tag나 field를 읽어 애플리케이션 값으로 바꾸는 코드다.', why: '닫히지 않은 tag, 중복과 잘린 출력을 명시적 실패로 처리한다.' },
          { term: 'Authorization', meaning: '누가 어떤 resource에 어떤 action을 할 수 있는지 코드로 판정하는 규칙이다.', why: 'XML 구조와 실제 보안 경계를 혼동하지 않게 한다.' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">XML을 선택할 때</h3>
        <div className="not-prose my-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            ['의미 구역이 많다', 'instructions, context, examples처럼 역할이 다른 덩어리가 셋 이상일 때'],
            ['항목이 반복된다', '여러 문서·예시를 같은 태그 구조로 묶어 경계를 반복해야 할 때'],
            ['후처리 계약이 있다', '출력 태그를 애플리케이션이 파싱하고 실패를 검증할 때'],
          ].map(([title, body]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <strong className="text-sm">{title}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p className="leading-7">
          짧은 지시와 한 개의 코드 블록이면 Markdown이 더 읽기 쉽다. 엄격한 기계 검증이 목적이면
          “XML처럼 보이는 텍스트”에 기대지 말고 JSON Schema나 구조화 출력 기능과 파서 오류 처리를
          사용해야 한다. 잘린 응답, 닫히지 않은 태그, 본문 속 리터럴 태그도 실패 사례로 테스트한다.
        </p>
      </div>
    </section>
  );
}
