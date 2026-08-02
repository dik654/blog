import type { CodeRef } from '@/components/code/types';
import permissionsRs from './codebase/permissions.rs?raw';
import enforcerRs from './codebase/permission_enforcer.rs?raw';
import permissionWiringRs from './codebase/permission_wiring.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'permission-wiring': {
    path: 'claw-code/rust/crates/runtime/src/conversation.rs · tools/src/lib.rs 발췌',
    code: permissionWiringRs,
    lang: 'rust',
    highlight: [1, 77],
    desc: '현재 permission 호출 그래프의 고정 발췌. conversation policy, registry optional enforcer, enforcer 없는 public helper는 서로 다른 entry point입니다.',
    annotations: [
      { lines: [1, 54], color: 'sky', note: 'conversation loop는 pre-hook 결과로 context를 만들고 PermissionPolicy를 직접 호출한 뒤 Allow일 때 executor로 넘깁니다.' },
      { lines: [55, 68], color: 'amber', note: 'ToolRegistry는 enforcer를 Option으로 보관하고 그 Some/None 상태를 execute_tool_with_enforcer에 그대로 전달합니다.' },
      { lines: [69, 77], color: 'rose', note: 'public execute_tool은 None을 넘깁니다. 따라서 thin enforcer 하나가 모든 production entry를 지배한다고 말할 수 없습니다.' },
    ],
  },
  'permission-types': {
    path: 'claw-code/rust/crates/runtime/src/permissions.rs',
    code: permissionsRs,
    lang: 'rust',
    highlight: [7, 105],
    desc: '현재 PermissionMode, hook override context, prompt request/outcome, PermissionPolicy의 실제 타입 정의입니다.',
    annotations: [
      { lines: [9, 15], color: 'rose', note: 'derived Ord는 선언 순서대로 Prompt를 DangerFullAccess보다 크게 만듭니다. 아래의 >= 비교와 결합되어 일반 requirement가 prompt 전에 Allow되는 현재 결함을 만듭니다.' },
      { lines: [30, 66], color: 'amber', note: 'override는 stack이나 lifetime scope가 아니라 현재 요청에 붙는 Allow/Deny/Ask decision과 reason입니다.' },
      { lines: [90, 95], color: 'emerald', note: '최종 public outcome은 Allow 또는 이유를 가진 Deny입니다. Ask는 prompt를 거친 뒤 둘 중 하나로 닫힙니다.' },
    ],
  },
  'policy-order': {
    path: 'claw-code/rust/crates/runtime/src/permissions.rs',
    code: permissionsRs,
    lang: 'rust',
    highlight: [156, 324],
    desc: '실제 authorization 순서입니다. derived mode 비교가 escalation prompt보다 먼저라 Prompt mode가 일반 requirement를 Allow할 수 있습니다.',
    annotations: [
      { lines: [156, 161], color: 'rose', note: '등록되지 않은 tool requirement의 기본값은 DangerFullAccess입니다. 새 도구를 조용히 낮은 권한으로 허용하지 않는 fail-closed 성질입니다.' },
      { lines: [182, 189], color: 'rose', note: 'deny rule은 context override보다 먼저 평가되어 뒤집히지 않습니다.' },
      { lines: [196, 240], color: 'amber', note: 'hook Allow도 ask rule을 건너뛰지 않습니다. hook Ask/Deny와 policy rule의 우선순위를 그대로 읽어야 합니다.' },
      { lines: [244, 291], color: 'rose', note: 'ask 뒤 allow/mode 비교가 escalation prompt보다 먼저입니다. Prompt >= DangerFullAccess가 참이므로 Prompt branch가 일반 tool에서는 사실상 도달하지 않습니다.' },
      { lines: [294, 324], color: 'emerald', note: 'Ask가 필요해도 prompter가 없으면 Deny합니다. unattended 실행에서의 핵심 fail-closed 지점입니다.' },
    ],
  },
  'rule-matcher': {
    path: 'claw-code/rust/crates/runtime/src/permissions.rs',
    code: permissionsRs,
    lang: 'rust',
    highlight: [326, 469],
    desc: '각 rule 그룹의 첫 matching rule을 고른 뒤 tool 이름과 추출된 subject를 Any/Exact/Prefix로 비교합니다. 일반 glob matcher나 Custom closure 구조가 아닙니다.',
    annotations: [
      { lines: [326, 332], color: 'emerald', note: 'deny/ask/allow 배열마다 앞에서부터 검사해 처음 일치한 rule 하나를 반환합니다.' },
      { lines: [335, 347], color: 'sky', note: 'matcher variant는 Any, Exact, Prefix 세 가지입니다.' },
      { lines: [349, 402], color: 'amber', note: 'tool(subject), tool(*), tool(prefix:*) 형태를 parse하고 Any/Exact/Prefix matcher로 닫습니다.' },
      { lines: [447, 469], color: 'emerald', note: 'JSON input에서 command, path, url, pattern 등 첫 문자열 subject를 뽑고, JSON이 아니면 raw input으로 돌아갑니다.' },
    ],
  },
  'runtime-enforcer': {
    path: 'claw-code/rust/crates/runtime/src/permission_enforcer.rs',
    code: enforcerRs,
    lang: 'rust',
    highlight: [26, 173],
    desc: '얇은 runtime enforcer의 실제 코드입니다. 일반 check와 file/bash 전용 helper의 보장 수준을 구분해야 합니다.',
    annotations: [
      { lines: [37, 60], color: 'amber', note: 'Prompt mode에서 check()는 interactive caller에게 넘기기 위해 Allowed를 반환합니다. 이 값을 최종 사용자 승인으로 오해하면 우회가 됩니다.' },
      { lines: [68, 100], color: 'sky', note: '동적으로 계산한 required mode를 active mode와 비교하는 별도 entry point입니다.' },
      { lines: [107, 141], color: 'rose', note: 'file write helper의 boundary는 문자열 prefix 기반입니다. canonical handle 또는 open-time enforcement가 아닙니다.' },
      { lines: [144, 173], color: 'rose', note: 'bash helper는 첫 token read-only heuristic을 사용합니다. 실제 shell semantics와 OS containment를 대신하지 못합니다.' },
    ],
  },
};
