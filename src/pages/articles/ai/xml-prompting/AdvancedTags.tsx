import AdvancedTagsViz from './viz/AdvancedTagsViz';

export default function AdvancedTags() {
  return (
    <section id="advanced-tags" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">복잡해질수록 데이터와 권한을 분리한다</h2>
      <p className="mb-8 text-base leading-8 text-muted-foreground">
        고급 패턴의 핵심은 태그 수를 늘리는 것이 아니다. 근거와 답, 반드시 지킬
        규칙과 금지 조건, 신뢰한 문맥과 신뢰하지 않은 입력을 서로 다른 소유권으로
        읽히게 만드는 것이다.
      </p>
      <div className="not-prose mb-8"><AdvancedTagsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>근거와 최종 답을 분리한다</h3>
        <p className="leading-7">
          검산 가능한 설명이 필요하면 비공개 사고 과정을 요구하기보다
          <code>&lt;evidence&gt;</code>와 <code>&lt;answer&gt;</code>처럼 외부에서
          확인할 수 있는 산출물을 요청한다. 근거에는 문서 식별자나 인용 위치를,
          답에는 사용자에게 전달할 결론을 넣도록 계약한다.
        </p>
        <h3>태그 경계와 신뢰 경계를 혼동하지 않는다</h3>
        <p className="leading-7">
          <code>&lt;user_input&gt;</code>으로 감싼 문자열은 모델이 읽기 쉽게 구분한
          데이터일 뿐이다. 그 안의 “이전 지시를 무시하라”는 문장이 실행되지 않는다고
          보장하지 않는다. 허용 도구, 인자, 데이터 접근 범위와 side effect는
          모델 밖의 policy gate가 결정해야 한다.
        </p>
        <h3>깊이는 고정 숫자가 아니라 관계로 판단한다</h3>
        <p className="leading-7">
          문서 안의 섹션처럼 실제 포함 관계가 있으면 중첩한다. 독립적인 규칙을 보기
          좋게 만들려고 여러 겹 감싸기 시작하면 태그 경로가 길어지고 수정 시 누락이
          늘어난다. 이때는 중첩 단계를 세는 규칙보다 문서를 나누거나 schema를
          단순화하는 편이 낫다.
        </p>
      </div>
    </section>
  );
}
