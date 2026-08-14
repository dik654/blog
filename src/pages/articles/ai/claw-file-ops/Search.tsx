import SearchViz from "./viz/SearchViz";

const outputModes = [
  ["files_with_matches", "match가 있는 path를 반환하며 기본 limit은 250개다"],
  ["count", "file별 path와 전체 regex match 수를 반환한다"],
  ["content", "match 주변 line을 path·line number와 함께 문자열로 반환한다"],
  ["offset/head_limit", "결과 배열을 자르지만 snapshot-bound cursor는 아니다"],
] as const;

export default function Search() {
  return (
    <section id="search" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        현재 glob·grep 동작을 알고 top-down 검색 budget을 설계한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          큰 repository에서는 파일을 전부 읽기보다 이름으로 후보를 찾고, 내용
          match로 좁힌 뒤 필요한 line range만 읽는 편이 빠릅니다. 이
          <strong> top-down search</strong>에서 glob은 path pattern, grep은 content
          pattern을 담당합니다.
        </p>
        <p className="leading-7">
          pinned 구현의 glob과 grep은 같은 정책을 공유하지 않습니다. Glob은 여섯
          directory를 건너뛰고 수정 시각 내림차순으로 최대 100개를 반환합니다.
          Grep은 process 안에서 Rust regex로 WalkDir file을 읽으며, glob·extension
          filter와 output mode를 적용합니다. 외부 <code>rg</code>를 실행하는
          wrapper가 아닙니다.
        </p>

        <div className="not-prose my-8">
          <SearchViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {outputModes.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-lg border border-border/70 bg-card p-4"
          >
            <h4 className="break-words text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          glob은 이름 후보를 최대 100개로 제한한다
        </h3>
        <p className="leading-7">
          Glob pattern을 base directory와 결합하고, brace expression은 여러
          pattern으로 확장합니다. WalkDir가 만난 regular file 중 pattern과 맞는
          path를 중복 제거하며 <code>.git</code>, <code>node_modules</code>,
          <code>.build</code>, <code>target</code>, <code>dist</code>,
          <code>coverage</code> directory를 제외합니다.
        </p>
        <p className="leading-7">
          결과는 normalized path 순서가 아니라 metadata modified time의
          내림차순으로 정렬하고 100개 뒤를 잘라 <code>truncated</code>를 표시합니다.
          따라서 시간이 같은 file의 tie-break, repository snapshot과 다음 page를
          잇는 cursor는 없습니다. “최신 파일 우선” 결과와 “재현 가능한 전체
          열거”를 같은 계약으로 생각하면 안 됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          grep은 regex와 세 output mode를 직접 구현한다
        </h3>
        <p className="leading-7">
          Pattern은 Rust <code>regex</code> crate로 compile하며 case-insensitive와
          dot-matches-newline option을 받을 수 있습니다. 이 engine은 backtracking
          regex와 다른 계산 특성을 갖지만, source에는 scan byte·deadline·memory
          budget이 별도로 보이지 않습니다. 큰 tree나 긴 file의 resource limit은
          release 전에 따로 측정해야 합니다.
        </p>
        <p className="leading-7">
          <code>content</code> mode는 match line의 before·after context를 문자열로
          쌓습니다. 가까운 두 match의 context가 겹치면 같은 line이 반복될 수 있고,
          binary나 decode 실패 file은 읽지 못한 이유를 결과에 넣지 않고 건너뜁니다.
          그래서 “match 없음”과 “일부 file을 검색하지 못함”을 결과만으로 완전히
          구분하기 어렵습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Offset은 cursor가 아니며 repository 변경을 감지하지 않는다
        </h3>
        <p className="leading-7">
          <code>head_limit</code>과 <code>offset</code>은 만들어진 vector에
          <code>skip</code>과 <code>truncate</code>를 적용합니다. Query digest,
          ignore policy와 filesystem snapshot identity를 포함하지 않으므로, file이
          추가·삭제된 뒤 같은 offset을 보내면 누락이나 중복이 생길 수 있습니다.
        </p>
        <p className="leading-7">
          Hardening된 pagination은 normalized path·line·column의 stable ordering,
          query digest와 snapshot version을 cursor에 묶어야 합니다. 현재 API를
          사용할 때는 offset을 “같은 순간의 다음 page”로 믿지 말고, truncated
          결과를 좁힐 새 glob·path·regex 조건으로 이어가는 편이 안전합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Release gate는 정상 예시보다 adversarial repository를 사용한다
        </h3>
        <p className="leading-7">
          100개를 넘는 동일 수정시각 file, unreadable UTF-8, symlink loop, 매우 긴
          line, overlap context, offset 도중 file churn을 fixture로 만듭니다. 각
          test에서 scanned file·byte·elapsed·truncation reason을 관찰할 수 있어야
          검색 비용과 누락을 설명할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
