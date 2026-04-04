import CodePanel from '@/components/ui/code-panel';
import GossipLayerViz from './viz/GossipLayerViz';
import {
  GOSSIP_DATA_CODE, GOSSIP_DATA_ANNOTATIONS,
  BROADCAST_CODE, BROADCAST_ANNOTATIONS,
  CACHE_CODE, CACHE_ANNOTATIONS,
} from './GossipProtocolData';

export default function GossipProtocol({ title }: { title?: string }) {
  return (
    <section id="gossip-protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '가십 프로토콜 상세'}</h2>
      <div className="not-prose mb-8"><GossipLayerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys 가십 프로토콜은 블록, 트랜잭션, 청크 등 6가지 데이터 유형을 네트워크에
          전파합니다. <strong>점진적 브로드캐스트</strong>(라운드당 최대 5개 피어)와
          <strong>TTL 캐시 기반 중복 제거</strong>로 효율적인 전파를 보장합니다.
        </p>

        <h3>가십 데이터 유형</h3>
        <CodePanel title="GossipData 열거형" code={GOSSIP_DATA_CODE}
          annotations={GOSSIP_DATA_ANNOTATIONS} />

        <h3>점진적 브로드캐스트</h3>
        <CodePanel title="라운드별 피어 선택 전파" code={BROADCAST_CODE}
          annotations={BROADCAST_ANNOTATIONS} />

        <h3>캐시 & 중복 제거</h3>
        <CodePanel title="GossipCache 구조 & 중복 검사" code={CACHE_CODE}
          annotations={CACHE_ANNOTATIONS} />
      </div>
    </section>
  );
}
