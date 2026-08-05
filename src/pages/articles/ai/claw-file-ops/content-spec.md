# File operation and open-time boundary content spec

## Goal
- 독자가 typed file tool의 장점과 실제 workspace containment를 같은 것으로 착각하지 않게 한다.
- read, write, edit, search의 현재 계약을 실행 순서와 실패 모드로 재구성한다.
- lexical path, resolved path, open-time handle을 세 단계로 구분한다.
- 현재 Claw revision `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`과 권장 hardening을 명시적으로 분리한다.

## Target questions
- NUL probe를 통과한 파일이 왜 `read_to_string`에서 다시 실패할 수 있는가?
- `original_file`과 structured patch가 있어도 왜 current write는 rollback-safe 또는 atomic하지 않은가?
- dead-code workspace wrapper를 production에 연결하는 것만으로 TOCTOU가 끝나는가?
- search의 `head_limit`이 repository traversal 비용까지 줄이는가?

## Source anchors
| Area | File/function/type | Required claim |
|---|---|---|
| read | `file_ops.rs::read_file` | metadata size → binary probe → UTF-8 → line window |
| write | `write_file` | direct `fs::write`, original content is result metadata |
| edit | `edit_file` | read-match-replace-direct write, no version recheck |
| glob | `glob_search` | brace expansion, dedupe, mtime sort, cap 100 |
| grep | `grep_search`, `collect_search_files` | regex + WalkDir, UTF-8 skip, limit after collection |
| path | normalize helpers | existing target and missing leaf behavior |
| candidate boundary | `*_in_workspace` wrappers | dead-code, check then general I/O |
| production dispatch | vendored `tools_file_wiring.rs` / `tools/src/lib.rs` | permission check → adapter → general read/write/edit/search helpers; workspace wrappers absent |

## Narrative
1. permission, boundary, mutation contract를 먼저 분리한다.
2. `FileBoundaryLab`에서 current text contract, direct write, external symlink, swap race, target design을 비교한다.
3. read/write/edit의 실패 질문을 각각 encoding, atomicity, concurrency로 나눈다.
4. search를 다음 read 범위를 좁히는 도구로 설명한다.
5. canonicalize와 root comparison이 막는 것과 막지 못하는 것을 구분한다.
6. open-time kernel constraint와 verified handle reuse로 강한 목표 설계를 제시한다.

## Current versus recommended
| Topic | Current revision | Recommended hardening |
|---|---|---|
| write | target direct write | same-directory temp, permission preservation, rename, fsync policy |
| edit | optimistic read-match-write | content version recheck and conflict abort |
| boundary | unconnected canonical wrapper | mandatory entry point plus descriptor-relative open |
| search | full traversal then result limit | ignore policy, early stop, cancellation, skip evidence |
| encoding | UTF-8 only | explicit encoding policy and safe round trip |

## Viz contract
- “지금 성립”과 “아직 성립하지 않음”을 한 화면에서 함께 표시한다.
- current state와 target design을 status text로 분리한다.
- mobile에서 긴 path와 `openat2 RESOLVE_*`가 잘리지 않아야 한다.
- animation은 scenario 전환만 사용하고 layout shift를 만들지 않는다.
- 내부 horizontal scroll을 만들지 않는다.

## Adversarial checks
- binary probe 통과를 decoding 성공으로 설명하지 않는가?
- structured patch를 rollback이나 atomicity 장치라고 부르지 않는가?
- `Path::starts_with`를 raw string prefix라고 잘못 설명하지 않는가?
- dead-code wrapper가 production dispatcher에 연결됐다고 주장하지 않는가?
- canonicalize 후 일반 path I/O 재호출이 TOCTOU를 닫는다고 주장하지 않는가?
- glob/grep에 gitignore, blacklist, ripgrep, early stop이 있다고 발명하지 않는가?

## Stop rule
- Linux `openat2`와 Windows handle/reparse 정책은 production target pattern으로 설명한다.
- 현재 revision에 구현됐다고 쓰지 않으며, 플랫폼별 완전한 sandbox 구현은 범위 밖으로 둔다.
