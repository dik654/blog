import type { EngineeringDepthData } from "../cloud/EngineeringDepthBlocks";

const checkedAt = "2026-10-08";

type HardwareLabSpec = {
  title: string;
  question: string;
  rows: readonly (readonly string[])[];
  conclusion: string;
  evidenceTitle: string;
  evidenceQuestion: string;
  body: string;
  command: string;
  normal: string;
  normalReading: string;
  failure: string;
  failureReading: string;
  sources: EngineeringDepthData["sources"];
};

function hardwareLab(spec: HardwareLabSpec): EngineeringDepthData {
  return {
    ledgers: [{
      section: "mechanism",
      title: spec.title,
      question: spec.question,
      columns: ["층", "실물에서 확인할 것", "증거", "판정"],
      rows: spec.rows,
      conclusion: spec.conclusion,
    }],
    evidence: [{
      section: "source",
      eyebrow: "실물 확인",
      title: spec.evidenceTitle,
      question: spec.evidenceQuestion,
      body: spec.body,
      language: "shell",
      command: spec.command,
      normal: { label: "정상 판독 · 예시 출력", output: `(예시 출력 — 실측 아님)\n${spec.normal}`, reading: spec.normalReading },
      failure: { label: "실패 판독 · 예시 출력", output: `(예시 출력 — 실측 아님)\n${spec.failure}`, reading: spec.failureReading },
    }],
    sources: spec.sources,
  };
}

