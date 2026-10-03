import type { CodeRef } from "@/components/code/types";
import config from "./codebase/go-ethereum/params/config.go?raw";
export const codeRefs: Record<string,CodeRef> = {
 mainnet:{path:"go-ethereum/params/config.go",code:config,highlight:[41,75],lang:"go",desc:"commit c9a2bc7. 메인넷 활성화 시각과 실제로 연결된 BlobScheduleConfig를 함께 읽습니다.",annotations:[{lines:[64,65],color:"sky",note:"BPO1·BPO2의 메인넷 활성화 timestamp입니다."},{lines:[69,74],color:"emerald",note:"다른 곳에 기본값이 정의돼 있어도 이 메인넷 일정에 연결됐는지 확인합니다."}]},
 params:{path:"go-ethereum/params/config.go",code:config,highlight:[350,373],lang:"go",desc:"BPO2는 target14/max21/updateFraction11684671입니다. BPO3·4의 기본 구조가 있다는 사실만으로 메인넷 활성화를 결론내리지 않습니다.",annotations:[{lines:[357,361],color:"sky",note:"본문 4블록의18개는 max21 이내이며 target14보다4 많습니다."},{lines:[362,373],color:"amber",note:"다음 파라미터 정의와 실제 메인넷 활성화는 별도 조건입니다."}]},
};
