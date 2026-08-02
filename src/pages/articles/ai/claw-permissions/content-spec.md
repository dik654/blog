# Permission authorization boundary content spec

## Goal
- 독자가 `Allow`, `Ask`, `Deny` 충돌을 이름의 인상이나 enum 순서가 아니라 실제 branch 순서로 계산하게 한다.
- authorization decision, interactive handoff, file/shell containment를 서로 다른 책임으로 그리게 한다.
- 현재 Claw revision `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`의 구현과 production hardening 제안을 섞지 않는다.

## Target questions
- static deny와 hook Allow가 동시에 맞으면 어느 것이 이기며, 어느 코드 branch가 이를 보장하는가?
- ask rule이 맞지만 prompter가 없으면 왜 실행되지 않는가?
- active mode가 `Prompt`이고 일반 tool requirement가 `DangerFullAccess`이면 현재 코드는 왜 묻지 않고 Allow하는가?
- `PermissionEnforcer::check()`가 Prompt mode에서 `Allowed`를 반환해도 왜 최종 사용자 승인이 아닌가?
- permission이 Allow여도 왜 file boundary와 OS sandbox가 다시 필요한가?

## Source anchors
| Area | File/function/type | Required claim |
|---|---|---|
| modes/context | `permissions.rs` / `PermissionMode`, `PermissionContext` | 다섯 mode와 request context |
| rule order | `PermissionPolicy::authorize_with_context` | deny → context → ask → allow/derived mode comparison → limited escalation → deny |
| fallback | `required_mode_for`, `prompt_or_deny` | unknown tool full-access default, no-prompter deny |
| rule DSL | `PermissionRule`, `extract_permission_subject` | Any/Exact/Prefix와 ordered subject keys |
| thin gate | `permission_enforcer.rs` | Prompt handoff와 dynamic mode helper |
| real loop | vendored `permission_wiring.rs` / `conversation.rs` | pre-hook input/context, policy authorization, execution |
| split gates | vendored `permission_wiring.rs` / `conversation.rs`, `tools/src/lib.rs` | policy 직접 호출, registry의 optional enforcer, enforcer 없는 public `execute_tool()` |

## Narrative
1. permission의 질문을 “요청할 권한”으로 제한한다.
2. 다섯 variant를 작업 범위 셋과 판정 특수 상태 둘로 나눈다.
3. `PermissionDecisionLab`의 여섯 반례로 conflict order와 Prompt enum-order 결함을 먼저 체득한다.
4. rule DSL과 subject extraction으로 match의 정확한 범위를 읽는다.
5. policy 직접 호출, optional thin enforcer, enforcer 없는 helper를 서로 다른 entry point로 분리한다.
6. hook override의 실제 scope와 production lifetime 요구를 분리한다.
7. file handle과 process sandbox로 책임을 넘긴다.

## Current versus recommended
| Topic | Current revision | Recommended hardening |
|---|---|---|
| outcome | Allow 또는 reason이 있는 Deny | winning source/rule과 shadowed rule evidence |
| prompt | 동기 Allow/Deny | timeout/error/cancel을 Deny로 닫고 audit record |
| Prompt mode | derived Ord 비교가 일반 requirement를 먼저 Allow | special mode를 범위 비교에서 분리하고 반드시 explicit prompt |
| override | request context의 decision/reason | scope, expiry, provenance, revocation |
| containment | permission 밖의 책임 | file handle, network/process sandbox와 결합 |

## Viz contract
- 여섯 conflict scenario를 같은 stage grammar로 비교한다.
- mobile은 세로 rail, `sm` 이상은 4열 rail로 바뀐다.
- status color만으로 의미를 전달하지 않고 `DENY`, `PROMPT`, `ALLOW`, `HANDOFF` text와 icon을 함께 쓴다.
- Prompt enforcer scenario에는 “최종 승인 아님”을 항상 표시한다.
- 내부 horizontal scroll을 만들지 않는다.

## Adversarial checks
- unknown tool을 ReadOnly에서 묵시적으로 허용한다고 설명하지 않는가?
- hook Allow가 static deny 또는 ask를 무조건 이긴다고 설명하지 않는가?
- enum derived order를 다섯 단계 안전 ladder로 표현하지 않는가?
- 현재 policy의 `Prompt >= DangerFullAccess` 묵시적 Allow를 정상 사용자 승인 흐름처럼 숨기지 않는가?
- thin enforcer의 Prompt `Allowed`를 사용자 승인으로 표현하지 않는가?
- `check_file_write`의 string prefix나 `check_bash`의 first token을 containment라고 부르지 않는가?

## Stop rule
- 이 글은 current revision의 authorization core까지만 증명한다.
- enterprise policy source 전체, kernel sandbox 구현, cross-platform file handle 구현은 다음 글과 권장 설계로 명시한다.
