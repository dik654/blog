import MarkdownViz from './viz/MarkdownViz';

export default function Rendering() {
  return (
    <section id="rendering" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">마크다운 → ANSI 렌더링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <MarkdownViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 ANSI 렌더링인가</h3>
        <p>
          LLM은 마크다운으로 응답 — <code>## 제목</code>, <code>`코드`</code>, <code>**굵게**</code> 등<br />
          터미널에서는 마크다운이 그대로 표시됨 — <strong>가독성 나쁨</strong><br />
          해결: 마크다운을 ANSI 이스케이프 코드로 변환 — 굵게·색상·들여쓰기 적용
        </p>
        <div className="not-prose my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted/30 border border-border rounded-lg overflow-hidden">
            <div className="bg-muted px-3 py-1.5 border-b border-border text-xs font-semibold">입력 (마크다운 원본)</div>
            <div className="p-3 font-mono text-sm space-y-1">
              <p className="text-muted-foreground">## 분석 결과</p>
              <p className="text-muted-foreground">**결론**: 이 함수는 `unsafe` 블록을 사용합니다.</p>
            </div>
          </div>
          <div className="bg-muted/30 border border-border rounded-lg overflow-hidden">
            <div className="bg-muted px-3 py-1.5 border-b border-border text-xs font-semibold">출력 (ANSI 렌더링)</div>
            <div className="p-3 font-mono text-sm bg-zinc-900 text-zinc-100 rounded-b-lg space-y-1">
              <p className="font-bold text-lg">분석 결과</p>
              <p><span className="font-bold">결론</span>: 이 함수는 <span className="text-orange-400">unsafe</span> 블록을 사용합니다.</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">MarkdownRenderer 구조</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">MarkdownRenderer</span>
            <span className="text-xs text-muted-foreground ml-2">theme + width(터미널 너비)</span>
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Theme 스타일 슬롯</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {['heading_1', 'heading_2', 'heading_3', 'bold', 'italic', 'code_inline', 'code_block', 'link', 'list_bullet'].map(s => (
                <div key={s} className="bg-background border border-border rounded px-2 py-1.5 text-center">
                  <code className="text-xs">{s}</code>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-3 mb-2">Style 속성</p>
            <div className="flex flex-wrap gap-2">
              {[
                { prop: 'fg', desc: '글자 색상' },
                { prop: 'bg', desc: '배경 색상' },
                { prop: 'bold', desc: '굵게' },
                { prop: 'italic', desc: '기울임' },
                { prop: 'underline', desc: '밑줄' },
              ].map(({ prop, desc }) => (
                <span key={prop} className="inline-flex items-center gap-1 bg-background border border-border rounded px-2 py-1 text-xs">
                  <code className="font-semibold text-primary">{prop}</code>
                  <span className="text-muted-foreground">{desc}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">pulldown-cmark 통합</h3>
        <p>
          <code>pulldown-cmark</code>: Rust 마크다운 파서 — CommonMark 표준 준수<br />
          이벤트 기반 파싱 — Start에서 ANSI 코드 시작, End에서 reset
        </p>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">render() 이벤트 매핑</span>
            <span className="text-xs text-muted-foreground ml-2">Event → ANSI 변환</span>
          </div>
          <div className="divide-y divide-border">
            {[
              { event: 'Heading(H1/H2/H3)', action: 'theme.heading_N.prefix() → ANSI_RESET', example: '## 제목 → 굵은 색상 제목' },
              { event: 'Strong', action: 'theme.bold.prefix() → ANSI_RESET', example: '**텍스트** → 굵게' },
              { event: 'Emphasis', action: 'theme.italic.prefix() → ANSI_RESET', example: '*텍스트* → 기울임' },
              { event: 'Code(text)', action: 'theme.code_inline.prefix() + text + ANSI_RESET', example: '`코드` → 강조 색상' },
              { event: 'List + Item', action: 'list_depth 들여쓰기 + "  " + 불릿', example: '- 항목 → • 항목 (중첩 지원)' },
            ].map(({ event, action, example }) => (
              <div key={event} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 text-sm">
                <code className="text-xs text-primary font-semibold">{event}</code>
                <span className="text-xs text-muted-foreground">{action}</span>
                <span className="text-xs">{example}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">코드 블록 — syntect 하이라이팅</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">render_code_block()</span>
            <span className="text-xs text-muted-foreground ml-2">syntect 기반</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs font-semibold text-muted-foreground">엔진</p>
                <p className="text-sm font-semibold">syntect</p>
                <p className="text-xs text-muted-foreground mt-1">Sublime Text 하이라이팅의 Rust 포트</p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs font-semibold text-muted-foreground">언어 지원</p>
                <p className="text-sm font-semibold">100개 이상</p>
                <p className="text-xs text-muted-foreground mt-1">Rust, Python, TypeScript, Go 등</p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs font-semibold text-muted-foreground">색상 깊이</p>
                <p className="text-sm font-semibold">24-bit True Color</p>
                <p className="text-xs text-muted-foreground mt-1">IDE 수준의 하이라이팅</p>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <p><code className="text-xs">find_syntax_by_token(language)</code>로 언어 감지 — 실패 시 plain text 폴백</p>
              <p>테마: <code className="text-xs">base16-ocean.dark</code> — 각 줄을 <code className="text-xs">as_24_bit_terminal_escaped()</code>로 변환</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">스트리밍 렌더링 — 실시간 출력</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">StreamingRenderer</span>
            <span className="text-xs text-muted-foreground ml-2">accumulated + rendered_up_to 포인터</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-background border border-border rounded p-3">
                <p className="font-semibold text-sm">append(delta)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  델타를 버퍼에 누적 → 마지막 <code className="text-xs">\n</code> 위치 탐색 → 완전한 줄만 렌더링 + <code className="text-xs">flush()</code>
                </p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <p className="font-semibold text-sm">finalize()</p>
                <p className="text-xs text-muted-foreground mt-1">
                  줄바꿈 없이 끝난 나머지 텍스트 렌더링 — 스트림 종료 시 호출
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">줄 단위 렌더링</strong>: 부분 줄은 버퍼에 유지 — 마크다운이 완전해야 올바른 파싱<br />
              <code className="text-xs">flush()</code>로 즉시 화면 업데이트 — 사용자 실시간 피드백
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">터미널 기능 감지</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">detect_terminal_capabilities()</span>
            <span className="text-xs text-muted-foreground ml-2">TermCaps 구조체 반환</span>
          </div>
          <div className="divide-y divide-border">
            {[
              { cap: 'color', source: 'NO_COLOR 환경변수 + TERM 확인', fallback: 'TERM=dumb → false' },
              { cap: 'true_color', source: 'COLORTERM == "truecolor" || "24bit"', fallback: '미설정 → false' },
              { cap: 'width', source: 'terminal_size::terminal_size()', fallback: '감지 실패 → 80' },
              { cap: 'unicode', source: 'is_unicode_term()', fallback: '터미널 인코딩 확인' },
              { cap: 'is_tty', source: 'atty::is(Stream::Stdout)', fallback: 'false → 파이프/리다이렉션' },
            ].map(({ cap, source, fallback }) => (
              <div key={cap} className="grid grid-cols-3 gap-2 p-3 text-sm">
                <code className="text-xs text-primary font-semibold">{cap}</code>
                <span className="text-xs">{source}</span>
                <span className="text-xs text-muted-foreground">{fallback}</span>
              </div>
            ))}
          </div>
        </div>
        <p>
          <strong>기능별 적응</strong>: 터미널이 지원하는 기능만 사용<br />
          <code>NO_COLOR</code> 환경 변수: 색상 비활성화 표준 (no-color.org)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CLI UX의 디테일</p>
          <p>
            CLI 에이전트의 사용자 경험은 <strong>렌더링 품질에 크게 좌우</strong><br />
            원시 마크다운 vs ANSI 렌더링:
          </p>
          <p className="mt-2">
            <strong>원시 마크다운의 문제</strong>:<br />
            - <code>**굵게**</code> 같은 기호가 그대로 보여 시각적 노이즈<br />
            - 코드 블록 구분 없음 — 일반 텍스트와 섞임<br />
            - 긴 응답에서 구조 파악 어려움
          </p>
          <p className="mt-2">
            <strong>ANSI 렌더링 효과</strong>:<br />
            ✓ 가독성 3-5배 향상<br />
            ✓ 코드·리스트·강조 즉시 구분<br />
            ✓ "사용할 만한 CLI" 느낌
          </p>
          <p className="mt-2">
            claw-code는 이 디테일에 투자 — <strong>"터미널 네이티브" 경험</strong> 추구<br />
            경쟁 에이전트 CLI들이 덜 다듬어져 있어 차별화 포인트
          </p>
        </div>

      </div>
    </section>
  );
}
