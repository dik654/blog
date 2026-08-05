# Bash signal, sandbox, and process boundary content spec

## Goal
- 독자가 command string classifier를 위험 신호로, OS sandbox와 process control을 실제 enforcement로 구분하게 한다.
- production dispatch와 호출되지 않는 validation candidate를 분리한다.
- sandbox request, status, launcher, enforced negative test를 서로 다른 증거로 읽게 한다.
- 현재 Claw revision `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`과 권장 hardening을 섞지 않는다.

## Target questions
- `validate_command()`에 Block과 Warn이 있어도 왜 current production bash를 막지 못하는가?
- `filesystem_active=true`인데 왜 workspace 밖 절대 경로 접근이 막힌다고 말할 수 없는가?
- timeout 응답이 왔는데 왜 descendant process가 끝났다고 보장할 수 없는가?
- background PID를 받았는데 왜 관리 가능한 task lifecycle이 완성되지 않았는가?

## Source anchors
| Area | File/function/type | Required claim |
|---|---|---|
| dispatch | vendored `tools_bash_wiring.rs` / `execute_tool_with_enforcer` | dynamic classification, optional enforcer, `run_bash` |
| runner gateway | vendored `tools_bash_wiring.rs` / `run_bash` | workspace test branch preflight, `Option<BashCommandOutput>` early return, and `BranchFreshness` decision before `execute_bash` |
| runner | `bash.rs::execute_bash` | foreground/background split after preflight |
| timeout/output | `execute_bash_async` | timeout future, output truncation, exit code |
| validation | `bash_validation.rs::validate_command` | exact four stages and short-circuit |
| call-site proof | repository search | production call site absent |
| intent | `classify_command` | eight first-command categories |
| status | `sandbox.rs::resolve_sandbox_status_for_request` | requested/supported/active/fallback |
| launcher | `build_linux_sandbox_command` | launcher `None` condition, unconditional namespace flags, conditional `--net`, and environment-only filesystem fields |
| fallback | `bash.rs::prepare_*_command` | launcher `None` → host `sh -lc` |

## Narrative
1. shell string이 구조화된 file path보다 넓은 effect language라는 점에서 시작한다.
2. `ShellBoundaryLab`로 branch preflight를 포함한 현재 path, unwired validation, fail-open fallback, filesystem gap, timeout, background를 비교한다.
3. production dispatch와 candidate validation module을 다른 call graph로 그린다.
4. Warn/Block/Allow의 caller contract와 first-command intent 한계를 설명한다.
5. requested/supported/active/enforced를 분리한다.
6. `namespace_active` 상태와 실제 launcher flag를 별도 증거로 대조한다.
7. process tree, exit semantics, background lifecycle로 운영 hardening을 마친다.

## Current versus recommended
| Topic | Current revision | Recommended hardening |
|---|---|---|
| validation | separate four-stage function, tests only | one mandatory public execution gateway |
| warning | caller contract not wired into bash path | Ask/Deny/Allow mapping plus decision audit |
| filesystem | mode/env fields, no bind boundary | verified mount/landlock/seccomp backend |
| launcher state | builder returns `None` only when namespace and network isolation are both inactive; a created launcher still adds user/mount/IPC/PID/UTS namespaces even when `namespace_active=false` | status must describe the flags actually enforced |
| fallback | both isolation flags inactive, or unavailable launcher preparation, can reach host `sh -lc` | production profile fail-closed |
| timeout | wait timeout response | process group kill escalation and reap |
| background | PID only, stdio discarded | registry, logs, cancel, descendant cleanup |

## Viz contract
- scenario tabs act as a segmented control and wrap rather than scroll on mobile.
- every scenario shows four concrete stages and one invariant.
- fallback scenario는 REQUEST → PROBE → LAUNCHER → FALLBACK의 실행 증거 순서로 표시한다.
- network-only scenario는 `namespace_active=false`와 실제 unshare flags가 다른 현재 구현 공백을 숨기지 않는다.
- status uses text plus icon, not color alone.
- current partial behavior and missing enforcement use different labels.
- internal horizontal overflow must be zero at 390px.

## Adversarial checks
- metadata와 section id가 exact match하는가?
- candidate validation을 six stages라고 부르거나 production-wired라고 주장하지 않는가?
- branch freshness preflight를 command safety validation이나 sandbox라고 부르지 않는가?
- destructive patterns를 absolute block 또는 severity ladder라고 발명하지 않는가?
- first command intent를 shell AST나 complete effect analysis라고 부르지 않는가?
- `unshare` namespace를 bubblewrap, bind allow-list, seccomp로 넓혀 말하지 않는가?
- launcher가 생성되면 user/mount/IPC/PID/UTS namespace가 추가된다는 사실을 `namespace_active` 하나로 축약하지 않는가?
- builder가 namespace 또는 network 중 하나만 꺼져도 `None`을 반환한다고 잘못 설명하지 않는가?
- timeout을 process-tree termination으로, PID를 task registry로 오해하지 않는가?

## Stop rule
- 이 글은 current Linux unshare launcher와 그 공백까지 다룬다.
- production sandbox backend 선택과 cross-platform 구현은 target contract로만 제시한다.
