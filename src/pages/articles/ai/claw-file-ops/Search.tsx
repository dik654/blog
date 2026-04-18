import SearchViz from './viz/SearchViz';

export default function Search() {
  return (
    <section id="search" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">glob_search &amp; grep_search</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SearchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">glob_search — 파일명 패턴 매칭</h3>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-2">GlobSearchInput</div>
            <div className="p-4 grid grid-cols-2 gap-3 mb-3">
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">pattern: String</div>
                <div className="text-xs text-muted-foreground mt-1">예: <code className="bg-muted px-1 rounded">"**/*.rs"</code>, <code className="bg-muted px-1 rounded">"src/**/*.ts"</code></div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">path: Option&lt;String&gt;</div>
                <div className="text-xs text-muted-foreground mt-1">검색 루트 (기본: workspace)</div>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden mt-3">
            <div className="bg-teal-600 text-white text-xs font-semibold px-4 py-2">glob_search() — 실행 파이프라인</div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div className="text-sm"><strong>경로 검증</strong> — <code className="text-xs bg-muted px-1 rounded">validate_path</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div className="text-sm"><strong>walkdir 재귀 탐색</strong> — 모든 하위 파일 순회 (심링크 기본 비추적)</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div className="text-sm"><strong>블랙리스트 필터</strong> — <code className="text-xs bg-muted px-1 rounded">.env</code>, <code className="text-xs bg-muted px-1 rounded">.git/</code> 등 자동 제외</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <div className="text-sm"><strong>glob 패턴 매칭</strong> — 상대 경로 기준, 상한 1000개</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <div className="text-sm"><strong>수정 시각 정렬</strong> — 최근 수정 순 (시각 없으면 이름순 폴백)</div>
              </div>
            </div>
          </div>
        </div>
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
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-2">GrepSearchInput — 9개 파라미터</div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-xs font-semibold">pattern: String</div>
                <div className="text-xs text-muted-foreground mt-1">정규식 패턴</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-xs font-semibold">path: Option&lt;String&gt;</div>
                <div className="text-xs text-muted-foreground mt-1">검색 경로</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-xs font-semibold">glob: Option&lt;String&gt;</div>
                <div className="text-xs text-muted-foreground mt-1">파일 필터</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-xs font-semibold">output_mode</div>
                <div className="text-xs text-muted-foreground mt-1">출력 형식 선택</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-xs font-semibold">case_insensitive</div>
                <div className="text-xs text-muted-foreground mt-1">대소문자 무시</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-xs font-semibold">line_numbers</div>
                <div className="text-xs text-muted-foreground mt-1">줄 번호 표시</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-xs font-semibold">context_lines</div>
                <div className="text-xs text-muted-foreground mt-1">전후 N줄 포함 (-C)</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-xs font-semibold">multiline</div>
                <div className="text-xs text-muted-foreground mt-1">줄 경계 넘는 패턴</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-xs font-semibold">head_limit</div>
                <div className="text-xs text-muted-foreground mt-1">결과 상한</div>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden mt-3">
            <div className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2">OutputMode — 3가지 출력 형식</div>
            <div className="p-4 grid grid-cols-3 gap-3">
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">Content</div>
                <div className="text-xs text-muted-foreground mt-1">매칭 줄 반환 (기본)</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">FilesWithMatches</div>
                <div className="text-xs text-muted-foreground mt-1">파일 경로만</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">Count</div>
                <div className="text-xs text-muted-foreground mt-1">파일별 매칭 수</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>9개 파라미터</strong>: ripgrep 플래그를 JSON 스키마로 노출<br />
          3가지 OutputMode — 상황에 맞게 선택하여 토큰 절약<br />
          - <code>FilesWithMatches</code>: "어떤 파일에 존재하는가?" → 경로 목록만<br />
          - <code>Count</code>: "몇 번 나타나는가?" → 숫자만<br />
          - <code>Content</code>: "실제 코드를 보고 싶다" → 매칭 줄 + 컨텍스트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ripgrep 라이브러리 통합</h3>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-orange-600 text-white text-xs font-semibold px-4 py-2">grep_search() — ripgrep 라이브러리 직접 통합</div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div className="text-sm"><strong>정규식 컴파일</strong> — <code className="text-xs bg-muted px-1 rounded">RegexMatcher::new_line_matcher(&pattern)</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div className="text-sm"><strong>Searcher 설정</strong> — multiline, case_insensitive, before/after context 적용</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div className="text-sm"><strong>파일 순회</strong> — <code className="text-xs bg-muted px-1 rounded">glob_files()</code>로 대상 파일 수집</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <div className="text-sm"><strong>Sink 수집</strong> — <code className="text-xs bg-muted px-1 rounded">CollectingSink</code>에 매칭 결과 누적 (head_limit 기본 50)</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <div className="text-sm"><strong>OutputMode 포맷</strong> — Content / FilesWithMatches / Count 중 선택</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>grep</code> crate(ripgrep의 라이브러리 버전) 사용 — ripgrep CLI와 동일 성능<br />
          <strong>멀티라인 지원</strong>: <code>multiline=true</code>일 때 패턴이 줄 경계를 넘을 수 있음<br />
          <strong>컨텍스트 라인</strong>: 매칭 전후 N줄을 함께 출력 — 코드 의미 파악 용이
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CollectingSink — 결과 수집기</h3>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-gray-600 text-white text-xs font-semibold px-4 py-2">CollectingSink — Sink 트레이트 구현</div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background border border-border rounded-md p-3">
                  <div className="font-mono text-xs font-semibold">matches: Vec&lt;MatchRecord&gt;</div>
                  <div className="text-xs text-muted-foreground mt-1">수집된 매칭 결과</div>
                </div>
                <div className="bg-background border border-border rounded-md p-3">
                  <div className="font-mono text-xs font-semibold">head_limit: usize</div>
                  <div className="text-xs text-muted-foreground mt-1">결과 상한 (초과 시 검색 중단)</div>
                </div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">matched() 콜백</div>
                <div className="text-sm space-y-1">
                  <div>각 매칭마다 <code className="text-xs bg-muted px-1 rounded">MatchRecord</code> 저장 (path, line_number, content)</div>
                  <div className="text-xs text-muted-foreground"><code className="bg-muted px-1 rounded">false</code> 반환 시 검색 즉시 중단 — head_limit 초과 방지로 거대 코드베이스에서도 빠른 응답</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>Sink</code> 트레이트 구현 — ripgrep 콜백 인터페이스<br />
          <code>matched()</code>가 false 반환하면 검색 중단 — head_limit 초과 시 활용<br />
          조기 중단으로 거대한 코드베이스에서도 빠른 응답
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">OutputMode별 포맷팅</h3>
        <div className="not-prose mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Content (기본)</div>
              <div className="text-sm font-mono bg-background border border-border rounded-md p-2 text-xs">path:line:content</div>
              <div className="text-xs text-muted-foreground mt-2">ripgrep 기본 포맷과 동일</div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">FilesWithMatches</div>
              <div className="text-sm font-mono bg-background border border-border rounded-md p-2 text-xs">path (중복 제거)</div>
              <div className="text-xs text-muted-foreground mt-2">sort + dedup 후 경로만 출력</div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Count</div>
              <div className="text-sm font-mono bg-background border border-border rounded-md p-2 text-xs">path:count</div>
              <div className="text-xs text-muted-foreground mt-2">HashMap으로 파일별 집계</div>
            </div>
          </div>
        </div>
        <p>
          <strong>Content 포맷</strong>: <code>path:line:content</code> (ripgrep 기본 포맷)<br />
          <strong>FilesWithMatches 포맷</strong>: 파일 경로만 (중복 제거)<br />
          <strong>Count 포맷</strong>: <code>path:count</code> — HashMap으로 집계
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 사용 패턴 — LLM이 자주 보내는 쿼리</h3>
        <div className="not-prose mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">1. 함수 정의 찾기</div>
            <code className="text-xs bg-background px-2 py-1 rounded border border-border block">grep_search(pattern="fn handle_tool_use", type="rs")</code>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">2. TODO 주석 모으기</div>
            <code className="text-xs bg-background px-2 py-1 rounded border border-border block">grep_search(pattern="TODO|FIXME", output_mode="content", context_lines=1)</code>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">3. 특정 클래스 사용처</div>
            <code className="text-xs bg-background px-2 py-1 rounded border border-border block mb-1">glob_search(pattern="**/*.ts")</code>
            <code className="text-xs bg-background px-2 py-1 rounded border border-border block">grep_search(pattern="\bPermissionEnforcer\b", path="src/")</code>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">4. import 의존성 매핑</div>
            <code className="text-xs bg-background px-2 py-1 rounded border border-border block">grep_search(pattern="^use crate::", glob="**/*.rs", output_mode="count")</code>
          </div>
        </div>

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
