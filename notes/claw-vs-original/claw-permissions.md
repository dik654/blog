# claw-permissions vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 권한 시스템을 **3단계 모드 + 다층 게이팅** 으로 설명한다.

- 3 PermissionMode: `ReadOnly` (0) < `WorkspaceWrite` (1) < `DangerFullAccess` (2)
- `PartialOrd` derive — `current >= required` 비교가 모든 판정 기준
- CLI flag: `--read-only` → ReadOnly, `--dangerously-skip-permissions` → DangerFullAccess, default → WorkspaceWrite
- 4 컴포넌트: `PermissionMode`, `PermissionPolicy` (allow/deny/prompt 매칭), `PermissionEnforcer` (런타임 게이트), `ContextOverride` (일시적 변경)
- HookRunner — Pre/Post 훅 (JSON 프로토콜)
- Lane 9 추가: `permission_enforcer.rs` (340 LOC) — `check()` / `check_file_write()` (workspace boundary) / `check_bash()` (read-only mutating 차단)
- 인사이트: "모드(거친) - 정책(세밀) - 훅(확장) 3계층"

## 원본 Claude Code 실제 동작

원본 권한 시스템은 **5+ Mode + LLM-기반 classifier + plan mode + auto mode + dontAsk + bypass + classifier killswitch + hierarchical settings + permission rules + suggestions + working directory tracking** 등 9,400+ LOC.

### Mode 종류 — 3개가 아니라 5~7개

```ts
EXTERNAL_PERMISSION_MODES = ['acceptEdits', 'bypassPermissions', 'default', 'dontAsk', 'plan']
INTERNAL_PERMISSION_MODES = [...EXTERNAL, 'auto', 'bubble']  // ant-only feature
```

- `default` — claw 의 WorkspaceWrite 와 가장 비슷. ask + 규칙 평가
- `acceptEdits` — Edit/Write 자동 허용, 그 외 ask. claw 에 없음
- `plan` — Plan Mode. 도구 실행 전 계획만, ExitPlanMode 가 호출되어야 진짜 실행. claw 에 없음 (블로그는 `EnterPlanMode`/`ExitPlanMode` 도구만 언급)
- `bypassPermissions` — claw 의 DangerFullAccess
- `dontAsk` — bypass 와 유사하지만 telemetry/다이얼로그 차이
- `auto` (ant-only TRANSCRIPT_CLASSIFIER feature) — LLM classifier 가 결정
- `bubble` (ant-only) — 특수 모드

claw 의 `ReadOnly` 는 원본의 `--permission-mode default` + 모든 write/exec deny 정책 조합에 가깝지만 별도 mode 가 아님.

### 9,400 LOC 의 권한 모듈 구성

| 파일 | LOC | 역할 |
|---|---|---|
| `permissions.ts` | 1486 | 메인 — `checkPermissions()` orchestration, mode/rule/hook/classifier 조합 |
| `filesystem.ts` | 1777 | 파일 권한 — workspace boundary + 추가 디렉토리 + symlink 정책 + cross-fs 검증 |
| `permissionSetup.ts` | 1532 | 초기 설정 — 사용자 `/permissions` 다이얼로그, rule edit UX |
| `yoloClassifier.ts` | 1495 | LLM 기반 classifier — auto mode 의 핵심. 2-stage (fast XML → thinking) |
| `pathValidation.ts` | 485 | 경로 검증 (utils 의 pathValidation 외 별도) |
| `PermissionUpdate.ts` | 389 | rule 업데이트 mutation 처리 |
| `permissionsLoader.ts` | 296 | 다중 settings source 로드 + 머지 |
| `permissionExplainer.ts` | 250 | 권한 결정 사유 사용자에게 설명 — riskLevel + explanation + risk |
| `shadowedRuleDetection.ts` | 234 | 한 rule 이 다른 rule 을 가리는지 (deny vs allow 충돌) |
| `shellRuleMatching.ts` | 228 | shell 명령어 별 rule 매칭 |
| `permissionRuleParser.ts` | 198 | rule DSL 파싱 (예: `Bash(git diff:*)`) |
| `bypassPermissionsKillswitch.ts` | 155 | 회사 정책으로 bypass 강제 비활성화 |
| `PermissionMode.ts` | 141 | mode metadata (title, symbol, color) |
| `PermissionPromptToolResultSchema.ts` | 127 | permission prompt tool 결과 스키마 |
| `getNextPermissionMode.ts` | 101 | shift+tab 으로 mode 순환 |
| `classifierDecision.ts` | 98 | classifier 결과 → decision |
| `dangerousPatterns.ts` | 80 | 위험 패턴 (filesystem 별도) |
| `PermissionUpdateSchema.ts` | 78 | update mutation 스키마 |
| `bashClassifier.ts` | 61 | bash 전용 classifier |
| `denialTracking.ts` | 45 | 같은 권한 반복 거부 추적 |
| `PermissionRule.ts` | 40 | rule 타입 |
| `autoModeState.ts` | 39 | auto mode 상태 |
| `classifierShared.ts` | 39 | classifier 공유 유틸 |
| `PermissionResult.ts` | 35 | result 타입 |

