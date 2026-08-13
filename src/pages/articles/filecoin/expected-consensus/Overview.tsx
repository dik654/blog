import TopicPrimer from "@/components/articles/topic-primer";

export default function Overview() {
  return (
    <TopicPrimer
      title="Expected Consensus: 여러 block을 tipset으로 선택하기"
      question="Filecoin은 한 epoch에 여러 leader가 나와도 어떻게 하나의 chain을 선택할까?"
      thesis="storage power에 비례한 Poisson sortition이 여러 block producer를 뽑고, 같은 부모와 height를 가리키는 호환 block이 tipset을 이룹니다. 노드는 block validation을 거친 뒤 weight가 더 큰 chain을 선택합니다."
      points={[
        {
          label: "Sortition",
          detail:
            "VRF와 quality-adjusted power가 epoch별 win count를 결정합니다.",
        },
        {
          label: "Tipset",
          detail:
            "같은 height라고 모두 묶이는 것이 아니라 부모·state 조건이 맞아야 합니다.",
        },
        {
          label: "Validation과 weight",
          detail: "유효한 block 집합과 chain 선택 규칙을 분리해 추적합니다.",
        },
      ]}
      readingHint="leader election→tipset 구성→block validation→chain weight 순서로 읽고, F3 finality와는 별도 계층임을 유지하세요."
    />
  );
}
