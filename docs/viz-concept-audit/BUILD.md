# 개념 Viz 보강 작업 규칙 (fork 공통, 2026-10-15)

대상: `batch-1..4.md`의 P1·P2 글. 글마다 **1순위 설계안 Viz 하나**를 만든다(“+ 2순위”는 시간이 남고 핵심일 때만).

## 만들 것
- 기준 구현: `src/pages/articles/ai/prefill-decode-phase-dynamics/viz/LayerPassViz.tsx`, `LayerLoopProcessViz.tsx`를 먼저 읽고 같은 골격을 쓴다: `VizFrame` + `useAnimatedScenes` + `AnimatedSceneControls`, `data-viz-canvas`·`tabIndex`·`onKeyDown`, HTML 레이아웃 우선, 필요하면 `framer-motion`으로 장면 안 움직임(층을 따라 올라가는 띠, 칸이 차는 순서, 읽는 칸 깜빡임 등). reduced motion이면 delay 0.
- 실제 구조(칸·행렬·큐·블록·경로)를 그리고 장면마다 상태가 바뀌며, 화면 숫자를 독자가 셀 수 있어야 한다. 숫자 장부·카드 나열은 실패.
- 숫자는 **그 글 본문의 running example 그대로**. 감사 설계안의 숫자도 본문과 다시 대조한다. 본문에 없는 값(예: mrope section 비율)은 1차 자료(config·코드)를 직접 열어 확인하거나, 확인 못 하면 그 요소를 빼고 그린다.
- 색은 hex, 선 1px(강조 1.25px 이하), gradient·glow·shadow 금지, radius 작게. 설명문 p에는 모바일 min-h를 줘서 장면 전환 때 frame/control이 움직이지 않게 한다(`min-h-[9rem] min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]` 패턴, 내용에 맞춰 조정).
- 파일: `src/pages/articles/ai/<slug>/viz/<VizName>.tsx`. 글이 import하지 않는 기존 Viz가 감사에 언급됐다면(expert-parallelism, launch-overhead, flash-attention) 새로 쓰기 전에 그 파일을 본문 숫자에 맞게 고쳐 쓰는 편을 먼저 검토한다.

## 넣는 법
- 감사가 지정한 절(section id) 안에, 그 절의 설명 흐름에 맞는 자리에 넣는다. 새 번호 절(h2)을 만들지 않는다. 필요하면 앞뒤에 1~2문장 연결 산문(합니다체)을 붙이되 연결어미 뒤 쉼표(“-고,” “-므로,”)는 쓰지 않는다.
- 본문 사실·숫자는 바꾸지 않는다. Viz가 본문과 어긋나는 사실 오류를 발견하면 고치지 말고 보고에 적는다.

## 검증 (모두 통과해야 완료)
1. `npx eslint <바꾼 파일>` 0건, `npm run -s audit:viz -- <새 Viz 파일>` 통과.
2. `bash scripts/check-article.sh ai/<slug>` 통과(다른 fork 때문에 나는 전역 실패는 구분해 보고).
3. 브라우저(dev server http://localhost:5199): `node /private/tmp/claude-501/-Users-dylan/30cfb2d2-6efa-4ea2-84d1-1d98786c3d96/scratchpad/ai_vizall.mjs <slug> <outdir>` 로 1440·390 모든 장면 frameΔ·ctrlΔ = 0, page error 0, overflow 0. 1440×900에서 새 figure의 canvas가 넘치지 않는지(`/private/tmp/claude-501/-Users-dylan/30cfb2d2-6efa-4ea2-84d1-1d98786c3d96/scratchpad/overflow.mjs`를 slug에 맞게 복사·수정해 측정). 스크린샷(가장 큰 장면·애니메이션 도중·모바일)을 직접 보고 겹침·잘림이 없을 것.
4. 금지: `src/content/article-topology-decisions.ts` 수정(오케스트레이터가 일괄 갱신), registration·catalog 수정, git commit, `npm run build`/`tsc -b`, `src/pages/articles/ai/autoencoder/viz/AutoencoderRoundTripViz.tsx` 접근, 담당 외 글 수정.

## 보고
글마다: 만든 Viz 이름·넣은 절·장면 목록(한 줄씩)·검증 결과·본문과 어긋난 점/확인 못 한 값. 짧게.
