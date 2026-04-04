export const noiseXXSteps = [
  { from: 'Initiator', to: 'Responder', msg: '→ e', desc: 'X25519 임시 공개키(e) 전송' },
  { from: 'Responder', to: 'Initiator', msg: '← e, ee, s, es', desc: '임시키 + DH(ee) + 정적키(s) + DH(es)' },
  { from: 'Initiator', to: 'Responder', msg: '→ s, se', desc: '정적키(s) + DH(se). 이후 대칭키 확립' },
];

export const noisePayloadCode = `// Noise 핸드셰이크 Payload (protobuf)
message NoiseHandshakePayload {
    bytes identity_key = 1;  // libp2p 공개키 (Ed25519)
    bytes identity_sig = 2;  // DH 공개키에 대한 서명
    bytes data = 3;           // 확장 데이터 (선택)
}

// 신원 바인딩 과정:
// 1. Initiator: Ed25519 키로 X25519 공개키 서명 생성
//    sig = Ed25519.sign(keypair, "noise-libp2p-static-key:" + dh_pub)
//
// 2. Payload에 (Ed25519 pub, sig) 포함하여 전송
//
// 3. Responder: 서명 검증
//    Ed25519.verify(identity_key, "noise-libp2p-static-key:" + dh_pub, sig)
//
// 4. PeerId 도출: PeerId = multihash(identity_key)
//    → 핸드셰이크 중 PeerId 검증 완료`;

export const noisePayloadAnnotations = [
  { lines: [2, 6] as [number, number], color: 'sky' as const, note: 'Protobuf payload 구조' },
  { lines: [9, 11] as [number, number], color: 'emerald' as const, note: '서명 생성 (Initiator)' },
  { lines: [14, 18] as [number, number], color: 'amber' as const, note: '검증 + PeerId 도출 (Responder)' },
];

export const keyExchangeCode = `// X25519 Diffie-Hellman 키 교환 상세
//
// XX 패턴에서 3번의 DH 연산:
//   ee = DH(e_init, e_resp)    → 임시키끼리 (전방향 비밀)
//   es = DH(e_init, s_resp)    → Initiator 임시 + Responder 정적
//   se = DH(s_init, e_resp)    → Initiator 정적 + Responder 임시
//
// 세션키 도출: HKDF(ee || es || se)
//   → encrypt_key (initiator → responder)
//   → decrypt_key (responder → initiator)
//
// 이후 모든 데이터는 ChaCha20-Poly1305로 암호화`;

export const keyExchangeAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: '3번의 DH 연산' },
  { lines: [8, 10] as [number, number], color: 'emerald' as const, note: 'HKDF로 대칭키 도출' },
  { lines: [12, 12] as [number, number], color: 'amber' as const, note: 'AEAD 암호화' },
];
