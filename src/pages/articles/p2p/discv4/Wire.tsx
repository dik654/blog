import CodePanel from '@/components/ui/code-panel';

const ENCODE_CODE = `func Encode(priv *ecdsa.PrivateKey, req Packet) (packet, hash []byte, err error) {
    b := new(bytes.Buffer)
    b.Write(headSpace)           // 96바이트 빈 공간 (MAC 32 + Sig 64)
    b.WriteByte(req.Kind())      // 1바이트 패킷 타입
    if err := rlp.Encode(b, req); err != nil {
        return nil, nil, err
    }
    packet = b.Bytes()
    sig, err := crypto.Sign(crypto.Keccak256(packet[headSize:]), priv)
    if err != nil {
        return nil, nil, err
    }
    copy(packet[macSize:], sig)
    hash = crypto.Keccak256(packet[macSize:])
    copy(packet, hash)
    return packet, hash, nil
}`;

const DECODE_CODE = `func Decode(input []byte) (Packet, Pubkey, []byte, error) {
    if len(input) < headSize+1 {
        return nil, Pubkey{}, nil, ErrPacketTooSmall
    }
    hash, sig, sigdata := input[:macSize], input[macSize:headSize], input[headSize:]
    shouldhash := crypto.Keccak256(input[macSize:])
    if !bytes.Equal(hash, shouldhash) {
        return nil, Pubkey{}, nil, ErrBadHash
    }
    fromKey, err := recoverNodeKey(crypto.Keccak256(input[headSize:]), sig)
    if err != nil {
        return nil, fromKey, hash, err
    }
    var req Packet
    switch ptype := sigdata[0]; ptype {
    case PingPacket:      req = new(Ping)
    case PongPacket:      req = new(Pong)
    case FindnodePacket:  req = new(Findnode)
    case NeighborsPacket: req = new(Neighbors)
    // ...ENRRequest, ENRResponse
    }
    s := rlp.NewStream(bytes.NewReader(sigdata[1:]), 0)
    err = s.Decode(req)
    return req, fromKey, hash, err
}`;

export default function Wire() {
  return (
    <section id="wire" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">v4wire: 패킷 인코딩/디코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모든 discv4 패킷은 동일한 97바이트 헤더를 공유합니다.
        </p>
        <pre className="text-sm"><code>{`[32B MAC] [65B Signature] [1B Type] [RLP Payload]
 keccak256   ECDSA-secp256k1   1~6      구조체 직렬화`}</code></pre>
        <p>
          MAC = <code>keccak256(sig + type + payload)</code>. 무결성 검증용이며, 암호학적 보호는 아닙니다.
          <br />
          Signature에서 발신자 공개키를 <strong>ecrecover</strong>로 복원합니다. 별도의 from 필드가 불필요합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Encode: 서명 후 MAC 생성</h3>
        <p>
          빈 96바이트 공간을 먼저 확보합니다. type + RLP를 버퍼 뒤에 쓴 후 해당 부분을 keccak256 해시하여 서명합니다.<br />
          서명을 <code>packet[32:97]</code>에 복사하고, <code>keccak256(sig + sigdata)</code>를 앞 32바이트에 기록합니다.
        </p>
        <CodePanel title="v4wire.Encode -- go-ethereum/p2p/discover/v4wire/v4wire.go" code={ENCODE_CODE} startLine={251} annotations={[
          { lines: [253, 253], color: 'sky', note: 'headSpace: 96바이트 빈 버퍼' },
          { lines: [259, 259], color: 'emerald', note: 'type+payload 해시 후 ECDSA 서명' },
          { lines: [265, 266], color: 'amber', note: 'MAC = keccak256(sig + sigdata)' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">Decode: MAC 검증 후 공개키 복원</h3>
        <p>
          수신 측은 먼저 MAC을 재계산하여 대조합니다. 일치하면 서명에서 공개키를 복원하고, 첫 바이트로 패킷 타입을 판별한 뒤 RLP 디코딩합니다.
        </p>
        <CodePanel title="v4wire.Decode -- go-ethereum/p2p/discover/v4wire/v4wire.go" code={DECODE_CODE} startLine={212} annotations={[
          { lines: [217, 219], color: 'sky', note: 'MAC 무결성 검증' },
          { lines: [221, 221], color: 'emerald', note: 'ecrecover로 발신자 공개키 복원' },
          { lines: [227, 233], color: 'amber', note: '첫 바이트로 패킷 타입 분기' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">discv4 Wire Protocol</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// discv4 Packet Format
//
// 총 구조 (UDP payload):
//   [32 bytes] MAC
//   [65 bytes] Signature (ECDSA, secp256k1)
//   [1 byte]   Packet type
//   [variable] RLP payload
//
// Total header: 98 bytes
// Max packet: 1280 bytes (UDP fragment 방지)

// Packet Types:
//   0x01 Ping
//   0x02 Pong
//   0x03 Findnode
//   0x04 Neighbors
//   0x05 ENRRequest  (EIP-868)
//   0x06 ENRResponse (EIP-868)

// MAC 계산:
//   MAC = keccak256(sig || packet_type || rlp_payload)
//
//   역할:
//     - 무결성 검증
//     - 패킷 손상 감지
//     - NOT 인증 (signature가 그 역할)

// Signature (ECDSA secp256k1):
//   data = keccak256(packet_type || rlp_payload)
//   sig = ECDSA.sign(priv_key, data)
//
//   At verification:
//     pubkey = ecrecover(data, sig)
//     node_id = keccak256(pubkey)

// RLP Encoding:
//   Ethereum 표준 encoding
//   Self-describing
//   Length-prefixed

// 예시 Ping RLP:
//   [version, from_endpoint, to_endpoint,
//    expiration, enr_seq]
//
//   encoded: 0xf8[length][items...]

// 특성:
//   ✓ No session state (stateless)
//   ✓ Sender authentication (signature)
//   ✓ Integrity (MAC)
//   ✗ No confidentiality (plaintext)
//   ✗ No replay protection (expiration만)
//
// → discv5가 confidentiality 추가`}
        </pre>
      </div>
    </section>
  );
}
