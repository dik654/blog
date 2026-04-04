export const hooksCode = `Hooks = 이벤트 기반 커스텀 셸 명령

18개 라이프사이클 이벤트:
  SessionStart, UserPromptSubmit,
  PreToolUse, PermissionRequest, PostToolUse, PostToolUseFailure,
  Notification, SubagentStart, SubagentStop, Stop,
  TeammateIdle, TaskCompleted, InstructionsLoaded, ConfigChange,
  WorktreeCreate, WorktreeRemove, PreCompact, SessionEnd

4가지 핸들러 타입:
  command — 셸 명령 (stdin/stdout/exit code로 통신)
  http    — URL 엔드포인트에 POST
  prompt  — 단일 턴 LLM 평가 (Haiku, ok/not-ok 반환)
  agent   — 서브에이전트 스폰 (최대 50 도구 턴)

설정 예시:
  {
    "hooks": {
      "PreToolUse": [{
        "matcher": "Bash",
        "command": "~/scripts/validate-bash.sh"
      }],
      "PostToolUse": [{
        "matcher": "Write",
        "command": "~/scripts/lint-on-write.sh"
      }]
    }
  }

활용 사례:
  - 코드 작성 후 자동 린팅
  - 위험한 명령어 차단
  - 파일 수정 시 자동 포매팅
  - 커밋 전 테스트 자동 실행`;

export const hooksAnnotations = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: '18개 라이프사이클 이벤트' },
  { lines: [10, 14] as [number, number], color: 'emerald' as const, note: '4가지 핸들러 타입' },
  { lines: [16, 28] as [number, number], color: 'amber' as const, note: 'JSON 설정 예시' },
];
