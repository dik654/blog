# Claude review backfill: training gap

Date: 2026-07-23

## Result

Context Manager에서 네 글을 각각 독립 요청으로 검토했다. 결과의 첫 transport header가 정확히
`[claude-code:sonnet`으로 시작할 때만 true-Claude 검증으로 채택했다. Codex fallback, timeout,
HTTP 500, 연결 실패, header를 관찰하지 못한 병렬 batch는 모두 폐기했다.

| slug | accepted header | result | disposition |
|---|---|---|---|
| `open-r1` | `[claude-code:sonnet · L3 · $0.0000 · 93377ms]` | medium 1 | `fixed_by_root` |
| `post-training-rlvr` | `[claude-code:sonnet · L3 · $0.0000 · 98404ms]` | medium 1 | `fixed_by_root` |
| `rlhf` | `[claude-code:sonnet · L3 · $0.0000 · 57966ms]` | medium 1 | `fixed_by_root`, legacy unmounted |
| `llm-pretraining-scaling` | `[claude-code:sonnet · L3 · $0.0000 · 139808ms]` | math pass; source concern not reproduced | no change |

Unique target는 4개, true-Claude accepted는 4개다. 전체 실행 13건 중 9건은 폐기했다.

## Confirmed Findings

### `post-training-rlvr`

기존 `J_RLVR` 식은 고정된 `x`에서 policy rollout `y`만 평균내고 학습 문제 분포를 생략했다.
현재 식은 `E_{x~D} E_{y~pi_theta(.|x)}[r_verify(x,y)]`로 수정됐고 FormulaNote에도 `x ~ D`가
추가됐다.

### `open-r1`

`re.MULTILINE`과 `pattern.search`를 함께 사용하면 `^/$`가 completion 전체가 아니라 줄 경계에
붙을 수 있다. 따라서 앞뒤 별도 줄의 garbage가 남아도 내부 tag 구간만 통과할 수 있는데, 기존
annotation은 전체 completion 계약을 보장한다고 설명했다.

Root는 vendored excerpt의 원형 동작을 보존하면서 코드 주석, annotation, 본문에 이 약점을
명시했다. 전체 문자열 계약이 필요할 때는 `fullmatch` 또는 raw-string `\A...\Z`를 사용하고
adversarial fixture로 확인하도록 설명했다.

Claude 응답에 함께 적힌 `RewardSystem.tsx:28` 위치는 부정확했다. 독립 재확인된 근거는
`open-r1/codeRefs.ts:57`과 vendored `rewards.py:28-34`다.

### `rlhf`

Legacy `PPO.tsx`의 KL 식은 현재 actor를 `pi_phi`로 쓰면서 clipped objective는 `r_t(theta)`로
바꿨다. 현재는 `r_t(phi)`로 통일됐고 FormulaNote가 같은 actor `pi_phi`임을 명시한다. 이 파일은
현재 route에서 mount되지 않지만 향후 재사용 시 혼동을 막기 위해 수정됐다.

## Not Reproduced

`llm-pretraining-scaling` 검토는 계산 예시, Chinchilla 식, data repetition 식에서 오류를 찾지
못했다. Claude는 live web 권한이 없어 두 2026 arXiv citation이 가짜일 수 있다고 경고했지만,
primary source를 직접 확인한 결과 둘 다 실제 논문이다.

- `2604.01411`: Roberts et al., *Test-Time Scaling Makes Overtraining Compute-Optimal*
- `2606.06888`: Xu et al., *Data-Constrained Language Model Pretraining: Improved Regularization and Scaling Laws*

따라서 이 우려는 confirmed finding으로 세지 않았다.

## Rejected Attempt Ledger

| target | route | observed result | disposition |
|---|---|---|---|
| 4 slugs 병렬 batch | `cm_route_delegate` x4 | 180초 이상 header 없음 | 4 executions rejected |
| `open-r1` | `cm_route_delegate` | operation timeout, 258362ms | rejected |
| `open-r1` | `cm_route_delegate` | `[codex:gpt-5.5 · L2 · $0.0000 · 145569ms]` | fallback rejected |
| `open-r1` | `cm_route_delegate` | `[codex:gpt-5.5 · L3 · $0.0000 · 236991ms]` | fallback rejected |
| `open-r1` | `cm_delegate`, `ai-researcher`, fresh | HTTP 500, all providers failed | rejected |
| `rlhf` | `cm_route_delegate` | unable to connect | rejected |

## Coverage Boundary

첫 broad prompt들은 current-first flow, mechanism/math, primary-source fidelity, Korean first-use terms,
hidden transfer, mobile Viz, previous/next handoff를 모두 요청했지만 acceptable header 없이 끝났다.
검증 identity를 끝까지 확보하기 위해 root가 허용한 대로 retry를 한 slug당 가장 위험한
mechanism/source 질문 하나로 좁혔다.

따라서 이 원장의 4건은 고유 slug의 true-Claude identity backfill로는 셀 수 있지만, 네 글의
모바일 visual QA 전체를 다시 수행한 4건으로 과장해서는 안 된다.
