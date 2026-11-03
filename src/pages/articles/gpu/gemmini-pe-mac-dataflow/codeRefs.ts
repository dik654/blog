import type { CodeRef } from "@/components/code/types";
import peScala from "./codebase/gemmini/PE.scala?raw";

export const codeRefs: Record<string, CodeRef> = {
  "mac-unit": {
    path: "gemmini/PE.scala",
    code: peScala,
    lang: "scala",
    highlight: [22, 31],
    desc: "문제: PE가 Weight-Stationary와 Output-Stationary 두 dataflow를 모두 지원하면 합성 도구가 같은 MAC 회로를 두 벌 만들 수 있습니다.\n\n해결: in_c + in_a×in_b를 표현하는 MacUnit을 별도 module로 떼어 PE 본체가 항상 하나를 공유하게 강제합니다. 이 코드는 조합 논리 표현이며 모든 구성의 한-cycle timing을 보장하는 문장이 아닙니다.",
    annotations: [
      { lines: [24, 28], color: "sky", note: "in_a·in_b·in_c·out_d 네 포트가 곱 입력 둘·누적값·결과에 대응" },
      { lines: [31, 31], color: "emerald", note: "mac() 한 줄이 in_c + in_a×in_b라는 원자 데이터 경로를 표현" },
    ],
  },
  "output-stationary": {
    path: "gemmini/PE.scala",
    code: peScala,
    lang: "scala",
    highlight: [105, 123],
    desc: "문제: partial sum을 PE 안에 붙잡아 두면서 A와 B를 지나가게 하려면 어느 레지스터가 compute이고 어느 레지스터가 out_c 쪽인지 정해야 합니다.\n\n해결: prop 선택에 따라 c1·c2 중 하나를 out_c에 놓고 다른 하나를 mac_unit.io.in_c로 계속 누적합니다. 역할은 매 사이클 의무적으로 교대하는 것이 아니라 prop이 바뀌는 구간 경계에서 교대합니다.",
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
    desc: "문제: weight를 PE 안에 고정한 채 A와 들어온 partial sum을 처리하려면 Output-Stationary와 다른 배선이 필요합니다.\n\n해결: c1·c2의 고정 값을 weight(mac_unit.io.in_b)로, a를 activation(mac_unit.io.in_a)으로, 위에서 들어온 b를 partial sum(mac_unit.io.in_c)으로 씁니다. 결과는 out_b로 다음 PE에 전달됩니다.",
    annotations: [
      { lines: [129, 130], color: "sky", note: "고정 레지스터는 weight, b는 위에서 흘러온 partial sum. activation은 공통 배선 mac_unit.io.in_a := a" },
      { lines: [131, 131], color: "emerald", note: "갱신된 partial sum을 out_b로 다음 PE에 전달해 다른 weight 항을 이어 더함" },
      { lines: [132, 132], color: "amber", note: "새 weight(d)를 지금 내보낸 레지스터에 미리 적재" },
    ],
  },
  "double-buffer": {
    path: "gemmini/PE.scala",
    code: peScala,
    lang: "scala",
    highlight: [70, 96],
    desc: "문제: 한 결과를 out_c 쪽에 놓는 동안 다른 결과의 누적·preload를 이어가려면 저장 위치가 두 벌 필요합니다.\n\n해결: c1·c2 두 레지스터를 두고 prop이 compute 쪽과 out_c 쪽을 선택합니다. 직전 유효 prop과 달라진 첫 사이클(flip)에만 right-shift offset을 적용합니다.",
    annotations: [
      { lines: [74, 75], color: "sky", note: "c1·c2 — 이중 버퍼 레지스터 선언, 이후 모든 분기가 이 둘을 번갈아 씀" },
      { lines: [95, 95], color: "emerald", note: "last_s — 직전 유효 propagate 값을 저장해 지금 값과 비교할 준비" },
      { lines: [96, 97], color: "amber", note: "flip인 출력 경계에만 shift_offset을 적용 — 근거 없이 반올림이라고 부르지 않음" },
    ],
  },
};
