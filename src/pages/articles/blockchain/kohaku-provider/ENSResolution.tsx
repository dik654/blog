import type { CodeRef } from '@/components/code/types';
import ENSResolutionViz from './viz/ENSResolutionViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ENSResolution({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="ens-resolution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ENS 경량 해석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ENS(Ethereum Name Service) — <code>vitalik.eth</code> → <code>0xd8dA..6045</code> 변환.
          <br />
          일반 지갑은 RPC 서버에 ENS 해석을 위임한다. 서버가 가짜 주소를 반환할 수 있다.
        </p>
        <p className="leading-7">
          Kohaku — Helios 경량 클라이언트로 ENS 레지스트리와 리졸버를 직접 조회한다.
          <br />
          모든 응답이 Merkle 증명으로 검증되므로 위변조가 불가능하다.
        </p>
        <p className="leading-7">
          namehash는 도메인 라벨을 <strong>오른쪽부터 재귀적으로</strong> keccak256 해싱한다.
          <br />
          <code>keccak256(keccak256(0x0 || keccak256("eth")) || keccak256("vitalik"))</code>.
        </p>
      </div>
      <div className="not-prose"><ENSResolutionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">ENS Architecture</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// ENS 2-layer system

// 1) Registry contract
// Address: 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
// Maps: node (namehash) → resolver address
//        + owner + TTL

// 2) Resolver contract (per name)
// Returns: ETH address, IPFS hash, other records
// Each name can have custom resolver

// Resolution flow
// 1) Hash domain name
node = namehash("vitalik.eth")

// 2) Lookup resolver
resolver = Registry.resolver(node)

// 3) Query resolver
address = Resolver.addr(node)

// Namehash algorithm
function namehash(name):
    if name == "":
        return 0x0000...0000 (32 zero bytes)

    labels = name.split(".")
    node = 0x0000...0000

    for label in reversed(labels):
        labelhash = keccak256(label)
        node = keccak256(node || labelhash)

    return node

// Example: "vitalik.eth"
// 1) labels = ["vitalik", "eth"]
// 2) Reversed: ["eth", "vitalik"]
// 3) node1 = keccak256(0x00...00 || keccak256("eth"))
// 4) node2 = keccak256(node1 || keccak256("vitalik"))
// 5) return node2`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Kohaku Verified ENS Resolution</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 일반 ENS 조회 (취약)
async function resolveENS(name) {
    // RPC에 위임 → 서버가 거짓말 가능
    return provider.resolveName(name);
}

// Kohaku 검증된 ENS 조회
async function resolveENSVerified(name) {
    const node = namehash(name);

    // 1) Registry.resolver(node)
    const resolverAddr = await provider.call({
        to: ENS_REGISTRY,
        data: encode("resolver(bytes32)", [node]),
    });

    // 2) Helios가 state proof 검증
    // - ENS_REGISTRY storage slot 증명
    // - node → resolver mapping 확인

    // 3) Resolver.addr(node)
    const address = await provider.call({
        to: resolverAddr,
        data: encode("addr(bytes32)", [node]),
    });

    // 4) Helios가 resolver storage proof 검증
    return address;
}

// 검증 보장
// ✓ Registry mapping 무결성
// ✓ Resolver storage 무결성
// ✓ State root는 header에서 Helios가 검증
// → 서버가 거짓말 못 함`}</pre>

      </div>
    </section>
  );
}
