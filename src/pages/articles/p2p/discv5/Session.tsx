import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SessionKeyViz from './viz/SessionKeyViz';

export default function Session({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="session" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">세션 키 도출과 암호화</h2>

      <div className="not-prose mb-8"><SessionKeyViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          핸드셰이크 완료 후 양측은 동일한 세션 키를 도출한다.<br />
          이후 모든 메시지는 AES-128-GCM으로 암호화된다.
        </p>

        <h3>ECDH 공유 비밀</h3>
        <p>
          임시(ephemeral) 개인키와 수신자 정적 공개키로 스칼라 곱셈을 수행한다.<br />
          결과는 33바이트 compressed point.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('ecdh', codeRefs['ecdh'])} />
          <span className="text-[10px] text-muted-foreground self-center">ecdh() — 공유 비밀 생성</span>
        </div>

        <h3>HKDF-SHA256 키 도출</h3>
        <p>
          공유 비밀을 HKDF에 입력하여 writeKey(16B) + readKey(16B)를 추출한다.
          info에 양측 nodeID를 포함하여 방향성을 부여한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('derive-keys', codeRefs['derive-keys'])} />
          <span className="text-[10px] text-muted-foreground self-center">deriveKeys() — HKDF 세션 키 도출</span>
        </div>

        <h3>키 방향: keysFlipped</h3>
        <p>
          발신자의 <code>writeKey</code>는 수신자의 <code>readKey</code>다.<br />
          수신자는 <code>session.keysFlipped()</code>로 키를 뒤집어 저장한다.
        </p>

        <h3>AES-GCM 암호화</h3>
        <p>
          세션 키 확립 후 모든 메시지는 AES-128-GCM으로 암호화된다.
          nonce 12바이트, AAD로 패킷 헤더를 사용하여 헤더 변조도 감지한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('encrypt-gcm', codeRefs['encrypt-gcm'])} />
          <span className="text-[10px] text-muted-foreground self-center">encryptGCM() — AES-GCM 암호화</span>
        </div>

        <div className="not-prose rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 my-6">
          <p className="font-semibold text-sm text-violet-400">SessionCache</p>
          <p className="text-sm mt-1">
            확립된 세션은 <code>(srcID, addr)</code> 키로 LRU(용량 1024)에 저장된다.<br />
            이후 같은 노드와는 핸드셰이크 없이 즉시 암호화 메시지를 교환한다.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">discv5 세션 암호화 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// discv5 Session Key Derivation
//
// 핸드셰이크 완료 시점에 세션 키 도출
//
// Input:
//   ephemeral_privkey: Alice의 임시 개인키 (32 bytes)
//   peer_static_pubkey: Bob의 정적 공개키 (33 bytes)
//   alice_node_id, bob_node_id (각 32 bytes)
//   challenge_data (32 bytes, from WHOAREYOU)
//
// Step 1: ECDH Shared Secret
//   shared = ECDH(ephemeral_priv, peer_pubkey)
//   → 33-byte compressed point
//
// Step 2: HKDF Key Derivation
//   HKDF(
//     salt: challenge_data,
//     ikm: shared,
//     info: "discovery v5 key agreement"
//           || initiator_node_id
//           || recipient_node_id,
//     length: 32 bytes (= 16 + 16)
//   )
//
//   → split:
//     initiator_key (16B): A가 B에게 쓸 때 사용
//     recipient_key (16B): B가 A에게 쓸 때 사용
//
// Step 3: Session 저장
//   cache[(peer_id, addr)] = {
//     write_key: initiator_key 또는 recipient_key,
//     read_key: 반대 방향
//   }

// AES-128-GCM 암호화:
//
// Encryption:
//   nonce = 12 bytes (random or counter)
//   aad = packet header (96 bytes)
//   ciphertext, tag = AES_GCM_Encrypt(
//     key, nonce, plaintext, aad
//   )
//
// Packet format:
//   [header (96B)][nonce (12B)][ciphertext][tag (16B)]
//
// Header includes:
//   - protocol id
//   - version
//   - flag
//   - nonce
//   - authdata-size
//   - authdata

// Session Expiry:
//   - LRU 캐시 (1024 sessions)
//   - 용량 초과 시 가장 오래된 것 제거
//   - 만료된 세션은 재협상

// Rekeying:
//   - discv5는 명시적 rekey 없음
//   - 세션 만료 시 자연스럽게 재협상
//   - nonce 64-bit counter 충분

// 보안 속성:
//   ✓ Confidentiality (AES-GCM)
//   ✓ Integrity (GCM auth tag)
//   ✓ Directional keys (replay 방어)
//   ✓ Forward secrecy (ephemeral keys)
//   ✓ Identity authentication (handshake 검증)

// discv4 vs discv5:
//   discv4: 평문 통신 (signature만)
//   discv5: 완전 암호화 (session keys)`}
        </pre>
      </div>
    </section>
  );
}
