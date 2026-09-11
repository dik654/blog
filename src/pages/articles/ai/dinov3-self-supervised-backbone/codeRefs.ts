import type { CodeRef } from "@/components/code/types";
import gramLoss from "./codebase/dinov3/loss/gram_loss.py?raw";
import dinoClsLoss from "./codebase/dinov3/loss/dino_clstoken_loss.py?raw";
import ibotPatchLoss from "./codebase/dinov3/loss/ibot_patch_loss.py?raw";
import koleoLoss from "./codebase/dinov3/loss/koleo_loss.py?raw";
import dinoHead from "./codebase/dinov3/layers/dino_head.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "dino-clstoken-loss": {
    path: "dinov3/loss/dino_clstoken_loss.py",
    code: dinoClsLoss,
    lang: "python",
    highlight: [36, 100],
    desc: "문제: 정답 라벨이 없으면 이미지 수준 표현을 무엇에 맞춰 학습시킬지가 없습니다.\n\n해결: 같은 이미지의 다른 크롭을 본 teacher의 분포를 정답으로 삼아 student의 분포를 맞춥니다. teacher 쪽에 centering과 낮은 온도를 걸어 한 prototype으로 몰리는 붕괴를 막습니다.",
    annotations: [
      { lines: [36, 41], color: "sky", note: "teacher 출력에서 center를 빼고 낮은 온도로 나눠 softmax합니다. center는 배치 평균을 EMA로 따라가며 특정 prototype 쏠림을 억제합니다" },
      { lines: [43, 70], color: "violet", note: "대안 경로인 Sinkhorn-Knopp. 행과 열을 번갈아 정규화해 배치 안에서 prototype 사용량을 고르게 맞춥니다" },
      { lines: [89, 94], color: "emerald", note: "student는 온도 0.1의 log-softmax. 모든 student 크롭 × teacher 크롭 쌍의 교차 엔트로피를 평균합니다" },
      { lines: [95, 100], color: "amber", note: "같은 크롭끼리의 대각 쌍을 뺄 수 있는 경로. 자기 자신을 맞추는 자명한 항을 제외합니다" },
    ],
  },
  "dino-head": {
    path: "dinov3/layers/dino_head.py",
    code: dinoHead,
    lang: "python",
    highlight: [20, 67],
    desc: "문제: backbone 출력을 그대로 비교하면 분포를 맞출 대상이 없습니다.\n\n해결: MLP와 마지막 weight-normalized 선형층으로 K개 prototype에 대한 logit을 만들고, 그 분포를 teacher와 student가 공유하는 비교 축으로 씁니다.",
    annotations: [
      { lines: [20, 40], color: "sky", note: "hidden layer 수와 bottleneck 차원을 받는 MLP입니다. backbone과 분리된 head라 평가 때는 버립니다" },
      { lines: [41, 60], color: "emerald", note: "마지막 층은 weight normalization을 건 선형층으로 prototype 방향만 학습합니다" },
    ],
  },
  "ibot-patch-loss": {
    path: "dinov3/loss/ibot_patch_loss.py",
    code: ibotPatchLoss,
    lang: "python",
    highlight: [83, 118],
    desc: "문제: 이미지 한 장에 벡터 하나만 맞추면 패치마다 다른 정보가 학습 신호를 받지 못합니다.\n\n해결: student 입력의 일부 패치를 가리고, 가려진 자리마다 teacher가 같은 위치에서 낸 분포를 맞추게 합니다. 픽셀이 아니라 teacher의 출력 분포가 목표입니다.",
    annotations: [
      { lines: [16, 18], color: "sky", note: "teacher 확률과 student log-softmax의 내적 — 교차 엔트로피를 패치 단위로 계산합니다" },
      { lines: [78, 82], color: "violet", note: "패치 쪽에도 같은 centering과 온도가 걸립니다. 이미지 수준 head와 center를 따로 둡니다" },
      { lines: [83, 94], color: "emerald", note: "mask가 1인 자리만 더하고 가려진 패치 수로 나눕니다. 안 가려진 패치는 손실에 들어가지 않습니다" },
      { lines: [96, 118], color: "amber", note: "가려진 패치만 모아 계산하는 경로. 패치 수가 이미지마다 달라도 이미지당 기여가 같도록 가중치를 나눕니다" },
    ],
  },
  "koleo-loss": {
    path: "dinov3/loss/koleo_loss.py",
    code: koleoLoss,
    lang: "python",
    highlight: [21, 43],
    desc: "문제: 분포를 맞추는 목표만 두면 서로 다른 이미지의 표현이 한 곳으로 뭉칠 수 있습니다.\n\n해결: 배치 안에서 각 표현의 최근접 이웃까지의 거리를 재고 그 로그의 음수를 더해, 표현들이 공간에 고르게 퍼지도록 밉니다.",
    annotations: [
      { lines: [21, 31], color: "sky", note: "자기 자신을 제외한 최근접 이웃을 내적 행렬로 찾습니다" },
      { lines: [39, 43], color: "emerald", note: "-log(최근접 거리)의 평균. 거리가 0에 가까울수록 손실이 급격히 커져 겹침을 막습니다" },
      { lines: [49, 55], color: "amber", note: "분산 버전은 loss_group_size로 작은 묶음 안에서만 이웃을 찾습니다. 전체 배치로 넓히지 않습니다" },
    ],
  },
  "gram-loss": {
    path: "dinov3/loss/gram_loss.py",
    code: gramLoss,
    lang: "python",
    highlight: [34, 84],
    desc: "문제: 오래 학습하면 이미지 수준 목표가 우세해져 패치끼리의 관계가 뭉개집니다.\n\n해결: 패치 사이의 유사도 행렬 자체를 이전 시점의 teacher와 맞춥니다. 특징값을 그대로 베끼지 않고 관계 구조만 붙잡습니다.",
    annotations: [
      { lines: [50, 56], color: "sky", note: "FP32로 올린 뒤 마지막 차원을 L2 정규화합니다. 이후 내적이 곧 코사인 유사도가 됩니다" },
      { lines: [61, 73], color: "emerald", note: "teacher와 student 각각 자기 패치들끼리의 유사도 행렬을 만듭니다. 이것이 Gram 행렬입니다" },
      { lines: [75, 82], color: "amber", note: "음수 유사도를 0으로 자르는 선택지. 무관한 패치 쌍의 미세한 음수 차이가 손실을 지배하지 않게 합니다" },
      { lines: [84, 84], color: "rose", note: "두 유사도 행렬의 MSE. 논문의 Frobenius 제곱 표기와 상수배 차이이며 구현은 평균을 씁니다" },
      { lines: [40, 40], color: "violet", note: "img_level이 참이면 이미지 안에서만, 거짓이면 배치 전체 패치를 한 행렬로 묶습니다" },
    ],
  },
};
