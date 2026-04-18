import ValidationViz from './viz/ValidationViz';

export default function Validation() {
  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">패킷 검증 &amp; 스코프 해석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ValidationViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">TaskPacket::validate()</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">validate() — 5단계 검증</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">1</span>
              <div>
                <strong>필수 필드</strong> — <code>title</code> 비어있으면 에러, 200자 초과 에러
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">2</span>
              <div>
                <strong>Goals 존재</strong> — <code>goals.is_empty()</code> → "at least one goal required"
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">3</span>
              <div>
                <strong>Self-dependency</strong> — <code>depends_on.contains(&self.id)</code> → 자기 참조 차단
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">4</span>
              <div>
                <strong>명령 안전성</strong> — <code>completion_check</code>에 <code>rm -rf</code> 등 위험 패턴 차단
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">5</span>
              <div>
                <strong>제약 일관성</strong> — <code>validate_constraints()</code> glob 파싱·불가능 조건 체크
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>5단계 검증</strong>: 필수 필드 → Goals → 의존성 → 안전성 → 일관성<br />
          완료 확인 명령에 <code>rm -rf</code> 등 위험 패턴 차단<br />
          조기 검증으로 "생성된 task가 나중에 실패"하는 경우 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Constraint 일관성 체크</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">validate_constraints() — 패턴별 체크</p>
            <div className="space-y-2 text-sm">
              <p><code>NoTouchFiles(files)</code> → 각 파일 패턴을 <code>glob::Pattern::new()</code>로 파싱 — 유효하지 않으면 에러</p>
              <p><code>MaxChanges(n)</code> → <code>n == 0</code>이면 "task impossible" 에러 차단</p>
              <p>그 외 kind → 통과</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">중복 constraint 감지</p>
            <p className="text-sm"><code>std::mem::discriminant()</code>로 kind 변형(variant) 비교 → <code>HashSet</code>에 수집</p>
            <p className="text-sm">set 크기 != constraints 수 → 경고 로그 (<code>log::warn!</code>) — 허용하되 주의 환기</p>
          </div>
        </div>
        <p>
          <strong>패턴 유효성</strong>: glob 파싱 실패 = invalid task<br />
          <strong>불가능 조건</strong>: MaxChanges=0 차단 — 작업 자체가 불가<br />
          중복 constraint는 경고만 — 허용하되 주의 환기
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">스코프 해석 — resolve_scope()</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">resolve_scope(workspace) — 3단계 스코프 구축</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">1</span>
              <div>
                <strong>팀 패턴</strong> — <code>team.file_patterns</code> → allowed 추가 / <code>team.excluded_patterns</code> → denied 추가<br />
                <span className="text-muted-foreground">팀 없으면 워크스페이스 전체 allowed</span>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">2</span>
              <div>
                <strong>Task constraint</strong> — <code>NoTouchFiles(patterns)</code> → denied에 추가
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">3</span>
              <div>
                <strong>전역 블랙리스트</strong> — <code>default_blacklist_paths()</code> → denied에 추가
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">결과: <code>ResolvedScope {'{'} allowed, denied {'}'}</code> — deny 우선</p>
        </div>
        <p>
          <strong>3단계 스코프 해석</strong>: 팀 패턴 → task constraint → 전역 블랙리스트<br />
          각 단계는 allow/deny 리스트에 누적<br />
          최종 결과: 명시적 allow 목록 + 명시적 deny 목록 (deny 우선)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ResolvedScope 활용</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose my-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">ResolvedScope</p>
            <p className="text-sm"><code>allowed: Vec&lt;PathBuf&gt;</code> — 허용 경로</p>
            <p className="text-sm"><code>denied: Vec&lt;PathBuf&gt;</code> — 거부 경로</p>
            <p className="text-sm mt-2"><code>is_allowed(path)</code>: denied 먼저 체크 (우선) → allowed 체크</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">PermissionEnforcer 통합</p>
            <p className="text-sm"><code>check_task_scope(path)</code></p>
            <p className="text-sm"><code>current_task_scope</code> 존재 시 <code>is_allowed()</code> 호출</p>
            <p className="text-sm text-muted-foreground mt-1">scope 밖 접근 → "path outside task scope" 에러</p>
          </div>
        </div>
        <p>
          <strong>Task 스코프 = 추가 권한 레이어</strong><br />
          기본 워크스페이스 경계 위에 <strong>task별 서브 스코프</strong><br />
          예: "frontend 팀 task는 src/web/만 수정 가능"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">완료 판정 — check_completion()</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">실행 방식</p>
            <p className="text-sm">각 Goal의 <code>completion_check</code> 명령을 <code>/bin/sh -c</code>로 실행</p>
            <p className="text-sm"><code>exit 0</code> → 통과 / 그 외 → 실패 (<code>unwrap_or(false)</code>)</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">CompletionStatus — 4가지 결과</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2 border border-border">
                <code>AllGoalsPassed</code>
                <p className="text-xs text-muted-foreground mt-1">passed == total</p>
              </div>
              <div className="bg-background rounded px-3 py-2 border border-border">
                <code>PartiallyComplete</code>
                <p className="text-xs text-muted-foreground mt-1">0 &lt; passed &lt; total</p>
              </div>
              <div className="bg-background rounded px-3 py-2 border border-border">
                <code>NotComplete</code>
                <p className="text-xs text-muted-foreground mt-1">passed == 0</p>
              </div>
              <div className="bg-background rounded px-3 py-2 border border-border">
                <code>ManualReview</code>
                <p className="text-xs text-muted-foreground mt-1">자동 확인 명령 없음 (total == 0)</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>Goals의 completion_check 실행</strong>: 각 명령이 exit 0이면 통과<br />
          4가지 결과: AllGoalsPassed, PartiallyComplete, NotComplete, ManualReview<br />
          ManualReview: 자동 확인 명령 없음 → 사람이 검토 필요
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 검증의 계층적 구조</p>
          <p>
            TaskPacket은 3단계 검증을 거침:
          </p>
          <p className="mt-2">
            <strong>1단계 (생성 시)</strong>: validate() — 스키마·일관성<br />
            <strong>2단계 (실행 시)</strong>: resolve_scope() — 권한·범위<br />
            <strong>3단계 (완료 시)</strong>: check_completion() — 목표 달성
          </p>
          <p className="mt-2">
            각 단계가 독립 책임:<br />
            - 1단계: "task 자체가 말이 되나?"<br />
            - 2단계: "이 task가 접근 가능한 파일은?"<br />
            - 3단계: "task가 완료됐나?"
          </p>
          <p className="mt-2">
            이 계층이 제공하는 가치: <strong>각 단계에서 명확한 피드백</strong><br />
            1단계 실패 → task 수정<br />
            2단계 실패 → 팀·권한 조정<br />
            3단계 실패 → LLM 재작업<br />
            → 사용자가 무엇을 고쳐야 할지 명확히 알 수 있음
          </p>
        </div>

      </div>
    </section>
  );
}
