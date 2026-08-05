# claw-bash vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 bash 도구를 **단일 모듈 + 6단계 검증** 으로 설명한다.

- `bash.rs` (283 LOC, PARITY 명시) 가 `execute_bash(input)` 단일 진입점
- `BashCommandInput { command, timeout, description, run_in_background, working_directory }` 5필드
- 6단계 순차 검증: empty → length(10KB) → banned_patterns(9개) → CommandIntent classify → working_dir(canonicalize) → resource_limits(30분 timeout, allow_background)
- `CommandIntent` 8 enum (Read/Write/Destructive/Network/Execute/Package/System/Unknown) — 첫 단어 basename 매칭, ~50개 명령어
- `analyze_rm()` 4단계 위험도 (Critical/High/Medium/Low)
- 출력 절단: stdout 8KB, stderr 4KB
- 백그라운드 실행: `.claw/bg-logs/{uuid}.log` 로 리다이렉션
- 샌드박스: `Sandbox::is_available()` 분기 — bubblewrap 가능하면 `wrap_command()`
- 인사이트: "Defense in depth — 정적 분석 + 샌드박스 두 층"

## 원본 Claude Code 실제 동작

원본 bash 는 **18개 submodule, 24,500 LOC** (claw 의 86배). PARITY 가 인용한 "18 submodule" 도 사실 보수적 카운트.

### `src/tools/BashTool/` 파일 (총 ~14,400 LOC)

