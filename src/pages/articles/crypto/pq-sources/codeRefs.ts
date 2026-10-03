import type { CodeRef, FileNode } from "@/components/code/types";
import kem from "./codebase/PQClean/crypto_kem/ml-kem-768/clean/kem.c?raw";
import sign from "./codebase/PQClean/crypto_sign/ml-dsa-44/clean/sign.c?raw";

export const codeRefs: Record<string, CodeRef> = {
  kemDec: {
    path: "PQClean/crypto_kem/ml-kem-768/clean/kem.c", code: kem, lang: "c", highlight: [136, 163],
    desc: "PQClean 0586a824fc0d49df0b6b6e9179d8d15d06d0974f. 실제 ML-KEM-768 복원 경로입니다. mod17 사례는 앞의 상쇄만 설명하는 축소 모델입니다.",
    annotations: [
      { lines: [146, 153], color: "sky", note: "메시지를 복원하고 후보 키·난수를 유도한 뒤 같은 공개 키로 다시 암호화합니다." },
      { lines: [155, 161], color: "amber", note: "받은 캡슐과 재생성한 캡슐이 다르면 비밀 z에 결속한 대체 키를 유지합니다. 일치할 때만 정상 후보를 복사합니다." },
    ],
  },
  sign: {
    path: "PQClean/crypto_sign/ml-dsa-44/clean/sign.c", code: sign, lang: "c", highlight: [133, 194],
    desc: "같은 고정본의 ML-DSA-44. y 샘플링→Ay→challenge→z→거절→hint 순서입니다. 작은 행렬 예제의 q17과 실제 표준의 q8380417을 구분합니다.",
    annotations: [
      { lines: [135, 151], color: "sky", note: "매 시도 새 y로 Ay를 만들고 그 높은 부분과 메시지 요약을 해시해 challenge를 만듭니다." },
      { lines: [158, 175], color: "amber", note: "z=y+c·s1의 크기와 남은 낮은 부분의 크기를 검사하여 허용 범위를 벗어나면 다시 시작합니다." },
      { lines: [177, 194], color: "emerald", note: "공개 키의 반올림 차이를 복원할 힌트를 만들고 힌트 수까지 제한한 뒤 서명을 포장합니다." },
    ],
  },
  verify: {
    path: "PQClean/crypto_sign/ml-dsa-44/clean/sign.c", code: sign, lang: "c", highlight: [265, 328],
    desc: "서명 길이·인코딩·응답 크기·문맥과 메시지·재구성한 challenge를 검사합니다. 서명 검증은 문서 내용의 사실 여부를 판정하지 않습니다.",
    annotations: [
      { lines: [265, 289], color: "sky", note: "길이·형식·응답 크기를 확인하고 공개 키·context·메시지를 같은 요약에 결속합니다." },
      { lines: [292, 310], color: "emerald", note: "Az−c·2^d·t1을 계산하고 hint로 높은 부분을 재구성합니다." },
      { lines: [313, 328], color: "amber", note: "재구성한 값과 메시지에서 challenge를 다시 계산해 서명 속 challenge와 대조합니다." },
    ],
  },
};

export const fileTrees: Record<string, FileNode> = { PQClean: { name: "PQClean · 0586a824", type: "dir", children: [{ name: "ML-KEM-768 · kem.c", type: "file", codeKey: "kemDec" }, { name: "ML-DSA-44 · sign.c", type: "file", codeKey: "sign" }] } };
