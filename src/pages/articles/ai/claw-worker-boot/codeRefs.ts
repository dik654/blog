import type { CodeRef } from '@/components/code/types';
import workerBootRs from './codebase/worker_boot.rs?raw';
import trustResolverRs from './codebase/trust_resolver.rs?raw';
import configRs from './codebase/config.rs?raw';
import toolsRs from './codebase/tools.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'worker-model': {
    path: 'claw-code/rust/crates/runtime/src/worker_boot.rs',
    code: workerBootRs,
    lang: 'rust',
    highlight: [28, 245],
    desc: 'Worker Boot의 실제 데이터 모델. 상태는 7개이며 Worker에는 PID, PTY, process handle이나 transport가 없다.',
    annotations: [
      { lines: [30, 38], color: 'sky', note: '현재 WorkerStatus는 Spawning부터 Failed까지 정확히 7개다.' },
      { lines: [197, 235], color: 'amber', note: 'Worker가 보관하는 것은 상태, gate, prompt receipt, error, event다. 터미널과 프로세스 소유권은 필드에 없다.' },
      { lines: [237, 245], color: 'emerald', note: 'Registry는 Arc<Mutex<...>> 안의 HashMap과 증가 counter로 구성된 in-memory control plane이다.' },
    ],
  },
  'create-observe': {
    path: 'claw-code/rust/crates/runtime/src/worker_boot.rs',
    code: workerBootRs,
    lang: 'rust',
    highlight: [255, 470],
    desc: 'create는 registry record를 만들고 observe는 호출자가 넘긴 screen_text에서 cue를 찾아 상태를 직접 바꾼다.',
    annotations: [
      { lines: [255, 294], color: 'sky', note: 'create는 Worker를 Spawning으로 삽입한다. subprocess spawn이나 terminal attach 호출은 없다.' },
      { lines: [302, 365], color: 'amber', note: 'observe의 입력은 외부 호출자가 캡처한 screen_text다. tool permission과 trust prompt를 먼저 판별한다.' },
      { lines: [366, 470], color: 'emerald', note: 'misdelivery, running, ready cue에 따라 status를 직접 대입한다. 전이 검증 함수가 강제하는 DFA는 아니다.' },
    ],
  },
  'send-lifecycle': {
    path: 'claw-code/rust/crates/runtime/src/worker_boot.rs',
    code: workerBootRs,
    lang: 'rust',
    highlight: [473, 607],
    desc: 'trust 해제, prompt send, restart, terminate의 실제 보장. 모두 registry state를 바꾸며 transport/process I/O는 수행하지 않는다.',
    annotations: [
      { lines: [473, 500], color: 'sky', note: 'resolve_trust는 TrustRequired에서 gate를 지우고 다시 Spawning으로 돌린다.' },
      { lines: [503, 547], color: 'rose', note: 'send_prompt는 attempt·in-flight·last prompt를 갱신한다. task_receipt가 Some이면 caller 입력을 복사하고 None이면 receipt를 생성·기록하지 않은 채 Running으로 바꾼다. terminal write도 하지 않는다.' },
      { lines: [569, 590], color: 'amber', note: 'restart는 state와 prompt bookkeeping을 초기화할 뿐 프로세스를 재시작하지 않는다.' },
      { lines: [592, 607], color: 'amber', note: 'terminate는 Finished로 표시할 뿐 signal 전송, cancellation, registry 제거를 하지 않는다.' },
    ],
  },
  'failure-evidence': {
    path: 'claw-code/rust/crates/runtime/src/worker_boot.rs',
    code: workerBootRs,
    lang: 'rust',
    highlight: [610, 887],
    desc: 'completion, startup timeout 분류와 state file 기록. timeout은 외부 호출로 관찰되며 state file 오류는 전파되지 않는다.',
    annotations: [
      { lines: [610, 664], color: 'sky', note: 'completion은 호출자가 넘긴 finish_reason과 출력 token 수를 기준으로 Finished 또는 Failed를 기록한다.' },
      { lines: [666, 754], color: 'amber', note: 'startup timeout은 자체 timer loop가 아니라 호출자가 호출하는 관찰 API다. 수집된 evidence를 failure class로 바꾼다.' },
      { lines: [825, 887], color: 'rose', note: '.claw/worker-state.json을 temp+rename으로 쓰지만 directory/write/rename 실패는 모두 무시한다.' },
    ],
  },
  'allowlist-boundary': {
    path: 'claw-code/rust/crates/runtime/src/worker_boot.rs',
    code: workerBootRs,
    lang: 'rust',
    highlight: [890, 898],
    desc: 'WorkerRegistry의 trusted root 검사. PathBuf prefix 비교는 component-aware지만 canonicalize 실패 시 raw path로 되돌아간다.',
    annotations: [
      { lines: [890, 898], color: 'rose', note: '두 값은 PathBuf라 starts_with는 component-aware다. 위험은 canonicalize 실패 시 상대 경로와 ..를 정규화하지 않은 raw PathBuf로 비교하는 fallback이다.' },
    ],
  },
  'trust-resolver': {
    path: 'claw-code/rust/crates/runtime/src/trust_resolver.rs',
    code: trustResolverRs,
    lang: 'rust',
    highlight: [296, 465],
    desc: '별도 TrustResolver의 정책 판정. Worker tools adapter가 이 resolver를 직접 호출하는 것은 아니다.',
    annotations: [
      { lines: [296, 321], color: 'sky', note: '결과는 NotRequired 또는 policy와 event를 가진 Required다.' },
      { lines: [324, 395], color: 'emerald', note: 'trust prompt일 때 denylist, allowlist, manual approval, RequireApproval 순으로 판단한다.' },
      { lines: [415, 465], color: 'amber', note: 'prompt와 수동 승인을 screen text의 문자열 cue로 감지한다.' },
    ],
  },
  'tools-specs': {
    path: 'claw-code/rust/crates/tools/src/lib.rs',
    code: toolsRs,
    lang: 'rust',
    highlight: [863, 1002],
    desc: 'Worker 도구의 public ToolSpec. permission label은 mutation 여부와 일치하지 않으며 ReadOnly인 observe도 Worker 상태와 event 파일을 바꿀 수 있다.',
    annotations: [
      { lines: [863, 905], color: 'sky', note: 'create/get/observe의 schema와 permission mode다. Observe는 ReadOnly로 등록돼도 registry status와 state file을 바꾼다.' },
      { lines: [907, 931], color: 'amber', note: 'resolve-trust와 await-ready의 schema다. permission label만으로 read-only side effect를 추론하면 안 된다.' },
      { lines: [933, 1002], color: 'amber', note: 'send/restart/terminate/completion은 위험 변경으로 등록되지만 process transport를 구현하는 코드는 아니다.' },
    ],
  },
  'tools-adapter': {
    path: 'claw-code/rust/crates/tools/src/lib.rs',
    code: toolsRs,
    lang: 'rust',
    highlight: [1499, 1574],
    desc: 'tool dispatcher와 WorkerRegistry 사이의 실제 adapter. 각 함수는 registry method에 입력을 전달한다.',
    annotations: [
      { lines: [1499, 1516], color: 'sky', note: 'WorkerCreate만 ConfigLoader의 trusted_roots와 호출 인자를 합쳐 registry.create를 부른다.' },
      { lines: [1520, 1574], color: 'rose', note: '나머지 adapter에도 terminal write, spawn, kill, timer ownership은 없다.' },
    ],
  },
  'trusted-roots-config': {
    path: 'claw-code/rust/crates/runtime/src/config.rs',
    code: configRs,
    lang: 'rust',
    highlight: [895, 918],
    desc: 'project config의 trustedRoots를 문자열 배열로 읽는 부분.',
    annotations: [
      { lines: [907, 912], color: 'amber', note: 'trustedRoots는 config에서 Vec<String>으로 들어오고 WorkerCreate에서 per-call roots와 합쳐진다.' },
    ],
  },
};
