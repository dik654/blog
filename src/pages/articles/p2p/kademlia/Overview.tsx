import CodePanel from '@/components/ui/code-panel';
import XORDistanceViz from './viz/XORDistanceViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & XOR 거리 메트릭'}</h2>
      <div className="not-prose mb-8"><XORDistanceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kademlia는 2002년 Maymounkov & Mazières가 발표한
          DHT(분산 해시 테이블) 프로토콜입니다.<br />
          Ethereum discv4/discv5, IPFS(libp2p-kad), BitTorrent DHT, iroh의 Pkarr DHT 등
          사실상 모든 주요 P2P 시스템의 핵심 노드 발견 레이어로 사용됩니다.
        </p>

        <h3>핵심 아이디어: XOR 거리</h3>
        <p>
          Kademlia의 핵심은 <strong>XOR 거리 메트릭</strong>입니다.<br />
          각 노드는 160비트(또는 256비트) Node ID를 가집니다.<br />
          두 노드 사이의 거리는 단순히 ID의 비트 XOR 값입니다.
        </p>
        <CodePanel title="XOR 거리 계산" code={`// 거리 계산 예시 (간략화)
fn xor_distance(a: &[u8; 32], b: &[u8; 32]) -> [u8; 32] {
    let mut d = [0u8; 32];
    for i in 0..32 {
        d[i] = a[i] ^ b[i];
    }
    d
}

// XOR 거리의 특성:
// 1. d(x, x) = 0               — 자기 자신과의 거리는 0
// 2. d(x, y) = d(y, x)         — 대칭적
// 3. d(x, z) ≤ d(x, y) + d(y, z) — 삼각 불등식 성립
// 4. d(x, y) == d(y, x)        — 방향이 없음 (중요!)`} annotations={[
          { lines: [2, 7], color: 'sky', note: '단순 XOR 연산으로 거리 계산' },
          { lines: [10, 14], color: 'emerald', note: '메트릭 공간 조건 충족' },
        ]} />

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('geth-xor-distance', codeRefs['geth-xor-distance'])} />
            <span className="text-[10px] text-muted-foreground self-center">enode/node.go — DistCmp, LogDist</span>
            <CodeViewButton onClick={() => onCodeRef('geth-node-struct', codeRefs['geth-node-struct'])} />
            <span className="text-[10px] text-muted-foreground self-center">Node 구조체</span>
          </div>
        )}

        <h3>왜 XOR인가?</h3>
        <p>
          XOR 거리는 중요한 수학적 특성을 가집니다.<br />
          같은 프리픽스를 공유하는 노드들이 가깝게 묶입니다.<br />
          거리 계산이 대칭적이며, 두 노드 사이에 정확히 하나의 "방향"만 존재합니다.<br />
          이 덕분에 라우팅이 매우 효율적입니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose my-6">
          {[
            { metric: 'O(log N)', desc: '조회 홉 수', note: 'N = 네트워크 크기' },
            { metric: 'O(log N)', desc: 'k-bucket 수', note: '각 버킷 k개 노드' },
            { metric: 'O(1)', desc: '거리 계산', note: '단순 XOR 연산' },
          ].map(({ metric, desc, note }) => (
            <div key={desc} className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center">
              <p className="text-2xl font-mono font-bold text-indigo-400">{metric}</p>
              <p className="text-sm font-medium mt-1">{desc}</p>
              <p className="text-xs text-foreground/50 mt-0.5">{note}</p>
            </div>
          ))}
        </div>

        <h3>사용 사례</h3>
        <ul>
          <li><strong>Ethereum discv4/discv5</strong> — P2P 네트워크에서 다른 이더리움 노드 발견</li>
          <li><strong>IPFS (libp2p-kad)</strong> — 콘텐츠 CID로 Provider 레코드 조회</li>
          <li><strong>BitTorrent DHT</strong> — 토렌트 infohash로 피어 목록 조회</li>
          <li><strong>iroh Pkarr DHT</strong> — PublicKey 기반 노드 주소 조회</li>
        </ul>
      </div>
    </section>
  );
}
