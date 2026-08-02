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
- SVG 텍스트 최소 9px
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
- KaTeX 수식은 바로 아래에 `FormulaNote` 또는 동등한 설명 블록을 붙임
- 수식 설명은 변수 뜻만 쓰지 말고 연산 이유까지 포함: 왜 `norm` 하는지, 왜 `||.||`로 나누는지, 왜 `cos`/softmax/log/argmax를 쓰는지
- 예: `z_i = norm(f_theta(g_v(x_i)))` 아래에는 "왜 norm: 길이 편향 제거, 방향 유사도 비교"를, `cos(z_q,z_i)` 아래에는 "왜 나눔: 벡터 길이 효과 제거"를 명시
- 원인-결과는 한 줄로 합침
- 비교는 대구 형태

## 배포 아키텍처

### 라우팅 체인 (외부 요청이 블로그까지 도달하는 경로)

```
브라우저 https://heru.ragdoll-bigeye.ts.net/lab/blog/ethereum/helios-bootstrap
   │
   ▼ :443 (Tailscale Funnel)
Caddy (context-manager/caddy/Caddyfile)
   │   — /blog/*, /core/* 는 canonical /lab/blog 또는 /lab/core 로 308 redirect
   │   — /lab, /lab/* 는 blog Bun serve(:14010) 로 직접 reverse_proxy
   ▼
Bun serve.ts :14010 (이 레포의 serve.ts)
   │   — /lab 접두 제거 후 dist/ 에서 매핑,
   │     확장자 없는 경로는 SPA fallback(index.html)
   ▼
dist/index.html + /lab/assets/*.js
```

### VITE_BASE_PATH 는 필수

실제 asset 서빙 경로가 `/lab/*` 라 Vite 의 `base` 설정도 `/lab/` 여야 한다.
그래야 생성되는 `index.html` 이 `<script src="/lab/assets/index-XXX.js">` 처럼
절대경로로 올바르게 참조한다.

- `vite.config.ts` 의 기본값은 `process.env.VITE_BASE_PATH || '/'` — 환경변수 안 주면 `/` 로 빌드되어
  asset 경로가 `/assets/...` 로 생성됨. 브라우저가 `https://host/assets/...` 를 요청하면
  Next.js 가 받아서 307 리다이렉트 → JS 로딩 실패 → **빈 화면**.
- `package.json` 의 `build` 는 `VITE_BASE_PATH=/lab/ vite build` 로 고정해둠. 직접 `vite build`
  호출 시에도 같은 env 주입 필수.

### 재배포 절차

```bash
cd /home/heru/code/blog
bun run build                                  # /lab/ asset base 기준으로 dist/ 생성
systemctl --user restart cm-blog.service       # dist/ 를 읽는 Bun serve.ts 재기동 (:14010)
systemctl --user status cm-blog.service --no-pager
```

`cm-blog.service` 는 이 레포의 `serve.ts` 를 `BLOG_PORT=14010` 으로 실행하는 user systemd unit 이다.
서비스가 없거나 inactive 라면 재시작만으로 배포가 끝난 것이 아니므로, 먼저 어떤 프로세스가
`:14010` 을 서빙하는지 확인한다.

```bash
curl -I https://heru.ragdoll-bigeye.ts.net/lab/blog
curl -s https://heru.ragdoll-bigeye.ts.net/lab/blog | rg -o '/lab/assets/[^" ]+' | head
curl -I https://heru.ragdoll-bigeye.ts.net/lab/assets/<index-js-from-html>
curl -I https://heru.ragdoll-bigeye.ts.net/blog/
```

최종 완료 기준은 `systemctl` 성공만이 아니라 `/lab/blog` HTML 200 과 HTML 이 참조하는
`/lab/assets/*` JS/CSS 200, legacy `/blog/` 의 308 canonical redirect 가 함께 확인되는 것.
브라우저에서 강력 새로고침(Ctrl+Shift+R) — Cloudflare-style 캐시는 없지만 module preload 는 캐시됨.

빌드 전 타입체크 원하면 `bun run build:tsc` (전체 tsc -b 후 vite). 현재 일부 아티클에
pre-existing TS 에러가 있어 기본 `build` 는 vite-only.

### 편집 시스템 API 라우팅

방문자가 `<Editable>` 단락을 클릭해 제출하는 경로:

```
블로그 JS 의 fetch("/api/blog-edits/submit")
   │
   ▼ https://host/api/blog-edits/submit
Caddy — /api/auth|admin|agents|... 명시 handle 에 안 걸림 → /api/* catch-all
   │
   ▼ reverse_proxy :18002
context-manager Agent (agent/src/api/routes/blog-edits.ts)
   │   — public 엔드포인트 (register · overrides · submit) 는 인증 없음
   ▼ PostgreSQL blog_* 테이블
```

관리자 인박스 (`/admin/blog-inbox`) 는 Next.js 앱 자체에 있고, Next.js 가 세션 검증 후
`web-ui/src/app/api/admin/blog-edits/[...rest]/route.ts` catch-all 에서 agentFetch 로 릴레이.

상세: `context-manager/knowledge/lessons/blog-editor/2026-04-23-prompt-injection-layered-defense.md`,
`context-manager/knowledge/lessons/deploy/2026-04-23-subpath-vite-rewrite.md`

### 흔한 함정

- **vite dev 는 VITE_BASE_PATH 없이도 작동** — 루트에서 서빙하니까. 하지만 dev 에서 편집 시스템
  테스트하려면 `/api/blog-edits/*` 가 agent 에 닿아야 하는데, `vite.config.ts` 의 `server.proxy`
  가 `BLOG_EDIT_API_TARGET` (기본 :18002) 으로 포워드.
- **serve.ts 가 /lab, legacy /blog 접두 처리** — 그래서 dist 내부는 `/`
  기준이지만 외부 canonical 경로는 `/lab/*`.
- **Caddy 는 현재 blog SPA 도 직접 프록시** — `/blog/*` 는 `/lab/blog/*`, `/core/*` 는
  `/lab/core/*` 로 redirect 하고, `/lab` 및 `/lab/*` 는 Bun serve `:14010` 으로 직접 보낸다.
  Next.js rewrites 에도 blog fallback 이 남아 있지만 현재 공개 경로의 주 경계는 Caddy → Bun serve 다.

## 메모리 파일 위치
상세 규칙은 `~/.claude/projects/-Users-dylan-code-blog/memory/` 에 저장됨.
다른 컴퓨터에서는 이 디렉토리가 없을 수 있으므로, 이 CLAUDE.md의 규칙을 우선 따른다.
