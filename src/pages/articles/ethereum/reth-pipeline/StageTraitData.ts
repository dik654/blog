export interface TraitMethodItem {
  method: string;
  desc: string;
  detail: string;
}
export const STAGE_METHODS: readonly TraitMethodItem[] = [
  {
    method: "id()",
    desc: "진행 상태의 논리적 key",
    detail:
      "Pipeline이 Stage별 checkpoint와 dependency를 구분한다. physical storage key와는 provider 경계로 분리한다.",
  },
  {
    method: "execute()",
    desc: "bounded forward progress",
    detail:
      "목표·checkpoint·가용 dependency 안에서 일부 작업을 완료하고 새 checkpoint와 done 상태를 반환한다.",
  },
  {
    method: "unwind()",
    desc: "dependency-aware rollback",
    detail:
      "canonical 분기점이나 검증 가능한 지점까지 Stage 산출물과 checkpoint를 함께 되돌린다.",
  },
] as const;
