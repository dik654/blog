import type { EngineeringDepthData } from "../../cloud/EngineeringDepthBlocks";
import type { HardwareTeachCase } from "../HardwareTeachOpening";

export const acceleratorVendorTeachCase: HardwareTeachCase = {
  incidentTitle: "70B 모델의 가중치는 들어갔지만 여덟 요청의 KV cache까지는 들어가지 않았습니다",
  incident: [
    "(가정) 한 팀이 BF16 70B dense 모델을 32K 문맥·동시 요청 8개로 서비스하려 합니다. 자체 데이터센터 두 곳이 기본이고, 급증할 때만 cloud를 씁니다. 192GB급 후보는 weight만 보면 충분해 보였지만 KV cache와 runtime 여유를 더하자 한 장 실행에 실패했습니다.",
    "질문은 ‘어느 벤더가 가장 빠른가’가 아닙니다. 이 모델이 어디에 배치될 수 있고, 한 장에 들어가는지, 나누면 어느 통신 domain을 쓰는지, 지금의 serving 기능과 p95 목표를 실제로 재현하는 후보가 무엇인지 묻습니다.",
  ],
  pathTitle: "배치 경계부터 실제 요청 완료까지 다섯 관문을 차례로 통과합니다",
  path: [
    "먼저 자체 데이터센터에 살 수 있는 module인지 특정 cloud에서만 빌리는 service인지 가릅니다. 다음으로 weight·KV cache·workspace가 한 장에 들어가는지 계산하고, 안 들어가면 scale-up domain과 collective 경로를 정합니다.",
    "그 뒤 동일 artifact·정밀도·serving 기능으로 p95 TTFT와 TPOT, 처리량, 정확도, 전력을 함께 잽니다. 마지막으로 냉각·조달·장애 복구와 이식 비용까지 넣습니다. 어느 관문에서든 fallback이 생기면 peak 수치의 순위는 선택 근거가 되지 못합니다.",
  ],
  numberTitle: "130.4GiB weight에 KV cache 80GiB를 더하면 이미 210.4GiB입니다",
  numbers: [
    "BF16 weight는 70×10^9×2 byte÷2^30≈130.4GiB입니다. Llama 계열을 단순화해 80 layer·KV head 8·head dimension 128로 두면 KV는 token당 2(K,V)×80×8×128×2 byte=0.3125MiB입니다. 32,768 token×8개 요청이면 80GiB입니다.",
    "합계 210.4GiB에는 allocator 여유와 kernel workspace도 아직 없습니다. 따라서 nominal 192GB·180GB·144GB·128GB 후보는 한 장 경로에서 먼저 탈락합니다. 288GB 이상도 실제 usable memory와 기능을 실행해 확인해야 합니다.",
  ],
  steps: [
    { role: "배치할 수 있는 후보만 남깁니다", result: "자체 데이터센터 구매와 특정 cloud service를 같은 조달 후보처럼 섞지 않습니다." },
    { role: "Weight·KV·workspace를 담습니다", result: "표기 HBM이 아니라 runtime이 실제로 쓸 수 있는 여유까지 통과합니다." },
    { role: "한 장 또는 여러 장에서 요청을 끝냅니다", result: "통신 domain과 compiler·kernel 경로가 p95 TTFT·TPOT·정확도 목표를 함께 통과합니다." },
    { role: "오래 운영하고 고장에서 돌아옵니다", result: "전력·냉각·조달·관측·교체·cloud lock-in까지 단위 요청 비용에 들어갑니다." },
  ],
  whyParts: [
    "배치 경계를 먼저 두는 이유는 TPU·Trainium처럼 cloud에서 service로 소비하는 가속기와 고객이 자체 랙에 설치하는 module이 같은 구매 선택지가 아니기 때문입니다.",
    "메모리 뒤에 통신과 software를 두는 이유는 한 장에 못 들어가는 순간 link가 실행 경로에 들어오고, hardware가 가능해도 compiler·kernel·serving 기능이 빠지면 목표 지연을 재현할 수 없기 때문입니다.",
  ],
  terms: [
    { role: "사서 설치할지 cloud에서 빌릴지 정하는 선", name: "Deployment·procurement boundary", boundary: "문서에 존재하는 제품과 내 지역·계약에서 지금 쓸 수 있는 capacity는 다릅니다." },
    { role: "한 요청 묶음을 담는 실제 작업 공간", name: "Usable HBM capacity", boundary: "Nominal capacity에서 runtime 예약·fragmentation·workspace를 뺀 값을 봅니다." },
    { role: "여러 장을 하나처럼 쓰는 촘촘한 연결 범위", name: "Scale-up domain", boundary: "Domain 내부 link와 rack·cluster 사이 scale-out network를 구분합니다." },
    { role: "모델을 실제 kernel과 serving 기능으로 내리는 층", name: "Compiler·runtime ecosystem", boundary: "Framework 지원 표시와 필요한 quantization·LoRA·speculative decoding의 실행 지원은 다릅니다." },
  ],
  next: "공식 스펙은 후보를 거르는 자료이고, 동일 artifact의 정확도·p95 TTFT·TPOT·처리량·전력·복구 결과가 채택 자료입니다.",
};

