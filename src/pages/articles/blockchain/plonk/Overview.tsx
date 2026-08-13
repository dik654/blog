import TopicPrimer from "@/components/articles/topic-primer";

export default function Overview() {
  return (
    <TopicPrimer
      title="PLONK 계열: 표에서 다항식 증명으로"
      question="gate·copy constraint·lookup은 어떻게 하나의 polynomial protocol이 될까?"
      thesis="PLONKish arithmetization은 witness를 column과 row의 표로 배치하고 gate·permutation·lookup argument를 서로 다른 다항식 관계로 표현합니다. KZG나 IPA는 이 관계를 약속하고 여는 commitment backend입니다."
      points={[
        {
          label: "Arithmetization",
          detail:
            "composer·gate·selector가 계산을 어떤 표와 polynomial identity로 만드는지 봅니다.",
        },
        {
          label: "Argument와 commitment",
          detail:
            "copy·lookup argument와 KZG·IPA commitment의 역할을 분리합니다.",
        },
        {
          label: "Protocol rounds",
          detail:
            "prover commitment와 verifier challenge가 어떤 순서로 transcript에 들어가는지 추적합니다.",
        },
      ]}
      readingHint="KZG와 PLONKish 표를 먼저 구분하고, gate·copy·lookup을 잡은 뒤 prover/verifier round와 최적화로 내려가세요."
    />
  );
}
