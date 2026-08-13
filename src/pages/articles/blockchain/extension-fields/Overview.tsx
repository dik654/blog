import TopicPrimer from "@/components/articles/topic-primer";

export default function Overview() {
  return (
    <TopicPrimer
      title="확장체 tower: Fp에서 Fp12까지 쌓는 이유"
      question="pairing 구현은 왜 하나의 거대한 체 대신 Fp2→Fp6→Fp12를 쌓을까?"
      thesis="확장체는 base field에 없는 원소를 다항식 몫으로 추가합니다. tower 구조는 같은 Fp12를 더 작은 계층의 연산으로 분해해 곱셈·제곱·역원을 최적화하고, Frobenius 같은 구조를 재사용하게 합니다."
      points={[
        {
          label: "차수",
          detail:
            "Fp2·Fp6·Fp12의 숫자는 원소 개수가 아니라 base field에 대한 벡터 공간 차수입니다.",
        },
        {
          label: "비가약 다항식",
          detail:
            "각 층은 특정 비가약 다항식으로 몫을 취해 field 성질을 유지합니다.",
        },
        {
          label: "tower 최적화",
          detail:
            "하위 field의 sparse multiplication과 conjugation을 상위 연산에 재사용합니다.",
        },
      ]}
      readingHint="각 층에서 원소 표현, defining polynomial, multiplication rule 세 가지를 확인한 뒤 다음 층으로 올라가세요."
    />
  );
}
