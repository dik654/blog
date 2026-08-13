export const B300_PORT_MAP = [
  { osfp: 1, pci: "ed:00", rdma: ["mlx5_22", "mlx5_23"] },
  { osfp: 2, pci: "97:00", rdma: ["mlx5_14", "mlx5_15"] },
  { osfp: 3, pci: "dc:00", rdma: ["mlx5_20", "mlx5_21"] },
  { osfp: 4, pci: "b9:00", rdma: ["mlx5_16", "mlx5_17"] },
  { osfp: 5, pci: "17:00", rdma: ["mlx5_0", "mlx5_1"] },
  { osfp: 6, pci: "70:00", rdma: ["mlx5_12", "mlx5_13"] },
  { osfp: 7, pci: "39:00", rdma: ["mlx5_6", "mlx5_7"] },
  { osfp: 8, pci: "5f:00", rdma: ["mlx5_10", "mlx5_11"] },
] as const;

export const B300_SWITCHLESS_PIPELINE = [
  {
    id: "inventory",
    label: "firmware·PCI·OSFP·cable inventory",
    artifact: "검증된 port map",
  },
  {
    id: "split",
    label: "800G port를 2×400GbE로 split",
    artifact: "16 logical Ethernet/RDMA ports",
  },
  {
    id: "cable",
    label: "노드 쌍별 direct cable topology",
    artifact: "cables.txt",
  },
  {
    id: "address",
    label: "링크별 /30 주소 생성",
    artifact: "node별 netplan/ip commands",
  },
  {
    id: "gid",
    label: "remote peer와 같은 /30 GID 선택",
    artifact: "patched NCCL build",
  },
  {
    id: "verify",
    label: "링크→RDMA→collective 단계별 검증",
    artifact: "재현 가능한 test ledger",
  },
] as const;

export const B300_SWITCHLESS_MEASUREMENT = {
  nodes: 2,
  gpusPerNode: 8,
  logicalLinks: 16,
  lineRateGbpsPerLink: 400,
  aggregateLineRateGbps: 6400,
  aggregateLineRateGbPerSec: 800,
  ncclAllReduceBusBandwidthGbPerSec: 787.211,
  ratioOfNominalLineRate: 787.211 / 800,
  warning:
    "nccl-tests busbw이며 application payload goodput·all workload throughput과 동일하지 않다.",
} as const;

export const SWITCHLESS_REQUIRED_ENV = [
  ["NCCL_IB_SWITCHLESS", "1", "peer-aware GID path 활성화"],
  ["NCCL_IB_SWITCHLESS_PREFIX", "30", "link별 /30을 정확히 매칭"],
  ["NCCL_IB_ROCE_VERSION_NUM", "2", "IPv4-mapped RoCE v2 GID로 제한"],
  ["NCCL_CROSS_NIC", "0", "동일 rail의 NIC를 유지"],
] as const;

export const B300_SWITCHLESS_SOURCE_LINKS = {
  dgx: {
    label: "NVIDIA DGX B300 user guide",
    href: "https://docs.nvidia.com/dgx/dgxb300-user-guide/introduction-to-dgxb300.html",
  },
  split: {
    label: "NVIDIA DGX OS 7: ConnectX-8 port splitting",
    href: "https://docs.nvidia.com/dgx/dgx-os-7-user-guide/system_configurations.html",
  },
  nccl: {
    label: "NVIDIA NCCL network environment variables",
    href: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html",
  },
  project: {
    label: "Sionic B300 ConnectX-8 netplan repository",
    href: "https://github.com/sionic-ai/b300-ConnectX-8-netplan",
  },
  patch: {
    label: "Sionic NCCL switchless patch",
    href: "https://github.com/sionic-ai/b300-ConnectX-8-netplan/blob/main/nccl-switchless-patch/nccl-switchless.patch",
  },
} as const;
