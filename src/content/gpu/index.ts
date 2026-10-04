import type { Category } from "../types";
import { hwArticles } from "./articlesHw";

const gpu: Category = {
  slug: "gpu",
  name: "HW / GPU",
  description: "GPU 병렬처리, CUDA, 서버 하드웨어, 스토리지",
  subcategories: [
    {
      slug: "hw-basics",
      name: "Hardware Basics",
      description: "서버/워크스테이션 부품, 스토리지, 메모리",
      icon: "🔩",
      children: [
        {
          slug: "hw-compute",
          name: "Compute",
          description: "CPU, GPU, 서버 vs 데스크톱",
          icon: "⚙️",
        },
        {
          slug: "hw-storage",
          name: "Storage",
          description: "NVMe, M.2, U.2, SAS, 엔터프라이즈 SSD",
          icon: "💿",
        },
        {
          slug: "hw-memory",
          name: "Memory",
          description: "DDR4/DDR5, ECC, RDIMM",
          icon: "🧠",
        },
        {
          slug: "hw-infra",
          name: "Infrastructure",
          description: "전력, 냉각, 네트워크, 랙마운트",
          icon: "🏗️",
        },
      ],
    },
    {
      slug: "gpu-fundamentals",
      name: "GPU Fundamentals",
      description: "SIMT, 메모리 계층, CUDA 기초",
      icon: "🖥️",
    },
    {
      slug: "zk-acceleration",
      name: "ZK Acceleration",
      description: "MSM, NTT, 증명 GPU 가속 기법",
      icon: "⚡",
    },
    {
      slug: "accelerator-design",
      name: "Accelerator Design",
      description: "시스톨릭 어레이 RTL, Chisel, FPGA·ASIC 합성 흐름",
      icon: "🧮",
    },
  ],
  articles: [
    ...hwArticles,
    {
      slug: "gpu-architecture",
      title: "GPU 아키텍처 기초 (SIMT, 메모리 계층, 워프)",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "overview", title: "CPU vs GPU & SIMT 모델" },
        { id: "memory-hierarchy", title: "메모리 계층 구조" },
        { id: "warp", title: "워프 스케줄링 & 점유율" },
        { id: "optimization", title: "GPU 최적화 기법" },
      ],
      component: () => import("@/pages/articles/blockchain/gpu-architecture"),
    },
    {
      slug: "cuda-basics",
      title: "CUDA 실행 기초: Host·Kernel·Memory·Workload Fit",
      subcategory: "gpu-fundamentals",
      sections: [
  {
    "id": "overview",
    "title": "1 · 배열의 한 칸을 더할 때 실제로 무엇이 움직일까요"
  },
  {
    "id": "black-box",
    "title": "2 · 준비하고 보내고 기다린 뒤 결과를 받습니다"
  },
  {
    "id": "case",
    "title": "3 · 64칸을 더하면 입력 512바이트와 출력 256바이트가 필요합니다"
  },
  {
    "id": "picture",
    "title": "4 · 37번은 시작 위치에서 148바이트 떨어져 있습니다"
  },
  {
    "id": "need",
    "title": "5 · 저장 공간을 여러 겹 두는 이유는 기다림을 줄이기 위해서입니다"
  },
  {
    "id": "names",
    "title": "6 · 작업 번호와 실제 실행 묶음은 다른 층에 있습니다"
  },
  {
    "id": "mechanism",
    "title": "7 · 37번 thread가 읽고 더하고 쓸 때 두 종류의 경로를 지납니다"
  },
  {
    "id": "source",
    "title": "8 · 공식 vectorAdd의 49번째 줄이 37을 만듭니다"
  },
  {
    "id": "comparison",
    "title": "9 · 32개 묶음 규칙과 최신 행렬 명령의 지원 범위를 구분합니다"
  },
  {
    "id": "limits",
    "title": "10 · 64개가 맞게 계산됐다는 사실로 큰 작업의 속도를 예측할 수는 없습니다"
  }
],
      component: () => import("@/pages/articles/blockchain/cuda-basics"),
    },
    {
      slug: "amd-gpu-execution-and-hip",
      title: "AMD GPU 실행 구조와 CUDA에서 HIP으로 옮기는 경로",
      subcategory: "gpu-fundamentals",
      sections: [
  {
    "id": "overview",
    "title": "1 · 같은 64개 덧셈을 다른 칩에 옮겨도 같은 방식으로 실행될까요"
  },
  {
    "id": "black-box",
    "title": "2 · 입력과 답 사이에는 번역과 실행이 있습니다"
  },
  {
    "id": "case",
    "title": "3 · 64명을 32명씩 묶으면 둘이고 64명씩 묶으면 하나입니다"
  },
  {
    "id": "picture",
    "title": "4 · 함께 진행하는 범위가 바뀌면 서로 값을 건네는 규칙도 바뀝니다"
  },
  {
    "id": "need",
    "title": "5 · 공통 명령은 공유하고 값은 각자 보관합니다"
  },
  {
    "id": "names",
    "title": "6 · CU와 wavefront는 서로 다른 크기의 부품입니다"
  },
  {
    "id": "mechanism",
    "title": "7 · CDNA4에서는 37번이 64개 wavefront의 37번 lane입니다"
  },
  {
    "id": "source",
    "title": "8 · AMD 예제의 2차원 번호도 64×1로 놓으면 37을 만듭니다"
  },
  {
    "id": "comparison",
    "title": "9 · 이름을 바꿔도 32개라는 가정은 자동으로 바뀌지 않습니다"
  },
  {
    "id": "limits",
    "title": "10 · 큰 묶음 하나가 작은 묶음 둘보다 빠르다는 결론은 나오지 않습니다"
  }
],
      component: () => import("@/pages/articles/gpu/amd-gpu-execution-and-hip"),
    },
    {
      slug: "hbm-stack-and-memory-requests",
      title: "HBM 적층 구조에서 코드의 메모리 요청까지",
      subcategory: "gpu-fundamentals",
      sections: [
  {
    "id": "overview",
    "title": "1 · 메모리를 높이 쌓으면 프로그램이 왜 빨라질 수 있을까요"
  },
  {
    "id": "black-box",
    "title": "2 · 계산부가 요청하면 저장부는 주소를 찾아 데이터를 보냅니다"
  },
  {
    "id": "case",
    "title": "3 · 유효 128바이트를 읽어도 필요한 조각은 4개 또는 32개입니다"
  },
  {
    "id": "picture",
    "title": "4 · 여러 층의 저장 칩이 넓은 아래 통로로 연결됩니다"
  },
  {
    "id": "need",
    "title": "5 · 많은 연결선은 처리량을 키우지만 열과 제조 비용도 늘립니다"
  },
  {
    "id": "names",
    "title": "6 · 적층과 채널, 행을 여는 동작은 서로 다른 역할입니다"
  },
  {
    "id": "mechanism",
    "title": "7 · 요청을 합친 뒤에도 행을 열고 기다리는 동작이 남습니다"
  },
  {
    "id": "source",
    "title": "8 · HBM3의 1024비트 폭에 가정한 속도를 곱합니다"
  },
  {
    "id": "comparison",
    "title": "9 · 같은 64개 덧셈의 연산량과 바이트를 같은 경계에서 셉니다"
  },
  {
    "id": "limits",
    "title": "10 · 메모리 사양은 서로 다른 단위로 읽어야 합니다"
  }
],
      component: () => import("@/pages/articles/gpu/hbm-stack-and-memory-requests"),
    },
    {
      slug: "cuda-compilation-and-isa-analysis",
      title: "CUDA 컴파일: 덧셈 하나가 GPU 명령이 되는 과정",
      subcategory: "gpu-fundamentals",
      sections: [
  {
    "id": "overview",
    "title": "1 · 같은 계산도 실행할 장치에 맞는 명령으로 바꿔야 합니다"
  },
  {
    "id": "black-box",
    "title": "2 · 계산 방법과 실행 대상을 받아 배포 파일을 만듭니다"
  },
  {
    "id": "case",
    "title": "3 · 여덟 자리 중 3번에서 7과 5를 더합니다"
  },
  {
    "id": "picture",
    "title": "4 · 번역 표현이 바뀌어도 값의 이동은 유지됩니다"
  },
  {
    "id": "why",
    "title": "5 · 중간 표현과 장치용 결과를 함께 두는 이유가 있습니다"
  },
  {
    "id": "names",
    "title": "6 · 계산을 옮기는 단계와 결과물에 이름을 붙입니다"
  },
  {
    "id": "trace",
    "title": "7 · 0번 block의 3번 thread가 같은 12를 기록합니다"
  },
  {
    "id": "pipeline",
    "title": "8 · 실제 소스에서 역할을 확인하고 공개된 컴파일 단계로 읽습니다"
  },
  {
    "id": "ptx-and-sass",
    "title": "9 · 공식 PTX 출력에서 위치 3과 합 12를 찾습니다"
  },
  {
    "id": "sass-trace",
    "title": "10 · 같은 문서의 SASS에서 FADD의 입력과 출력을 따라갑니다"
  },
  {
    "id": "ptxas-optimizations",
    "title": "11 · 다 쓴 주소 자리를 값이 다시 쓰면 저장 공간을 아낍니다"
  },
  {
    "id": "fatbin-and-jit",
    "title": "12 · A100과 H100은 같은 묶음에서 다른 이미지를 고릅니다"
  },
  {
    "id": "capabilities",
    "title": "13 · 대상의 저장 한도와 명령 지원을 따로 확인합니다"
  },
  {
    "id": "unrolling",
    "title": "14 · 반복을 네 개씩 묶으면 제어는 줄고 동시에 든 값은 늘 수 있습니다"
  },
  {
    "id": "classic-optimizations",
    "title": "15 · 반복 계산과 쓰이지 않는 값을 줄이는 원리도 적용됩니다"
  },
  {
    "id": "floating-options",
    "title": "16 · 수학적으로 같은 식도 반올림 횟수가 바뀌면 결과가 달라집니다"
  },
  {
    "id": "isa-analysis",
    "title": "17 · 배포 이미지와 자원 보고를 확인한 뒤 시간을 잽니다"
  },
  {
    "id": "evidence",
    "title": "18 · 고정 문서의 역할을 나눠 원문과 사례를 대조합니다"
  },
  {
    "id": "limits",
    "title": "19 · 번역 결과와 실행 결과를 구별하며 다시 예측합니다"
  }
],
      component: () => import("@/pages/articles/gpu/cuda-compilation-and-isa-analysis"),
    },
    {
      slug: "cuda-thread-hierarchy",
      title: "CUDA 스레드 계층: 그리드, 블록, 워프, 인덱싱",
      subcategory: "gpu-fundamentals",
      sections: [
  {
    "id": "overview",
    "title": "1. 작업을 맡길 자리를 만드는 일과 실제 계산기를 배정하는 일은 다릅니다"
  },
  {
    "id": "outside",
    "title": "2. 주 프로그램은 작업표를 보내고 장치가 답을 기록합니다"
  },
  {
    "id": "case",
    "title": "3. 열 칸을 네 자리씩 맡기면 열두 자리가 생깁니다"
  },
  {
    "id": "picture",
    "title": "4. 묶음 번호에 네 칸을 곱한 뒤 그 안의 번호를 더합니다"
  },
  {
    "id": "why",
    "title": "5. 고정된 크기로 나누면 장치가 남은 자원에 맞춰 배치할 수 있습니다"
  },
  {
    "id": "names",
    "title": "6. 작업표와 실행 장치의 역할에 이름을 붙입니다"
  },
  {
    "id": "trace",
    "title": "7. 묶음 2의 thread 1은 9번을 계산하고 10번·11번은 멈춥니다"
  },
  {
    "id": "builtin-vars",
    "title": "8. 작업 수를 올림하고 내장 변수로 같은 작업표를 읽습니다"
  },
  {
    "id": "source-1d",
    "title": "9. 실제 vectorAdd의 번호 계산에 2·4·1을 넣습니다"
  },
  {
    "id": "indexing-1d",
    "title": "10. 범위를 담는 정수형과 실행 오류도 함께 확인합니다"
  },
  {
    "id": "indexing-2d",
    "title": "11. 두 축의 범위를 확인한 뒤 행 우선 주소를 만듭니다"
  },
  {
    "id": "warp-runtime",
    "title": "12. 같은 warp의 조건이 갈려도 정답이 자동으로 틀리는 것은 아닙니다"
  },
  {
    "id": "placement",
    "title": "13. 묶음을 올릴 때는 thread 수와 저장 공간을 함께 셉니다"
  },
  {
    "id": "limits",
    "title": "14. 자리 배분의 정답과 실제 속도를 따로 확인합니다"
  }
],
      component: () => import("@/pages/articles/gpu/cuda-thread-hierarchy"),
    },
    {
      slug: "sm-warp-scheduling-and-issue",
      title: "GPU 명령 발행: 배치된 일과 지금 시작할 수 있는 일",
      subcategory: "gpu-fundamentals",
      sections: [
  {
    "id": "overview",
    "title": "1 · 일이 많이 남아 있어도 지금 시작할 수 있는 일은 없을 수 있습니다"
  },
  {
    "id": "black-box",
    "title": "2 · 맡은 일 중 준비된 명령을 하나 골라 내보냅니다"
  },
  {
    "id": "case",
    "title": "3 · 네 묶음 중 한 묶음의 첫 결과가 더 늦게 도착합니다"
  },
  {
    "id": "picture",
    "title": "4 · 먼저 보낸 결과를 기다리는 동안 다른 묶음을 선택합니다"
  },
  {
    "id": "why",
    "title": "5 · 기다리는 값과 선택할 일을 따로 관리해야 합니다"
  },
  {
    "id": "names",
    "title": "6 · 작업 묶음과 세 상태를 이름으로 구별합니다"
  },
  {
    "id": "trace",
    "title": "7 · 여섯째 clock에는 네 warp가 모두 다음 결과를 기다립니다"
  },
  {
    "id": "sm-structure",
    "title": "8 · 실제 배치 단위와 발행 상한을 연결합니다"
  },
  {
    "id": "issue-scoreboard",
    "title": "9 · 공식 후보 조건에 같은 여섯째 clock을 넣습니다"
  },
  {
    "id": "profiler-states",
    "title": "10 · 어디에서 기다리는지와 후보에서 밀렸는지를 구별합니다"
  },
  {
    "id": "latency-hiding",
    "title": "11 · 매 순간 네 후보보다 네 개의 독립된 일이 필요합니다"
  },
  {
    "id": "memory-and-bubbles",
    "title": "12 · 긴 읽기 지연은 요청 수와 실제 수용량을 함께 봅니다"
  },
  {
    "id": "divergence",
    "title": "13 · 조건이 갈리면 같은 명령의 참여 자리도 줄어듭니다"
  },
  {
    "id": "thread-scheduling",
    "title": "14 · Lane별 진행 상태가 있어도 동기화 규칙은 필요합니다"
  },
  {
    "id": "evidence",
    "title": "15 · 원문의 정의와 모형의 가정값을 구별합니다"
  },
  {
    "id": "limits",
    "title": "16 · 명령을 더 낼 수 있는 이유와 유효한 일을 구별합니다"
  }
],
      component: () => import("@/pages/articles/gpu/sm-warp-scheduling-and-issue"),
    },
    {
      slug: "cuda-matrix-multiply",
      title: "CUDA 행렬 곱셈: 기초 → 공유메모리 타일링",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "overview", title: "행렬 곱을 traffic 문제로 읽기" },
        { id: "naive", title: "Output thread mapping" },
        { id: "tiled", title: "Shared-memory tile reuse" },
        { id: "performance", title: "GEMM 측정 방법" },
        { id: "release-gate", title: "Tile 선택과 채택 기준" },
      ],
      component: () => import("@/pages/articles/gpu/cuda-matrix-multiply"),
    },
    {
      slug: "cuda-shared-memory",
      title: "CUDA 공유 메모리: 뱅크 충돌, Coalescing",
      subcategory: "gpu-fundamentals",
      sections: [
  {
    "id": "overview",
    "title": "1. 가까운 곳에 잠시 놓으면 쓰는 순서를 바꿀 수 있습니다"
  },
  {
    "id": "black-box",
    "title": "2. 입력 표를 읽어 행과 열이 바뀐 출력 표를 만듭니다"
  },
  {
    "id": "case",
    "title": "3. 64칸짜리 행에서 2371번 값은 229번으로 갑니다"
  },
  {
    "id": "picture",
    "title": "4. 읽을 때는 옆 칸끼리, 쓸 때도 옆 칸끼리 모읍니다"
  },
  {
    "id": "why",
    "title": "5. 함께 놓는 공간과 기다리는 지점이 모두 필요합니다"
  },
  {
    "id": "names",
    "title": "6. 역할마다 shared memory와 coalescing이라는 이름을 붙입니다"
  },
  {
    "id": "trace",
    "title": "7. 읽는 thread와 쓰는 thread가 같은 칸을 넘겨줍니다"
  },
  {
    "id": "source-naive",
    "title": "8. 직접 전치하는 원문은 쓰기 주소를 64칸씩 띄웁니다"
  },
  {
    "id": "source-exchange",
    "title": "9. 실제 공동 공간 코드에 같은 두 thread를 넣습니다"
  },
  {
    "id": "coalescing",
    "title": "10. 주소가 덮는 sector 수와 실제 메모리 전송량을 구별합니다"
  },
  {
    "id": "bank-conflict",
    "title": "11. 같은 열을 읽으면 서로 다른 값이 같은 bank에 몰립니다"
  },
  {
    "id": "padding",
    "title": "12. 원본은 행마다 한 칸을 더해 충돌을 풀어 줍니다"
  },
  {
    "id": "reuse",
    "title": "13. 같은 값을 여덟 번 쓰는 경우에는 읽기 반복도 줄일 수 있습니다"
  },
  {
    "id": "boundary",
    "title": "14. 경계 검사는 접근을 막고 대기는 참여 범위를 지킵니다"
  },
  {
    "id": "aos-soa",
    "title": "15. 필요한 항목끼리 붙여 놓아도 주소 간격이 달라집니다"
  },
  {
    "id": "limits",
    "title": "16. 요청 수를 줄였는지와 전체 시간이 줄었는지를 함께 봅니다"
  }
],
      component: () => import("@/pages/articles/gpu/cuda-shared-memory"),
    },
    {
      slug: "gpu-memory-hierarchy-and-roofline",
      title: "GPU memory hierarchy 와 roofline: 네 가지 bound",
      subcategory: "gpu-fundamentals",
      sections: [
  {
    "id": "overview",
    "title": "1 · 계산기는 놀고 있는데 왜 프로그램은 끝나지 않을까요"
  },
  {
    "id": "black-box",
    "title": "2 · 가까운 곳에서 찾으면 먼 저장 장치로 가지 않습니다"
  },
  {
    "id": "case",
    "title": "3 · 64번 더하려고 유효 768바이트를 읽고 씁니다"
  },
  {
    "id": "picture",
    "title": "4 · 연속 128바이트는 32바이트 조각 4개에 들어갑니다"
  },
  {
    "id": "need",
    "title": "5 · 같은 요청을 합치고 중간값을 재사용하면 이동을 줄일 수 있습니다"
  },
  {
    "id": "names",
    "title": "6 · 저장 계층과 주소 공간은 다른 분류입니다"
  },
  {
    "id": "mechanism",
    "title": "7 · 1/12 FLOP/B에 1TB/s를 곱하면 약 83.3GFLOP/s입니다"
  },
  {
    "id": "source",
    "title": "8 · 공식 대역폭 식의 읽기와 쓰기에 512와 256을 넣습니다"
  },
  {
    "id": "comparison",
    "title": "9 · 실제 코드의 한 덧셈과 분석 도구의 여러 자원을 대조합니다"
  },
  {
    "id": "limits",
    "title": "10 · 상한에 못 미치는 이유에 따라 다음 실험을 고릅니다"
  }
],
      component: () => import("@/pages/articles/gpu/gpu-memory-hierarchy-and-roofline"),
    },
    {
      slug: "cuda-sync-streams",
      title: "CUDA 동기화 & 스트림",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "overview", title: "동기화 메커니즘" },
        { id: "streams", title: "CUDA 스트림" },
        { id: "events", title: "CUDA 이벤트" },
        { id: "multi-gpu", title: "다중 GPU" },
      ],
      component: () => import("@/pages/articles/gpu/cuda-sync-streams"),
    },
    {
      slug: "gpu-arch-hopper",
      title: "Hopper 아키텍처: SM, TMA, Cluster",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "overview", title: "Hopper data pipeline" },
        { id: "sm-structure", title: "SM과 latency hiding" },
        { id: "tma", title: "TMA producer–consumer" },
        { id: "cluster", title: "Cluster와 DSM" },
        { id: "transformer-engine", title: "FP8 precision contract" },
        { id: "release-gate", title: "Feature compatibility gate" },
      ],
      component: () => import("@/pages/articles/gpu/gpu-arch-hopper"),
    },
    {
      slug: "warp-specialization-and-async-pipelines",
      title: "Warp specialization 과 asynchronous pipeline: TMA, wgmma, stage ring",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "warp-specialization", title: "Producer·consumer warp 역할" },
        { id: "async-copy", title: "cp.async 와 TMA descriptor" },
        { id: "warpgroup-wgmma", title: "Warpgroup 과 wgmma" },
        { id: "stage-pipeline", title: "Stage ring 과 ⌈L/C⌉+1" },
        { id: "mbarrier-handshake", title: "mbarrier full·empty 손잡이" },
        { id: "software-pipelining", title: "Software pipelining 과 amortization" },
        {
          id: "evidence",
          title: "PTX ISA·CUDA 문서·CUTLASS·FlashAttention-3",
          subsections: [
            { id: "paper-ptx-isa-async", title: "PTX ISA 의 async·wgmma 규격" },
            { id: "paper-cuda-tma-guide", title: "CUDA 문서의 TMA 절차" },
            { id: "source-cutlass-warpspecialized", title: "CUTLASS sm90 소스" },
            { id: "paper-flashattention-3", title: "FlashAttention-3 논문" },
          ],
        },
      ],
      component: () => import("@/pages/articles/gpu/warp-specialization-and-async-pipelines"),
    },
    {
      slug: "gpu-data-movement-optimization",
      title: "Data movement 최적화: global→shared→register 경로와 overlap",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "data-movement", title: "세 층과 byte·overlap 두 손잡이" },
        { id: "global-to-shared", title: "Global→shared staging" },
        { id: "shared-to-register", title: "Shared→register fragment load" },
        { id: "round-trip", title: "Round trip 제거" },
        { id: "prefetching", title: "Prefetching" },
        { id: "overlap", title: "Overlap" },
        { id: "evidence", title: "근거" },
      ],
      component: () => import("@/pages/articles/gpu/gpu-data-movement-optimization"),
    },
    {
      slug: "cuda-perf-analysis",
      title: "CUDA 성능 분석: timing, Roofline, profiler",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "overview", title: "병목 가설 분석 loop" },
        { id: "measurement-protocol", title: "Warm-up과 timing 경계" },
        {
          id: "throughput-ledger",
          title: "Amdahl과 achieved ledger",
          subsections: [
            { id: "throughput-vs-peak", title: "Throughput 퍼센트와 roofline 의 peak" },
            { id: "paper-nsight-compute-profiling-guide", title: "Nsight Compute Profiling Guide 의 metric 정의" },
            { id: "counter-correlation", title: "Counter 상관으로 가설 세우기" },
          ],
        },
        {
          id: "profiling",
          title: "Nsight 분석 순서",
          subsections: [
            { id: "profiler-roles", title: "Nsight Systems 와 Nsight Compute 의 역할" },
          ],
        },
        { id: "release-gate", title: "Performance ablation gate" },
      ],
      component: () => import("@/pages/articles/gpu/cuda-perf-analysis"),
    },
    {
      slug: "warp-stall-reasons-and-issue-utilization",
      title: "Warp stall reason 읽기: scoreboard, barrier, not selected, issue slot",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "sampling", title: "Counter 와 warp state sampling" },
        { id: "stall-taxonomy", title: "Stall reason 의 분류와 수치 예" },
        { id: "scoreboard-barrier", title: "Long·short scoreboard 와 barrier" },
        { id: "eligible-issue-slot", title: "Eligible warp 와 issue slot utilization" },
        { id: "sm-utilization", title: "SM utilization 의 세 층위" },
        { id: "reading-procedure", title: "Stall 에서 처방까지의 판독 절차" },
        {
          id: "evidence",
          title: "Nsight Compute·Best Practices 근거",
          subsections: [
            { id: "paper-nsight-compute-warp-sampling", title: "Nsight Compute 의 warp sampling 과 stall reason" },
            { id: "paper-cuda-best-practices-profiling", title: "Best Practices Guide 의 profiling 지침" },
          ],
        },
      ],
      component: () => import("@/pages/articles/gpu/warp-stall-reasons-and-issue-utilization"),
    },
    {
      slug: "cuda-register-pressure",
      title: "CUDA register pressure: live range, occupancy, spill",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "overview", title: "Register와 live range" },
        { id: "live-range", title: "겹치는 value lifetime" },
        { id: "residency", title: "Residency와 occupancy" },
        { id: "spill-path", title: "Local-memory spill 경로" },
        { id: "release-gate", title: "Resource release gate" },
      ],
      component: () => import("@/pages/articles/gpu/cuda-register-pressure"),
    },
    {
      slug: "cuda-kernel-fusion",
      title: "CUDA kernel fusion과 Megakernel",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "overview", title: "Fusion 범위 구분" },
        { id: "small-fusion", title: "작은 elementwise fusion" },
        { id: "megakernel", title: "Megakernel 자원 trade-off" },
        { id: "flash-attention", title: "Tile-budgeted fusion" },
        { id: "kernel-stack", title: "CUTLASS·CuTe·Triton 선택 층" },
        { id: "release-gate", title: "Fusion release gate" },
      ],
      component: () => import("@/pages/articles/gpu/cuda-kernel-fusion"),
    },
    {
      slug: "cutlass-gemm-hierarchy-and-cute-layouts",
      title: "CUTLASS GEMM 계층과 CuTe layout: tile·fragment·swizzle·copy atom",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "tile-hierarchy", title: "Threadblock·warp·MMA tile 세 층" },
        { id: "mainloop-epilogue", title: "Mainloop 한 k-iteration 과 epilogue" },
        { id: "cute-layout", title: "CuTe layout 함수와 합성·tiling" },
        { id: "tv-partition", title: "Thread·value layout 과 copy/MMA atom" },
        { id: "swizzle", title: "Swizzled shared memory layout" },
        {
          id: "evidence",
          title: "CUTLASS 문서·CuTe 소스·EVT",
          subsections: [
            { id: "paper-cutlass-efficient-gemm", title: "Efficient GEMM 문서" },
            { id: "paper-cute-layout-docs", title: "CuTe layout·algebra 문서" },
            { id: "source-cute-mma-traits", title: "mma_traits_sm80·swizzle 소스" },
            { id: "paper-evt", title: "EVT 논문" },
          ],
        },
      ],
      component: () => import("@/pages/articles/gpu/cutlass-gemm-hierarchy-and-cute-layouts"),
    },
    {
      slug: "cutlass-collectives-and-tile-schedulers",
      title: "CUTLASS collective·tile scheduler·Stream-K·cluster",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "collectives", title: "CollectiveMma·CollectiveEpilogue 계약" },
        { id: "pipeline-stages", title: "Pipeline stage 수와 shared memory 예산" },
        { id: "tile-scheduler", title: "Persistent tile scheduler 와 wave quantization" },
        { id: "stream-k", title: "Stream-K 의 k-iteration 분배와 fixup" },
        { id: "cluster-multicast", title: "Cluster launch 와 TMA multicast" },
        { id: "autotuning", title: "Profiler 기반 autotuning" },
        {
          id: "evidence",
          title: "Stream-K 논문·CUTLASS 소스·Hopper 문서",
          subsections: [
            { id: "paper-stream-k", title: "Stream-K 논문" },
            { id: "paper-cutlass-gemm-api", title: "CUTLASS GEMM API 3.x" },
            { id: "source-cutlass-tile-scheduler", title: "Tile scheduler·builder 소스" },
            { id: "paper-hopper-tuning-guide", title: "Hopper tuning guide·profiler" },
          ],
        },
      ],
      component: () => import("@/pages/articles/gpu/cutlass-collectives-and-tile-schedulers"),
    },
    {
      slug: "triton-kernel-programming-and-compiler",
      title: "Triton: block 프로그래밍 모델, autotune, MLIR 컴파일, specialization",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "block-program", title: "Program instance·BLOCK_SIZE·mask" },
        { id: "launch-and-autotune", title: "num_warps·num_stages 와 autotune" },
        { id: "jit-specialization", title: "JIT cache key 와 specialization" },
        { id: "compiler-pipeline", title: "Triton IR → TritonGPU IR → PTX" },
        { id: "tradeoff", title: "CUDA 와 Triton 의 소유 범위 비교" },
        {
          id: "evidence",
          title: "Tillet 2019·공식 문서·runtime 소스",
          subsections: [
            { id: "paper-triton-mapl", title: "Tillet, Kung, Cox · Triton (MAPL 2019)" },
            { id: "doc-triton-programming-guide", title: "Triton 공식 문서와 tutorial" },
            { id: "source-triton-jit-runtime", title: "jit.py 와 NVIDIA backend compiler.py" },
            { id: "doc-mlir", title: "MLIR" },
          ],
        },
      ],
      component: () => import("@/pages/articles/gpu/triton-kernel-programming-and-compiler"),
    },
    {
      slug: "cuda-persistent-kernels",
      title: "CUDA persistent kernel: queue, worker, work assignment, shutdown",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "overview", title: "Long-lived worker model 과 Persistent Threads" },
        { id: "worker-residency", title: "Worker resource budget" },
        { id: "queue-progress", title: "Queue와 backpressure" },
        { id: "work-assignment", title: "Static·dynamic 배분과 work stealing" },
        { id: "shutdown", title: "Drain과 종료" },
        { id: "release-gate", title: "Persistent release gate" },
      ],
      component: () => import("@/pages/articles/gpu/cuda-persistent-kernels"),
    },
    {
      slug: "megakernel-design-tradeoffs",
      title: "Megakernel: 전역 scheduling 의 이득과 자원 공유 비용",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "problem", title: "Batch-1 decode 의 launch 와 tail" },
        { id: "global-scheduling", title: "Task 단위 global scheduling 과 이득 식" },
        { id: "task-loop", title: "Counter 와 barrier 의 intra-kernel sync" },
        { id: "resource-sharing", title: "Register 상한과 shared memory paging" },
        { id: "code-footprint", title: "Instruction cache 와 control flow" },
        { id: "graph-vs-megakernel", title: "CUDA graph 와의 비교" },
        {
          id: "evidence",
          title: "MPK·Hazy Research·FA3 근거",
          subsections: [
            { id: "paper-mpk-megakernel-compiler", title: "MPK compiler·runtime" },
            { id: "paper-hazy-no-bubbles", title: "Hazy Research Llama-1B megakernel" },
            { id: "paper-flashattention-3", title: "FlashAttention-3 warp specialization" },
            { id: "paper-cuda-cooperative-groups", title: "CUDA Programming Guide 의 grid sync" },
            { id: "paper-dissecting-volta", title: "Volta instruction cache 측정" },
          ],
        },
      ],
      component: () => import("@/pages/articles/gpu/megakernel-design-tradeoffs"),
    },
    {
      slug: "cfd-finite-volume-gpu",
      title: "CFD 기초: finite volume에서 GPU mapping까지",
      subcategory: "gpu-fundamentals",
      sections: [
        { id: "conservation", title: "보존 법칙과 CFD 경계" },
        { id: "finite-volume", title: "Finite-volume cell balance" },
        { id: "time-step", title: "CFL time-step budget" },
        { id: "gpu-mapping", title: "Stencil과 GPU memory mapping" },
        { id: "verification", title: "Verification·validation gate" },
      ],
      component: () =>
        import("@/pages/articles/gpu/cfd-finite-volume-gpu"),
    },
    {
      slug: "msm-ntt",
      title: "MSM·NTT GPU workload: bucket, stage, residency",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "같은 GPU, 다른 dependency" },
        { id: "workload-contract", title: "고정 proof workload" },
        { id: "parallel-frontier", title: "Bucket과 stage 경계" },
        { id: "residency-budget", title: "Resident memory 예산" },
        { id: "release-gate", title: "Correctness-first 측정" },
      ],
      component: () => import("@/pages/articles/blockchain/msm-ntt"),
    },
    {
      slug: "filecoin-gpu-proofs",
      title: "Filecoin 증명 GPU: phase artifact와 검증 gate",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "Sector에서 proof까지" },
        { id: "phase-chain", title: "Phase artifact chain" },
        { id: "parameter-binding", title: "Parameter·cache binding" },
        { id: "accelerator-split", title: "Bellperson accelerator split" },
        { id: "release-gate", title: "Deadline release gate" },
      ],
      component: () =>
        import("@/pages/articles/blockchain/filecoin-gpu-proofs"),
    },
    // ── ZK GPU 심화 ──
    {
      slug: "ec-gpu-ops",
      title: "타원곡선 GPU 연산: Fp 곱셈, 점 덧셈 CUDA 커널",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "표현부터 point output까지" },
        { id: "field-layout", title: "Field work-item layout" },
        { id: "fp-montgomery", title: "Carry와 Montgomery schedule" },
        { id: "point-ops", title: "Jacobian kernel lowering" },
        { id: "msm-mapping", title: "MSM window/group mapping" },
        { id: "release-gate", title: "Field·point parity gate" },
      ],
      component: () => import("@/pages/articles/gpu/ec-gpu-ops"),
    },
    {
      slug: "msm-gpu-impl",
      title: "MSM GPU 구현: 버킷 누적과 커널 설계",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "MSM 입력부터 결과까지" },
        { id: "work-plan", title: "Signed window 작업표" },
        { id: "bucket-ownership", title: "Bucket ownership" },
        { id: "reduction", title: "Running-sum reduction" },
        { id: "release-gate", title: "Parity·measurement gate" },
      ],
      component: () => import("@/pages/articles/gpu/msm-gpu-impl"),
    },
    {
      slug: "ntt-gpu-impl",
      title: "NTT GPU 구현: Butterfly 커널과 메모리 전략",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "NTT 호출의 전체 계약" },
        { id: "stage-tile", title: "Butterfly stage tile" },
        { id: "twiddle-contract", title: "Twiddle artifact" },
        { id: "permutation-plan", title: "Permutation·buffer plan" },
        { id: "release-gate", title: "Round-trip release gate" },
      ],
      component: () => import("@/pages/articles/gpu/ntt-gpu-impl"),
    },
    {
      slug: "gpu-proof-pipeline",
      title: "GPU 증명 파이프라인: Groth16/PLONK 전체 흐름",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "Kernel 목록에서 DAG로" },
        { id: "stage-dag", title: "Proof stage dependency" },
        { id: "buffer-liveness", title: "Buffer lifetime과 peak" },
        { id: "overlap", title: "Stream overlap과 critical path" },
        { id: "release-gate", title: "Verifier-first release gate" },
      ],
      component: () => import("@/pages/articles/gpu/gpu-proof-pipeline"),
    },
    {
      slug: "icicle-framework",
      title: "ICICLE: backend·memory·primitive runtime contract",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "Framework의 실제 경계" },
        { id: "backend-dispatch", title: "Backend dispatch" },
        { id: "memory-stream", title: "Memory·stream ownership" },
        { id: "primitive-config", title: "Primitive config" },
        { id: "release-gate", title: "Backend release gate" },
      ],
      component: () => import("@/pages/articles/gpu/icicle-framework"),
    },
    {
      slug: "poseidon-gpu",
      title: "Poseidon GPU: parameter artifact와 batch kernel",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "Profile에서 proof root까지" },
        { id: "parameter-artifact", title: "Parameter artifact" },
        { id: "round-kernel", title: "Round kernel mapping" },
        { id: "batch-tree", title: "Batch·tree frontier" },
        { id: "release-gate", title: "Poseidon release gate" },
      ],
      component: () => import("@/pages/articles/gpu/poseidon-gpu"),
    },
    {
      slug: "poly-ops-gpu",
      title: "다항식 연산 GPU: coset NTT, 나눗셈, 다점 평가",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "Polynomial workload 전체 지도" },
        { id: "form-domain", title: "Form·domain artifact" },
        { id: "coset-plan", title: "Coset NTT plan" },
        { id: "recurrence-map", title: "Horner·division dependency" },
        { id: "release-gate", title: "Representation release gate" },
      ],
      component: () => import("@/pages/articles/gpu/poly-ops-gpu"),
    },
    {
      slug: "kzg-gpu",
      title: "KZG 커밋먼트 GPU: SRS, MSM 기반 커밋, Batch Opening",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "Polynomial부터 receipt까지" },
        { id: "srs-residency", title: "SRS validation·residency" },
        { id: "commit-job", title: "Commitment MSM binding" },
        { id: "opening-dag", title: "Opening job DAG" },
        { id: "release-gate", title: "Verifier-first release gate" },
      ],
      component: () => import("@/pages/articles/gpu/kzg-gpu"),
    },
    {
      slug: "ec-gpu-gen",
      title: "ec-gpu-gen: 커브별 CUDA/OpenCL 커널 자동 생성",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "Type에서 artifact까지" },
        { id: "parameter-contract", title: "GpuField parameter 계약" },
        { id: "codegen", title: "Source specialization" },
        { id: "artifact-lifecycle", title: "CUDA/OpenCL artifact" },
        { id: "runtime-dispatch", title: "Program runtime dispatch" },
        { id: "release-gate", title: "Codegen release gate" },
      ],
      component: () => import("@/pages/articles/gpu/ec-gpu-gen"),
    },
    {
      slug: "rapidsnark-gpu",
      title: "rapidsnark: Groth16 GPU Prover 구현 분석",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "Current CPU vs GPU boundary" },
        { id: "input-contract", title: "WTNS·zkey admission" },
        { id: "cpu-stage-map", title: "Pinned CPU stage map" },
        { id: "gpu-boundary", title: "Proposed GPU adapter" },
        { id: "release-gate", title: "Hybrid release gate" },
      ],
      component: () => import("@/pages/articles/gpu/rapidsnark-gpu"),
    },
    {
      slug: "gpu-witness-gen",
      title: "GPU Witness 생성: dataflow frontier와 검증 gate",
      subcategory: "zk-acceleration",
      sections: [
        { id: "overview", title: "Witness program의 경계" },
        { id: "dataflow-dag", title: "Signal dataflow DAG" },
        { id: "frontier-schedule", title: "Level frontier schedule" },
        { id: "residency-plan", title: "Live buffer residency" },
        { id: "release-gate", title: "Witness release gate" },
      ],
      component: () => import("@/pages/articles/gpu/gpu-witness-gen"),
    },
    {
      slug: "gemmini-pe-mac-dataflow",
      title: "PE 한 칸: MAC 을 이중 레지스터로 감싸 데이터플로우를 전환합니다",
      subcategory: "accelerator-design",
      sections: [
        { id: "problem", title: "PE 한 칸은 systolic array 전체의 반복 단위" },
        { id: "mac-unit", title: "MacUnit — 곱셈+누산 원자 연산" },
        { id: "dataflow", title: "Weight-/Output-Stationary 전환" },
        { id: "double-buffer", title: "c1·c2 이중 레지스터와 flip" },
        { id: "build", title: "직접 만들어 시뮬레이션까지" },
        { id: "boundary", title: "PE 혼자서는 계산이 안 되는 이유" },
        { id: "paper-gemmini", title: "근거: Gemmini DAC 2021" },
      ],
      component: () => import("@/pages/articles/gpu/gemmini-pe-mac-dataflow"),
    },
  ],
};

export default gpu;
