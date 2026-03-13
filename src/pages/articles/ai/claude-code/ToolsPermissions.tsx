import { CitationBlock } from '../../../../components/ui/citation';

export default function ToolsPermissions() {
  return (
    <section id="tools-permissions" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도구 시스템 & 권한 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">내장 도구</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Claude Code 도구 카탈로그:

파일 시스템:
  Read       — 파일 읽기 (이미지, PDF, Jupyter 지원)
  Write      — 파일 생성/덮어쓰기
  Edit       — 정확한 문자열 치환으로 파일 수정
  Glob       — 파일 패턴 검색 (**/*.tsx 등)
  Grep       — ripgrep 기반 코드 내용 검색

실행:
  Bash       — 셸 명령 실행 (빌드, 테스트, git 등)
  NotebookEdit — Jupyter 노트북 셀 편집

연구:
  WebSearch  — 웹 검색
  WebFetch   — URL 내용 가져오기 & AI 처리

협업:
  Agent      — 서브에이전트 실행
  TodoWrite  — 작업 목록 관리
  AskUserQuestion — 사용자에게 질문

확장:
  Skill      — 슬래시 명령 실행 (/commit, /review-pr 등)
  MCP 도구   — MCP 서버에서 제공하는 도구`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">권한 모델</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`3단계 권한 모드:

1. Ask (기본):
   모든 도구 호출에 사용자 승인 필요
   → 가장 안전, 학습/디버깅 시 권장

2. Auto-Allow:
   지정된 도구만 자동 허용, 나머지는 승인 필요
   예) Read, Glob, Grep만 자동 허용

3. YOLO (자동):
   대부분 도구를 자동 허용
   → 숙련 사용자용, 빠른 작업 시 유용
   → 파괴적 명령에 대한 최소 안전장치는 유지

권한 판단 기준:
  ┌───────────────────────────────────────┐
  │ 도구 호출 → 권한 모드 확인             │
  │           → 도구별 설정 확인            │
  │           → Hooks 확인 (PreToolUse)    │
  │           → 자동 허용? → 실행           │
  │           → 사용자 승인 요청 → 실행/거부  │
  └───────────────────────────────────────┘

안전 원칙:
  - 되돌릴 수 있는 로컬 작업: 자유롭게 실행
  - 공유 시스템에 영향: 사용자 확인 필요
  - 파괴적 작업 (git push --force 등): 항상 경고
  → "Measure twice, cut once" 철학

OS 수준 샌드박싱:
  macOS: Seatbelt 프레임워크 (v1.0.20부터 기본 활성화)
    → CWD + /tmp만 쓰기 허용
  Linux: bubblewrap (bwrap) 기반 격리
    → 파일시스템 격리 + 네트워크 격리 (프록시)

규칙 시스템:
  ~/.claude/settings.json (전역)
  .claude/settings.json (프로젝트)
  → Allow/Deny 규칙 + glob 패턴
  → Deny가 항상 우선 (설정 레벨 무관)
  → 샌드박싱으로 권한 프롬프트 84% 감소
  → Plan 모드 + Deny 규칙 + 샌드박싱 = 98% 프롬프트 인젝션 방어`}</code>
        </pre>
        <CitationBlock source="Anthropic 보안 문서 - Sandboxing" citeKey={4} type="paper" href="https://docs.anthropic.com/en/docs/claude-code/security">
          <p className="italic text-foreground/80">"Claude Code uses OS-level sandboxing (Seatbelt on macOS, bubblewrap on Linux) to restrict file system access and network access, ensuring that Claude Code can only access files within the project directory and /tmp."</p>
          <p className="mt-2 text-xs">v1.0.20부터 macOS에서 Seatbelt 샌드박싱이 기본 활성화되었으며, Linux에서는 bubblewrap(bwrap) 기반 격리를 사용합니다. 샌드박싱 도입으로 권한 프롬프트가 84% 감소했습니다.</p>
        </CitationBlock>
        <CitationBlock source="Anthropic 보안 문서 - 프롬프트 인젝션 방어" citeKey={5} type="paper" href="https://docs.anthropic.com/en/docs/claude-code/security">
          <p className="italic text-foreground/80">"With Plan mode + Deny rules + OS-level sandboxing, Claude Code achieves a 98% defense rate against prompt injection attacks in internal red-team evaluations."</p>
          <p className="mt-2 text-xs">Plan 모드(읽기 전용 도구만 허용), Deny 규칙(위험 패턴 차단), OS 샌드박싱의 3중 방어 전략으로 프롬프트 인젝션 공격에 대해 98% 방어율을 달성했습니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">IDE 통합 & GitHub</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`IDE 통합:
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
  5. SDK: claude-code-sdk (프로그래밍 통합)`}</code>
        </pre>
      </div>
    </section>
  );
}
