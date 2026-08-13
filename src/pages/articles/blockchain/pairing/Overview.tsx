import TopicPrimer from "@/components/articles/topic-primer";

export default function Overview() {
  return (
    <TopicPrimer
      title="Pairing: 두 곡선군의 관계를 target field로 옮기기"
      question="왜 Miller loop와 final exponentiation을 나눠 계산할까?"
      thesis="pairing은 G1×G2의 bilinear 관계를 GT로 보내는 함수입니다. Miller loop는 line function을 누적해 중간값을 만들고, final exponentiation은 그 값을 올바른 target subgroup에 놓아 검증 가능한 pairing 값으로 완성합니다."
      points={[
        {
          label: "입력군과 출력군",
          detail: "G1·G2 점과 Fp12의 GT 원소를 같은 타입처럼 다루지 않습니다.",
        },
        {
          label: "Miller loop",
          detail:
            "scalar bit를 따라 doubling·addition line을 평가하고 곱합니다.",
        },
        {
          label: "Final exponentiation",
          detail:
            "easy part와 hard part로 나눠 Frobenius·cyclotomic 최적화를 사용합니다.",
        },
      ]}
      readingHint="bilinearity의 목적을 먼저 잡고 Miller loop의 중간값과 최종 pairing 값을 구분한 뒤 수학적 기초를 확인하세요."
    />
  );
}
