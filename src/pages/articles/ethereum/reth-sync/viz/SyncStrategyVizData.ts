import { defineNarrativeFlow } from "@/components/viz/narrative-flow";

export const STEPS = defineNarrativeFlow([
  {
    label: "consensus forkchoice가 동기화 목표를 정한다",
    body: "execution client는 consensus client가 전달한 safe·finalized·head 문맥과 peer data를 바탕으로 부족한 구간을 판단한다.",
  },
  {
    label: "staged pipeline이 역사 데이터를 채운다",
    body: "headers, bodies, sender recovery, execution, trie 관련 stage가 checkpoint를 남기며 catch-up한다.",
  },
  {
    label: "검증과 unwind가 잘못된 분기를 되돌린다",
    body: "stage 결과가 불일치하거나 canonical chain이 바뀌면 checkpoint와 changeset 경계에서 안전하게 unwind한 뒤 재실행한다.",
  },
  {
    label: "tip에 가까워지면 engine tree가 실시간 변경을 처리한다",
    body: "newPayload와 forkchoiceUpdated를 통해 block validation, canonicalization, reorg를 낮은 지연으로 이어간다.",
  },
  {
    label: "ExEx는 동기화 방식이 아니라 downstream extension이다",
    body: "확정·reorg 알림을 indexer 같은 외부 처리에 전달하지만 core node가 chain을 동기화하는 전략 자체를 대체하지 않는다.",
  },
]);
