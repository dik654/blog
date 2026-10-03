import type { CodeRef } from "@/components/code/types";
import consensus from "./codebase/consensus-specs/specs/gloas/beacon-chain.md?raw";
import fork from "./codebase/execution-specs/src/ethereum/forks/amsterdam/fork.py?raw";
import bal from "./codebase/execution-specs/src/ethereum/forks/amsterdam/block_access_lists.py?raw";

export const codeRefs: Record<string, CodeRef> = {
 containers: {code:consensus,"path": "consensus-specs/specs/gloas/beacon-chain.md", "highlight": [747, 794], "lang": "python", "desc": "889a389. 진행 중 Gloas 명세의 약속과 실제 내용입니다. 메인넷 배포 구조로 단정하지 않습니다.", "annotations": [{"lines": [749, 764], "color": "sky", "note": "block_hash는 내용의 약속이고 value는 Gwei 지급 값입니다. 예시0.01 ETH는10,000,000 Gwei입니다."}, {"lines": [777, 785], "color": "emerald", "note": "Envelope에는 실제 payload가 들어갑니다. 약속을 읽는 일과 T1·T2의 실행 자료를 읽는 일은 다릅니다."}]},
 bid: {code:consensus,"path": "consensus-specs/specs/gloas/beacon-chain.md", "highlight": [2103, 2156], "lang": "python", "desc": "활성 제작자·서명·지급 여력·부모·slot을 검사하고 보류 중 지급을 기록합니다. 실행 결과95의 검사는 별도입니다.", "annotations": [{"lines": [2114, 2121], "color": "sky", "note": "일반 제작자 bid에서 활성 상태와 지급 여력, 서명을 확인합니다."}, {"lines": [2129, 2137], "color": "amber", "note": "다른 slot이나 부모의 유효한 서명을 재사용하지 못하도록 문맥을 대조합니다."}, {"lines": [2140, 2155], "color": "emerald", "note": "지급 조건을 pending에 기록하고 이번 bid를 저장합니다."}]},
 validate: {code:fork,"path": "execution-specs/src/ethereum/forks/amsterdam/fork.py", "highlight": [326, 365], "lang": "python", "desc": "a87891f. 실행으로 생성한 BAL hash를 header와 대조하는 참조 구현입니다. 이 코드만으로 병렬 처리의 실측 성능을 주장하지 않습니다.", "annotations": [{"lines": [326, 340], "color": "sky", "note": "T1·T2를 포함한 본문 실행 결과에서 접근 목록과hash를 계산합니다."}, {"lines": [362, 363], "color": "amber", "note": "X의 실제90·95와 다른 목록이 다른hash를 만들면 블록을 거절합니다."}]},
 bal: {code:bal,"path": "execution-specs/src/ethereum/forks/amsterdam/block_access_lists.py", "highlight": [30, 56], "lang": "python", "desc": "거래 뒤 저장 값을 인덱스와 함께 담는 실제 자료 구조입니다.", "annotations": [{"lines": [34, 54], "color": "emerald", "note": "사례의 두 변화는 index1/value90과 index2/value95로 대응합니다. 실제 주소·slot은 상위 구조가 묶습니다."}]},
};
