# 07 · LLM Wiki — SSOT 경계와 거버넌스

- **상태**: 신규 글 후보 (블로그 최중량급 후보 — 대화 분량 최대)
- **위치**: ai/articlesAgent.ts — "컨텍스트 엔지니어링: 다음 Agent Turn의 증거 Packet" 옆. 에이전트 트랙의 지속 메모리 편.

## 원 대화 핵심

### 정의와 위상
- LLM Wiki = 사람용 위키가 아니라 **에이전트가 장기 작업을 이어가기 위해 참조하는 프로젝트 지식 저장소**. 저장 대상: 구조, 설계 결정, 작업 기록, 장애 해결, 도메인 개념, 반복 절차, 과거 실패.
- 효용: 세션 초기화 후 복구, 반복 grep/find 감소, 토큰 절감, 배경 반복 설명 감소.
- RAG와의 관계: 구현은 대개 RAG(인덱싱→검색→context 삽입)지만, 목적이 "에이전트 작업 기록과 프로젝트 상태의 누적"이라는 점이 다름 = **에이전트용으로 관리되는 RAG 지식베이스**.
- 가장 정확한 요약: **"하네스가 검색해서 에이전트에게 context로 제공하는 프로젝트 지식 저장소"** — 그 자체로 특별한 AI가 아님. 구성요소: 저장소/인덱서/검색기/re-ranker/context builder/버전 관리/하네스.
- memory.md는 이것의 축소판 — LLM Wiki는 그걸 구조화·검색 가능하게 확장한 형태. Obsidian 대비: 사람 중심 vs 에이전트 실행 context 중심.

### SSOT 경계 (글의 척추)
- LLM Wiki ≠ SSOT. 코드·DB 스키마·OpenAPI·배포 설정·정책 파일이 원본 SSOT이고, Wiki는 **파생 지식**. Wiki를 SSOT로 삼으면 코드-문서 괴리 위험.
- 원본 소스를 수정하지 않는 원칙(sidecar knowledge base): 원본 read-only + 별도 지식 계층 → 코드 오염 방지, 도구 제거 용이, 원본/AI 생성 지식 구분.

### 검색 구조
- BM25 로컬 검색: 문서 → BM25 인덱싱 → 후보 20~100개 → LLM re-ranking → 상위만 context 삽입. 코드명·함수명·에러 메시지엔 lexical이 강함, 벡터 DB 없이 가능.
- 주의: re-ranking 비용, 작은 모델의 관련도 오판, **정답 평가셋으로 recall/precision 측정 필요**.

### Blob 저장
- Markdown 파일 대신 blob(content-addressable, 해시 식별, 메타데이터·관계 분리) — Git 객체 모델(blob/tree/commit/ref) 참고. 얻는 것: 불변성, 중복 제거, 버전 diff, 특정 시점 context 복원. ⚠️ "Git을 수정했다"가 아니라 "Git의 객체 저장 방식을 참고한 별도 시스템"이 정확한 표현.

### 거버넌스 (차별화 지점)
- Wiki가 무거워지는 이유: 중복·낡은 정보·충돌·엔티티 과잉·검색 노이즈 → **저장보다 정리 정책이 중요**. 생성 시 중복 검사→출처 연결→유효기간→소유자→archive.
- Wikipedia에서 빌릴 구조: notability(출처 없는 주장 구분), redirect/disambiguation(중복·동음이의 통합), revision history, talk page(충돌 논의), category, template.
- 관점 분리: 서버/프론트/디자인/운영/도메인 관점이 한 Wiki에 섞이면 AI가 서로 다른 전제를 혼합 → 디렉터리(/wiki/backend …) 또는 메타데이터(domain/role/project/environment)로 분리, 검색 시 현재 역할에 맞는 것만 우선.
- Schema 기반 rule scaffolding: 자유 Markdown만 쌓으면 붕괴 → type/domain/trigger/steps/validation 스키마로 기록 형식 제한.
- 시각화의 진짜 용도: LLM을 위해서가 아니라 **사람의 검수·관리**(AI가 제대로 기록했나, 관계 수정, 충돌 확인, playbook 편집).

## 글의 각도

훅: **"Wiki는 자동 누적 시스템이 아니라 지속 정제되는 지식 시스템"** — 다들 저장부터 만들고 정리 정책에서 무너진다. SSOT/파생 경계 + Wikipedia 거버넌스 차용 + 평가셋 기반 검색 측정, 세 개가 기둥.
주의: OKF/OJS 내부 설계는 블로그에 안 씀(기존 원칙) — 일반론 + 공개 도구 기준으로.

## 채우기 전 확인

- SwarmVault(대화 언급 제품) 실존·명칭 확인.
- BM25+LLM rerank 대비 cross-encoder rerank 비용 비교 수치 확보하면 좋음.
