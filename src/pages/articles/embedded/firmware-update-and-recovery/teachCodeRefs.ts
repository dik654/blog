import type { CodeRef, FileNode } from "@/components/code/types";
import publicCode from "./codebase/mcuboot/boot/bootutil/src/bootutil_public.c?raw";
import swapCode from "./codebase/mcuboot/boot/bootutil/src/swap_scratch.c?raw";
const pub={path:"mcuboot/boot/bootutil/src/bootutil_public.c",lang:"c" as const,code:publicCode};
const swap={path:"mcuboot/boot/bootutil/src/swap_scratch.c",lang:"c" as const,code:swapCode};
export const codeRefs:Record<string,CodeRef>={
 state:{...pub,highlight:[105,150],desc:"scratch swap의 TEST·PERM·REVERT",annotations:[{lines:[117,127],color:"sky",note:"보조 슬롯의 정상 magic과 미확정 image_ok가 TEST를 요청합니다. offset 전용 항목은 이번 설정에서 제외합니다."},{lines:[139,149],color:"amber",note:"주 슬롯의 복사 완료와 image OK 미설정이면 REVERT입니다. 표는 위에서부터 검사하므로 보조 슬롯에 새 요청이 없는 조건도 봅니다."}]},
 pending:{...pub,highlight:[684,698],desc:"boot_set_pending_multi(0,0)",annotations:[{lines:[689,695],color:"sky",note:"이미지 묶음 0의 보조 슬롯을 열고 active=false,confirm=false를 넘깁니다. 파일 검사·제품 검사를 대신하는 호출이 아닙니다."}]},
 "set-next":{...pub,highlight:[523,570],desc:"새 시험 요청과 정상 동작 확정의 다른 쓰기",annotations:[{lines:[539,547],color:"emerald",note:"활성 주 슬롯이고 image_ok가 미설정이면 정상 확인 표시를 씁니다."},{lines:[552,567],color:"amber",note:"비활성 새 후보는 magic과 TEST를 기록합니다. confirm=false이면 image OK를 쓰지 않습니다."}]},
 confirm:{...pub,highlight:[729,743],desc:"boot_set_confirmed_multi(0)",annotations:[{lines:[734,740],color:"emerald",note:"이번에는 이미지 묶음 0의 주 슬롯을 열어 active=true,confirm=true로 확정합니다. 반환값 0이 쓰기 성공입니다."}]},
 copy:{...swap,highlight:[618,777],desc:"보조→scratch·주→보조·scratch→주",annotations:[{lines:[649,655],color:"sky",note:"v2 조각을 scratch에 보관한 뒤 진행을 기록합니다."},{lines:[690,696],color:"amber",note:"v1 조각을 보조 슬롯에 남긴 뒤 진행을 기록합니다."},{lines:[726,728],color:"emerald",note:"보관했던 v2 조각을 주 슬롯에 씁니다. 끝부분에는 트레일러 전용 분기가 있습니다."},{lines:[775,778],color:"sky",note:"완료를 기록한 뒤 다음 조각의 초기 단계로 이동합니다."}]},
 resume:{...swap,highlight:[50,122],desc:"비휘발성 기록으로 교체 위치 복원",annotations:[{lines:[78,103],color:"amber",note:"저장된 상태 바이트를 순서대로 읽습니다. 일관되지 않은 기록에는 별도 오류 처리가 있습니다."},{lines:[113,119],color:"emerald",note:"읽은 위치를 조각 번호 idx와 단계 state로 나눕니다. 제품에서 실제 전원 차단 시험이 필요합니다."}]},
};
export const fileTrees:Record<string,FileNode>={mcuboot:{name:"mcuboot",type:"dir",children:[{name:"bootutil_public.c",type:"file",path:pub.path,codeKey:"state"},{name:"swap_scratch.c",type:"file",path:swap.path,codeKey:"copy"}]}};
