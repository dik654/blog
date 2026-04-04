import type { CodeRef } from '@/components/code/types';
import ruleEnginePy from './codebase/claude-code/plugins/hookify/core/rule_engine.py?raw';
import configLoaderPy from './codebase/claude-code/plugins/hookify/core/config_loader.py?raw';
import bashValidatorPy from './codebase/claude-code/examples/hooks/bash_command_validator_example.py?raw';

export const hooksCodeRefs: Record<string, CodeRef> = {
  'hooks-0': {
    path: 'claude-code/examples/hooks/bash_command_validator_example.py',
    code: bashValidatorPy,
    lang: 'python',
    highlight: [36, 79],
    annotations: [
      { lines: [36, 45], color: 'sky',     note: '검증 규칙 정의 — grep→rg, find→rg 대체 패턴' },
      { lines: [48, 53], color: 'emerald', note: '_validate_command — 정규식 매칭으로 위반 목록 수집' },
      { lines: [56, 79], color: 'amber',   note: 'main — stdin JSON 파싱 → 검증 → exit code 제어 (0=허용, 2=차단)' },
    ],
    desc:
`문제: Claude Code가 실행하는 Bash 명령어 중 grep이나 find 같은 비효율적 도구를 사용하는 경우를 사전에 차단하고 싶습니다.

해결: PreToolUse 훅으로 Bash 도구 호출을 가로채서 정규식 패턴으로 명령어를 검증합니다.
- exit(0): 명령어 허용
- exit(1): stderr만 사용자에게 표시 (Claude에게는 보이지 않음)
- exit(2): 명령어 차단 + stderr를 Claude에게 전달

하이라이트 구간: 검증 규칙 → 명령어 매칭 → exit code 기반 제어 흐름`,
  },

  'hooks-1': {
    path: 'claude-code/plugins/hookify/core/rule_engine.py',
    code: ruleEnginePy,
    lang: 'python',
    highlight: [35, 94],
    annotations: [
      { lines: [35, 58], color: 'sky',     note: 'evaluate_rules — 모든 규칙 순회, block/warn 분류' },
      { lines: [60, 84], color: 'emerald', note: '차단 규칙 처리 — 이벤트 타입별 응답 포맷 분기 (Stop, PreToolUse 등)' },
      { lines: [86, 94], color: 'amber',   note: '경고 규칙 처리 — systemMessage로 경고만 표시, 작업은 허용' },
    ],
    desc:
`문제: 훅 시스템에서 여러 규칙이 동시에 매치될 수 있으며, 차단과 경고를 구분해야 합니다.

해결: RuleEngine.evaluate_rules()는 모든 규칙을 순회하며 block/warn으로 분류합니다.
차단 규칙이 하나라도 있으면 이벤트 타입에 따라 적절한 응답 포맷을 반환하고,
경고만 있으면 systemMessage로 표시하되 작업은 계속 진행합니다.

하이라이트 구간: 규칙 분류 → 이벤트별 응답 생성 → 최종 결정`,
  },

  'hooks-2': {
    path: 'claude-code/plugins/hookify/core/config_loader.py',
    code: configLoaderPy,
    lang: 'python',
    highlight: [15, 42],
    annotations: [
      { lines: [15, 29], color: 'sky',     note: 'Condition 데이터클래스 — field/operator/pattern 조합' },
      { lines: [32, 42], color: 'emerald', note: 'Rule 데이터클래스 — 이름, 이벤트, 조건 목록, action(warn/block)' },
    ],
    desc:
`문제: 훅 규칙을 코드 없이 선언적으로 정의할 수 있어야 합니다.

해결: Markdown 프론트매터(YAML) 기반의 선언적 설정 시스템입니다.
Condition은 field(command, file_path 등) + operator(regex_match, contains 등) + pattern 조합이고,
Rule은 이름, 이벤트, 조건 목록, 액션을 가지는 구조체입니다.

하이라이트 구간: Condition/Rule 데이터 구조 정의`,
  },
};
