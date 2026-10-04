import type { CodeRef } from "@/components/code/types";
import implementation from "./codebase/pico-sdk/src/rp2_common/hardware_gpio/gpio.c?raw";
import header from "./codebase/pico-sdk/src/rp2_common/hardware_gpio/include/hardware/gpio.h?raw";
const source = { path: "pico-sdk/src/rp2_common/hardware_gpio/gpio.c", lang: "c" as const, code: implementation };
const include = { path: "pico-sdk/src/rp2_common/hardware_gpio/include/hardware/gpio.h", lang: "c" as const, code: header };
export const teachCodeRefs: Record<string, CodeRef> = {
  init: { ...source, highlight: [273, 277], desc: "Pico SDK 2.2.0 · a1438dff · 실제 gpio_init", annotations: [{ lines: [274, 276], color: "sky", note: "gpio=5를 넣으면 먼저 출력 허용을 끄고 래치를 0으로 둔 뒤 SIO 기능을 선택합니다. 아직 출력 방향을 켜지 않았습니다." }] },
  select: { ...source, highlight: [35, 53], desc: "같은 원문의 gpio_set_function", annotations: [{ lines: [42, 49], color: "amber", note: "RP2040에서 핀 5의 패드 입력을 허용하고 패드 출력 금지를 해제합니다. CTRL은 기능 선택 외 override를 0으로 씁니다. 기존 CTRL 비트 전체를 보존하는 함수가 아닙니다." }] },
  direction: { ...include, highlight: [1350, 1359], desc: "gpio_set_dir(5, true)의 RP2040 분기", annotations: [{ lines: [1353, 1358], color: "emerald", note: "mask=1ul<<5=0x20입니다. true이면 gpio_set_dir_out_masked로 넘깁니다." }] },
  enableWrite: { ...include, highlight: [1218, 1224], desc: "출력 허용의 실제 쓰기", annotations: [{ lines: [1221, 1222], color: "emerald", note: "RP2040의 SIO 경로에서 gpio_oe_set에 0x20을 씁니다. 데이터시트의 주소 0xD0000024에 대응합니다." }] },
  put: { ...include, highlight: [1155, 1164], desc: "gpio_put(5, true)의 실제 분기", annotations: [{ lines: [1158, 1163], color: "sky", note: "RP2040은 GPIO가 32개 이하인 분기입니다. 핀 5의 mask 0x20을 만들고 true이면 SET, false이면 CLR 함수를 부릅니다." }] },
  setWrite: { ...include, highlight: [918, 924], desc: "출력 SET의 실제 쓰기", annotations: [{ lines: [921, 922], color: "amber", note: "gpio_set에 0x20을 씁니다. 주소 0xD0000014의 동작은 해당 출력 비트를 1로 만들고 다른 비트는 유지합니다." }] },
  irqEnable: { ...source, highlight: [198, 203], desc: "GPIO 사건 전달을 켜는 실제 순서", annotations: [{ lines: [199, 202], color: "sky", note: "현재 코어의 callback을 먼저 등록한 뒤 GPIO2 상승 에지를 허용하고 IO_IRQ_BANK0를 켭니다. 호출이 끝났다고 시간 마감이 보장되지는 않습니다." }] },
  irqDispatch: { ...source, highlight: [153, 170], desc: "기본 IRQ 처리기의 소거·callback 순서", annotations: [{ lines: [157, 165], color: "amber", note: "GPIO2 상승 에지의 상태를 읽고 events=8을 얻습니다. gpio_acknowledge_irq(2,8)를 먼저 실행한 다음 callback(2,8)을 부릅니다. 기본 callback은 원인을 다시 소거할 필요가 없습니다." }] },
  irqAck: { ...include, highlight: [573, 576], desc: "GPIO2 상승 에지의 write-one-to-clear", annotations: [{ lines: [574, 575], color: "emerald", note: "정수 나눗셈 gpio/8의 몫은 0이고 event_mask 8을 4×2=8비트 이동하면 0x800입니다. INTR[0]의 비트 11에 1을 써서 해당 에지 상태를 소거합니다." }] },
};
