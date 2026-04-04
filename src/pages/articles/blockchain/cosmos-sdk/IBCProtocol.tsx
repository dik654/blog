import CodePanel from '@/components/ui/code-panel';
import { IBC_DETAIL_CODE, IBC_ANNOTATIONS } from './IBCProtocolData';
import IBCProtocolViz from './viz/IBCProtocolViz';

export default function IBCProtocol() {
  return (
    <section id="ibc-protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IBC 프로토콜 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>IBC(Inter-Blockchain Communication)</strong>는 TCP/IP와 유사한 3계층 구조입니다.
          <br />
          블록체인 간 안전한 통신을 제공합니다.
          <br />
          <strong>Light Client</strong>로 상대 체인 상태를 검증하고, <strong>릴레이어(Relayer)</strong>가 머클 증명과 함께 패킷을 중계합니다.
        </p>
      </div>

      <IBCProtocolViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>IBC 3계층 & 패킷 생명주기</h3>
        <CodePanel title="IBC 패킷 생명주기" code={IBC_DETAIL_CODE} annotations={IBC_ANNOTATIONS} />
      </div>
    </section>
  );
}
