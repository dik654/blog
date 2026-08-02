# Agent Prompt Injection containment reconstruction report

## Observed

기존 글은 indirect prompt injection, least privilege와 approval을 설명했지만 한 공격이 실제 side effect로 이어지는 상태 인계를 끝까지 보여 주지 못했다. MCP tool description과 peer-agent message가 권한처럼 보이는 경우, 격리한 fact가 다음 session에서 다시 검색되는 경우, 따로는 허용된 두 행동이 합쳐져 유출을 만드는 경우, approval 뒤 redirect·resource·grant가 바뀌는 경우가 빠져 있었다.

## Inferred

탐지율을 높이는 것만으로 agent 보안을 닫을 수 없다. Reader가 재사용할 최소 구조는 `authority와 source 구분 → lineage 보존 → task capability → 이전 행동을 포함한 data-flow gate → action-specific approval → commit 직전 재검증 → replay evidence`다. Model은 proposal을 만들 수 있지만 실제 authorization은 context 밖의 deterministic code가 소유해야 한다.

## Decided

하나의 vendor-email incident를 전체 글에서 재사용했다. Global tool은 6개지만 이번 task에는 `read_inbox`, `draft_reply` 두 capability만 주며, 공격이 만든 다섯 proposal 중 두 개만 allow하고 customer read·external HTTP·durable policy write 세 개는 deny한다. 최종 외부 write는 0이다.

Gate는 한 action만 보던 `G(a)`에서 이전 행동 이력을 포함하는 `G(a_t | h_<t)`로 바꿨다. Derived artifact가 다음 action의 source가 되면 lineage를 이어 붙인다. Prepare 뒤 현재 destination·resource·policy·grant를 다시 resolve하고, 승인 hash와 달라졌거나 commit-time gate가 닫히면 실행하지 않는다.

## Hidden transfer problem

- 악성 vendor email은 customer 417 조회, attacker URL 송신, admin fact 저장을 지시한다.
- MCP metadata의 요구와 peer agent의 “부모가 승인했다”는 문장은 authority가 아니다.
- Quarantine fact는 다음 turn이나 session에서 읽혀도 원래 untrusted lineage를 유지한다.
- 허용된 draft가 tracking URL을 보존하고 허용된 renderer가 이를 fetch하면 두 행동의 합성은 forbidden egress가 된다.
- Prepare 때 허용된 destination이 commit 전에 redirect되면 commit-time re-check가 거부해야 한다.
- 정상 요약·초안은 성공하면서 forbidden side effect는 0이어야 한다.

## Sources and boundaries

