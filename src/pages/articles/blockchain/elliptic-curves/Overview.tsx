import TopicPrimer from "@/components/articles/topic-primer";

export default function Overview() {
  return (
    <TopicPrimer
      title="타원곡선군: 점의 덧셈에서 G1·G2까지"
      question="왜 곡선 위 점을 더하는 연산이 서명과 SNARK의 기반이 될까?"
      thesis="타원곡선 암호에서 사용하는 대상은 곡선 그림 자체가 아니라 유한체 위 점들이 이루는 순환군입니다. G1과 G2는 pairing의 서로 다른 입력군이며, 좌표가 놓인 체와 효율적인 표현이 다릅니다."
      points={[
        {
          label: "점과 스칼라",
          detail:
            "점 덧셈과 scalar multiplication을 정수 곱셈과 구분해야 합니다.",
        },
        {
          label: "G1과 G2",
          detail:
            "G1은 base field, G2는 보통 extension field 위에 놓이며 같은 좌표 타입이 아닙니다.",
        },
        {
          label: "subgroup",
          detail:
            "곡선 위 점이라는 사실만으로 충분하지 않고 올바른 소수 차수 부분군에 속해야 합니다.",
        },
      ]}
      readingHint="먼저 G1의 점 연산을 잡고, G2가 왜 확장체를 쓰는지 본 뒤 BN254 pairing 글로 이어가세요."
    />
  );
}