const linuxPci = { label: "Linux kernel · PCI sysfs", href: "https://docs.kernel.org/PCI/sysfs-pci.html", claim: "PCI device·resource·NUMA 정보를 sysfs에서 읽는 공식 interface를 확인했습니다.", checkedAt };
const nvidiaSmi = { label: "NVIDIA · nvidia-smi", href: "https://docs.nvidia.com/deploy/nvidia-smi/index.html", claim: "GPU inventory·power·temperature·ECC·topology 관련 query 범위를 확인했습니다.", checkedAt };
const dcgm = { label: "NVIDIA DCGM diagnostics", href: "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/dcgm-diagnostics.html", claim: "deployment 전후 GPU 진단 수준과 failure reporting 범위를 확인했습니다.", checkedAt };
const fio = { label: "fio documentation", href: "https://fio.readthedocs.io/en/latest/fio_doc.html", claim: "block size·queue depth·direct I/O·runtime·percentile을 명시하는 workload model을 확인했습니다.", checkedAt };
const nvme = { label: "NVMe CLI", href: "https://github.com/linux-nvme/nvme-cli", claim: "NVMe identify·SMART/health·error log를 읽는 표준 Linux 도구와 명령을 확인했습니다.", checkedAt };
const redfish = { label: "DMTF Redfish schema", href: "https://redfish.dmtf.org/schemas/v1/", claim: "Power·Thermal·Sensor·Chassis inventory의 표준 resource schema를 확인했습니다.", checkedAt };
const ipmi = { label: "ipmitool", href: "https://github.com/ipmitool/ipmitool", claim: "BMC의 sensor·SEL·power reading을 읽는 명령 범위를 확인했습니다.", checkedAt };
const rdmaCore = { label: "rdma-core", href: "https://github.com/linux-rdma/rdma-core", claim: "RDMA userspace library와 rdma/ibverbs 진단 도구의 upstream 구현을 확인했습니다.", checkedAt };
const nccl = { label: "NVIDIA NCCL environment variables", href: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html", claim: "transport 선택과 debug log를 읽는 환경 변수 및 production 주의사항을 확인했습니다.", checkedAt };
const ncclTests = { label: "NVIDIA nccl-tests", href: "https://github.com/NVIDIA/nccl-tests", claim: "collective correctness와 out-of-place bandwidth를 node/GPU 규모별로 측정하는 공식 test를 확인했습니다.", checkedAt };

export const gpuComparisonFieldLab = hardwareLab({
  title: "가속기 후보를 이름이 아니라 workload 결과로 비교하는 원장",
  question: "같은 모델·정밀도·batch·전력 조건에서 처리량과 오류를 비교했습니까?",
  rows: [["inventory", "정확한 SKU·memory·driver·power limit", "nvidia-smi CSV", "후보 조건 동일성"], ["workload", "tokens/s 또는 step time·p95 latency", "benchmark raw JSON", "업무 목표 충족"], ["건강", "ECC·Xid·thermal throttle", "DCGM·kernel log", "숫자 왜곡 여부"], ["비용", "서버·망·전력 포함 TCO", "BOM·kWh 원장", "단위 업무당 비용"]],
  conclusion: "peak FLOPS는 후보를 좁히는 값이고, 최종 선택은 같은 workload의 처리량·오류·전력·비용 증거로 닫습니다.",
  evidenceTitle: "benchmark 전에 실제 GPU와 제한 조건을 고정합니다",
  evidenceQuestion: "두 결과가 다른 이유가 GPU인지 power limit·clock·driver 차이인지 구분할 수 있습니까?",
  body: "query 출력과 benchmark raw file을 같은 run ID 아래 둡니다. application benchmark가 끝난 뒤 ECC·Xid·throttle 이유도 다시 수집합니다.",
  command: "nvidia-smi --query-gpu=index,name,uuid,memory.total,driver_version,power.limit,temperature.gpu,clocks_throttle_reasons.active --format=csv\nsudo dcgmi diag --run 1 --json\njournalctl -k --since '-30 min' | grep -Ei 'NVRM|Xid'",
  normal: "GPU 0, B300, GPU-..., 294912 MiB, 580..., 1400 W, 61 C, Not Active\nDCGM overall: Pass\nXid: none",
  normalReading: "같은 조건이 확인된 결과만 비교 표에 올립니다. idle temperature가 아니라 benchmark 구간의 telemetry를 봅니다.",
  failure: "GPU 3, B300, ..., 1000 W, 84 C, HW Thermal Slowdown\nXid 79",
  failureReading: "처리량 저하를 SKU 성능으로 결론내리지 않습니다. 냉각·전력·PCIe·GPU health를 고친 뒤 해당 run을 폐기하고 재측정합니다.",
  sources: [nvidiaSmi, dcgm, { label: "NVIDIA GPU deployment guide", href: "https://docs.nvidia.com/datacenter/tesla/deployment-guide/", claim: "driver·hardware·health verification의 배포 전후 점검 항목을 확인했습니다.", checkedAt }, { label: "MLPerf Inference", href: "https://github.com/mlcommons/inference", claim: "system·scenario·accuracy·performance condition을 함께 공개하는 benchmark 방법을 비교 기준으로 확인했습니다.", checkedAt }, linuxPci],
});

export const acceleratorVendorFieldLab = hardwareLab({
  title: "벤더별 결과를 공통 workload 계약으로 정규화하는 원장",
  question: "서로 다른 SDK 명칭을 같은 업무 단위와 실패 기준으로 비교했습니까?",
  rows: [["host", "OS·kernel·device·firmware", "host manifest", "지원 조합 여부"], ["model", "동일 graph·precision·accuracy", "artifact hash·quality score", "결과 동등성"], ["runtime", "compiler/runtime version·fallback op", "compile log", "가속 범위"], ["operation", "monitoring·upgrade·support", "runbook·case SLA", "운영 비용"]],
  conclusion: "벤더마다 tool 이름은 달라도 입력 artifact·정확도 gate·처리량·실패 복구를 공통 열로 두면 비교가 가능합니다.",
  evidenceTitle: "세 플랫폼의 실물 manifest를 같은 열로 수집합니다",
  evidenceQuestion: "장치가 보인다는 것과 framework가 의도한 backend를 썼다는 것을 구분할 수 있습니까?",
  body: "명령이 없는 플랫폼에서는 빈칸을 0으로 쓰지 않고 ‘미측정’으로 남깁니다. framework profiler에서 CPU fallback 여부를 별도 확인합니다.",
  command: "lspci -Dnn | grep -Ei 'NVIDIA|AMD|Huawei|accelerator'\nnvidia-smi -L                 # NVIDIA host\nrocminfo | sed -n '1,80p'    # AMD host\nnpu-smi info                 # Ascend host, 설치된 경우",
  normal: "vendor=NVIDIA device=B300 count=8 runtime=CUDA-13.x\nvendor=AMD device=MI... count=8 runtime=ROCm-...\nartifact_sha256=<same>, accuracy_gate=pass",
  normalReading: "장치 수보다 동일 artifact와 accuracy gate가 먼저입니다. 그다음 처리량과 운영 도구를 비교합니다.",
  failure: "device count=8\nprofiler: 17 unsupported ops executed on CPU\naccuracy_gate=fail",
  failureReading: "가속기 숫자가 높아도 비교에서 제외합니다. graph 변환·operator 지원·정밀도 차이를 고친 뒤 정확도부터 다시 통과시킵니다.",
  sources: [linuxPci, nvidiaSmi, { label: "AMD ROCm documentation", href: "https://rocm.docs.amd.com/", claim: "ROCm system requirement·runtime·profiling·management 도구의 공식 범위를 확인했습니다.", checkedAt }, { label: "Huawei Ascend documentation", href: "https://www.hiascend.com/document", claim: "CANN과 npu-smi 기반 device 운영 문서의 공식 경로를 확인했습니다.", checkedAt }, { label: "MLPerf Training", href: "https://github.com/mlcommons/training", claim: "서로 다른 system의 workload·quality·time-to-train 비교 조건을 확인했습니다.", checkedAt }],
});

export const serverVsDesktopFieldLab = hardwareLab({
  title: "서버 기능을 가용성·확장·복구 증거로 바꾸는 원장",
  question: "ECC·BMC·redundant PSU·PCIe lane이 실제 운영 요구에 쓰입니까?",
  rows: [["memory", "ECC와 DIMM topology", "dmidecode·EDAC", "오류 탐지·용량"], ["I/O", "slot별 link width·NUMA", "lspci·numactl", "GPU/NIC 병목"], ["management", "out-of-band 접속·SEL", "BMC inventory·event log", "OS down 복구"], ["power", "A/B PSU와 실제 feed", "PSU state·rack PDU", "한 경로 고장 시험"]],
  conclusion: "‘서버급’은 제품 분류가 아니라 필요한 고장 감지·원격 복구·I/O 확장·전원 이중화가 실물에서 검증된 상태입니다.",
  evidenceTitle: "섀시의 server 기능이 채워져 있는지 읽습니다",
  evidenceQuestion: "redundant PSU가 두 개 꽂혔다는 사실과 서로 다른 feed에 연결됐다는 사실을 구분합니까?",
  body: "OS inventory와 BMC·rack PDU evidence를 같은 asset ID에 묶습니다. 장착 여부만으로 redundancy를 승인하지 않습니다.",
  command: "sudo dmidecode -t memory -t slot -t system\nlspci -tv\nnumactl --hardware\nsudo ipmitool sdr elist\nsudo ipmitool sel elist",
  normal: "ECC=Multi-bit ECC, DIMMs balanced\nGPU0+NIC0 NUMA node 0\nPSU1=OK feed=A, PSU2=OK feed=B",
  normalReading: "memory·I/O·management·power 네 요구가 모두 증거로 닫혀야 이 workload에 server 구성이 필요했다고 설명할 수 있습니다.",
  failure: "GPU link downgraded x16→x8\nPSU1 and PSU2: same rack PDU feed A",
  failureReading: "장치는 동작해도 성능 또는 redundancy 요구는 실패입니다. slot population과 실제 cable/feed를 수정합니다.",
  sources: [linuxPci, ipmi, redfish, { label: "Linux NUMA policy", href: "https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html", claim: "task·VMA·system default의 NUMA memory allocation policy를 확인했습니다.", checkedAt }, { label: "DMTF SMBIOS", href: "https://www.dmtf.org/standards/smbios", claim: "system·memory·slot inventory의 표준 구조를 확인했습니다.", checkedAt }],
});

export const serverCpuFieldLab = hardwareLab({
  title: "CPU 선택을 core 수가 아니라 lane·channel·NUMA 경로로 검증하는 원장",
  question: "GPU와 NIC가 어느 socket의 PCIe root에 있고 memory bandwidth가 workload를 받칩니까?",
  rows: [["CPU", "socket·core·NUMA node", "lscpu", "scheduler pinning"], ["PCIe", "GPU/NIC link width·speed·root", "lspci tree/status", "lane budget"], ["memory", "channel population·local/remote", "dmidecode·numactl", "bandwidth 균형"], ["workload", "CPU util·steal·memory BW", "perf/profile", "core 또는 I/O 병목"]],
  conclusion: "GPU 서버 CPU는 더 많은 core가 아니라 필요한 device lane과 memory channel을 의도한 NUMA 경로로 제공하는지로 고릅니다.",
  evidenceTitle: "논리 사양과 실제 slot population을 대조합니다",
  evidenceQuestion: "PCIe lane이 충분하다는 datasheet 판단이 실제 x16 link로 이어졌습니까?",
  body: "각 GPU·NIC의 PCI address를 NUMA node와 묶고 negotiated width/speed를 봅니다. 한 socket에 device가 몰리면 설계도와 BIOS·slot을 함께 확인합니다.",
  command: "lscpu -e=CPU,NODE,SOCKET,CORE,ONLINE\nnumactl --hardware\nlspci -tv\nfor d in /sys/bus/pci/devices/*; do printf '%s ' \"$d\"; cat \"$d/numa_node\" 2>/dev/null; done\nsudo lspci -vv -s <gpu-bdf> | grep -E 'LnkCap|LnkSta'",
  normal: "GPU0 BDF=0000:18:00.0 NUMA=0 LnkSta=32GT/s x16\nNIC0 BDF=0000:31:00.0 NUMA=0 LnkSta=32GT/s x16",
  normalReading: "GPU와 주 통신 NIC가 같은 NUMA 경로이고 link가 기대 폭/속도로 협상됐는지 확인합니다.",
  failure: "GPU3 NUMA=0 LnkCap=x16 LnkSta=x8\nall NICs NUMA=1",
  failureReading: "CPU SKU 탓으로 결론내리기 전에 riser·slot bifurcation·BIOS·장착 위치를 확인합니다.",
  sources: [linuxPci, { label: "Linux lscpu", href: "https://man7.org/linux/man-pages/man1/lscpu.1.html", claim: "CPU·socket·core·cache·NUMA topology 출력의 의미를 확인했습니다.", checkedAt }, { label: "Linux numactl", href: "https://man7.org/linux/man-pages/man8/numactl.8.html", claim: "NUMA hardware inventory와 workload binding 명령을 확인했습니다.", checkedAt }, { label: "PCI Express specifications", href: "https://pcisig.com/specifications", claim: "link width·speed와 PCIe generation의 공식 표준 경로를 확인했습니다.", checkedAt }, { label: "Linux perf", href: "https://perf.wiki.kernel.org/index.php/Main_Page", claim: "CPU·cache·memory 관련 성능 counter 측정 도구의 범위를 확인했습니다.", checkedAt }],
});

export const nvmeFieldLab = hardwareLab({
  title: "NVMe 한 장을 model·health·path·workload 네 증거로 승인하는 원장",
  question: "순간 peak가 아니라 thermal·wear·tail latency까지 포함해 납품 판정을 합니까?",
  rows: [["identity", "model·serial·firmware·namespace", "nvme list/id", "BOM 대조"], ["path", "PCIe generation·width·NUMA", "lspci/sysfs", "link downgrade 검사"], ["health", "temperature·wear·media error", "SMART/error log", "교체 기준"], ["workload", "block·depth·mix·duration별 p99", "fio JSON", "SLO 통과"]],
  conclusion: "NVMe 성능은 ‘7GB/s’ 한 줄이 아니라 장치 상태와 path, workload 조건, 지속 시간, tail latency가 묶인 결과입니다.",
  evidenceTitle: "벤치마크 전에 SMART와 PCIe link를 고정합니다",
  evidenceQuestion: "느린 결과가 NAND 특성인지 thermal throttle·link downgrade인지 구분할 수 있습니까?",
  body: "raw device fio는 데이터를 파괴할 수 있으므로 소유한 빈 test namespace에서만 수행합니다. 운영 filesystem은 승인된 test file로 범위를 제한합니다.",
  command: "sudo nvme list\nsudo nvme smart-log /dev/nvme0\nsudo nvme error-log /dev/nvme0\nsudo lspci -vv -s <nvme-bdf> | grep -E 'LnkCap|LnkSta'\nfio --name=read --filename=<approved-test-file> --rw=read --bs=1M --iodepth=32 --direct=1 --time_based=1 --runtime=120 --output-format=json",
  normal: "critical_warning=0, media_errors=0, temperature=48C\nLnkSta=32GT/s x4\nread_bw=13.2GiB/s p99=3.4ms",
  normalReading: "health와 link가 정상인 상태에서 같은 fio profile의 baseline과 비교합니다.",
  failure: "temperature=82C, warning_temp_time=730s\nLnkCap=x4 LnkSta=x2\np99=48ms",
  failureReading: "SSD 모델을 탈락시키기 전에 냉각과 slot/link를 고칩니다. media error나 wear threshold면 성능 시험보다 교체 절차가 먼저입니다.",
  sources: [nvme, fio, linuxPci, { label: "NVM Express specifications", href: "https://nvmexpress.org/specifications/", claim: "controller·namespace·SMART/health·log page의 표준 정의를 확인했습니다.", checkedAt }, { label: "Linux block layer statistics", href: "https://docs.kernel.org/admin-guide/iostats.html", claim: "device I/O 누적·in-flight·latency 해석의 kernel 기준을 확인했습니다.", checkedAt }],
});

export const storageComparisonFieldLab = hardwareLab({
  title: "로컬·공유·객체 저장소를 같은 I/O 생애로 비교하는 원장",
  question: "데이터 ingest·training read·checkpoint·복구 중 어느 경로를 최적화합니까?",
  rows: [["data set", "file 수·크기·총량·read pattern", "manifest", "metadata/throughput 비중"], ["client", "cache·mount·queue·parallelism", "mount/fio/IOR config", "측정 재현"], ["storage", "aggregate bandwidth·IOPS·metadata", "server telemetry", "bottleneck 위치"], ["recovery", "삭제·corruption·site failure", "snapshot/restore drill", "RPO·RTO"]],
  conclusion: "저장소 선택은 한 benchmark의 승자가 아니라 데이터 생애의 각 단계가 요구하는 throughput·metadata·복구를 함께 만족하는 구성입니다.",
  evidenceTitle: "page cache를 통과한 숫자와 storage 숫자를 구분합니다",
  evidenceQuestion: "두 번째 실행만 빨라진 결과를 shared storage 성능으로 오해하지 않습니까?",
  body: "client와 storage telemetry를 동시에 수집하고 cold/warm cache 조건을 표시합니다. production cache를 임의로 drop하지 않습니다.",
  command: "findmnt -T <dataset-path> -o TARGET,SOURCE,FSTYPE,OPTIONS\nfio --name=seqread --directory=<approved-test-dir> --rw=read --bs=1M --iodepth=32 --numjobs=8 --direct=1 --runtime=180 --time_based=1 --group_reporting=1\niostat -x 1\nnfsiostat 1 10   # NFS인 경우",
  normal: "direct=1 aggregate=48GiB/s p99=7ms\nclient NIC 62%, storage CPU 55%\nrepeat delta <5%",
  normalReading: "client 수와 file set, direct I/O 조건을 기록해 같은 profile끼리 비교합니다.",
  failure: "first run=8GiB/s, second run=61GiB/s\nbackend read=0.3GiB/s on second run",
  failureReading: "두 번째 값은 cache 효과입니다. 목적이 training warm cache인지 cold ingest인지 구분해 별도 기준으로 남깁니다.",
  sources: [fio, { label: "IOR and mdtest", href: "https://github.com/hpc/ior", claim: "parallel filesystem의 data와 metadata path를 분리 측정하는 HPC benchmark를 확인했습니다.", checkedAt }, { label: "Linux NFS client statistics", href: "https://man7.org/linux/man-pages/man8/nfsiostat.8.html", claim: "NFS operation·RTT·execute time·retransmission 해석을 확인했습니다.", checkedAt }, { label: "Linux page cache", href: "https://docs.kernel.org/admin-guide/mm/concepts.html", claim: "filesystem I/O와 page cache의 관계를 확인했습니다.", checkedAt }, { label: "NVIDIA GPUDirect Storage", href: "https://docs.nvidia.com/gpudirect-storage/index.html", claim: "storage와 GPU memory 사이 direct data path의 지원 경계와 구성 요구를 확인했습니다.", checkedAt }],
});

export const memoryFieldLab = hardwareLab({
  title: "메모리 용량을 DIMM 배치·ECC·NUMA·workload로 승인하는 원장",
  question: "총 GB가 맞아도 channel imbalance와 corrected error 증가를 찾을 수 있습니까?",
  rows: [["inventory", "slot·size·speed·rank·type", "dmidecode", "population rule"], ["topology", "NUMA별 free/used와 distance", "numactl", "local allocation"], ["RAS", "corrected/uncorrected error", "EDAC·MCE·SEL", "감시 또는 교체"], ["workload", "bandwidth·latency·swap·OOM", "perf/telemetry", "capacity vs bandwidth"]],
  conclusion: "메모리는 용량 합계가 아니라 channel이 균형 있게 채워지고 ECC 신호가 안정적이며 workload가 local bandwidth를 얻는 상태로 검수합니다.",
  evidenceTitle: "DIMM 한 장의 오류가 늘어나는지 slot까지 추적합니다",
  evidenceQuestion: "corrected ECC를 무시하거나 즉시 전체 서버 장애로 단정하지 않을 수 있습니까?",
  body: "누적 counter는 마지막 reset 시점과 함께 읽습니다. 증가율과 동일 DIMM/slot 반복 여부를 기준으로 vendor runbook의 교체 threshold를 적용합니다.",
  command: "sudo dmidecode -t memory\nnumactl --hardware\nsudo ras-mc-ctl --summary\nsudo ras-mc-ctl --errors\njournalctl -k | grep -Ei 'EDAC|MCE|memory failure'",
  normal: "8/8 channels populated per socket\nCorrected errors: 0 new / 24h\nUncorrected errors: 0",
  normalReading: "population과 오류 추세를 함께 승인합니다. 누적 0만 보지 말고 telemetry 수집 자체가 동작하는지도 확인합니다.",
  failure: "socket1 channel5: empty\nDIMM A7 corrected errors: +1240 / 1h",
  failureReading: "channel imbalance는 bandwidth 문제, 급증 오류는 RAS 문제입니다. 서로 다른 action으로 분리합니다.",
  sources: [{ label: "Linux EDAC", href: "https://docs.kernel.org/driver-api/edac.html", claim: "memory controller error reporting과 corrected/uncorrected event의 kernel interface를 확인했습니다.", checkedAt }, { label: "rasdaemon", href: "https://github.com/mchehab/rasdaemon", claim: "Linux RAS event 수집과 persistent error 기록 도구를 확인했습니다.", checkedAt }, { label: "DMTF SMBIOS", href: "https://www.dmtf.org/standards/smbios", claim: "memory device·array·error information 구조를 확인했습니다.", checkedAt }, { label: "Linux NUMA policy", href: "https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html", claim: "local/remote memory allocation과 task policy 경계를 확인했습니다.", checkedAt }, redfish],
});

export const powerCoolingFieldLab = hardwareLab({
  title: "전력 입력이 열 제거와 rack 회로로 이어지는 원장",
  question: "nameplate 합계가 아니라 실제 평균·피크·고장 상태를 전기와 냉각 양쪽에서 닫았습니까?",
  rows: [["node", "average·peak·power cap", "BMC/Redfish time series", "회로 부하"], ["rack", "A/B feed·breaker·phase balance", "rack PDU meter", "한 feed 고장"], ["cooling", "air/liquid 열 제거와 ΔT·flow", "sensor trend", "capacity margin"], ["failure", "PSU·fan·pump/CDU 경보", "alarm drill", "graceful shutdown"]],
  conclusion: "전력과 냉각은 각각의 사양표가 아니라 같은 시간축에서 입력 kW와 제거된 열, 남은 margin을 맞추는 하나의 검수입니다.",
  evidenceTitle: "BMC power와 rack PDU, 냉각 sensor를 같은 부하 구간에서 읽습니다",
  evidenceQuestion: "서버 합계와 시설 계측의 차이를 설명할 수 있습니까?",
  body: "BMC DC power와 PDU AC power는 변환 손실과 보조 부하 때문에 같지 않습니다. 측정 위치를 표기하고 피크를 잡을 sampling interval을 고정합니다.",
  command: "sudo ipmitool dcmi power reading\ncurl -sk -u '<user>:<pass>' https://<bmc>/redfish/v1/Chassis/<id>/Power\ncurl -sk -u '<user>:<pass>' https://<bmc>/redfish/v1/Chassis/<id>/Thermal\n# rack PDU와 CDU는 현장 API에서 같은 1분 구간을 export",
  normal: "node DC avg=14.4kW peak=18.8kW\nrack AC avg=61.2kW\nwater supply/return=30/40C, flow within design band",
  normalReading: "DC/AC 측정 지점과 시간창을 구분한 뒤 conversion·network·fan 부하를 포함해 차이를 검산합니다.",
  failure: "rack feed A=92% breaker rating\nfeed B=41%\nreturn temperature rising, flow below threshold",
  failureReading: "평균 총량이 남아도 phase/feed 불균형과 유량 저하는 별도 실패입니다. 부하 이동과 냉각 원인을 조사합니다.",
  sources: [redfish, ipmi, { label: "ASHRAE TC 9.9", href: "https://www.ashrae.org/technical-resources/bookstore/datacom-series", claim: "data center thermal guideline과 equipment environmental envelope의 공식 경로를 확인했습니다.", checkedAt }, { label: "NVIDIA DGX B300 Data Center Best Practices", href: "https://docs.nvidia.com/dgx-pdf/data-center-best-practices-with-dgx-b300-v1.pdf", claim: "DGX B300의 AC/DC power, rack layout, airflow와 RDHx site 조건을 확인했습니다.", checkedAt }, { label: "DMTF Redfish Power/Thermal", href: "https://redfish.dmtf.org/redfish/schema_index", claim: "Power·Thermal·EnvironmentMetrics resource의 표준 sensor 항목을 확인했습니다.", checkedAt }],
});

export const siteReadinessFieldLab = hardwareLab({
  title: "서버 도착 전에 건물 조건을 hold point로 닫는 원장",
  question: "전력·하중·냉각·동선·배관·cable reach를 설치 전 누가 서명합니까?",
  rows: [["공간/하중", "rack footprint·static/rolling load", "도면·구조 검토", "반입·고정 승인"], ["전기", "회로·plug·A/B·grounding", "SLD·breaker schedule", "energization 승인"], ["냉각", "방식·capacity·water quality·leak", "MOP·sensor test", "heat load 승인"], ["동선/망", "door·lift·loading·fiber reach", "site survey", "납품·cabling 승인"]],
  conclusion: "site readiness는 체크박스가 아니라 장비 도착 전에 미충족 조건을 stop-work로 만들고 담당자와 증거를 붙이는 과정입니다.",
  evidenceTitle: "BMC가 켜지기 전에는 문서와 계측으로 검수합니다",
  evidenceQuestion: "‘데이터센터가 가능하다고 했다’를 발주 가능한 조건으로 바꿨습니까?",
  body: "전력 single-line diagram, rack elevation, cooling P&ID, 반입 경로를 같은 revision으로 묶습니다. 변경된 도면에는 재승인 조건을 둡니다.",
  command: "sha256sum site-single-line.pdf rack-elevation.pdf cooling-pid.pdf method-of-procedure.pdf\n# 현장 계측 export 예시\n# rack_id,feed_A_V,feed_B_V,ground_ok,static_load_limit,water_supply_C,water_return_C,flow_limit",
  normal: "drawings revision=C hashes recorded\nA/B feeds energized and isolated\nstructural sign-off=yes\ncooling acceptance=yes",
  normalReading: "모든 hold point의 문서 revision과 승인자가 일치한 뒤 장비 반입을 진행합니다.",
  failure: "rack elevation rev=C\nelectrical SLD rev=B\nrolling load path: not approved\nCDU leak test: pending",
  failureReading: "설치팀 재량으로 진행하지 않습니다. revision 불일치와 pending hold point를 닫을 때까지 반입 또는 energization을 멈춥니다.",
  sources: [{ label: "NVIDIA DGX B300 Data Center Best Practices", href: "https://docs.nvidia.com/dgx-pdf/data-center-best-practices-with-dgx-b300-v1.pdf", claim: "rack·power·airflow·cable·site survey 조건을 확인했습니다.", checkedAt }, { label: "NVIDIA DGX H100 Site Planning Guide", href: "https://docs.nvidia.com/dgx/pdf/dgxh100-site-planning-guide.pdf", claim: "delivery·rack·power·cooling·network site planning 산출물의 예를 확인했습니다.", checkedAt }, { label: "TIA-942", href: "https://tiaonline.org/products-and-services/tia942certification/ansi-tia-942-standard/", claim: "data center telecommunications·power·cooling·physical infrastructure 표준 범위를 확인했습니다.", checkedAt }, { label: "Open Compute Project · Data Center Facility", href: "https://www.opencompute.org/projects/data-center-facility", claim: "facility power·cooling·rack integration의 공개 설계 자료 경로를 확인했습니다.", checkedAt }, { label: "Singapore IMDA · Tropical DC standard", href: "https://www.imda.gov.sg/how-we-can-help/green-dc-roadmap/tropical-dc-standard", claim: "Singapore tropical data center의 운영 온도와 energy efficiency 관련 공식 표준 경로를 확인했습니다.", checkedAt }],
});

export const networkFieldLab = hardwareLab({
  title: "링크 up에서 실제 request까지 이어지는 네트워크 원장",
  question: "속도·MTU·loss·route·socket을 같은 flow에서 확인합니까?",
  rows: [["link", "speed·duplex·FEC·error", "ethtool", "physical/link health"], ["L3", "address·MTU·route·neighbor", "ip", "경로·return path"], ["transport", "loss·retransmit·window", "ss/iperf", "TCP 병목"], ["application", "DNS·TLS·HTTP timing", "dig/curl/trace", "network와 app 분리"]],
  conclusion: "link up은 시작점입니다. 같은 5-tuple의 route·counter·socket·application timing을 이어야 병목 위치를 말할 수 있습니다.",
  evidenceTitle: "인터페이스 한 개에서 물리 오류와 TCP 재전송을 연결합니다",
  evidenceQuestion: "bandwidth가 낮을 때 cable·MTU·congestion·application 중 무엇을 먼저 볼지 정할 수 있습니까?",
  body: "iperf3는 소유한 두 endpoint에서만 수행하고 production traffic과 분리합니다. before/after counter delta를 봅니다.",
  command: "ethtool <iface>\nethtool -S <iface> | grep -Ei 'err|drop|discard|crc|fec'\nip -s link show dev <iface>\nip route get <peer-ip>\nss -ti dst <peer-ip>\niperf3 -c <peer-ip> -P 8 -t 30 --json",
  normal: "Speed=400000Mb/s FEC=RS\nCRC delta=0 retrans delta≈0\niperf aggregate within accepted baseline",
  normalReading: "link 조건과 counter가 안정적인 상태에서 동일 parallelism의 baseline과 비교합니다.",
  failure: "Speed=100000Mb/s expected=400000\nrx_crc_errors +8240\nTCP retrans +1912",
  failureReading: "application tuning을 멈추고 optic·cable·port configuration·FEC·negotiated speed부터 고칩니다.",
  sources: [{ label: "Linux ethtool", href: "https://docs.kernel.org/networking/ethtool-netlink.html", claim: "link mode·statistics·FEC를 조회하는 kernel interface를 확인했습니다.", checkedAt }, { label: "Linux iproute2", href: "https://man7.org/linux/man-pages/man8/ip-route.8.html", claim: "route lookup과 selected path 출력의 의미를 확인했습니다.", checkedAt }, { label: "Linux ss", href: "https://man7.org/linux/man-pages/man8/ss.8.html", claim: "socket state와 internal TCP information 조회 범위를 확인했습니다.", checkedAt }, { label: "iperf3", href: "https://software.es.net/iperf/", claim: "parallel stream·duration·JSON 결과를 포함한 active throughput test 방법을 확인했습니다.", checkedAt }, { label: "RFC 8201", href: "https://www.rfc-editor.org/rfc/rfc8201", claim: "Path MTU discovery와 packet-too-big 처리의 표준 동작을 확인했습니다.", checkedAt }],
});

export const interconnectFieldLab = hardwareLab({
  title: "GPU 내부·노드 내부·노드 밖 경로를 분리하는 원장",
  question: "NVLink가 있는 것과 실제 rank가 그 경로를 쓰는 것을 구분합니까?",
  rows: [["GPU topology", "GPU↔GPU NVLink/PCIe 경로", "nvidia-smi topo", "rank 배치"], ["CPU/NUMA", "GPU↔CPU affinity", "topo/numactl", "host staging 비용"], ["NIC", "GPU↔NIC proximity", "topo/lspci", "GPUDirect path"], ["transfer", "pair별 bandwidth·latency", "P2P test", "비정상 pair 격리"]],
  conclusion: "interconnect 이름은 연결 가능성을 말하고, topology와 pairwise transfer 결과가 실제 배치·성능을 말합니다.",
  evidenceTitle: "GPU pair별 경로와 전송 결과를 함께 봅니다",
  evidenceQuestion: "한 쌍만 느린 현상을 전체 GPU 세대의 한계로 오해하지 않을 수 있습니까?",
  body: "topology matrix의 NV#·PIX·PXB·PHB·SYS 표기를 실제 pairwise test와 대조합니다. expected matrix는 server vendor 설계에서 가져옵니다.",
  command: "nvidia-smi topo -m\nnvidia-smi nvlink --status\n./p2pBandwidthLatencyTest\nlspci -tv",
  normal: "GPU0↔GPU1=NV18, P2P enabled\npair bandwidth within baseline\nGPU0↔NIC0=PIX",
  normalReading: "예상 scale-up path와 NIC proximity가 일치하면 scheduler topology label과 연결합니다.",
  failure: "GPU4↔GPU5=SYS expected=NV18\nP2P disabled\npair latency 5x baseline",
  failureReading: "CUDA/NVLink 상태, slot/baseboard inventory, fabric manager와 hardware health를 확인하고 해당 pair를 격리합니다.",
  sources: [nvidiaSmi, { label: "NVIDIA CUDA Samples · P2P", href: "https://github.com/NVIDIA/cuda-samples/tree/master/Samples/5_Domain_Specific/p2pBandwidthLatencyTest", claim: "GPU pair의 peer access와 bandwidth/latency 확인 sample을 검토했습니다.", checkedAt }, { label: "NVIDIA NVLink", href: "https://docs.nvidia.com/dgx/dgxb300-user-guide/introduction-to-dgxb300.html", claim: "DGX B300의 NVLink/NVSwitch scale-up 구성과 공개 사양을 확인했습니다.", checkedAt }, linuxPci, dcgm],
});

export const rdmaFieldLab = hardwareLab({
  title: "RDMA 경로를 link·GID·route·verbs·application으로 여는 원장",
  question: "NIC가 ACTIVE인 것과 두 GPU node 사이 RDMA가 동작하는 것을 구분합니까?",
  rows: [["device", "HCA·port·firmware·link", "rdma/ibv", "device 준비"], ["address", "GID·RoCE version·VLAN·route", "show_gids/ip", "peer 선택"], ["fabric", "PFC/ECN·loss·counter", "switch/NIC telemetry", "무손실 동작"], ["transfer", "verbs bandwidth·latency·error", "perftest", "NCCL 전 단계 승인"]],
  conclusion: "RDMA는 NIC feature 하나가 아니라 host와 fabric의 주소·queue·loss 정책이 끝까지 맞는 경로입니다.",
  evidenceTitle: "NCCL 전에 두 host의 verbs 경로를 단독 검증합니다",
  evidenceQuestion: "socket fallback을 collective 성공으로 잘못 승인하지 않을 수 있습니까?",
  body: "server와 client에서 같은 device·port·GID index를 기록합니다. `ib_write_bw`는 한쪽을 server로 먼저 띄운 뒤 소유한 peer에서 실행합니다.",
  command: "rdma link show\nibv_devinfo -v\nshow_gids\n# peer A: ib_write_bw -d <dev> -i <port> --report_gbits\n# peer B: ib_write_bw -d <dev> -i <port> --report_gbits <peer-ip>",
  normal: "mlx5_0/1 ACTIVE\nGID index=3 RoCE v2\n0 failures, bandwidth within accepted baseline",
  normalReading: "verbs path가 통과한 뒤 NCCL transport log에서 같은 HCA를 선택했는지 확인합니다.",
  failure: "port ACTIVE\nCouldn't connect to <peer>\nGID index mismatch: local v1, peer v2",
  failureReading: "cable보다 GID·VLAN·route·firewall·RoCE mode를 먼저 대조합니다. port ACTIVE만으로 fabric을 승인하지 않습니다.",
  sources: [rdmaCore, { label: "NVIDIA MLNX_OFED performance", href: "https://docs.nvidia.com/networking/display/mlnxofedv24070610/performance+tests", claim: "perftest로 RDMA bandwidth·latency를 검증하는 명령과 조건을 확인했습니다.", checkedAt }, { label: "NVIDIA RoCE", href: "https://docs.nvidia.com/networking/display/enterprisecloudsnvdi25g2/rdma+over+converged+ethernet+(roce)", claim: "RoCE addressing·lossless fabric·congestion control의 구성 요소를 확인했습니다.", checkedAt }, { label: "Linux RDMA statistics", href: "https://man7.org/linux/man-pages/man8/rdma-statistic.8.html", claim: "RDMA resource와 counter 조회 방법을 확인했습니다.", checkedAt }, { label: "Meta Engineering · RoCE networks for AI training", href: "https://engineering.fb.com/wp-content/uploads/2024/08/sigcomm24-final246.pdf", claim: "대규모 AI training fabric에서 congestion·failure·traffic engineering을 함께 다루는 운영 연구를 참고했습니다. 개별 장비의 지원 사양은 vendor 문서로 판단합니다.", checkedAt }, nccl],
});

export const collectiveFieldLab = hardwareLab({
  title: "collective를 2→4→전체 node로 확대하는 원장",
  question: "첫 실패 규모와 rank, transport를 보존해 원인을 좁힙니까?",
  rows: [["1 node", "GPU/NVLink correctness", "DCGM·P2P", "scale-up 승인"], ["2 nodes", "RDMA와 rank 연결", "NCCL log·all-reduce", "첫 scale-out 승인"], ["4→전체", "rail·switch·contention", "size sweep·counter", "확장성"], ["application", "step time·checkpoint·error", "training trace", "업무 acceptance"]],
  conclusion: "NCCL test는 network의 종착점이 아니라 application 전에 collective path를 격리하는 중간 acceptance입니다.",
  evidenceTitle: "transport와 correctness를 bandwidth보다 먼저 봅니다",
  evidenceQuestion: "높은 숫자 하나가 아니라 모든 rank가 의도한 RDMA path를 썼는지 확인합니까?",
  body: "rank별 log를 서로 다른 파일에 저장하고 message size sweep을 수행합니다. debug override는 문제 해결 뒤 production config에서 제거합니다.",
  command: "export NCCL_DEBUG=INFO\nexport NCCL_DEBUG_SUBSYS=INIT,NET,GRAPH\nexport NCCL_DEBUG_FILE=/var/tmp/nccl.%h.%p.log\nsrun -N2 --gpus-per-node=8 <nccl-tests> all_reduce_perf_mpi -b 8M -e 16G -f 2 -g 8",
  normal: "NET/IB using mlx5_0...mlx5_7\nConnected all rings\nOut of bounds values=0\nbusbw within node-count baseline",
  normalReading: "correctness 0 error, transport, HCA와 message size별 curve를 함께 승인합니다.",
  failure: "NET/IB no device found\nNET/Socket using bond0\nrank 13 timeout",
  failureReading: "느린 all-reduce로만 기록하지 않습니다. rank 13 host의 RDMA manifest와 GID, route, fabric counter부터 조사합니다.",
  sources: [nccl, ncclTests, { label: "NVIDIA NCCL setup", href: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/setup.html", claim: "NCCL이 process launcher가 아니며 network/plugin/shared memory 조건이 따로 필요함을 확인했습니다.", checkedAt }, { label: "NVIDIA B300 deployment guide", href: "https://docs.nvidia.com/dgx-basepod/deployment-guides/dgx-basepod-b200/latest/b300/b300-nmc.html", claim: "Slurm 환경에서 B300 cluster의 NCCL all-reduce 검증 명령과 순서를 확인했습니다.", checkedAt }, { label: "Clio Labs · Multi-node GPU training 장애 사례", href: "https://blog.cliolabs.dev/blog/debugging-multi-node-gpu-training/", claim: "collective 실패를 GPU 수치 하나로 보지 않고 launcher·interface·container·host 경계로 좁힌 현장 사례를 참고했습니다. 명령과 환경 변수의 정본은 NVIDIA 문서입니다.", checkedAt }, rdmaCore],
});

export const modded4090FieldLab = hardwareLab({
  title: "개조 장비를 용량 성공과 운영 승인으로 분리하는 원장",
  question: "VRAM이 늘어난 사실과 장기 안정성·재현성·지원 가능성을 따로 판정합니까?",
  rows: [["identity", "board/VBIOS/memory·power limit", "manifest", "개조 범위"], ["health", "ECC 부재·Xid·temperature·throttle", "telemetry·soak log", "안정성"], ["workload", "model load·tokens/s·p99·OOM", "benchmark JSON", "용량/성능"], ["operation", "spare·repair·rollback·warranty", "runbook·cost", "production 사용 여부"]],
  conclusion: "개조 GPU는 ‘모델이 한 번 올라갔다’와 ‘서비스에 승인됐다’ 사이의 긴 증거 사슬을 별도로 채워야 합니다.",
  evidenceTitle: "VRAM 용량·PCIe path·열·장시간 오류를 한 run에 묶습니다",
  evidenceQuestion: "초기 성공 뒤 몇 시간 후 throttle·Xid·memory corruption을 잡을 수 있습니까?",
  body: "부하 시험은 화재·장비 손상 위험과 제조사 지원 상실 가능성을 먼저 검토한 격리 환경에서만 수행합니다. 온도와 power cap, 오류 log를 지속 수집합니다.",
  command: "nvidia-smi --query-gpu=name,uuid,memory.total,power.limit,temperature.gpu,clocks_throttle_reasons.active --format=csv -l 10\nnvidia-smi topo -m\njournalctl -kf | grep -Ei 'NVRM|Xid'\n<serving-benchmark> --model <model> --duration 3600 --output-json <run-id>.json",
  normal: "memory.total=49140MiB\n1h errors=0, throttle=inactive\ntokens/s and p99 within acceptance",
  normalReading: "이 결과는 해당 board·VBIOS·냉각·runtime 조합의 한 run에만 유효합니다. 반복 run과 spare strategy가 필요합니다.",
  failure: "after 37m: Xid 31\ntemperature=91C, SW Thermal Slowdown\np99 latency +240%",
  failureReading: "용량 성공과 무관하게 운영 acceptance는 실패입니다. 냉각·power·memory 안정성을 재검증하고 생산 투입을 보류합니다.",
  sources: [nvidiaSmi, dcgm, linuxPci, { label: "NVIDIA Xid errors", href: "https://docs.nvidia.com/deploy/xid-errors/index.html", claim: "Xid event의 수집 위치와 대표 원인·진단 경로를 확인했습니다.", checkedAt }, { label: "NVIDIA GPU Debug Guidelines", href: "https://docs.nvidia.com/deploy/gpu-debug-guidelines/index.html", claim: "GPU 장애 시 상태 보존과 debug data 수집 순서를 확인했습니다.", checkedAt }],
});

export const b300SwitchlessFieldLab = hardwareLab({
  title: "직결망을 port·address·failure·collective로 검수하는 원장",
  question: "노드 두 대가 연결된 것과 16노드 job의 모든 rank가 올바른 rail을 쓰는 것을 구분합니까?",
  rows: [["port", "node별 8 NIC·peer cable", "port/cable map", "BOM 대조"], ["address", "rail별 subnet·route·GID", "ip/rdma manifest", "대칭성"], ["failure", "한 link/node 제거 시 영향", "fault injection result", "격리·복구"], ["collective", "2→4→16 node transport·bandwidth", "NCCL raw log", "topology acceptance"]],
  conclusion: "switchless는 스위치를 뺀 단순망이 아니라 port와 peer가 고정된 topology이므로 cable·route·장애 영향의 추적성이 더 중요합니다.",
  evidenceTitle: "각 rail의 peer와 NCCL 선택을 대조합니다",
  evidenceQuestion: "케이블 한 가닥이 잘못 꽂혔을 때 어느 rank와 collective가 영향을 받는지 찾을 수 있습니까?",
  body: "port map의 node ID·BDF·interface·peer·rail을 host manifest와 대조합니다. NCCL log가 같은 interface를 선택하는지 확인합니다.",
  command: "ip -br link\nip -br address\nrdma link show\nfor i in <rail-ifaces>; do ethtool -S \"$i\" | grep -Ei 'err|drop|discard'; done\nexport NCCL_DEBUG=INFO NCCL_DEBUG_SUBSYS=NET,GRAPH\n<launcher> all_reduce_perf -b 8M -e 16G -f 2 -g 8",
  normal: "8/8 rail links UP per node\npeer map matches cable ledger\nNET/IB uses intended rail\nvalidation errors=0",
  normalReading: "physical peer, L3/RDMA address와 NCCL transport가 같은 rail ledger에 이어집니다.",
  failure: "node07 rail3 DOWN\nnode08 rail3 peer=node06 expected=node07\nrank56 communicator timeout",
  failureReading: "route 우회로 숨기지 않습니다. cable map·peer address·rank mapping으로 잘못된 link를 고치고 2노드부터 다시 확대합니다.",
  sources: [{ label: "NVIDIA HGX AI Factory · Logical architecture", href: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/network-logical-architecture.html", claim: "rail-optimized multi-plane fabric와 node/network 구성 기준을 확인했습니다.", checkedAt }, { label: "NVIDIA HGX AI Factory · Components", href: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/components.html", claim: "HGX B300 node의 ConnectX-8 port 구성과 800Gb/s GPU-facing connectivity를 확인했습니다.", checkedAt }, rdmaCore, nccl, ncclTests],
});
