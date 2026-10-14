import type { CodeRef } from "@/components/code/types";
import kvCells from "./codebase/llama.cpp/src/llama-kv-cells.h?raw";
import kvCache from "./codebase/llama.cpp/src/llama-kv-cache.cpp?raw";
import context from "./codebase/llama.cpp/src/llama-context.cpp?raw";
import model from "./codebase/llama.cpp/src/llama-model.cpp?raw";
import common from "./codebase/llama.cpp/ggml/src/ggml-common.h?raw";
import vecdotq from "./codebase/llama.cpp/ggml/src/ggml-cuda/vecdotq.cuh?raw";
import mmvq from "./codebase/llama.cpp/ggml/src/ggml-cuda/mmvq.cuh?raw";
import fattn from "./codebase/llama.cpp/ggml/src/ggml-cuda/fattn-common.cuh?raw";
import cudaBackend from "./codebase/llama.cpp/ggml/src/ggml-cuda/ggml-cuda.cu?raw";

export const codeRefs: Record<string, CodeRef> = {
  "cells-fields": {
    path: "llama.cpp/src/llama-kv-cells.h",
    code: kvCells,
    lang: "c",
    highlight: [493, 532],
    desc: "cell 하나가 가진 상태는 위치 pos와 sequence bitset seq입니다.",
    annotations: [
      { lines: [496, 499], color: "sky", note: "used는 비어 있지 않은 cell 번호의 집합, pos[i]는 cell i에 적힌 token 위치입니다. 빈 cell은 pos = -1입니다." },
      { lines: [521, 522], color: "emerald", note: "seq[i]는 256비트 bitset입니다. 공유 앞부분 cell 0~3은 A와 B 두 비트가 모두 켜집니다." },
      { lines: [524, 532], color: "amber", note: "sequence마다 (pos, cell) 쌍을 정렬해 둡니다. B의 최소·최대 위치를 cell 배열 전체를 훑지 않고 찾습니다." },
    ],
  },
  "cells-seq-ops": {
    path: "llama.cpp/src/llama-kv-cells.h",
    code: kvCells,
    lang: "c",
    highlight: [242, 356],
    desc: "sequence 비트를 켜고 끄는 것이 공유와 반환의 전부입니다.",
    annotations: [
      { lines: [244, 263], color: "rose", note: "A를 지우면 A 비트만 끕니다. 공유 cell 0~3은 B 비트가 남아 비지 않고, A만의 cell 4~6은 비트가 0개가 되어 pos = -1로 돌아갑니다." },
      { lines: [313, 319], color: "sky", note: "mask를 만들 때 묻는 질문이 이 함수 하나입니다. cell j에 B 비트가 있는가." },
      { lines: [347, 354], color: "emerald", note: "이미 채워진 cell에 B 비트를 하나 더 켭니다. K·V 값은 복사하지 않습니다." },
    ],
  },
  "kv-tensor": {
    path: "llama.cpp/src/llama-kv-cache.cpp",
    code: kvCache,
    lang: "c",
    highlight: [208, 236],
    desc: "층마다 K와 V를 [폭, cell 수, stream 수] 3차원 tensor 하나로 만듭니다.",
    annotations: [
      { lines: [216, 221], color: "amber", note: "offload가 켜져 있으면 그 층의 KV를 그 층의 가중치와 같은 device에 둡니다. 13절의 GPU 층은 KV도 GPU에 있습니다." },
      { lines: [233, 234], color: "sky", note: "Llama 3.1 8B는 n_embd_k_gqa = 8 × 128 = 1024입니다. f16이면 cell 하나가 층마다 K 2,048 byte, V 2,048 byte입니다." },
    ],
  },
  "seq-cp": {
    path: "llama.cpp/src/llama-kv-cache.cpp",
    code: kvCache,
    lang: "c",
    highlight: [473, 530],
    desc: "같은 stream 안의 복사는 비트만 켜고, stream이 다르면 실제 buffer를 복사합니다.",
    annotations: [
      { lines: [485, 512], color: "emerald", note: "A의 앞 4 cell을 B에게 넘기는 일은 비트 4개를 켜는 일입니다. 2절의 공유 앞부분이 이 경로입니다." },
      { lines: [515, 529], color: "rose", note: "slot마다 stream이 따로면 이 아래로 내려가 전체 buffer 복사를 예약합니다. 일부 구간만 복사하는 경로는 막혀 있습니다." },
    ],
  },
  "find-slot": {
    path: "llama.cpp/src/llama-kv-cache.cpp",
    code: kvCache,
    lang: "c",
    highlight: [1009, 1110],
    desc: "head부터 빈 cell을 찾아 새 token을 쓸 자리 목록을 만듭니다.",
    annotations: [
      { lines: [1022, 1026], color: "amber", note: "head 앞에 빈 cell이 충분하면 처음부터 다시 찾습니다. 그래서 A와 B의 cell이 배열 안에서 섞입니다." },
      { lines: [1047, 1081], color: "sky", note: "빈 cell이거나, 한 sequence만 쓰는 cell이 sliding window 밖으로 밀려났으면 씁니다. 그 외에는 다음 cell로 넘어갑니다." },
      { lines: [1100, 1108], color: "rose", note: "배열을 한 바퀴 돌아도 자리를 못 찾으면 빈 결과를 돌려줍니다. 다른 요청을 밀어내는 선점은 여기 없습니다." },
    ],
  },
  "get-n-kv": {
    path: "llama.cpp/src/llama-kv-cache.cpp",
    code: kvCache,
    lang: "c",
    highlight: [1282, 1296],
    desc: "attention이 읽을 cell 수 n_kv를 사용 중 최대 번호 + 1에서 256 단위로 올립니다.",
    annotations: [
      { lines: [1285, 1292], color: "sky", note: "used_max_p1 = 9이면 n_kv = 256, 9,000이면 9,216입니다. 그래프 모양을 batch마다 다시 만들지 않으려는 padding입니다." },
    ],
  },
  "kq-mask": {
    path: "llama.cpp/src/llama-kv-cache.cpp",
    code: kvCache,
    lang: "c",
    highlight: [1572, 1720],
    desc: "query 하나마다 n_kv칸짜리 mask 행을 0 또는 −∞로 채웁니다.",
    annotations: [
      { lines: [1586, 1587], color: "sky", note: "남길 칸은 0, 지울 칸은 −∞입니다. softmax에서 e^(−∞) = 0이 되어 그 cell의 V는 출력에 들어가지 않습니다." },
      { lines: [1660, 1667], color: "rose", note: "빈 cell과 다른 sequence의 cell이 −∞입니다. B의 query는 A만의 cell 4~6을 이 줄에서 잃습니다." },
      { lines: [1681, 1685], color: "amber", note: "같은 sequence여도 자기보다 뒤 위치는 causal 조건으로 지웁니다." },
    ],
  },
  "fattn-kv-max": {
    path: "llama.cpp/ggml/src/ggml-cuda/fattn-common.cuh",
    code: fattn,
    lang: "c",
    highlight: [671, 724],
    desc: "CUDA FlashAttention은 mask의 끝에서부터 모두 −∞인 256칸 tile만 건너뜁니다.",
    annotations: [
      { lines: [690, 712], color: "sky", note: "뒤쪽 tile부터 보며 모든 칸이 −∞인 동안 KV_max를 줄입니다. 중간에 낀 다른 sequence의 cell은 건너뛰지 않습니다." },
    ],
  },
  "fattn-scan-condition": {
    path: "llama.cpp/ggml/src/ggml-cuda/fattn-common.cuh",
    code: fattn,
    lang: "c",
    highlight: [1114, 1131],
    desc: "끝 tile 생략은 query가 1,024개 이상이거나 stream이 여럿일 때만 켭니다.",
    annotations: [
      { lines: [1117, 1117], color: "amber", note: "unified stream 하나에서 token 4개를 decode하는 step은 query가 4개, stream이 1개라 이 조건이 거짓이고 mask를 훑지 않습니다." },
    ],
  },
  "n-ctx-seq": {
    path: "llama.cpp/src/llama-context.cpp",
    code: context,
    lang: "c",
    highlight: [376, 395],
    desc: "unified가 아니면 n_ctx를 sequence 수로 나눠 256 단위로 올린 값이 한 sequence의 상한입니다.",
    annotations: [
      { lines: [379, 380], color: "emerald", note: "unified면 한 대화가 16,384 cell 전부를 쓸 수 있습니다." },
      { lines: [381, 392], color: "rose", note: "4 slot이면 16,384 ÷ 4 = 4,096입니다. 6,000 token 문서는 다른 slot이 비어 있어도 들어가지 않습니다." },
    ],
  },
  "layer-split": {
    path: "llama.cpp/src/llama-model.cpp",
    code: model,
    lang: "c",
    highlight: [1650, 1675],
    desc: "-ngl N이면 뒤쪽 층부터 N개(출력층 포함)를 GPU에 둡니다.",
    annotations: [
      { lines: [1650, 1651], color: "sky", note: "32층 모델, -ngl 23이면 i_gpu_start = 33 − 23 = 10입니다. 층 10~31과 출력층(번호 32)이 GPU입니다." },
      { lines: [1654, 1657], color: "amber", note: "번호가 i_gpu_start보다 작은 층 0~9는 CPU 버퍼에 남습니다." },
      { lines: [1665, 1667], color: "rose", note: "입력 embedding은 offload 이득이 작아 항상 CPU에 둡니다." },
    ],
  },
  "ngl-plus-one": {
    path: "llama.cpp/src/llama-model.cpp",
    code: model,
    lang: "c",
    highlight: [2401, 2404],
    desc: "-ngl의 상한은 반복 층 수 + 출력층 1입니다.",
    annotations: [
      { lines: [2402, 2403], color: "sky", note: "32층이면 -ngl 33이 전부입니다. auto(-1)도 33으로 둡니다." },
    ],
  },
  "q4k-block": {
    path: "llama.cpp/ggml/src/ggml-common.h",
    code: common,
    lang: "c",
    highlight: [323, 338],
    desc: "Q4_K 블록 하나는 가중치 256개를 144 byte에 담습니다.",
    annotations: [
      { lines: [329, 333], color: "sky", note: "d와 dmin은 f16 두 개, 4 byte입니다. 작은 블록 8개의 scale과 min을 다시 키우는 배율입니다." },
      { lines: [335, 335], color: "emerald", note: "작은 블록 8개의 6비트 scale 8개와 6비트 min 8개를 12 byte에 묶습니다. 16 × 6 = 96비트 = 12 byte입니다." },
      { lines: [336, 336], color: "amber", note: "4비트 가중치 256개 = 128 byte입니다." },
      { lines: [338, 338], color: "rose", note: "컴파일러가 2·2 + 12 + 128 = 144 byte인지 확인합니다." },
    ],
  },
  "q8-1-block": {
    path: "llama.cpp/ggml/src/ggml-common.h",
    code: common,
    lang: "c",
    highlight: [258, 269],
    desc: "활성값은 32개씩 int8로 바꾸고 배율 d와 합 s를 붙입니다.",
    annotations: [
      { lines: [262, 263], color: "sky", note: "d8 = 0.1이면 정수 [1, −2, 3, 4]가 실수 [0.1, −0.2, 0.3, 0.4]를 뜻합니다." },
    ],
  },
  "vec-dot-impl": {
    path: "llama.cpp/ggml/src/ggml-cuda/vecdotq.cuh",
    code: vecdotq,
    lang: "c",
    highlight: [508, 530],
    desc: "4비트 가중치와 int8 활성값을 정수로 곱해 더한 뒤 배율을 마지막에 곱합니다.",
    annotations: [
      { lines: [517, 518], color: "amber", note: "32비트 정수 하나에 들어 있는 4비트 값 8개 중 4개를 0x0F0F0F0F로 꺼내 byte 4칸에 하나씩 놓습니다." },
      { lines: [520, 520], color: "sky", note: "dp4a 한 번이 byte 4쌍을 곱해 더합니다. [3,0,15,7]·[1,−2,3,4] = 76입니다." },
      { lines: [521, 521], color: "emerald", note: "가중치 자리에 1을 넣어 활성값의 합 Σu = 6을 같은 명령으로 구합니다. min 항에 씁니다." },
      { lines: [523, 529], color: "rose", note: "d·sc·76과 dmin·m·6을 빼고 d8을 곱하면 0.1 × (76 − 1.5) = 7.45입니다." },
    ],
  },
  "vec-dot-unpack": {
    path: "llama.cpp/ggml/src/ggml-cuda/vecdotq.cuh",
    code: vecdotq,
    lang: "c",
    highlight: [918, 966],
    desc: "Q4_K 블록에서 4비트 값과 6비트 scale·min을 꺼내 위 계산에 넘깁니다.",
    annotations: [
      { lines: [940, 954], color: "sky", note: "12 byte에 묶인 6비트 scale·min을 비트 연산으로 풀어 sc와 m을 만듭니다." },
    ],
  },
  "mmvq-limit": {
    path: "llama.cpp/ggml/src/ggml-cuda/mmvq.cuh",
    code: mmvq,
    lang: "c",
    highlight: [1, 5],
    desc: "열이 8개 이하일 때 양자화 행렬-벡터 kernel을 씁니다.",
    annotations: [
      { lines: [3, 3], color: "sky", note: "slot 4개가 한 token씩 decode하면 열이 4개라 이 kernel 범위입니다. 긴 prompt는 다른 경로로 갑니다." },
    ],
  },
  "op-offload": {
    path: "llama.cpp/ggml/src/ggml-cuda/ggml-cuda.cu",
    code: cudaBackend,
    lang: "c",
    highlight: [5908, 5912],
    desc: "CPU 버퍼에 남은 가중치라도 batch가 크면 그 연산을 GPU로 보냅니다.",
    annotations: [
      { lines: [5911, 5911], color: "sky", note: "한 번에 처리하는 행이 기준값 이상이면 GPU가 맡습니다. prompt 2,000 token은 넘고, slot 4개의 decode 4 token은 넘지 못합니다." },
    ],
  },
  "op-offload-min": {
    path: "llama.cpp/ggml/src/ggml-cuda/ggml-cuda.cu",
    code: cudaBackend,
    lang: "c",
    highlight: [180, 183],
    desc: "기준값은 환경 변수가 없으면 32입니다.",
    annotations: [
      { lines: [181, 181], color: "amber", note: "GGML_OP_OFFLOAD_MIN_BATCH로 바꿀 수 있습니다. 32보다 작은 decode batch는 CPU 층을 CPU에서 계산합니다." },
    ],
  },
  "decode-no-slot": {
    path: "llama.cpp/src/llama-context.cpp",
    code: context,
    lang: "c",
    highlight: [1940, 1955],
    desc: "cell을 찾지 못하면 한 번 정리를 시도하고, 그래도 없으면 1을 돌려줍니다.",
    annotations: [
      { lines: [1942, 1949], color: "amber", note: "memory_update(true)로 배열을 한 번 정리하고 같은 batch를 다시 시도합니다." },
      { lines: [1952, 1954], color: "rose", note: "그래도 자리가 없으면 경고를 남기고 1을 돌려줍니다. 다른 sequence의 cell을 비우는 선점은 없습니다." },
    ],
  },
};
