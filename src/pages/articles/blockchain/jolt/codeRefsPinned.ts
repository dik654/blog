import type { CodeRef, FileNode } from "@/components/code/types";
import execSource from "./codebase/jolt/tracer/src/instruction/add.rs?raw";
import lookupSource from "./codebase/jolt/crates/jolt-lookup-tables/src/instructions/riscv/add.rs?raw";
import memorySource from "./codebase/jolt/crates/jolt-claims/src/twist/memory_checking.rs?raw";
import transcriptSource from "./codebase/jolt/crates/jolt-verifier/src/verifier.rs?raw";
/** Original complete files, a16z/jolt 47130f3dc9a51a7ac2754a98ff0aa31981a6b810 (2026-10-02). */
export const codeRefs: Record<string, CodeRef> = {
"jolt-exec": { path: "jolt/tracer/src/instruction/add.rs", code: execSource, lang: "rust", highlight: [17, 25], desc: "ADD.exec가 두 레지스터를 더해 목적 위치에 쓰는 계산을 확인합니다. wrapping_add는 정해진 비트 폭의 되돌아옴을 처리합니다.", annotations: [{"lines": [19, 24], "color": "sky", "note": "두 입력3과4를 읽고 결과7을 목적 레지스터에 씁니다."}] },
"jolt-lookup": { path: "jolt/crates/jolt-lookup-tables/src/instructions/riscv/add.rs", code: lookupSource, lang: "rust", highlight: [8, 30], desc: "실행값과 lookup 입력 표현이 일치해야 합니다. 입력을 XLEN으로 제한하고 결과를 같은 wrapping_add로 만듭니다.", annotations: [{"lines": [18, 23], "color": "sky", "note": "입력 마스크가 명령 폭을 고정합니다."}, {"lines": [26, 30], "color": "sky", "note": "3과4의 결과7을 계산합니다."}] },
"jolt-memory": { path: "jolt/crates/jolt-claims/src/twist/memory_checking.rs", code: memorySource, lang: "rust", highlight: [36, 54], desc: "레지스터 읽기와 쓰기가 같은 값에 연결돼야 합니다. γ로 묶은 입력과 주소·변화량으로 만든 출력을 비교합니다.", annotations: [{"lines": [36, 43], "color": "sky", "note": "목적값 7과 두 입력 3,4를 γ=2로 묶으면 29입니다."}, {"lines": [45, 54], "color": "sky", "note": "주소 선택·이전 값·변화량과 시간 선택이 같은 주장을 만듭니다."}] },
"jolt-transcript": { path: "jolt/crates/jolt-verifier/src/verifier.rs", code: transcriptSource, lang: "rust", highlight: [916, 949], desc: "공개 출력과 프로그램이 달라진 증거를 같은 주장으로 검사하면 안 됩니다. 준비 자료 digest와 입출력·실행 길이를 질문 생성 기록에 넣습니다.", annotations: [{"lines": [924, 928], "color": "sky", "note": "준비한 프로그램 자료의 digest를 묶습니다."}, {"lines": [940, 948], "color": "sky", "note": "공개 입출력과 실행 길이가 질문 생성에 들어갑니다."}] },
};
export const fileTree: FileNode = { name: "jolt", type: "dir", children: [
{ name: "tracer/src/instruction/add.rs", type: "file", path: "jolt/tracer/src/instruction/add.rs", codeKey: "jolt-exec" },
{ name: "crates/jolt-lookup-tables/src/instructions/riscv/add.rs", type: "file", path: "jolt/crates/jolt-lookup-tables/src/instructions/riscv/add.rs", codeKey: "jolt-lookup" },
{ name: "crates/jolt-claims/src/twist/memory_checking.rs", type: "file", path: "jolt/crates/jolt-claims/src/twist/memory_checking.rs", codeKey: "jolt-memory" },
{ name: "crates/jolt-verifier/src/verifier.rs", type: "file", path: "jolt/crates/jolt-verifier/src/verifier.rs", codeKey: "jolt-transcript" },
] };
