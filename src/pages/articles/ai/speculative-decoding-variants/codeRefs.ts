import type { CodeRef } from "@/components/code/types";
import source0 from "./codebase/medusa/medusa/model/utils.py?raw";
import source1 from "./codebase/medusa/medusa/model/modeling_llama_kv.py?raw";
import source2 from "./codebase/medusa/medusa/model/utils.py?raw";
import source3 from "./codebase/medusa/medusa/model/utils.py?raw";
import source4 from "./codebase/medusa/medusa/model/utils.py?raw";
import source5 from "./codebase/medusa/medusa/model/utils.py?raw";
import source6 from "./codebase/medusa/medusa/model/utils.py?raw";
import source7 from "./codebase/layerskip/self_speculation/self_speculation_generator.py?raw";
import source8 from "./codebase/layerskip/self_speculation/llama_model_utils.py?raw";
import source9 from "./codebase/arctic/arctic_inference/suffix_decoding/cache.py?raw";
import source10 from "./codebase/arctic/csrc/suffix_decoding/suffix_tree.cc?raw";
import source11 from "./codebase/arctic/csrc/suffix_decoding/suffix_tree.cc?raw";
import source12 from "./codebase/arctic/arctic_inference/suffix_decoding/cache.py?raw";
export const codeRefs:Record<string,CodeRef>={
"buffers":{
  "path": "medusa/medusa/model/utils.py",
  "highlight": [
    32,
    125
  ],
  "desc": "같은 여섯 갈래를 실제 generate_medusa_buffers에 넣습니다. 시작점까지 포함한 7×7 mask와 [0,1,1,2,2,2,2] 위치 번호를 만듭니다. Medusa e2a5d20의 전체 원문입니다.",
  "annotations": [
    {
      "lines": [
        58,
        72
      ],
      "color": "sky",
      "note": "자기 자신·시작점·실제 조상만 열어 1을 17개 만듭니다."
    },
    {
      "lines": [
        75,
        90
      ],
      "color": "sky",
      "note": "반복한 X·Y는 같은 head에서 가져오지만 경로의 기록은 별도입니다."
    },
    {
      "lines": [
        92,
        109
      ],
      "color": "sky",
      "note": "경로를 뒤에서 꺼내 [0,2,6], [0,2,5], [0,1,4], [0,1,3]을 만듭니다."
    }
  ],
  "lang": "python"
,code:source0},
"mask-apply":{
  "path": "medusa/medusa/model/modeling_llama_kv.py",
  "highlight": [
    794,
    828
  ],
  "desc": "후보를 일렬로 붙였다고 형제의 기록을 읽어서는 안 됩니다. 실제 준비 함수는 마지막 7×7 영역에서 tree mask가 0인 칸을 가립니다.",
  "annotations": [
    {
      "lines": [
        815,
        821
      ],
      "color": "sky",
      "note": "기존 앞 글 영역은 유지하고 새 후보 영역에서 금지된 연결을 가립니다."
    }
  ],
  "lang": "python"
,code:source1},
"root":{
  "path": "medusa/medusa/model/utils.py",
  "highlight": [
    258,
    307
  ],
  "desc": "시작 R은 이미 저장한 기준 모델 점수에서 새로 고릅니다. Medusa head의 A·B 및 X·Y 후보와 합친 뒤 tree_indices로 일곱 자리를 만듭니다.",
  "annotations": [
    {
      "lines": [
        279,
        281
      ],
      "color": "sky",
      "note": "temperature 0이면 target 점수의 argmax를 첫 칸으로 둡니다."
    },
    {
      "lines": [
        289,
        305
      ],
      "color": "sky",
      "note": "head별 top-10 후보를 같은 위치표로 모읍니다. 그림의 후보 여섯 개와 TOPK 상수 10은 다른 수입니다."
    }
  ],
  "lang": "python"
,code:source2},
"tree-forward":{
  "path": "medusa/medusa/model/utils.py",
  "highlight": [
    309,
    348
  ],
  "desc": "기존 글 길이 4에 상대 위치 [0,1,1,2,2,2,2]를 더합니다. 각 경로의 점수를 retrieve_indices로 다시 꺼냅니다.",
  "annotations": [
    {
      "lines": [
        333,
        346
      ],
      "color": "sky",
      "note": "일곱 입력의 위치는 [4,5,5,6,6,6,6]입니다. 같은 깊이는 같은 위치를 사용합니다."
    }
  ],
  "lang": "python"
,code:source3},
"greedy":{
  "path": "medusa/medusa/model/utils.py",
  "highlight": [
        436,
        472
      ],
  "desc": "R 뒤 A, RA 뒤 Y가 가장 높은 가정 점수를 넣습니다. 후보의 다음 칸과 부모의 점수를 비교해 RAY 행의 연속 일치 길이 2를 고릅니다.",
  "annotations": [
    {
      "lines": [
        461,
        465
      ],
      "color": "sky",
      "note": "cumprod는 첫 불일치 뒤를 전부 0으로 만듭니다."
    },
    {
      "lines": [
        466,
        472
      ],
      "color": "sky",
      "note": "길이가 가장 긴 경로의 행 번호와 root를 제외한 일치 길이를 반환합니다."
    }
  ],
  "lang": "python"
,code:source4},
"commit":{
  "path": "medusa/medusa/model/utils.py",
  "highlight": [
        531,
        593
      ],
  "desc": "확정 경로 [0,1,4]에 기존 길이 4를 더한 [4,5,8]을 고릅니다. 실제 copy_로 KV를 [4,5,6]에 모으고 길이를 7로 바꿉니다.",
  "annotations": [
    {
      "lines": [
        564,
        572
      ],
      "color": "sky",
      "note": "root까지 accept_length+1개를 출력에 추가합니다."
    },
    {
      "lines": [
        575,
        584
      ],
      "color": "sky",
      "note": "경로 밖 기록은 유효 길이에 남기지 않습니다. 이 구현은 실제 값을 복사합니다."
    },
    {
      "lines": [
        586,
        593
      ],
      "color": "sky",
      "note": "마지막 확정 위치의 다음 점수를 보관합니다. C를 이번 출력에 붙이는 단계는 없습니다."
    }
  ],
  "lang": "python"
,code:source5},
"typical":{
  "path": "medusa/medusa/model/utils.py",
  "highlight": [
        474,
        502
      ],
  "desc": "temperature가 0이 아니고 typical·fast이면 확률 문턱을 넘은 후보를 허용합니다. 정확한 target 분포를 복원하는 residual 규칙과는 다른 기준입니다.",
  "annotations": [
    {
      "lines": [
        476,
        487
      ],
      "color": "sky",
      "note": "후보 확률과 entropy 기반 문턱을 비교합니다."
    },
    {
      "lines": [
        490,
        502
      ],
      "color": "sky",
      "note": "가장 긴 경로를 고르고 같은 길이면 likelihood로 결정합니다."
    }
  ],
  "lang": "python"
,code:source6},
"self-loop":{
  "path": "layerskip/self_speculation/self_speculation_generator.py",
  "highlight": [
        102,
        229
      ],
  "desc": "LayerSkip 494752e5 원문은 앞 층에서 후보를 만들고 남은 층으로 확인합니다. 끝에서 출력 길이보다 하나 짧게 KV를 잘라 다음 입력을 남깁니다.",
  "annotations": [
    {
      "lines": [
        126,
        145
      ],
      "color": "sky",
      "note": "각 후보를 만들며 exit_query_cache를 이어 저장합니다."
    },
    {
      "lines": [
        175,
        205
      ],
      "color": "sky",
      "note": "후보 뒤의 한 위치까지 계산하고 첫 불일치 전까지 남깁니다."
    },
    {
      "lines": [
        218,
        221
      ],
      "color": "sky",
      "note": "마지막 새 선택은 다음 바퀴 입력이며 계산 기록에서 제외합니다."
    }
  ],
  "lang": "python"
,code:source7},
"self-cache":{
  "path": "layerskip/self_speculation/llama_model_utils.py",
  "highlight": [
    213,
    390
  ],
  "desc": "앞 층의 중간 상태를 exit_query_cache에 보관해 뒷 층이 재사용합니다. 검증 때 마지막 후보의 앞 층 계산도 한 번 필요하므로 층 비율만으로 시간을 정할 수 없습니다.",
  "annotations": [
    {
      "lines": [
        266,
        269
      ],
      "color": "sky",
      "note": "이미 계산한 앞 층의 hidden state를 연결해 남깁니다."
    },
    {
      "lines": [
        350,
        370
      ],
      "color": "sky",
      "note": "앞 층에서 마지막 입력을 처리한 뒤 저장 상태와 합쳐 남은 층으로 보냅니다."
    }
  ],
  "lang": "python"
,code:source8},
"suffix-wrapper":{
  "path": "arctic/arctic_inference/suffix_decoding/cache.py",
  "highlight": [
    235,
    310
  ],
  "desc": "ArcticInference aca5d9a8의 wrapper는 현재 요청과 전역 기록을 모두 조회하고 점수가 높은 쪽을 고릅니다. 여기서는 최대 후보 4를 명시해 호출합니다.",
  "annotations": [
    {
      "lines": [
        284,
        285
      ],
      "color": "sky",
      "note": "고정 버전의 None 기본값 경로는 존재하지 않는 max_depth를 참조합니다. 명시적 max_spec_tokens=4로 이 경로를 피합니다."
    },
    {
      "lines": [
        289,
        310
      ],
      "color": "sky",
      "note": "두 조회를 한 뒤 점수 비교로 하나를 반환하며 같은 점수면 현재 요청 쪽을 택합니다."
    }
  ],
  "lang": "python"
,code:source9},
"suffix-lengths":{
  "path": "arctic/csrc/suffix_decoding/suffix_tree.cc",
  "highlight": [
    593,
    624
  ],
  "desc": "최근 [99,9,0]의 끝 1개와 2개를 차례로 조회합니다. 이 고정 원문은 context 길이보다 짧은 길이만 검사하고 점수로 최종 후보를 고릅니다.",
  "annotations": [
    {
      "lines": [
        600,
        609
      ],
      "color": "sky",
      "note": "상한은 길이×계수+offset을 정수로 내린 값과 전체 후보 한도 중 작은 수입니다."
    },
    {
      "lines": [
        616,
        621
      ],
      "color": "sky",
      "note": "같은 점수면 나중의 더 긴 일치를 남깁니다. 무조건 가장 긴 suffix만 선택하는 절차는 아닙니다."
    }
  ],
  "lang": "c"
,code:source10},
"suffix-tree":{
  "path": "arctic/csrc/suffix_decoding/suffix_tree.cc",
  "highlight": [
    856,
    909
  ],
  "desc": "기록 8개에서 A 확률 .75, A 뒤 Y 경로 확률 .625를 얻습니다. 실제 priority queue가 네 후보 A·Y·B·Y와 부모 [-1,0,-1,2]를 만듭니다.",
  "annotations": [
    {
      "lines": [
        868,
        888
      ],
      "color": "sky",
      "note": "경로 확률이 큰 항목부터 꺼내며 그 확률을 score에 더합니다."
    },
    {
      "lines": [
        891,
        901
      ],
      "color": "sky",
      "note": "자식 count를 현재 node count로 나누어 확률을 이어 곱합니다. 종료된 기록도 분모에 남을 수 있습니다."
    }
  ],
  "lang": "c"
,code:source11},
"suffix-state":{
  "path": "arctic/arctic_inference/suffix_decoding/cache.py",
  "highlight": [
    120,
    233
  ],
  "desc": "현재 요청의 prompt와 출력은 local tree에, 여러 요청에 공개하는 출력은 global tree에 저장합니다. stop_request는 local만 없애며 global 출력은 별도 eviction까지 남습니다.",
  "annotations": [
    {
      "lines": [
        150,
        161
      ],
      "color": "sky",
      "note": "현재 요청을 시작하며 local 기록과 global용 식별자를 준비합니다."
    },
    {
      "lines": [
        199,
        215
      ],
      "color": "sky",
      "note": "새로 확정한 출력을 local과 아직 남아 있는 global 슬롯에 추가합니다."
    },
    {
      "lines": [
        217,
        233
      ],
      "color": "sky",
      "note": "별도 반환 함수가 전역 기록과 식별자를 지웁니다."
    }
  ],
  "lang": "python"
,code:source12}
};
