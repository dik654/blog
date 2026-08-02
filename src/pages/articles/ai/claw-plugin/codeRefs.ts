import type { CodeRef } from '@/components/code/types';
import pluginsRs from './codebase/plugins.rs?raw';
import toolsRs from './codebase/tools.rs?raw';
import cliMainRs from './codebase/cli_main.rs?raw';
import conversationRs from './codebase/conversation.rs?raw';
import hooksRs from './codebase/hooks.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'manifest-contract': {
    path: 'claw-code/rust/crates/plugins/src/lib.rs',
    code: pluginsRs,
    lang: 'rust',
    highlight: [18, 205],
    desc: '실제 PluginKind와 plugin manifest 계약입니다. kind는 기능 종류가 아니라 출처이며, 최상위 permissions와 tool별 requiredPermission은 서로 다른 타입입니다.',
    annotations: [
      { lines: [18, 52], color: 'sky', note: 'PluginKind는 Builtin, Bundled, External입니다. ToolProvider/HookProvider/ContextProvider 분류가 아닙니다.' },
      { lines: [101, 132], color: 'emerald', note: 'manifest는 hooks, lifecycle, tools, commands를 한 plugin 안에 함께 담을 수 있습니다.' },
      { lines: [134, 160], color: 'amber', note: '최상위 permissions는 read/write/execute 문자열을 검증하지만 이후 runtime authorization 요구 사항으로 연결되지는 않습니다.' },
      { lines: [168, 205], color: 'violet', note: '각 tool의 requiredPermission은 read-only, workspace-write, danger-full-access 중 하나이며 runtime policy로 전달됩니다.' },
    ],
  },
  'tool-process': {
    path: 'claw-code/rust/crates/plugins/src/lib.rs',
    code: pluginsRs,
    lang: 'rust',
    highlight: [260, 348],
    desc: 'PluginTool의 실제 subprocess 실행입니다. 동기 Command, stdin/env JSON 전달, 무제한 wait, raw stdout 반환을 확인할 수 있습니다.',
    annotations: [
      { lines: [307, 323], color: 'sky', note: 'command와 args를 그대로 조립하고 plugin/tool/input 정보를 환경 변수로 전달합니다. OS sandbox 설정은 없습니다.' },
      { lines: [325, 331], color: 'rose', note: 'spawn 후 stdin을 쓰고 wait_with_output으로 종료까지 기다립니다. timeout, cancellation, output-size cap이 없습니다.' },
      { lines: [332, 347], color: 'amber', note: '성공 stdout은 JSON parse 없이 문자열로 반환합니다. 실패는 stderr 또는 exit status를 CommandFailed에 넣습니다.' },
    ],
  },
  'registry-aggregation': {
    path: 'claw-code/rust/crates/plugins/src/lib.rs',
    code: pluginsRs,
    lang: 'rust',
    highlight: [699, 855],
    desc: 'load failure report, 정렬된 Vec registry, enabled plugin의 hook/tool aggregation과 init/shutdown 순서입니다.',
    annotations: [
      { lines: [699, 737], color: 'rose', note: 'report는 valid registry와 failure를 함께 보관하지만 into_registry는 failure가 하나라도 있으면 전체를 Err로 바꿉니다.' },
      { lines: [761, 783], color: 'sky', note: 'runtime registry는 HashMap이 아니라 id로 정렬한 Vec이며 lookup은 선형 검색입니다.' },
      { lines: [795, 824], color: 'amber', note: 'enabled plugin만 validate한 뒤 hook을 순서대로 merge하고 plugin tool name 중복을 검사합니다.' },
      { lines: [826, 844], color: 'emerald', note: 'initialize는 정방향, shutdown은 역방향입니다. 중간 실패를 수집하지 않고 첫 Err에서 멈춥니다.' },
    ],
  },
  'install-update': {
    path: 'claw-code/rust/crates/plugins/src/lib.rs',
    code: pluginsRs,
    lang: 'rust',
    highlight: [1113, 1234],
    desc: 'local/git source 설치, enable/disable, uninstall, update의 실제 파일 연산과 enabled state 기록입니다.',
    annotations: [
      { lines: [1118, 1158], color: 'amber', note: 'install은 source를 materialize하고 manifest를 검증한 뒤 기존 install path를 지우고 복사합니다. 완료 뒤 registry와 enabled state를 씁니다.' },
      { lines: [1161, 1177], color: 'sky', note: 'enable/disable은 known plugin 여부를 확인하고 settings의 bool을 바꿉니다. hash나 OS permission을 검사하지 않습니다.' },
      { lines: [1179, 1197], color: 'rose', note: 'uninstall은 bundled plugin을 거부하고 external install directory와 registry/settings entry를 제거합니다.' },
      { lines: [1199, 1234], color: 'rose', note: 'update도 기존 directory를 먼저 지우고 새 source를 복사합니다. atomic rename이나 rollback이 없어 중간 실패 시 부분 설치가 남을 수 있습니다.' },
    ],
  },
  'discovery-enable': {
    path: 'claw-code/rust/crates/plugins/src/lib.rs',
    code: pluginsRs,
    lang: 'rust',
    highlight: [1237, 1521],
    desc: 'installed plugin과 configured external directory의 발견, bundled 동기화, enabled 기본값과 registry report 생성입니다.',
    annotations: [
      { lines: [1237, 1312], color: 'sky', note: 'install root와 installed.json record를 함께 읽고 stale record를 정리하며 load failure를 별도로 모읍니다.' },
      { lines: [1315, 1352], color: 'amber', note: 'externalDirectories는 설정된 경로만 순회합니다. system/user/workspace 3단계 우선순위가 아닙니다.' },
      { lines: [1359, 1440], color: 'violet', note: 'bundled source를 install root에 동기화하지만 directory 교체는 remove_dir_all 뒤 copy입니다.' },
      { lines: [1443, 1451], color: 'emerald', note: '설정값이 없으면 external은 disabled, builtin/bundled는 manifest defaultEnabled를 사용합니다.' },
      { lines: [1507, 1521], color: 'sky', note: 'discovered definition을 enabled bool과 결합한 뒤 PluginRegistryReport를 구성합니다.' },
    ],
  },
  'manifest-loader': {
    path: 'claw-code/rust/crates/plugins/src/lib.rs',
    code: pluginsRs,
    lang: 'rust',
    highlight: [1543, 1849],
    desc: 'plugin.json 탐색, Claude Code manifest 호환성 거부, field/schema/permission/command 검증의 실제 구현입니다.',
    annotations: [
      { lines: [1543, 1582], color: 'sky', note: 'kind는 loader가 source에서 넘기며 manifest가 지정하지 않습니다. 한 definition 안에 hooks/lifecycle/tools가 함께 들어갑니다.' },
      { lines: [1585, 1611], color: 'amber', note: 'JSON을 읽고 compatibility gap을 검사한 뒤 RawPluginManifest에서 validated manifest를 만듭니다.' },
      { lines: [1671, 1687], color: 'emerald', note: '지원 파일은 plugin.json 또는 .claude-plugin/plugin.json입니다.' },
      { lines: [1689, 1737], color: 'rose', note: 'version은 비어 있지 않은지만 검사합니다. semver parse나 signature/hash 검증은 없습니다.' },
      { lines: [1784, 1849], color: 'violet', note: 'tool name 중복, description/command, object input schema, requiredPermission label을 검증합니다.' },
    ],
  },
  'command-validation-lifecycle': {
    path: 'claw-code/rust/crates/plugins/src/lib.rs',
    code: pluginsRs,
    lang: 'rust',
    highlight: [1899, 2127],
    desc: 'command path 검증과 lifecycle shell command 실행의 실제 경계입니다.',
    annotations: [
      { lines: [1910, 1938], color: 'amber', note: 'literal command는 path 검증을 건너뛰며 path command는 exists/is_file만 확인합니다. 실행 비트나 root containment를 보지 않습니다.' },
      { lines: [2001, 2037], color: 'sky', note: 'enabled plugin aggregation과 init 앞에서 hooks/lifecycle/tools command path를 다시 검증합니다.' },
      { lines: [2039, 2072], color: 'rose', note: 'absolute path와 ../ 상대 path도 root 밖이면 막지 않습니다. 존재하는 파일인지 여부만 확인합니다.' },
      { lines: [2075, 2127], color: 'rose', note: 'Init/Shutdown은 shell command를 동기 실행합니다. timeout, sandbox, retry, health state machine은 없습니다.' },
    ],
  },
  'global-tool-registry': {
    path: 'claw-code/rust/crates/tools/src/lib.rs',
    code: toolsRs,
    lang: 'rust',
    highlight: [123, 355],
    desc: 'plugin tool이 builtin/runtime tool과 합쳐지고 permission requirement를 runtime policy에 제공하는 실제 registry입니다.',
    annotations: [
      { lines: [133, 150], color: 'rose', note: 'plugin registry에서 못 본 builtin name 충돌을 GlobalToolRegistry 생성 시 추가로 거부합니다.' },
      { lines: [287, 312], color: 'emerald', note: 'plugin requiredPermission을 runtime PermissionMode로 변환해 policy 구성용 목록에 넣습니다.' },
      { lines: [346, 355], color: 'amber', note: 'plugin tool dispatch 자체는 PluginTool::execute를 부릅니다. builtin용 PermissionEnforcer가 plugin command를 sandbox하는 구조가 아닙니다.' },
    ],
  },
  'runtime-build': {
    path: 'claw-code/rust/crates/rusty-claude-cli/src/main.rs',
    code: cliMainRs,
    lang: 'rust',
    highlight: [7173, 7194],
    desc: 'PluginManager 결과가 runtime hooks와 GlobalToolRegistry로 연결되는 조립 지점입니다.',
    annotations: [
      { lines: [7178, 7185], color: 'sky', note: 'strict plugin_registry를 만들고 enabled plugin hooks를 runtime hook config와 merge합니다.' },
      { lines: [7186, 7194], color: 'emerald', note: 'plugin tools와 MCP runtime tools를 GlobalToolRegistry에 합칩니다. 충돌은 이 생성 단계에서 startup error가 됩니다.' },
    ],
  },
  'runtime-lifecycle': {
    path: 'claw-code/rust/crates/rusty-claude-cli/src/main.rs',
    code: cliMainRs,
    lang: 'rust',
    highlight: [3925, 4001],
    desc: 'BuiltRuntime이 plugin registry를 소유하고 명시적 shutdown 또는 Drop에서 shutdown command를 호출하는 경로입니다.',
    annotations: [
      { lines: [3925, 3945], color: 'sky', note: 'BuiltRuntime이 PluginRegistry와 active flag를 보관합니다.' },
      { lines: [3957, 3963], color: 'emerald', note: 'shutdown_plugins는 한 번만 registry.shutdown을 호출하도록 active flag를 내립니다.' },
      { lines: [3997, 4001], color: 'amber', note: 'Drop은 shutdown error를 무시합니다. 종료 실패가 사용자에게 항상 보고된다고 가정하면 안 됩니다.' },
    ],
  },
  'permission-wiring': {
    path: 'claw-code/rust/crates/rusty-claude-cli/src/main.rs',
    code: cliMainRs,
    lang: 'rust',
    highlight: [7615, 7648],
    desc: 'runtime 시작 전 plugin init을 수행하고 tool requirement로 PermissionPolicy를 구성하는 위치입니다.',
    annotations: [
      { lines: [7615, 7623], color: 'amber', note: 'plugin initialize가 runtime 생성 전에 동기 실행되며 하나가 실패하면 runtime build가 중단됩니다.' },
      { lines: [7624, 7648], color: 'sky', note: '같은 tool registry를 API definition과 executor가 공유하고 별도 PermissionPolicy를 conversation runtime에 전달합니다.' },
    ],
  },
  'conversation-gate': {
    path: 'claw-code/rust/crates/runtime/src/conversation.rs',
    code: conversationRs,
    lang: 'rust',
    highlight: [400, 480],
    desc: 'PreToolUse 결과, permission authorization, tool execution, success/failure post hook의 실제 순서입니다.',
    annotations: [
      { lines: [410, 445], color: 'rose', note: 'pre-hook cancel/fail/deny는 실행 전에 닫습니다. 그 외에는 updated input과 permission context로 authorize합니다.' },
      { lines: [447, 454], color: 'emerald', note: 'PermissionOutcome::Allow일 때만 executor를 호출합니다.' },
      { lines: [457, 480], color: 'amber', note: 'tool 결과에 따라 success 또는 failure post-hook을 실행하고 hook 결과를 최종 tool message에 반영합니다.' },
    ],
  },
  'hook-process': {
    path: 'claw-code/rust/crates/plugins/src/hooks.rs',
    code: hooksRs,
    lang: 'rust',
    highlight: [59, 228],
    desc: 'enabled plugin hook를 합친 HookRunner와 각 hook shell command의 동기 실행·exit-code 계약입니다.',
    annotations: [
      { lines: [70, 83], color: 'sky', note: 'registry에서 enabled hook를 모은 뒤 PreToolUse command chain으로 전달합니다.' },
      { lines: [176, 198], color: 'rose', note: 'hook command도 shell subprocess이며 stdin/env를 받고 동기적으로 끝날 때까지 기다립니다. sandbox나 timeout은 없습니다.' },
      { lines: [199, 228], color: 'amber', note: 'exit 0은 allow, 2는 deny, 나머지는 failure입니다. 실행 자체의 side effect를 되돌리는 장치는 없습니다.' },
    ],
  },
};
