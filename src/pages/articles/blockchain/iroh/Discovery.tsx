import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import CodePanel from '@/components/ui/code-panel';
import DiscoveryViz from './viz/DiscoveryViz';
import { codeRefs } from './codeRefs';
import { DISCOVERY_TRAIT_CODE, DISCOVERY_TRAIT_ANNOTATIONS, PKARR_CODE, PKARR_ANNOTATIONS } from './DiscoveryData';

export default function Discovery({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="discovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">노드 발견 (Discovery)</h2>
      <div className="not-prose mb-8"><DiscoveryViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          iroh에서는 IP 주소 대신 <strong>NodeId</strong>(Ed25519 공개키)로 피어를 식별합니다.<br />
          Discovery 시스템은 NodeId → 연결 가능한 주소(IP:Port + relay URL)를 해석하는 역할을 합니다.
        </p>

        <h3>실제 소스 코드 탐색</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('address-lookup', codeRefs['address-lookup'])} />
          <span className="text-[10px] text-muted-foreground self-center">AddressLookup trait</span>
          <CodeViewButton onClick={() => onCodeRef('remote-map', codeRefs['remote-map'])} />
          <span className="text-[10px] text-muted-foreground self-center">RemoteMap</span>
        </div>

        <h3>Discovery 인터페이스</h3>
        <CodePanel title="Discovery 트레이트" code={DISCOVERY_TRAIT_CODE} annotations={DISCOVERY_TRAIT_ANNOTATIONS} />

        <h3>DNS Discovery</h3>
        <p>
          노드 정보를 <strong>DNS TXT 레코드</strong>로 저장합니다.<br />
          NodeId를 base32로 인코딩해 서브도메인으로 사용하고, TXT 레코드에
          주소·relay URL을 인코딩합니다.
        </p>
        <ul>
          <li>장점: 표준 DNS 캐싱, TTL 기반 업데이트, 방화벽 친화적</li>
          <li>단점: 중앙화된 DNS 서버 의존, 업데이트 지연(TTL)</li>
        </ul>

        <h3>mDNS Discovery (로컬 네트워크)</h3>
        <p>
          같은 LAN 내의 노드를 <strong>Bonjour/Zeroconf 프로토콜</strong>로 자동 발견합니다.<br />
          멀티캐스트 UDP(224.0.0.251:5353)로 브로드캐스트합니다.
        </p>

        <h3>Pkarr / BitTorrent DHT Discovery</h3>
        <p>
          <strong>Pkarr(Public Key Addressable Resource Records)</strong>는 NodeId를
          BitTorrent Mainline DHT의 키로 사용해 완전 분산 방식으로 노드 정보를 저장·조회합니다.
        </p>
        <CodePanel title="Pkarr DHT 게시자" code={PKARR_CODE} annotations={PKARR_ANNOTATIONS} />

        <h3>Discovery 조합 전략</h3>
        <p>
          세 방식은 동시에 동작하며, 결과는 스트림으로 순서 없이 도착합니다.<br />
          가장 먼저 도착한 주소로 연결을 시도하고, 이후 더 좋은 주소가 오면 경로를 업데이트합니다.
        </p>
      </div>
    </section>
  );
}
