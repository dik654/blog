import TopicPrimer from "@/components/articles/topic-primer";

export default function Overview() {
  return (
    <TopicPrimer
      title="제약 시스템: 프로그램을 검증 가능한 식으로 바꾸기"
      question="일반 프로그램의 실행이 어떻게 유한체 위의 등식 집합이 될까?"
      thesis="R1CS는 계산을 곱셈 제약으로 쪼개고, gadget은 반복되는 계산 조각을 재사용하며, QAP는 그 제약 전체를 다항식 관계로 옮깁니다. 세 용어는 서로 경쟁하는 방식이 아니라 같은 변환 파이프라인의 서로 다른 표현입니다."
      points={[
        {
          label: "Witness와 constraint",
          detail:
            "witness는 실행에서 나온 값이고 constraint는 그 값이 지켜야 할 관계입니다.",
        },
        {
          label: "R1CS와 gadget",
          detail:
            "R1CS는 식의 표준 형식, gadget은 hash·range check 같은 재사용 가능한 제약 묶음입니다.",
        },
        {
          label: "QAP의 역할",
          detail:
            "많은 행 제약을 다항식 나눗셈 하나로 묶어 pairing 기반 SNARK가 다룰 수 있게 합니다.",
        },
      ]}
      readingHint="먼저 작은 산술 회로를 R1CS 한 행으로 쓰고, gadget의 비용을 센 뒤, 마지막에 QAP 변환을 따라가세요."
    />
  );
}
