import { defineNarrativeFlow } from "@/components/viz/narrative-flow";

export const STEPS = defineNarrativeFlow([
  {
    label: "조회 시점과 데이터 종류를 명시한다",
    body: "latest·historical·pending 중 어느 state인지, account·storage·header·receipt 중 무엇을 읽는지에 따라 provider 구성이 달라진다.",
  },
  {
    label: "좁은 trait가 필요한 기능만 노출한다",
    body: "StateProvider, BlockReader, HeaderProvider 같은 capability trait을 조합해 caller가 저장 backend 전체에 결합되지 않게 한다.",
  },
  {
    label: "in-memory execution 결과를 overlay한다",
    body: "canonical head 부근이나 pending execution은 BundleState 같은 변경 집합을 영속 상태 위에 적용해 읽는다.",
  },
  {
    label: "storage settings가 V1·V2 physical route를 선택한다",
    body: "V1 MDBX tables 또는 V2 RocksDB indices·static-file changesets를 data kind에 맞춰 사용한다.",
  },
  {
    label: "availability를 포함한 domain result를 반환한다",
    body: "value가 없는 경우에도 nonexistent, pruned, unsupported context를 구분해 physical backend 세부사항을 caller에서 숨긴다.",
  },
]);
