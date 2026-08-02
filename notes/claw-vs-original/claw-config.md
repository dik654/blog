# claw-config vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 config 를 **3단계 캐스케이드 (system/user/project)** + AppConfig struct 로 설명한다.

- 3 priority: `/etc/claw/config.json` < `~/.claw/config.json` < `.claw/config.json`
- Deep-merge, 배열 덮어쓰기
- AppConfig: provider/api_key/model, permission_mode/trusted_*, plugins, mcp_servers, hooks 등

## 원본 Claude Code 실제 동작

원본 settings 는 **6,379+ LOC, 5+ source, MDM enterprise policy, schema validation, change detection, settings cache** 등 깊다.

### 핵심 모듈 (~6,400 LOC)

| 파일 | LOC | 역할 |
|---|---|---|
| `utils/config.ts` | 1817 | 메인 config 로더 |
| `utils/settings/types.ts` | 1148 | 모든 setting 타입 |
| `utils/settings/settings.ts` | 1015 | settings.json 읽기/쓰기, scope 머지 |
| `utils/settings/mdm/settings.ts` | 316 | MDM (Mobile Device Management) — 회사 정책 강제 |
| `utils/settings/validation.ts` | 265 | 스키마 검증 |
| `utils/settings/validationTips.ts` | 164 | 사용자 친화적 에러 |
| `utils/settings/managedPath.ts` | ? | 관리 경로 |
| `utils/settings/changeDetector.ts` | ? | 변경 감지 → ConfigChange hook |
| `utils/settings/applySettingsChange.ts` | ? | 변경 적용 |
| `utils/settings/permissionValidation.ts` | ? | permission rule 검증 |
| `utils/settings/pluginOnlyPolicy.ts` | ? | plugin-only 정책 |
| `utils/settings/internalWrites.ts` | ? | 내부 쓰기 |
| `utils/settings/settingsCache.ts` | 80 | 캐시 |
| `utils/settings/mdm/rawRead.ts` | 130 | MDM raw 읽기 |
| `utils/settings/mdm/constants.ts` | 81 | MDM 상수 |
| `utils/settings/allErrors.ts` | ? | 에러 집계 |
| `utils/settings/toolValidationConfig.ts` | 103 | 도구별 validation 설정 |

### 5+ Setting Source

```ts
PermissionRuleSource = 'userSettings' | 'projectSettings' | 'localSettings' | 'flagSettings' | 'policySettings' | 'cliArg' | 'command' | 'session'
```

claw 의 3 source vs 원본의 5+ source:
- `userSettings` — `~/.claude/settings.json` (claw 의 user)
- `projectSettings` — `.claude/settings.json` (commit, claw 의 project)
- `localSettings` — `.claude/settings.local.json` (gitignore) — **claw 누락**
- `flagSettings` — `--allow`/`--deny` CLI flag — **claw 누락**
- `policySettings` — MDM 강제 정책 (`/Library/Application Support/ClaudeCode/...` 등 OS-managed) — **claw 누락**
- `cliArg` — CLI 인자 직접
- `command` — 슬래시 명령 (`/permissions add`)
- `session` — 세션 중 변경

### 핵심 차이

1. **MDM (enterprise policy)** — 회사 IT 가 OS-level 로 강제하는 설정. 사용자가 변경 불가. 316 + 130 + 81 LOC. claw 에 없음.
2. **localSettings** — `.claude/settings.local.json` (gitignore) — 개인 머신별 override. claw 에 없음.
3. **변경 감지 + ConfigChange hook** — settings 파일 변경 시 hot reload + ConfigChange hook 발생. claw 는 시작 시 한 번 로드.
4. **Schema 검증** — 1148 LOC types + 265 LOC validation. 사용자 친화적 에러 (164 LOC validationTips).
5. **Settings cache** — 80 LOC 캐시. claw 는 매번 읽기.
6. **Plugin-only policy** — 특정 plugin 만 허용 강제. enterprise.
7. **Tool validation config** (103) — 도구별 input validation override.

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| 코드 규모 | config.rs 단일 | 6,379 LOC + types | 단순화 |
| Source 수 | 3 (system/user/project) | 5+ (user/project/local/flag/policy/cliArg/command/session) | 단순화 |
| MDM | 없음 | OS-managed enterprise policy (527 LOC) | 누락 |
| localSettings | 없음 | gitignore 머신별 override | 누락 |
| Hot reload | 없음 | changeDetector + ConfigChange hook | 누락 |
| Schema 검증 | basic | 1148 + 265 + 164 LOC | 단순화 |
| Cache | 없음 | settingsCache | 누락 |
| Plugin-only policy | 없음 | enterprise lockdown | 누락 |
| CLI flag override | partial | 명시 source 추적 | 다른 메커니즘 |

## 보강 제안

- "localSettings 누락" 명시 — 개인 머신별 override 가 빠지면 팀 협업 시 친구도 같은 settings 강제됨
- MDM 한 단락 — enterprise rollout 의 핵심
- Hot reload + ConfigChange hook cross-link to claw-hooks (28 events)

## 참조 파일

- `/home/heru/code/claude-analysis/src/utils/config.ts` (1817)
- `/home/heru/code/claude-analysis/src/utils/settings/settings.ts` (1015)
- `/home/heru/code/claude-analysis/src/utils/settings/types.ts` (1148)
- `/home/heru/code/claude-analysis/src/utils/settings/mdm/*.ts` (527)
- `/home/heru/code/claude-analysis/src/utils/settings/validation*.ts`
- `/home/heru/code/claude-analysis/src/types/permissions.ts` PermissionRuleSource
