export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습용 mode에서 운영 policy stack으로</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          현재의 mode·rule·request-context evaluator는 least privilege와 승인 흐름을 배우기 좋은
          작은 core다. 제품이 여러 사용자, 프로젝트와 조직 정책을 지원하면 mode 개수보다
          <strong>정책 출처, 우선순위, 설명 가능성, 우회 통제</strong>가 더 큰 문제가 된다.
        </p>
        <div className="not-prose my-6 divide-y divide-border rounded-md border border-border">
          {[
            ['출처', 'user, project, local, managed policy와 CLI/session override를 구분한다.', '누가 규칙을 만들었고 누가 바꿀 수 있는지 감사한다.'],
            ['우선순위', 'static deny → hook context → ask → allow/mode처럼 충돌 순서를 고정한다.', '넓은 Allow가 managed Deny를 가리는 일을 막는다.'],
            ['설명', '최종 action뿐 아니라 이긴 규칙과 source, override를 반환한다.', '사용자가 왜 물었고 왜 거부됐는지 이해한다.'],
            ['우회', 'bypass mode의 허용 환경과 enterprise kill switch를 둔다.', '사용자 flag 하나로 조직 경계를 무력화하지 못하게 한다.'],
            ['운영', 'timeout·unknown·policy load failure를 fail-closed로 처리한다.', '불확실성을 조용한 Allow로 바꾸지 않는다.'],
          ].map(([area, design, purpose]) => (
            <div key={area} className="grid gap-2 px-4 py-4 md:grid-cols-[110px_minmax(0,1fr)_minmax(0,1fr)]">
              <strong className="text-sm">{area}</strong>
              <span className="text-sm leading-relaxed">{design}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{purpose}</span>
            </div>
          ))}
        </div>

        <h3>Plan은 permission mode가 아니라 변경 계약일 수도 있다</h3>
        <p>
          계획 단계에서는 read와 search만 허용하고, 사용자가 plan을 승인한 뒤 edit·write·shell을 여는
          방식은 강한 workflow gate가 된다. 핵심은 mode 이름이 아니라 “승인 전에는 어떤 mutating
          action도 실행 경로에 도달하지 않는다”는 invariant와 그 테스트다.
        </p>

        <h3>LLM classifier는 policy를 보조할 뿐 root of trust가 아니다</h3>
        <p>
          애매한 command를 모델로 분류하면 UX는 좋아질 수 있지만 classifier도 오판·prompt injection·
          model drift의 영향을 받는다. 명시적 Deny와 managed policy를 classifier가 뒤집지 못하게 하고,
          낮은 confidence와 classifier 오류는 Ask 또는 Deny로 닫아야 한다.
        </p>

        <h3>다음 두 경계로 책임을 넘긴다</h3>
        <p>
          permission의 출력은 실행 허가다. 파일 글은 구조화된 path를 실제 handle에 묶는 방법을,
          shell 글은 command 문자열이 실행 중 새 행동을 만들더라도 OS가 filesystem·network·process를
          제한하는 방법을 맡는다. 세 글을 합쳐야 defense-in-depth가 완성된다.
        </p>
      </div>
    </section>
  );
}
