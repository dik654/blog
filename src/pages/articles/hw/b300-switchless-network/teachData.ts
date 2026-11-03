import type { EngineeringDepthData } from "../../cloud/EngineeringDepthBlocks";
import type { HardwareTeachCase } from "../HardwareTeachOpening";

export const b300SwitchlessTeachCase: HardwareTeachCase = {
  incidentTitle: "모든 포트가 켜졌는데도 노드 3과 노드 7은 서로 통신하지 못했습니다",
  incident: [
    "(가정) B300 노드 여덟 대를 스위치 없이 완전연결망으로 묶었습니다. 노드마다 물리 포트 일곱 개를 사용했고 표시등도 모두 켜졌습니다. 그러나 노드 7에서 노드 3으로 가야 할 케이블 하나가 노드 6에 잘못 꽂혀 전체 collective가 시작되지 않았습니다.",
    "직결망에서는 포트가 켜졌다는 사실만으로 목적지까지 맞다는 뜻이 아닙니다. 물리 포트, 케이블 반대쪽, 두 논리 링크의 주소, RDMA GID, NCCL이 선택한 HCA가 모두 같은 상대 노드를 가리켜야 합니다.",
  ],
  pathTitle: "물리 라벨 하나를 실제 collective가 쓰는 통로까지 끊지 않고 잇습니다",
  path: [
    "먼저 섀시의 OSFP 라벨을 PCI function·netdev·RDMA device와 연결합니다. 그다음 케이블의 양 끝을 고정하고, 한 800G 물리 케이블에서 갈라진 두 400G 논리 링크에 서로 다른 /30 주소를 줍니다.",
    "마지막으로 상대 주소와 같은 /30의 local GID를 고르고 정확한 HCA만 허용한 뒤 2→4→8노드 collective를 실행합니다. 어느 단계에서든 원장과 다르면 더 큰 규모로 넘어가지 않습니다.",
  ],
  numberTitle: "8노드 완전연결망은 물리 케이블 28개와 노드당 포트 7개가 필요합니다",
  numbers: [
    "노드 쌍은 8×7÷2=28개입니다. 쌍마다 800G 물리 케이블 하나를 놓으면 전체 28개, 노드마다 다른 일곱 노드로 가는 포트 7개를 씁니다. 여덟 번째 포트는 남지만 별도로 연결·설정하지 않으면 자동 우회로가 아닙니다.",
    "각 물리 케이블은 split 뒤 두 400G 논리 링크를 만듭니다. 예를 들어 노드 3↔7은 10.137.1.0/30과 10.137.2.0/30 두 segment를 갖습니다. 물리 케이블 수와 논리 링크 수를 섞으면 주소·측정·장애 범위를 모두 잘못 셉니다.",
  ],
  steps: [
    { role: "물리 연결을 고정합니다", result: "OSFP 라벨과 양쪽 노드·PCI·netdev·RDMA device가 한 케이블 원장에서 만납니다." },
    { role: "두 논리 경로를 식별합니다", result: "각 400G 링크가 고유한 /30과 peer-matched RoCE v2 GID를 갖습니다." },
    { role: "작은 collective부터 확대합니다", result: "2→4→8노드에서 transport·correctness·tail을 확인하고 링크 손실 뒤 복구 경계를 기록합니다." },
  ],
  whyParts: [
    "중앙 스위치가 경로를 학습하거나 우회하지 않으므로 케이블 하나의 오배선이 곧 topology 변경입니다. 표시등과 ping만 통과해도 다른 peer의 subnet이나 다른 HCA를 고르면 collective는 실패할 수 있습니다.",
    "두 노드 사이에 물리 케이블 여덟 개를 몰아 넣은 처리량 실험과 여덟 노드 완전연결망은 다른 fixture입니다. 앞의 787.211GB/s를 뒤 구성의 pair bandwidth나 전체 collective 성능으로 옮겨 적을 수 없습니다.",
  ],
  terms: [
    { role: "스위치 없이 노드 쌍을 직접 잇는 구조", name: "Direct attach·switchless full mesh", boundary: "공식 NVIDIA의 일반 생산 아키텍처인 switched Spectrum-X와 구분하는 소규모 project 구성입니다." },
    { role: "한 물리 800G 포트를 두 경로로 나누는 설정", name: "2×400GbE port split", boundary: "물리 케이블 하나와 논리 링크 두 개는 같은 수량이 아닙니다." },
    { role: "상대 peer와 같은 subnet의 RDMA 주소를 고르는 절차", name: "Peer-aware GID selection", boundary: "공개 project patch의 동작이며 upstream NCCL의 일반 보장이 아닙니다." },
  ],
  next: "채택 조건은 링크가 켜지는 것이 아니라 28개 물리 edge와 56개 논리 path가 원장대로 이어지고, 2→4→8노드 collective와 링크 손실 드릴이 같은 revision에서 통과하는 것입니다.",
};

