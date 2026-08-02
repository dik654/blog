# Claude review final identity audit

## 판정

Context Manager의 성공 여부가 아니라 첫 transport header가 정확히
`[claude-code:sonnet`으로 시작하는지 검사했다. Codex fallback, headerless 응답, timeout,
HTTP 500과 connector failure는 검토 내용이 있어도 coverage에서 제외했다.

최종 article-level 결과는 **71/71 (100%)**이다.

| 구분 | 고유 글 | Sonnet 채택 실행 | 실패·거부 | 전체 시도 |
|---|---:|---:|---:|---:|
| 기존 identity-audited 원장 | 57 | 57 | 18 | 75 |
| Training gap | 4 | 4 | 9 | 13 |
| Architecture gap | 5 | 6 | 13 | 19 |
| RL gap | 5 | 7 | 10 | 17 |
| 합계 | **71** | **74** | **50** | **124** |

고유 coverage와 실행 횟수는 다르다. `llm-architecture-hybrid-linear`은 두 번,
`rl-mdp-bellman`은 세 번의 서로 다른 좁은 검토를 채택했기 때문에 71개 글에서 Sonnet header는
74개다. Architecture의 `architecture-hybrid-assist` 원장은 상위 architecture 원장에 이미
합쳐졌으므로 다시 더하지 않았다.

## 닫힌 14개 공백

Training:
`llm-pretraining-scaling`, `open-r1`, `post-training-rlvr`, `rlhf`

Architecture:
`llm-architecture-dense-transformers`, `llm-architecture-gallery`,
`llm-architecture-hybrid-linear`, `llm-architecture-kv-long-context`,
`llm-architecture-sparse-moe`

Reinforcement Learning:
`rl-mdp-bellman`, `rl-model-based-world-models`, `rl-policy-gradient-actor-critic`,
`rl-pomdp-state-estimation`, `rl-temporal-difference-dqn`

확인된 finding은 root가 원문·수식·현재 코드로 독립 판정한 뒤 수정했다. 현재 열린 confirmed
finding은 0개다. 특히 MDP hidden challenge가 공개 Viz의 숫자를 거의 그대로 재사용하던 문제는
별도 history, reward, gamma, policy와 oracle로 교체했다.

## 과장하지 않는 범위

이 문서는 HTTP 500과 fallback 때문에 증명하지 못했던 article-level Claude identity를 닫는다.
11개 route sequencing 검토는 별도 단위이며 article 수에 넣지 않았다. Claude source 검토와
Playwright browser evidence도 같은 사실로 합치지 않았다. 기존 accepted review에 남아 있는
live-source 후속 확인과 저장소 전체 enrichment backlog는 별도 queue다.

과거 `2026-07-23-claude-review-backfill-report`의 70개 완료 표기는 header 증거가 없어 identity
수치의 source of truth가 아니다. 이 문서와 동명의 JSON이 최종 identity source of truth다.

## 최종 실행 증거

- `npm run build`: 9,357 modules, pass. 기존 large-chunk advisory만 남음
- 최종 local Playwright: 83/83
- 공통 Viz audit: 24 checks, 21 surfaces, error 0, warning 0
- 공통 narrative audit: 24 checks, StepViz 15, 21 surfaces, error 0, warning 0
- production Playwright: 5/5
- `cm-blog.service`: active
- production assets: `index-DUuEljND.js`, `index-yuuw-KUu.css`, 모두 HTTP 200
- 핵심 route smoke: HTTP 200
- legacy `/blog/` → `/lab/blog/`: HTTP 308
