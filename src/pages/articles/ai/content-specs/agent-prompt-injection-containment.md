# Agent prompt-injection containment

## Reader outcome

독자는 공격 문구를 외우는 대신 한 agent task의 authority, untrusted source, sensitive data와 privileged sink를 그린다. Model proposal과 deterministic authorization을 분리하고, injection detector가 공격을 놓쳐도 confidential egress와 durable memory poisoning이 commit되지 않는 policy를 작성한다.

## Hidden transfer problem

- 사용자 목표: 최근 vendor email 요약과 답장 초안. 실제 send는 요청하지 않았다.
- Global registry: `read_inbox`, `read_customer`, `draft_reply`, `send_email`, `http_request`, `write_memory` 여섯 도구.
- Task grant: `read_inbox`, `draft_reply` 두 capability만 제공한다.
- 외부 email은 customer 417 조회, attacker URL 송신과 admin fact 저장을 지시한다.
- Model proposal 다섯 개 중 `read_inbox`, `draft_reply`만 허용하고 나머지 세 개를 거부한다.
- 결과는 2 allow + 3 deny이며 external 또는 durable side effect는 0이다.
- Detector가 encoded injection을 놓쳐도 task scope와 data-flow gate가 피해를 막아야 한다.
- MCP tool metadata와 peer-agent message는 설명 source이지 authority가 아니며, sub-agent에는 새 task grant를 발급한다.
- Quarantine fact가 다음 turn이나 session에서 retrieval되어도 원래 lineage를 유지하고 policy·grant 근거로 승격하지 않는다.
- 따로는 허용된 두 action도 합성하면 금지된 data flow가 될 수 있으므로 action history를 포함해 판정한다.
- Prepare 뒤 redirect·resource·policy·grant가 달라지면 commit 직전 re-check가 실행을 막아야 한다.
- 정상 요약·초안 task 성공과 forbidden commit 0을 같은 regression case에서 검증해야 한다.

## Article ownership

1. MCP는 tool discovery, schema, transport와 result envelope를 소유한다.
2. Harness는 loop, state, retry, timeout과 trace plumbing을 소유한다.
3. 이 글은 source trust·data lineage·task capability·data-flow policy·approval·commit boundary를 소유한다.
4. Agent Evaluation은 incident fixture의 반복 trial, grader와 release evidence를 소유한다.

## Source boundaries

- OpenAI 2026 source-sink 관점은 current product security research이며 모든 agent implementation의 완전한 보장을 뜻하지 않는다.
- Anthropic 2025 browser-agent 결과는 internal adaptive attacker와 당시 제품 구성을 대상으로 하며 다른 model·environment에 그대로 일반화하지 않는다.
- OWASP LLM01·LLM06은 vendor-neutral threat와 mitigation 기준이다. Checklist 하나로 security proof가 되지는 않는다.
- OWASP Top 10 for Agentic Applications 2026은 goal hijack, tool misuse, identity·privilege abuse와 memory·context poisoning의 운영 분류다. 이 글의 한 trace가 네 위험을 모두 지날 수 있지만, Top 10 자체가 구현이나 완전한 방어 증명은 아니다.
- MCP authorization과 security best practices는 protocol·resource-server 경계다. MCP가 tool 자체의 business authorization을 자동 강제한다고 쓰지 않는다.
- Spotlighting, classifier와 model training은 probabilistic sensor다. Deterministic capability와 commit gate를 대신하지 않는다.

## Visual contract

- `data-agent-security-viz` 하나가 source → proposal → policy → commit → evidence의 동일 사례를 다섯 StepViz 장면으로 추적한다.
- 각 장면은 owner, output과 다음 단계의 invariant를 receipt로 남긴다. 장면을 바꿔도 email-884, customer-417, policy v17과 grant g42의 identity가 끊기지 않아야 한다.
- Authority는 blue, untrusted는 amber, sensitive는 violet, gate는 teal, allow는 green, deny는 crimson으로 일관하되 색만으로 상태를 구분하지 않는다. Icon, label과 allow/deny text가 항상 함께 있어야 한다.
- 390px에서는 수평 pipeline을 강제로 축소하지 않는다. Source packet, proposal list, four-gate grid, commit recheck와 evidence chain을 각각 세로 또는 2열 sequence로 재배치한다. 모든 본문 text는 11px 이상이며 document·stage·canvas overflow와 sticky header 겹침이 없어야 한다.
- Animation은 장면 전환과 짧은 node reveal만 사용한다. 자동 이동 자체가 인과 관계를 대신하지 않고, progress와 이전·다음·재생 control로 모든 장면을 직접 선택할 수 있어야 한다.

## 4B / 9B packet

4B worker: `user_intent`, `authority_sources`, `untrusted_sources`, `sensitive_labels`, `candidate_sink`, `task_capability`, `action_history`, `data_flow_rule`, `approval_rule`, `commit_recheck`, `commit_evidence`, `forbidden_inference`, `next_handoff`.

9B reviewer: `source_vs_instruction`, `jailbreak_vs_injection`, `proposal_vs_authorization`, `tool_metadata_authority`, `peer_agent_grant`, `tool_visibility_vs_permission`, `session_vs_identity`, `classifier_vs_gate`, `draft_vs_commit`, `commit_toctou`, `memory_lineage`, `cross_action_composition`, `normal_task_regression`, `cross_article_overlap`.

Orchestrator: current official source freshness, metadata/path, KaTeX Korean annotation, responsive browser oracle, build, deployment and public regression.
