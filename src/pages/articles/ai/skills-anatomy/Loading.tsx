import LoadingViz from "./viz/LoadingViz";

export default function Loading() {
  return (
    <section id="loading" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Progressive disclosure는 후보 index에서 필요한 자료로 단계적으로 확장한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Skill이 100개 있다고 해서 100개의 긴 본문을 매 요청의 context에 넣으면
          정작 user request와 작업 근거가 밀려납니다. 그래서 처음에는 각 Skill의
          name·description만 보고 후보를 만들고, Codex에서는 file path도 함께
          제공합니다. 사용자가 직접 Skill을 지정하는 <strong>explicit
          invocation</strong> 또는 요청과 description이 맞아 host가 고르는
          <strong> implicit invocation</strong> 뒤에야 선택된
          <code> SKILL.md</code> 전체를 읽습니다.
        </p>
        <p>
          본문에서 reference를 가리키더라도 모두 한꺼번에 읽지는 않습니다. 현재 task에 필요한 파일만 이어서 엽니다. 예를 들어 PDF 처리 Skill이 spreadsheet와
          PDF 지침을 모두 갖고 있어도 PDF 요청에서는 PDF reference만 읽습니다. 이 구조 때문에 metadata는 routing에 충분히 구체적이어야 하고
          reference는 본문에서 언제 읽을지 명시해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <LoadingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          OpenAI 공식 문서의 현재 Codex 규약에서는 초기 Skill 목록이 model context의
          최대 2%를 사용하고, context 크기를 알 수 없으면 8,000 characters를
          상한으로 둡니다. 설치 수가 많으면 description을 먼저 줄이고, 더 큰
          목록에서는 일부 Skill을 생략하면서 경고할 수 있습니다. 이 budget은 초기
          후보 목록에만 적용되므로 선택된 Skill의 전체 <code>SKILL.md</code>를
          일부만 읽어도 된다는 뜻은 아닙니다.
        </p>
        <p>
          “설치되어 있다”와 “이번 request의 후보에 노출되었다”는 구분해야 합니다. 많은 Skill을 운용할 때는 충돌하는 description, hard negative
          request, 누락 경고를 실제 token·latency와 나란히 놓고 잽니다. 비슷한 Skill을 무작정 늘리기보다 한 job의 정본 Skill로 통합하거나 trigger
          scope를 더 분명히 나누는 편이 안전합니다.
        </p>
      </div>
    </section>
  );
}
