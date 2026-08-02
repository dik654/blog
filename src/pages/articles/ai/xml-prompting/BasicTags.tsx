import BasicTagsViz from './viz/BasicTagsViz';

export default function BasicTags() {
  return (
    <section id="basic-tags" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">태그 이름보다 역할을 먼저 정한다</h2>
      <p className="mb-8 text-base leading-8 text-muted-foreground">
        XML prompting에 표준 태그 목록은 없다. 먼저 프롬프트 안의 조각이
        지시, 참고 자료, 사용자 입력, 예시, 출력 계약 중 무엇인지 나눈 뒤 그 역할을
        그대로 드러내는 이름을 붙인다.
      </p>
      <div className="not-prose mb-8"><BasicTagsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>한 태그는 한 질문에 답하게 한다</h3>
        <p className="leading-7">
          <code>&lt;instructions&gt;</code>는 무엇을 할지,
          <code>&lt;context&gt;</code>는 무엇을 참고할지,
          <code>&lt;user_input&gt;</code>은 어떤 값이 외부에서 들어왔는지,
          <code>&lt;output_format&gt;</code>은 무엇을 반환할지를 표시한다.
          같은 내용을 <code>&lt;a&gt;</code>, <code>&lt;d1&gt;</code>처럼 축약하면
          사람이 검토할 때 역할을 복원하기 어렵고 이후 예시와 validator도 연결하기 어렵다.
        </p>
        <h3>중첩은 소속 관계가 있을 때만 쓴다</h3>
        <p className="leading-7">
          여러 예시는 <code>&lt;examples&gt;</code> 아래에 각각의
          <code>&lt;example&gt;</code>을 둘 수 있다. 반대로 지시와 사용자 입력은
          부모·자식 관계가 아니므로 서로 안에 넣지 않는다. XML과 JSON 모두 중첩을
          표현할 수 있다. XML을 고르는 이유는 꺾쇠 경계가 긴 자연어 안에서 눈에 잘
          보이기 때문이지, JSON보다 계층 표현력이 더 높기 때문이 아니다.
        </p>
        <h3>태그는 계약의 시작이지 검증 결과가 아니다</h3>
        <p className="leading-7">
          모델이 태그를 보았다고 해서 항상 그 역할을 지키는 것은 아니다. 출력 필드가
          필수라면 parser와 validator가 확인해야 하고, 외부 입력이 지시처럼 보일 수
          있다면 애플리케이션의 권한 정책이 별도로 막아야 한다.
        </p>
      </div>
    </section>
  );
}
