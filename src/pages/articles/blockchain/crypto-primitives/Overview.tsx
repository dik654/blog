import TopicPrimer from "@/components/articles/topic-primer";

export default function Overview() {
  return (
    <TopicPrimer
      title="암호 프리미티브: 같은 ‘보안 기능’으로 묶지 않기"
      question="해시·커밋먼트·서명·군 연산은 각각 무엇을 보장할까?"
      thesis="Poseidon은 회로 안에서 값의 무결성을 압축하고, Merkle commitment는 많은 값 중 일부를 열며, Schnorr와 Ed25519는 비밀키 소유자가 메시지에 동의했음을 증명합니다. 아벨군은 이 구성들이 기대는 대수적 연산 규칙입니다."
      points={[
        {
          label: "해시와 커밋먼트",
          detail:
            "해시는 입력을 짧게 묶고, commitment는 나중에 특정 값을 열어 일관성을 증명하는 프로토콜입니다.",
        },
        {
          label: "서명과 증명",
          detail:
            "서명은 메시지 승인과 키 소유를 다루며, 일반 영지식 증명의 계산 무결성과 범위가 다릅니다.",
        },
        {
          label: "대수 구조",
          detail:
            "군·체의 성질이 어떤 조합과 역연산이 안전하게 가능한지 정합니다.",
        },
      ]}
      readingHint="각 절에서 ‘입력·출력·보장·공격자가 모르는 것’ 네 칸을 채우며 비교하세요."
    />
  );
}
