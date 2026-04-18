export default function IDEIntegration() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">IDE 통합 & GitHub</h3>
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
        <h4 className="text-sm font-bold mb-3">IDE 통합 & GitHub 연동</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">IDE 확장 지원</span>
            <ul className="text-sm mt-1 space-y-0.5">
              <li>VS Code — Claude Code 확장 프로그램</li>
              <li>JetBrains — IntelliJ/WebStorm 플러그인</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-1">IDE 내에서 터미널 Claude Code와 동일한 경험</p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">GitHub 통합</span>
            <p className="text-sm mt-1">claude-code-action으로 @claude 멘션</p>
            <p className="text-xs text-muted-foreground mt-1">PR 리뷰, 코드 수정, 이슈 해결 자동화</p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3 mb-4">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">코드 리뷰 (/code-review)</span>
          <ul className="text-sm mt-1 space-y-0.5">
            <li>4개 리뷰 에이전트를 병렬 실행</li>
            <li>독립적으로 버그 탐색 → 교차 검증으로 false positive 필터링</li>
            <li>신뢰도 ≥80% 이슈만 표면화 → false positive 비율 {'<'}1%</li>
          </ul>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3">
          <span className="text-xs font-semibold">사용 패턴</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div className="text-sm"><code className="text-xs bg-neutral-100 dark:bg-neutral-700 px-1 rounded">claude</code> — 대화형 터미널</div>
            <div className="text-sm"><code className="text-xs bg-neutral-100 dark:bg-neutral-700 px-1 rounded">echo "질문" | claude</code> — 단발 파이프</div>
            <div className="text-sm"><code className="text-xs bg-neutral-100 dark:bg-neutral-700 px-1 rounded">claude -p "작업"</code> — 비대화형 스크립트용</div>
            <div className="text-sm"><code className="text-xs bg-neutral-100 dark:bg-neutral-700 px-1 rounded">@claude</code> — GitHub PR/이슈 멘션</div>
            <div className="text-sm"><code className="text-xs bg-neutral-100 dark:bg-neutral-700 px-1 rounded">claude-code-sdk</code> — 프로그래밍 통합</div>
          </div>
        </div>
      </div>
    </>
  );
}
