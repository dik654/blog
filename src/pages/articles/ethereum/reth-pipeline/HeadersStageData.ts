export interface HeaderStep {
  title: string;
  desc: string;
}
export const HEADER_STEPS: readonly HeaderStep[] = [
  {
    title: "범위를 제한한다",
    desc: "checkpoint 이후부터 target까지 중 이번 호출이 처리할 bounded range를 선택한다.",
  },
  {
    title: "peer 응답을 수집한다",
    desc: "요청과 응답을 연결하고 누락·중복·순서 문제를 downloader 경계에서 처리한다.",
  },
  {
    title: "fork-aware rules를 검증한다",
    desc: "parent 연결과 ChainSpec에 따른 header fields를 확인한다.",
  },
  {
    title: "provider와 checkpoint를 진행시킨다",
    desc: "검증된 header와 canonical mapping만 저장하며 물리 backend와 batch 크기를 고정 가정하지 않는다.",
  },
] as const;
