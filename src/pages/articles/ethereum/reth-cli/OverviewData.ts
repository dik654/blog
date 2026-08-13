export interface DesignChoice {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
  codeRefKeys?: string[];
}

export const DESIGN_CHOICES: readonly DesignChoice[] = [
  {
    id: "components",
    label: "Component traits",
    role: "책임별 구현 교체",
    details:
      "Pool, EVM, consensus, network와 payload/RPC add-ons를 명시적 trait bounds로 조립한다.",
    why: "변형 범위를 파일 수나 재사용률 숫자가 아니라 실제 type contract로 확인할 수 있다.",
    color: "#6366f1",
    codeRefKeys: ["node-components"],
  },
  {
    id: "typestate",
    label: "Builder states",
    role: "초기화 순서 보존",
    details:
      "types, components와 add-ons가 준비된 뒤에만 launch surface가 나타나도록 builder state를 전이한다.",
    why: "런타임의 부분 초기화 실패를 줄이지만 외부 I/O와 task failure까지 컴파일 타임에 없애는 것은 아니다.",
    color: "#f59e0b",
    codeRefKeys: ["builder-states", "builder-final"],
  },
  {
    id: "lifecycle",
    label: "Launch lifecycle",
    role: "기동·감시·종료",
    details:
      "storage와 provider를 연 뒤 services를 연결하고 task handles, hooks와 shutdown을 full-node handle에 모은다.",
    why: "새 node type도 bootstrap 순서를 다시 작성하지 않고 필요한 component boundary만 구현할 수 있다.",
    color: "#10b981",
    codeRefKeys: ["cli-main", "builder-node"],
  },
] as const;
