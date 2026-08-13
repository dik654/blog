import TopicPrimer from "@/components/articles/topic-primer";

export default function Overview() {
  return (
    <TopicPrimer
      title="유한체 구현: 수식과 limb 메모리 사이"
      question="mod p 연산은 실제 Rust 코드에서 어떤 표현과 reduction을 거칠까?"
      thesis="수학의 field element는 코드에서 여러 u64 limb와 representation invariant로 나타납니다. Montgomery form은 반복 나눗셈을 피하고, 연산자 오버로딩은 이 불변식을 API 뒤에 감추며, Fr은 곡선점에 곱하는 scalar field라는 역할을 가집니다."
      points={[
        {
          label: "canonical representation",
          detail: "외부 byte 표현과 내부 Montgomery limb 표현을 구분합니다.",
        },
        {
          label: "reduction",
          detail:
            "덧셈·곱셈 뒤 값이 항상 [0,p) 범위로 돌아오는 경로를 추적합니다.",
        },
        {
          label: "field 역할",
          detail:
            "base field Fq와 scalar field Fr은 modulus와 용도가 다른 타입입니다.",
        },
      ]}
      readingHint="PrimeRepr의 메모리 표현에서 시작해 Montgomery 곱셈을 본 뒤, 마지막에 Fr API가 불변식을 어떻게 지키는지 확인하세요."
    />
  );
}
