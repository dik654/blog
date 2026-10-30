import type { CodeRef } from "@/components/code/types";
import publicKeyRaw from "./codebase/prysm/crypto/bls/blst/public_key.go?raw";
import secretKeyRaw from "./codebase/prysm/crypto/bls/blst/secret_key.go?raw";
import signatureRaw from "./codebase/prysm/crypto/bls/blst/signature.go?raw";
import signatureBatchRaw from "./codebase/prysm/crypto/bls/signature_batch.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "bls-point-validation": {
    path: "prysm@v7.3.1 · crypto/bls/blst/public_key.go · signature.go",
    lang: "go",
    code: `${publicKeyRaw}\n\n${signatureRaw}`,
    highlight: [4, 58],
    desc: "압축 공개키와 서명을 BLST point로 바꾸고 subgroup·infinity 경계를 확인하는 Prysm v7.3.1 코드",
    annotations: [
      { lines: [4, 11], color: "sky", note: "공개키는 먼저 설정된 48-byte 길이를 확인합니다." },
      { lines: [20, 28], color: "amber", note: "Uncompress만으로 끝내지 않고 KeyValidate로 subgroup과 infinity를 검사합니다." },
      { lines: [44, 55], color: "emerald", note: "서명은 decode 뒤 SigValidate(false)로 group을 확인합니다." },
    ],
  },
  "bls-sign-verify": {
    path: "prysm@v7.3.1 · crypto/bls/blst/secret_key.go · signature.go",
    lang: "go",
    code: `${secretKeyRaw}\n\n${signatureRaw}`,
    highlight: [4, 45],
    desc: "같은 POP DST를 사용해 signing-root bytes를 서명하고 단일 pairing 관계를 검증하는 경계",
    annotations: [
      { lines: [4, 7], color: "sky", note: "PublicKey는 같은 secret scalar에서 G1 point를 만듭니다." },
      { lines: [9, 15], color: "amber", note: "Sign은 message bytes와 POP DST를 BLST에 전달합니다." },
      { lines: [22, 22], color: "violet", note: "Prysm v7.3.1이 사용하는 POP ciphersuite DST입니다." },
      { lines: [40, 44], color: "emerald", note: "Verify는 미리 검증된 key·signature와 같은 DST로 pairing 관계를 판정합니다." },
    ],
  },
  "bls-fast-aggregate": {
    path: "prysm@v7.3.1 · crypto/bls/blst/signature.go · FastAggregateVerify()",
    lang: "go",
    code: signatureRaw,
    highlight: [29, 39],
    desc: "여러 공개키가 정확히 같은 32-byte signing root에 만든 aggregate signature를 검증하는 경로",
    annotations: [
      { lines: [29, 33], color: "sky", note: "빈 참여자 목록은 일반 FastAggregateVerify에서 거절합니다." },
      { lines: [34, 37], color: "amber", note: "검증된 Prysm public key wrapper에서 BLST G1 point를 모읍니다." },
      { lines: [38, 38], color: "emerald", note: "한 message와 여러 key를 BLST 같은-message aggregate 검증에 전달합니다." },
    ],
  },
  "bls-multiple-verify": {
    path: "prysm@v7.3.1 · crypto/bls/blst/signature.go · VerifyMultipleSignatures()",
    lang: "go",
    code: signatureRaw,
    highlight: [41, 73],
    desc: "서로 다른 signature·public key·signing root 식을 무작위 가중해 한 번에 판정하는 경로",
    annotations: [
      { lines: [42, 52], color: "sky", note: "빈 입력과 세 배열의 길이 불일치를 먼저 거절합니다." },
      { lines: [53, 59], color: "amber", note: "각 public key와 message의 대응 순서를 그대로 보존합니다." },
      { lines: [60, 70], color: "violet", note: "각 item에 사용할 nonzero random scalar를 새로 만듭니다." },
      { lines: [71, 73], color: "emerald", note: "BLST MultipleAggregateVerify에 group check와 64-bit entropy 설정을 전달합니다." },
    ],
  },
  "bls-verbose-fallback": {
    path: "prysm@v7.3.1 · crypto/bls/signature_batch.go · VerifyVerbosely()",
    lang: "go",
    code: signatureBatchRaw,
    highlight: [4, 42],
    desc: "Batch 전체가 실패했을 때 각 signature를 다시 검증해 잘못된 item을 찾는 Prysm fallback",
    annotations: [
      { lines: [4, 7], color: "sky", note: "첫 시도는 전체 batch verification입니다." },
      { lines: [9, 15], color: "amber", note: "Batch가 통과하거나 호출 오류면 즉시 결과를 반환합니다." },
      { lines: [17, 38], color: "violet", note: "Batch FAIL일 때만 모든 item을 단일 Verify로 다시 확인합니다." },
      { lines: [41, 41], color: "emerald", note: "Invalid item 설명을 하나의 오류로 돌려줍니다." },
    ],
  },
};
