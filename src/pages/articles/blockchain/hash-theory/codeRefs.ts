import type { CodeRef, FileNode, ProjectMeta } from "@/components/code/types";
import compact from "./codebase/sha256-compact.rs?raw";
import stream from "./codebase/sha2-block-api.rs?raw";
import profile from "./codebase/sha3-lib.rs?raw";
import pad from "./codebase/sha3-utils.rs?raw";
import native from "./verification/compact-main.rs?raw";
import trace from "./verification/trace.py?raw";
export const codeRefs:Record<string,CodeRef>={
"padding":{code:trace,"path": "case/trace.py", "highlight": [28, 29], "lang": "python", "desc": "SHA-256 패딩 길이입니다. 아래 72–85행은 여덟 입력과 스트리밍 결과를 확인합니다.", "annotations": [{"lines": [28, 29], "color": "sky", "note": "SHA-256 패딩 길이입니다. 아래 72–85행은 여덟 입력과 스트리밍 결과를 확인합니다."}]},
"round":{code:compact,"path": "rust/sha256-compact.rs", "highlight": [22, 40], "lang": "rust", "desc": "abc의 첫 T1·T2와 새 a·e를 원문의 나머지 덧셈에 대입합니다.", "annotations": [{"lines": [22, 40], "color": "sky", "note": "abc의 첫 T1·T2와 새 a·e를 원문의 나머지 덧셈에 대입합니다."}]},
"schedule":{code:compact,"path": "rust/sha256-compact.rs", "highlight": [6, 20], "lang": "rust", "desc": "16칸을 돌려 쓰며 64개 입력 단어를 계산합니다.", "annotations": [{"lines": [6, 20], "color": "sky", "note": "16칸을 돌려 쓰며 64개 입력 단어를 계산합니다."}]},
"feedforward":{code:compact,"path": "rust/sha256-compact.rs", "highlight": [43, 57], "lang": "rust", "desc": "시작 상태를 다시 더한 뒤 다음 블록으로 넘어갑니다.", "annotations": [{"lines": [43, 57], "color": "sky", "note": "시작 상태를 다시 더한 뒤 다음 블록으로 넘어갑니다."}]},
"native":{code:native,"path": "case/compact-main.rs", "highlight": [56, 87], "lang": "rust", "desc": "compact 원문과 pad/read_state를 실제 실행했습니다. 맨 위 주석에 대체 형식과 미실행 범위를 명시했습니다.", "annotations": [{"lines": [56, 87], "color": "sky", "note": "compact 원문과 pad/read_state를 실제 실행했습니다. 맨 위 주석에 대체 형식과 미실행 범위를 명시했습니다."}]},
"stream":{code:stream,"path": "rust/sha2-block-api.rs", "highlight": [18, 72], "lang": "rust", "desc": "상태와 블록 수, 마지막 총길이, big-endian 결과 출력을 확인합니다.", "annotations": [{"lines": [18, 72], "color": "sky", "note": "상태와 블록 수, 마지막 총길이, big-endian 결과 출력을 확인합니다."}]},
"extension":{code:trace,"path": "case/trace.py", "highlight": [86, 100], "lang": "python", "desc": "키가 공개된 로컬 검증자에서 57바이트 패딩을 이어 붙이고 HMAC과 비교합니다.", "annotations": [{"lines": [86, 100], "color": "sky", "note": "키가 공개된 로컬 검증자에서 57바이트 패딩을 이어 붙이고 HMAC과 비교합니다."}]},
"keccak-model":{code:trace,"path": "case/trace.py", "highlight": [136, 200], "lang": "python", "desc": "FIPS 202에 따라 직접 작성한 순열·스펀지 모형입니다. upstream keccak 함수가 아닙니다.", "annotations": [{"lines": [136, 200], "color": "sky", "note": "FIPS 202에 따라 직접 작성한 순열·스펀지 모형입니다. upstream keccak 함수가 아닙니다."}]},
"sha3-profile":{code:profile,"path": "rust/sha3-lib.rs", "highlight": [55, 76], "lang": "rust", "desc": "흡수 뒤 pad·f1600·read_state가 이어집니다. 145–166행에서 SHA3와 Keccak의 상수를 확인합니다.", "annotations": [{"lines": [55, 76], "color": "sky", "note": "흡수 뒤 pad·f1600·read_state가 이어집니다. 145–166행에서 SHA3와 Keccak의 상수를 확인합니다."}]},
"sha3-pad":{code:pad,"path": "rust/sha3-utils.rs", "highlight": [5, 25], "lang": "rust", "desc": "현재 바이트 위치에 06, 마지막 rate 비트에 1을 넣고 little-endian으로 읽습니다.", "annotations": [{"lines": [5, 25], "color": "sky", "note": "현재 바이트 위치에 06, 마지막 rate 비트에 1을 넣고 little-endian으로 읽습니다."}]},
"checks":{code:trace,"path": "case/trace.py", "highlight": [202, 258], "lang": "python", "desc": "두 필드 형식·실제 한 바이트 공격 예·네이티브 결과 대조와 실행 결과를 출력합니다.", "annotations": [{"lines": [202, 258], "color": "sky", "note": "두 필드 형식·실제 한 바이트 공격 예·네이티브 결과 대조와 실행 결과를 출력합니다."}]},
};
export const fileTrees:Record<string,FileNode>={rust:{name:"고정 RustCrypto 원문",type:"dir",children:[{name:"sha256-compact.rs",type:"file",path:"rust/sha256-compact.rs",codeKey:"round"},{name:"sha2-block-api.rs",type:"file",path:"rust/sha2-block-api.rs",codeKey:"stream"},{name:"sha3-lib.rs",type:"file",path:"rust/sha3-lib.rs",codeKey:"sha3-profile"},{name:"sha3-utils.rs",type:"file",path:"rust/sha3-utils.rs",codeKey:"sha3-pad"}]},case:{name:"별도 실행과 검산",type:"dir",children:[{name:"compact-main.rs",type:"file",path:"case/compact-main.rs",codeKey:"native"},{name:"trace.py",type:"file",path:"case/trace.py",codeKey:"checks"}]}};
export const projectMetas:Record<string,ProjectMeta>={rust:{id:"rust",label:"RustCrypto f6c786d 원문",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"},case:{id:"case",label:"본문의 검산 코드",badgeClass:"bg-emerald-50 border-emerald-300 text-emerald-800"}};
