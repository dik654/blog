export const C = {
  host: "#6366f1",
  fabric: "#06b6d4",
  rdma: "#f59e0b",
  good: "#10b981",
  risk: "#ef4444",
  neutral: "#71717a",
};

export const STEPS = [
  {
    label: "네트워크 선택은 port rate가 아니라 traffic matrix에서 시작한다",
    body: "source·destination, message size, 동시 flow와 burst를 workload phase별로 기록해 실제 east-west 수요를 만듭니다.",
  },
  {
    label: "application은 line rate가 아닌 goodput과 tail을 본다",
    body: "protocol·copy·queue·retransmission을 지난 완료 시간, CPU/GPU wait와 전달된 payload를 측정합니다.",
  },
  {
    label: "leaf-spine capacity는 path와 oversubscription으로 계산한다",
    body: "host port 합계, uplink, ECMP 분산과 한 link 장애 뒤 남는 경로를 함께 확인합니다.",
  },
  {
    label: "RDMA는 data path를 줄이지만 control·recovery는 남는다",
    body: "등록된 memory와 NIC DMA를 사용하면서도 queue 설정, completion, congestion과 오류 복구는 software가 운영합니다.",
  },
  {
    label: "fabric은 실제 workload와 장애 상태로 승인한다",
    body: "socket Ethernet·RoCE·InfiniBand를 같은 topology와 collective 조건에서 비교하고 counter와 복구 시간까지 저장합니다.",
  },
];
