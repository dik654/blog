import CodePanel from '@/components/ui/code-panel';

export default function IDEIntegration() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">IDE 통합 & GitHub</h3>
      <CodePanel title="IDE 통합 & GitHub 연동" code={`IDE 통합:
  VS Code:    Claude Code 확장 프로그램
  JetBrains:  IntelliJ/WebStorm 플러그인
  → IDE 내에서 터미널 Claude Code와 동일한 경험

GitHub 통합 (claude-code-action):
  @claude 멘션으로 PR/이슈에서 직접 사용
  → PR 리뷰, 코드 수정, 이슈 해결 자동화

코드 리뷰 (/code-review):
  4개 리뷰 에이전트를 병렬 실행
  → 독립적으로 버그 탐색
  → 교차 검증으로 false positive 필터링
  → 신뢰도 ≥80% 이슈만 표면화
  → false positive 비율 <1%

사용 패턴:
  1. 터미널: claude (대화형)
  2. 파이프: echo "질문" | claude (단발)
  3. 비대화형: claude -p "작업 설명" (스크립트용)
  4. GitHub: @claude 멘션 (PR/이슈)
  5. SDK: claude-code-sdk (프로그래밍 통합)`} annotations={[
        { lines: [1, 4], color: 'sky', note: 'IDE 확장 지원' },
        { lines: [6, 8], color: 'emerald', note: 'GitHub PR/이슈 자동화' },
        { lines: [10, 15], color: 'amber', note: '코드 리뷰 — 4개 에이전트 병렬' },
      ]} />
    </>
  );
}
