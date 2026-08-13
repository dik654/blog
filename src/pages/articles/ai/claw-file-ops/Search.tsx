import SearchViz from "./viz/SearchViz";

const outputModes = [
  ["Files", "어느 file에 match가 있는지 path만 반환"],
  ["Count", "file별 또는 전체 match count를 반환"],
  ["Content", "line·column·preview와 context line을 반환"],
  ["Cursor", "truncated 이후 같은 snapshot의 다음 결과를 요청"],
] as const;

export default function Search() {
  return (
    <section id="search" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        glob은 후보 file을 찾고 grep은 필요한 내용만 좁힌다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          큰 repository를 효율적으로 읽으려면 먼저 filename과 directory 구조로
          후보를 줄이고, 그 안에서 content match를 찾은 뒤 필요한 file range만
          읽어야 합니다. <code>glob_search</code>와 <code>grep_search</code>의
          분리는 이 top-down 탐색 흐름을 tool interface로 표현합니다.
        </p>
        <p className="leading-7">
          검색은 read-only이지만 무해하지는 않습니다. secret file 이름과 내용도
          노출할 수 있고, 무제한 regex와 결과는 CPU·memory·LLM context를
          고갈시킬 수 있으므로 file read와 같은 boundary·permission·output
          budget을 적용해야 합니다.
        </p>

        <div className="not-prose my-8">
          <SearchViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {outputModes.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          ignore와 symlink 정책을 결과에 드러낸다
        </h3>
        <p className="leading-7">
          기본 검색은 보통 <code>.gitignore</code>, hidden file, vendor
          directory와 binary file을 제외하지만 이는 library마다 다른 선택입니다.
          request와 result에 적용된 ignore source, hidden·follow-symlink flag와
          excluded count를 표시해야 “없다”와 “검색하지 않았다”를 구분할 수
          있습니다.
        </p>
        <p className="leading-7">
          symlink를 따라가도록 허용해도 실제 target이 workspace boundary 안인지
          file마다 확인합니다. directory cycle을 감지하고 maximum depth와
          visited inode 또는 platform identity를 사용해 무한 순회를 막습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          literal search를 기본으로 하고 regex 비용을 제한한다
        </h3>
        <p className="leading-7">
          사용자가 정규식을 요구하지 않았다면 literal search가 더 예측 가능하고
          빠릅니다. regex mode는 compile error를 구조화해 반환하고 pattern
          length, file size, total scan bytes와 deadline을 제한합니다. 가능하면
          catastrophic backtracking을 피하는 engine을 사용합니다.
        </p>
        <p className="leading-7">
          외부 <code>rg</code> 같은 search executable을 사용할 때는 shell
          string을 만들지 않고 argv로 pattern과 path를 전달합니다. exit code에서
          “match 없음”과 execution error를 구분하고 stderr를 bounded
          diagnostic으로 보존합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          결과 순서와 pagination을 안정화한다
        </h3>
        <p className="leading-7">
          filesystem traversal order는 환경마다 달라질 수 있으므로 normalized
          path, line과 column으로 정렬합니다. 최대 file 수, match 수, preview
          byte와 total output byte를 각각 제한하고, 잘렸다면 정확한 reason과
          cursor를 반환합니다.
        </p>
        <p className="leading-7">
          cursor에는 query digest, ignore config와 search snapshot identity를
          넣어 다른 query의 offset으로 재사용되지 않게 합니다. repository가 크게
          바뀌었다면 오래된 cursor를 이어 붙이기보다 새 검색을 요구합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          preview는 다음 read를 위한 좌표다
        </h3>
        <p className="leading-7">
          content mode는 path, line·column, bounded preview와 앞뒤 context를
          반환하되 full file을 반복해서 싣지 않습니다. line number는 text
          encoding과 newline 기준을 명시하고, preview가 잘렸다면 match span이
          어느 byte에 있는지도 보존합니다.
        </p>
        <p className="leading-7">
          검색 직후 file이 바뀔 수 있으므로 result의 digest나 observed
          metadata를 다음 <code>read_file</code> 요청에 전달할 수 있습니다. read
          시점에 version이 다르면 line number를 그대로 믿지 않고 새 search 또는
          context refresh를 수행합니다.
        </p>
      </div>
    </section>
  );
}
