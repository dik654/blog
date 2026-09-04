import type { CodeRef } from "@/components/code/types";
import peScala from "./codebase/gemmini/PE.scala?raw";

export const codeRefs: Record<string, CodeRef> = {
  "mac-unit": {
    path: "gemmini/PE.scala",
    code: peScala,
    lang: "scala",
    highlight: [21, 31],
    desc: "문제: PE가 Weight-Stationary와 Output-Stationary 두 dataflow를 모두 지원하려면 곱셈기가 두 벌 생길 위험이 있습니다.\n\n해결: 곱셈과 누산을 한 줄(mac)로 묶은 MacUnit을 별도 module로 떼어내 PE 본체가 항상 이 하나만 호출하게 강제합니다.",
    annotations: [
      { lines: [24, 27], color: "sky", note: "in_a·in_b·in_c·out_d 네 포트가 이 글의 활성·weight·누적값·결과에 대응" },
      { lines: [30, 30], color: "emerald", note: "mac() 한 줄이 곱셈과 누산을 같은 사이클에 묶는 원자 연산" },
    ],
  },
  "output-stationary": {
    path: "gemmini/PE.scala",
    code: peScala,
    lang: "scala",
    highlight: [105, 123],
    desc: "문제: partial sum을 PE 안에 붙잡아 두면서 activation과 weight만 지나가게 하려면 어느 레지스터가 '고정'이고 어느 신호가 '통과'인지 회로로 정해야 합니다.\n\n해결: c1·c2 중 하나는 out_c로 내보내고(propagate) 다른 하나는 mac_unit.io.in_c로 계속 누적(compute)하며, 매 사이클 역할을 맞바꿉니다.",
    annotations: [
      { lines: [110, 111], color: "sky", note: "propagate 레지스터를 shift만큼 내려 out_c로 내보냄 — 이 PE의 결과가 밖으로 나가는 시점" },
      { lines: [113, 114], color: "emerald", note: "compute 레지스터는 out_c로 나가지 않고 mac_unit.io.in_c로 계속 누적" },
      { lines: [115, 115], color: "amber", note: "다음 행렬곱의 초기값(d)을 지금 내보낸 레지스터(c1)에 미리 적재 — 다음 파이프라인 준비" },
    ],
  },
  "weight-stationary": {
    path: "gemmini/PE.scala",
    code: peScala,
    lang: "scala",
    highlight: [124, 139],
    desc: "문제: weight를 PE 안에 고정해 두고 activation만 흘려보내려면 mac_unit의 두 입력(weight·activation) 배선이 Output-Stationary와 반대로 바뀌어야 합니다.\n\n해결: c1·c2에 저장된 값을 weight(mac_unit.io.in_b)로 쓰고 옆에서 들어온 b를 activation(mac_unit.io.in_c)으로 써서, 결과를 누적하지 않고 즉시 다음 PE로 내보냅니다.",
    annotations: [
      { lines: [129, 130], color: "sky", note: "Output-Stationary와 정반대 배선 — 고정된 레지스터가 weight, 흘러온 b가 activation" },
      { lines: [131, 131], color: "emerald", note: "mac 결과를 out_b로 바로 내보냄 — 이 PE는 값을 붙잡아 두지 않고 통과만 시킴" },
      { lines: [132, 132], color: "amber", note: "새 weight(d)를 지금 내보낸 레지스터에 미리 적재" },
    ],
  },
  "double-buffer": {
    path: "gemmini/PE.scala",
    code: peScala,
    lang: "scala",
    highlight: [70, 96],
    desc: "문제: 한 행렬곱의 결과를 밖으로 흘려보내는 동안 다음 행렬곱의 누산을 동시에 시작하려면 레지스터가 최소 두 벌 있어야 충돌이 없습니다.\n\n해결: c1·c2 두 레지스터를 두고 propagate 신호가 어느 쪽이 '내보내는 중'인지를 가리키며, 그 값이 직전 사이클과 달라진(flip) 첫 사이클에만 shift를 적용합니다.",
    annotations: [
      { lines: [73, 74], color: "sky", note: "c1·c2 — 이중 버퍼 레지스터 선언, 이후 모든 분기가 이 둘을 번갈아 씀" },
      { lines: [94, 94], color: "emerald", note: "last_s — 한 사이클 전의 propagate 값을 저장해 지금 값과 비교할 준비" },
      { lines: [95, 96], color: "amber", note: "flip이 true인 사이클(역할이 막 바뀐 첫 사이클)에만 shift_offset을 적용 — 그 외에는 0" },
    ],
  },
};
