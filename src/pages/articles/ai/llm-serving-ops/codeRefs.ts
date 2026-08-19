import type { CodeRef } from "@/components/code/types";
import routerPy from "./codebase/litellm/litellm/router.py?raw";
import retryPolicyPy from "./codebase/litellm/litellm/router_utils/get_retry_from_policy.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "pre-call-checks": {
    path: "litellm/litellm/router.py",
    code: routerPy,
    lang: "python",
    highlight: [10, 68],
    desc: "문제: \"context·tool·output schema·region 조건을 만족하지 않는 backend를 제외한 뒤, 남은 후보에서 health·queue·cost에 따라 route를 고른다\"는 eligibility-before-ranking 주장이 실제로 어느 코드에서 확인되는지 봐야 합니다.\n\n해결: LiteLLM router의 _pre_call_checks가 context window·RPM·region 조건으로 candidate를 먼저 거르고, 그 결과만 이후 routing_strategy(ranking)로 넘깁니다.",
    annotations: [
      { lines: [32, 41], color: "sky", note: "article의 context 조건 필터 — max_input_tokens 초과 deployment 제외" },
      { lines: [43, 49], color: "rose", note: "article 식에는 없는 실제 조건 — RPM 한도 초과 deployment도 제외" },
      { lines: [51, 61], color: "emerald", note: "article의 region 조건 필터" },
      { lines: [63, 68], color: "amber", note: "여기서 살아남은 후보만 이후 ranking(health·queue·cost)으로 넘어감 — eligibility가 ranking보다 먼저" },
    ],
  },
  "retry-policy": {
    path: "litellm/litellm/router_utils/get_retry_from_policy.py",
    code: retryPolicyPy,
    lang: "python",
    highlight: [10, 45],
    desc: "문제: retry budget을 D_remain 기반 deadline 부등식으로 설명한 article의 식이 실제 LiteLLM router의 재시도 로직과 정확히 같은 방식인지 확인해야 합니다.\n\n해결: 실제로는 연속시간 deadline 계산이 아니라, exception 종류별로 정책(retry_policy)에서 고정된 retry count를 찾는 방식입니다 — article의 일반 정책을 구현하는 한 가지 concrete 방식.",
    annotations: [
      { lines: [20, 23], color: "rose", note: "article과 다른 점 — D_remain이 아니라 model_group별 정적 policy에서 count를 조회" },
      { lines: [30, 45], color: "emerald", note: "exception 종류(auth/timeout/rate-limit/content-policy/bad-request)마다 다른 retry count — 모든 실패를 하나로 뭉치지 않음" },
    ],
  },
};
