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
        <div className="not-prose space-y-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">1) Registry Contract</p>
              <p className="text-xs text-muted-foreground mb-1"><code>0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e</code></p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>node (namehash) → resolver address</li>
                <li>+ owner + TTL</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">2) Resolver Contract (per name)</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>ETH address, IPFS hash, 기타 레코드 반환</li>
                <li>각 이름마다 커스텀 resolver 가능</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Resolution Flow</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1) <code>node = namehash("vitalik.eth")</code> — 도메인 해싱</li>
              <li>2) <code>resolver = Registry.resolver(node)</code> — 리졸버 조회</li>
              <li>3) <code>address = Resolver.addr(node)</code> — 주소 조회</li>
            </ol>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Namehash Algorithm</p>
            <p className="text-xs text-muted-foreground mb-2">빈 이름 → <code>0x0000...0000</code> (32 zero bytes), 그 외 라벨을 오른쪽부터 재귀 해싱</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1) <code>"vitalik.eth".split(".")</code> → <code>["vitalik", "eth"]</code></li>
              <li>2) Reversed: <code>["eth", "vitalik"]</code></li>
              <li>3) <code>node1 = keccak256(0x00...00 || keccak256("eth"))</code></li>
              <li>4) <code>node2 = keccak256(node1 || keccak256("vitalik"))</code></li>
              <li>5) return <code>node2</code></li>
            </ol>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Kohaku Verified ENS Resolution</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4 border-l-4 border-red-400">
              <p className="text-sm font-semibold mb-2">일반 ENS 조회 (취약)</p>
              <p className="text-sm text-muted-foreground"><code>provider.resolveName(name)</code></p>
              <p className="text-xs text-muted-foreground mt-1">RPC에 위임 → 서버가 거짓말 가능</p>
            </div>
            <div className="bg-muted rounded-lg p-4 border-l-4 border-green-400">
              <p className="text-sm font-semibold mb-2">Kohaku 검증된 조회</p>
              <p className="text-sm text-muted-foreground">Helios state proof로 모든 단계 검증</p>
              <p className="text-xs text-muted-foreground mt-1">서버가 거짓말 못 함</p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>resolveENSVerified(name)</code> 흐름</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1) <code>namehash(name)</code> → node</li>
              <li>2) <code>provider.call(ENS_REGISTRY, "resolver(bytes32)", [node])</code> → resolverAddr</li>
              <li>3) Helios가 ENS_REGISTRY storage slot 증명 검증 (node → resolver mapping)</li>
              <li>4) <code>provider.call(resolverAddr, "addr(bytes32)", [node])</code> → address</li>
              <li>5) Helios가 resolver storage proof 검증</li>
            </ol>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">Registry mapping 무결성</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">Resolver storage 무결성</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">State root는 Helios가 검증</span>
          </div>
        </div>

      </div>
    </section>
  );
}
