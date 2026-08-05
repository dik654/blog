# ReAct (2022) source reconstruction content spec

## Goal
- 독자가 ReAct를 “생각하고 도구를 쓴다”는 slogan이 아니라, language action과 environment action을 번갈아 context에 기록하는 policy로 설명한다.
- 논문의 QA·decision-task 실험을 현재 production agent loop와 섞지 않고, 원문이 실제로 지지한 범위와 실패 분포를 판정한다.

## Source anchors
| Area | Source | Why it matters |
|---|---|---|
| Policy | Yao et al. (2022), Section 2 | action space 확장과 context update |
| QA environment | Section 3, Appendix A | `search`, `lookup`, `finish`, few-shot prompts, step cap |
| QA evidence | Table 1–2 | CoT·Act·ReAct·hybrid 성능과 failure type |
| Finetuning | Section 3.3 | 3,000 bootstrapped trajectories와 model-size 결과 |
| Decision tasks | Section 4, Table 3–4 | ALFWorld·WebShop action loop와 결과 |
| Limitations | Section 6 | prompt capacity, action space, human data, RL future work |

## Full-scope map
| Topic | Must cover | Depth | Notes |
|---|---|---|---|
| Context and policy | observation/action history, augmented action space | deep | 새 transition lab |
| Language thought | context만 바꾸고 environment는 바꾸지 않음 | deep | private reasoning 정책과 구분 |
| Wikipedia actions | exact three API actions | deep | QA trace lab |
| Evidence | all Table 1 methods, failure labels | deep | table 대신 task/failure explorer |
| Hybrid | CoT-SC→ReAct, ReAct→CoT-SC | deep | fallback 조건 해석 |
| Finetuning | 3,000 trajectories and scale result | brief | exact score가 아닌 ordering 보존 |
| ALFWorld/WebShop | success/score receipts | deep | 다른 environment를 한 평균으로 합치지 않음 |
| Production runtime | permissions, retries, durable state | defer | `agentic-patterns`, harness로 handoff |

## Reader prerequisites
- Policy: 현재까지의 기록을 보고 다음 action의 확률을 만드는 규칙이다.
- Observation: tool이나 environment가 action 뒤에 돌려준 새 정보다.
- Few-shot prompting: 완성된 trajectory 몇 개를 prompt 안의 예로 준다.
- Success rate: 여러 episode 중 목표를 실제로 끝낸 비율이다.

## Section 1: Action-space extension -- thought와 action은 무엇이 다른가
- Formula:
  - `c_t=(o_1,a_1,...,o_t)`
  - `hat A=A union L`
  - `a_t~pi(.|c_t)`
- Operation reason:
  - history를 context로 이어야 tool result가 다음 판단에 반영된다.
  - language action `L`은 context만 갱신해 계획·분해·검산을 남긴다.
  - environment action `A`만 외부 state를 바꾼다.
- Viz plan:
  - Thought tab: context grows, environment unchanged.
  - Action tab: action executes, observation returns, both context and environment change.
  - Finish: answer emitted and episode closes.

## Section 2: HotpotQA/FEVER -- 세 API로 사실을 찾는 법
- Exact actions:
  - `search[entity]`: Wikipedia 첫 다섯 문장을 observation으로 받는다.
  - `lookup[string]`: 현재 page에서 string이 포함된 다음 문장을 받는다.
  - `finish[answer]`: answer를 제출하고 task를 종료한다.
- Prompt contracts:
  - HotpotQA 6-shot, FEVER 3-shot.
  - step cap 7/5.
  - 정답 trajectory 중 상한을 정확히 모두 쓴 사례는 HotpotQA 0.84%, FEVER 1.33%였다.
- Viz plan:
  - entity→search→lookup→finish trace.
  - 정보 없는 search가 남은 step budget을 어떻게 소모하는지 표시.

## Section 3: Evidence and failures -- 평균 점수보다 실패 분포를 읽는다
- Table 1 receipts:
  - Standard 28.7/57.1
  - CoT 29.4/56.3
  - CoT-SC 33.4/60.4
  - Act 25.7/58.9
  - ReAct 27.4/60.9
  - CoT-SC→ReAct 34.2/64.6
  - ReAct→CoT-SC 35.1/62.0
- Table 2:
  - HotpotQA 성공·실패 trajectory만 각각 50개씩 수작업 분류했다. FEVER로 일반화하지 않는다.
  - ReAct success: true positive 94%, hallucination 6%.
  - ReAct failure: reasoning error 47%, non-informative search 23%, hallucination 0%.
  - CoT failure: hallucination 56%.
- Design insight:
  - ReAct가 모든 QA 지표에서 CoT-SC를 단독으로 이긴 논문이 아니다.
  - 서로 다른 failure mode 때문에 hybrid fallback이 개선된다.
  - Table 2의 failure taxonomy는 HotpotQA 표본에 한정되므로 FEVER 차이의 직접 설명으로 쓰지 않는다.
- Viz plan:
  - task selector, method bars, hybrid delta.
  - success/failure selector와 failure composition.

## Section 4: Finetuning and decisions -- prompt pattern이 action policy로 이동한다
- 3,000 ReAct trajectory를 bootstrap해 PaLM-8B/62B를 finetune했다.
- Finetuned 8B ReAct가 모든 62B prompting baseline을 넘었고, finetuned 62B가 모든 540B prompting baseline을 넘었다.
- ALFWorld:
  - ReAct best 71%, ReAct-IM 53%, Act 45%, BUTLER 37%.
- WebShop:
  - ReAct score 66.6/SR 40.0, Act 62.3/30.1, IL 59.9/29.1, IL+RL 62.4/28.7, human 82.1/59.6.
- Viz plan:
  - environment selector.
  - score와 success rate를 섞지 않고 별도 축/band로 표시.

## Section 5: Limits and handoff -- 논문에서 production agent로 넘어갈 때
- Limits:
  - 큰 action space와 긴 horizon은 더 많은 demonstrations를 요구하지만 context가 제한된다.
  - finetuning은 더 많은 human-written data가 필요하다.
  - ReAct+RL은 future work였다.
  - 실험 action space에는 실제 Wikipedia 수정이나 실제 구매가 없다.
- Handoff:
  - `agentic-patterns`: workflow/agent boundary, termination, risk.
  - `context-engineering`: evidence packet.
  - `llm-harness`: durable state, replay, retry, trace.

## Private transfer check
- `search`가 자주 빈 결과를 내고 model은 같은 query를 반복한다. 본문만 읽고 language thought, environment action, observation, step budget을 분리한 state machine과 fallback 조건을 설계할 수 있어야 한다.

## Coverage recheck
| Scope item | Covered by | Gap | Fix |
|---|---|---|---|
| Policy mechanism | Section 1 | none | formula + transition lab |
| QA execution | Section 2 | none | API trace |
| Evidence/failure | Section 3 | none | evidence explorer |
| Finetuning/decision | Section 4 | none | environment receipts |
| Production boundary | Section 5 | none | explicit handoff and stop rule |
