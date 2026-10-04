import type { CodeRef, FileNode } from "@/components/code/types";
import original from "./codebase/freertos-kernel/tasks.c?raw";
const source = { path: "freertos-kernel/tasks.c", lang: "c" as const, code: original };
export const codeRefs: Record<string, CodeRef> = {
 select: { ...source, highlight:[194,209], desc:"한 코어·일반 선택 경로: 준비된 가장 높은 우선순위", annotations:[{lines:[198,208],color:"sky",note:"준비 목록 3이 있으면 제어를 고릅니다. 제어가 기다림 목록으로 빠지면 2의 센서를 고릅니다. 잠든 작업은 준비 목록의 후보가 아닙니다."}] },
 wake: { ...source, highlight:[2385,2428], desc:"지난 목표+주기, 현재 시각은 대기 여부에 사용", annotations:[{lines:[2385,2386],color:"sky",note:"지난 목표 0+주기 10=다음 목표 10입니다. 현재 3이나 12에 주기를 더하지 않습니다."},{lines:[2405,2428],color:"amber",note:"넘침 없는 현재 3이면 7 tick 대기합니다. 현재 12이면 대기하지 않지만 지난 목표는 10으로 갱신합니다. 실제 실행시각은 준비 뒤 경쟁에 따릅니다."}] },
 inherit: { ...source, highlight:[6652,6690], desc:"뮤텍스 보유자의 우선순위를 요청자에 맞춤", annotations:[{lines:[6652,6657],color:"amber",note:"로그 1<센서 2 조건을 확인합니다. 상속 여부는 보유자와 요청자의 현재 우선순위를 비교합니다."},{lines:[6670,6688],color:"emerald",note:"준비 목록에 있던 로그를 새 우선순위 2로 옮깁니다. 임계 구간의 남은 실행 2 ms는 이 변경으로 사라지지 않습니다."}] },
};
export const fileTrees: Record<string, FileNode> = { "freertos-kernel": { name:"freertos-kernel",type:"dir",children:[{name:"tasks.c",type:"file",path:source.path,codeKey:"select"}] } };
