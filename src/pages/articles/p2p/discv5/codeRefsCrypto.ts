import type { CodeRef } from '@/components/code/types';

export const cryptoCodeRefs: Record<string, CodeRef> = {
  'ecdh': {
    path: 'go-ethereum/p2p/discover/v5wire/crypto.go',
    lang: 'go',
    highlight: [1, 10],
    desc: 'ecdh: secp256k1 스칼라 곱셈으로 공유 비밀을 생성한다.\n임시 개인키 x 수신자 공개키 → 33바이트 compressed point.',
    code: `func ecdh(privkey *ecdsa.PrivateKey,
    pubkey *ecdsa.PublicKey) []byte {
    secX, secY := pubkey.ScalarMult(
        pubkey.X, pubkey.Y, privkey.D.Bytes())
    if secX == nil { return nil }
    sec := make([]byte, 33)
    sec[0] = 0x02 | byte(secY.Bit(0))
    math.ReadBits(secX, sec[1:])
    return sec
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'secp256k1 스칼라 곱: ephPriv * remotePub' },
      { lines: [6, 8], color: 'emerald', note: '33바이트 compressed point 직렬화' },
      { lines: [7, 7], color: 'amber', note: 'Y 좌표 패리티 비트로 압축 접두어 결정' },
    ],
  },

  'derive-keys': {
    path: 'go-ethereum/p2p/discover/v5wire/crypto.go',
    lang: 'go',
    highlight: [1, 16],
    desc: 'deriveKeys: ECDH 공유 비밀을 HKDF-SHA256에 입력하여 세션 키를 추출한다.\ninfo에 양측 nodeID를 포함하여 키의 방향성을 보장.',
    code: `func deriveKeys(hash hashFn,
    priv *ecdsa.PrivateKey, pub *ecdsa.PublicKey,
    n1, n2 enode.ID, challenge []byte) *session {
    const text = "discovery v5 key agreement"
    var info = make([]byte, 0, len(text)+len(n1)+len(n2))
    info = append(info, text...)
    info = append(info, n1[:]...)
    info = append(info, n2[:]...)
    eph := ecdh(priv, pub)
    if eph == nil { return nil }
    kdf := hkdf.New(hash, eph, challenge, info)
    sec := session{
        writeKey: make([]byte, aesKeySize),
        readKey:  make([]byte, aesKeySize),
    }
    kdf.Read(sec.writeKey)
    kdf.Read(sec.readKey)
    return &sec
}`,
    annotations: [
      { lines: [4, 8], color: 'sky', note: 'info = 고정 문자열 + nodeID1 + nodeID2' },
      { lines: [11, 11], color: 'emerald', note: 'HKDF(secret=ECDH, salt=challenge, info)' },
      { lines: [16, 17], color: 'amber', note: 'HKDF 출력에서 writeKey, readKey 순서 추출' },
    ],
  },

  'id-nonce-hash': {
    path: 'go-ethereum/p2p/discover/v5wire/crypto.go',
    lang: 'go',
    highlight: [1, 8],
    desc: 'idNonceHash: ID 서명에 사용할 해시를 계산한다.\n"discovery v5 identity proof" 접두어로 도메인 분리.',
    code: `func idNonceHash(h hash.Hash,
    challenge, ephkey []byte, destID enode.ID) []byte {
    h.Reset()
    h.Write([]byte("discovery v5 identity proof"))
    h.Write(challenge)
    h.Write(ephkey)
    h.Write(destID[:])
    return h.Sum(nil)
}`,
    annotations: [
      { lines: [4, 4], color: 'sky', note: '고정 프리픽스로 도메인 분리' },
      { lines: [5, 7], color: 'emerald', note: 'challengeData + ephPubkey + destID' },
      { lines: [8, 8], color: 'amber', note: 'SHA-256 해시 최종 출력' },
    ],
  },

  'encrypt-gcm': {
    path: 'go-ethereum/p2p/discover/v5wire/crypto.go',
    lang: 'go',
    highlight: [1, 8],
    desc: 'encryptGCM: AES-128-GCM으로 메시지를 암호화한다.\nauthData(패킷 헤더)를 AAD로 사용하여 헤더 변조도 감지.',
    code: `func encryptGCM(dest, key, nonce,
    plaintext, authData []byte) ([]byte, error) {
    block, _ := aes.NewCipher(key)
    aesgcm, _ := cipher.NewGCMWithNonceSize(
        block, gcmNonceSize)
    return aesgcm.Seal(
        dest, nonce, plaintext, authData), nil
}`,
    annotations: [
      { lines: [3, 3], color: 'sky', note: 'AES-128 블록 암호 생성' },
      { lines: [4, 5], color: 'emerald', note: 'GCM 모드 (12B nonce)' },
      { lines: [6, 7], color: 'amber', note: 'authData = 패킷 헤더 (AAD 인증)' },
    ],
  },
};
