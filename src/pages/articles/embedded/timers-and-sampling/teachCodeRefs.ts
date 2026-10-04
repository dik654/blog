import type { CodeRef, FileNode } from "@/components/code/types";
import timerSource from "./codebase/pico-sdk/src/common/pico_time/time.c?raw";
import adcSource from "./codebase/pico-sdk/src/rp2_common/hardware_adc/include/hardware/adc.h?raw";
const timer = { path: "pico-sdk/src/common/pico_time/time.c", lang: "c" as const, code: timerSource };
export const codeRefs: Record<string, CodeRef> = {
  register: { ...timer, highlight: [500, 509], desc: "Pico SDK 2.2.0 · a1438dff · 반복 지연과 첫 목표", annotations: [{ lines: [504, 507], color: "sky", note: "delay_us=−10000을 그대로 저장하지만 첫 목표에는 절댓값 10000을 사용합니다. 등록 시각을 0으로 두면 첫 목표는 10000 µs입니다." }] },
  reschedule: { ...timer, highlight: [171, 191], desc: "같은 원문의 다음 목표 계산", annotations: [{ lines: [171, 176], color: "sky", note: "반복 콜백이 true이면 저장된 지연을 사용하고 false이면 0으로 두어 반복을 마칩니다." }, { lines: [184, 189], color: "amber", note: "이전 목표 10000, delta −10000이면 다음 목표는 20000입니다. 양수 +10000은 처리 뒤 현재 시각 10420에 더해 20420이 됩니다. 시간값은 가정입니다." }] },
  read: { path: "pico-sdk/src/rp2_common/hardware_adc/include/hardware/adc.h", lang: "c", code: adcSource, highlight: [175, 182], desc: "ADC0를 선택한 뒤 호출하는 실제 adc_read", annotations: [{ lines: [176, 181], color: "emerald", note: "한 번 변환을 시작하고 READY를 기다린 뒤 RESULT를 반환합니다. 알람 목표 시각과 입력을 잡는 시각, 결과를 받는 시각은 별도로 봅니다." }] },
};
export const fileTrees: Record<string, FileNode> = { "pico-sdk": { name: "pico-sdk", type: "dir", children: [
  { name: "src/common/pico_time/time.c", type: "file", path: timer.path, codeKey: "register" },
  { name: "src/rp2_common/hardware_adc/include/hardware/adc.h", type: "file", path: codeRefs.read.path, codeKey: "read" },
] } };