### 핵심 차이 메커니즘

1. **9 가지 PermissionDecisionReason** — claw 는 mode/rule/hook 정도. 원본은:
   - `rule` — 명시 규칙 매칭
   - `mode` — 모드 결정
   - `subcommandResults` — 복합 명령의 sub-command 별 결과
   - `permissionPromptTool` — 외부 permission prompt tool 결과
   - `hook` — hook 결정
   - `asyncAgent` — async agent context
   - `sandboxOverride` — 샌드박스 unavailable / dangerouslyDisableSandbox
   - `classifier` — LLM classifier 결정
   - `workingDir` — 작업 디렉토리 정책
   - `safetyCheck` — sensitive path (.claude/, .git/, shell configs) 등
   - `other` — 기타

2. **`PermissionRule` DSL + multi-source** — 권한이 8 source 에서 옴:
   - `userSettings` — `~/.claude/settings.json`
   - `projectSettings` — `.claude/settings.json` (commit)
   - `localSettings` — `.claude/settings.local.json` (gitignore)
   - `flagSettings` — `--allow`/`--deny` CLI flag
   - `policySettings` — 회사 정책 파일
   - `cliArg` — CLI 인자
   - `command` — 슬래시 명령 (`/permissions add`)
   - `session` — 세션 중 "always allow" 선택

   각 source 에서 `alwaysAllowRules` / `alwaysDenyRules` / `alwaysAskRules` 3 카테고리. claw 는 단일 PermissionPolicy 머지.

3. **YOLO Classifier (auto mode)** — `yoloClassifier.ts` 1495 LOC. LLM 으로 "이 명령은 안전한가?" 평가. 2-stage:
   - Stage 1 (fast XML) — 빠른 평가
   - Stage 2 (thinking) — 의심스러우면 reasoning 모델로
   - `transcriptTooLong` 처리 (deterministic — 재시도 안 함)
   - per-stage usage / duration / request_id / msg_id 텔레메트리
   - `errorDumpPath` — API 에러 시 prompt 덤프
   - `bashClassifier.ts` 는 bash 전용 separate classifier

4. **Plan Mode** — 도구 실행 직전 LLM 이 plan 만 작성, `ExitPlanMode` 호출까지 실제 mutating 도구 차단. claw 에는 ExitPlanMode tool 만 있고 mode 자체는 없음.

5. **Permission Explainer** (`permissionExplainer.ts`) — 권한 결정마다 `{ riskLevel: LOW/MED/HIGH, explanation, reasoning, risk }` 생성해 사용자에게 표시. claw 의 simple allow/deny 와 차원이 다른 UX.

6. **Permission Suggestions** — `PermissionAskDecision.suggestions: PermissionUpdate[]` — "이 명령을 항상 허용하려면 이 rule 추가" 같은 자동 제안 생성. 사용자가 한 번 클릭으로 settings 에 저장.

7. **Shadowed Rule Detection** (`shadowedRuleDetection.ts` 234) — `allow Bash(git:*)` + `deny Bash(git push)` 같은 충돌 감지. 사용자에게 "이 rule 은 가려져서 효과 없음" 경고.

8. **Bypass Killswitch** (`bypassPermissionsKillswitch.ts` 155) — 회사가 `--dangerously-skip-permissions` 자체를 강제 비활성화 가능. enterprise feature. claw 에 없음.

9. **DenialTracking** (`denialTracking.ts`) — 같은 권한이 N 회 거부되면 LLM 에게 "그만 시도해" 메시지. 무한 루프 방지.

