export const C = {
  power: "#6366f1",
  heat: "#f59e0b",
  cool: "#06b6d4",
  safe: "#10b981",
  risk: "#ef4444",
  neutral: "#71717a",
};

export const STEPS = [
  {
    label: "서버 입력 전력은 계산을 거쳐 거의 모두 열이 된다",
    body: "component 정격만 더하지 않고 PSU 손실과 fan·memory·network를 포함한 실제 AC 입력을 열 부하의 출발점으로 둡니다.",
  },
  {
    label: "정격·steady·burst를 다른 시간 척도로 측정한다",
    body: "제품 사양은 상한 검토에, rPDU와 BMC 시계열은 workload와 여러 노드의 실제 동시 부하 검증에 사용합니다.",
  },
  {
    label: "열은 component에서 facility 밖까지 이어서 배출한다",
    body: "heatsink 또는 cold plate, air·coolant, rack, CRAH·CDU와 heat rejection 중 한 구간도 포화되지 않아야 합니다.",
  },
  {
    label: "redundancy는 한 경로가 사라진 상태의 용량이다",
    body: "PSU 개수보다 upstream 독립성과 남은 feed의 usable capacity를 계산하고 실제 전환 시험으로 확인합니다.",
  },
  {
    label: "마지막에는 전력·온도·스로틀·누수 telemetry로 운영 상태를 검증한다",
    body: "기준선을 만들고 경보가 power cap, workload drain, 안전 종료와 정비 절차로 이어지는지 주기적으로 훈련합니다.",
  },
];
