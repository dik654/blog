import TopicPrimer from "@/components/articles/topic-primer";

export default function AdvancedOverview() {
  return (
    <TopicPrimer
      title="EVM 고급 호출: opcode보다 실행 컨텍스트를 추적하기"
      question="CREATE·DELEGATECALL·STATICCALL은 address·code·storage·value를 어떻게 바꿀까?"
      thesis="이 opcode들은 모두 새 실행 프레임을 만들지만, 어떤 address의 code를 실행하고 어떤 storage를 쓰며 value와 쓰기 권한을 물려주는지가 다릅니다. 이름을 외우기보다 프레임의 소유권 표를 따라가야 합니다."
      points={[
        {
          label: "생성과 호출",
          detail:
            "CREATE 계열은 새 account와 code를 만들고 CALL 계열은 기존 code를 다른 컨텍스트에서 실행합니다.",
        },
        {
          label: "context 상속",
          detail:
            "DELEGATECALL은 caller의 address·storage·value를 유지한 채 다른 code를 빌립니다.",
        },
        {
          label: "쓰기 경계",
          detail:
            "STATICCALL은 하위 프레임까지 state write를 금지하고 위반 시 실행을 실패시킵니다.",
        },
      ]}
      readingHint="각 opcode마다 code address, context address, storage owner, msg.sender, msg.value, write permission을 표로 기록하세요."
    />
  );
}