10. **Working Directory 권한** — `additionalWorkingDirectories: Map<string, AdditionalWorkingDirectory>` — 메인 cwd 외 추가 허용 디렉토리, 각각 source 추적. claw 의 `working_dir` 단일 경로와 다름.

11. **`AsyncAgent` 권한 위임** — `asyncAgent` decisionReason — 서브 에이전트가 부모의 권한 컨텍스트를 상속하되 특정 도구는 부모 confirm 필요.

12. **Pending Classifier Check** — `pendingClassifierCheck` — ask 결정 내려도 비동기로 classifier 가 자동 승인 가능. 사용자가 click 하기 전에 classifier 가 끝나면 자동 통과.

13. **Permission Prompt Tool** — `permissionPromptTool` — 외부 도구 (예: 회사 admin tool) 가 권한 결정. SDK 사용자가 자체 권한 시스템 끼워넣기.

14. **Mode 시각 표시** — `PermissionMode.ts` 의 `PERMISSION_MODE_CONFIG` — 각 mode 가 symbol (`⏵⏵`, `⏸`), color (planMode/autoAccept/error/warning), short title 가짐. UI 통합 깊음.

15. **isBypassPermissionsModeAvailable** — settings 에서 bypass mode 자체를 enable/disable. 보안팀이 "이 프로젝트는 bypass 금지" 설정 가능.

16. **Hook integration** — `hooks/toolPermission/handlers/` 디렉토리 (coordinator, asyncAgent 등 핸들러). claw 의 단순 PrePost JSON hook 과 다름.

## 주요 차이점

| 항목 | 블로그(claw) 서술 | 원본 실제 | 차이 종류 |
|---|---|---|---|
| 코드 규모 | permission_enforcer.rs 340 + permissions.rs (보조) | utils/permissions/ 9409 + types/permissions.ts 442 + handlers + UI ≈ 12,000 LOC | 단순화 (35배) |
| Mode 수 | 3 (ReadOnly/WorkspaceWrite/DangerFullAccess) | 5 external (default/acceptEdits/bypassPermissions/dontAsk/plan) + 2 internal (auto/bubble) | 단순화 |
| Plan Mode | EnterPlanMode/ExitPlanMode 도구만 | `plan` mode — mutating 도구 차단 + ExitPlanMode 호출 시 해제 + UI 인디케이터 | 다른 메커니즘 |
| acceptEdits | 없음 | Edit/Write/mkdir/touch/rm/rmdir/mv/cp/sed 자동 허용 | 누락 |
| LLM Classifier | 없음 | yoloClassifier.ts 1495 LOC — 2-stage (fast XML → thinking), per-stage 텔레메트리 | 누락 |
| auto mode | 없음 | classifier 가 결정 (TRANSCRIPT_CLASSIFIER feature) | 누락 |
| Mode ordering | PartialOrd 수치 비교 | mode metadata + 컨텍스트 의존적 결정 (mode + rules + hook + classifier 조합) | 다른 메커니즘 |
| Rule sources | 단일 PermissionPolicy | 8 source (user/project/local/flag/policy/cliArg/command/session) | 단순화 |
| Rule DSL | 없음 | `Bash(git diff:*)` 같은 DSL + parser (198 LOC) + shellRuleMatching (228) | 누락 |
| Decision reason | mode/rule/hook | 11 종 (rule/mode/subcommandResults/permissionPromptTool/hook/asyncAgent/sandboxOverride/classifier/workingDir/safetyCheck/other) | 누락 |
| Permission Explainer | 없음 | riskLevel + explanation + reasoning + risk 생성 (250 LOC) | 누락 |
| Permission Suggestions | 없음 | "항상 허용" 자동 제안 → settings 저장 | 누락 |
| Shadowed Rule 감지 | 없음 | allow vs deny 충돌 감지 (234 LOC) | 누락 |
| Bypass Killswitch | 없음 | 회사 정책으로 bypass 강제 비활성 (155 LOC) | 누락 |
| Denial Tracking | 없음 | 반복 거부 시 LLM 에게 메시지 | 누락 |
| Working dirs | 단일 working_dir | `additionalWorkingDirectories: Map` — source 추적 + 다중 디렉토리 | 단순화 |
| Permission Prompt Tool | 없음 | 외부 SDK tool 이 권한 결정 가능 | 누락 |
| Async classifier check | 없음 | ask 결정 후 비동기 classifier — 자동 승인 가능 | 누락 |
| Mode UX | enum 만 | symbol (`⏵⏵`/`⏸`) + color + short title + shift+tab 순환 | 누락 |
| Sandbox override reason | 없음 | sandboxOverride decisionReason 기록 | 누락 |
| safetyCheck | banned_patterns 즉시 deny | safetyCheck reason + classifierApprovable flag — sensitive path 는 classifier 가 평가 | 다른 메커니즘 |
| ContextOverride | 일시적 모드 변경 | `prePlanMode` 저장 + plan 진입/탈출 시 복구 + session-level override | 단순화 |

