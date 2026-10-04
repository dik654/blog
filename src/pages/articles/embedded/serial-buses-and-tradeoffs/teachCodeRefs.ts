import type { CodeRef, FileNode } from "@/components/code/types";
import original from "./codebase/pico-sdk/src/rp2_common/hardware_i2c/i2c.c?raw";
const source = { path: "pico-sdk/src/rp2_common/hardware_i2c/i2c.c", lang: "c" as const, code: original };
export const codeRefs: Record<string, CodeRef> = {
  write: { ...source, highlight: [133, 164], desc: "Pico SDK 2.2.0 · a1438dff · addr 0x48, 위치 0x10 쓰기", annotations: [{ lines: [140, 143], color: "sky", note: "API의 7비트 주소 0x48을 장치 선택 필드에 씁니다. 선 위의 주소+쓰기 바이트 0x90을 이 인자에 넣지 않습니다." }, { lines: [154, 164], color: "amber", note: "len=1이라 first/last는 true입니다. nostop=true이므로 마지막 바이트에도 STOP을 세우지 않습니다." }] },
  continue: { ...source, highlight: [218, 246], desc: "쓰기 결과와 다음 거래의 시작 방식", annotations: [{ lines: [223, 232], color: "amber", note: "시간 초과·주소 거절·데이터 거절의 반환이 다릅니다. 이번 한 바이트 쓰기는 반환값 1을 확인해야 합니다." }, { lines: [240, 246], color: "emerald", note: "nostop=true를 restart_on_next에 남깁니다. 일반 blocking 호출은 시간 제한 검사기를 넘기지 않습니다." }] },
  read: { ...source, highlight: [287, 315], desc: "같은 주소에 읽기 명령 네 개 보내기", annotations: [{ lines: [287, 297], color: "sky", note: "첫 명령은 이전 restart_on_next 때문에 반복 START를 사용합니다. len=4, nostop=false이므로 마지막만 STOP을 세웁니다." }, { lines: [309, 315], color: "emerald", note: "중단을 확인하고 수신값을 버퍼에 씁니다. 일부 버퍼가 바뀌어도 함수 반환값을 확인하기 전에는 네 바이트 성공으로 읽지 않습니다." }] },
  deadline: { ...source, highlight: [338, 345], desc: "시간 제한 없는 읽기와 절대 마감 읽기", annotations: [{ lines: [338, 344], color: "amber", note: "일반 함수는 NULL을 넘기고 _until은 init_single_timeout_until로 절대 마감을 검사합니다. 같은 센서 요청의 마감은 위치 쓰기와 읽기에 함께 전달할 수 있습니다." }] },
};
export const fileTrees: Record<string, FileNode> = { "pico-sdk": { name: "pico-sdk", type: "dir", children: [
  { name: "src/rp2_common/hardware_i2c/i2c.c", type: "file", path: source.path, codeKey: "write" },
] } };
