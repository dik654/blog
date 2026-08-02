# claw-policy-engine vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 PolicyEngine 을 **자율 코딩 자동화 엔진** 으로 설명한다. Lane (branch+workspace+task), Rule (condition+action), GreenContract (build/test 통과 시 자동 merge), LaneContext, Recipes.

## 원본 Claude Code 실제 동작

**원본에 PolicyEngine 자체가 없음.** `grep -r "PolicyEngine"` 결과 0. 가장 가까운 것:

- `coordinatorMode.ts` (369 LOC) — coordinator 가 worker 들 관리하지만 rule-based engine 은 아님
- `cronScheduler.ts` (565 LOC) — 시간 기반 trigger
- `permissionPolicy` (PermissionPolicy 는 권한 정책, claw 의 PolicyEngine 과 다름)

PolicyEngine 은 **claw 가 추가한 설계** (PARITY 9-lane 외에 별도). 자율 자동화 / lane-based 병렬 작업 / GreenContract (CI 성공 시 자동 merge) 같은 컨셉은 원본에 대응하는 것이 없음.

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| PolicyEngine | 핵심 모듈 | 없음 | **추가** (claw 가 추가) |
| Lane (branch+workspace+task) | 있음 | git worktree + LocalAgentTask 조합으로 흉내 가능 | **추가** |
| GreenContract | 있음 | 없음 (수동 merge) | **추가** |
| Rule DSL | 있음 | 권한 PermissionRule DSL 만 (다른 목적) | **추가** |
| 자율 자동화 | PolicyEngine + Cron | cron + sub-agent + hook 조합으로 흉내 가능 | **추가** |

## 보강 제안

이 글은 **claw 의 differentiator** 라는 점을 부각하면 좋다. "원본 Claude Code 에는 없는 자동화 엔진. claw-code 가 일종의 GitOps + 에이전트 자동화 패턴을 탑재" 라고 한 단락. 원본 개발자가 보면 흥미로운 확장.

면접 문맥에서 "자율 에이전트 자동화 시스템 어떻게 설계해?" 질문에 claw-policy-engine 자체가 답이 됨.

## 참조 파일

- 원본 측 대응 없음 (확인 완료)
- 가장 가까운 원본 모듈: `/home/heru/code/claude-analysis/src/coordinator/coordinatorMode.ts` (369 LOC, 다른 목적)
- 권한 PermissionRule (다른 목적): `/home/heru/code/claude-analysis/src/utils/permissions/permissionRuleParser.ts`
