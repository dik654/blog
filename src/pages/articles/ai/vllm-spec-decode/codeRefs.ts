import type { CodeRef } from "@/components/code/types";
import rejectionSamplerPy from "./codebase/vllm/v1/sample/rejection_sampler.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "rejection-test": {
    path: "vllm/v1/sample/rejection_sampler.py",
    code: rejectionSamplerPy,
    lang: "python",
    highlight: [24, 40],
    desc: "문제: Draft token을 그대로 쓰거나 무조건 버리지 않고, target sampling 분포를 정확히 보존하며 재사용해야 합니다.\n\n해결: target_prob/draft_prob와 미리 뽑아 둔 uniform 난수를 비교해 accept/reject를 정하고, 거부되면 미리 계산해 둔 correction token으로 대체합니다.",
    annotations: [
      { lines: [27, 28], color: "sky", note: "같은 위치·같은 token에 대한 q(x)와 p(x)를 조회" },
      { lines: [30, 33], color: "emerald", note: "a(x)=min(1,p(x)/q(x)) 판정을 uniform 비교 하나로 구현 — 실제 GPU kernel은 Triton으로 이 판정을 모든 request에 병렬 실행" },
      { lines: [37, 40], color: "amber", note: "거부되면 r(x)에서 미리 샘플링해 둔 correction token으로 대체" },
    ],
  },
  "prefix-stop": {
    path: "vllm/v1/sample/rejection_sampler.py",
    code: rejectionSamplerPy,
    lang: "python",
    highlight: [15, 47],
    desc: "문제: 앞쪽 draft가 거부되면 그 뒤 후보는 더 이상 실제 prefix에서 만든 값이 아니므로 확정 대상에서 제외해야 합니다.\n\n해결: rejected 플래그가 한 번 켜지면 이후 loop는 매 위치를 건너뛰고, 전부 수락됐을 때만 bonus token을 추가합니다.",
    annotations: [
      { lines: [18, 22], color: "sky", note: "article의 I_i=∏R_j — 이미 거부됐으면(rejected=True) 이후 위치는 순회만 하고 판정하지 않음" },
      { lines: [44, 47], color: "emerald", note: "A=K(전부 수락)일 때만 bonus token 추가 — committed length가 K+1이 되는 경우" },
    ],
  },
};
