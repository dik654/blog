export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">최소 구현에서 production 도구로 가는 순서</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          기능 수를 먼저 늘리면 안전성의 빈틈을 가리기 쉽다. 현재 Claw 구현에서 가장 먼저 닫아야 할
          간격은 이미지·PDF 지원이 아니라 <strong>open-time 경계, 충돌 탐지, atomic replace와
          durability</strong>다. 그 다음에 LLM이 실수에서 회복하기 쉬운 UX를 붙인다.
        </p>
        <div className="not-prose my-6 divide-y divide-border rounded-md border border-border">
          {[
            {
              n: 'P0',
              title: '경계와 데이터 무결성',
              items: 'dirfd/openat2 계열 경계, ancestor symlink·swap race 테스트, version/hash 재검증, temp+rename, 권한 보존, fsync 정책',
            },
            {
              n: 'P1',
              title: '실패를 복구 가능한 정보로',
              items: 'dry-run, diff preview, 충돌 오류, old_string 후보와 line context, encoding 오류의 명확한 분류',
            },
            {
              n: 'P2',
              title: '입력 범위 확장',
              items: 'encoding 정책, CRLF/LF·indent 보존, multi-edit transaction, 대용량 search paging',
            },
            {
              n: 'P3',
              title: '멀티모달',
              items: '이미지/PDF의 MIME 검증, 크기·페이지 상한, 안전한 decoder 격리, LLM용 downsampling',
            },
          ].map((item) => (
            <div key={item.n} className="grid gap-2 px-4 py-4 sm:grid-cols-[42px_170px_1fr]">
              <span className="text-xs font-bold text-muted-foreground">{item.n}</span>
              <strong className="text-sm">{item.title}</strong>
              <span className="text-sm leading-relaxed text-muted-foreground">{item.items}</span>
            </div>
          ))}
        </div>

        <h3>“did you mean”과 diff가 해결하는 문제</h3>
        <p>
          문자열이 없다는 오류만 반환하면 모델은 같은 edit를 반복하기 쉽다. 가까운 후보와 주변 줄을
          제공하면 모델이 최신 파일을 다시 읽고 요청을 교정할 수 있다. dry-run과 diff는 사용자가 변경을
          승인하기 전에 의미를 검토하게 한다. 하지만 둘 다 stale overwrite나 부분 쓰기를 자동으로
          예방하지 않는다. 안전 primitive 위에 올리는 recovery UX다.
        </p>

        <h3>Multi-edit의 “원자성”도 두 층이다</h3>
        <p>
          여러 치환을 메모리에서 모두 성공한 뒤 한 번 쓰는 것은 <strong>논리적 all-or-nothing</strong>을
          만든다. 그 한 번의 파일 교체가 crash 중에도 원자적인지는 별도 문제다. 모든 match를 먼저
          검증하고, 읽은 version이 유지되는지 확인하고, temp 파일을 완성한 뒤 rename해야 두 층을 함께
          만족시킬 수 있다.
        </p>

        <h3>Shell로 넘기지 말아야 할 이유</h3>
        <p>
          typed file tool은 path를 구조화된 인자로 받고 그 handle을 검증된 방식으로 열 수 있다. shell
          명령은 command substitution, redirection, subprocess 안에서 실행 중 새 path를 계산할 수 있다.
          따라서 file article의 path 문자열 검사를 shell containment와 동등하게 재사용할 수 없다.
          다음 글에서는 intent와 pattern을 신호로만 사용하고 OS sandbox를 실제 enforcement boundary로
          다룬다.
        </p>
      </div>
    </section>
  );
}
