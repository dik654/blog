# claw-plugin vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 plugin 을 **PluginKind 3종 + plugin-manifest.json + 서브프로세스 격리** 로 설명한다.

- 3 PluginKind: ToolProvider / HookProvider / ContextProvider
- Manifest: name/version/kind/entrypoint + tools/hooks/context_hints
- 서브프로세스 격리, settings.json 의 trusted_plugins 등록
- Lifecycle: install/enable/disable/uninstall (PARITY 인용)

## 원본 Claude Code 실제 동작

원본 plugin 은 **44 모듈, 22,227 LOC** — marketplace + zip cache + signature verification + autoupdate + blocklist + flagging + telemetry + dependency resolution + MCP/LSP plugin integration + markdown walking + multi-source 등 enterprise-grade.

### 핵심 모듈

| 파일 | LOC | 역할 |
|---|---|---|
| `utils/plugins/schemas.ts` | 1681 | plugin 스키마 (manifest + capabilities) |
| `services/plugins/pluginOperations.ts` | 1088 | install/enable/disable/uninstall 로직 |
| `utils/plugins/validatePlugin.ts` | 903 | plugin 검증 — 서명, 권한, dependency |
| `utils/plugins/zipCache.ts` | 406 | zip 다운로드 + 캐시 |
| `services/plugins/pluginCliCommands.ts` | 344 | `/plugin` 슬래시 + `claude plugin ...` CLI |
| `services/plugins/PluginInstallationManager.ts` | 184 | 설치 매니저 |
| `plugins/builtinPlugins.ts` | 159 | 내장 plugin 목록 |
| `utils/plugins/zipCacheAdapters.ts` | 164 | adapter |
| `utils/plugins/walkPluginMarkdown.ts` | 69 | plugin 의 markdown skill 파싱 |

추가 30+ 모듈:
- `marketplaceManager.ts`, `marketplaceHelpers.ts`, `officialMarketplace.ts`, `officialMarketplaceGcs.ts`, `officialMarketplaceStartupCheck.ts`, `parseMarketplaceInput.ts` — Anthropic 공식 marketplace + 사용자 marketplace
- `loadPluginAgents.ts`, `loadPluginCommands.ts`, `loadPluginHooks.ts`, `loadPluginOutputStyles.ts` — plugin 에서 4 종 entity 로드 (claw 의 3종보다 많음, output styles 추가)
- `lspPluginIntegration.ts`, `lspRecommendation.ts` — LSP 자동 추천
- `mcpbHandler.ts`, `mcpPluginIntegration.ts` — MCP server 를 plugin 으로 묶는 `.mcpb` bundle
- `pluginAutoupdate.ts`, `pluginVersioning.ts` — 자동 업데이트, semver
- `pluginBlocklist.ts`, `pluginFlagging.ts` — 악성 plugin 차단/플래그
- `pluginPolicy.ts`, `managedPlugins.ts` — enterprise 관리
- `dependencyResolver.ts` — plugin 간 의존성
- `installCounts.ts`, `fetchTelemetry.ts` — 사용 통계
- `pluginStartupCheck.ts`, `performStartupChecks.tsx`, `officialMarketplaceStartupCheck.ts` — 시작 시 검증
- `headlessPluginInstall.ts` — CI/scripted install
- `reconciler.ts`, `refresh.ts` — 상태 동기화
- `installedPluginsManager.ts`, `pluginLoader.ts` — 로드
- `cacheUtils.ts`, `pluginOptionsStorage.ts` — 옵션 저장
- `pluginDirectories.ts`, `pluginIdentifier.ts` — 경로/식별
- `addDirPluginSettings.ts` — 디렉토리 추가 후 plugin 적용
- `pluginInstallationHelpers.ts`, `hintRecommendation.ts`, `gitAvailability.ts`, `orphanedPluginFilter.ts`

### 핵심 차이

1. **Marketplace** — Anthropic 공식 marketplace + GCS 호스팅 + startup check + 사용자 marketplace 추가 가능. claw 는 settings.json 직접 등록만.

2. **Zip cache** (406 LOC) — plugin 을 zip 으로 배포, 다운로드 후 캐시. claw 는 로컬 디렉토리 직접.

3. **Signature / 검증** (`validatePlugin.ts` 903) — plugin 서명 확인, 권한 체크, dependency 검증.

4. **Blocklist / flagging** — Anthropic 가 악성 plugin 차단 가능. 사용자 reporting flag.

5. **Auto-update + version** — semver 기반 자동 업데이트.

6. **Plugin → MCP bundle** (`.mcpb`) — plugin 이 MCP 서버를 묶어서 배포. MCP 글 cross-link.

7. **Plugin → LSP integration** — plugin 이 LSP 서버 추천/통합.

8. **4 entity 로드** — agents / commands / hooks / output styles (claw 의 tools/hooks/context 와 다름).

9. **Plugin policy** — enterprise 가 특정 plugin 만 허용 강제.

10. **Telemetry** — install count, 사용 통계 — Anthropic 에 보고.

11. **Markdown skill parsing** — plugin 의 markdown 파일을 skill 로 자동 등록.

12. **Headless install** — CI 환경에서 prompt 없이 install.

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| 코드 규모 | plugins crate ~수천 | 22,227 LOC, 44 모듈 | 단순화 |
| Marketplace | 없음 | 공식 + 사용자 marketplace | 누락 |
| Zip 배포 | 로컬 dir | zip + 캐시 + 서명 | 누락 |
| 서명/검증 | basic | 903 LOC | 누락 |
| Blocklist/flagging | 없음 | Anthropic 차단 + 사용자 flag | 누락 |
| Auto-update | 없음 | semver autoupdate | 누락 |
| MCP bundle (.mcpb) | 없음 | plugin 안에 MCP 서버 묶기 | 누락 |
| LSP integration | 없음 | plugin → LSP 추천 | 누락 |
| Entity 종류 | tool/hook/context | agents/commands/hooks/output-styles | 다른 분류 |
| Enterprise policy | 없음 | pluginPolicy + managedPlugins | 누락 |
| Telemetry | 없음 | install counts + Anthropic 보고 | 누락 |
| Markdown skill parsing | 없음 | walkPluginMarkdown | 누락 |
| Headless install | 없음 | CI 친화 | 누락 |
| Dependency resolution | 없음 | plugin 간 의존 | 누락 |

## 보강 제안

- "claw plugin 은 PluginKind 3종 + 직접 등록. 원본은 Anthropic marketplace + zip + 서명 + autoupdate + MCP/LSP integration + enterprise policy 22K LOC" Overview callout
- Plugin × MCP cross-link to claw-mcp (.mcpb bundle)
- Plugin entity 분류 차이: claw 의 tool/hook/context vs 원본의 agents/commands/hooks/output-styles

## 참조 파일

- `/home/heru/code/claude-analysis/src/utils/plugins/schemas.ts` (1681)
- `/home/heru/code/claude-analysis/src/services/plugins/pluginOperations.ts` (1088)
- `/home/heru/code/claude-analysis/src/utils/plugins/validatePlugin.ts` (903)
- `/home/heru/code/claude-analysis/src/utils/plugins/zipCache.ts` (406)
- `/home/heru/code/claude-analysis/src/utils/plugins/marketplace*.ts`, `officialMarketplace*.ts`
- `/home/heru/code/claude-analysis/src/utils/plugins/mcpbHandler.ts`, `mcpPluginIntegration.ts`
- `/home/heru/code/claude-analysis/src/services/plugins/pluginCliCommands.ts` (344)
