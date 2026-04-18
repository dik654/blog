import ReadWriteViz from './viz/ReadWriteViz';

export default function ReadWrite() {
  return (
    <section id="read-write" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">read_file / write_file / edit_file 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ReadWriteViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">read_file — 줄 단위 읽기</h3>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-2">TextFilePayload 입력</div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-background border border-border rounded-md p-3">
                  <div className="font-mono text-sm font-semibold">path: String</div>
                  <div className="text-xs text-muted-foreground mt-1">파일 경로</div>
                </div>
                <div className="bg-background border border-border rounded-md p-3">
                  <div className="font-mono text-sm font-semibold">offset: Option&lt;usize&gt;</div>
                  <div className="text-xs text-muted-foreground mt-1">시작 줄 (0-indexed)</div>
                </div>
                <div className="bg-background border border-border rounded-md p-3">
                  <div className="font-mono text-sm font-semibold">limit: Option&lt;usize&gt;</div>
                  <div className="text-xs text-muted-foreground mt-1">읽을 줄 수</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden mt-3">
            <div className="bg-green-600 text-white text-xs font-semibold px-4 py-2">read_file() — 5단계 실행</div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div className="text-sm"><strong>경로 검증</strong> — <code className="text-xs bg-muted px-1 rounded">validate_path(&path, &workspace_root())</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div className="text-sm"><strong>크기 체크</strong> — <code className="text-xs bg-muted px-1 rounded">MAX_FILE_SIZE = 10MB</code> 초과 시 거부</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div className="text-sm"><strong>전체 읽기</strong> — <code className="text-xs bg-muted px-1 rounded">tokio::fs::read_to_string</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <div className="text-sm"><strong>offset/limit 적용</strong> — <code className="text-xs bg-muted px-1 rounded">lines[start..end]</code> 부분 추출</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <div className="text-sm"><strong>줄 번호 포맷</strong> — <code className="text-xs bg-muted px-1 rounded">{'{line_num}\\t{content}'}</code> 형식으로 출력</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>5단계 실행</strong>: 경로 검증 → 크기 체크 → 읽기 → 부분 추출 → 포맷팅<br />
          10MB 상한: LLM 컨텍스트 보호, 대용량 파일은 grep로 필터링 후 읽기 권장<br />
          줄 번호 프리픽스(<code>{`{line_num}\t{content}`}</code>): LLM이 정확한 위치 참조 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">write_file — 전체 덮어쓰기</h3>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-2">WriteFileInput 입력</div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">path: String</div>
                <div className="text-xs text-muted-foreground mt-1">대상 파일 경로</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">content: String</div>
                <div className="text-xs text-muted-foreground mt-1">전체 파일 내용</div>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden mt-3">
            <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-2">write_file() — 5단계 쓰기</div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div className="text-sm"><strong>경로 검증</strong> — <code className="text-xs bg-muted px-1 rounded">validate_path</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div className="text-sm"><strong>부모 디렉토리 생성</strong> — 없으면 <code className="text-xs bg-muted px-1 rounded">create_dir_all</code> 자동 mkdir</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div className="text-sm"><strong>기존 파일 백업</strong> — diff 추적용 이전 내용 보관</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <div className="text-sm"><strong>쓰기</strong> — <code className="text-xs bg-muted px-1 rounded">tokio::fs::write</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <div className="text-sm"><strong>diff 계산</strong> — UI에 변경 내용 표시 (새 파일이면 바이트 수만 표시)</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>5단계 쓰기</strong>: 검증 → 부모 디렉토리 생성 → 백업 → 쓰기 → diff 계산<br />
          부모 자동 생성: LLM이 <code>src/new/module.rs</code> 요청 시 <code>src/new/</code> 자동 mkdir<br />
          diff 출력: 사용자가 변경 내용을 즉시 검토 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">edit_file — 문자열 치환</h3>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-2">EditFileInput 입력</div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">path</div>
                <div className="text-xs text-muted-foreground mt-1">파일 경로</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">old_string</div>
                <div className="text-xs text-muted-foreground mt-1">찾을 문자열</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">new_string</div>
                <div className="text-xs text-muted-foreground mt-1">치환할 문자열</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="font-mono text-sm font-semibold">replace_all</div>
                <div className="text-xs text-muted-foreground mt-1">기본 false: 1회만 치환</div>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden mt-3">
            <div className="bg-violet-600 text-white text-xs font-semibold px-4 py-2">edit_file() — 실행 흐름</div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div className="text-sm"><strong>파일 읽기</strong> — <code className="text-xs bg-muted px-1 rounded">tokio::fs::read_to_string</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div className="text-sm"><strong>발견 횟수 체크</strong> — 0이면 <code className="text-xs bg-muted px-1 rounded">Err("not found")</code>, 2+ &amp; <code className="text-xs bg-muted px-1 rounded">replace_all=false</code>면 <code className="text-xs bg-muted px-1 rounded">Err("appears N times")</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div className="text-sm"><strong>치환</strong> — <code className="text-xs bg-muted px-1 rounded">replace_all</code>이면 <code className="text-xs bg-muted px-1 rounded">replace()</code>, 아니면 <code className="text-xs bg-muted px-1 rounded">replacen(..., 1)</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <div className="text-sm"><strong>쓰기</strong> — 치환된 내용 저장, 치환 횟수 반환</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>핵심 안전장치</strong>: <code>replace_all=false</code>에서 <code>old_string</code>이 여러 번 나타나면 에러<br />
          이유: LLM이 "첫 매칭만"을 의도했는데 모호한 경우 — 잘못된 위치 수정 방지<br />
          사용자에게 "더 많은 컨텍스트 제공 또는 replace_all 사용"이라고 안내
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">edit_file의 고유성 요구 — 왜 중요한가</h3>
        <div className="not-prose mb-4 space-y-3">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">위험한 예시 — 모호한 old_string</div>
            <div className="text-sm space-y-2">
              <div className="bg-background rounded-md p-3 border border-border">
                <div className="text-xs text-muted-foreground mb-1">파일 내용</div>
                <code className="text-xs">let x = 1;</code><br />
                <code className="text-xs">let x = 2;</code>
              </div>
              <div className="bg-background rounded-md p-3 border border-border">
                <div className="text-xs text-muted-foreground mb-1">호출: <code className="bg-muted px-1 rounded text-xs">edit_file(path, "let x", "let y")</code></div>
                <div className="text-sm text-red-600 dark:text-red-400 font-semibold mt-1">Err("old_string appears 2 times") — 모호함 거부</div>
                <div className="text-xs text-muted-foreground mt-1">LLM이 <code className="bg-muted px-1 rounded">"let x = 1"</code> 같이 더 구체적으로 재시도</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">올바른 사용</div>
            <div className="bg-background rounded-md p-3 border border-border">
              <div className="text-xs text-muted-foreground mb-1">호출: <code className="bg-muted px-1 rounded text-xs">edit_file(path, "let x = 1;", "let x = 100;", replace_all=false)</code></div>
              <div className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">정확히 첫 매칭 1개만 치환 (replacen)</div>
            </div>
          </div>
        </div>
        <p>
          <strong>2회 이상 매칭 거부</strong>: 의도 모호성을 즉시 LLM에게 피드백<br />
          LLM이 에러를 보고 더 많은 컨텍스트(앞뒤 줄 포함)로 재시도<br />
          결과: "잘못된 위치 수정" 버그가 거의 발생하지 않음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">compute_diff — 간이 diff 생성</h3>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-gray-600 text-white text-xs font-semibold px-4 py-2">compute_diff() — similar crate 기반</div>
            <div className="p-4 space-y-3">
              <div className="bg-background border border-border rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">입력</div>
                <div className="text-sm"><code className="text-xs bg-muted px-1 rounded">old: &str</code> (이전 내용), <code className="text-xs bg-muted px-1 rounded">new: &str</code> (새 내용)</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-3 text-center">
                  <div className="font-mono text-lg font-bold text-red-600">-</div>
                  <div className="text-xs text-muted-foreground">Delete</div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md p-3 text-center">
                  <div className="font-mono text-lg font-bold text-green-600">+</div>
                  <div className="text-xs text-muted-foreground">Insert</div>
                </div>
                <div className="bg-background border border-border rounded-md p-3 text-center">
                  <div className="font-mono text-lg font-bold text-muted-foreground">&nbsp;</div>
                  <div className="text-xs text-muted-foreground">Equal</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <code className="bg-muted px-1 rounded">TextDiff::from_lines</code>로 라인 단위 비교 → unified diff 포맷 출력
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>similar</code> crate로 라인 단위 diff 생성<br />
          출력 포맷: unified diff (+/-/공백 프리픽스)<br />
          UI가 diff를 syntax highlighting하여 사용자에게 표시 — 변경 내용 즉시 파악
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: write_file vs edit_file 선택 기준</p>
          <p>
            <strong>write_file</strong>: 전체 덮어쓰기<br />
            - 적합: 새 파일 생성, 작은 파일 완전 재작성<br />
            - 부적합: 대용량 파일 일부 수정 — LLM이 전체 내용 재생성해야 함 (토큰 낭비)
          </p>
          <p className="mt-2">
            <strong>edit_file</strong>: 부분 치환<br />
            - 적합: 대부분의 리팩토링·버그 수정<br />
            - 부적합: 대량 변경 (여러 edit 호출 필요)
          </p>
          <p className="mt-2">
            <strong>일반 규칙</strong>: "파일의 &gt;50% 변경이면 write_file, 아니면 edit_file"<br />
            이유: edit_file은 old_string을 찾기 위해 LLM이 기존 코드 참조 필요 — 대변경 시 비용 더 큼<br />
            claw-code의 시스템 프롬프트가 LLM에게 이 가이드라인 제공
          </p>
        </div>

      </div>
    </section>
  );
}