const checkedAt = "2026-11-02";

export const b300SwitchlessFieldLab: EngineeringDepthData = {
  ledgers: [{
    section: "mechanism",
    title: "8노드 직결망을 물리 edge부터 collective까지 검수하는 원장",
    question: "28개 물리 케이블과 56개 논리 링크가 같은 topology revision을 가리킵니까?",
    columns: ["층", "실물에서 확인할 것", "증거", "합격 조건"],
    rows: [
      ["physical", "OSFP·양쪽 node·cable serial", "28-edge manifest", "중복·누락·오배선 0"],
      ["logical", "PF·netdev·RDMA device·두 /30", "56-path manifest", "peer와 prefix 대칭"],
      ["transport", "GID·exact HCA·NCCL rail", "NCCL INFO log", "의도한 peer path만 선택"],
      ["collective", "2→4→8 node correctness·p95", "raw nccl-tests ledger", "error 0·승인 baseline"],
      ["failure", "한 link 제거와 복구", "drill timeline", "영향 pair 식별·자동 우회 오인 0"],
    ],
    conclusion: "Switchless의 합격 단위는 포트 하나가 아니라 물리 edge→논리 path→GID/HCA→collective가 같은 peer ID로 닫히는 전체 사슬입니다.",
  }],
  evidence: [{
    section: "source",
    eyebrow: "실물 확인",
    title: "노드 3↔7의 두 논리 링크를 먼저 확인한 뒤 규모를 늘립니다",
    question: "케이블이 다른 peer에 꽂혀도 단순 link-up 검사가 합격시키는 문제를 잡습니까?",
    body: "아래 명령의 interface와 RDMA device는 예시 자리가 아니라 현재 inventory에서 resolve해야 합니다. 2노드 pair test가 통과한 뒤 4노드, 마지막에 8노드 collective와 link-loss drill을 실행합니다.",
    language: "shell",
    command: "ip -br link\nip -br address\nrdma link show\nibdev2netdev\n# node3↔node7 logical path 1·2\nping -I <n3-link1> 10.137.1.2\nping -I <n3-link2> 10.137.2.2\nexport NCCL_DEBUG=INFO NCCL_DEBUG_SUBSYS=NET,GRAPH\nexport NCCL_IB_HCA='=mlx5_x,=mlx5_y'\nexport NCCL_IB_SWITCHLESS=1 NCCL_IB_SWITCHLESS_PREFIX=30\n<launcher> all_reduce_perf -b 8M -e 16G -f 2 -g 8",
    normal: {
      label: "정상 판독 · 예시 출력",
      output: "(예시 출력 — 실측 아님)\nphysical_edges=28 logical_paths=56\nnode3↔node7: 10.137.1.0/30, 10.137.2.0/30\nNET/IB: matched intended GID and exact HCA\n8-node validation errors=0",
      reading: "물리 edge 수, 두 논리 prefix, 선택한 GID/HCA와 collective 결과가 같은 topology revision에서 이어집니다.",
    },
    failure: {
      label: "실패 판독 · 예시 출력",
      output: "(예시 출력 — 실측 아님)\nnode7 OSFP3 link=UP\nmanifest peer=node3 observed peer=node6\n10.137.1.0/30 peer unreachable\nrank pair 3↔7 communicator timeout",
      reading: "Link UP을 합격으로 보지 않습니다. 노드 7의 edge를 drain하고 케이블 양끝·주소·GID를 고친 뒤 2노드부터 다시 확대합니다.",
    },
  }],
  sources: [
    { label: "NVIDIA DGX OS 7 · ConnectX-8 port splitting", href: "https://docs.nvidia.com/dgx/dgx-os-7-user-guide/system_configurations.html", claim: "800G port를 두 400GbE PF로 나누는 설정과 power-cycle 경계를 확인했습니다.", checkedAt },
    { label: "NVIDIA HGX AI Factory · Logical architecture", href: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/network-logical-architecture.html", claim: "공식 B300 생산 참조망이 switched Spectrum-X dual-plane임을 확인했습니다.", checkedAt },
    { label: "NVIDIA NCCL environment variables", href: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html", claim: "NCCL_IB_HCA exact match와 NCCL_CROSS_NIC의 rail 의미를 확인했습니다.", checkedAt },
    { label: "NVIDIA nccl-tests performance semantics", href: "https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md", claim: "algbw와 collective별 busbw 계산·해석 경계를 확인했습니다.", checkedAt },
    { label: "Sionic B300 ConnectX-8 netplan", href: "https://github.com/sionic-ai/b300-ConnectX-8-netplan", claim: "Cable manifest·/30 생성기·project measurement의 구현 범위를 확인했습니다.", checkedAt },
  ],
};
