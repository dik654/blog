# TalkingHeads 대화 정리 — 블로그 채워넣기용 소스 노트

두 번의 대화(체스 RL·JLens·Mamba·CUDA / Graphify·LLM Wiki·Skill 계층)를
블로그 구조에 맞게 주제별로 쪼개 놓은 원천 노트다.
codex가 진행 중인 작업(src/ 전반의 viz 전환, learning path, flashattention-io-triton 신규 집필)과
겹치지 않도록 이 디렉터리(리포 루트 drafts/)에만 둔다. **src/ 쪽은 여기서 직접 수정하지 않는다.**

## 겹침 판정 요약

| 노트 | 주제 | 판정 | 블로그 내 위치 |
|---|---|---|---|
| 01 | 체스 = RL 통제환경 | **신규 글 후보** | ai/articlesReinforcementLearning.ts (실행 계약 시리즈 앞단/사례) |
| 02 | JLens(명칭 검증 필요) 해석 도구 | **신규 글 후보** | ai/articlesLLM.ts 해석 계열 |
| 03 | Mamba·SSM·하이브리드 | **기존 글 보강** | articlesLLMArchitectures.ts 'Hybrid·Linear Attention: state 메모리부터 Qwen3.6까지' |
| 04 | GPU 커널 스택 (CUDA/Triton) | **보강만 — 신규 금지** | gpu/flashattention-io-triton — codex가 지금 집필 중 |
| 05 | HTML 테이블 grid 복원 | **기존 글 보강** | articlesOCR.ts 'HTML Table Parsing: rowspan·colspan에서 Grid Reconstruction까지' |
| 06 | 코드 지식그래프 (Graphify) | **신규 글 후보** | codebase-analysis 카테고리 (현재 얇음) |
| 07 | LLM Wiki·SSOT·거버넌스 | **신규 글 후보** | ai/articlesAgent.ts ('컨텍스트 엔지니어링' 옆) |
| 08 | AGENT.md/Skill/Playbook 계층 | **일부 겹침 — 보강+신규 반반** | articlesAgent.ts 'Skills 시스템 해부' 존재 |
| 09 | 한국어 프롬프트·잡조각 | 소재 조각 | 'Qwen 한국어 일관성' 글에 흡수 가능 |

## 각 노트 공통 구조

- **상태**: 신규 후보 / 기존 글 보강 / 소재 조각
- **원 대화 핵심**: 사실판정(✅❌⚠️) 포함 — 대화에 섞인 오해와 정정을 그대로 보존
- **글의 각도**: 블로그의 실행 계약·판독 스타일에 맞춘 훅
- **채우기 전 확인**: 집필 시점에 검증해야 할 항목

## 사용법

codex 세션에서 해당 트랙 작업할 때 이 노트를 열어 본문에 녹인 뒤,
반영이 끝난 노트는 파일 상단에 `status: merged (커밋 해시)` 를 적는다.
