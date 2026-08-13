import TopicPrimer from "@/components/articles/topic-primer";

export default function Overview() {
  return (
    <TopicPrimer
      title="Groth16: 제약식에서 세 개의 proof 원소까지"
      question="수많은 constraint는 왜 짧은 A·B·C와 pairing 검사로 줄어들까?"
      thesis="Groth16은 R1CS를 QAP로 바꾸고, trusted setup이 고정한 비밀 평가점에서의 관계를 곡선점 commitment로 숨깁니다. prover의 MSM과 verifier의 pairing은 서로 다른 계산 비용을 담당합니다."
      points={[
        {
          label: "Setup 경계",
          detail:
            "circuit별 proving·verifying key와 toxic waste 가정이 어디에 들어가는지 봅니다.",
        },
        {
          label: "Prover 경로",
          detail: "witness→QAP polynomial→MSM→A·B·C 조립 순서로 추적합니다.",
        },
        {
          label: "Verifier 경로",
          detail:
            "public input의 선형 결합과 pairing equation이 무엇을 검증하는지 구분합니다.",
        },
      ]}
      readingHint="데이터 구조를 먼저 보고 setup→prove→verify의 artifact가 어떻게 이어지는지 잡은 뒤 세부 수식으로 내려가세요."
    />
  );
}
