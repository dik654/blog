import type { CodeRef } from "@/components/code/types";
import sampler from "./codebase/vllm/v1/sample/rejection_sampler.py?raw";
import scheduler from "./codebase/vllm/v1/core/sched/scheduler.py?raw";
import config from "./codebase/vllm/config/speculative.py?raw";
import runner from "./codebase/vllm/v1/worker/gpu_model_runner.py?raw";
import dynamic from "./codebase/vllm/v1/spec_decode/dynamic/utils.py?raw";

export const codeRefs: Record<string, CodeRef> = {
"rejection-test": {
  "path": "vllm/v1/sample/rejection_sampler.py",
  "highlight": [
    774,
    850
  ],
  "desc": "같은 후보 A·B·B·A를 확인합니다. 셋째 B의 배열 위치는 2×2+1=5이고 p=.3, q=.6, 비교값 .8입니다. 원문 조건 .3/.6>=.8은 false여서 교체 ID 0을 씁니다. 아래는 v0.27.1 commit 6e448d0의 전체 원문입니다.",
  "annotations": [
    {
      "lines": [
        805,
        829
      ],
      "color": "sky",
      "note": "요청의 시작 위치와 후보 ID로 같은 p·q를 찾습니다. 셋째 B는 평탄한 확률 배열의 5번입니다."
    },
    {
      "lines": [
        830,
        840
      ],
      "color": "emerald",
      "note": "p/q >= uniform을 확인합니다. 거부하면 recovered ID 0을 쓰고 rejected를 켭니다."
    },
    {
      "lines": [
        842,
        850
      ],
      "color": "amber",
      "note": "거부 없이 끝난 요청만 마지막 분포의 bonus를 추가합니다."
    }
  ],
  "lang": "python"
,
"code": sampler
},
"prefix-stop": {
  "path": "vllm/v1/sample/rejection_sampler.py",
  "highlight": [
    800,
    850
  ],
  "desc": "첫 거부 전의 후보만 그대로 확정됩니다. 원문을 CPU 포인터 대역과 실행한 작은 사례에서 [0,1,0,-1,-1]을 얻었습니다. correction ID는 별도 부족분 계산에서 제공했으며 Triton/GPU를 실행한 결과는 아닙니다.",
  "annotations": [
    {
      "lines": [
        804,
        805
      ],
      "color": "sky",
      "note": "rejected가 켜진 뒤에는 다음 위치의 수락 판정과 쓰기를 건너뜁니다."
    },
    {
      "lines": [
        832,
        840
      ],
      "color": "emerald",
      "note": "셋째의 교체 ID 0까지 출력합니다. 네 번째 후보와 bonus 칸은 -1로 남습니다."
    },
    {
      "lines": [
        842,
        850
      ],
      "color": "amber",
      "note": "모두 수락한 경우에만 5번째 칸에 bonus를 기록합니다."
    }
  ],
  "lang": "python"
,
"code": sampler
},
"recovered-setup": {
  "path": "vllm/v1/sample/rejection_sampler.py",
  "highlight": [
    663,
    710
  ],
  "desc": "교체 후보는 첫 거부 위치를 찾기 전에 준비합니다. 요청마다 어휘 크기의 지수 난수 한 벌을 만들고 역수를 각 위치의 부족분에 곱합니다. 실제 사용하는 교체 ID는 첫 거부 위치의 하나입니다.",
  "annotations": [
    {
      "lines": [
        679,
        694
      ],
      "color": "sky",
      "note": "어휘마다 지수 난수를 만들며 inverse 값 inv_q는 draft 확률 q와 다른 변수입니다."
    },
    {
      "lines": [
        696,
        710
      ],
      "color": "emerald",
      "note": "위치별 교체 후보를 미리 구합니다. 같은 요청의 여러 위치가 난수 한 벌을 공유합니다."
    }
  ],
  "lang": "python"
,
"code": sampler
},
"recovered-residual": {
  "path": "vllm/v1/sample/rejection_sampler.py",
  "highlight": [
    873,
    964
  ],
  "desc": "부족분 (.3,0)에 양의 난수 배율을 곱하면 A만 양수입니다. 전체 후보의 공통 정규화 계수는 argmax에 영향을 주지 않아 생략합니다. 부족분 자체의 deterministic argmax와는 다릅니다.",
  "annotations": [
    {
      "lines": [
        914,
        933
      ],
      "color": "sky",
      "note": "일반 경로는 max(p-q,0), one-hot 경로는 제안 ID를 제외한 target 확률을 만듭니다."
    },
    {
      "lines": [
        943,
        954
      ],
      "color": "emerald",
      "note": "부족분에 독립 지수 난수의 역수를 곱한 뒤 최대 점수를 고릅니다. 어휘 밖은 -inf로 가립니다."
    },
    {
      "lines": [
        958,
        964
      ],
      "color": "amber",
      "note": "tile의 최댓값을 비교하고 어휘 범위 안의 ID를 씁니다."
    }
  ],
  "lang": "python"
,
"code": sampler
},
"parse-output": {
  "path": "vllm/v1/sample/rejection_sampler.py",
  "highlight": [
    252,
    287
  ],
  "desc": "K=4의 출력 버퍼 폭은 5입니다. [0,1,0,-1,-1]에서 placeholder를 빼면 [0,1,0]입니다. 이 함수의 필터와 뒤의 EOS·최대 출력 길이 처리를 구별합니다.",
  "annotations": [
    {
      "lines": [
        270,
        275
      ],
      "color": "sky",
      "note": "원문의 valid mask는 -1과 어휘 상한을 확인합니다."
    },
    {
      "lines": [
        282,
        287
      ],
      "color": "emerald",
      "note": "유효한 원소만 순서대로 반환합니다. 이 부분만으로 EOS까지 처리한 것은 아닙니다."
    }
  ],
  "lang": "python"
,
"code": sampler
},
"metadata": {
  "path": "vllm/v1/worker/gpu_model_runner.py",
  "highlight": [
    2851,
    2923
  ],
  "desc": "한 요청에 후보 네 개와 마지막 확정 입력을 함께 넣은 5자리 사례입니다. 점수 index는 0..4, 후보 확인은 0..3, bonus는 4이며 draft ID를 읽을 입력은 한 칸 뒤로 맞춥니다.",
  "annotations": [
    {
      "lines": [
        2867,
        2880
      ],
      "color": "sky",
      "note": "후보 수 4에 1을 더해 한 요청의 점수 위치 5개를 만듭니다."
    },
    {
      "lines": [
        2882,
        2896
      ],
      "color": "emerald",
      "note": "bonus는 누적 끝-1인 4입니다. 후보 확인 점수는 앞 네 위치입니다."
    },
    {
      "lines": [
        2911,
        2915
      ],
      "color": "amber",
      "note": "점수 바로 뒤의 입력 ID가 해당 점수로 확인할 후보입니다."
    }
  ],
  "lang": "python"
,
"code": runner
},
"rollback": {
  "path": "vllm/v1/core/sched/scheduler.py",
  "highlight": [
    1762,
    1793
  ],
  "desc": "확정 글 4·computed 3에서 마지막 입력과 후보 네 개를 계산해 computed 8입니다. 반환된 ID 3개 중 수락 후보는 2개이고 거부 수는 2입니다. stale이 아닌 동기 사례에서 8-2=6으로 되돌립니다.",
  "annotations": [
    {
      "lines": [
        1772,
        1775
      ],
      "color": "sky",
      "note": "generated 길이 3에서 새 sample 1을 빼 수락 2를 구하고 후보 4에서 빼 거부 2를 구합니다."
    },
    {
      "lines": [
        1776,
        1784
      ],
      "color": "emerald",
      "note": "stale output은 되돌림을 다시 적용하지 않습니다. 이번 정상 경로는 computed 8을 6으로 줄입니다."
    }
  ],
  "lang": "python"
,
"code": scheduler
},
"dynamic-policy": {
  "path": "vllm/v1/core/sched/scheduler.py",
  "highlight": [
    1192,
    1198
  ],
  "desc": "현재 scheduled 요청 수로 사용자가 지정한 조회표를 읽습니다. 표가 [1,64,3], [65,128,1], [129,512,0]이면 크기 64→3, 65→1, 129→0입니다. 이 분기가 최근 수락률로 최적값을 학습하는 것은 아닙니다.",
  "annotations": [
    {
      "lines": [
        1193,
        1198
      ],
      "color": "sky",
      "note": "len(num_scheduled_tokens)를 조회 index로 사용합니다."
    }
  ],
  "lang": "python"
,
"code": scheduler
},
"dynamic-table": {
  "path": "vllm/v1/spec_decode/dynamic/utils.py",
  "highlight": [
    76,
    157
  ],
  "desc": "구간 [1,2,4], [4,6,1]과 허용 깊이 3을 넣으면 batch 3은 이전 K를 이어받아 3, batch 7은 마지막 K=1입니다. 원문 전체를 Python 3.12에서 실행한 계산용 입력입니다.",
  "annotations": [
    {
      "lines": [
        103,
        115
      ],
      "color": "sky",
      "note": "빈 사이 구간은 직전 K를 이어받고 전체 허용 깊이로 min을 취합니다."
    },
    {
      "lines": [
        117,
        125
      ],
      "color": "emerald",
      "note": "지정한 구간의 양끝을 포함해 K를 채웁니다."
    },
    {
      "lines": [
        144,
        156
      ],
      "color": "amber",
      "note": "마지막 구간 뒤도 직전 K를 유지합니다."
    }
  ],
  "lang": "python"
,
"code": dynamic
},
"sampling-config": {
  "path": "vllm/config/speculative.py",
  "highlight": [
    217,
    291
  ],
  "desc": "고정 버전은 rejection_sample_method=standard, draft_sample_method=greedy가 기본입니다. 일반 random target 검증에 결정적 A만 제안하면 실제 제안 분포 q=(1,0)으로 다뤄야 합니다.",
  "annotations": [
    {
      "lines": [
        217,
        223
      ],
      "color": "sky",
      "note": "standard·synthetic·block은 서로 다른 검증 설정입니다."
    },
    {
      "lines": [
        284,
        290
      ],
      "color": "emerald",
      "note": "greedy 제안은 one-hot으로 처리합니다. probabilistic 제안은 실제 분포를 함께 보관합니다."
    }
  ],
  "lang": "python"
,
"code": config
},
"sampling-constraints": {
  "path": "vllm/v1/sample/rejection_sampler.py",
  "highlight": [
    150,
    180
  ],
  "desc": "같은 prefix의 target 점수에 logits processor와 온도·top-k/top-p 제약을 적용합니다. 본문의 p는 이 과정을 거쳐 실제 선택에 사용하는 분포입니다. raw 점수나 다른 제약의 draft 분포와 혼동하지 않습니다.",
  "annotations": [
    {
      "lines": [
        151,
        163
      ],
      "color": "sky",
      "note": "target logits를 float32로 변환하고 processor를 적용합니다."
    },
    {
      "lines": [
        164,
        176
      ],
      "color": "emerald",
      "note": "sampling 제약을 적용한 점수를 rejection_sample에 넘깁니다. 실제 제약 함수는 같은 파일 510행부터입니다."
    }
  ],
  "lang": "python"
,
"code": sampler
},
};
