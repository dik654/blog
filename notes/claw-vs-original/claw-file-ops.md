# claw-file-ops vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 file ops 를 **`file_ops.rs` (744 LOC) 단일 모듈 + ReadWrite/Boundary/Search** 로 설명한다.

- 6 도구: read_file, write_file, edit_file, glob_search, grep_search (+ NotebookEdit)
- Lane 3 추가: MAX_READ_SIZE, MAX_WRITE_SIZE, NUL-byte binary 검출, canonical workspace boundary
- offset/limit 부분 읽기
- ripgrep wrapper (grep_search)

## 원본 Claude Code 실제 동작

원본은 **5+ 별도 도구 디렉토리, 4,194 LOC** + image processing + diff UI + sed 통합.

### 모듈 (~4,200 LOC)

| 도구 | LOC | 역할 |
|---|---|---|
| FileReadTool | 1418 (1183 main + 184 UI + image/limits/prompt) | 텍스트/이미지/PDF/notebook 읽기 + offset/limit + line numbering |
| FileEditTool | 1812 (625 main + 775 utils + 288 UI + types/prompt) | replace_all, multi-edit, dry-run, diff preview |
| FileWriteTool | 856 (434 main + 404 UI + prompt) | atomic write, backup, encoding 감지 |
| GlobTool | 205 (198 + prompt) | glob 검색 |
| GrepTool | 595 (577 + prompt) | ripgrep wrapper + result chunking |
| NotebookEditTool | ? | Jupyter notebook 편집 (cell-level) |

### 핵심 차이

1. **이미지·PDF 읽기** — `imageProcessor.ts` (94 LOC) — read_file 이 이미지 (PNG/JPG) 와 PDF 읽기. base64 + 다운샘플링. claw 의 read_file 은 텍스트만 (PARITY 보면 binary 검출만 추가).

2. **Notebook (jupyter) cell-level edit** — claw 도 NotebookEdit 도구는 있지만 실제 cell 파싱·실행 결과 보존 깊이는 원본이 깊음.

3. **FileEditTool 의 1812 LOC** — claw 의 edit_file 은 단순 replace. 원본:
   - `replace_all: true/false` flag
   - Multi-edit (한 번에 여러 edit)
   - **Dry-run preview** + diff UI (288 LOC)
   - String not found → AI-friendly error message ("did you mean...")
   - Tab/space 자동 감지 + indent 보정
   - CRLF/LF 자동 처리
   - Encoding 감지 (UTF-8/Latin-1/UTF-16)
   - utils.ts 775 LOC — 매칭 알고리즘, normalization

4. **FileWriteTool atomic write** — temp file + rename. 권한 보존. backup. claw 는 직접 쓰기.

5. **GrepTool 577 LOC** — ripgrep 호출 + JSON 출력 파싱 + chunk 단위 결과 (대용량 검색 결과 페이징). claw 는 단순 wrapper.

6. **Diff UI** (`FileEditTool/UI.tsx` 288, `FileWriteTool/UI.tsx` 404) — 변경 사항 시각화 + 사용자 confirm. claw 는 stdout 텍스트.

7. **`limits.ts`** — read 별 동적 limit (binary file 별, image 별 다른 cap).

8. **prompt.ts per tool** — 도구별 LLM 프롬프트. 사용 가이드라인 (예: "use absolute path, prefer Read over Bash cat").

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| 코드 규모 | file_ops.rs 744 | 4,194 LOC across 5+ 도구 | 단순화 |
| 이미지/PDF 읽기 | 없음 (binary 검출만) | imageProcessor.ts + PDF 지원 | 누락 |
| Notebook cell edit | 도구만 | 풀 cell 파싱 + 실행 결과 보존 | 단순화 |
| Edit replace_all | basic | replace_all flag, multi-edit | 단순화 |
| Edit dry-run + diff UI | 없음 | 288 LOC diff UI | 누락 |
| Edit "did you mean" | 없음 | AI-friendly error | 누락 |
| Encoding 자동 감지 | 없음 | UTF-8/Latin-1/UTF-16 | 누락 |
| Atomic write | 직접 쓰기 | temp + rename + backup | 단순화 |
| Grep chunking | basic | JSON 파싱 + 페이징 | 단순화 |
| Per-tool prompt | 일반 | 도구별 LLM 가이드라인 | 누락 |
| Workspace boundary | Lane 3 추가 (canonicalize) | filesystem.ts 1777 LOC + multi-dir | 단순화 |

## 보강 제안

- "claw Lane 3 (binary/size/symlink) 는 좋은 출발점. 원본의 image/PDF 읽기, encoding 감지, dry-run diff, atomic write 보강 가능" 한 단락
- FileEditTool 의 utils 775 LOC matching algorithm — claw 의 단순 string replace 와 깊이 비교

## 참조 파일

- `/home/heru/code/claude-analysis/src/tools/FileReadTool/FileReadTool.ts` (1183) + `imageProcessor.ts` (94) + `limits.ts` (92)
- `/home/heru/code/claude-analysis/src/tools/FileEditTool/FileEditTool.ts` (625) + `utils.ts` (775) + `UI.tsx` (288)
- `/home/heru/code/claude-analysis/src/tools/FileWriteTool/FileWriteTool.ts` (434) + `UI.tsx` (404)
- `/home/heru/code/claude-analysis/src/tools/GrepTool/GrepTool.ts` (577)
- `/home/heru/code/claude-analysis/src/tools/GlobTool/GlobTool.ts` (198)
- `/home/heru/code/claw-code/PARITY.md` Lane 3
