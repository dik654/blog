import type { CodeRef } from "@/components/code/types";
import arithmetic from "./codebase/execution-specs/src/ethereum/forks/shanghai/vm/instructions/arithmetic.py?raw";
import interpreter from "./codebase/execution-specs/src/ethereum/forks/shanghai/vm/interpreter.py?raw";
export const teachCodeRefs: Record<string, CodeRef> = {
 add: {path:"execution-specs/src/ethereum/forks/shanghai/vm/instructions/arithmetic.py",lang:"python",code:arithmetic,highlight:[35,48],desc:"87aba1a · Shanghai add. 위의 두 값을 꺼내 비용을 차감하고 256비트 합을 다시 넣습니다.",annotations:[{lines:[36,43],color:"sky",note:"사례의 [2,3]에서 x=3, y=2를 꺼냅니다. 14 gas에서 ADD 비용 3을 차감하고 결과 5를 만듭니다."},{lines:[45,48],color:"emerald",note:"스택은 [5], pc는 4에서 5가 됩니다. 이 명령은 storage에 5를 쓰지 않습니다."}]},
 init: {path:"execution-specs/src/ethereum/forks/shanghai/vm/interpreter.py",lang:"python",code:interpreter,highlight:[220,242],desc:"같은 코드와 입력에서 pc·stack·memory·gas를 초기화합니다.",annotations:[{lines:[222,227],color:"sky",note:"pc=0, 빈 스택과 메모리, 사례의 실행 예산 20으로 시작합니다."},{lines:[240,242],color:"emerald",note:"호출 실패 때 되돌릴 상태를 보관합니다. 전역 장부와 일시적인 stack은 다른 대상입니다."}]},
 dispatch: {path:"execution-specs/src/ethereum/forks/shanghai/vm/interpreter.py",lang:"python",code:interpreter,highlight:[255,267],desc:"현재 pc의 바이트를 명령으로 해석한 뒤 해당 구현을 호출합니다.",annotations:[{lines:[256,264],color:"sky",note:"pc=0,2,4의 바이트 0x60,0x60,0x01을 순서대로 읽습니다. 각 명령이 다음 pc를 갱신합니다."}]},
 failure: {path:"execution-specs/src/ethereum/forks/shanghai/vm/interpreter.py",lang:"python",code:interpreter,highlight:[269,280],desc:"예외 종료와 REVERT를 구분하고 실패한 호출의 상태를 복구합니다.",annotations:[{lines:[269,276],color:"amber",note:"예외 종료는 남은 gas를 0으로 만듭니다. REVERT 경로는 이 줄에서 gas를 0으로 만들지 않습니다."},{lines:[278,280],color:"emerald",note:"두 실패 모두 해당 호출의 상태 변경을 복원합니다. 상위 호출이 실패를 처리하고 계속할 수 있습니다."}]},
};
