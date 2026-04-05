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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 입력 (LLM 응답)
## 분석 결과
**결론**: 이 함수는 \`unsafe\` 블록을 사용합니다.

// 터미널 출력 (ANSI 적용)
\\x1b[1m## 분석 결과\\x1b[0m
\\x1b[1m결론\\x1b[0m: 이 함수는 \\x1b[38;5;208munsafe\\x1b[0m 블록을 사용합니다.

// 화면에 보이는 모습
# 분석 결과              (굵은 제목)
결론: 이 함수는 unsafe   (결론 굵게, unsafe 주황)
블록을 사용합니다.`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">MarkdownRenderer 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct MarkdownRenderer {
    theme: Theme,
    width: usize,  // 터미널 너비 (줄바꿈용)
}

pub struct Theme {
    heading_1: Style,
    heading_2: Style,
    heading_3: Style,
    bold: Style,
    italic: Style,
    code_inline: Style,
    code_block: Style,
    link: Style,
    list_bullet: Style,
}

pub struct Style {
    fg: Option<Color>,
    bg: Option<Color>,
    bold: bool,
    italic: bool,
    underline: bool,
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">pulldown-cmark 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`use pulldown_cmark::{Parser, Event, Tag};

impl MarkdownRenderer {
    pub fn render(&self, markdown: &str) -> String {
        let parser = Parser::new(markdown);
        let mut out = String::new();
        let mut list_depth = 0;

        for event in parser {
            match event {
                Event::Start(Tag::Heading(level, _, _)) => {
                    let style = match level {
                        HeadingLevel::H1 => &self.theme.heading_1,
                        HeadingLevel::H2 => &self.theme.heading_2,
                        _ => &self.theme.heading_3,
                    };
                    out.push_str(&style.prefix());
                }
                Event::End(Tag::Heading(_, _, _)) => {
                    out.push_str(ANSI_RESET);
                    out.push('\\n');
                }

                Event::Start(Tag::Emphasis) => out.push_str(&self.theme.italic.prefix()),
                Event::End(Tag::Emphasis) => out.push_str(ANSI_RESET),

                Event::Start(Tag::Strong) => out.push_str(&self.theme.bold.prefix()),
                Event::End(Tag::Strong) => out.push_str(ANSI_RESET),

                Event::Code(text) => {
                    out.push_str(&self.theme.code_inline.prefix());
                    out.push_str(&text);
                    out.push_str(ANSI_RESET);
                }

                Event::Text(text) => out.push_str(&text),

                Event::Start(Tag::List(_)) => list_depth += 1,
                Event::End(Tag::List(_)) => list_depth -= 1,

                Event::Start(Tag::Item) => {
                    out.push_str(&"  ".repeat(list_depth - 1));
                    out.push_str(&self.theme.list_bullet.prefix());
                    out.push_str("• ");
                    out.push_str(ANSI_RESET);
                }

                // ... 나머지 이벤트 처리
                _ => {}
            }
        }
        out
    }
}`}</pre>
        <p>
          <code>pulldown-cmark</code>: Rust 마크다운 파서 — CommonMark 표준 준수<br />
          이벤트 기반 파싱 — 각 마크다운 요소가 Start/End 이벤트 쌍<br />
          Start에서 ANSI 코드 시작, End에서 reset — 렌더링 상태 관리 간단
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">코드 블록 — syntect 하이라이팅</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`use syntect::{
    easy::HighlightLines, parsing::SyntaxSet,
    highlighting::{ThemeSet, Style}, util::as_24_bit_terminal_escaped,
};

impl MarkdownRenderer {
    fn render_code_block(&self, code: &str, language: &str) -> String {
        let ss = SyntaxSet::load_defaults_newlines();
        let ts = ThemeSet::load_defaults();

        // 언어 감지
        let syntax = ss.find_syntax_by_token(language)
            .unwrap_or_else(|| ss.find_syntax_plain_text());

        // 하이라이터 초기화
        let mut h = HighlightLines::new(syntax, &ts.themes["base16-ocean.dark"]);

        let mut out = String::from("\\n");
        for line in code.lines() {
            let ranges: Vec<(Style, &str)> = h.highlight_line(line, &ss).unwrap();
            out.push_str(&as_24_bit_terminal_escaped(&ranges[..], false));
            out.push('\\n');
        }
        out
    }
}`}</pre>
        <p>
          <strong>syntect</strong>: Sublime Text의 syntax highlighting 엔진을 Rust 포트<br />
          지원 언어 100개 이상 — Rust, Python, TypeScript, Go 등<br />
          24-bit 색상 지원 — 최신 터미널에서 IDE 수준의 하이라이팅
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">스트리밍 렌더링 — 실시간 출력</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct StreamingRenderer {
    accumulated: String,
    rendered_up_to: usize,
}

impl StreamingRenderer {
    pub fn append(&mut self, delta: &str) {
        self.accumulated.push_str(delta);

        // 완전한 마크다운 단위(줄 끝) 찾기
        if let Some(last_newline) = self.accumulated[self.rendered_up_to..].rfind('\\n') {
            let end = self.rendered_up_to + last_newline + 1;
            let to_render = &self.accumulated[self.rendered_up_to..end];

            // 렌더링 후 출력
            let rendered = MarkdownRenderer::new().render(to_render);
            print!("{}", rendered);
            std::io::stdout().flush().ok();

            self.rendered_up_to = end;
        }
    }

    pub fn finalize(&mut self) {
        // 남은 부분(줄바꿈 없이 끝난) 렌더링
        let rest = &self.accumulated[self.rendered_up_to..];
        print!("{}", MarkdownRenderer::new().render(rest));
        self.rendered_up_to = self.accumulated.len();
    }
}`}</pre>
        <p>
          <strong>줄 단위 렌더링</strong>: 완전한 줄이 도착하면 렌더 + 출력<br />
          부분 줄은 버퍼에 유지 — 마크다운이 완전해야 올바른 파싱<br />
          <code>flush()</code>로 즉시 화면 업데이트 — 사용자 실시간 피드백
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">터미널 기능 감지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub fn detect_terminal_capabilities() -> TermCaps {
    TermCaps {
        color: has_color_support(),
        true_color: std::env::var("COLORTERM")
            .map(|v| v == "truecolor" || v == "24bit")
            .unwrap_or(false),
        width: terminal_size::terminal_size()
            .map(|(w, _)| w.0 as usize)
            .unwrap_or(80),
        unicode: is_unicode_term(),
        is_tty: atty::is(atty::Stream::Stdout),
    }
}

fn has_color_support() -> bool {
    // NO_COLOR 환경 변수 존중
    if std::env::var("NO_COLOR").is_ok() { return false; }

    // TERM 확인
    match std::env::var("TERM") {
        Ok(t) if t == "dumb" => false,
        Ok(_) => true,
        Err(_) => false,
    }
}`}</pre>
        <p>
          <strong>기능별 적응</strong>: 터미널이 지원하는 기능만 사용<br />
          <code>NO_COLOR</code> 환경 변수: 색상 비활성화 표준 (no-color.org)<br />
          <code>TERM=dumb</code>: 단순 터미널 — ANSI 비활성화<br />
          is_tty=false: 파이프·리다이렉션 — 일반 텍스트 출력
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