const checkedAt = "2026-11-02";

export const acceleratorVendorFieldLab: EngineeringDepthData = {
  ledgers: [{
    section: "mechanism",
    title: "자체 랙과 cloud 가속기를 같은 70B 요청 계약으로 정규화하는 원장",
    question: "배치 형태가 달라도 동일 artifact·정확도·기능·p95·복구 기준으로 비교했습니까?",
    columns: ["층", "실물에서 확인할 것", "증거", "판정"],
    rows: [
      ["placement", "OEM BOM 또는 cloud region·quota", "order·instance manifest", "실제 확보 가능성"],
      ["model", "동일 model·tokenizer·precision·accuracy", "artifact hash·quality report", "결과 동등성"],
      ["runtime", "compiler·engine version·fallback·serving 기능", "compile log·profile", "가속 경로"],
      ["request", "32K·동시 8의 TTFT·TPOT·처리량·전력", "raw result·telemetry", "SLO와 단위 비용"],
      ["recovery", "cold start·장치/instance 실패·rollback", "drill timeline", "운영 가능성"],
    ],
    conclusion: "장치 이름이 아니라 동일 요청이 배치·정확도·기능·p95·복구 관문을 모두 통과한 결과만 채택 자료가 됩니다.",
  }],
  evidence: [{
    section: "source",
    eyebrow: "실물 확인",
    title: "플랫폼마다 다른 inventory 명령을 공통 manifest 열로 바꿉니다",
    question: "장치가 보이는 것과 필요한 model graph·serving 기능이 가속 경로에서 돈다는 것을 구분합니까?",
    body: "아래 명령은 한 host에서 모두 실행하는 묶음이 아닙니다. 해당 플랫폼의 block만 실행하고, 없는 플랫폼을 0으로 쓰지 말고 ‘적용 안 됨’ 또는 ‘미측정’으로 남깁니다. 그 뒤 profiler와 accuracy report를 같은 run ID에 묶습니다.",
    language: "shell",
    command: "# NVIDIA host\nnvidia-smi -L\n# AMD host\nrocminfo | sed -n '1,80p'\n# Intel Gaudi host\nhl-smi\n# Google Cloud TPU VM\ngcloud compute tpus tpu-vm describe <name> --zone <zone>\ntpu-info\n# AWS Trainium instance\naws ec2 describe-instances --instance-ids <id>\nneuron-ls\nneuron-top",
    normal: {
      label: "정상 판독 · 예시 출력",
      output: "(예시 출력 — 실측 아님)\nplacement=cloud region=<approved> quota=available\nartifact_sha256=<same> tokenizer_sha256=<same> precision=BF16\naccuracy_gate=pass fallback_ops=0 feature_gate=pass\np95_ttft_ms=<measured> p95_tpot_ms=<measured>",
      reading: "Inventory 뒤에 동일 artifact와 feature gate를 붙입니다. 성능은 정확도와 기능이 같은 run끼리만 비교합니다.",
    },
    failure: {
      label: "실패 판독 · 예시 출력",
      output: "(예시 출력 — 실측 아님)\ndevice_count=8\ncompile_log: unsupported op fallback to host\nfeature_gate: prefix_cache=unsupported\naccuracy_gate=fail",
      reading: "장치 수와 peak 수치가 높아도 채택 자료에서 제외합니다. Graph·operator·정밀도와 기능 조합을 고친 뒤 정확도부터 다시 통과시킵니다.",
    },
  }],
  sources: [
    { label: "NVIDIA nvidia-smi", href: "https://docs.nvidia.com/deploy/nvidia-smi/index.html", claim: "NVIDIA GPU inventory와 운영 query 범위를 확인했습니다.", checkedAt },
    { label: "AMD ROCm documentation", href: "https://rocm.docs.amd.com/", claim: "ROCm runtime·profiling·management 도구의 공식 범위를 확인했습니다.", checkedAt },
    { label: "Intel Gaudi documentation", href: "https://docs.habana.ai/", claim: "Gaudi driver·SynapseAI와 hl-smi 운영 도구의 공식 경로를 확인했습니다.", checkedAt },
    { label: "Google Cloud TPU monitoring", href: "https://cloud.google.com/tpu/docs/monitor-tpu", claim: "TPU VM의 상태와 runtime metric을 확인하는 공식 경로를 확인했습니다.", checkedAt },
    { label: "AWS Neuron tools", href: "https://awsdocs-neuron.readthedocs-hosted.com/en/latest/tools/index.html", claim: "Trainium inventory·monitoring·profiling 도구의 공식 범위를 확인했습니다.", checkedAt },
    { label: "MLPerf Inference", href: "https://github.com/mlcommons/inference", claim: "System·scenario·accuracy와 performance condition을 함께 공개하는 비교 원칙을 확인했습니다.", checkedAt },
  ],
};
