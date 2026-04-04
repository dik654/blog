# Blog Project — Claude Code 가이드

## 프로젝트 개요
블록체인·AI·암호학·P2P·HW/GPU·TEE 기술 심층 분석 블로그.
각 아티클은 코드베이스를 scratch부터 추적하여 시각화(Viz)로 설명하는 형태.

## 기술 스택
- Vite + React + TypeScript + Tailwind v4 + shadcn/ui
- framer-motion (애니메이션), mafs (수학), recharts (차트)
- Cloudflare Pages 배포 (SPA)

## 아티클 구조
```
src/pages/articles/{카테고리}/{글slug}.tsx          ← 조립 파일 (100줄 이하)
src/pages/articles/{카테고리}/{글slug}/Overview.tsx  ← 섹션 (150-300줄)
src/pages/articles/{카테고리}/{글slug}/viz/          ← StepViz 컴포넌트
src/pages/articles/{카테고리}/{글slug}/codebase/     ← 분석 대상 소스 코드
src/pages/articles/{카테고리}/{글slug}/codeRefs.ts   ← CodeSidebar 참조
src/content/{카테고리}/index.ts                     ← 카테고리 정의 + 글 목록
```

## 아티클 작성 4단계 워크플로우 (반드시 준수)

### 0단계: 범위 설계 (작성 전 필수)
- 해당 주제의 **전체 범위** 파악 — 모듈, 핵심 함수, 관련 개념 전수 조사
- "다뤄야 할 것" 목록을 테이블로 작성
- 범위가 좁지 않은지 검증 — 일부만 깊게 파는 것이 아니라 전체를 커버
- **참조 성격 아티클도 예외 없이** 전체 분석 깊이 대상

### 1단계: 깊은 텍스트 작성 (직접 작성)
- 각 섹션의 **코드 블록 + 변수 의미 + 인사이트** 직접 작성
- codebase 소스를 먼저 확인/확장한 뒤 본문에 반영
- 각 코드 블록: 함수 시그니처, 매개변수 의미, 예시 값, "왜 이렇게" 설명
- 인사이트 callout: 💡 설계 판단, 비교 대상, 보안 근거
- 목표: 150~200줄 (이것이 Viz의 "spec" 역할)

### 2단계: Viz 전환 (에이전트 위임)
- 깊은 텍스트 기반으로 에이전트에게 VizData.ts + Viz.tsx + VizSteps.tsx + VizSteps2.tsx 생성 위임
- 에이전트에게 "Viz-first로 작성해"가 아니라 "이 텍스트를 Viz로 전환해"로 지시
- 완료 후 섹션 TSX에 `<Viz />` 인라인 삽입

### 3단계: 범위 재점검 + 보강
- "현재 범위 vs 전체 범위" 테이블 재작성
- 빠진 부분 새 섹션 추가 (1단계→2단계 반복)

## 현재 진행 상황

### 완료: Helios (경량 클라이언트) — 8개 아티클
| 아티클 | 섹션 | 상태 |
|---|---|---|
| helios-bootstrap | Overview + FetchCheckpoint + BootstrapViz | 깊은 텍스트 + Viz 완료 |
| helios-consensus | Overview + VerifyTrace + CommitteeLifecycle + SyncLoop | 깊은 텍스트 + Viz 완료 |
| helios-update | Overview + UpdateTrace + ForkChoice | 깊은 텍스트 + Viz 완료 |
| helios-state | Overview + ProofTrace + MptTraversal + ProofDB | 깊은 텍스트 + Viz 완료 |
| helios-execution | Overview + ExecutionTrace + RpcMethods | 깊은 텍스트 + Viz 완료 |
| helios-types | Overview + CoreTypes + Encoding + SszInternal | 깊은 텍스트 + Viz 완료 |
| helios-config | Overview + NetworkConfig + ClientInit + Persistence | 깊은 텍스트 + Viz 완료 |
| helios (개요) | Overview만 | 개요 수준 |

### 다음 작업 (이 순서대로 진행)
1. **Reth (EL)** — 22개 아티클. 구조(viz+codebase+codeRefs)는 있지만 prose가 20-40줄로 얕음. 150-200줄로 보강 필요. reth-pipeline부터 시작.
2. **Prysm (CL)** — 16개 아티클. Reth와 동일한 패턴으로 보강 필요.
3. **CometBFT** — 9개 아티클. 6개가 medium 수준, 깊은 텍스트 보강.
4. **BFT Consensus** — 17개 아티클.
5. **Filecoin** — ~20개 아티클.
6. **GPU/HW** — ~15개 아티클. **전부 shallow, Viz 없음** — 가장 많은 작업 필요.
7. **AI** — ~40개 아티클. 혼재.
8. **TEE** — ~15개 아티클. moderate 위주.
9. **Crypto/ZK** — ~30개 아티클. 혼재.
10. **P2P** — ~15개 아티클. 혼재.

## Viz 필수 규칙
- 텍스트 나열 금지 → 전부 인터랙티브 StepViz 애니메이션
- 색상: hex only (NO hsl())
- motion SVG: initial={{}} + animate={{}} 분리 (배열 금지)
- SVG 텍스트 최소 7px
- viewBox="0 0 480 200" 기본
- 5가지 박스: ModuleBox(상단바) / DataBox(필) / ActionBox(좌측바) / StatusBox(프로그레스) / AlertBox(점선)
- import from `@/components/viz/boxes`

## 코드 규칙
- codebase 소스에 "본문 대응:" 주석 필수
- codeRefs annotation에 "왜"를 포함
- 변수/필드마다 인라인 주석 필수 (약어 풀이)
- 코드를 본문에 직접 나열하지 않고 CodeSidebar "소스 보기"로 이동

## 글 작성 스타일
- 짧은 문장, -이다/-입니다 최대한 제거
- 줄바꿈은 `\n`으로 처리
- 전문 용어 첫 등장 시 반드시 설명
- 원인-결과는 한 줄로 합침
- 비교는 대구 형태

## 메모리 파일 위치
상세 규칙은 `~/.claude/projects/-Users-dylan-code-blog/memory/` 에 저장됨.
다른 컴퓨터에서는 이 디렉토리가 없을 수 있으므로, 이 CLAUDE.md의 규칙을 우선 따른다.
