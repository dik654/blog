import type { CodeRef } from '@/components/code/types';
import bashRs from './codebase/bash.rs?raw';
import validationRs from './codebase/bash_validation.rs?raw';
import sandboxRs from './codebase/sandbox.rs?raw';
import toolsBashWiringRs from './codebase/tools_bash_wiring.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'tools-dispatch': {
    path: 'claw-code/rust/crates/tools/src/lib.rs · exact excerpts',
    code: toolsBashWiringRs,
    lang: 'rust',
    highlight: [1, 73],
    desc: '고정 revision의 tools dispatch와 optional enforcer excerpt입니다. 1-52줄은 upstream 1181-1232, 53-73줄은 upstream 1311-1331입니다.',
    annotations: [
      { lines: [16, 18], color: 'rose', note: '공개 execute_tool은 enforcer 없이 실행 helper에 진입합니다.' },
      { lines: [20, 32], color: 'sky', note: 'bash arm은 command를 분류하고 optional enforcer를 거친 뒤 run_bash로 이동합니다.' },
      { lines: [56, 73], color: 'amber', note: 'enforcer가 Some일 때만 동적 required mode를 확인하고 None이면 그대로 Ok를 반환합니다.' },
    ],
  },
  'tools-bash-gateway': {
    path: 'claw-code/rust/crates/tools/src/lib.rs · exact excerpts',
    code: toolsBashWiringRs,
    lang: 'rust',
    highlight: [74, 194],
    desc: '고정 revision의 Bash 분류, run_bash gateway, workspace test branch preflight excerpt입니다. upstream 1848-1921과 1923-1969를 그대로 추출했습니다.',
    annotations: [
      { lines: [77, 107], color: 'amber', note: '첫 command 목록과 path heuristic으로 WorkspaceWrite 또는 DangerFullAccess를 고릅니다.' },
      { lines: [110, 139], color: 'rose', note: 'path 검사는 split_whitespace 기반 휴리스틱이며 shell 전체 효과를 해석하지 않습니다.' },
      { lines: [141, 147], color: 'sky', note: 'workspace test branch preflight가 Some을 반환하면 execute_bash 전에 조기 반환합니다.' },
      { lines: [148, 182], color: 'emerald', note: 'workspace test 명령만 git branch freshness를 확인하고 Fresh는 실행을 계속하지만 Stale/Diverged는 직렬화할 조기 결과를 만듭니다.' },
      { lines: [184, 194], color: 'sky', note: 'workspace 전체 cargo test/nextest 명령인지 정규화된 문자열로 판별합니다.' },
    ],
  },
  'bash-execution': {
    path: 'claw-code/rust/crates/runtime/src/bash.rs',
    code: bashRs,
    lang: 'rust',
    highlight: [18, 104],
    desc: '실제 Bash input/output와 foreground/background 진입점입니다. validation pipeline 호출은 이 경로에 없습니다.',
    annotations: [
      { lines: [20, 36], color: 'sky', note: 'timeout, background, sandbox disable, namespace/network/filesystem 요청이 input에 들어옵니다.' },
      { lines: [70, 81], color: 'rose', note: 'run_in_background는 stdout/stderr를 null로 두고 spawn한 뒤 PID 문자열만 반환합니다. lifecycle registry나 descendant cleanup은 보이지 않습니다.' },
      { lines: [83, 99], color: 'amber', note: 'background 응답은 종료 상태나 output을 추적하지 않습니다.' },
      { lines: [102, 104], color: 'emerald', note: 'foreground만 async output 경로로 들어갑니다.' },
    ],
  },
  'bash-timeout-output': {
    path: 'claw-code/rust/crates/runtime/src/bash.rs',
    code: bashRs,
    lang: 'rust',
    highlight: [168, 234],
    desc: 'foreground timeout, output truncation, exit-code 해석의 실제 구현입니다.',
    annotations: [
      { lines: [176, 203], color: 'rose', note: 'tokio timeout은 output future를 중단하지만 이 코드에는 process group 생성·kill·wait가 없습니다. timeout 응답과 프로세스 종료 보장을 구분해야 합니다.' },
      { lines: [205, 215], color: 'sky', note: 'stdout/stderr는 종료 뒤 truncate되고 non-zero code는 exit_code:N 문자열이 됩니다.' },
      { lines: [217, 234], color: 'amber', note: 'signal termination은 code()가 None이라 별도 signal 정보가 남지 않습니다.' },
    ],
  },
  'sandbox-launch': {
    path: 'claw-code/rust/crates/runtime/src/bash.rs',
    code: bashRs,
    lang: 'rust',
    highlight: [236, 303],
    desc: 'sandbox status를 계산하고 launcher가 없으면 일반 sh -lc로 fallback하는 실제 분기입니다.',
    annotations: [
      { lines: [236, 249], color: 'sky', note: 'config load 실패는 default config로 돌아가고 request별 override를 합칩니다.' },
      { lines: [261, 275], color: 'rose', note: 'sandbox launcher가 None이면 실행을 거부하지 않고 sh -lc로 계속합니다. production 관점에서는 fail-open입니다.' },
      { lines: [288, 302], color: 'rose', note: 'async path도 같은 fallback을 가집니다. HOME/TMPDIR 변경은 filesystem containment가 아닙니다.' },
    ],
  },
  'validation-pipeline': {
    path: 'claw-code/rust/crates/runtime/src/bash_validation.rs',
    code: validationRs,
    lang: 'rust',
    highlight: [15, 45],
    desc: 'ValidationResult와 CommandIntent 타입입니다. 이 모듈의 존재와 production wiring은 별도 사실입니다.',
    annotations: [
      { lines: [15, 24], color: 'sky', note: 'validation은 Allow, Block, Warn 세 결과를 구분합니다.' },
      { lines: [26, 45], color: 'amber', note: 'intent는 여덟 category지만 heuristic label이며 containment 결과가 아닙니다.' },
    ],
  },
  'destructive-signals': {
    path: 'claw-code/rust/crates/runtime/src/bash_validation.rs',
    code: validationRs,
    lang: 'rust',
    highlight: [205, 274],
    desc: 'destructive pattern은 절대 차단 목록이 아니라 Warn을 만드는 substring/first-token heuristic입니다.',
    annotations: [
      { lines: [205, 235], color: 'sky', note: '열 개 substring pattern과 always-destructive first-command 목록을 정의합니다.' },
      { lines: [241, 270], color: 'rose', note: 'matching 결과는 Block이 아니라 Warn입니다. UI/caller가 Warn을 어떻게 닫는지가 보안에 중요합니다.' },
    ],
  },
  'intent-classifier': {
    path: 'claw-code/rust/crates/runtime/src/bash_validation.rs',
    code: validationRs,
    lang: 'rust',
    highlight: [388, 615],
    desc: '첫 command 기반 intent 분류와 4단계 validation 함수입니다. 현재 production execute_bash에서는 이 함수를 호출하지 않습니다.',
    annotations: [
      { lines: [529, 584], color: 'amber', note: '첫 command와 일부 special case로 category를 고릅니다. pipeline 뒤 command, substitution, redirect 전체 semantics를 parse하지 않습니다.' },
      { lines: [590, 615], color: 'rose', note: 'validate_command 자체는 mode→sed→destructive→path 순서지만 repository 검색 기준 호출자는 이 파일의 tests뿐입니다.' },
    ],
  },
  'sandbox-status': {
    path: 'claw-code/rust/crates/runtime/src/sandbox.rs',
    code: sandboxRs,
    lang: 'rust',
    highlight: [27, 207],
    desc: 'sandbox request/status와 지원 여부 계산입니다. requested, supported, active를 분리해 볼 수 있습니다.',
    annotations: [
      { lines: [27, 68], color: 'sky', note: 'requested 설정과 실제 active/support 상태, fallback reason을 별도 필드로 기록합니다.' },
      { lines: [85, 105], color: 'amber', note: '기본은 enabled=true, namespace=true, network=false, workspace-only filesystem mode입니다.' },
      { lines: [162, 207], color: 'rose', note: 'namespace/network 지원이 없으면 fallback reason을 남기지만 status 계산 자체가 실행을 거부하지는 않습니다.' },
    ],
  },
  'unshare-command': {
    path: 'claw-code/rust/crates/runtime/src/sandbox.rs',
    code: sandboxRs,
    lang: 'rust',
    highlight: [210, 262],
    desc: '현재 Linux launcher는 bubblewrap이 아니라 unshare입니다.',
    annotations: [
      { lines: [216, 221], color: 'rose', note: 'Linux가 아니거나 namespace/network가 active하지 않으면 launcher를 만들지 않습니다.' },
      { lines: [223, 237], color: 'sky', note: 'user, mount, IPC, PID, UTS namespace와 선택적 network namespace를 요청합니다.' },
      { lines: [239, 251], color: 'amber', note: 'filesystem mode와 allowed mounts는 환경변수로 전달될 뿐 이 함수 안에서 bind mount/allow-list를 강제하지 않습니다.' },
    ],
  },
};