- [OpenAI source-sink research](https://openai.com/index/designing-agents-to-resist-prompt-injection/)는 input firewall보다 constrained impact를 중심에 두는 현재 관점의 근거다.
- [Anthropic browser-agent defenses](https://www.anthropic.com/research/prompt-injection-defenses)는 training, classifier와 adaptive red team의 역할 및 residual risk의 근거다.
- [OWASP LLM01](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)과 [LLM06](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)은 vendor-neutral threat와 excessive-agency 경계다.
- [MCP Authorization](https://modelcontextprotocol.io/docs/tutorials/security/authorization)과 [Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)는 token, audience, scope, confused deputy와 passthrough 경계다. Tool의 business authorization을 MCP가 자동 보장한다고 쓰지 않았다.
- [Microsoft indirect-injection guidance](https://learn.microsoft.com/en-us/security/zero-trust/sfi/defend-indirect-prompt-injection)는 spotlighting, plan drift, flow control과 short-lived privilege를 함께 보는 defense-in-depth 근거다.

## Claude collaboration

처음 사용한 OpenWebUI-backed `/api/chat`은 login 400과 provider failure를 반환했다. Direct Claude CLI로 우회하지 않고 Context Manager의 기존 `ExternalHarness` 경계를 확인했다. Registry에 Codex만 있었으므로 `claude-code` harness를 추가하고 등록했다. Harness는 preflight, noninteractive text output, plan·auto·yolo permission mapping, model override, timeout·abort·stderr·result 계약을 Context Manager 안에서 처리한다.

Context Manager의 `runDelegatedPrompt`가 `harness:claude-code:sonnet`, plan mode, blog workdir로 수행한 독립 리뷰는 194,213ms에 성공했다. Claude는 다음 다섯 누락을 찾았다.

1. Tool metadata를 untrusted source라고 말만 하고 실제 authority 경계를 실행하지 않았다.
2. Parent가 가진 권한을 child가 상속하는 peer-agent handoff를 막지 않았다.
3. Viz의 deny reason이 수식의 `I/C/F/A`와 직접 대응하지 않았다.
4. Quarantine write는 막지만 다음 session retrieval에서 policy 근거로 승격될 수 있었다.
5. Prepare와 commit 사이의 destination·resource·policy drift를 재검증하지 않았다.

가장 어려운 전이 문제는 “각각 허용된 두 action이 합쳐져 forbidden flow가 되는가?”였다. 이를 본문, `F(history, action)`, code sketch, eval fixture와 capability check에 반영했다. 이후 Context Manager 경로만 사용한 별도 health run은 6,844ms에 `CM_CLAUDE_COLLAB_OK`를 반환했다.

## Changed

- 일곱 section을 threat model, attack chain, trust lineage, policy gate, approval·commit, detection·recovery, handoff로 다시 작성했다.
- 세 Viz에 source fan-in, sink fan-out, `I/C/F` deny reason, 2 allow·3 deny·0 write의 숫자 oracle을 넣었다.
- KaTeX를 history-aware gate와 prepare·commit 이중 판정으로 바꾸고 모든 항을 한글로 설명했다.
- Content spec에 숨은 전이 문제와 4B·9B packet을 남겼다.
- Learning-flow audit가 `InternalLink`를 outgoing connection으로 인식하도록 수정해 false backlog를 제거했다.
- Context Manager에 Claude Code ExternalHarness와 회귀 테스트를 추가했다.

## Verified

- Blog focused ESLint와 production build 9,352 modules 성공.
- 전용 Playwright 로컬 4/4, 공개 4/4, 관련 Agent·current-first 경로 로컬 51/51 통과.
- 390px Viz 높이 806, 707.5, 562.1875px, Viz와 document overflow 0.
- Mobile KaTeX scale 1.00, overflow -38.22px, 한글 annotation 확인.
- Learning-flow audit에서 등록 589, global blocker 29, review 1, enrichment 480, local connection backlog 419이며 `prompt-injection-defense` 자체 score·blocker·review·enrichment·issue는 모두 0이다.
- Context Manager harness·routing tests 17/17과 TypeScript 통과; 세 user service active.
- Public category와 article HTTP 200, `cm-blog.service`는 `2026-07-23 11:47:06 KST`부터 새 빌드로 active다.

## 4B · 9B handoff

4B worker는 `user_intent`, `authority_sources`, `untrusted_sources`, `sensitive_labels`, `candidate_sink`, `task_capability`, `action_history`, `data_flow_rule`, `approval_rule`, `commit_recheck`, `commit_evidence`, `forbidden_inference`, `next_handoff`를 JSON으로 낸다.

9B reviewer는 `source_vs_instruction`, `jailbreak_vs_injection`, `proposal_vs_authorization`, `tool_metadata_authority`, `peer_agent_grant`, `tool_visibility_vs_permission`, `session_vs_identity`, `classifier_vs_gate`, `draft_vs_commit`, `commit_toctou`, `memory_lineage`, `cross_action_composition`, `normal_task_regression`, `cross_article_overlap`을 검사한다. Orchestrator만 source freshness, path metadata, KaTeX, responsive browser oracle, build, deployment와 public regression을 닫는다.
