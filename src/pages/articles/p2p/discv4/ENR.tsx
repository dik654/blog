import CodePanel from '@/components/ui/code-panel';

const RECORD_STRUCT = `type Record struct {
    seq       uint64   // 시퀀스 번호: 변경마다 증가
    signature []byte   // ID scheme에 따른 서명
    raw       []byte   // RLP 인코딩된 전체 레코드
    pairs     []pair   // 키 기준 정렬된 k/v 쌍
}

type pair struct {
    k string           // 키: "id", "secp256k1", "ip", "tcp", "udp" 등
    v rlp.RawValue     // RLP 인코딩된 값
}

const SizeLimit = 300  // 최대 300바이트 (EIP-778)`;

const SET_INVALIDATE = `func (r *Record) Set(e Entry) {
    blob, err := rlp.EncodeToBytes(e)
    if err != nil { panic(...) }
    r.invalidate()
    // 이진 탐색으로 정렬 위치를 찾아 삽입/갱신
    pairs := make([]pair, len(r.pairs))
    copy(pairs, r.pairs)
    i := sort.Search(len(pairs), func(i int) bool { return pairs[i].k >= e.ENRKey() })
    // ... 삽입 또는 갱신
}

func (r *Record) invalidate() {
    if r.signature != nil { r.seq++ }  // 서명된 상태에서 수정하면 seq 자동 증가
    r.signature = nil
    r.raw = nil
}`;

const LOCAL_NODE = `type LocalNode struct {
    cur    atomic.Pointer[Node]   // 최신 서명된 노드 (캐시)
    id     ID
    key    *ecdsa.PrivateKey
    db     *DB
    seq    uint64
    entries map[string]enr.Entry  // 로컬 ENR 엔트리
    endpoint4 lnEndpoint          // IPv4 endpoint predictor
    endpoint6 lnEndpoint          // IPv6 endpoint predictor
}

func (ln *LocalNode) UDPEndpointStatement(fromaddr, endpoint netip.AddrPort) {
    ln.endpointForIP(endpoint.Addr()).track.AddStatement(fromaddr.Addr(), endpoint)
    ln.updateEndpoints()  // IP tracker 예측값으로 ENR 갱신
}`;

export default function ENR() {
  return (
    <section id="enr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ENR (Ethereum Node Record)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          EIP-778이 정의한 자기 인증(self-certified) 노드 레코드입니다. 노드가 자신의 정보를 서명하여 배포합니다.<br />
          최대 <strong>300바이트</strong>로 제한되며, 키-값 쌍은 키 기준 사전순 정렬을 보장합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Record 구조체</h3>
        <p>
          주요 키: <code>id</code>(identity scheme), <code>secp256k1</code>(공개키), <code>ip</code>, <code>tcp</code>, <code>udp</code>, <code>eth</code>(fork ID).
          RLP 인코딩 형태: <code>[sig, seq, k1, v1, k2, v2, ...]</code>.
        </p>
        <CodePanel title="enr.Record -- enr/enr.go" code={RECORD_STRUCT} startLine={86} annotations={[
          { lines: [87, 87], color: 'sky', note: '변경마다 단조 증가하는 시퀀스' },
          { lines: [90, 90], color: 'emerald', note: '키 기준 정렬 필수 (디코딩 시 검증)' },
          { lines: [98, 98], color: 'amber', note: 'UDP 패킷 크기 제한에 맞춘 상한' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">Set과 자동 seq 증가</h3>
        <p>
          <code>Set()</code>으로 엔트리를 수정하면 <code>invalidate()</code>가 호출됩니다.<br />
          이미 서명된 레코드라면 seq를 1 증가시키고 서명/raw를 nil로 초기화합니다.<br />
          다음에 <code>Node()</code>를 호출할 때 새로 서명됩니다.
        </p>
        <CodePanel title="Set & invalidate -- enr/enr.go" code={SET_INVALIDATE} startLine={150} annotations={[
          { lines: [153, 153], color: 'sky', note: '수정 시 서명 무효화' },
          { lines: [163, 163], color: 'emerald', note: '서명 상태에서만 seq 증가' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">LocalNode: IP 추적과 ENR 관리</h3>
        <p>
          <code>LocalNode</code>는 로컬 노드의 ENR을 관리합니다.<br />
          다른 노드로부터 받은 Pong의 <code>To</code> 필드를 <strong>IPTracker</strong>에 수집합니다.<br />
          충분한 진술(10개 이상)이 모이면 외부 IP를 예측하여 ENR에 반영합니다.<br />
          이를 통해 NAT 뒤에서도 올바른 외부 주소를 광고할 수 있습니다.
        </p>
        <CodePanel title="LocalNode -- enode/localnode.go" code={LOCAL_NODE} startLine={47} annotations={[
          { lines: [48, 48], color: 'sky', note: 'atomic.Pointer로 lock-free 읽기' },
          { lines: [55, 56], color: 'emerald', note: 'IPv4/IPv6 별도 endpoint predictor' },
          { lines: [61, 61], color: 'amber', note: 'Pong.To를 수집하여 외부 IP 예측' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">ENR 표준 키와 확장</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ENR Standard Keys (EIP-778)
//
// Identity:
//   "id": identity scheme ("v4")
//   "secp256k1": compressed public key (33 bytes)
//
// Endpoint:
//   "ip": IPv4 address (4 bytes)
//   "ip6": IPv6 address (16 bytes)
//   "tcp": TCP port
//   "tcp6": TCP port (IPv6)
//   "udp": UDP port (discovery)
//   "udp6": UDP port (IPv6)

// Ethereum Extension Keys:
//   "eth": fork information (EIP-2124)
//     [[fork_hash, fork_next]]
//
//   "attnets": attestation subnets (Eth2)
//     bitfield of subscribed subnets
//
//   "syncnets": sync committee subnets
//     bitfield
//
//   "eth2": Eth2 consensus info

// ENR 인코딩 예:
//   enr:-Iu4QGm...ABC  (base64url, 자기 참조)
//
//   Binary: RLP([sig, seq, k1, v1, k2, v2, ...])
//   "id": "v4"
//   "ip": 0x01020304 (1.2.3.4)
//   "secp256k1": 0x03abc...
//   "udp": 0x765f (30303)

// Signing Process (v4 scheme):
//   record_without_sig = RLP([seq, k1, v1, ...])
//   hash = keccak256(record_without_sig)
//   signature = ECDSA.sign(priv, hash)
//   signed_record = RLP([sig, seq, k1, v1, ...])

// Validation:
//   1. Decode RLP
//   2. Check "id" field
//   3. Extract pubkey from "secp256k1"
//   4. Verify signature over record
//   5. Check size < 300 bytes
//   6. Keys must be sorted

// Size limit (300 bytes):
//   UDP packet safety margin
//   일반적으로 ~150 bytes 실제 사용

// Distribution:
//   - DNS (EIP-1459): ENR tree
//   - Discovery protocol (PING/PONG으로 seq 교환)
//   - Request on demand (discv5 TALK)`}
        </pre>
      </div>
    </section>
  );
}
