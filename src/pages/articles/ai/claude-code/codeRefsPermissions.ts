import type { CodeRef } from '@/components/code/types';
import settingsStrictJson from './codebase/claude-code/examples/settings/settings-strict.json?raw';
import ruleEnginePy from './codebase/claude-code/plugins/hookify/core/rule_engine.py?raw';

export const permissionsCodeRefs: Record<string, CodeRef> = {
  'permissions-0': {
    path: 'claude-code/examples/settings/settings-strict.json',
    code: settingsStrictJson,
    lang: 'typescript',
    highlight: [1, 28],
    annotations: [
      { lines: [2, 11], color: 'sky',     note: 'permissions — ask/deny 규칙, bypassMode 비활성화' },
      { lines: [12, 14], color: 'emerald', note: '관리형 설정 잠금 — 사용자가 권한/훅 임의 변경 불가' },
      { lines: [16, 27], color: 'amber',   note: 'sandbox 설정 — 네트워크 격리, 유닉스 소켓, 도메인 화이트리스트' },
    ],
    desc:
`문제: 엔터프라이즈 환경에서 Claude Code의 도구 접근을 중앙에서 통제해야 합니다.

해결: settings-strict.json은 관리형(managed) 설정으로 3단계 보안을 적용합니다.
① permissions: Bash는 ask(확인 필요), WebSearch/WebFetch는 deny(차단)
② allowManagedOnly: 사용자가 권한이나 훅 규칙을 임의로 변경할 수 없도록 잠금
③ sandbox: 네트워크 격리, 유닉스 소켓 제한, 도메인 화이트리스트

하이라이트 구간: 전체 설정 구조 — permissions → managed lock → sandbox`,
  },

  'permissions-1': {
    path: 'claude-code/plugins/hookify/core/rule_engine.py',
    code: ruleEnginePy,
    lang: 'python',
    highlight: [96, 142],
    annotations: [
      { lines: [96, 125], color: 'sky',     note: '_rule_matches — 도구 매처 확인 후 모든 조건 AND 평가' },
      { lines: [127, 142], color: 'emerald', note: '_matches_tool — 와일드카드(*) 및 OR 패턴(Bash|Edit) 지원' },
    ],
    desc:
`문제: 특정 도구에만 적용되는 규칙과 모든 도구에 적용되는 규칙을 유연하게 지원해야 합니다.

해결: _rule_matches()는 2단계 필터링을 수행합니다.
① tool_matcher로 도구 이름 확인 (*, Bash, Edit|Write 등 패턴 지원)
② 모든 conditions가 AND로 평가 (하나라도 실패하면 불일치)

하이라이트 구간: 도구 매칭 → 조건 평가 흐름`,
  },
};
