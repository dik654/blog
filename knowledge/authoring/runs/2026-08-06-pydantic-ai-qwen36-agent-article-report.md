# PydanticAI × Qwen3.6 Agent 문서화 · 평가 인계 기록

- 작성일: 2026-08-06T01:46:51+09:00
- 블로그 브랜치·기준 커밋: `agent/blog-continuation` · `aa105cde`
- 구현 source snapshot: `/home/ddd/ojs-agents` · `943be39`
- Fleet manifest SHA-256: `264c41e18ee3e4f81af13f45c47f23a8213b44b13090fd1beab68ba2a78c80a3`
- 새 문서 경로: `/lab/blog/ai/pydantic-ai-qwen36-agent-system`
- 문서 상태: 구현 설명 완료, 포트폴리오용 결함·측정 결과 인계 대기

이 기록은 포트폴리오용 최종 평가 보고서가 아니다. 현재 `ojs-agents` source에 실제로 존재하는 architecture와 운영 계약을 먼저 설명하고, 다른 Codex 세션에서 확정할 결함·측정 결과가 어떤 schema로 들어와야 하는지를 고정한 authoring receipt다.

## 1. 이번에 문서화한 실제 구현 범위

- Qwen3.6, vLLM OpenAI-compatible endpoint, PydanticAI와 application policy의 책임 분리
- 여러 PydanticAI system instruction part를 Qwen용 선두 system message 하나로 합치는 model adapter
- PydanticAI NativeOutput·PromptedOutput을 route가 실제 운반하는 기능에 따라 선택하는 구조
- Model ID·URL 대신 behavior capability와 invocation profile을 요청하는 fleet routing
- `probed` request shape와 scenario 기반 `capabilities` grant를 구분하는 fail-closed 계약
- Typed unary agent, bounded native tool loop, `pydantic_graph` staged loop의 선택 기준
- Pinned caller value, fact와 source material, hazard conjunction, structured `ToolResult`
- Token·whole-call·request·tool-call·tool timeout의 독립 경계
- Fresh retry, transactional streaming recovery, actual served model verification
- `completed`, `bounded failure`, `refused`, `not applicable`와 CLI exit code의 구분
- Process 정지·재기동을 task success로 세지 않고 artifact·side effect·acceptance로 완료를 판정하는 원칙

## 2. 주장 경계

이 문서가 확정하는 것은 source snapshot의 구조와 설계 의도다. 현재 code default인 request 8회, tool call 6회, tool timeout 30초, model timeout 120초는 **2026-08-06 구현 스냅샷**으로만 기록했다. 이 값이 모든 workload의 최적값이라고 주장하지 않는다.

Qwen3.6-27B 공식 model context와 local serving contract도 분리했다. 공식 모델 소개의 최대치를 local FP8 endpoint가 그대로 제공한다고 쓰지 않고, 현재 fleet manifest의 served context 65,536을 application 계약으로 설명했다.

다음 항목은 이 문서에서 확정하지 않았다.

- 반복·장기 작업 case의 최종 통과율
- Model·route·output mode별 최종 품질 비교
- 확정된 latency, token, wire call과 recovery 시간
- 열린 결함 수와 수정 전후 paired result
- 다른 세션에서 아직 변경 중인 source의 최종 SHA와 fleet digest

## 3. 후속 포트폴리오 평가 문서에 필요한 필드

후속 문서는 최소한 다음을 함께 기록해야 한다.

1. Git SHA와 fleet manifest digest
2. Serving image·model·tokenizer·parser·served context
3. Case suite와 baseline/candidate arm
4. Requested capability conjunction과 actual served model
5. Invocation profile, output mode와 sampling knob
6. Trial 수와 task acceptance pass/fail
7. Forbidden effect와 side-effect reconciliation 결과
8. Latency, token, wire request와 tool call 원시 분포
9. Model·adapter·route·tool·policy·evaluator 중 failure owner
10. Trace, stderr, output hash와 artifact receipt 위치
11. 열린 결함, stop rule과 paired rerun 결과

특히 runaway가 limit에 의해 중단된 비율과 실제 업무 완료율을 같은 지표로 합치지 않는다. Process recovery, model response completion, logical task acceptance와 external effect reconciliation은 각각 별도 결과여야 한다.

## 4. 면접·포트폴리오 서사

### 문제

Local model에 PydanticAI를 연결한 것만으로는 tool parser, Qwen chat template, model routing, 반복 제한과 업무 성공의 경계가 보장되지 않았다. 작은 모델을 과도하게 믿거나, timeout·재기동을 성공으로 오인하고, structured output mode가 실제 serving path에서 사라지는 결함이 생길 수 있었다.

### 판단

Agent code는 model ID가 아니라 검증된 capability를 요청하게 했다. Model capability와 endpoint request shape를 분리하고, invocation profile의 knob까지 grant의 일부로 취급했다. 짧은 typed 작업, 유연한 native loop와 단계별 증거가 필요한 graph를 한 방식으로 통일하지 않았다.

### 구현

Model edge에서 single-system adaptation, structured output 선택, finish reason·timeout·actual model 검증과 recovery를 담당했다. Tool layer는 typed argument, allowlist, side-effect uncertainty와 artifact를 반환한다. Application은 loop 종료와 별개로 original task acceptance를 판정한다.

### 결과 표현 원칙

현재 포트폴리오에는 architecture와 검증 방법만 확정해 싣는다. 성능·결함 결과는 다른 세션의 평가 문서가 snapshot과 원시 receipt를 갖춘 뒤 연결한다. 숫자를 먼저 만들거나 기존 README의 과거 측정을 현재 전체 시스템 결과로 확대하지 않는다.

## 5. 블로그 UI 검증

- `NODE_OPTIONS=--max-old-space-size=8192 npx tsc -b --pretty false`: 통과
- `NODE_OPTIONS=--max-old-space-size=8192 npm run build`: 통과. 기존 large chunk warning은 남음
- `npm run qa:ai-ia`: desktop·mobile 2 viewport, failures 0
- 새 route geometry audit: 1 route × 2 viewport, 16 article Viz surface, errors 0, warnings 0
- StepViz: 없음. 따라서 site-wide StepViz scene inventory는 변하지 않음
- 수동 DOM-anchor screenshot 검토: desktop overview·capability routing, mobile model adapter·evaluation handoff·interview portfolio
- Mobile comparison table은 card layout으로 전환되고, code block은 article 폭을 넘기지 않는 내부 horizontal scroll로 유지됨

## 6. 후속 인계 상태

- `pendingExternalSession`: true
- `evaluationDocumentPath`: 아직 정하지 않음
- 인계 완료 조건: 다른 세션의 결함·측정 보고서가 실제 경로와 snapshot을 제공하고, 이 문서의 architecture claim과 충돌하는 변경을 먼저 재검토한 뒤 상호 링크함