## 블로그 보강 제안

블로그가 잘 한 것: 3계층 (mode-policy-hook) 구조 인사이트는 강하다. 원본의 6+ mode, classifier, rule DSL 만 짚으면 정확성이 크게 올라간다.

1. **Overview 도입부 callout** — "claw 의 3 mode + Lane 9 PermissionEnforcer 는 의도적 단순화. 원본은 5+ external mode + LLM YoloClassifier + 8 rule source + plan mode + bypass killswitch + permission explainer 등 12,000 LOC" 한 단락.

2. **Mode 비교 표 신설** — claw 3 mode vs 원본 7 mode (default/acceptEdits/plan/bypassPermissions/dontAsk/auto/bubble) 매핑. plan mode 와 acceptEdits 는 진짜 mode 라는 점 (claw 는 도구나 설정으로 흉내).

3. **YoloClassifier 한 섹션 신설** — 1495 LOC LLM-기반 권한 분류기. 2-stage (fast XML → thinking), per-stage telemetry, transcriptTooLong 처리 등. claw 의 정적 분류와 대비. 이건 흥미로운 면접 토픽.

4. **Rule DSL 보강** — 원본의 `Bash(git diff:*)` 같은 패턴 DSL + 8 source 머지 + shadowed rule 감지. claw 의 단일 PermissionPolicy 와 깊이 차이.

5. **Permission Explainer 섹션** — 권한 결정마다 riskLevel + explanation 생성하는 UX. claw 는 yes/no 만, 원본은 "왜" 까지.

6. **Decision Reason 11종** — `safetyCheck.classifierApprovable` 같은 nuanced flag 가 claw 의 즉시 deny 와 어떻게 다른지.

7. **Bypass Killswitch enterprise 인사이트 callout** — 회사가 bypass 자체를 끄는 mechanism. 보안팀 관점.

8. **Plan Mode 한 섹션** — claw 의 EnterPlanMode 도구는 stub 에 가깝고, 원본은 진짜 mode 로 도구 실행 차단 + 사용자가 ExitPlanMode 까지 plan 검토. 면접에서 "AI safety 어떻게 했어?" 답할 때 좋은 예.

## 참조한 원본 파일

- `/home/heru/code/claude-analysis/src/utils/permissions/permissions.ts` (1486)
- `/home/heru/code/claude-analysis/src/utils/permissions/filesystem.ts` (1777, workspace + add'l dirs)
- `/home/heru/code/claude-analysis/src/utils/permissions/permissionSetup.ts` (1532)
- `/home/heru/code/claude-analysis/src/utils/permissions/yoloClassifier.ts` (1495, LLM classifier)
- `/home/heru/code/claude-analysis/src/utils/permissions/permissionExplainer.ts` (250)
- `/home/heru/code/claude-analysis/src/utils/permissions/shadowedRuleDetection.ts` (234)
- `/home/heru/code/claude-analysis/src/utils/permissions/shellRuleMatching.ts` (228)
- `/home/heru/code/claude-analysis/src/utils/permissions/permissionRuleParser.ts` (198)
- `/home/heru/code/claude-analysis/src/utils/permissions/bypassPermissionsKillswitch.ts` (155)
- `/home/heru/code/claude-analysis/src/utils/permissions/PermissionMode.ts` (141)
- `/home/heru/code/claude-analysis/src/utils/permissions/getNextPermissionMode.ts` (101, shift+tab 순환)
- `/home/heru/code/claude-analysis/src/types/permissions.ts` (442, 모든 타입)
- `/home/heru/code/claude-analysis/src/utils/permissions/bashClassifier.ts` (61)
- `/home/heru/code/claude-analysis/src/utils/permissions/denialTracking.ts` (45)
- `/home/heru/code/claw-code/PARITY.md` Lane 9 — PermissionEnforcer
