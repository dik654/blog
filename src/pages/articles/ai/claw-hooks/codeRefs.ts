import type { CodeRef } from '@/components/code/types';
import hooksRs from './codebase/hooks.rs?raw';
import conversationRs from './codebase/conversation.rs?raw';
import configRs from './codebase/config.rs?raw';
import permissionsRs from './codebase/permissions.rs?raw';
import pluginsRs from './codebase/plugins.rs?raw';
import cliMainRs from './codebase/cli_main.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'hook-events': {
    path: 'claw-code/rust/crates/runtime/src/hooks.rs',
    code: hooksRs,
    lang: 'rust',
    highlight: [21, 168],
    desc: '현재 runtime hook의 세 event와 HookRunResult, HookRunner 구성입니다. UserPromptSubmit event나 matcher 객체는 없습니다.',
    annotations: [
      { lines: [21, 36], color: 'sky', note: '지원 event는 PreToolUse, PostToolUse, PostToolUseFailure 세 가지입니다.' },
      { lines: [62, 81], color: 'amber', note: 'AbortSignal은 hook stdout decision이 아니라 host가 공유하는 AtomicBool 취소 신호입니다.' },
      { lines: [83, 152], color: 'emerald', note: '결과는 deny/fail/cancel 상태, message, request-level permission override와 updated input을 운반합니다.' },
      { lines: [154, 168], color: 'sky', note: 'HookRunner는 RuntimeHookConfig 하나만 가집니다. per-hook matcher, timeout, env 필드는 없습니다.' },
    ],
  },
  'hook-command-chain': {
    path: 'claw-code/rust/crates/runtime/src/hooks.rs',
    code: hooksRs,
    lang: 'rust',
    highlight: [312, 413],
    desc: '같은 event에 등록된 command를 설정 순서대로 실행하고 결과를 합치는 실제 chain입니다.',
    annotations: [
      { lines: [323, 340], color: 'amber', note: '빈 목록은 allow이며, 시작 전 host abort가 이미 켜졌다면 cancelled로 닫힙니다.' },
      { lines: [345, 373], color: 'emerald', note: 'exit 0의 Allow 결과는 first-decision이 아닙니다. message와 override를 합친 뒤 다음 command를 계속 실행합니다.' },
      { lines: [374, 408], color: 'rose', note: 'Deny, Failed, Cancelled는 현재까지 모은 결과를 보존하고 즉시 chain을 중단합니다.' },
    ],
  },
  'hook-protocol': {
    path: 'claw-code/rust/crates/runtime/src/hooks.rs',
    code: hooksRs,
    lang: 'rust',
    highlight: [417, 657],
    desc: 'shell spawn, exit-code 해석, stdout JSON parser와 stdin payload의 실제 protocol입니다.',
    annotations: [
      { lines: [427, 443], color: 'sky', note: 'Unix는 sh -lc, Windows는 cmd /C로 실행하며 stdin/stdout/stderr pipe와 HOOK_* 환경 변수를 사용합니다.' },
      { lines: [445, 490], color: 'rose', note: '0은 parsed allow/deny, 2는 deny, 그 밖의 code·signal·spawn 오류는 Failed입니다.' },
      { lines: [538, 629], color: 'emerald', note: 'stdout 전체를 한 번 parse합니다. hookSpecificOutput 안의 permissionDecision과 updatedInput이 실제 mutation schema입니다.' },
      { lines: [632, 657], color: 'amber', note: 'payload에는 session id, workspace root, timestamp가 없습니다. failure event만 tool_error 필드를 사용합니다.' },
    ],
  },
  'hook-abort-loop': {
    path: 'claw-code/rust/crates/runtime/src/hooks.rs',
    code: hooksRs,
    lang: 'rust',
    highlight: [738, 817],
    desc: '동기 shell 실행과 20ms abort polling입니다. deadline, tokio timeout, process-group containment는 없습니다.',
    annotations: [
      { lines: [738, 754], color: 'sky', note: 'hook command는 shell command string으로 실행됩니다.' },
      { lines: [789, 810], color: 'rose', note: 'try_wait를 20ms마다 확인하며 host abort 때 child.kill을 호출합니다. 시간 기반 timeout은 없습니다.' },
      { lines: [799, 808], color: 'amber', note: '직접 child만 다룹니다. descendant process group 전체를 종료한다는 보장은 이 코드에 없습니다.' },
    ],
  },
  'conversation-order': {
    path: 'claw-code/rust/crates/runtime/src/conversation.rs',
    code: conversationRs,
    lang: 'rust',
    highlight: [400, 493],
    desc: 'Pre hook의 updatedInput과 permission context가 policy와 tool 실행에 연결되고, 성공·실패에 따라 post event가 갈리는 실제 순서입니다.',
    annotations: [
      { lines: [400, 408], color: 'sky', note: 'Pre가 먼저 실행됩니다. updatedInput은 effective_input이 되고 permission override는 같은 요청의 PermissionContext가 됩니다.' },
      { lines: [410, 445], color: 'rose', note: 'Pre deny/fail/cancel은 tool 실행 전에 Deny로 닫힙니다. 그 외에는 effective input으로 permission policy를 평가합니다.' },
      { lines: [447, 470], color: 'emerald', note: '허용된 경우에만 tool을 실행하고, tool 결과가 오류면 PostToolUseFailure, 성공이면 PostToolUse를 호출합니다.' },
      { lines: [471, 490], color: 'amber', note: 'Post는 이미 난 side effect를 되돌리지 못하지만 deny/fail/cancel이면 최종 tool result를 error로 바꾸고 message를 합칩니다.' },
    ],
  },
  'runtime-hook-config': {
    path: 'claw-code/rust/crates/runtime/src/config.rs',
    code: configRs,
    lang: 'rust',
    highlight: [79, 85],
    desc: 'RuntimeHookConfig는 event별 ordered command string 배열 세 개입니다.',
    annotations: [
      { lines: [79, 85], color: 'sky', note: '구조는 PreToolUse, PostToolUse, PostToolUseFailure의 Vec<String>뿐입니다.' },
      { lines: [567, 604], color: 'emerald', note: 'merge는 기존 순서를 유지하면서 중복 command를 제외해 뒤 목록을 이어 붙입니다.' },
      { lines: [750, 770], color: 'amber', note: 'settings의 hooks object에서 정확히 세 string array를 읽습니다.' },
    ],
  },
  'permission-override-order': {
    path: 'claw-code/rust/crates/runtime/src/permissions.rs',
    code: permissionsRs,
    lang: 'rust',
    highlight: [175, 291],
    desc: 'Hook permission override가 static deny/ask와 mode requirement 사이에서 평가되는 실제 정책 순서입니다.',
    annotations: [
      { lines: [182, 189], color: 'rose', note: 'static deny rule이 hook override보다 먼저 반환하므로 hook Allow로 뒤집을 수 없습니다.' },
      { lines: [196, 240], color: 'amber', note: 'hook Deny는 즉시 거부, Ask는 prompt/deny입니다. Allow도 static ask나 부족한 mode를 우회하지 않습니다.' },
      { lines: [244, 291], color: 'sky', note: 'override Allow가 충분한 권한을 만들지 못하면 일반 ask, allow/mode, escalation, final deny 경로로 계속 갑니다.' },
    ],
  },
  'plugin-hook-manifest': {
    path: 'claw-code/rust/crates/plugins/src/lib.rs',
    code: pluginsRs,
    lang: 'rust',
    highlight: [67, 98],
    desc: 'Plugin manifest도 동일한 세 event의 command 배열을 등록하며 enabled plugin의 hook만 aggregate합니다.',
    annotations: [
      { lines: [67, 98], color: 'sky', note: 'PluginHooks schema도 RuntimeHookConfig와 같은 세 event만 가집니다.' },
      { lines: [795, 803], color: 'emerald', note: 'enabled plugin만 validation 뒤 registry 순서로 aggregate합니다.' },
      { lines: [1940, 1957], color: 'amber', note: '상대 command path를 plugin root 기준으로 resolve합니다.' },
      { lines: [2001, 2013], color: 'rose', note: 'resolved hook command가 실제 file인지 plugin validation 단계에서 확인합니다.' },
    ],
  },
  'cli-hook-merge': {
    path: 'claw-code/rust/crates/rusty-claude-cli/src/main.rs',
    code: cliMainRs,
    lang: 'rust',
    highlight: [7173, 7239],
    desc: 'CLI bootstrap이 settings hook과 enabled plugin hook을 하나의 RuntimeHookConfig로 합치는 연결점입니다.',
    annotations: [
      { lines: [7173, 7185], color: 'emerald', note: 'plugin registry에서 aggregate한 hooks를 settings hooks 뒤에 merge해 runtime feature config를 만듭니다.' },
      { lines: [7197, 7219], color: 'sky', note: 'plugin manager는 enabled plugin과 external/bundled/install 경로 설정에서 registry를 구성합니다.' },
      { lines: [7233, 7239], color: 'amber', note: 'PluginHooks의 세 배열을 RuntimeHookConfig로 그대로 변환합니다.' },
    ],
  },
};
