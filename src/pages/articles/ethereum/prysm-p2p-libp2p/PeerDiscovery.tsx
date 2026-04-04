import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PeerDiscovery({ onCodeRef }: Props) {
  return (
    <section id="peer-discovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Discv5 피어 탐색</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Discv5는 UDP 위에서 동작하는 피어 탐색 프로토콜이다.<br />
          각 노드는 <strong>ENR(Ethereum Node Record)</strong>에 자신의 정보를 담아 교환한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('discv5-init', codeRefs['discv5-init'])} />
          <span className="text-[10px] text-muted-foreground self-center">initDiscoveryV5()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">탐색 과정</h3>
        <ul>
          <li><strong>부트노드 접속</strong> — 하드코딩된 부트노드 ENR로 초기 연결</li>
          <li><strong>FINDNODE</strong> — 타겟 ID에 가까운 노드를 재귀 질의</li>
          <li><strong>ENR 필터링</strong> — eth2 서브넷 비트필드로 원하는 서브넷 피어 선별</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Discv5 vs Kademlia</strong> — Discv5는 Kademlia와 유사하지만<br />
          TOPIC 광고 기능이 추가되어 특정 서브넷 피어를 효율적으로 탐색<br />
          CL의 64개 서브넷 구독 요구사항에 최적화된 설계
        </p>
      </div>
    </section>
  );
}
