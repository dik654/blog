import SearchViz from './viz/SearchViz';

export default function Search() {
  return (
    <section id="search" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">glob_search &amp; grep_search</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SearchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">glob_search — 파일명 패턴 매칭</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct GlobSearchInput {
    pub pattern: String,           // "**/*.rs", "src/**/*.ts"
    pub path: Option<String>,      // 검색 루트 (기본: workspace)
}

pub async fn glob_search(input: Value) -> Result<ToolOutput> {
    let GlobSearchInput { pattern, path } = serde_json::from_value(input)?;
    let root = path.map(PathBuf::from).unwrap_or_else(workspace_root);

    validate_path(&root, &workspace_root())?;

    // walkdir로 재귀 탐색
    let mut matches = Vec::new();
    for entry in walkdir::WalkDir::new(&root).into_iter().flatten() {
        let rel_path = entry.path().strip_prefix(&root)?;

        // 블랙리스트 제외
        if default_blacklist().matches(entry.path()) { continue; }

        // glob 패턴 매칭
        if glob::Pattern::new(&pattern)?.matches_path(rel_path) {
            matches.push(entry.path().to_path_buf());
        }

        // 결과 상한 (1000개)
        if matches.len() >= 1000 { break; }
    }

    // 수정 시각 기준 정렬
    matches.sort_by_key(|p| std::fs::metadata(p).ok().and_then(|m| m.modified().ok()));
    matches.reverse();  // 최근 수정 순

    Ok(ToolOutput::text(format_paths(&matches)))
}`}</pre>
        <p>
          <strong>walkdir 재귀 탐색</strong>: 모든 하위 파일 순회 — 심링크는 기본 추적 안 함<br />
          <strong>블랙리스트 필터</strong>: <code>.env</code>, <code>.git/</code> 등 자동 제외<br />
          <strong>결과 1000개 상한</strong>: LLM 컨텍스트 보호 — 초과 시 경고 표시
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">정렬 전략 — 수정 시각 최신순</h3>
        <p>
          <strong>왜 수정 시각?</strong> 이름순 정렬 대비 "최근 작업 파일"을 먼저 보여줌<br />
          LLM이 "이 프로젝트 최근 수정 파일"을 묻는 질문에 바로 답 가능<br />
          시각 데이터 없으면(일부 파일시스템) 이름순 폴백
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">grep_search — 내용 정규식 검색</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct GrepSearchInput {
    pub pattern: String,
    pub path: Option<String>,
    pub glob: Option<String>,              // 파일 필터
    pub output_mode: Option<OutputMode>,
    pub case_insensitive: bool,
    pub line_numbers: bool,
    pub context_lines: Option<usize>,      // -C N
    pub multiline: bool,
    pub head_limit: Option<usize>,
}

pub enum OutputMode {
    Content,           // 매칭 줄 반환 (기본)
    FilesWithMatches,  // 파일 경로만
    Count,             // 파일별 매칭 수
}`}</pre>
        <p>
          <strong>9개 파라미터</strong>: ripgrep 플래그를 JSON 스키마로 노출<br />
          3가지 OutputMode — 상황에 맞게 선택하여 토큰 절약<br />
          - <code>FilesWithMatches</code>: "어떤 파일에 존재하는가?" → 경로 목록만<br />
          - <code>Count</code>: "몇 번 나타나는가?" → 숫자만<br />
          - <code>Content</code>: "실제 코드를 보고 싶다" → 매칭 줄 + 컨텍스트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ripgrep 라이브러리 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`use grep::regex::RegexMatcher;
use grep::searcher::{Searcher, Sink, SinkMatch};

pub async fn grep_search(input: Value) -> Result<ToolOutput> {
    let req: GrepSearchInput = serde_json::from_value(input)?;

    // 정규식 컴파일
    let matcher = RegexMatcher::new_line_matcher(&req.pattern)?;

    // Searcher 설정
    let mut searcher = Searcher::new();
    searcher.set_multi_line(req.multiline);
    if req.case_insensitive {
        // re::(?i) 플래그 자동 추가는 별도 처리
    }
    searcher.set_before_context(req.context_lines.unwrap_or(0));
    searcher.set_after_context(req.context_lines.unwrap_or(0));

    // 파일 순회 (glob로 필터)
    let mut sink = CollectingSink::new(req.head_limit.unwrap_or(50));
    for path in glob_files(&req.path, &req.glob)? {
        searcher.search_path(&matcher, &path, &mut sink)?;
    }

    Ok(ToolOutput::text(sink.format(req.output_mode)))
}`}</pre>
        <p>
          <code>grep</code> crate(ripgrep의 라이브러리 버전) 사용 — ripgrep CLI와 동일 성능<br />
          <strong>멀티라인 지원</strong>: <code>multiline=true</code>일 때 패턴이 줄 경계를 넘을 수 있음<br />
          <strong>컨텍스트 라인</strong>: 매칭 전후 N줄을 함께 출력 — 코드 의미 파악 용이
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CollectingSink — 결과 수집기</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`struct CollectingSink {
    matches: Vec<MatchRecord>,
    head_limit: usize,
}

impl Sink for CollectingSink {
    type Error = std::io::Error;

    fn matched(
        &mut self,
        _searcher: &Searcher,
        mat: &SinkMatch<'_>,
    ) -> Result<bool, Self::Error> {
        self.matches.push(MatchRecord {
            path: mat.path().to_path_buf(),
            line_number: mat.line_number(),
            content: String::from_utf8_lossy(mat.bytes()).to_string(),
        });
        // false 반환하면 검색 중단
        Ok(self.matches.len() < self.head_limit)
    }
}`}</pre>
        <p>
          <code>Sink</code> 트레이트 구현 — ripgrep 콜백 인터페이스<br />
          <code>matched()</code>가 false 반환하면 검색 중단 — head_limit 초과 시 활용<br />
          조기 중단으로 거대한 코드베이스에서도 빠른 응답
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">OutputMode별 포맷팅</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl CollectingSink {
    fn format(self, mode: Option<OutputMode>) -> String {
        match mode.unwrap_or(OutputMode::Content) {
            OutputMode::Content => {
                self.matches.iter()
                    .map(|m| format!("{}:{}:{}", m.path.display(), m.line_number.unwrap_or(0), m.content.trim_end()))
                    .collect::<Vec<_>>().join("\\n")
            }
            OutputMode::FilesWithMatches => {
                let mut files: Vec<_> = self.matches.iter().map(|m| &m.path).collect();
                files.sort(); files.dedup();
                files.iter().map(|p| p.display().to_string()).collect::<Vec<_>>().join("\\n")
            }
            OutputMode::Count => {
                let mut counts: HashMap<&Path, usize> = HashMap::new();
                for m in &self.matches { *counts.entry(&m.path).or_insert(0) += 1; }
                counts.iter()
                    .map(|(p, c)| format!("{}:{}", p.display(), c))
                    .collect::<Vec<_>>().join("\\n")
            }
        }
    }
}`}</pre>
        <p>
          <strong>Content 포맷</strong>: <code>path:line:content</code> (ripgrep 기본 포맷)<br />
          <strong>FilesWithMatches 포맷</strong>: 파일 경로만 (중복 제거)<br />
          <strong>Count 포맷</strong>: <code>path:count</code> — HashMap으로 집계
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 사용 패턴 — LLM이 자주 보내는 쿼리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 1. 함수 정의 찾기
grep_search(pattern="fn handle_tool_use", type="rs")

// 2. TODO 주석 모으기
grep_search(pattern="TODO|FIXME", output_mode="content", context_lines=1)

// 3. 특정 클래스 사용처
glob_search(pattern="**/*.ts") → files
→ grep_search(pattern="\\\\bPermissionEnforcer\\\\b", path="src/")

// 4. import 의존성 매핑
grep_search(pattern="^use crate::", glob="**/*.rs", output_mode="count")`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: ripgrep이 에이전트에 이상적인 이유</p>
          <p>
            1. <strong>gitignore 자동 적용</strong>: <code>node_modules</code>, <code>target</code> 등 자동 제외<br />
            2. <strong>UTF-8 안전</strong>: 바이너리 파일 자동 감지 후 스킵 — 에이전트가 걸릴 일 없음<br />
            3. <strong>병렬 검색</strong>: 멀티코어 활용 — 거대 모노레포도 빠름<br />
            4. <strong>정규식 완전 지원</strong>: lookahead, backreference 등 고급 패턴
          </p>
          <p className="mt-2">
            claw-code는 ripgrep CLI를 호출하지 않고 <strong>라이브러리로 직접 통합</strong><br />
            이유: 서브프로세스 비용 절감, stdout 파싱 불필요, 에러 처리 통일<br />
            트레이드오프: 라이브러리 버전 고정 — CLI 업데이트와 동기화 필요
          </p>
        </div>

      </div>
    </section>
  );
}
