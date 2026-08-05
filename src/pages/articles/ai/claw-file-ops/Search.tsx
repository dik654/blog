import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SearchViz from './viz/SearchViz';

export default function Search({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="search" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">검색은 답이 아니라 다음 읽기 범위를 만든다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          에이전트 검색의 목적은 저장소 전체를 context에 넣는 것이 아니다. glob으로 파일 후보를 좁히고,
          grep으로 관련 줄을 찾은 뒤, 필요한 구간만 <code>read_file</code>로 다시 읽는다. 따라서 결과
          limit, 잘림 표시, 읽지 못한 파일의 처리 방식이 검색 정확도만큼 중요하다.
        </p>
      </div>

      <SearchViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>glob_search: 이름으로 최대 100개 후보를 만든다</h3>
        <p>
          현재 구현은 검색 root를 정규화하고, <code>{'{rs,ts}'}</code> 같은 brace group을 여러 glob
          pattern으로 펼친다. <code>glob</code> crate 결과에서 file만 남기고 중복을 제거하며, 수정 시각
          최신순으로 정렬해 최대 100개를 반환한다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton onClick={() => onCodeRef('glob-contract', codeRefs['glob-contract'])} label="glob_search 298-350줄 보기" />
        </div>
        <p>
          여기에는 기존 글이 주장하던 blacklist나 gitignore filter가 없다. 절대 pattern도 그대로 받을
          수 있으므로 workspace wrapper가 어떤 호출 경로에서 적용되는지 별도로 확인해야 한다.
          <code>truncated=true</code>면 “100개가 전부”가 아니라 “패턴을 더 좁혀야 한다”는 신호다.
        </p>

        <h3>grep_search: regex + WalkDir의 현재 계약</h3>
        <p>
          현재 코드는 ripgrep CLI나 ripgrep의 searcher를 호출하지 않는다. <code>regex</code> crate로
          pattern을 만들고, <code>WalkDir</code>로 파일을 모은 뒤 각 파일을
          <code>fs::read_to_string</code>으로 읽는다. <code>content</code>,
          <code>files_with_matches</code>, <code>count</code> 세 mode를 제공한다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton onClick={() => onCodeRef('grep-contract', codeRefs['grep-contract'])} label="grep_search 352-481줄 보기" />
        </div>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['UTF-8만', 'read_to_string 실패 파일은 skip한다.', 'binary와 다른 encoding에 검색 누락이 생길 수 있다.'],
            ['match 단위', 'content/files mode는 각 line에 적용하고 count mode만 전체 문자열에 find_iter를 쓴다.', 'content mode를 줄 경계 넘는 검색으로 오해하면 안 된다.'],
            ['context 중복', '가까운 두 match의 context 구간을 각각 push한다.', '같은 줄이 여러 번 결과에 들어갈 수 있다.'],
            ['limit 적용 시점', '전체 traversal과 결과 수집 뒤 offset/head_limit을 적용한다.', '대형 저장소 I/O를 조기 중단하지 못한다.'],
          ].map(([contract, behavior, consequence]) => (
            <div key={contract} className="grid gap-2 px-4 py-3 sm:grid-cols-[120px_200px_1fr]">
              <strong className="text-sm">{contract}</strong>
              <span className="text-sm text-muted-foreground">{behavior}</span>
              <span className="text-sm leading-relaxed">{consequence}</span>
            </div>
          ))}
        </div>

        <h3>Production 검색으로 확장하는 순서</h3>
        <p>
          먼저 workspace root와 ignore policy를 file traversal 자체에 적용한다. 다음으로 binary/encoding
          skip을 결과 metadata에 기록한다. 그 뒤 early-stop, context dedupe, result paging과 cancellation을
          더한다. ripgrep을 도입한다면 “빠르다”는 이유만이 아니라 gitignore semantics, binary 처리,
          병렬 traversal과 structured result를 어떤 API로 보존할지 함께 설계해야 한다.
        </p>
        <div className="not-prose my-5 grid gap-3 sm:grid-cols-3">
          {[
            ['후보', 'glob **/*.rs → 100개를 넘으면 디렉터리나 suffix를 더 좁힌다.'],
            ['증거', 'grep symbol → files mode로 위치를 찾고 content mode로 주변 문맥을 본다.'],
            ['확인', 'read_file offset/limit → 정의와 호출부의 완전한 구간을 읽는다.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-border p-4">
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
