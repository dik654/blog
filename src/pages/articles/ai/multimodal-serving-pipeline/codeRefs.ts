import type { CodeRef } from "@/components/code/types";
import resizeSource from "./codebase/transformers/src/transformers/models/qwen2_vl/image_processing_qwen2_vl.py?raw";
import processorSource from "./codebase/transformers/src/transformers/models/qwen2_5_vl/processing_qwen2_5_vl.py?raw";
import encoderCacheSource from "./codebase/vllm/vllm/v1/core/encoder_cache_manager.py?raw";
import schedulerSource from "./codebase/vllm/vllm/v1/core/sched/scheduler.py?raw";
import schedulerConfigSource from "./codebase/vllm/vllm/config/scheduler.py?raw";
import kvUtilsSource from "./codebase/vllm/vllm/v1/core/kv_cache_utils.py?raw";
import multimodalConfigSource from "./codebase/vllm/vllm/config/multimodal.py?raw";
import sglangCacheSource from "./codebase/sglang/python/sglang/srt/mem_cache/multimodal_cache.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "smart-resize": {
    path: "transformers/src/transformers/models/qwen2_vl/image_processing_qwen2_vl.py",
    highlight: [63, 89],
    desc: "가로·세로를 28의 배수로 맞추고 전체 픽셀 수를 상한과 하한 안에 넣습니다.",
    annotations: [{ lines: [79, 81], color: "sky", note: "1,024÷28=36.57을 반올림해 37, 37×28=1,036입니다. 1,036²=1,073,296은 상한 12,845,056보다 작아 그대로 씁니다." }],
    code: resizeSource,
    lang: "python",
  },
  "patch-count": {
    path: "transformers/src/transformers/models/qwen2_vl/image_processing_qwen2_vl.py",
    highlight: [269, 296],
    desc: "실제 이미지 없이 크기만으로 patch 수를 셉니다. vLLM이 placeholder 수를 미리 정할 때 부르는 함수입니다.",
    annotations: [{ lines: [292, 296], color: "sky", note: "factor=14×2=28, 1,036//14=74이므로 74×74=5,476 patch입니다." }],
    code: resizeSource,
    lang: "python",
  },
  "placeholder-repeat": {
    path: "transformers/src/transformers/models/qwen2_5_vl/processing_qwen2_5_vl.py",
    highlight: [59, 62],
    desc: "patch 수를 merge_size²로 나눈 만큼 같은 image token을 반복해 문장에 넣습니다.",
    annotations: [{ lines: [60, 62], color: "sky", note: "5,476÷4=1,369개의 <|image_pad|>가 들어갑니다. 어느 사진이든 같은 문자열의 반복이라 token ID만으로는 사진을 구별할 수 없습니다." }],
    code: processorSource,
    lang: "python",
  },
  "ec-hit": {
    path: "vllm/vllm/v1/core/encoder_cache_manager.py",
    highlight: [95, 122],
    desc: "같은 사진 hash가 이미 encoder cache에 있으면 이 요청을 참조자로 추가하고 계산을 건너뜁니다.",
    annotations: [{ lines: [115, 122], color: "sky", note: "R1이 남긴 P의 결과가 있으면 R2를 참조 집합에 넣고 True를 돌려줍니다. 참조가 0이던 항목이면 반환 후보 목록에서 빼냅니다." }],
    code: encoderCacheSource,
    lang: "python",
  },
  "ec-allocate": {
    path: "vllm/vllm/v1/core/encoder_cache_manager.py",
    highlight: [124, 183],
    desc: "이번 step의 계산 예산과 cache 자리를 함께 확인하고, 모자라면 참조 없는 오래된 항목부터 지웁니다.",
    annotations: [
      { lines: [161, 163], color: "sky", note: "사진 하나의 embedding 1,369개가 남은 계산 예산보다 크면 여기서 바로 거절합니다." },
      { lines: [178, 183], color: "amber", note: "빈 자리가 모자라도 참조 0인 항목을 오래된 순서로 지워 자리를 만들 수 있으면 True입니다. 실제 GPU 메모리 해제는 worker가 다음 출력에서 처리합니다." },
    ],
    code: encoderCacheSource,
    lang: "python",
  },
  "ec-release": {
    path: "vllm/vllm/v1/core/encoder_cache_manager.py",
    highlight: [217, 242],
    desc: "요청이 사진을 다 쓰면 참조만 지우고, 마지막 참조가 사라질 때 반환 후보로 옮깁니다.",
    annotations: [{ lines: [236, 242], color: "sky", note: "R1·R2 모두 끝나야 P가 freeable에 들어갑니다. 바로 지우지 않으므로 그 뒤에 같은 사진이 오면 다시 쓸 수 있습니다." }],
    code: encoderCacheSource,
    lang: "python",
  },
  "ec-budget": {
    path: "vllm/vllm/v1/core/encoder_cache_manager.py",
    highlight: [273, 321],
    desc: "encoder 계산 예산과 cache 크기를 정합니다. 둘 다 사진 하나의 최대 embedding 수보다 작아지지 않습니다.",
    annotations: [{ lines: [313, 318], color: "sky", note: "max_num_batched_tokens가 8,192이면 두 값 모두 max(8,192, 사진 하나 최대치)입니다." }],
    code: encoderCacheSource,
    lang: "python",
  },
  "sched-config": {
    path: "vllm/vllm/config/scheduler.py",
    highlight: [86, 97],
    desc: "encoder 계산 예산과 cache 크기는 사용자가 직접 정하는 값이 아닙니다.",
    annotations: [{ lines: [86, 97], color: "sky", note: "둘 다 init=False이며 아래 __post_init__에서 max_num_batched_tokens로 채웁니다." }],
    code: schedulerConfigSource,
    lang: "python",
  },
  "sched-config-set": {
    path: "vllm/vllm/config/scheduler.py",
    highlight: [238, 239],
    desc: "두 예산 모두 max_num_batched_tokens를 그대로 받습니다.",
    annotations: [{ lines: [238, 239], color: "sky", note: "text token 예산과 같은 숫자를 쓰지만 세는 대상은 encoder embedding입니다." }],
    code: schedulerConfigSource,
    lang: "python",
  },
  "sched-encoder-items": {
    path: "vllm/vllm/v1/core/sched/scheduler.py",
    highlight: [1508, 1553],
    desc: "이번 step에 계산할 위치 범위와 겹치는 사진만 고르고, 이미 cache에 있으면 넘어갑니다.",
    annotations: [
      { lines: [1511, 1515], color: "sky", note: "R2가 위치 1,376부터 계산하면 위치 16~1,384를 차지한 사진 P가 범위에 걸립니다." },
      { lines: [1546, 1553], color: "amber", note: "같은 step에서 이미 고른 사진이거나 cache에 있는 사진이면 encoder를 다시 돌리지 않습니다." },
    ],
    code: schedulerSource,
    lang: "python",
  },
  "sched-rollback": {
    path: "vllm/vllm/v1/core/sched/scheduler.py",
    highlight: [1572, 1591],
    desc: "예산이나 자리가 모자라면 사진 바로 앞 위치까지만 이번 step에 계산합니다.",
    annotations: [{ lines: [1577, 1590], color: "sky", note: "R7은 위치 16에서 사진이 시작하므로 앞의 16개만 계산합니다. prefix hit이 이미 사진 안까지 들어갔다면 이번 step에는 0개입니다." }],
    code: schedulerSource,
    lang: "python",
  },
  "sched-budget-debit": {
    path: "vllm/vllm/v1/core/sched/scheduler.py",
    highlight: [1593, 1628],
    desc: "사진 일부만 필요해도 예산에서는 그 사진의 embedding 전체를 뺍니다.",
    annotations: [{ lines: [1617, 1620], color: "sky", note: "R2가 남은 9개 위치만 필요해도 num_encoder_embeds=1,369를 뺍니다. encoder는 사진 전체를 한 번에 처리한다고 보기 때문입니다." }],
    code: schedulerSource,
    lang: "python",
  },
  "sched-preempt-restore": {
    path: "vllm/vllm/v1/core/sched/scheduler.py",
    highlight: [590, 613],
    desc: "우선순위 정책에서 이미 고른 요청을 밀어내면 그 요청이 쓴 encoder 예산도 돌려놓습니다.",
    annotations: [{ lines: [602, 612], color: "sky", note: "밀려난 요청이 이번 step에 사진 하나를 골랐다면 1,369를 예산에 다시 더합니다." }],
    code: schedulerSource,
    lang: "python",
  },
  "mm-extra-keys": {
    path: "vllm/vllm/v1/core/kv_cache_utils.py",
    highlight: [450, 515],
    desc: "block이 사진 위치를 포함하면 (사진 hash, block 안 시작 offset)을 hash의 추가 키로 넣습니다.",
    annotations: [{ lines: [486, 501], color: "sky", note: "위치 16~31 block에는 (P, 0), 32~47에는 (P, -16)이 붙습니다. 같은 <|image_pad|> 열이라도 사진 Q의 block은 키가 다릅니다." }],
    code: kvUtilsSource,
    lang: "python",
  },
  "extra-keys-combine": {
    path: "vllm/vllm/v1/core/kv_cache_utils.py",
    highlight: [558, 593],
    desc: "LoRA, 사진, cache_salt, prompt embedding 키를 한 tuple로 합칩니다.",
    annotations: [{ lines: [579, 588], color: "sky", note: "cache_salt는 첫 block에만 넣어도 뒤 block이 parent hash로 이어져 전체가 갈라집니다." }],
    code: kvUtilsSource,
    lang: "python",
  },
  "processor-cache-config": {
    path: "vllm/vllm/config/multimodal.py",
    highlight: [138, 170],
    desc: "CPU 전처리 결과 cache의 크기와 위치, 그리고 encoder를 GPU에 나누는 방식을 정합니다.",
    annotations: [{ lines: [138, 146], color: "sky", note: "기본 4 GiB이며 API 프로세스와 engine 프로세스마다 복제되어 전체 사용량이 곱해집니다." }],
    code: multimodalConfigSource,
    lang: "python",
  },
  "hasher-default": {
    path: "vllm/vllm/config/multimodal.py",
    highlight: [69, 76],
    desc: "사진 내용을 hash하는 기본 알고리즘은 blake3입니다.",
    annotations: [{ lines: [75, 76], color: "sky", note: "환경 변수가 없으면 blake3를 씁니다. FIPS 환경에서는 sha256·sha512를 고를 수 있습니다." }],
    code: multimodalConfigSource,
    lang: "python",
  },
  "sglang-static-cache": {
    path: "sglang/python/sglang/srt/mem_cache/multimodal_cache.py",
    highlight: [76, 127],
    desc: "SGLang의 서버 단위 embedding cache는 byte 크기로 상한을 두고 오래된 항목부터 지웁니다.",
    annotations: [{ lines: [112, 119], color: "sky", note: "새 embedding의 byte를 더해 상한을 넘으면 가장 오래 안 쓴 항목을 지웁니다. vLLM처럼 참조 요청 집합을 두지 않습니다." }],
    code: sglangCacheSource,
    lang: "python",
  },
};
