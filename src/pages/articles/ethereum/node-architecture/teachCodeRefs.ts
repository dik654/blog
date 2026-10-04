import type { CodeRef } from "@/components/code/types";
import engine from "./codebase/reth/crates/engine/tree/src/tree/mod.rs?raw";
export const teachCodeRefs:Record<string,CodeRef>={
 validation:{path:"reth/crates/engine/tree/src/tree/mod.rs",lang:"rust",code:engine,highlight:[789,811],desc:"Reth v2.2.0 88505c7 · try_insert_payload. 삽입 결과에 따라 VALID와 SYNCING을 구분합니다.",annotations:[{lines:[792,799],color:"emerald",note:"유효한 H101은 latest_valid_hash를 H101로 둡니다. 이미 본 유효한 블록도 VALID로 답하지만 already_seen은 true입니다."},{lines:[801,806],color:"amber",note:"부모와 아직 연결되지 않은 H101은 SYNCING입니다. 알려진 잘못된 계산이라는 뜻이 아닙니다."}]},
 choice:{path:"reth/crates/engine/tree/src/tree/mod.rs",lang:"rust",code:engine,highlight:[1127,1146],desc:"on_forkchoice_updated가 head 요청을 검증하고 현재 가지를 유지하거나 변경합니다.",annotations:[{lines:[1132,1141],color:"sky",note:"현재 head가 같으면 기존 경로로 답하고 다르면 체인 갱신을 시도합니다. VALID 응답 그 자체와 정식 가지 선택은 별도의 동작입니다."},{lines:[1144,1146],color:"amber",note:"요청한 블록을 찾지 못한 경우에는 빠진 자료를 확보하는 경로로 이어집니다."}]},
};
