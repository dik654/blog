import type { CodeRef } from '@/components/code/types';
import keygenR1Go from './codebase/tss-lib/ecdsa/keygen/round_1.go?raw';
import signingR1Go from './codebase/tss-lib/ecdsa/signing/round_1.go?raw';
import mtaGo from './codebase/tss-lib/crypto/mta/share_protocol.go?raw';

export const dkgCodeRefs: Record<string, CodeRef> = {
  'keygen-round1': {
    path: 'tss-lib/ecdsa/keygen/round_1.go',
    code: keygenR1Go,
    lang: 'go',
    highlight: [31, 131],
    annotations: [
      { lines: [42, 52], color: 'sky', note: 'ui 랜덤 생성 → VSS share 분배 (Shamir 다항식)' },
      { lines: [59, 64], color: 'emerald', note: 'Feldman 커밋먼트 생성 → HashCommitment(C, D)' },
      { lines: [90, 99], color: 'amber', note: 'DLN proof 생성 — h1, h2, NTilde 영지식 증명' },
      { lines: [117, 130], color: 'violet', note: 'Round 1 메시지 브로드캐스트 — (C, PaillierPK, NTilde, DLN proofs)' },
    ],
    desc: 'GG18 키 생성 Round 1입니다. 각 참가자가 비밀 ui를 선택하고 VSS share로 분배합니다. Paillier 키와 DLN 증명을 함께 브로드캐스트하여 나중에 MtA 프로토콜에 사용합니다.',
  },

  'signing-round1': {
    path: 'tss-lib/ecdsa/signing/round_1.go',
    code: signingR1Go,
    lang: 'go',
    highlight: [31, 85],
    annotations: [
      { lines: [54, 62], color: 'sky', note: 'k, γ 랜덤 생성 → γ·G 커밋먼트 생성' },
      { lines: [67, 78], color: 'emerald', note: 'MtA(Multiplicative-to-Additive) — Alice가 k를 Paillier 암호화' },
      { lines: [80, 83], color: 'amber', note: 'Round 1 Message 2 — 커밋먼트 C 브로드캐스트' },
    ],
    desc: 'GG18 서명 Round 1입니다. 임계값 ECDSA에서 k·γ = kγ를 분산 계산하기 위해 MtA 프로토콜을 시작합니다. Alice가 k를 Paillier 암호화하여 각 Bob에게 전송합니다.',
  },

  'mta-protocol': {
    path: 'tss-lib/crypto/mta/share_protocol.go',
    code: mtaGo,
    lang: 'go',
    highlight: [20, 66],
    annotations: [
      { lines: [20, 32], color: 'sky', note: 'AliceInit — a를 Paillier 암호화, 범위증명 생성' },
      { lines: [34, 46], color: 'emerald', note: 'BobMid — 범위증명 검증 → c_B = b·c_A + Enc(β\')' },
      { lines: [55, 63], color: 'amber', note: 'HomoMult(b, cA) + HomoAdd(cB, cBetaPrm) → 동형 연산' },
    ],
    desc: 'Multiplicative-to-Additive(MtA) 변환입니다. Alice가 Enc(a)를 보내면 Bob이 동형 곱셈 b·Enc(a) = Enc(ab)를 수행하고, 랜덤 β\'를 더해 a·b = α + β로 분해합니다.',
  },
};
