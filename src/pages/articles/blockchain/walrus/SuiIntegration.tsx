import CodePanel from '@/components/ui/code-panel';
import {
  SUI_OBJECTS_CODE, SUI_OBJECTS_ANNOTATIONS,
  EPOCH_CODE, EPOCH_ANNOTATIONS,
} from './SuiIntegrationData';

export default function SuiIntegration({ title }: { title?: string }) {
  return (
    <section id="sui-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Sui 블록체인 통합'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Walrus는 <strong>Sui 블록체인</strong>을 메타데이터 계층으로 사용합니다.<br />
          블롭 등록, WriteCertificate, 에포크 관리, 결제가 모두 Sui Move 오브젝트로
          관리되며, 데이터 가용성은 오프체인 저장 노드가 담당합니다.
        </p>

        <h3>Sui 온체인 오브젝트</h3>
        <CodePanel title="Blob 등록 & System 오브젝트" code={SUI_OBJECTS_CODE}
          annotations={SUI_OBJECTS_ANNOTATIONS} />

        <h3>에포크 관리</h3>
        <CodePanel title="위원회 선출 & 슬라이버 재할당" code={EPOCH_CODE}
          annotations={EPOCH_ANNOTATIONS} />
      </div>
    </section>
  );
}
