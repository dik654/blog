import { defineArticleFlow } from "@/components/viz/article-flow";

export const STEPS = defineArticleFlow([
  {
    id: "same-size-different-serving-shape",
    stage: "background",
    label: "30B dense 모델 두 개",
    body: "Muse Glimmer 30B와 Gemma 4 31B는 크기와 라이선스가 비슷하지만 attention layer 구성과 배포 artifact가 다릅니다.",
  },
  {
    id: "context-is-not-capacity",
    stage: "problem",
    label: "문제: context 길이를 곧 수용 인원으로 해석",
    body: "최대 context는 한 요청의 상한일 뿐이며, 동시 요청 수는 weight 밖에 남은 VRAM과 요청별 KV cache 사용량으로 정해집니다.",
  },
  {
    id: "runtime-support-matters",
    stage: "problem",
    label: "문제: runtime이 local KV를 회수하지 못할 수 있음",
    body: "모델이 sliding window attention을 써도 engine이 layer별 cache 정책을 구현하지 않으면 이론적인 memory 절감이 실제 동시성으로 이어지지 않습니다.",
  },
  {
    id: "sum-layer-cache",
    stage: "idea",
    label: "아이디어: layer별 KV 보존 길이를 합산",
    body: "local layer는 window까지만, global layer는 전체 history를 보존한다고 놓고 layer·KV head·head dimension·dtype별 byte를 계산합니다.",
  },
  {
    id: "benchmark-admission-control",
    stage: "implementation",
    label: "구현: 실측으로 admission policy를 결정",
    body: "고정 artifact와 대표 prompt 분포로 quality·TTFT·decode latency·KV usage·preemption을 함께 측정해 동시 사용자 상한을 정합니다.",
  },
]);
