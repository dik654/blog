import CodePanel from '@/components/ui/code-panel';
import ClientSDKViz from './viz/ClientSDKViz';
import {
  setupCode, setupAnnotations,
  txCode, txAnnotations,
} from './ClientSDKData';

export default function ClientSDK({ title }: { title?: string }) {
  return (
    <section id="client-sdk" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '클라이언트 SDK'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys 클라이언트 SDK(<code>irys-api-client</code>)는 Rust로 작성된
          라이브러리로, 트랜잭션 생성, ECDSA 서명, 데이터 업로드,
          청크 관리 등 Irys 노드와의 상호작용을 제공합니다.
        </p>
      </div>

      <ClientSDKViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>SDK 설정 & 초기화</h3>
        <CodePanel title="클라이언트 + 서명자 설정" code={setupCode}
          annotations={setupAnnotations} />

        <h3>데이터 트랜잭션 워크플로우</h3>
        <CodePanel title="가격 조회 → 서명 → 전송" code={txCode}
          annotations={txAnnotations} />
      </div>
    </section>
  );
}