| 파일 | LOC | 역할 |
|---|---|---|
| `BashTool.tsx` | 1143 | 메인 Tool 정의, lifecycle, streaming |
| `bashSecurity.ts` | 2592 | 정적 보안 분석 (deprecated 진행 중이지만 핵심) |
| `bashPermissions.ts` | 2621 | 권한 결정 — `isNormalizedGitCommand`, allowlist 매칭 |
| `readOnlyValidation.ts` | 1990 | read-only 모드 검증 — git/gh/ripgrep/pyright/docker 명령어 별 safe-flag 화이트리스트 |
| `pathValidation.ts` | 1303 | 경로 인자 추출 + 권한 체크 — `PATH_EXTRACTORS` 명령어별 |
| `sedValidation.ts` | 684 | sed 표현식 파싱 + write 검출 |
| `prompt.ts` | 369 | LLM 시스템 프롬프트 (bash 사용 가이드) |
| `sedEditParser.ts` | 322 | sed 편집 명령어 트리 파싱 |
| `bashCommandHelpers.ts` | 265 | 보조 유틸 |
| `utils.ts` | 223 | 공유 유틸 |
| `BashToolResultMessage.tsx` | 190 | 결과 렌더 컴포넌트 |
| `UI.tsx` | 184 | 인라인 UI |
| `shouldUseSandbox.ts` | 153 | 샌드박스 판단 — read-only 명령만 샌드박스, mutating 은 사용자 권한으로 |
| `commandSemantics.ts` | 140 | exit code 해석 — grep=1 (no match) 은 에러 아님, find/diff/test/[ 별 의미 |
| `modeValidation.ts` | 115 | acceptEdits 모드 자동 허용 명령어 (mkdir/touch/rm/rmdir/mv/cp/sed) |
| `destructiveCommandWarning.ts` | 102 | 16개 destructive 패턴 → 경고 텍스트 (정보용, 권한 결정과 분리) |
| `commentLabel.ts` | 13 | 코멘트 |
| `toolName.ts` | 2 | 이름 상수 |

### `src/utils/bash/` 파일 (총 ~10,100 LOC) — bash 파싱 전용 인프라

| 파일 | LOC | 역할 |
|---|---|---|
| `bashParser.ts` | 4436 | bash 문법 파서 (custom) |
| `ast.ts` | 2679 | bash AST 정의 |
| `commands.ts` | 1339 | `splitCommand`, `extractOutputRedirections` 등 |
| `heredoc.ts` | 733 | heredoc 파싱 |
| `ShellSnapshot.ts` | 582 | bash 셸 환경 스냅샷 (rcfile, history) |
| `treeSitterAnalysis.ts` | 506 | tree-sitter 기반 분석 (bashParser 의 보조) |
| `ParsedCommand.ts` | 318 | 파싱 결과 객체 |
| `shellQuote.ts` | 304 | shell quote 정확 처리 |
| `bashPipeCommand.ts` | 294 | 파이프 명령 분해 |
| `shellCompletion.ts` | 259 | 자동완성 |
| `parser.ts` | 230 | parser 진입 |
| `prefix.ts` | 204 | 명령어 prefix 매칭 |
| `shellQuoting.ts` | 128 | quoting 헬퍼 |
| `registry.ts` | 53 | 명령어 spec registry |
| `shellPrefix.ts` | 28 | prefix 상수 |
| `specs/` | 7 files | 명령어별 spec (alias, nohup, sleep, srun, time, timeout, pyright) |

### 차원이 다른 검증 메커니즘

1. **Tree-sitter + custom bash AST 파서** — claw 는 첫 단어 basename split, 원본은 4436 LOC custom parser + tree-sitter 로 명령어를 진짜 AST 로 파싱. 파이프, redirection, command substitution, heredoc, subshell 모두 구조적으로 인식.

2. **명령어별 safe-flag 화이트리스트** (`readOnlyValidation.ts` 1990 LOC) — `git`, `gh`, `ripgrep`, `pyright`, `docker`, `fd`, `xargs` 각각에 대해 어떤 플래그가 안전한지/위험한지 정의. 예시: `fd -x/--exec` 는 임의 명령 실행 가능 → exclude. `fd -l/--list-details` 는 내부에서 `ls` 서브프로세스 실행 → PATH hijacking 위험으로 exclude. claw 의 첫 단어 basename 매칭으로는 잡을 수 없는 깊이.

3. **PATH_EXTRACTORS** (`pathValidation.ts` 1303 LOC) — 명령어별로 어떤 인자가 경로인지 추출하는 규칙. `cp src dst`, `find <dir>`, `grep ... <files>` 같은 인자 위치별 의미를 알고 권한 체크.

4. **Sed write 검출** (`sedValidation.ts` 684 LOC + `sedEditParser.ts` 322 LOC) — `sed -i` 또는 `s/.../.../w file` 같은 변형 검출 위해 sed 표현식 자체를 파싱. claw 는 sed 별도 처리 없음.

5. **Destructive Command Warning** (`destructiveCommandWarning.ts` 102 LOC, 16 패턴) — 권한 결정과 분리된 **정보 표시용** 경고. claw 의 banned_patterns 는 즉시 거부지만, 원본은 "이 작업은 ~를 할 수 있습니다" 텍스트를 권한 다이얼로그에 추가만 함:
   - `git reset --hard` → "may discard uncommitted changes"
   - `git push --force` → "may overwrite remote history"
   - `git clean -f` (without `-n`) → "may permanently delete untracked files"
   - `git checkout .`, `git restore .` → discards working tree
   - `git stash drop/clear` → permanently remove stash
   - `git branch -D` → force delete
   - `git --no-verify` → skips safety hooks
   - `git commit --amend` → rewrites last commit
   - 3 패턴 of `rm -rf/-r/-f` 변형
   - SQL `DROP/TRUNCATE/DELETE FROM`
   - `kubectl delete`
   - `terraform destroy`

6. **CommandSemantic** (`commandSemantics.ts`) — exit code 의 의미를 명령어별로 다르게 해석. grep/rg=1 (no match), find=1 (some inaccessible), diff=1 (files differ), test/[=1 (false). claw 는 exit code 그대로 반환, 의미 해석 없음.

7. **Mode-aware permission**: `modeValidation.ts` — `acceptEdits` 모드에서 filesystem 명령(mkdir/touch/rm/rmdir/mv/cp/sed) 자동 허용. claw 는 이런 모드 게이트 미존재.

8. **Sandbox 정책 분기** (`shouldUseSandbox.ts`) — claw 는 "샌드박스 가능하면 wrap" 단순 분기지만, 원본은 read-only 명령만 샌드박스에서 실행. mutating 명령은 샌드박스 안에서 실행하면 디스크 변경이 안 보이므로 **사용자 권한으로 실행** 후 결과를 confirm. 정반대 정책.

9. **`ShellSnapshot`** (582 LOC) — 사용자의 실제 shell rcfile, history, env 를 스냅샷해서 claude 프로세스 안에서도 같은 환경 재현. claw 는 tokio::process 단순 spawn.

10. **Vulnerable UNC path 검사** (`containsVulnerableUncPath`) — Windows UNC 경로 (`\\server\share`) 권한 우회 차단.

## 주요 차이점

| 항목 | 블로그(claw) 서술 | 원본 실제 | 차이 종류 |
|---|---|---|---|
| 코드 규모 | bash.rs 283 LOC + Sandbox | tools/BashTool 14,400 LOC + utils/bash 10,100 LOC = 24,500 LOC | 단순화 (86배 차이) |
| 파싱 깊이 | 첫 단어 basename + 파이프 split | tree-sitter + 4436 LOC custom bash parser → AST 로 파이프/redirection/heredoc/subshell 구조 파악 | 다른 메커니즘 |
| 검증 단계 수 | 6단계 (empty/length/banned/intent/wd/limits) | 18+ submodule, 명령어별 화이트리스트 | 단순화 |
| Banned patterns | 9개 즉시 거부 | 별도 카테고리 — destructive 16 패턴은 "경고만" + 패턴 자체는 권한 다이얼로그에 텍스트 추가 (allow/deny 결정과 분리) | 다른 메커니즘 |
| Destructive 경고 | rm 4단계 (Critical/High/Medium/Low) | 16 패턴 (git reset --hard, git push -f, git clean -f, git checkout ., git stash drop, git branch -D, --no-verify, --amend, rm 3변형, SQL DROP/TRUNCATE/DELETE, kubectl delete, terraform destroy) | 누락 (대부분의 git 패턴, SQL, k8s, terraform) |
| 명령어별 safe-flag | 없음 (CommandIntent 단일 카테고리만) | git/gh/ripgrep/pyright/docker/fd/xargs 명령어 각각 safe-flag 화이트리스트 + dangerous flag 명시 (예: fd -x/-X 제외, fd -l 제외 with PATH hijacking 주석) | 누락 |
| sed 처리 | 없음 (Write 카테고리에 mv/cp/...만) | `sedValidation.ts` (684) + `sedEditParser.ts` (322) — sed -i, s///w 검출 | 누락 |
| Exit code 의미 | 그대로 반환 | grep/rg/find/diff/test/[ 명령어별 semantic — exit 1 이 에러인지 정상인지 다름 | 누락 |
| Mode-aware | 없음 | acceptEdits 모드에서 mkdir/touch/rm/rmdir/mv/cp/sed 자동 허용 | 누락 |
| Sandbox 정책 | "가능하면 wrap" 단일 정책 | read-only 만 샌드박스 / mutating 은 사용자 권한으로 (정반대) | 다른 메커니즘 |
| ShellSnapshot | 없음 | 사용자 rcfile/history/env 를 스냅샷해 spawn 환경 재현 (582 LOC) | 누락 |
| Heredoc 파싱 | 없음 | `heredoc.ts` 733 LOC 전용 파서 | 누락 |
| Path extractor | working_dir만 검증 | 명령어별 인자 위치 → 경로 추출 → 권한 체크 (1303 LOC) | 누락 |
| 출력 truncation | stdout 8KB / stderr 4KB | 더 큰 cap + 미리 페이징 + 별도 partial 표시 컴포넌트 (`BashToolResultMessage.tsx`) | 단순화 |
| 백그라운드 실행 | `.claw/bg-logs/{uuid}.log` 단순 spawn | streaming output, 사용자가 도중에 read 가능, killed-on-session-end 외 process group 관리 | 단순화 |
| Bash prompt UX | 정적 description 만 | 권한 다이얼로그에 destructive 경고 + auto-accept 학습 (이 패턴은 next time 자동 허용) | 누락 |

## 블로그 보강 제안

블로그가 PARITY.md 의 "18 vs 1 submodule" 을 살짝만 인용하고 있다면, 다음을 추가해 정확성과 깊이를 동시에 잡자.

1. **Overview 도입부 callout** — "claw-bash 는 의도적으로 단일 모듈 + 6단계 검증으로 단순화. 원본은 24,500 LOC, 명령어별 safe-flag 화이트리스트, tree-sitter AST 파싱, sed 표현식 파서, 명령어별 exit-code semantic 등 18+ submodule 로 구성" 한 단락. PARITY 의 "branch-only" 라인도 인용.

2. **ValidationPipeline.tsx 마지막에 "원본의 검증 깊이 비교" 표 신설** — 위 차이점 표에서 누락 카테고리만 추출해 짧게.

3. **CommandIntent.tsx 에 "한계 인정" 섹션 보강** — 블로그가 이미 "정적 분석 vs 샌드박스" 인사이트를 다루지만, "원본은 명령어별 화이트리스트 + AST 파싱으로 첫 단어 매칭 한계를 우회" 라는 구체 비교 한 단락.

4. **Destructive Warning 신설** — 블로그의 `analyze_rm()` 4단계는 좋은 출발점. 원본의 16 패턴 (특히 git 의 7 패턴: reset --hard, push -f, clean -f, checkout ., stash drop, branch -D, --no-verify, --amend) 을 한 표로 보여주면 "rm 만이 아니다" 라는 인사이트가 산다.

5. **CommandSemantic 섹션 신설** — "exit code 1 이 항상 에러일까?" 라는 질문으로 시작해 grep/find/diff/test 의 exit code 의미 비교. claw 는 단순 반환, 원본은 명령어별 semantic. 이건 LLM 컨텍스트에 들어가는 에러 메시지의 정확도를 좌우.

6. **Sandbox 정책 차이 callout** — 블로그가 "샌드박스 = 격리" 단순 표현. 원본은 "read-only 만 샌드박스 / mutating 은 사용자 권한 + confirm" 정반대 정책이라는 점이 흥미로운 설계 결정.

## 참조한 원본 파일

- `/home/heru/code/claude-analysis/src/tools/BashTool/BashTool.tsx` (1143 LOC, 메인)
- `/home/heru/code/claude-analysis/src/tools/BashTool/readOnlyValidation.ts` (1990, safe-flag 화이트리스트)
- `/home/heru/code/claude-analysis/src/tools/BashTool/destructiveCommandWarning.ts` (102, 16 패턴)
- `/home/heru/code/claude-analysis/src/tools/BashTool/modeValidation.ts` (115, acceptEdits 자동 허용)
- `/home/heru/code/claude-analysis/src/tools/BashTool/commandSemantics.ts` (140, exit code 의미)
- `/home/heru/code/claude-analysis/src/tools/BashTool/sedValidation.ts` (684) + `sedEditParser.ts` (322)
- `/home/heru/code/claude-analysis/src/tools/BashTool/pathValidation.ts` (1303)
- `/home/heru/code/claude-analysis/src/tools/BashTool/bashSecurity.ts` (2592)
- `/home/heru/code/claude-analysis/src/tools/BashTool/bashPermissions.ts` (2621)
- `/home/heru/code/claude-analysis/src/tools/BashTool/shouldUseSandbox.ts` (153)
- `/home/heru/code/claude-analysis/src/utils/bash/bashParser.ts` (4436) + `ast.ts` (2679) + `treeSitterAnalysis.ts` (506)
- `/home/heru/code/claude-analysis/src/utils/bash/heredoc.ts` (733)
- `/home/heru/code/claude-analysis/src/utils/bash/ShellSnapshot.ts` (582)
- `/home/heru/code/claw-code/PARITY.md` Lane 1 — "Bash deep validation remains branch-only"
